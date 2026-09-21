#!/usr/bin/env python3
"""GATE: the words digest section 24 legislates, over everything a learner reads.

Modelled on H1's gate_vocabulary.py (/root/hse-wip-safetystats). Section 24 of
digest.txt is "Vocabulary collisions, legislated before any lesson is written
(binding on every writer and reviewer)". Until this gate, nothing checked it.

RULES, each named in every breach it reports:

  * bare dose, first use: in every lesson (and every bank explanation) the FIRST
    "dose" must be "noise dose" (section 24 rule 1).
  * bare dose in a heading: a markdown heading, a manifest title, a bank prompt
    or a bank option may never carry "dose" without "noise" before it.
  * bare exposure: "exposure" must be qualified (rule 2): noise, chemical or heat
    exposure; or it is part of a published limit or metric name ("exposure
    limit", "exposure points", "exposure index", "exposure action value",
    "exposure limit value").
  * noise for a reading: "noise level" or "noise reading" (rule 3: a reading is
    a sound level).
  * bare exchange rate: "exchange rate" must be "decibel exchange rate" or "an
    exchange rate of N dB" (rule 4).
  * bare heat: "heat" must be "heat stress", "heat exposure" or the "NIOSH heat
    REL" (rule 5).
  * bare REL: "REL" must be "NIOSH noise REL" or "NIOSH heat REL" (the two
    misreadings paragraph).

EXEMPTIONS, every one counted and printed, none of them a free pass:

  * QUOTED ENGINE MESSAGES AND REGULATION QUOTES: a blockquote line ("> ..."),
    or a double-quoted span, is exempt ONLY IF its text is VERBATIM in the
    digest or the vendored golden. A quote the digest does not carry is swept
    like prose.
  * GOLDEN IDS: every id anywhere in the vendored exposure_cases.json (e.g.
    niosh-heat-example-rel) is an identifier, blanked where it stands.
  * CODE: a backtick span that is a single identifier (no whitespace), or whose
    text is verbatim in the digest, the golden or the engine source.
  * PANEL DIRECTIVES: {{panel:hy-heat-stress}} and its siblings are ids.
  * THE VOCABULARY-TEACHING LESSON, beginner m06 l02 (the words a report uses),
    which has to print the bare words it forbids. Its would-be breaches are
    counted and printed; an exemption that clears nothing is a DEAD row and
    fails the gate.

SWEPT AND GATED: every lesson body and every manifest title under the course
directory, and every bank JSON under <wave>/banks once banks exist. Markdown is
unwrapped before matching, so a phrase split across a hard wrap is still read.
REPORTED, NOT GATED: the digest outside section 24 and the NextGen lab, panels
and learning page, whose raw counts are printed for a human read (the digest is
generated and carries engine vocabulary; the rule's source is section 24 itself).

REFUSALS, exit 2: no digest, no section 24, no golden, no lesson directory, no
lesson file, or fewer than 500 lesson lines read.

    python3 gate_vocabulary.py [--plant]

--plant is THE NEGATIVE CONTROL: it puts, in memory, into the first lesson file
that is not the teaching lesson, a bare dose as its first line, a heading with
a bare dose and one line
each with a bare exposure, a noise level, a bare exchange rate, a bare heat and
a bare REL, and must exit 1 with all seven rules caught in that file.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import glob
import json
import os
import re
import sys

HERE = os.environ.get('H2_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
NG = os.environ.get('H2_NEXTGEN', '/root/wt-h2-nextgen')
COURSE = os.environ.get('H2_COURSE', os.path.join(NG, 'src/content/courses/hygiene'))
ENGINE = os.path.join(NG, 'packages/engines/engines/hse/exposure.js')
GOLDEN = os.path.join(NG, 'packages/engines/test-data/hse/goldens/exposure_cases.json')
APP = [os.path.join(NG, 'src/components/course/panels/hygiene', f) for f in
       ('NoiseDosimeterExplorer.jsx', 'ProtectionChemicalsExplorer.jsx', 'HeatStressExplorer.jsx',
        'hygieneKit.jsx', 'hygieneLab.js')] + [os.path.join(NG, 'src/pages/apps/HygieneLearningPage.jsx')]
TEACHING = 'beginner/m06-the-associate-capstone/l02-the-words-a-report-uses.md'
PLANT = '--plant' in sys.argv
for a in sys.argv[1:]:
    if a != '--plant':
        print(f'  GATE REFUSES: unknown argument {a}')
        sys.exit(2)

DOSE = re.compile(r'\bdoses?\b', re.I)
BARE_DOSE = re.compile(r'(?<!noise )\bdoses?\b', re.I)
RULES = [
    ('bare exposure', re.compile(
        r'(?<!noise )(?<!chemical )(?<!heat )\bexposures?\b'
        r'(?! (?:limits?|points|index|action values?|limit values?)\b)', re.I)),
    ('noise for a reading', re.compile(r'\bnoise (?:levels?|readings?)\b', re.I)),
    ('bare exchange rate', re.compile(r'(?<!decibel )\bexchange rates?\b(?! of \d+(?:\.\d+)? dB)', re.I)),
    ('bare heat', re.compile(r'\bheat\b(?! (?:stress|exposures?|REL)\b)', re.I)),
    ('bare REL', re.compile(r'(?<!noise )(?<!heat )\bRELs?\b')),
]
ALL_RULES = ['bare dose, first use', 'bare dose in a heading'] + [n for n, _ in RULES]


def die(msg):
    print(f'  GATE REFUSES: {msg}')
    sys.exit(2)


def need(p, what):
    if not os.path.exists(p):
        die(f'no {what} at {p}')
    return open(p, encoding='utf-8').read()


DIGEST = need(os.path.join(HERE, 'digest.txt'), 'digest')
if not re.search(r'(?m)^# SECTION 24: Vocabulary collisions', DIGEST):
    die('digest section 24 (Vocabulary collisions) is not in the digest, so the rule has no source')
GOLD_TEXT = need(GOLDEN, 'vendored golden')
ENGINE_TEXT = need(ENGINE, 'vendored engine')
_ids = set()


def _walk_ids(n):
    if isinstance(n, dict):
        if isinstance(n.get('id'), str):
            _ids.add(n['id'])
        for v in n.values():
            _walk_ids(v)
    elif isinstance(n, list):
        for v in n:
            _walk_ids(v)


_walk_ids(json.loads(GOLD_TEXT))
GOLDEN_IDS = sorted(_ids, key=len, reverse=True)
if len(GOLDEN_IDS) < 100:
    die(f'only {len(GOLDEN_IDS)} golden case ids read')
GOLD_ID_RX = re.compile(r'(?<![\w-])(?:' + '|'.join(re.escape(i) for i in GOLDEN_IDS) + r')(?![\w-])')
VERBATIM = (DIGEST, GOLD_TEXT)
STATS = {'blockquotes exempt (verbatim engine or regulation text)': 0, 'blockquotes swept (not verbatim)': 0,
         'double-quoted spans exempt (verbatim)': 0, 'code spans exempt': 0, 'code spans swept': 0,
         'golden ids blanked': 0, 'panel directives blanked': 0}


def blank(m):
    return ' ' * len(m.group(0))


def unwrap(text):
    return re.sub(r'(?<=\S)\n(?=[^\n#|\-*>{\d])', ' ', text)


def exempt(text):
    """Blank what is exempt, counting each kind; everything else is left to be swept."""
    out = []
    for line in text.split('\n'):
        if line.startswith('> '):
            if any(line[2:].strip() in v for v in VERBATIM):
                STATS['blockquotes exempt (verbatim engine or regulation text)'] += 1
                out.append(' ' * len(line))
                continue
            STATS['blockquotes swept (not verbatim)'] += 1
        out.append(line)
    text = '\n'.join(out)

    def code(m):
        inner = m.group(0)[1:-1]
        if not re.search(r'\s', inner) or any(inner in v for v in VERBATIM + (ENGINE_TEXT,)):
            STATS['code spans exempt'] += 1
            return blank(m)
        STATS['code spans swept'] += 1
        return m.group(0)
    text = re.sub(r'`[^`\n]+`', code, text)

    def quoted(m):
        inner = m.group(0)[1:-1]
        if any(inner in v for v in VERBATIM):
            STATS['double-quoted spans exempt (verbatim)'] += 1
            return blank(m)
        return m.group(0)
    text = re.sub(r'"[^"\n]+"|“[^”\n]+”', quoted, text)

    def pan(m):
        STATS['panel directives blanked'] += 1
        return blank(m)
    text = re.sub(r'\{\{panel:[\w-]+\}\}', pan, text)

    def gid(m):
        STATS['golden ids blanked'] += 1
        return blank(m)
    return GOLD_ID_RX.sub(gid, text)


def sweep(label, text, hits, first_use=True, headings_only_dose=False):
    """headings_only_dose: the text is all headings/titles/prompts/options, so any bare dose is a breach."""
    # Titles, prompts and options are one item per line: never joined.
    body = exempt(text if headings_only_dose else unwrap(text))
    lines = body.split('\n')
    if first_use and not headings_only_dose:
        m = DOSE.search(body)
        if m and not re.search(r'noise\s$', body[:m.start()], re.I):
            ln = body[:m.start()].count('\n') + 1
            hits.append((label, ln, 'bare dose, first use', lines[ln - 1].strip()[:120]))
    for i, line in enumerate(lines, 1):
        if (headings_only_dose or line.startswith('#')) and BARE_DOSE.search(line):
            hits.append((label, i, 'bare dose in a heading', line.strip()[:120]))
        for name, rx in RULES:
            for _ in rx.finditer(line):
                hits.append((label, i, name, line.strip()[:120]))


def main():
    if not os.path.isdir(COURSE):
        die(f'no lesson directory at {COURSE}')
    lesson_paths = sorted(glob.glob(os.path.join(COURSE, '**', '*.md'), recursive=True))
    if not lesson_paths:
        die(f'no lesson file under {COURSE}')
    hits, teaching_hits, lines, manifests = [], [], 0, 0
    plant_file = None
    for p in lesson_paths:
        rel = os.path.relpath(p, COURSE)
        t = open(p, encoding='utf-8').read()
        lines += t.count('\n') + 1
        if rel == TEACHING:
            sweep(rel, t, teaching_hits)
            continue
        if PLANT and plant_file is None:
            plant_file = rel
            t = 'A planted dose line comes first.\n\n' + t + ('\n## The planted dose heading\n\nA planted exposure line. A planted noise level of 91 dBA.\n'
                  'A planted exchange rate line. A planted heat line. A planted REL line.\n')
        sweep(rel, t, hits)
    for p in sorted(glob.glob(os.path.join(COURSE, '*', 'manifest.json'))):
        m = json.load(open(p, encoding='utf-8'))
        titles = [mm['title'] for mm in m.get('modules', [])] + \
                 [l['title'] for mm in m.get('modules', []) for l in mm.get('lessons', [])]
        sweep(os.path.relpath(p, COURSE), '\n'.join(titles), hits, headings_only_dose=True)
        manifests += 1
    if manifests != 3:
        die(f'{manifests} tier manifests read, expected 3')
    bank_texts = 0
    bdir = os.path.join(HERE, 'banks')
    bank_files = sorted(glob.glob(os.path.join(bdir, '*.json'))) if os.path.isdir(bdir) else []
    for p in bank_files:
        qs = json.load(open(p, encoding='utf-8'))
        qs = qs if isinstance(qs, list) else qs.get('questions', [])
        for k, q in enumerate(qs):
            lab = f'{os.path.basename(p)}#{k}'
            heads = [q.get('prompt')] + list(q.get('options') or [])
            heads = [str(h) for h in heads if h is not None]
            bank_texts += len(heads)
            sweep(lab, '\n'.join(heads), hits, headings_only_dose=True)
            if isinstance(q.get('explanation'), str):
                bank_texts += 1
                sweep(lab + ' explanation', q['explanation'], hits)
    # REPORTED, NOT GATED
    notes = []
    parts = re.split(r'(?m)^(# SECTION 2[45]:.*)$', DIGEST)
    digest_wo24 = parts[0] + parts[3] + parts[4] if len(parts) >= 5 else DIGEST
    sweep('digest.txt (section 24 set aside)', digest_wo24, notes, first_use=False)
    for p in APP:
        if not os.path.exists(p):
            die(f'the app source {p} is missing')
        sweep(os.path.relpath(p, NG), open(p, encoding='utf-8').read(), notes, first_use=False)

    print(f'gate_vocabulary EXAMINED: {len(lesson_paths)} lesson files ({lines} lines) under {COURSE}, '
          f'{manifests} manifests, {len(bank_files)} bank files ({bank_texts} texts{"; no banks exist yet" if not bank_files else ""}); '
          f'rules: {", ".join(ALL_RULES)}')
    print('  exemptions: ' + '; '.join(f'{k} {v}' for k, v in STATS.items()) + f'; golden ids known {len(GOLDEN_IDS)}')
    print(f'  the vocabulary-teaching lesson {TEACHING} is exempt: {len(teaching_hits)} would-be breach(es) there, '
          f'by rule {sorted({h[2] for h in teaching_hits})}')
    by = {}
    for h in notes:
        by[h[2]] = by.get(h[2], 0) + 1
    print(f'  REPORTED, NOT GATED (digest outside section 24, the lab, panels and learning page): {len(notes)} raw match(es) '
          f'{dict(sorted(by.items()))}')
    if lines < 500:
        die(f'only {lines} lesson lines read; too little to have checked anything')
    if not teaching_hits:
        print(f'  GATE FAILS: the exemption for {TEACHING} clears nothing, a dead row')
        return 1
    print(f'  BREACHES: {len(hits)}')
    for h in hits[:60]:
        print(f'   {h[2].upper()} {h[0]}:{h[1]}  {h[3]}')
    if PLANT:
        got = {h[2] for h in hits if h[0] == plant_file}
        print(f'  NEGATIVE CONTROL: planted in {plant_file}; expected all {len(ALL_RULES)} rules caught, got {sorted(got)}')
        return 1 if got >= set(ALL_RULES) else 2
    print(f'gate_vocabulary: {len(hits)} breach(es).')
    return 1 if hits else 0


sys.exit(main())
