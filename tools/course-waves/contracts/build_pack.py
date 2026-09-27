#!/usr/bin/env python3
"""BUILD THE SC5 SOURCE PACK: PACK.md (the course's only teaching truth) and
SOURCES.md (the dated, cited source table), from sources/SOURCES.json and
passages.json.

A PRACTICE COURSE HAS NO ENGINE, so it has no engine digest. PACK.md replaces
it: every passage a lesson may teach from and a key may rest on, numbered
(P001 onward), with its source, the edition, the locator (section, regulation,
paragraph or page) and its mode:

  * QUOTED, a public text whose licence allows quotation, word for word as the
    fetched text prints it (gate_quotes.py checks every one against the text);
  * BY CONCEPT, the course's own words for a licensed or reserved text, or for
    a public text where a paraphrase reads better; attributed, never quoted.

Plus the vocabulary the course legislates, the register of synthetic Ekene
contracts every scenario is set in, a register of every figure the pack
carries with the passage it comes from, and the seams with other courses.

Each topic section's owner clause is BUILT from structure.py (the modules
whose lessons name that topic), never typed, and the build refuses a topic no
lesson teaches or a passage whose topic is unknown.

    python3 build_pack.py           write PACK.md and SOURCES.md
    python3 build_pack.py --check   write nothing; exit 1 if either differs

Learner text never cites a passage id or a pack section; it cites the source.
"""
import importlib.util
import json
import os
import re
import sys

HERE = os.environ.get('SC5_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('structure', os.path.join(HERE, 'structure.py'))
S = importlib.util.module_from_spec(spec)
spec.loader.exec_module(S)
WAVE = json.load(open(os.path.join(HERE, 'wave.json'), encoding='utf-8'))
SOURCES = json.load(open(os.path.join(HERE, 'sources', 'SOURCES.json'), encoding='utf-8'))
PASSAGES = json.load(open(os.path.join(HERE, 'passages.json'), encoding='utf-8'))['passages']

TOPIC_TITLES = {
    'T01': 'Contract management, its lifecycle and its roles',
    'T02': 'Award handover, the contract management plan and mobilisation',
    'T03': 'Reading the contract: scope, price basis, precedence and working clauses',
    'T04': 'Key performance indicators and service levels',
    'T05': 'Payment, records and the audit trail',
    'T06': 'Supplier segmentation and relationship management',
    'T07': 'Supplier performance reviews and poor performance',
    'T08': 'Variations, change control and contract modifications',
    'T09': 'Supplier risk, financial standing and resilience',
    'T10': 'Nigerian content obligations in execution',
    'T11': 'Contract strategy',
    'T12': 'Claims',
    'T13': 'Disputes and their resolution',
    'T14': 'Termination, step-in, exit and distress',
    'T15': 'Completion, close-out and lessons learned',
    'T16': 'Integrity, conflicts of interest, fraud and corruption',
}

# The synthetic Ekene contracts every scenario is set in. OURS, labelled
# synthetic: no real company, person, contract, price or incident. A figure
# here is a term of a synthetic contract, never a legal figure; a legal figure
# is only ever a passage with its citation.
EKENE_CONTRACTS = [
    ('EKC-01', 'Well services call-off framework',
     'Coiled tubing, nitrogen and pumping services on the Ekene wells, ordered by call-off under a framework agreement '
     'with supplier WS-A (synthetic). Priced from a schedule of rates. The framework states key performance indicators '
     'for mobilisation on time, non-productive time caused by the supplier and safety reporting, a quarterly performance '
     'review, and a Nigerian content plan with quarterly reporting.'),
    ('EKC-02', 'Platform supply vessel time charter',
     'One platform supply vessel on time charter from supplier MV-B (synthetic), paid a day rate with off-hire for '
     'breakdown. The charter states the vessel\'s availability as its service level, and a crew complement with named '
     'positions for Nigerian seafarers and trainees.'),
    ('EKC-03', 'Camp catering and facility services',
     'Catering, housekeeping and camp maintenance at the Ekene shore base from supplier CF-C (synthetic) for a fixed '
     'monthly fee, with service levels for meal service, cleanliness audits and response to maintenance requests, and '
     'service credits deducted from the monthly fee when a level is missed.'),
    ('EKC-04', 'Casing and tubulars frame agreement',
     'Casing and tubing supplied by supplier TB-D (synthetic) at stated unit prices per item, with delivery lead times '
     'stated per order. TB-D is the only supplier qualified for one premium connection the Ekene well designs use.'),
    ('EKC-05', 'Flowline replacement works',
     'Replacement of flowlines at the Ekene manifold by supplier FW-E (synthetic) for a lump sum paid against milestones, '
     'with a retention held from each payment until completion, a performance security, a defects period, and a '
     'Nigerian content plan in the contract covering fabrication and labour.'),
    ('EKC-06', 'Instrument maintenance service',
     'Planned and corrective maintenance of field instruments by supplier IM-F (synthetic), reimbursed at stated '
     'hourly rates plus materials at cost, with key performance indicators for planned work completed and repeat '
     'failures, and a monthly service report.'),
    ('EKC-07', 'Environmental monitoring consultancy',
     'Quarterly environmental sampling and reporting by supplier EM-G (synthetic), paid a time-based fee against '
     'approved timesheets, with a named key person and a report acceptance step.'),
]

VOCABULARY = [
    ('the content Act', 'The Nigerian Oil and Gas Industry Content Development Act 2010. Each Act is named; "the Act" alone is not used.'),
    ('the Procurement Act', 'Nigeria\'s Public Procurement Act 2007. The UK Procurement Act 2023 is always named with its country and year.'),
    ('the Board', 'The Nigerian Content Development and Monitoring Board. "The Bureau" is the Bureau of Public Procurement.'),
    ('variation, change, modification', 'The contract\'s own word comes first. "Modification" is the UK Act\'s word for a change to a public contract after award.'),
    ('KPI', 'A key performance indicator the contract states. A measure the contract does not state is a management measure and carries no contractual remedy.'),
    ('service level, service credit', 'A service level is a stated standard of service; a service credit is the stated deduction the contract applies when a level is missed.'),
    ('claim, dispute', 'A claim is a request for more time or money under the contract. A dispute is a claim or other matter the parties have not agreed.'),
    ('contract manager, contract owner', 'The contract manager runs the contract day to day; the contract owner is accountable for the outcome it buys. Each contract names its own roles.'),
    ('synthetic', 'Every Ekene contract, supplier and figure in a scenario is synthetic teaching data and says so.'),
]

SEAMS = [
    'Tender evaluation, the award decision, the lowest evaluated cost, the cost of lump-sum, reimbursable and day-rate '
    'contracts under uncertainty, should-cost and Nigerian content at the tender (the content Act s.14 and s.16) belong '
    'to the procurement course, Procurement, Tendering & Contracting.',
    'Inventory, spares and stock policy belong to the materials course; vessel fleets and voyage planning to the marine course.',
    'Joint operating agreements, cash calls and partner consent belong to the joa course; gas sales agreements to the gsa course.',
    'Risk registers and management of change as a discipline belong to the riskchange course; audit as a discipline to the compliance course.',
    'This course computes nothing: it has no engine, no calculator and no numeric capstone. It states no legal figure that a passage does not carry with its citation.',
]


def refuse(msg):
    sys.exit(f'build_pack REFUSES: {msg}')


def owners():
    """topic -> 'Associate m01, m06; Expert m06', built from structure.py."""
    out = {}
    for tier, mods in S.TIERS.items():
        for mi, (mkey, _mt, lessons) in enumerate(mods, 1):
            for t in sorted({t for l in lessons for t in l[3]}):
                out.setdefault(t, {}).setdefault(S.TIER_NAMES[tier], []).append(f'm{mi:02d}')
    return {t: '; '.join(f'{tn} {", ".join(ms)}' for tn, ms in d.items()) for t, d in out.items()}


def src_label(s):
    return f"{s['title']} ({s['edition']})"


def render_passage(p, src):
    head = f"[{p['id']}] {p['source']}, {src_label(src)}, {p['locator']}."
    if p['mode'] == 'quote':
        return f'{head} Quoted: "{p["text"]}"'
    return f'{head} By concept: {p["text"]}'


FIG = re.compile(r'\b\d[\d,.]*\s*(?:percent|per cent|%|days?|months?|years?|weeks?|hours?)?', re.I)


def build():
    by_src = {s['id']: s for s in SOURCES}
    if len(by_src) != len(SOURCES):
        refuse('a source id is repeated')
    ids = [p['id'] for p in PASSAGES]
    if ids != [f'P{i:03d}' for i in range(1, len(ids) + 1)]:
        refuse('passage ids are not P001 onward in order with no gap')
    own = owners()
    for t in S.TOPICS:
        if t not in TOPIC_TITLES:
            refuse(f'topic {t} has no title')
        if t not in own:
            refuse(f'topic {t} is taught by no lesson')
    for p in PASSAGES:
        if p['source'] not in by_src:
            refuse(f'{p["id"]} cites an unknown source {p["source"]}')
        if p['mode'] not in ('quote', 'paraphrase'):
            refuse(f'{p["id"]} has an unknown mode {p["mode"]}')
        for t in p['topics']:
            if t not in TOPIC_TITLES:
                refuse(f'{p["id"]} names an unknown topic {t}')
        if not p.get('locator'):
            refuse(f'{p["id"]} has no locator')
    L = []
    L.append('SC5 CONTRACT & SUPPLIER MANAGEMENT: THE SOURCE PACK')
    L.append(f"Course {WAVE['slug']}, module {WAVE['module']}, path order {WAVE['path_order']}; a PRACTICE COURSE (no engine, no calculator, no numeric capstone).")
    L.append(f"Sources checked on {WAVE['sources_checked_on']}. Review due by {WAVE['review_date']}.")
    L.append(f'{len(SOURCES)} sources, {len(PASSAGES)} passages ({sum(1 for p in PASSAGES if p["mode"] == "quote")} quoted, '
             f'{sum(1 for p in PASSAGES if p["mode"] == "paraphrase")} by concept). Generated by build_pack.py; never edit by hand.')
    L.append('')
    n = 0

    def section(title, owner='every tier'):
        nonlocal n
        n += 1
        L.append(f'# SECTION {n}: {title} (owned by {owner})')

    section('How this pack is used')
    L += [
        'Every lesson teaches from these passages and every keyed answer rests on at least one of them. A writer records',
        'the passage ids a lesson rests on in TRACE.json and the ids a key rests on beside the question. Learner text',
        'cites the SOURCE (an Act and its section, a regulation, a guidance and its paragraph); passage ids and the',
        'sections of this pack stay out of it. A QUOTED passage may be quoted in a lesson word for word with its citation. A BY CONCEPT',
        'passage is taught in the course\'s own words with its citation and is never quoted. A figure a lesson needs that',
        'no passage carries is not written. The Ekene contracts are synthetic and every scenario says so.',
        '',
    ]
    section('Sources, editions, licences and the dates they were read')
    for s in SOURCES:
        sha = (s.get('sha256') or '')[:12] or 'no file (concept only)'
        L.append(f"{s['id']} | {s['title']} | {s['publisher']} | {s['edition']} | licence: {s['licence']} | "
                 f"quoting: {s['quote_policy']} | sha256 {sha} | read {s['date_read']} | {s.get('url') or 'no public copy'}")
    L.append('')
    section('Vocabulary')
    for term, rule in VOCABULARY:
        L.append(f'{term}: {rule}')
    L.append('')
    section('The synthetic Ekene contracts')
    for cid, title, body in EKENE_CONTRACTS:
        L.append(f'{cid} {title} (synthetic). {body}')
    L.append('')
    for t in S.TOPICS:
        section(TOPIC_TITLES[t], own[t])
        ps = [p for p in PASSAGES if t in p['topics']]
        if len(ps) < 4:
            refuse(f'topic {t} carries {len(ps)} passages, and every topic needs at least four')
        for p in ps:
            L.append(render_passage(p, by_src[p['source']]))
        L.append('')
    section('Figures register')
    L.append('Every figure a passage carries, with the passage and its source. No other legal figure may be taught.')
    for p in PASSAGES:
        figs = [m.group(0).strip().rstrip('.,') for m in FIG.finditer(p['text'])]
        if figs:
            L.append(f"[{p['id']}] {p['source']} {p['locator']}: {'; '.join(dict.fromkeys(figs))}")
    L.append('')
    section('What this course does not teach, and where it is taught')
    L += SEAMS
    L.append('')
    pack = '\n'.join(L)

    M = ['# SC5 Contract & Supplier Management: sources', '',
         f"Every text the course teaches from, with its edition, URL, licence, the sha256 of the file read and the date it was read. "
         f"Sources checked on {WAVE['sources_checked_on']}; the course is due for review by {WAVE['review_date']}. Generated by "
         'build_pack.py from sources/SOURCES.json; never edit by hand.', '',
         '| id | title | edition | URL | licence | quoting | sha256 (12) | read | used for |',
         '| --- | --- | --- | --- | --- | --- | --- | --- | --- |']
    for s in SOURCES:
        used = s.get('used_for')
        used = ', '.join(used) if isinstance(used, list) else (used or '')
        cells = [s['id'], f"{s['title']} ({s['publisher']})", s['edition'], s.get('url') or 'none (concept only)', s['licence'],
                 s['quote_policy'], (s.get('sha256') or '')[:12] or 'no file', s['date_read'], used]
        M.append('| ' + ' | '.join(str(c).replace('|', '/').replace('\n', ' ') for c in cells) + ' |')
    M.append('')
    M.append('Quoting: `quote` a public text quoted word for word with its citation; `short-quote` a text that may be quoted only '
             'briefly with its citation; `concept` a licensed or reserved text taught in the course\'s own words and never quoted.')
    counts = {}
    for p in PASSAGES:
        counts[p['source']] = counts.get(p['source'], 0) + 1
    M.append('')
    M.append('Passages per source: ' + ', '.join(f'{k} {v}' for k, v in sorted(counts.items())) + '.')
    return pack + '\n', '\n'.join(M) + '\n'


def main():
    pack, sources_md = build()
    targets = [('PACK.md', pack), ('SOURCES.md', sources_md)]
    if '--check' in sys.argv:
        bad = [f for f, t in targets if not os.path.exists(os.path.join(HERE, f)) or open(os.path.join(HERE, f), encoding='utf-8').read() != t]
        print(f'build_pack --check: {"PACK.md and SOURCES.md reproduce byte for byte" if not bad else "DIFFERS: " + ", ".join(bad)}')
        return 1 if bad else 0
    for f, t in targets:
        open(os.path.join(HERE, f), 'w', encoding='utf-8').write(t)
    print(f'build_pack: PACK.md {pack.count(chr(10))} lines, {len(re.findall(r"(?m)^# SECTION ", pack))} sections; SOURCES.md {len(SOURCES)} sources')
    return 0


if __name__ == '__main__':
    sys.exit(main())
