#!/usr/bin/env python3
"""B5 GRADED-FIELD AUDIT: every live capstone field, one class each, with evidence.

WHAT IT READS
  caps.json      every live capstone (dump_fields.sh against a LOCAL scratch
                 replay of NextGen main; never production)
  annot/*.json   one annotation per course: where the learner obtains each graded
                 number, the precision that source prints it at, the answer space
                 of a discrete field, the class and the fix (see README.md)

WHAT IT COMPUTES (mechanically, so a human class can be checked against it)
  zero_tol       tol <= 0
  nonint_zero    tol <= 0 on a value that is not a whole number: ungradable
  prompt_short   the prompt states a reporting precision, and the graded value
                 rounded to it misses by more than tol: a learner who follows
                 the prompt's own instruction fails
  display_miss   the source prints the value at a precision whose rounding error
                 exceeds tol: |round(expected * scale, d) / scale - expected| > tol
  guessable      guess_p >= 0.5: a coin flip or better beats working
  no_route       the annotated source is `unobtainable`: no lesson, panel, app
                 or prompt gives the learner a way to the value (W2 onward)

THE GATE. Every mechanical flag must be answered by a class other than `none`,
every field must be annotated exactly once, and every annotation must name a
live field. Anything else exits 1. An EMPTY sweep (no fields, or no
annotations) exits 2: a gate that examines nothing must never report clean.

  --post caps_after.json   re-reads the dump taken AFTER the recut migration on the
                           scratch replay: every SHIPPED tolerance fix must now carry
                           its new tol and clear its prompt/rounding flags; every
                           field the recut did not name must be byte-identical.
  --selftest               plants one defect of each kind in a copy of the input
                           and proves the gate goes red on each, then proves an
                           empty sweep refuses. Exit 0 only if every control holds.

Writes fields.json (the machine-readable per-field table) and fields.csv.
"""
import argparse, copy, csv, glob, json, math, os, re, sys

WORDS = {'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
         'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13,
         'fourteen': 14, 'fifteen': 15}
CLASSES = ('none', 'tolerance', 'display', 'redesign')


def prompt_decimals(text):
    """The reporting precision a prompt states for a field, in decimal places, or None.

    Only an UNAMBIGUOUS statement counts: when the quoted text names two different
    precisions (a prompt that gives one precision per quantity), the text alone
    cannot say which applies, and the annotation's explicit `prompt_decimals`
    decides instead."""
    if not text:
        return None
    t = text.lower()
    found = set()
    for m in re.finditer(r'(\d+|' + '|'.join(WORDS) + r')\s+decimal', t):
        g = m.group(1)
        found.add(int(g) if g.isdigit() else WORDS[g])
    if re.search(r'whole (number|day|usd|dollar)|nearest (usd|dollar|day|integer|whole|unit|barrel|metre|meter|foot|ft|psi)|integers?\b', t):
        found.add(0)
    return found.pop() if len(found) == 1 else None


def rounding_miss(expected, printed, scale):
    """How far the best printed reading sits from the graded value, in graded units."""
    if printed in (None, 'full'):
        return 0.0 if printed == 'full' else None
    x = expected * scale
    if printed == 'integer':
        shown = round(x)
    elif isinstance(printed, dict) and 'decimals' in printed:
        shown = round(x, int(printed['decimals']))
    elif isinstance(printed, dict) and 'sigfigs' in printed:
        s = int(printed['sigfigs'])
        shown = 0.0 if x == 0 else round(x, s - 1 - int(math.floor(math.log10(abs(x)))))
    else:
        return None
    return abs(shown / scale - expected)


def load(caps_path, annot_dir):
    caps = json.load(open(caps_path))
    annots = {}
    for p in sorted(glob.glob(os.path.join(annot_dir, '*.json'))):
        a = json.load(open(p))
        annots[a['course']] = a
    return caps, annots


def evaluate(caps, annots):
    rows, errors = [], []
    seen = set()
    by_key = {}
    for c in annots.values():
        for f in c.get('fields', []):
            k = (c['course'], f.get('tier'), f.get('key'))
            if k in by_key:
                errors.append(f'duplicate annotation {k}')
            by_key[k] = f
    for cap in caps:
        for f in cap['fields']:
            k = (cap['app'], cap['tier'], f['key'])
            seen.add(k)
            a = by_key.get(k)
            e, tol = float(f['expected']), float(f['tol'])
            row = {'course': k[0], 'tier': k[1], 'key': k[2], 'label': f['label'], 'unit': f['unit'],
                   'expected': e, 'tol': tol, 'rel_tol': (tol / abs(e)) if e else None}
            if a is None:
                errors.append(f'unannotated field {k}')
                rows.append(row)
                continue
            scale = float(a.get('display_scale') or 1)
            miss = rounding_miss(e, a.get('printed'), scale)
            pd = a['prompt_decimals'] if a.get('prompt_decimals') is not None else prompt_decimals(a.get('prompt_precision'))
            # what a learner who follows the prompt's own rounding instruction types
            prompt_miss = abs(round(e, pd) - e) if pd is not None else None
            flags = []
            if tol <= 0:
                flags.append('zero_tol')
                if not e.is_integer():
                    flags.append('nonint_zero')
            if prompt_miss is not None and prompt_miss > tol * (1 + 1e-9) + 1e-15:
                flags.append('prompt_short')
            if miss is not None and miss > tol * (1 + 1e-9) + 1e-15:
                flags.append('display_miss')
            gp = a.get('guess_p')
            if gp is not None and gp >= 0.5:
                flags.append('guessable')
            if a.get('source') == 'unobtainable':
                flags.append('no_route')
            cls = a.get('class')
            if cls not in CLASSES:
                errors.append(f'{k}: class {cls!r} is not one of {CLASSES}')
            blocking = [x for x in flags if x != 'zero_tol']
            if cls == 'none' and blocking:
                errors.append(f'{k}: classed none but flagged {blocking}')
            if cls == 'redesign' and 'guessable' not in flags and not a.get('owner_decision'):
                pass  # a redesign may rest on judgement; the evidence says why
            if cls != 'none' and not a.get('evidence'):
                errors.append(f'{k}: class {cls} with no evidence')
            # W4 onward: a field whose fix ships a panel route has left `unobtainable`
            # (no route) and is gradable as printed, so it is class none with no flag.
            sh = a.get('shipped')
            if isinstance(sh, dict) and sh.get('route'):
                if a.get('source') == 'unobtainable':
                    errors.append(f'{k}: ships a route ({sh["route"]}) but is still source unobtainable')
                if cls != 'none':
                    errors.append(f'{k}: ships a route but is class {cls}')
                if a.get('printed') is None:
                    errors.append(f'{k}: ships a route but records no printed precision')
            row.update({
                'source': a.get('source'), 'source_ref': a.get('source_ref'), 'printed': a.get('printed'),
                'display_scale': scale, 'display_ref': a.get('display_ref'),
                'prompt_precision': a.get('prompt_precision'), 'prompt_decimals': pd, 'prompt_miss': prompt_miss,
                'rounding_miss': miss, 'answer_space': a.get('answer_space'), 'guess_p': gp,
                'flags': flags, 'class': cls, 'fix': a.get('fix'),
                'owner_decision': bool(a.get('owner_decision')), 'recommendation': a.get('recommendation'),
                'leak': a.get('leak'), 'reclassed_from': a.get('reclassed_from'), 'shipped': a.get('shipped'),
                'evidence': a.get('evidence'), 'notes': a.get('notes')})
            rows.append(row)
    for k in by_key:
        if k not in seen:
            errors.append(f'annotation names no live field {k}')
    return rows, errors


def in_wave(shipped, waves):
    """A shipped fix is checked when it belongs to no wave (B5, round-off) or to a named one."""
    return isinstance(shipped, dict) and (shipped.get('wave') is None or shipped.get('wave') in waves)


def post_check(before, after, rows, waves=()):
    """After the recut: tolerance fixes carry new_tol and clear their flags; re-keys carry
    their replacement field in place; nothing else moved. A fix tagged with a wave (W1
    onward) is checked only when that wave is named, so an earlier batch's dry run is
    not held to a later wave's state."""
    errs = []
    idx_b = {(c['app'], c['tier']): c for c in before}
    idx_a = {(c['app'], c['tier']): c for c in after}
    live = [r for r in rows if in_wave(r.get('shipped'), waves)]
    fix_tol = {(r['course'], r['tier'], r['key']): r['shipped']['tol'][1] for r in live if 'tol' in r['shipped']}
    rekey = {(r['course'], r['tier'], r['key']): r['shipped']['rekey'] for r in live if 'rekey' in r['shipped']}
    if not fix_tol:
        errs.append('post-recut check has no shipped tolerance fix to verify (empty sweep)')
    for ck, cb in idx_b.items():
        ca = idx_a.get(ck)
        if ca is None:
            errs.append(f'capstone {ck} missing after the recut')
            continue
        fb = {f['key']: f for f in cb['fields']}
        fa = {f['key']: f for f in ca['fields']}
        want_keys = [rekey[(ck[0], ck[1], k)]['key'] if (ck[0], ck[1], k) in rekey else k for k in fb]
        if want_keys != list(fa):
            errs.append(f'{ck}: field keys moved {list(fb)} -> {list(fa)} (expected {want_keys})')
            continue
        for key, f0 in fb.items():
            k = (ck[0], ck[1], key)
            if k in rekey:
                nf = rekey[k]
                f1 = fa[nf['key']]
                got = {x: (float(f1[x]) if x in ('expected', 'tol') else f1[x]) for x in ('key', 'label', 'unit', 'expected', 'tol')}
                if got != nf or set(f1) != set(nf):
                    errs.append(f'{k}: re-keyed to {f1}, the fix says {nf}')
                continue
            f1 = fa[key]
            if k in fix_tol:
                if float(f1['tol']) != float(fix_tol[k]):
                    errs.append(f'{k}: tol {f1["tol"]} after the recut, the fix says {fix_tol[k]}')
                if {**f0, 'tol': None} != {**f1, 'tol': None}:
                    errs.append(f'{k}: something other than tol moved')
            elif f0 != f1:
                errs.append(f'{k}: moved but the recut does not name it')
    # W2 lesson route: the lesson that now prints the form must carry it (read
    # from the repository this folder sits in; the apply dry run extracts
    # src/content beside it)
    for r in live:
        for rel, text in r['shipped'].get('lesson_contains') or []:
            body = LESSON_READ(rel)
            if body is None or text not in body:
                errs.append(f"{(r['course'], r['tier'], r['key'])}: the W2 lesson text is not in {rel}")
    # W2 publishes inputs: every field it unlocks names the text its tier's
    # live prompt must now carry
    for r in live:
        need = r['shipped'].get('prompt_contains') or []
        if not need:
            continue
        ca = idx_a.get((r['course'], r['tier']))
        text = (ca or {}).get('prompt') or ''
        missing = [x for x in need if x not in text]
        if missing:
            errs.append(f"{(r['course'], r['tier'], r['key'])}: the W2 prompt text is not in place ({len(missing)} of {len(need)} published passage(s) missing)")
    # the replacement fields are gated like any live field, under their own annotation
    ann = copy.deepcopy(ANNOTS_FOR_POST)
    for r in live:
        if 'rekey' in r['shipped']:
            ann[r['course']]['fields'].append({'tier': r['tier'], 'key': r['shipped']['rekey']['key'],
                                               **r['shipped'].get('rekey_annot', {'class': 'none'})})
    re_rows, re_err = evaluate(after, ann)
    new_keys = {(c, t, nf['key']) for (c, t, _), nf in rekey.items()}
    for r in re_rows:
        k = (r['course'], r['tier'], r['key'])
        if k in fix_tol and set(r.get('flags', [])) & {'prompt_short', 'nonint_zero'}:
            errs.append(f'{k}: still flagged {r["flags"]} after its tolerance fix')
        if k in new_keys:
            if r.get('class') != 'none' or [x for x in r.get('flags', []) if x != 'zero_tol']:
                errs.append(f'{k}: the replacement field is class {r.get("class")} flagged {r.get("flags")}')
            if not r.get('evidence'):
                errs.append(f'{k}: the replacement field carries no evidence')
    for e in re_err:
        if any(f"'{nk[2]}')" in e for nk in new_keys):
            errs.append(e)
    # W3 onward: a prompt-only fix (the Full precision sentence) must be on the brief
    for r in live:
        add = r['shipped'].get('prompt_append')
        if not add:
            continue
        ca = idx_a.get((r['course'], r['tier']))
        if ca is None or not str(ca.get('prompt', '')).rstrip().endswith(add):
            errs.append(f"{(r['course'], r['tier'], r['key'])}: the brief does not end with its {r['shipped'].get('wave')} sentence {add[:60]!r}")
    return errs


ANNOTS_FOR_POST = {}
REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))


def _lesson_read(rel):
    p = os.path.join(REPO, rel)
    return open(p, encoding='utf-8').read() if os.path.exists(p) else None


LESSON_READ = _lesson_read


def selftest(caps, annots):
    ok = True
    # a planted field in a clean copy of one course
    def plant(mut):
        c2, a2 = copy.deepcopy(caps), copy.deepcopy(annots)
        mut(c2, a2)
        return evaluate(c2, a2)[1]
    course = next(iter(annots))
    cap = next(c for c in caps if c['app'] == course)
    def add(c2, a2, field, ann):
        next(c for c in c2 if c['app'] == course and c['tier'] == cap['tier'])['fields'].append(field)
        a2[course]['fields'].append({'tier': cap['tier'], 'key': field['key'], **ann})
    controls = {
        'nonint zero tol classed none': lambda c2, a2: add(c2, a2,
            {'key': 'zz_plant', 'label': 'x', 'unit': '-', 'expected': 1.25, 'tol': 0},
            {'source': 'suite-app', 'printed': 'full', 'class': 'none'}),
        'display miss classed none (the irrReason shape)': lambda c2, a2: add(c2, a2,
            {'key': 'zz_plant', 'label': 'x', 'unit': 'percent', 'expected': -43.22592817326132, 'tol': 0.01},
            {'source': 'suite-app', 'printed': {'decimals': 1}, 'class': 'none'}),
        'prompt asks four decimals, tol tighter, classed none': lambda c2, a2: add(c2, a2,
            {'key': 'zz_plant', 'label': 'x', 'unit': '-', 'expected': 3.14159, 'tol': 1e-6},
            {'source': 'suite-app', 'printed': {'decimals': 4}, 'prompt_precision': 'to four decimals', 'class': 'none'}),
        'coin flip classed none': lambda c2, a2: add(c2, a2,
            {'key': 'zz_plant', 'label': 'x (1 yes / 0 no)', 'unit': 'flag', 'expected': 1, 'tol': 0},
            {'source': 'suite-app', 'printed': 'integer', 'answer_space': 2, 'guess_p': 0.5, 'class': 'none'}),
        'unobtainable source classed none': lambda c2, a2: add(c2, a2,
            {'key': 'zz_plant', 'label': 'x', 'unit': '-', 'expected': 2.5, 'tol': 0.01},
            {'source': 'unobtainable', 'printed': None, 'class': 'none'}),
        'unannotated live field': lambda c2, a2: next(c for c in c2 if c['app'] == course)['fields'].append(
            {'key': 'zz_plant', 'label': 'x', 'unit': '-', 'expected': 1, 'tol': 0.1}),
        'annotation for a field that is not live': lambda c2, a2: a2[course]['fields'].append(
            {'tier': cap['tier'], 'key': 'zz_ghost', 'class': 'none'}),
        'a route shipped but the field still has none (W4)': lambda c2, a2: add(c2, a2,
            {'key': 'zz_plant', 'label': 'x', 'unit': 'Pa', 'expected': 6233731.747831926, 'tol': 50},
            {'source': 'unobtainable', 'printed': None, 'class': 'none',
             'shipped': {'wave': 'w4a', 'route': 'typed-case panel print (W4a)'}}),
        'a route shipped but printed too coarsely for tol (W4)': lambda c2, a2: add(c2, a2,
            {'key': 'zz_plant', 'label': 'x', 'unit': 'Pa', 'expected': 13362352.096477188, 'tol': 50},
            {'source': 'nextgen-panel', 'printed': {'decimals': 3}, 'display_scale': 1e-06, 'class': 'none',
             'shipped': {'wave': 'w4a', 'route': 'typed-case panel print (W4a)'}}),
    }
    for name, mut in controls.items():
        errs = plant(mut)
        red = any('zz_' in e for e in errs)
        print(f"  control {'RED (good)' if red else 'GREEN (BROKEN)'}: {name}")
        ok &= red
    # the post-recut check, on a synthetic "after" built from the shipped fixes
    global ANNOTS_FOR_POST
    ANNOTS_FOR_POST = annots
    rows = evaluate(caps, annots)[0]
    waves = tuple(sorted({r['shipped']['wave'] for r in rows if isinstance(r.get('shipped'), dict) and r['shipped'].get('wave')}))
    shipped = {(r['course'], r['tier'], r['key']): r['shipped']['tol'][1] for r in rows
               if isinstance(r.get('shipped'), dict) and 'tol' in r['shipped']}
    rekeys = {(r['course'], r['tier'], r['key']): r['shipped']['rekey'] for r in rows
              if isinstance(r.get('shipped'), dict) and 'rekey' in r['shipped']}
    wave_of = {(r['course'], r['tier'], r['key']): r['shipped'].get('wave') for r in rows if isinstance(r.get('shipped'), dict)}
    prompt_text = {}
    for r in rows:
        sh = r.get('shipped')
        if isinstance(sh, dict) and sh.get('prompt_contains'):
            prompt_text.setdefault((r['course'], r['tier']), {'wave': sh.get('wave'), 'text': [], 'keys': []})
            for x in sh['prompt_contains']:
                if x not in prompt_text[(r['course'], r['tier'])]['text']:
                    prompt_text[(r['course'], r['tier'])]['text'].append(x)
            prompt_text[(r['course'], r['tier'])]['keys'].append(r['key'])

    appends = {(r['course'], r['tier'], r['key']): r['shipped']['prompt_append'] for r in rows
               if isinstance(r.get('shipped'), dict) and r['shipped'].get('prompt_append')}
    def after(skip=None, move=None, upto=waves, unprompted=None):
        c2 = copy.deepcopy(caps)
        for c in c2:
            pt = prompt_text.get((c['app'], c['tier']))
            if pt and pt['wave'] in upto and (c['app'], c['tier']) != unprompted:
                c['prompt'] = (c.get('prompt') or '') + ' ' + ' '.join(pt['text'])
            for i, f in enumerate(c['fields']):
                k = (c['app'], c['tier'], f['key'])
                if wave_of.get(k) and wave_of[k] not in upto:
                    continue
                if k in shipped and k != skip:
                    f['tol'] = shipped[k]
                if k == move:
                    f['tol'] = float(f['tol']) * 2 + 1
                if k in rekeys and k != skip:
                    c['fields'][i] = dict(rekeys[k])
                if k in appends and k != skip and not c['prompt'].rstrip().endswith(appends[k]):
                    c['prompt'] = c['prompt'].rstrip() + ' ' + appends[k]
        return c2
    clean = not post_check(caps, after(), rows, waves)
    print(f"  post control {'GREEN (good)' if clean else 'RED (BROKEN)'}: every shipped fix applied{' (waves ' + ', '.join(waves) + ')' if waves else ''}")
    ok &= clean
    if shipped:
        first = next(k for k in shipped if not wave_of.get(k))
        red = bool(post_check(caps, after(skip=first), rows, waves))
        print(f"  post control {'RED (good)' if red else 'GREEN (BROKEN)'}: one shipped fix not applied")
        ok &= red
    if rekeys:
        first = next(iter(rekeys))
        red = bool(post_check(caps, after(skip=first), rows, waves))
        print(f"  post control {'RED (good)' if red else 'GREEN (BROKEN)'}: one shipped re-key not applied")
        ok &= red
        c2 = after()
        k = first
        f = next(x for c in c2 if (c['app'], c['tier']) == k[:2] for x in c['fields'] if x['key'] == rekeys[k]['key'])
        f['expected'] = float(f['expected']) + 1
        red = bool(post_check(caps, c2, rows, waves))
        print(f"  post control {'RED (good)' if red else 'GREEN (BROKEN)'}: a re-key carrying a different expected")
        ok &= red
    if waves:
        clean = not post_check(caps, after(upto=()), rows, ())
        print(f"  post control {'GREEN (good)' if clean else 'RED (BROKEN)'}: the pre-wave state checked without --wave (an earlier batch's dry run)")
        ok &= clean
        red = bool(post_check(caps, after(), rows, ()))
        print(f"  post control {'RED (good)' if red else 'GREEN (BROKEN)'}: the wave's state checked without --wave")
        ok &= red
    lesson_rows = [r for r in rows if isinstance(r.get('shipped'), dict) and r['shipped'].get('lesson_contains')]
    if lesson_rows:
        global LESSON_READ
        cut = lesson_rows[0]['shipped']['lesson_contains'][0][0]
        saved = LESSON_READ
        LESSON_READ = lambda rel: '' if rel == cut else saved(rel)
        try:
            red = bool(post_check(caps, after(), rows, waves))
        finally:
            LESSON_READ = saved
        print(f"  post control {'RED (good)' if red else 'GREEN (BROKEN)'}: a W2 lesson without its printed form ({os.path.basename(cut)})")
        ok &= red
    if prompt_text:
        tier = next(k for k, v in prompt_text.items() if v['wave'] in waves)
        red = bool(post_check(caps, after(unprompted=tier), rows, waves))
        print(f"  post control {'RED (good)' if red else 'GREEN (BROKEN)'}: a W2 prompt without its published inputs ({tier[0]}/{tier[1]})")
        ok &= red
    if appends:
        # W3: a brief left without its Full precision sentence is caught
        first = next(iter(appends))
        red = bool(post_check(caps, after(skip=first), rows, waves))
        print(f"  post control {'RED (good)' if red else 'GREEN (BROKEN)'}: a {wave_of[first]} brief without its Full precision sentence")
        ok &= red
        # W3: a field moved to class none because the switch prints it finely goes red
        # again when its annotation says the old Suite print (the class move rests on it)
        before = {k: r['shipped']['printed_before'] for r in rows for k in [(r['course'], r['tier'], r['key'])]
                  if isinstance(r.get('shipped'), dict) and 'printed_before' in r['shipped']}
        if before:
            k = next(iter(before))
            a2 = copy.deepcopy(annots)
            f = next(x for x in a2[k[0]]['fields'] if (x['tier'], x['key']) == k[1:])
            f['printed'] = before[k]
            red = any(repr(k) in e for e in evaluate(caps, a2)[1])
            print(f"  control {'RED (good)' if red else 'GREEN (BROKEN)'}: a {wave_of[k]} class move with the Suite print it replaced ({k[2]})")
            ok &= red
    other = next((c['app'], c['tier'], f['key']) for c in caps for f in c['fields']
                 if (c['app'], c['tier'], f['key']) not in shipped and (c['app'], c['tier'], f['key']) not in rekeys)
    red = bool(post_check(caps, after(move=other), rows, waves))
    print(f"  post control {'RED (good)' if red else 'GREEN (BROKEN)'}: a field the recut does not name moved")
    ok &= red
    base = evaluate(caps, annots)[1]
    print(f'  baseline (unplanted) errors: {len(base)}')
    rows, _ = evaluate([], {})
    empty_refused = len(rows) == 0
    print(f"  empty sweep yields {len(rows)} rows, which main() refuses with exit 2: {'yes' if empty_refused else 'NO'}")
    return ok and empty_refused


def main():
    ap = argparse.ArgumentParser()
    here = os.path.dirname(os.path.abspath(__file__))
    ap.add_argument('--caps', default=os.path.join(here, 'caps.json'))
    ap.add_argument('--annot', default=os.path.join(here, 'annot'))
    ap.add_argument('--out', default=here)
    ap.add_argument('--post')
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--no-write', action='store_true')
    ap.add_argument('--wave', action='append', default=[], help='also check the fixes shipped in this wave (e.g. w1)')
    a = ap.parse_args()
    caps, annots = load(a.caps, a.annot)
    nfields = sum(len(c['fields']) for c in caps)
    if nfields == 0 or not annots:
        print(f'REFUSED: empty sweep ({nfields} fields, {len(annots)} annotated courses)')
        return 2
    if a.selftest:
        good = selftest(caps, annots)
        print('SELFTEST', 'PASS' if good else 'FAIL')
        return 0 if good else 1
    rows, errors = evaluate(caps, annots)
    counts = {c: sum(1 for r in rows if r.get('class') == c) for c in CLASSES}
    flagc = {}
    for r in rows:
        for x in r.get('flags', []):
            flagc[x] = flagc.get(x, 0) + 1
    print(f'{len(rows)} fields in {len(caps)} capstones over {len({c["app"] for c in caps})} courses')
    print('classes', counts, 'owner decisions', sum(1 for r in rows if r.get('owner_decision')))
    print('flags', flagc)
    if a.post:
        global ANNOTS_FOR_POST
        ANNOTS_FOR_POST = annots
        after = json.load(open(a.post))
        perr = post_check(caps, after, rows, tuple(a.wave))
        for e in perr:
            print('POST', e)
        print('post-recut check:', 'CLEAN' if not perr else f'{len(perr)} problem(s)')
        errors += perr
    if not a.no_write:
        json.dump(rows, open(os.path.join(a.out, 'fields.json'), 'w'), indent=1)
        cols = ['course', 'tier', 'key', 'unit', 'expected', 'tol', 'class', 'flags', 'leak', 'shipped', 'source', 'printed',
                'display_scale', 'prompt_decimals', 'rounding_miss', 'answer_space', 'guess_p', 'owner_decision',
                'fix', 'source_ref', 'display_ref', 'evidence']
        with open(os.path.join(a.out, 'fields.csv'), 'w', newline='') as fh:
            w = csv.writer(fh)
            w.writerow(cols)
            for r in rows:
                w.writerow([json.dumps(r.get(c)) if isinstance(r.get(c), (dict, list)) else r.get(c) for c in cols])
    for e in errors[:60]:
        print('ERROR', e)
    if errors:
        print(f'GATE RED: {len(errors)} error(s)')
        return 1
    print('GATE GREEN')
    return 0


if __name__ == '__main__':
    sys.exit(main())
