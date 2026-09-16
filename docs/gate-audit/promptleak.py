#!/usr/bin/env python3
"""A capstone PROMPT may not hand a learner a graded answer.

A prompt is the one text a learner reads WHILE being graded, so a graded value
stated in a prompt is an answer given away. The hazard is structural rather
than careless: a capstone's conditions have to state everything that changes an
answer, and in a chained domain the thing that changes an Associate answer is
often a Professional quantity. State it and you have handed over a graded
value; leave it out and the field is not gradeable.

WHAT THE PREVIOUS VERSION OF THIS GATE DID, AND WHY IT FOUND NOTHING
--------------------------------------------------------------------
It swept a migration file for single-quoted literals, and kept only those that
were 400+ characters long AND contained the literal word "Report". Both
filters are guesses about prose, not facts about the schema:

  * 49 of the 132 prompts live in production never use the word "Report".
    They say "Read six values", "Give", "State", "Submit". Every one of those
    prompts was invisible.
  * 28 prompts are shorter than 400 characters and were invisible for that
    reason.
  * Its quote regex, r"'((?:[^']|'')*)'", pairs quotes across `--` comments.
    One apostrophe in one comment ("the engine's default") shifts every
    subsequent pairing by one, so the literals it extracts after that point are
    the gaps BETWEEN the real literals. On 12 of the 40 course migrations on
    main, stripping comments changes the swept set.

The consequence is the failure this gate now refuses to repeat: it printed
"cross-tier: 0" and exited 0 after examining nothing at all. A gate that
reports success on an empty sweep validates nothing.

WHAT THIS VERSION DOES
----------------------
It finds prompts STRUCTURALLY, from the schema rather than from prose. A
capstone is a row of `public.academy_capstones`, whose `prompt` is a column and
whose graded answer key is a `fields` jsonb array of
{key,label,unit,expected,tol}. So:

  --db          read the rows from the database that actually grades learners.
                This is the authoritative mode. Wave directories drift from
                what was seeded; the served row cannot.
  --sql FILE    parse the INSERT structurally for a pre-merge check: comments
                are removed by a lexer that understands string literals and
                dollar quoting, the column list is read, and values are mapped
                to columns by position. No magic word, no length threshold.

It then reports any number in any prompt that lands within a few grader
tolerances of a graded value of the SAME COURSE, at three unit shiftings,
saying which tier the prompt belongs to and which tier owns the value. A
different tier is the finding; the same tier is a SELF warning, because a
capstone that prints its own answer is a copying exercise.

REFUSALS. The gate exits 2, not 0, when it cannot do its job: an empty sweep,
a course with no graded fields, a migration whose capstone INSERT it cannot
parse. Success on zero input is the bug this rewrite exists to remove.

    python3 promptleak.py --db [--course SLUG] [--workdir DIR]
    python3 promptleak.py --sql <course_migration.sql> [--course SLUG]
    python3 promptleak.py --selftest        negative control, see below
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile

TIERS = ('beginner', 'intermediate', 'advanced')
TIER_RANK = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
# Unit shiftings a prompt may legitimately restate a graded value at. The
# tolerance shifts with the value: shifting the value alone turns the guard
# into a wildcard that matches every bare "1.0" in the text.
SCALES = ((1.0, ''), (1000.0, 'x1000'), (0.001, 'x0.001'))
# Report anything inside this many grader tolerances. Inside ONE tolerance the
# grader would accept the number as typed, which is the finding that matters.
REPORT_TOL = 10.0
ACCEPT_TOL = 1.0
# A graded value that is a small integer collides with something in any prose:
# a step count, an enumerator "(6)", a year. Those are reported as NOTES, the
# same distinction goldensweep.mjs draws, because two small integers agreeing
# is a coincidence with a high prior and a continuous value agreeing to seven
# figures is not.
SMALL_INT_LIMIT = 10000

# Digit-grouped numbers first, so "1,600,000" is one number and not three.
NUM = re.compile(r'-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')


class Refused(Exception):
    """The gate cannot do its job. Never a pass."""


# --------------------------------------------------------------- SQL lexing

def strip_sql_comments(sql):
    """Remove -- and /* */ comments WITHOUT touching string literals.

    This is the half the old gate got wrong. Scanning for quotes with a regex
    treats an apostrophe inside a comment as an opening quote and mis-pairs
    everything after it. Here the scanner walks the text once and decides what
    each character is: inside a literal, inside a dollar-quoted block, inside a
    comment, or code. Comments are replaced by spaces so byte offsets, and
    therefore error messages, still line up with the original file.
    """
    out = []
    i, n = 0, len(sql)
    while i < n:
        c = sql[i]
        if c == "'":
            j = i + 1
            while j < n:
                if sql[j] == "'":
                    if j + 1 < n and sql[j + 1] == "'":
                        j += 2
                        continue
                    j += 1
                    break
                j += 1
            else:
                raise Refused('unterminated string literal in the SQL')
            out.append(sql[i:j])
            i = j
            continue
        if c == '$':
            m = re.match(r'\$[A-Za-z_0-9]*\$', sql[i:])
            if m:
                tag = m.group(0)
                k = sql.find(tag, i + len(tag))
                k = n if k == -1 else k + len(tag)
                out.append(sql[i:k])
                i = k
                continue
        if sql.startswith('--', i):
            j = sql.find('\n', i)
            j = n if j == -1 else j
            out.append(' ' * (j - i))
            i = j
            continue
        if sql.startswith('/*', i):
            depth, j = 1, i + 2
            while j < n and depth:
                if sql.startswith('/*', j):
                    depth += 1
                    j += 2
                elif sql.startswith('*/', j):
                    depth -= 1
                    j += 2
                else:
                    j += 1
            out.append(' ' * (j - i))
            i = j
            continue
        out.append(c)
        i += 1
    return ''.join(out)


def split_top_level(text, sep=','):
    """Split on `sep` at paren depth zero, respecting string literals."""
    parts, buf, depth = [], [], 0
    i, n = 0, len(text)
    while i < n:
        c = text[i]
        if c == "'":
            j = i + 1
            while j < n:
                if text[j] == "'":
                    if j + 1 < n and text[j + 1] == "'":
                        j += 2
                        continue
                    j += 1
                    break
                j += 1
            buf.append(text[i:j])
            i = j
            continue
        if c == '(':
            depth += 1
        elif c == ')':
            depth -= 1
        if c == sep and depth == 0:
            parts.append(''.join(buf))
            buf = []
            i += 1
            continue
        buf.append(c)
        i += 1
    parts.append(''.join(buf))
    return parts


def unquote(expr):
    e = expr.strip()
    if len(e) >= 2 and e[0] == "'" and e[-1] == "'":
        return e[1:-1].replace("''", "'")
    return None


FIELD_OBJ = re.compile(
    r"jsonb_build_object\s*\((?P<body>.*?)\)\s*(?=,\s*jsonb_build_object|\s*\)|\s*$)",
    re.S | re.I)


def parse_fields_expr(expr):
    """Pull {key, expected, tol} out of a jsonb_build_array(jsonb_build_object(...)) expression."""
    fields = []
    for m in re.finditer(r"jsonb_build_object\s*\(", expr, re.I):
        start = m.end()
        depth, j = 1, start
        while j < len(expr) and depth:
            if expr[j] == '(':
                depth += 1
            elif expr[j] == ')':
                depth -= 1
            j += 1
        body = expr[start:j - 1]
        parts = [p.strip() for p in split_top_level(body)]
        d = {}
        for k in range(0, len(parts) - 1, 2):
            key = unquote(parts[k])
            if key is None:
                continue
            d[key] = parts[k + 1]
        if 'key' in d and 'expected' in d:
            try:
                expected = float(d['expected'])
                tol = float(d.get('tol', '0'))
            except ValueError:
                continue
            fields.append({'key': unquote(d['key']) or d['key'],
                           'expected': expected, 'tol': tol,
                           'label': unquote(d.get('label', '')) or '',
                           'unit': unquote(d.get('unit', '')) or ''})
    return fields


INSERT_RE = re.compile(
    r"insert\s+into\s+public\.academy_capstones\s*\((?P<cols>[^)]*)\)\s*values\s*",
    re.I)


def records_from_sql(path):
    raw = open(path, encoding='utf-8').read()
    if not re.search(r'academy_capstones', raw, re.I):
        raise Refused(f'{path} mentions no academy_capstones row; nothing to gate')
    sql = strip_sql_comments(raw)
    records = []
    found_insert = False
    for m in INSERT_RE.finditer(sql):
        found_insert = True
        cols = [c.strip().lower() for c in m.group('cols').split(',')]
        for need in ('app_slug', 'tier', 'prompt', 'fields'):
            if need not in cols:
                raise Refused(
                    f'{path}: the INSERT column list has no "{need}" column; '
                    f'got {cols}. Refusing rather than guessing.')
        # take the VALUES section up to the statement terminator
        rest = sql[m.end():]
        end = None
        depth = 0
        i = 0
        while i < len(rest):
            c = rest[i]
            if c == "'":
                j = i + 1
                while j < len(rest):
                    if rest[j] == "'":
                        if j + 1 < len(rest) and rest[j + 1] == "'":
                            j += 2
                            continue
                        j += 1
                        break
                    j += 1
                i = j
                continue
            if c == '(':
                depth += 1
            elif c == ')':
                depth -= 1
            elif c == ';' and depth == 0:
                end = i
                break
            elif depth == 0 and re.match(r'\son\s+conflict\b', rest[i:], re.I):
                end = i
                break
            i += 1
        section = rest[:end if end is not None else len(rest)]
        tuples = [t.strip() for t in split_top_level(section)]
        for t in tuples:
            t = t.strip()
            if not (t.startswith('(') and t.endswith(')')):
                continue
            vals = split_top_level(t[1:-1])
            if len(vals) != len(cols):
                raise Refused(
                    f'{path}: a VALUES tuple has {len(vals)} values for '
                    f'{len(cols)} columns. Refusing rather than guessing.')
            row = dict(zip(cols, vals))
            prompt = unquote(row['prompt'])
            slug = unquote(row['app_slug'])
            tier = unquote(row['tier'])
            if prompt is None or slug is None or tier is None:
                raise Refused(
                    f'{path}: could not read app_slug/tier/prompt as literals '
                    f'for one row. Refusing rather than guessing.')
            fields = parse_fields_expr(row['fields'])
            if not fields:
                raise Refused(
                    f'{path}: {slug}/{tier} has no parseable graded fields. '
                    f'Refusing rather than guessing.')
            records.append({'app_slug': slug, 'tier': tier,
                            'prompt': prompt,
                            'title': unquote(row.get('title', '')) or '',
                            'dataset': unquote(row.get('dataset', '')) or '',
                            'fields': fields})
    if found_insert and not records:
        raise Refused(
            f'{path} contains an academy_capstones INSERT that this gate could '
            f'not parse into a single row. Refusing rather than passing.')
    if not records:
        raise Refused(f'{path}: no academy_capstones rows parsed')
    return records


# ------------------------------------------------------------------ the DB

DB_QUERY = """
select coalesce(jsonb_agg(jsonb_build_object(
  'app_slug', app_slug, 'tier', tier, 'prompt', prompt,
  'title', title, 'dataset', dataset,
  'fields', fields) order by app_slug, tier), '[]'::jsonb) as dump
from public.academy_capstones where active;
"""


def records_from_db(workdir):
    with tempfile.NamedTemporaryFile('w', suffix='.sql', delete=False) as fh:
        fh.write(DB_QUERY)
        qpath = fh.name
    try:
        proc = subprocess.run(
            ['supabase', 'db', 'query', '--linked', '-f', qpath, '-o', 'json'],
            cwd=workdir, capture_output=True, text=True)
    finally:
        os.unlink(qpath)
    if proc.returncode != 0:
        raise Refused(f'supabase db query failed: {proc.stderr.strip()[:400]}')
    try:
        payload = json.loads(proc.stdout)
        rows = payload['rows'][0]['dump']
    except Exception as exc:
        raise Refused(f'could not read the query result: {exc}')
    out = []
    for r in rows:
        fields = [{'key': f.get('key'), 'expected': f.get('expected'),
                   'tol': f.get('tol'), 'label': f.get('label') or '',
                   'unit': f.get('unit') or ''} for f in (r.get('fields') or [])]
        fields = [f for f in fields
                  if isinstance(f['expected'], (int, float))
                  and isinstance(f['tol'], (int, float))]
        out.append({'app_slug': r['app_slug'], 'tier': r['tier'],
                    'prompt': r['prompt'] or '', 'title': r.get('title') or '',
                    'dataset': r.get('dataset') or '', 'fields': fields})
    return out


# ------------------------------------------------------------------- sweep

def numbers_in(text):
    """Yield (literal, value) for every number in the prompt that is a QUANTITY.

    A number welded to a word is a NAME, not a quantity: EJULEBE-1, AGBADA-9,
    UMU-01, the 01 in a 2031-01 date, the m04 of a module id. The first run of
    this sweep read those as numbers, and they matched graded values under a
    unit shifting: that is how "-01", the tail of a well name, came to be
    reported as a leak of a 0.001 decline rate.
    """
    for m in NUM.finditer(text):
        raw = m.group(0)
        start = m.start()
        before = text[start - 1] if start > 0 else ' '
        if before.isalpha() or before == '_':
            continue
        if raw.startswith('-') and start > 0 and text[start - 1].isalnum():
            continue
        try:
            yield raw, float(raw.replace(',', ''))
        except ValueError:
            continue


def literal_quantum(raw):
    """Half of the last decimal place the literal is actually WRITTEN to.

    "1.2" is written to a tenth, so it carries +/- 0.05 of its own. "1.2000"
    is written to a ten-thousandth and carries +/- 0.00005. This is the
    precision the author committed to on the page, not the precision of the
    float it parses to.
    """
    s = raw.replace(',', '').lstrip('-')
    mant, _, exp = s.lower().partition('e')
    dec = len(mant.split('.')[1]) if '.' in mant else 0
    q = 0.5 * 10.0 ** (-dec)
    return q * 10.0 ** int(exp) if exp else q


SURFACE_KINDS = ('prompt', 'title', 'dataset', 'label', 'unit')


def surfaces_of(rec):
    """Every learner-reachable text academy_get_capstone serves for one row.

    The RPC returns app_slug, tier, cert_tier, dataset, title, prompt and, per
    graded field, key + label + unit. It does NOT return expected or tol. The
    learning pages render the title, the prompt and, for each field,
    "{label} ({unit})" above its input box; dataset and key reach the browser in
    the payload without being drawn. All of it is learner-reachable, so all of
    it is swept. Sweeping only the prompt is how a label came to carry two
    graded answers for months.
    """
    yield ('prompt', None, rec.get('prompt') or '')
    yield ('title', None, rec.get('title') or '')
    yield ('dataset', None, rec.get('dataset') or '')
    for f in rec['fields']:
        yield ('label', f.get('key'), f.get('label') or '')
        yield ('unit', f.get('key'), f.get('unit') or '')


def sweep(records, course=None):
    """Return (findings, stats). Raises Refused on an empty sweep."""
    by_course = {}
    for r in records:
        by_course.setdefault(r['app_slug'], []).append(r)
    if course:
        by_course = {k: v for k, v in by_course.items() if k == course}
        if not by_course:
            raise Refused(f'no capstone rows for course "{course}"')

    findings = []
    prompts_examined = 0
    numbers_examined = 0
    fields_total = 0
    courses_examined = 0
    surfaces_examined = {k: 0 for k in SURFACE_KINDS}
    texts_examined = {k: 0 for k in SURFACE_KINDS}

    for slug, rows in sorted(by_course.items()):
        graded = [(r['tier'], f['key'], f['expected'], f['tol'] or 0.0)
                  for r in rows for f in r['fields']]
        if not graded:
            raise Refused(f'course "{slug}" has no graded fields to sweep against')
        fields_total += len(graded)
        courses_examined += 1
        for r in rows:
            if not (r.get('prompt') or '').strip():
                raise Refused(f'{slug}/{r["tier"]} has an empty prompt')
            prompts_examined += 1
            for kind, owner, text in surfaces_of(r):
                surfaces_examined[kind] += 1
                if text.strip():
                    texts_examined[kind] += 1
                for raw, v in numbers_in(text):
                    numbers_examined += 1
                    for gtier, key, expected, tol in graded:
                        # A FIELD GRADED TO ZERO TOLERANCE, OR GRADED AT ZERO,
                        # USED TO BE SKIPPED ENTIRELY. Both were unswept on every
                        # surface, and both are the EASIEST kind to leak: the
                        # answer has to be typed exactly, and a surface that
                        # prints it prints it exactly. 40 of the 793 live fields
                        # are tol 0. They are swept by exact equality instead.
                        exact = tol <= 0 or expected == 0
                        for scale, slabel in SCALES:
                            shifted = abs(v) / scale
                            if exact:
                                if shifted != abs(expected):
                                    continue
                                n = 0.0
                            else:
                                n = abs(shifted - abs(expected)) / tol
                                if n > REPORT_TOL:
                                    continue
                        # A UNIT RESTATEMENT IS EXACT; AN APPROXIMATION IS NOISE.
                        # At scale 1 the grader itself would accept the literal,
                        # so its own tolerance is the whole test. Under a
                        # shifting, a loose absolute tolerance becomes a
                        # wildcard: a bare "180" degF matched a 0.176 porosity
                        # at x1000 because 0.18 is within 0.005 of it. A genuine
                        # restatement in another unit ROUNDS the value, so it
                        # must agree relatively as well.
                            if scale != 1.0:
                                rel = (abs(shifted - abs(expected))
                                       / max(abs(expected), 1e-30))
                                if rel > 1e-4:
                                    continue
                                # AND IT MUST BE WRITTEN PRECISELY ENOUGH TO BE ONE.
                                # A third false-positive class, found by
                                # re-running this gate over the 2026-09-16 recut.
                                # DCA's Expert prompt says "b = 1.2", an Arps
                                # exponent, and 1.2/1000 is EXACTLY the 0.0012 per
                                # day decline the Associate tier is graded on, so
                                # the relative test above cannot reject it. But
                                # "1.2" is written to one decimal: it carries
                                # +/- 0.05 of its own, which is +/- 5e-05 once
                                # shifted, against a tolerance of 2e-05. A number
                                # cannot restate a value it is not written
                                # precisely enough to resolve. The same quantity
                                # written "1.2000", or "0.0012", still matches.
                                if not exact and literal_quantum(raw) / scale > tol:
                                    continue
                            self_field = owner is not None and owner == key
                            findings.append({
                                'course': slug,
                                'surface': kind,
                                'owner': owner,
                                'prompt_tier': r['tier'],
                                'field_tier': gtier,
                                'key': key,
                                'literal': raw,
                                'value': v,
                                'expected': expected,
                                'tol': tol,
                                'tolerances': n,
                                'scale': slabel,
                                'cross_tier': gtier != r['tier'],
                                'downward': TIER_RANK[r['tier']] < TIER_RANK[gtier],
                                'accepted': n <= ACCEPT_TOL,
                                'self_field': self_field,
                                'exact_zero_tol': exact,
                                # A LABEL'S OWN NUMBER MATCHING ITS OWN FIELD IS
                                # NEVER A COINCIDENCE. The small-integer band
                                # exists because two small integers agreeing in
                                # prose has a high prior; a field's own label
                                # printing that field's own answer has none. It
                                # is the answer, written above the box it is
                                # typed into.
                                'small_int': (float(expected).is_integer()
                                              and abs(expected) < SMALL_INT_LIMIT
                                              and not self_field),
                            })
                            break

    if prompts_examined == 0:
        raise Refused('the sweep examined ZERO prompts. That is not a pass.')
    if numbers_examined == 0:
        raise Refused('the sweep found no numbers on any surface. That is not a pass.')
    if texts_examined['label'] == 0:
        raise Refused('the sweep examined ZERO labels. academy_get_capstone serves a '
                      'label for every graded field and the learner reads it above '
                      'the box, so a sweep that saw none read the wrong thing.')

    stats = {'courses': courses_examined, 'prompts': prompts_examined,
             'numbers': numbers_examined, 'fields': fields_total,
             'surfaces': dict(surfaces_examined), 'texts': dict(texts_examined)}
    return findings, stats


def rank(findings):
    """Worst first: a learner can type it, it belongs to another tier, it is
    not a small-integer coincidence."""
    def key(f):
        return (not (f['accepted'] and f['cross_tier'] and not f['small_int']),
                not f['accepted'], not f['cross_tier'], f['small_int'],
                f['tolerances'])
    return sorted(findings, key=key)


def dedupe(findings):
    """One row per (course, prompt tier, graded field).

    A prompt that states the same value twice, or that also matches the field
    again under a unit shifting, is ONE leak and not three. The first
    production run printed the DCA decline three times and the Completion
    space-out twice, which is the kind of noise that gets a gate ignored.
    Keep the most damning instance: accepted over near, unshifted over
    shifted, closest first.
    """
    best = {}
    for f in findings:
        k = (f['course'], f['surface'], f['owner'], f['prompt_tier'],
             f['field_tier'], f['key'])
        score = (not f['accepted'], f['scale'] != '', f['tolerances'])
        if k not in best or score < best[k][0]:
            best[k] = (score, f)
    return [v[1] for v in best.values()]


def report(findings, stats, quiet=False):
    findings = dedupe(findings)
    out = []
    sc = stats.get('surfaces', {})
    out.append(f"\nswept {stats['prompts']} prompt(s) across {stats['courses']} "
               f"course(s): {stats['numbers']} numbers against {stats['fields']} "
               f"graded fields, {len(SCALES)} unit shiftings")
    out.append(f"  learner-visible surfaces swept: {sc.get('prompt', 0)} prompts, "
               f"{sc.get('title', 0)} titles, {sc.get('dataset', 0)} datasets, "
               f"{sc.get('label', 0)} labels, {sc.get('unit', 0)} units")
    own = [f for f in findings if f['accepted'] and f['self_field'] and not f['small_int']]
    hard = [f for f in findings if f['accepted'] and f['cross_tier']
            and not f['small_int'] and not f['self_field']]
    soft = [f for f in findings if f['accepted'] and not f['cross_tier']
            and not f['small_int'] and not f['self_field']]
    for f in rank(own):
        out.append(f"  OWN-FIELD LEAK   {f['course']}: the {f['prompt_tier']} "
                   f"{f['surface']} of {f['key']} states {f['literal']}, which IS "
                   f"that field's graded answer {f['expected']} (tol {f['tol']})")
    near = [f for f in findings if not f['accepted'] and not f['small_int']
            and not f['self_field']]
    notes = [f for f in findings if f['small_int']]
    for f in rank(hard):
        via = '' if not f['scale'] else f" ({f['scale']})"
        out.append(f"  CROSS-TIER LEAK  {f['course']}: the {f['prompt_tier']} "
                   f"{f['surface']}"
                   + (f" of {f['owner']}" if f['owner'] else '')
                   + f" states {f['literal']}{via}, which the grader ACCEPTS for "
                   f"{f['field_tier']}.{f['key']} = {f['expected']} (tol {f['tol']})"
                   + ('  [DOWNWARD]' if f['downward'] else ''))
    for f in rank(soft):
        via = '' if not f['scale'] else f" ({f['scale']})"
        out.append(f"  SELF LEAK        {f['course']}: the {f['prompt_tier']} "
                   f"{f['surface']}"
                   + (f" of {f['owner']}" if f['owner'] else '')
                   + f" states {f['literal']}{via}, which the grader ACCEPTS for its "
                   f"own tier's {f['key']} = {f['expected']} (tol {f['tol']})")
    if not quiet:
        for f in rank(near)[:20]:
            where = f"{f['surface']}" + (f"[{f['owner']}]" if f['owner'] else '')
            out.append(f"  near ({f['tolerances']:.1f} tol) {f['course']} "
                       f"{f['prompt_tier']} {where} {f['literal']} ~ "
                       f"{f['field_tier']}.{f['key']} = {f['expected']}")
        for f in rank(notes)[:20]:
            where = f"{f['surface']}" + (f"[{f['owner']}]" if f['owner'] else '')
            out.append(f"  note (small integer) {f['course']} {f['prompt_tier']} {where} "
                       f"{f['literal']} ~ {f['field_tier']}.{f['key']} = {f['expected']}")
    out.append(f"\nown-field leaks: {len(own)}   cross-tier leaks: {len(hard)}   "
               f"self leaks: {len(soft)}   near misses: {len(near)}   "
               f"small-integer notes: {len(notes)}")
    return '\n'.join(out), (len(own) + len(hard) + len(soft))


# --------------------------------------------------------- negative control

SELFTEST_CLEAN = [
    {'app_slug': 'zz', 'tier': 'beginner', 'title': 'Read the ZZ ledger',
     'dataset': 'zz/ledger', 'fields': [
        {'key': 'b_rate', 'expected': 1234.5678, 'tol': 0.001,
         'label': 'Stage rate', 'unit': 'bbl/d'}],
     'prompt': 'Read the ledger for the ZZ field at a duty of 310 bbl/d and a '
               'gravity of 0.86, then give the stage rate.'},
    {'app_slug': 'zz', 'tier': 'intermediate', 'title': 'Head on the ZZ pump',
     'dataset': 'zz/pump', 'fields': [
        {'key': 'i_head', 'expected': 98765.4321, 'tol': 0.01,
         'label': 'Pump head', 'unit': 'ft'}],
     'prompt': 'For the same ZZ field, give the head the pump develops at the '
               'rate you found, with a stage count of 42.'},
    {'app_slug': 'zz', 'tier': 'advanced', 'title': 'Value ZZ',
     'dataset': 'zz/economics', 'fields': [
        {'key': 'a_npv', 'expected': 55555.5, 'tol': 0.5,
         'label': 'Net present value', 'unit': 'USD'}],
     'prompt': 'Value the ZZ development at a discount rate of 9 percent and '
               'state the net present value.'},
]


def selftest():
    ok = True

    def check(name, cond):
        nonlocal ok
        print(f'  {"PASS" if cond else "FAIL"}  {name}')
        ok = ok and cond

    print('negative control')

    # 1. clean set is clean
    findings, stats = sweep([dict(r) for r in SELFTEST_CLEAN])
    _, bad = report(findings, stats, quiet=True)
    check('a clean prompt set reports no leak', bad == 0)
    check('and it really did examine three prompts', stats['prompts'] == 3)

    # 2. plant a leak: the Associate prompt now states the Professional answer
    planted = [dict(r) for r in SELFTEST_CLEAN]
    planted[0] = dict(planted[0])
    planted[0]['prompt'] = (planted[0]['prompt']
                            + ' The head at that point is 98765.4321 ft.')
    findings, stats = sweep(planted)
    _, bad = report(findings, stats, quiet=True)
    hard = [f for f in findings if f['accepted'] and f['cross_tier']]
    check('a planted cross-tier leak goes RED', bad >= 1 and len(hard) >= 1)
    check('and it names the right field',
          any(f['key'] == 'i_head' and f['prompt_tier'] == 'beginner' for f in hard))

    # 3. remove it: clean again
    findings, stats = sweep([dict(r) for r in SELFTEST_CLEAN])
    _, bad = report(findings, stats, quiet=True)
    check('removing the planted leak goes green again', bad == 0)

    # 4. a leak stated in another unit is still a leak
    shifted = [dict(r) for r in SELFTEST_CLEAN]
    shifted[0] = dict(shifted[0])
    shifted[0]['prompt'] += ' The head is 98.7654321 thousand ft.'
    findings, _ = sweep(shifted)
    check('a leak restated at another unit scale is still caught',
          any(f['key'] == 'i_head' and f['accepted'] for f in findings))

    # 4b. the two false-positive classes the first production run exposed
    named = [dict(r) for r in SELFTEST_CLEAN]
    named[2] = dict(named[2])
    named[2]['prompt'] = ('Value the EJULEBE-1 and UMU-01 wells drilled 2031-01 '
                          'at a discount rate of 9 percent and state the value.')
    findings, _ = sweep(named)
    check('a number welded to a well name is not swept as a quantity',
          not any(f['literal'] in ('-1', '-01') for f in findings))

    loose = [dict(r) for r in SELFTEST_CLEAN]
    loose[0] = dict(loose[0])
    # 180 degF against a graded 0.17615: 0.18 is inside a 0.005 tolerance at
    # x1000, but it is not a restatement of it.
    loose[0]['fields'] = [{'key': 'phi', 'expected': 0.17615030026601647, 'tol': 0.005}]
    loose[0]['prompt'] = 'Read the sand at 180 degF and give the porosity.'
    findings, _ = sweep(loose)
    check('a loose approximation under a unit shifting is not called a leak',
          not any(f['accepted'] and f['key'] == 'phi' for f in findings))

    # 4c. An EXACT power-of-ten coincidence between a coarsely written literal
    # and a far smaller graded value. The relative test cannot reject this one,
    # because the agreement is exact; the written precision can.
    coarse = [dict(r) for r in SELFTEST_CLEAN]
    coarse[2] = dict(coarse[2])
    coarse[2]['fields'] = [{'key': 'a_decline', 'expected': 0.0012, 'tol': 2e-05}]
    coarse[2]['prompt'] = 'Book the EUR at a decline exponent b of 1.2 and state the value.'
    findings, _ = sweep(coarse)
    check('a coarsely written literal is not a unit restatement of a far smaller value',
          not any(f['accepted'] and f['key'] == 'a_decline' for f in findings))

    fine = [dict(r) for r in coarse]
    fine[2] = dict(fine[2])
    fine[2]['prompt'] = 'Book the EUR. The decline is 1.2000 per thousand days.'
    findings, _ = sweep(fine)
    check('the same shifting written to full precision is still caught',
          any(f['accepted'] and f['key'] == 'a_decline' for f in findings))

    # 4d. LABELS ARE SWEPT. A field's own label printing its own answer is the
    # worst shape there is: it sits directly above the box it is typed into.
    lab = [dict(r) for r in SELFTEST_CLEAN]
    lab[0] = dict(lab[0], fields=[dict(SELFTEST_CLEAN[0]['fields'][0],
                                       label='Stage rate, 1234.5678 bbl/d')])
    findings, _ = sweep(lab)
    check('a label that prints its own field answer goes RED',
          any(f['surface'] == 'label' and f['accepted'] and f['self_field']
              and f['key'] == 'b_rate' for f in findings))

    # 4e. and the small-integer excuse must NOT apply to it.
    si = [dict(r) for r in SELFTEST_CLEAN]
    si[1] = dict(si[1], fields=[{'key': 'i_stages', 'expected': 42, 'tol': 0.5,
                                 'label': 'Stage count (42 stages)', 'unit': 'count'}])
    findings, _ = sweep(si)
    check('a small-integer label matching its OWN field is not excused',
          any(f['surface'] == 'label' and f['accepted'] and not f['small_int']
              and f['key'] == 'i_stages' for f in findings))

    # 4f. a zero-tolerance field was skipped entirely by the old sweep.
    zt = [dict(r) for r in SELFTEST_CLEAN]
    zt[2] = dict(zt[2], fields=[{'key': 'a_nodes', 'expected': 174, 'tol': 0,
                                 'label': 'Block 1 node count', 'unit': 'count'}],
                 prompt='Count the live nodes, which the panel draws as 174 cells.')
    findings, _ = sweep(zt)
    check('a zero-tolerance field leaked on a surface is caught',
          any(f['key'] == 'a_nodes' and f['accepted'] and f['exact_zero_tol']
              for f in findings))

    # 4g. the title and the dataset are served to the browser too.
    td = [dict(r) for r in SELFTEST_CLEAN]
    td[0] = dict(td[0], dataset='zz/ledger, the 98765.4321 ft head case')
    findings, _ = sweep(td)
    check('a dataset string carrying another tier answer is caught',
          any(f['surface'] == 'dataset' and f['accepted'] and f['cross_tier']
              and f['key'] == 'i_head' for f in findings))

    # 5. REFUSALS. These are the whole point of the rewrite.
    def refuses(name, fn):
        try:
            fn()
        except Refused:
            check(name, True)
            return
        check(name, False)

    refuses('an empty record set is REFUSED, not passed',
            lambda: sweep([]))
    refuses('a course with no graded fields is REFUSED',
            lambda: sweep([{'app_slug': 'zz', 'tier': 'beginner',
                            'prompt': 'anything', 'fields': []}]))
    refuses('an empty prompt is REFUSED',
            lambda: sweep([{'app_slug': 'zz', 'tier': 'beginner', 'prompt': '   ',
                            'fields': [{'key': 'k', 'expected': 1.0, 'tol': 0.1}]}]))
    refuses('a prompt set with no numbers at all is REFUSED',
            lambda: sweep([{'app_slug': 'zz', 'tier': 'beginner',
                            'prompt': 'state the answer in words',
                            'fields': [{'key': 'k', 'expected': 1.0, 'tol': 0.1}]}]))
    refuses('an unknown course name is REFUSED',
            lambda: sweep([dict(r) for r in SELFTEST_CLEAN], course='nope'))
    refuses('a sweep that sees no labels at all is REFUSED',
            lambda: sweep([{'app_slug': 'zz', 'tier': 'beginner',
                            'prompt': 'Give the rate at 310 bbl/d.',
                            'fields': [{'key': 'k', 'expected': 1.0, 'tol': 0.1}]}]))

    # 6. the comment/apostrophe defect, end to end
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'mig.sql')
        open(p, 'w').write(
            "-- the engine's default straight line, an apostrophe in a comment\n"
            "insert into public.academy_capstones\n"
            "  (app_slug, tier, cert_tier, dataset, title, prompt, fields)\n"
            "values\n"
            "('zz','beginner','associate','ds','t',\n"
            " 'Give the rate. The head is 98765.4321 ft.',\n"
            " jsonb_build_array(jsonb_build_object('key','b_rate','label','l',"
            "'unit','u','expected',1234.5678,'tol',0.001))),\n"
            "('zz','intermediate','professional','ds','t',\n"
            " 'Give the head.',\n"
            " jsonb_build_array(jsonb_build_object('key','i_head','label','l',"
            "'unit','u','expected',98765.4321,'tol',0.01)))\n"
            "on conflict (app_slug, tier) do nothing;\n")
        recs = records_from_sql(p)
        check('an apostrophe in a -- comment no longer breaks quote pairing',
              len(recs) == 2 and recs[0]['prompt'].startswith('Give the rate.'))
        findings, _ = sweep(recs)
        check('and the leak in that file is found',
              any(f['key'] == 'i_head' and f['accepted'] and f['cross_tier']
                  for f in findings))

        bad_sql = os.path.join(d, 'bad.sql')
        open(bad_sql, 'w').write(
            "insert into public.academy_capstones (app_slug, tier) values ('zz','beginner');\n")
        refuses('a capstone INSERT missing prompt/fields is REFUSED',
                lambda: records_from_sql(bad_sql))

    print('\nnegative control: ' + ('ALL PASS' if ok else 'FAILURES ABOVE'))
    return 0 if ok else 1


# -------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(add_help=True, description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--db', action='store_true',
                    help='read the rows from the linked database (authoritative)')
    ap.add_argument('--sql', help='parse a course migration instead')
    ap.add_argument('--course', help='restrict to one app_slug')
    ap.add_argument('--workdir', default='.', help='directory linked to the project')
    ap.add_argument('--json', help='also write the findings as JSON here')
    ap.add_argument('--quiet', action='store_true', help='leaks only')
    ap.add_argument('--selftest', action='store_true',
                    help='run the negative control and exit')
    args = ap.parse_args()

    if args.selftest:
        return selftest()
    if not args.db and not args.sql:
        ap.print_help()
        return 2
    try:
        records = (records_from_db(args.workdir) if args.db
                   else records_from_sql(args.sql))
        findings, stats = sweep(records, args.course)
    except Refused as exc:
        print(f'\nREFUSED: {exc}')
        print('This gate does not pass on an empty or unreadable sweep.')
        return 2
    text, bad = report(findings, stats, args.quiet)
    print(text)
    if args.json:
        json.dump({'stats': stats, 'findings': rank(findings)},
                  open(args.json, 'w'), indent=1)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
