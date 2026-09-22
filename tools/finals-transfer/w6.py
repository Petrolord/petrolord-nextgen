#!/usr/bin/env python3
"""W6 (D7, the one-third rule): transfer items in the finals of seven courses.

Seven courses had finals that mostly restate their module questions: sim,
fluid, rockphysics, reservoircalc, geomech, wellcorrelation and corrosion.
The owner approved D7 on 2026-09-21 (docs/graded-field-audit/FOLLOW-ON-
PROGRAMME.md section 5): in every 42-question final, 14 questions become
TRANSFER items on a case no module works. The other 28 may stay as reprise.

A course's W6 source is tools/finals-transfer/<course>/:

  case.mjs     works the transfer case through the VENDORED engines and prints
               the digest as JSON. Every number a W6 item prints comes from it.
  digest.json  the committed output of case.mjs. `check` re-runs case.mjs and
               refuses if the output differs, so no number is hand-typed.
  items.json   {"course", "migration", "case": {"name", "markers", "summary"},
                "literals_ok": {"<token>": "why a figure outside the digest is
                allowed"},
                "tiers": {"beginner": [ITEM x 14], "intermediate": [...],
                          "advanced": [...]}}
               ITEM = {"ord": slot, "replaces": md5 of the published row,
                       "prompt", "correct", "distractors": [3],
                       "explanation", "rests_on": [digest keys] or
                       "lesson": "<tier>/<module>/<lesson>" (a conceptual
                       item), "why_wrong": [3 one-line reasons]}
               Optional "explanation_fixes": [{"tier", "module_key", "ord",
                 "old", "new", "reason"}]: an explanation a lesson or engine
                 check shows is wrong, corrected in place on a served row W6
                 does not replace. Prompt, options and answer_index stay, so
                 no answer grades differently. `pin` fills "replaces" (the
                 row's content hash) and "stem" (the hash without the
                 explanation).
               Text may carry {{key}}, replaced by digest["print"][key].
               The correct option is placed at the replaced row's own
               answer_index, so a final's key distribution never moves.

COMMANDS
  w6.py check [--course C]                 STATIC, no database (runs in CI):
      case.mjs reproduces digest.json; items render; every numeric token is
      printed by the digest (or listed in literals_ok); text rules (no em or en
      dash, no "X, not Y", no internal-source wording, no positional wording);
      per item: four distinct options, no distractor ties the correct option in
      length, the correct option is not the length outlier; per tier: exactly
      14 items on distinct slots, their length ranks in the band; and the
      committed migration is byte-identical to a regeneration.
  w6.py validate <course> [--container C]  against a LOCAL scratch replay:
      everything in check, plus each replaced row still carries its published
      hash, the final after replacement stays in the answer-length band and
      the key band, no item literal leaks a graded capstone answer of the
      course (ten tolerances, or equal at the literal's own significant
      figures), the case markers appear nowhere the course already teaches or
      grades, and no item is a near duplicate of any question the course
      serves.
  w6.py sql <course> [--check]              write (or compare) migrations/<file>
  w6.py slots <course> [--container C]      suggest the 14 slots per final: the
      questions that restate a module question most closely
  w6.py gate [--container C] [--courses a,b] [--allow-unbuilt]
      THE NEAR-DUPLICATE GATE on a served state (after the apply): every final
      of every listed course holds its 14 transfer items exactly as rendered,
      none of them near any module question, other final question or capstone
      of its course, and every bank in band. On the state before W6 it is RED.
      Every run plants two defects in a copy of the real rows (a module
      question copied over a transfer item, and the same copy lightly
      reworded) and refuses unless both go red.
  w6.py --selftest                          synthetic negative controls

Exit codes: 0 pass, 1 a gate failed, 2 REFUSED (the gate could not do its job).
"""
import argparse, difflib, glob, json, math, os, re, subprocess, sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(REPO, 'tools', 'answer-length-audit'))
import audit as lenaudit  # noqa: E402  (RANK_ANY_CAP 0.40, RANK_ANY_FLOOR 0.12)

COURSES = ('sim', 'fluid', 'rockphysics', 'reservoircalc', 'geomech', 'wellcorrelation', 'corrosion')
TIERS = ('beginner', 'intermediate', 'advanced')
FINAL_N = 42
N_TRANSFER = 14
MIGRATION_PREFIX = '20261029_w6_'
DEFAULT_CONTAINER = 'w6-scratch'

# near-duplicate heuristic (the B4 follow-on editors' "near pX kY" flag, made a
# gate). p compares prompts, k the keyed options, each as the larger of a
# normalised character ratio and a token Jaccard. A pair is NEAR when both are
# at least NEAR_P and NEAR_K (the smallest pair the B4 editors confirmed as a
# duplicate scored p0.60 k0.61), or when the joined prompt-and-key token
# Jaccard reaches NEAR_JOINED (dupaxes' joined axis).
NEAR_P = 0.60
NEAR_K = 0.60
NEAR_JOINED = 0.45
# two NEW items on the same case are twins only above this on prompt AND key
TWIN = 0.85
# the correct option may sit at rank 0 or 3 but not stand apart: its length
# must lie within the distractors' range widened by this fraction each side
OUTLIER_SLACK = 0.15
# key band on a whole final (bankkit): each answer_index holds 15 to 35 pct
KEY_FLOOR, KEY_CAP = 0.15, 0.35
LEAK_MARGIN = 10
LEAK_SCALES = (1.0, 1e3, 1e-3, 1e6, 1e-6, 100.0, 0.01)
MIN_SIG = 4

HASH_SQL = "md5(prompt || chr(31) || options::text || chr(31) || answer_index::text || chr(31) || coalesce(explanation, ''))"
STEM_SQL = "md5(prompt || chr(31) || options::text || chr(31) || answer_index::text)"
NUM = re.compile(r'(?<![A-Za-z0-9_])-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')
# a digit glued to letters (CO2, H2S, kg/m3, P1) is part of a name or a unit, not a figure
TOKNUM = re.compile(r'(?<![A-Za-z])\d+(?:[.,]\d+)*')
DASH = re.compile('[–—]')
CONTRAST = re.compile(r',\s*not\b', re.I)
INTERNAL = [re.compile(r'digest', re.I), re.compile(r'\bSECTIONS? \d'), re.compile(r'\bgenerator\b', re.I),
            re.compile(r'\bcase\.mjs\b'), re.compile(r'\bW6\b')]
POSITIONAL = re.compile(r'\b(all of the above|none of the above|both a and b|option [abcd]\b|the (first|second|third|fourth|last) option)\b', re.I)
PLACEHOLDER = re.compile(r'\{\{([A-Za-z0-9_.]+)\}\}')


class Refused(Exception):
    pass


# ------------------------------------------------------------------ helpers
def q(s):
    return "'" + s.replace("'", "''") + "'"


def norm(s):
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9. ]', ' ', s.lower())).strip()


def tok(s):
    return set(re.findall(r'[a-z0-9.]+', s.lower()))


def jac(a, b):
    ta, tb = tok(a), tok(b)
    return len(ta & tb) / len(ta | tb) if ta and tb else 0.0


def ratio(a, b):
    na, nb = norm(a), norm(b)
    if not na or not nb:
        return 0.0
    sm = difflib.SequenceMatcher(None, na, nb, autojunk=False)
    if sm.real_quick_ratio() < 0.5 or sm.quick_ratio() < 0.5:
        return sm.quick_ratio() if sm.real_quick_ratio() >= 0.5 else sm.real_quick_ratio()
    return sm.ratio()


def sim(a, b):
    return max(ratio(a, b), jac(a, b))


def near(a, b):
    """-> (is_near, p, k, joined) for two questions {prompt, key}."""
    p = sim(a['prompt'], b['prompt'])
    joined = jac(a['prompt'] + ' ' + a['key'], b['prompt'] + ' ' + b['key'])
    if p < NEAR_P and joined < NEAR_JOINED:
        return False, p, 0.0, joined
    k = sim(a['key'], b['key'])
    return (p >= NEAR_P and k >= NEAR_K) or joined >= NEAR_JOINED, p, k, joined


def key_of(r):
    return r['options'][r['answer_index']]


def label(r):
    return f"{r['app_slug']} {r['tier']} {r['scope']} {r.get('module_key') or '-'} ord {r['ord']}"


def rank_of(opts, a):
    return lenaudit.kit_rank(opts, a)


def sig_digits(t):
    t = t.lstrip('+-').lower().split('e')[0]
    if '.' in t:
        whole, frac = t.split('.', 1)
        if whole.strip('0'):
            return len((whole.lstrip('0') + frac).rstrip('0')) if frac.strip('0') else len(whole.lstrip('0') + frac)
        return len(frac.lstrip('0'))
    return len(t.lstrip('0').rstrip('0')) or (1 if t.strip('0') else 0)


def round_sig(x, n):
    if x == 0:
        return 0.0
    return round(x, -int(math.floor(math.log10(abs(x)))) + (n - 1))


# ------------------------------------------------------------------ sources
def course_dir(c):
    return os.path.join(HERE, c)


def built_courses():
    return [c for c in COURSES if os.path.exists(os.path.join(course_dir(c), 'items.json'))]


def load_items(c):
    p = os.path.join(course_dir(c), 'items.json')
    if not os.path.exists(p):
        raise Refused(f'{c}: no {os.path.relpath(p, REPO)}')
    it = json.load(open(p, encoding='utf-8'))
    if it.get('course') != c:
        raise Refused(f'{c}: items.json names course {it.get("course")!r}')
    if it.get('migration') != f'{MIGRATION_PREFIX}{c}.sql':
        raise Refused(f'{c}: items.json must name migration {MIGRATION_PREFIX}{c}.sql')
    return it


def run_case(c):
    """Run case.mjs through vite-node (the vendored engines, TS included) and
    return its JSON. Refuses on any failure: a digest nobody can reproduce is
    not a digest."""
    script = os.path.join(course_dir(c), 'case.mjs')
    if not os.path.exists(script):
        raise Refused(f'{c}: no case.mjs')
    vn = os.path.join(REPO, 'node_modules', '.bin', 'vite-node')
    if not os.path.exists(vn):
        raise Refused('node_modules/.bin/vite-node is missing (npm ci first)')
    res = subprocess.run([vn, '-c', os.path.join(REPO, 'vitest.config.js'), script],
                         capture_output=True, text=True, cwd=REPO, timeout=600)
    if res.returncode != 0:
        raise Refused(f'{c}: case.mjs failed: {res.stderr.strip()[-600:]}')
    out = res.stdout.strip()
    try:
        return json.loads(out[out.index('{'):])
    except ValueError as exc:
        raise Refused(f'{c}: case.mjs did not print JSON ({exc})')


def load_digest(c):
    p = os.path.join(course_dir(c), 'digest.json')
    if not os.path.exists(p):
        raise Refused(f'{c}: no digest.json (run: w6.py digest {c} --write)')
    d = json.load(open(p, encoding='utf-8'))
    if not isinstance(d.get('print'), dict) or not d['print']:
        raise Refused(f'{c}: digest.json has no "print" map')
    return d


def digest_numbers(d):
    """Numeric tokens the digest prints (every print string, every input)."""
    nums = set()
    def walk(v):
        if isinstance(v, str):
            nums.update(TOKNUM.findall(v))
        elif isinstance(v, (int, float)) and not isinstance(v, bool):
            nums.update(TOKNUM.findall(repr(v)))
        elif isinstance(v, dict):
            for x in v.values():
                walk(x)
        elif isinstance(v, list):
            for x in v:
                walk(x)
    walk(d.get('print', {}))
    walk(d.get('inputs', {}))
    return nums


def render_text(s, d, where, errs):
    def sub(m):
        k = m.group(1)
        if k not in d['print']:
            errs.append(f'{where}: placeholder {{{{{k}}}}} is not in digest.json "print"')
            return m.group(0)
        return str(d['print'][k])
    return PLACEHOLDER.sub(sub, s)


def render(c, items=None, digest=None):
    """-> ({tier: [item with rendered text]}, errs)."""
    items = items or load_items(c)
    d = digest or load_digest(c)
    errs = []
    out = {}
    for t in TIERS:
        lst = items.get('tiers', {}).get(t)
        if not isinstance(lst, list):
            errs.append(f'{c} {t}: no item list')
            continue
        rend = []
        for i, it in enumerate(lst):
            where = f'{c} {t} ord {it.get("ord")}'
            ds = it.get('distractors') or []
            r = dict(it)
            r['prompt'] = render_text(it.get('prompt', ''), d, where + ' prompt', errs)
            r['correct'] = render_text(it.get('correct', ''), d, where + ' correct', errs)
            r['distractors'] = [render_text(x, d, f'{where} distractor {j}', errs) for j, x in enumerate(ds)]
            r['explanation'] = render_text(it.get('explanation', ''), d, where + ' explanation', errs)
            rend.append(r)
        out[t] = rend
    return out, errs


def assemble(it, answer_index):
    opts = list(it['distractors'])
    opts.insert(answer_index, it['correct'])
    return opts


# ------------------------------------------------------------------ static rules
def text_rules(where, s, errs):
    if not s or s != s.strip() or '  ' in s:
        errs.append(f'{where}: empty or stray whitespace')
    if DASH.search(s):
        errs.append(f'{where}: em or en dash')
    if CONTRAST.search(s):
        errs.append(f'{where}: an "X, not Y" contrastive')
    if any(p.search(s) for p in INTERNAL):
        errs.append(f'{where}: internal-source wording')
    if POSITIONAL.search(s):
        errs.append(f'{where}: positional wording')
    if PLACEHOLDER.search(s):
        errs.append(f'{where}: unrendered placeholder')


def outlier(opts, a):
    ds = [len(o) for j, o in enumerate(opts) if j != a]
    lc = len(opts[a])
    return lc > max(ds) * (1 + OUTLIER_SLACK) or lc < min(ds) * (1 - OUTLIER_SLACK)


def static_item_rules(c, t, it, d, allowed_nums, errs, answer_index=None):
    where = f'{c} {t} ord {it.get("ord")}'
    for f in ('prompt', 'correct', 'explanation'):
        text_rules(f'{where} {f}', it.get(f, ''), errs)
    ds = it.get('distractors') or []
    if len(ds) != 3:
        errs.append(f'{where}: needs exactly three distractors')
        return
    for j, x in enumerate(ds):
        text_rules(f'{where} distractor {j}', x, errs)
    why = it.get('why_wrong') or []
    if len(why) != 3 or not all(isinstance(w, str) and w.strip() for w in why):
        errs.append(f'{where}: why_wrong must give a one-line reason for each distractor')
    for j, w in enumerate(why):
        if isinstance(w, str) and PLACEHOLDER.search(w):
            errs.append(f'{where}: why_wrong {j} carries a placeholder (it is never rendered)')
    rests = it.get('rests_on') or []
    if not rests and not it.get('lesson'):
        errs.append(f'{where}: the key rests on nothing (rests_on digest keys or a lesson pointer)')
    for k in rests:
        if k not in d.get('values', {}) and k not in d['print']:
            errs.append(f'{where}: rests_on {k} is not a digest key')
    if it.get('lesson') and not glob.glob(os.path.join(REPO, 'src', 'content', 'courses', c, it['lesson'] + '*')):
        errs.append(f'{where}: lesson {it["lesson"]} does not exist under src/content/courses/{c}')
    if not isinstance(it.get('ord'), int) or not 1 <= it['ord'] <= FINAL_N:
        errs.append(f'{where}: ord must be a final slot 1..{FINAL_N}')
    if not re.fullmatch(r'[0-9a-f]{32}', str(it.get('replaces', ''))):
        errs.append(f'{where}: replaces must be the published row md5')
    opts = [it['correct']] + list(ds)
    if len(set(opts)) != 4:
        errs.append(f'{where}: duplicate option text')
    if any(len(x) == len(it['correct']) for x in ds):
        errs.append(f'{where}: a distractor ties the correct option in length')
    if outlier(opts, 0):
        errs.append(f'{where}: the correct option is the length outlier '
                    f'({len(it["correct"])} against distractors {sorted(len(x) for x in ds)})')
    for f, s in [('prompt', it['prompt']), ('correct', it['correct']), ('explanation', it['explanation'])] + \
            [(f'distractor {j}', x) for j, x in enumerate(ds)]:
        extra = set(TOKNUM.findall(s)) - allowed_nums
        if extra:
            errs.append(f'{where} {f}: figure(s) {sorted(extra)} are printed by neither the engine digest nor literals_ok')


def static_check(c, quiet=False):
    """Everything that needs no database. -> errs"""
    errs = []
    items = load_items(c)
    d = load_digest(c)
    fresh = run_case(c)
    if fresh != d:
        errs.append(f'{c}: case.mjs no longer reproduces digest.json (engine or case changed; '
                    f'regenerate with `w6.py digest {c} --write` and re-check every item)')
    case = items.get('case') or {}
    if not case.get('name') or not case.get('markers'):
        errs.append(f'{c}: items.json case needs a name and markers')
    lit = items.get('literals_ok') or {}
    for k, why in lit.items():
        if not why:
            errs.append(f'{c}: literals_ok {k} has no reason')
    allowed = digest_numbers(d) | set(lit)
    rend, rerrs = render(c, items, d)
    errs += rerrs
    for t in TIERS:
        lst = rend.get(t, [])
        if len(lst) != N_TRANSFER:
            errs.append(f'{c} {t}: {len(lst)} items, the rule is {N_TRANSFER}')
        ords = [x.get('ord') for x in lst]
        if len(set(ords)) != len(ords):
            errs.append(f'{c} {t}: two items claim one slot')
        for it in lst:
            static_item_rules(c, t, it, d, allowed, errs)
            if case.get('name') and case['name'].lower() not in it['prompt'].lower():
                errs.append(f'{c} {t} ord {it.get("ord")}: the prompt does not name the case {case["name"]!r}')
        # length ranks of the 14 new items, placed at their answer_index, hold the band too
        ai = [x.get('answer_index') for x in lst]
        if None not in ai and lst:
            ranks = Counter(rank_of(assemble(x, x['answer_index']), x['answer_index']) for x in lst)
            for k in range(4):
                s = ranks[k] / len(lst)
                if s > lenaudit.RANK_ANY_CAP or s < lenaudit.RANK_ANY_FLOOR:
                    errs.append(f'{c} {t}: the new items put {ranks[k]} of {len(lst)} correct options at length rank {k} '
                                f'(band {lenaudit.RANK_ANY_FLOOR} to {lenaudit.RANK_ANY_CAP})')
        elif lst:
            errs.append(f'{c} {t}: items carry no answer_index (it is the replaced row\'s own; run `w6.py pin {c}`)')
    for fx in items.get('explanation_fixes') or []:
        where = f'{c} explanation fix {fx.get("tier")} {fx.get("module_key") or "final"} ord {fx.get("ord")}'
        text_rules(where, fx.get('new', ''), errs)
        if fx.get('tier') not in TIERS or not isinstance(fx.get('ord'), int) or not fx.get('reason') or not fx.get('old'):
            errs.append(f'{where}: needs tier, ord, old, new and a reason')
        if not re.fullmatch(r'[0-9a-f]{32}', str(fx.get('replaces', ''))) or not re.fullmatch(r'[0-9a-f]{32}', str(fx.get('stem', ''))):
            errs.append(f'{where}: replaces and stem must be pinned (run `w6.py pin {c}`)')
        extra = set(TOKNUM.findall(fx.get('new', ''))) - set(TOKNUM.findall(fx.get('old', ''))) - allowed
        if extra:
            errs.append(f'{where}: figure(s) {sorted(extra)} are printed by neither the old text nor the engine digest')
    # prompts unique across the course's new items
    seen = defaultdict(list)
    for t in TIERS:
        for it in rend.get(t, []):
            seen[norm(it['prompt'])].append(f'{t} ord {it["ord"]}')
    for p, where in seen.items():
        if len(where) > 1:
            errs.append(f'{c}: one prompt used twice ({", ".join(where)})')
    # the committed migration is exactly what this source generates
    mig = os.path.join(REPO, 'migrations', items['migration'])
    if not rerrs and all(len(rend.get(t, [])) == N_TRANSFER for t in TIERS):
        want = sql_text(c, items, rend)
        if not os.path.exists(mig):
            errs.append(f'{c}: {items["migration"]} is not committed (run `w6.py sql {c}`)')
        elif open(mig, encoding='utf-8').read() != want:
            errs.append(f'{c}: migrations/{items["migration"]} differs from what items.json generates')
    if not quiet:
        for e in errs:
            print('  ERROR', e)
    return errs


# ------------------------------------------------------------------ database
def psql_json(container, sql):
    res = subprocess.run(['docker', 'exec', container, 'psql', '-U', 'postgres', '-tAc', sql],
                         capture_output=True, text=True)
    if res.returncode != 0:
        raise Refused(f'psql on {container} failed: {res.stderr.strip()[:300]}')
    return json.loads(res.stdout)


def served(container, courses, active_only=True):
    lst = ','.join(q(c) for c in sorted(courses))
    sql = ("select coalesce(json_agg(json_build_object('app_slug',app_slug,'tier',tier,'scope',scope,"
           "'module_key',module_key,'ord',ord,'prompt',prompt,'options',options,'answer_index',answer_index,"
           f"'explanation',explanation,'active',active,'h',{HASH_SQL}) order by app_slug,tier,scope,module_key,ord),'[]') "
           f"from academy_quiz_questions where app_slug in ({lst})" + (' and active' if active_only else ''))
    return psql_json(container, sql)


def capstones(container, courses):
    lst = ','.join(q(c) for c in sorted(courses))
    return psql_json(container, "select coalesce(json_agg(json_build_object('app_slug',app_slug,'tier',tier,"
                                "'prompt',prompt,'dataset',dataset,'fields',fields)),'[]') from academy_capstones "
                                f"where app_slug in ({lst})")


def leak_hits(text, fields):
    hits = []
    for tokn in NUM.findall(text):
        try:
            v = float(tokn)
        except ValueError:
            continue
        sd = sig_digits(tokn)
        for f in fields:
            exp, tol = f.get('expected'), f.get('tol') or 0
            if not isinstance(exp, (int, float)) or isinstance(exp, bool):
                continue
            for s in LEAK_SCALES:
                ev = exp * s
                if abs(v - ev) <= LEAK_MARGIN * abs(tol) * s and (abs(ev) >= 1e-12 or abs(v) < 1e-12):
                    if not (abs(v) == float(int(abs(v))) and abs(v) < 20 and sd < MIN_SIG):
                        hits.append((tokn, f['key'], exp, 'within ten tolerances'))
                elif sd >= MIN_SIG and ev != 0 and round_sig(ev, sd) == round_sig(v, sd):
                    hits.append((tokn, f['key'], exp, f'equal at {sd} significant figures'))
    return hits


def lesson_text(c):
    out = []
    for p in glob.glob(os.path.join(REPO, 'src', 'content', 'courses', c, '**', '*'), recursive=True):
        if os.path.isfile(p):
            out.append((os.path.relpath(p, REPO), open(p, encoding='utf-8', errors='ignore').read()))
    if not out:
        raise Refused(f'{c}: no lesson files found, so the case-marker check would compare nothing')
    return out


def marker_hits(c, markers, rows_other, caps):
    """Where a case marker already appears: lessons, served questions that W6
    does not write, capstones, and every migration naming the course (so a
    held re-case, W5 included, is checked too)."""
    hits = []
    pats = [(m, re.compile(r'(?<![A-Za-z0-9])' + re.escape(m) + r'(?![A-Za-z0-9])', re.I)) for m in markers]
    srcs = lesson_text(c)
    srcs += [(label(r), ' '.join([r['prompt'], *r['options'], r.get('explanation') or ''])) for r in rows_other]
    srcs += [(f'capstone {x["tier"]}', x['prompt'] + ' ' + (x.get('dataset') or '')) for x in caps]
    for p in glob.glob(os.path.join(REPO, 'migrations', f'*{c}*.sql')):
        if os.path.basename(p).startswith(MIGRATION_PREFIX):
            continue
        srcs.append((os.path.relpath(p, REPO), open(p, encoding='utf-8', errors='ignore').read()))
    for where, text in srcs:
        for m, pat in pats:
            if pat.search(text):
                hits.append(f'marker {m!r} already appears in {where}')
    return hits


def near_report(new_q, pool):
    """Closest pair from pool for one question dict {prompt, key}."""
    best = None
    for r in pool:
        n, p, k, j = near(new_q, r)
        score = max(min(p, k), j)
        if best is None or score > best[0]:
            best = (score, n, p, k, j, r)
        if n:
            return True, best
    return False, best


def validate(c, container, quiet=False):
    errs = static_check(c, quiet=True)
    items = load_items(c)
    rend, _ = render(c, items)
    rows = served(container, COURSES)
    if len(rows) < 1000:
        raise Refused(f'swept {len(rows)} rows on {container}; the seven courses hold about 2800')
    crows = [r for r in rows if r['app_slug'] == c]
    finals = {(r['tier'], r['ord']): r for r in crows if r['scope'] == 'final'}
    caps = capstones(container, [c])
    fields = [f for cp in caps for f in cp['fields']]
    if not fields:
        raise Refused(f'{c}: no capstone fields on {container}, so the leak check would compare nothing')
    new_rows, targets = [], set()
    for t in TIERS:
        for it in rend.get(t, []):
            k = (t, it['ord'])
            pub = finals.get(k)
            if pub is None:
                errs.append(f'{c} {t} final ord {it["ord"]}: no served row')
                continue
            if pub['h'] != it['replaces']:
                errs.append(f'{c} {t} final ord {it["ord"]}: the served row is not the published row the item replaces '
                            f'(hash {pub["h"]} against {it["replaces"]})')
            if it.get('answer_index') != pub['answer_index']:
                errs.append(f'{c} {t} final ord {it["ord"]}: answer_index {it.get("answer_index")} is not the '
                            f'replaced row\'s {pub["answer_index"]}')
            targets.add(k)
            opts = assemble(it, pub['answer_index'])
            new_rows.append(dict(app_slug=c, tier=t, scope='final', module_key=None, ord=it['ord'],
                                 prompt=it['prompt'], options=opts, answer_index=pub['answer_index'],
                                 explanation=it['explanation']))
            for h in leak_hits(' '.join([it['prompt'], *opts, it['explanation']]), fields):
                errs.append(f'{c} {t} ord {it["ord"]}: literal {h[0]} leaks capstone field {h[1]} ({h[2]}), {h[3]}')
    for fx in items.get('explanation_fixes') or []:
        r = next((x for x in crows if x['tier'] == fx.get('tier') and x['ord'] == fx.get('ord')
                  and (x.get('module_key') or None) == (fx.get('module_key') or None)), None)
        where = f'{c} explanation fix {fx.get("tier")} {fx.get("module_key") or "final"} ord {fx.get("ord")}'
        if r is None:
            errs.append(f'{where}: no served row')
        elif r['h'] != fx.get('replaces') or (r['explanation'] or '') != fx.get('old'):
            errs.append(f'{where}: the served row is not the published row the fix names')
        elif r['scope'] == 'final' and (r['tier'], r['ord']) in targets:
            errs.append(f'{where}: that slot is replaced by a transfer item; fix nothing there')
    # post-replacement banks: length band and key band
    post = [r for r in crows if not (r['scope'] == 'final' and (r['tier'], r['ord']) in targets)] + new_rows
    for b in lenaudit.audit(post):
        if not b['pass']:
            errs.append(f"{c} {b['tier']} {b['scope']} {b['module_key'] or '-'}: out of the length band ({b['fails']})")
    for t in TIERS:
        fin = [r for r in post if r['tier'] == t and r['scope'] == 'final']
        if len(fin) != FINAL_N:
            errs.append(f'{c} {t}: the final would hold {len(fin)} questions')
        cnt = Counter(r['answer_index'] for r in fin)
        for k in range(4):
            s = cnt[k] / max(1, len(fin))
            if s < KEY_FLOOR or s > KEY_CAP:
                errs.append(f'{c} {t} final: answer_index {k} holds {s:.2f} of the keys')
    # no new prompt repeats any other prompt the course serves
    seen = defaultdict(list)
    for r in post:
        seen[norm(r['prompt'])].append(r)
    for r in new_rows:
        dup = [x for x in seen[norm(r['prompt'])] if x is not r]
        if dup:
            errs.append(f'{label(r)}: its prompt repeats {label(dup[0])}')
    # case markers and near duplicates
    other = [r for r in crows if not (r['scope'] == 'final' and (r['tier'], r['ord']) in targets)]
    errs += [f'{c}: {h}' for h in marker_hits(c, (items.get('case') or {}).get('markers') or [], other, caps)]
    pool = [dict(prompt=r['prompt'], key=key_of(r), where=label(r)) for r in other]
    pool += [dict(prompt=cp['prompt'], key='', where=f'{c} capstone {cp["tier"]}') for cp in caps]
    newq = [dict(prompt=r['prompt'], key=key_of(r), where=label(r)) for r in new_rows]
    for i, nq in enumerate(newq):
        is_near, best = near_report(nq, pool)
        if is_near:
            b = best
            errs.append(f'{nq["where"]}: near duplicate of {b[5]["where"]} (p{b[2]:.2f} k{b[3]:.2f} joined {b[4]:.2f})')
        # two items on the one case may share a frame ("at 2400 m, what is ..."); they
        # are twins only when prompt and key both match closely
        for other in newq[i + 1:]:
            p, k = sim(nq['prompt'], other['prompt']), sim(nq['key'], other['key'])
            if p >= TWIN and k >= TWIN:
                errs.append(f'{nq["where"]}: a twin of {other["where"]} (p{p:.2f} k{k:.2f})')
    if not quiet:
        for e in errs:
            print('  ERROR', e)
    print(f'{c}: {sum(len(v) for v in rend.values())} items over {len(TIERS)} finals; errors {len(errs)}')
    return errs


# ------------------------------------------------------------------ SQL
def sql_text(c, items, rend):
    tag = f'W6 {c}'
    lines = [
        '-- ==========================================================================',
        f'-- W6 (D7, one-third rule): {c} finals, 14 transfer items per tier on the',
        f'-- {items["case"]["name"]} case, which no module and no capstone of this course works.',
        '--',
        f'-- Source: tools/finals-transfer/{c}/items.json and digest.json (every number',
        f'-- comes from case.mjs through the vendored engines); generated by',
        f'-- tools/finals-transfer/w6.py sql {c}. Never edit by hand: `w6.py check`',
        '-- refuses a file that differs from its regeneration.',
        '--',
        '-- REPLACEMENT. Each slot (tier, final, ord) holds ONE active row. When that row',
        '-- carries its PUBLISHED content hash, md5(prompt | options | answer_index |',
        '-- explanation), it is RETIRED (active = false, text untouched) and the W6',
        '-- question is inserted at the same slot. A retired row keeps its id, so every',
        '-- stored attempt, open or submitted, still grades and reviews against the',
        '-- question it was served. Stored scores are never recomputed.',
        '-- When the active row already IS the W6 question and the published row sits',
        '-- retired beside it, the slot is left alone. ANYTHING ELSE RAISES and the',
        '-- transaction rolls back (drift). Each final ends at 42 active rows, the',
        '-- course at its asserted active count. SAFE TO RE-RUN. No capstone is touched.',
        '-- ==========================================================================',
        '',
        'do $$',
        'declare',
        '  v_n        integer;',
        '  v_pub      integer;',
        '  v_new      integer;',
        '  v_written  integer := 0;',
        '  v_total    integer;',
        'begin',
    ]
    for t in TIERS:
        lines.append(f'  -- {c} / {t}')
        for it in sorted(rend[t], key=lambda x: x['ord']):
            opts = assemble(it, it['answer_index'])
            where = f"app_slug = {q(c)} and tier = {q(t)} and scope = 'final' and module_key is null and ord = {it['ord']}"
            newc = (f"prompt = {q(it['prompt'])} and options = {q(json.dumps(opts, ensure_ascii=False))}::jsonb"
                    f" and answer_index = {it['answer_index']} and explanation = {q(it['explanation'])}")
            lab = f'{t} final ord {it["ord"]}'
            lines += [
                '',
                f'  -- {lab}: replaces {it["replaces"]}',
                f"  select count(*) filter (where active), count(*) filter (where active and {HASH_SQL} = '{it['replaces']}'),",
                f'         count(*) filter (where active and {newc})',
                '    into v_n, v_pub, v_new',
                f'    from public.academy_quiz_questions where {where};',
                f"  if v_n <> 1 then raise exception '{tag} refused: {lab} holds % active rows, expected 1', v_n; end if;",
                '  if v_pub = 1 then',
                f"    update public.academy_quiz_questions set active = false where {where} and active and {HASH_SQL} = '{it['replaces']}';",
                '    insert into public.academy_quiz_questions (app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation, active)',
                f"    values ({q(c)}, {q(t)}, 'final', null, {it['ord']}, {q(it['prompt'])},",
                f"            {q(json.dumps(opts, ensure_ascii=False))}::jsonb, {it['answer_index']}, {q(it['explanation'])}, true);",
                '    v_written := v_written + 1;',
                '  elsif v_new = 1 then',
                f"    if not exists (select 1 from public.academy_quiz_questions where {where} and not active and {HASH_SQL} = '{it['replaces']}') then",
                f"      raise exception '{tag} refused: {lab} carries the W6 question but its published row is not retired beside it';",
                '    end if;',
                '  else',
                f"    raise exception '{tag} refused: {lab} matches neither its published content hash nor its W6 form (drift)';",
                '  end if;',
            ]
    fixes = items.get('explanation_fixes') or []
    for fx in fixes:
        mk = f"module_key = {q(fx['module_key'])}" if fx.get('module_key') else 'module_key is null'
        scope = 'module' if fx.get('module_key') else 'final'
        where = f"app_slug = {q(c)} and tier = {q(fx['tier'])} and scope = '{scope}' and {mk} and ord = {fx['ord']} and active"
        lab = f"{fx['tier']} {fx.get('module_key') or 'final'} ord {fx['ord']}"
        lines += [
            '',
            f'  -- EXPLANATION FIX {lab}: {fx["reason"]}',
            f"  select count(*), count(*) filter (where {HASH_SQL} = '{fx['replaces']}'),",
            f"         count(*) filter (where {STEM_SQL} = '{fx['stem']}' and explanation = {q(fx['new'])})",
            '    into v_n, v_pub, v_new',
            f'    from public.academy_quiz_questions where {where};',
            f"  if v_n <> 1 then raise exception '{tag} refused: {lab} holds % active rows, expected 1', v_n; end if;",
            '  if v_pub = 1 then',
            f"    update public.academy_quiz_questions set explanation = {q(fx['new'])} where {where} and {HASH_SQL} = '{fx['replaces']}';",
            '    v_written := v_written + 1;',
            '  elsif v_new = 0 then',
            f"    raise exception '{tag} refused: {lab} matches neither its published content hash nor its corrected form (drift)';",
            '  end if;',
        ]
    lines.append('')
    for t in TIERS:
        lines += [
            f"  select count(*) into v_total from public.academy_quiz_questions where app_slug = {q(c)} and tier = {q(t)} and scope = 'final' and active;",
            f"  if v_total <> {FINAL_N} then raise exception '{tag} refused: {t} final holds % active questions, expected {FINAL_N}', v_total; end if;",
        ]
    lines += [
        f"  raise notice '{tag}: % of {N_TRANSFER * len(TIERS) + len(fixes)} slots written, the rest already carried the W6 question', v_written;",
        'end $$;',
        '',
    ]
    return '\n'.join(lines)


def write_sql(c, check=False):
    items = load_items(c)
    rend, errs = render(c, items)
    if errs:
        raise Refused('; '.join(errs[:5]))
    for t in TIERS:
        for it in rend[t]:
            if it.get('answer_index') is None:
                raise Refused(f'{c} {t} ord {it["ord"]}: no answer_index (run `w6.py pin {c}`)')
    txt = sql_text(c, items, rend)
    out = os.path.join(REPO, 'migrations', items['migration'])
    if check:
        same = os.path.exists(out) and open(out, encoding='utf-8').read() == txt
        print(f'{items["migration"]}: {"identical to its regeneration" if same else "DIFFERS from its regeneration"}')
        return same
    open(out, 'w', encoding='utf-8').write(txt)
    print(f'wrote migrations/{items["migration"]} ({N_TRANSFER * len(TIERS)} slots)')
    return True


# ------------------------------------------------------------------ slots / pin
def slot_scores(c, container):
    rows = served(container, [c])
    mods = [dict(prompt=r['prompt'], key=key_of(r), where=label(r)) for r in rows if r['scope'] == 'module']
    out = {}
    for t in TIERS:
        fin = [r for r in rows if r['scope'] == 'final' and r['tier'] == t]
        sc = []
        for r in fin:
            me = dict(prompt=r['prompt'], key=key_of(r))
            def score(m):
                return max(min(sim(me['prompt'], m['prompt']), sim(me['key'], m['key'])),
                           jac(me['prompt'] + ' ' + me['key'], m['prompt'] + ' ' + m['key']))
            best = max(mods, key=score)
            s = score(best)
            sc.append((s, r, best))
        out[t] = sc
    return out


def slots(c, container):
    for t, sc in slot_scores(c, container).items():
        sc.sort(key=lambda x: -x[0])
        print(f'== {c} {t}: final questions by closeness to a module question (top 20)')
        for s, r, b in sc[:20]:
            print(f"  ord {r['ord']:2d} a{r['answer_index']} h {r['h']} score {s:.2f}  ~ {b['where']}")
            print(f"      {r['prompt'][:110]}")


def pin(c, container):
    """Write each item's answer_index and replaces from the served row (only
    where replaces is empty or already equal), so the author never types them."""
    p = os.path.join(course_dir(c), 'items.json')
    items = json.load(open(p, encoding='utf-8'))
    rows = {(r['tier'], r['ord']): r for r in served(container, [c]) if r['scope'] == 'final'}
    n = 0
    for t in TIERS:
        for it in items['tiers'].get(t, []):
            r = rows.get((t, it['ord']))
            if r is None:
                raise Refused(f'{c} {t} ord {it["ord"]}: no served final row')
            if it.get('replaces') not in (None, '', r['h']):
                raise Refused(f'{c} {t} ord {it["ord"]}: replaces {it["replaces"]} but the served row is {r["h"]}; '
                              'refusing to re-pin over drift')
            it['replaces'] = r['h']
            it['answer_index'] = r['answer_index']
            n += 1
    if items.get('explanation_fixes'):
        allrows = psql_json(container, "select coalesce(json_agg(json_build_object('tier',tier,'module_key',module_key,"
                            f"'ord',ord,'h',{HASH_SQL},'stem',{STEM_SQL},'explanation',explanation)),'[]') "
                            f"from academy_quiz_questions where active and app_slug = {q(c)}")
        for fx in items['explanation_fixes']:
            r = next((x for x in allrows if x['tier'] == fx['tier'] and x['ord'] == fx['ord']
                      and (x['module_key'] or None) == (fx.get('module_key') or None)), None)
            if r is None or (r['explanation'] or '') != fx['old']:
                raise Refused(f'{c} explanation fix {fx["tier"]} {fx.get("module_key")} ord {fx["ord"]}: served row missing or its explanation is not "old"')
            if fx.get('replaces') not in (None, '', r['h']):
                raise Refused(f'{c} explanation fix {fx["tier"]} ord {fx["ord"]}: refusing to re-pin over drift')
            fx['replaces'], fx['stem'] = r['h'], r['stem']
            n += 1
    json.dump(items, open(p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    open(p, 'a').write('\n')
    print(f'pinned {n} items of {c} to the served rows on {container}')


# ------------------------------------------------------------------ the gate
def gate_eval(rows, caps, rendered, courses):
    """-> list of failures on a served state. rendered: {course: {tier: [items]}}"""
    fails = []
    for c in courses:
        crows = [r for r in rows if r['app_slug'] == c]
        if c not in rendered:
            fails.append(f'{c}: no W6 source, so no final can hold its transfer items')
            continue
        ccaps = [x for x in caps if x['app_slug'] == c]
        present = []
        for t in TIERS:
            fin = {r['ord']: r for r in crows if r['tier'] == t and r['scope'] == 'final'}
            if len(fin) != FINAL_N:
                fails.append(f'{c} {t}: the final serves {len(fin)} questions, expected {FINAL_N}')
            here = 0
            for it in rendered[c].get(t, []):
                r = fin.get(it['ord'])
                opts = assemble(it, it['answer_index'])
                if r and r['prompt'] == it['prompt'] and r['options'] == opts and \
                        r['answer_index'] == it['answer_index'] and (r['explanation'] or '') == it['explanation']:
                    present.append(r)
                    here += 1
            if here < N_TRANSFER:
                fails.append(f'{c} {t}: {here} of {N_TRANSFER} transfer items served')
        pid = {id(r) for r in present}
        pool = [dict(prompt=r['prompt'], key=key_of(r), where=label(r)) for r in crows if id(r) not in pid]
        pool += [dict(prompt=x['prompt'], key='', where=f'{c} capstone {x["tier"]}') for x in ccaps]
        newq = [dict(prompt=r['prompt'], key=key_of(r), where=label(r)) for r in present]
        for i, nq in enumerate(newq):
            is_near, best = near_report(nq, pool)
            if is_near:
                fails.append(f'{nq["where"]}: transfer item is a near duplicate of {best[5]["where"]} '
                             f'(p{best[2]:.2f} k{best[3]:.2f} joined {best[4]:.2f})')
            for other in newq[i + 1:]:
                p, k = sim(nq['prompt'], other['prompt']), sim(nq['key'], other['key'])
                if p >= TWIN and k >= TWIN:
                    fails.append(f'{nq["where"]}: transfer item is a twin of {other["where"]} (p{p:.2f} k{k:.2f})')
        for b in lenaudit.audit(crows):
            if not b['pass']:
                fails.append(f"{c} {b['tier']} {b['scope']} {b['module_key'] or '-'}: out of the length band ({b['fails']})")
    return fails


def gate(container, courses, allow_unbuilt=False):
    courses = list(courses)
    rows = served(container, courses)
    if len(rows) < 300 * len(courses):
        raise Refused(f'swept {len(rows)} rows for {len(courses)} courses on {container}; an empty or partial sweep is not a pass')
    caps = capstones(container, courses)
    rendered = {}
    for c in courses:
        if not os.path.exists(os.path.join(course_dir(c), 'items.json')):
            if allow_unbuilt:
                continue
            continue
        r, errs = render(c)
        if errs:
            raise Refused(f'{c}: items do not render: {errs[0]}')
        rendered[c] = r
    check_courses = [c for c in courses if c in rendered] if allow_unbuilt else courses
    if not check_courses:
        raise Refused('no course has a W6 source; the gate would check nothing')
    # NEGATIVE CONTROLS on a copy of the real rows, before the verdict
    c0 = next(c for c in check_courses if c in rendered)
    it0 = rendered[c0]['beginner'][0]
    mod = next(r for r in rows if r['app_slug'] == c0 and r['scope'] == 'module' and r['tier'] == 'beginner')
    def planted(prompt, key):
        """the real rows, with the transfer slot holding the control question in full"""
        x = dict(it0, prompt=prompt, correct=key)
        out = []
        for r in rows:
            if r['app_slug'] == c0 and r['tier'] == 'beginner' and r['scope'] == 'final' and r['ord'] == it0['ord']:
                r = dict(r, prompt=prompt, options=assemble(x, it0['answer_index']),
                         answer_index=it0['answer_index'], explanation=it0['explanation'])
            out.append(r)
        return out
    # the control items must also count as "served" so the near check (not the
    # presence check) is what turns red: render the planted text as the item
    def rend_with(prompt, key):
        rr = json.loads(json.dumps(rendered))
        x = rr[c0]['beginner'][0]
        x['prompt'] = prompt
        x['correct'] = key
        return rr
    reword = re.sub(r'\b(the|a|an)\b ', '', mod['prompt'], count=2).replace('?', ' here?')
    for name, (p, k) in {'a module question copied over a transfer item': (mod['prompt'], key_of(mod)),
                         'the same copy lightly reworded': (reword, key_of(mod))}.items():
        f = gate_eval(planted(p, k), caps, rend_with(p, k), [c0])
        if not any('near duplicate' in x and f' ord {it0["ord"]}:' in x for x in f):
            raise Refused(f'the planted control ({name}) on {c0} beginner ord {it0["ord"]} did NOT go red')
        print(f'negative control: {name} ({c0} beginner ord {it0["ord"]}) went red (ok)')
    fails = gate_eval(rows, caps, rendered, check_courses)
    for c in check_courses:
        n = sum(1 for r in rows if r['app_slug'] == c and r['scope'] == 'final')
        print(f'  {c}: {n} final questions swept')
    for f in fails:
        print('  FAIL', f)
    print(f'W6 near-duplicate gate over {", ".join(check_courses)}: {"GREEN" if not fails else "RED"} ({len(fails)} failures)')
    return 0 if not fails else 1


# ------------------------------------------------------------------ selftest
def selftest():
    ok = True
    def check(name, cond):
        nonlocal ok
        print(('  ok    ' if cond else '  FAIL  ') + name)
        ok &= bool(cond)
    a = dict(prompt='What does drilling a hole do to the stress in the rock around it?', key='It concentrates it around the hole.')
    b = dict(prompt='What does drilling a hole do to the stress in the rock around the hole?', key='It concentrates the stress around it.')
    cc = dict(prompt='On the ORUMA well at 2400 m, which bound sets the lower edge of the window?', key='The collapse gradient, 1.41 sg.')
    check('a reworded copy is near', near(a, b)[0])
    check('an unrelated transfer question is not near', not near(a, cc)[0])
    check('outlier: a correct option twice the longest distractor is flagged', outlier(['x' * 80, 'y' * 30, 'z' * 35, 'w' * 38], 0))
    check('outlier: a correct option inside the range is fine', not outlier(['x' * 36, 'y' * 30, 'z' * 35, 'w' * 40], 0))
    check('outlier: a correct option far shorter than every distractor is flagged', outlier(['x' * 10, 'y' * 30, 'z' * 35, 'w' * 40], 0))
    errs = []
    text_rules('t', 'The rock, not the pipe.', errs)
    check('an "X, not Y" contrastive is refused', errs)
    errs = []
    text_rules('t', 'A range — wide.', errs)
    check('an em dash is refused', errs)
    errs = []
    text_rules('t', 'As the digest prints.', errs)
    check('internal-source wording is refused', errs)
    errs = []
    text_rules('t', 'A clean sentence with 2.5 MPa.', errs)
    check('a clean sentence passes', not errs)
    f = [dict(key='shmin', expected=33914681.28858234, tol=50)]
    check('a leaked capstone value is caught', leak_hits('Shmin is 33914681 Pa', f))
    check('a leaked capstone value at 4 significant figures is caught', leak_hits('about 33910000 Pa', f))
    check('an unrelated figure is not a leak', not leak_hits('Shmin is 41250000 Pa', f))
    d = {'print': {'x': '1.2345'}, 'values': {'x': 1.2345}}
    e = []
    check('a placeholder renders', render_text('value {{x}}', d, 't', e) == 'value 1.2345' and not e)
    render_text('value {{y}}', d, 't', e)
    check('an unknown placeholder is refused', e)
    return ok


# ------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--selftest', action='store_true')
    sub = ap.add_subparsers(dest='cmd')
    p = sub.add_parser('check'); p.add_argument('--course')
    p = sub.add_parser('digest'); p.add_argument('course'); p.add_argument('--write', action='store_true')
    p = sub.add_parser('render'); p.add_argument('course'); p.add_argument('--tier')
    p = sub.add_parser('validate'); p.add_argument('course'); p.add_argument('--container', default=DEFAULT_CONTAINER)
    p = sub.add_parser('sql'); p.add_argument('course'); p.add_argument('--check', action='store_true')
    p = sub.add_parser('slots'); p.add_argument('course'); p.add_argument('--container', default=DEFAULT_CONTAINER)
    p = sub.add_parser('pin'); p.add_argument('course'); p.add_argument('--container', default=DEFAULT_CONTAINER)
    p = sub.add_parser('gate'); p.add_argument('--container', default=DEFAULT_CONTAINER)
    p.add_argument('--courses'); p.add_argument('--allow-unbuilt', action='store_true')
    a = ap.parse_args()
    try:
        if a.selftest:
            sys.exit(0 if selftest() else 1)
        if a.cmd == 'check':
            cs = [a.course] if a.course else built_courses()
            if not cs:
                raise Refused('no course has a W6 source yet; a check over nothing is not a pass')
            bad = 0
            for c in cs:
                errs = static_check(c)
                print(f'{c}: static check {"clean" if not errs else f"{len(errs)} errors"}')
                bad += bool(errs)
            sys.exit(1 if bad else 0)
        if a.cmd == 'digest':
            d = run_case(a.course)
            p = os.path.join(course_dir(a.course), 'digest.json')
            if a.write:
                json.dump(d, open(p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
                open(p, 'a').write('\n')
                print(f'wrote {os.path.relpath(p, REPO)} ({len(d["print"])} printed figures)')
            else:
                same = os.path.exists(p) and json.load(open(p, encoding='utf-8')) == d
                print(json.dumps(d['print'], indent=1, ensure_ascii=False))
                print('digest.json', 'reproduces' if same else 'DIFFERS or is missing')
            sys.exit(0)
        if a.cmd == 'render':
            rend, errs = render(a.course)
            for t in TIERS:
                if a.tier and t != a.tier:
                    continue
                for it in rend.get(t, []):
                    ai = it.get('answer_index')
                    opts = assemble(it, ai) if ai is not None else [it['correct']] + it['distractors']
                    print(f'--- {t} ord {it["ord"]} (a{ai})')
                    print(it['prompt'])
                    for j, o in enumerate(opts):
                        print(f"  {'*' if (ai is not None and j == ai) or (ai is None and j == 0) else ' '}[{len(o):3d}] {o}")
                    print('  E:', it['explanation'])
            for e in errs:
                print('  ERROR', e)
            sys.exit(1 if errs else 0)
        if a.cmd == 'validate':
            sys.exit(1 if validate(a.course, a.container) else 0)
        if a.cmd == 'sql':
            sys.exit(0 if write_sql(a.course, a.check) else 1)
        if a.cmd == 'slots':
            slots(a.course, a.container); sys.exit(0)
        if a.cmd == 'pin':
            pin(a.course, a.container); sys.exit(0)
        if a.cmd == 'gate':
            cs = a.courses.split(',') if a.courses else list(COURSES)
            sys.exit(gate(a.container, cs, a.allow_unbuilt))
        ap.print_help(); sys.exit(2)
    except Refused as exc:
        print(f'REFUSED: {exc}')
        sys.exit(2)


if __name__ == '__main__':
    main()
