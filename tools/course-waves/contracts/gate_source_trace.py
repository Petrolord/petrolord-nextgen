#!/usr/bin/env python3
"""GATE: THE SOURCE TRACE. Every lesson and every keyed answer traces to a
cited passage of the pack, every passage to a dated source, and every figure
to the text it was read from.

A practice course has no engine to call, so this gate is what the key-truth
audit and the engine gates are for an engine course. It checks, and prints:

  1. THE PACK REPRODUCES. build_pack.py --check: PACK.md and SOURCES.md are
     byte for byte what the generator writes from SOURCES.json and
     passages.json.
  2. EVERY SOURCE IS DATED AND PINNED. Each carries a title, publisher,
     edition, licence, a quote policy of quote, short-quote or concept, and a
     read date no later than the wave's sources_checked_on; a fetched file
     exists and its sha256 is the one recorded; a source no passage cites is a
     dead row and fails, unless it is a cross-check copy of another source in
     the table (cross_check_of), which no passage may cite.
  3. NO INVENTED FIGURE. Every number in a BY CONCEPT passage appears as a
     number in its source's fetched text (or, for a concept-only source with no
     text, in its title and edition). Quoted passages are checked word for word
     by gate_quotes.py.
  4. NIGERIAN LAW IS CITED BY SECTION. A passage from a Nigerian Act or
     regulation carries a section, regulation, schedule or part in its locator
     (a regulator's guideline is cited by its own part, step or page).
  5. EVERY LESSON TRACES. TRACE.json names all 78 lessons. A stub (its H1
     alone) may carry an empty trace; a written lesson carries at least two
     passage ids, all real, at least one on a topic structure.py gives that
     lesson. At the lessons stage and later, no stub is left.
  6. EVERY KEY TRACES. Each of the 21 banks is executed with a stand-in
     bankkit: every question carries at least one real passage id. At the
     foundation a bank may be empty; from the banks stage it holds exactly its
     declared count.
  7. NO PASSAGE ID OR PACK SECTION IN LEARNER TEXT. Lessons, manifest titles,
     bank strings and the course pages never name P001-style ids, the pack or
     a numbered section.

    python3 gate_source_trace.py [--plant-figure | --plant-trace | --plant-leak | --plant-sha]
    SC5_STAGE=lessons|banks|final python3 gate_source_trace.py

Each --plant is a NEGATIVE CONTROL applied in memory, and must exit 1 with its
plant caught. Exit 0 clean, 1 a breach, 2 could not run.
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import packlib as K

# A Nigerian ACT OR REGULATION (a guideline is cited by its part, step or page).
NG_SOURCE = re.compile(r'^(?=.*(?:Nigeria|Nigerian|Public Procurement Act 2007|Arbitration and Mediation Act))(?=.*\b(?:Act|Regulations?)\b)', re.I)
NG_LOCATOR = re.compile(r'\b(?:s|ss|section|sections|reg|regs|regulation|regulations|schedule|part|para|paragraph|article|art)\b\.?', re.I)
NUM = re.compile(r'\d+(?:\.\d+)?')
LEAK = re.compile(r'\bP\d{3}\b|PACK\.md|\bthe (?:source )?pack\b|\bSECTION \d+\b')


def main():
    argv = sys.argv[1:]
    plant = next((a for a in argv if a.startswith('--plant')), None)
    fails, notes = [], []

    # 1. the pack reproduces
    r = subprocess.run([sys.executable, os.path.join(K.HERE, 'build_pack.py'), '--check'], capture_output=True, text=True, cwd=K.HERE)
    notes.append(r.stdout.strip() or r.stderr.strip())
    if r.returncode != 0:
        fails.append(('pack', 'PACK.md or SOURCES.md does not reproduce from build_pack.py'))

    try:
        srcs = K.sources()
        ps = [dict(p) for p in K.passages()]
    except FileNotFoundError as e:
        print(f'  GATE REFUSES: {e}')
        return 2
    by = {s['id']: s for s in srcs}
    pid = {p['id']: p for p in ps}
    if not ps or not srcs:
        print('  GATE REFUSES: no passage or no source')
        return 2

    # 2. sources dated and pinned
    if plant == '--plant-sha':
        f = next(s for s in srcs if s.get('file'))
        f['sha256'] = '0' * 64
    for s in srcs:
        for k in ('id', 'title', 'publisher', 'edition', 'licence', 'quote_policy', 'date_read'):
            if not s.get(k):
                fails.append((s.get('id', '?'), f'source carries no {k}'))
        if s.get('quote_policy') not in ('quote', 'short-quote', 'concept'):
            fails.append((s['id'], f"quote policy {s.get('quote_policy')} is not quote, short-quote or concept"))
        if str(s.get('date_read', '9999'))[:10] > K.WAVE['sources_checked_on']:
            fails.append((s['id'], f"read {s.get('date_read')}, after the pack's check date {K.WAVE['sources_checked_on']}"))
        if s.get('file'):
            p = os.path.join(K.SRC_DIR, s['file'])
            if not os.path.exists(p):
                fails.append((s['id'], f'its file {s["file"]} is missing'))
            else:
                got = hashlib.sha256(open(p, 'rb').read()).hexdigest()
                if got != s.get('sha256'):
                    fails.append((s['id'], f'sha256 of {s["file"]} is {got[:12]}, recorded {str(s.get("sha256"))[:12]}'))
            if not s.get('url'):
                fails.append((s['id'], 'a fetched source carries no URL'))
    cited = {p['source'] for p in ps}
    for s in srcs:
        if s['id'] not in cited and not s.get('cross_check_of'):
            fails.append((s['id'], 'no passage cites this source: a dead row'))
        if s.get('cross_check_of') and (s['id'] in cited or s['cross_check_of'] not in by):
            fails.append((s['id'], f"a cross-check copy of {s['cross_check_of']} is cited, or checks a source that is not in the table"))

    # 3. no invented figure
    if plant == '--plant-figure':
        p = next(p for p in ps if p['mode'] == 'paraphrase' and by[p['source']].get('txt'))
        p['text'] += ' A notice must be given within 4731 days.'
    texts = {}
    nfig = 0
    for p in ps:
        if p['mode'] != 'paraphrase':
            continue
        s = by.get(p['source'])
        if s is None:
            fails.append((p['id'], f"unknown source {p['source']}"))
            continue
        if s['id'] not in texts:
            t = K.source_text(s)
            texts[s['id']] = set(NUM.findall(t)) if t is not None else set(NUM.findall(f"{s['title']} {s['edition']}"))
        for n in NUM.findall(p['text']):
            nfig += 1
            if n not in texts[s['id']]:
                fails.append((p['id'], f'the figure {n} is not in the text of {s["id"]}'))

    # 4. Nigerian law by section
    nng = 0
    for p in ps:
        s = by.get(p['source'], {})
        if NG_SOURCE.search(s.get('title', '')) and s.get('quote_policy') != 'concept':
            nng += 1
            if not NG_LOCATOR.search(p['locator']):
                fails.append((p['id'], f"a Nigerian text cited without a section or regulation: {p['locator']}"))

    # 5. lessons trace
    tpath = os.path.join(K.HERE, 'TRACE.json')
    if not os.path.exists(tpath):
        print(f'  GATE REFUSES: {tpath} is missing')
        return 2
    trace = json.load(open(tpath, encoding='utf-8'))
    ls = K.lessons()
    if plant == '--plant-trace':
        t0, m0, l0 = ls[0][:3]
        trace[f'{t0}/{m0}/{l0}'] = ['P999']
        ls[1] = ls[1][:6] + (ls[1][6] + '\nA written paragraph with no trace behind it.\n',)
    keys = {f'{l[0]}/{l[1]}/{l[2]}' for l in ls}
    if set(trace) != keys:
        fails.append(('TRACE.json', f'names {len(set(trace) & keys)} of the 78 lessons and {len(set(trace) - keys)} unknown keys'))
    stubs = written = 0
    for tier, mkey, lkey, title, topics, path, text in ls:
        k = f'{tier}/{mkey}/{lkey}'
        ids = trace.get(k, [])
        for i in ids:
            if i not in pid:
                fails.append((k, f'traces to {i}, which is no passage'))
        if text is None:
            fails.append((k, 'the lesson file is missing'))
        elif K.is_stub(text, title):
            stubs += 1
            if K.STAGE != 'foundation':
                fails.append((k, f'still a stub at the {K.STAGE} stage'))
        else:
            written += 1
            real = [i for i in ids if i in pid]
            if len(real) < 2:
                fails.append((k, f'a written lesson traces to {len(real)} passage(s); at least two are required'))
            elif not any(set(pid[i]['topics']) & set(topics) for i in real):
                fails.append((k, f'no traced passage is on the lesson\'s topics {topics}'))

    # 6. keys trace
    nq = 0
    for tier, bid, stem, n in K.S.banks():
        b = K.read_bank(os.path.join(K.BANKS, f'{stem}.py'))
        Q, T = b['Q'], b['TRACE']
        if Q is None or T is None or len(Q) != len(T):
            fails.append((stem, 'the bank does not keep one trace per question (Q and TRACE)'))
            continue
        if b['emit_path'] != os.path.join('/root/cat-wip-contracts/banks', f'{stem}.json') or b['expect_n'] != n:
            fails.append((stem, f"emits to {b['emit_path']} expecting {b['expect_n']}; structure.py declares {n}"))
        if K.STAGE in ('banks', 'final') and len(Q) != n:
            fails.append((stem, f'holds {len(Q)} of its {n} questions at the {K.STAGE} stage'))
        for i, ids in enumerate(T, 1):
            nq += 1
            if not ids:
                fails.append((stem, f'Q{i} traces to no passage'))
            for x in ids:
                if x not in pid:
                    fails.append((stem, f'Q{i} traces to {x}, which is no passage'))

    # 7. no passage id or pack section in learner text
    learner = [(f'{l[0]}/{l[1]}/{l[2]}.md', l[6]) for l in ls if l[6]] + K.manifest_titles() + K.bank_strings()
    for p in K.APP_TEXT:
        learner.append((os.path.relpath(p, K.REPO), open(p, encoding='utf-8').read()))
    if plant == '--plant-leak':
        learner.append(('planted lesson', 'The notice period is set out in P012, see SECTION 14 of the pack.'))
    nleak = 0
    for label, t in learner:
        for m in LEAK.finditer(t):
            nleak += 1
            fails.append((label, f'names {m.group(0)!r} in learner text'))

    print('  ' + '\n  '.join(notes))
    print(f'  sources: {len(srcs)} ({sum(1 for s in srcs if s.get("file"))} with a fetched file); passages: {len(ps)} '
          f'({sum(1 for p in ps if p["mode"] == "quote")} quoted, {sum(1 for p in ps if p["mode"] == "paraphrase")} by concept)')
    print(f'  figures checked in by-concept passages: {nfig}; Nigerian passages checked for a section: {nng}')
    print(f'  lessons: {len(ls)} ({stubs} stubs, {written} written), traced ids: {sum(len(v) for v in trace.values())}; '
          f'bank questions traced: {nq}; learner sources swept for ids: {len(learner)}')
    print(f'  stage: {K.STAGE}')
    print(f'  BREACHES: {len(fails)}')
    for w, why in fails[:60]:
        print(f'   {w}: {why}')
    if plant:
        want = {'--plant-figure': 'is not in the text', '--plant-trace': 'P999', '--plant-leak': 'planted lesson', '--plant-sha': 'sha256'}[plant]
        caught = [f for f in fails if want in f[0] or want in f[1]]
        extra = plant == '--plant-trace' and not any('passage(s); at least two' in f[1] for f in fails)
        print(f'  NEGATIVE CONTROL {plant}: caught {len(caught)}' + ('; the untraced written paragraph was NOT caught' if extra else ''))
        return 1 if caught and not extra else 2
    return 1 if fails else 0


sys.exit(main())
