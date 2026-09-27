# SC5 Contract & Supplier Management. Three tiers, six modules each, 26
# lessons a tier. The fifth course of the academy's Supply Chain & Logistics
# module (`supply_chain`, path_order 79), after SC4 marine. THE FIRST PRACTICE
# COURSE (Suite docs/scope/NextGen-Catalog-Regroup-PLAN.md section 3): no
# engine, no calculator panel and no numeric capstone. The course stands on a
# dated, cited source pack, scenario banks audited against it, a visible
# "Practice course" badge and a review date.
#
# THE PACK IS THE ONLY TEACHING TRUTH. PACK.md, built by build_pack.py from
# sources/SOURCES.json and passages.json, prints every passage the course may
# teach from, numbered, with its source, edition, locator and whether it is a
# quotation (a public text whose licence allows it, verified word for word
# against the fetched text by gate_quotes.py) or a paraphrase (a licensed or
# reserved text taught by concept). A writer teaches from a passage and records
# the passage ids the lesson rests on in TRACE.json; a bank writer records the
# passage ids every keyed answer rests on beside the question. Learner text
# never names a passage id or a pack section: it cites the SOURCE (the Act and
# its section, the guidance and its paragraph).
#
# THE COURSE IN ONE SENTENCE. A contract is managed by rules and records that
# can be written down and checked, so the course teaches award handover, the
# contract as the manager reads it, performance measures, payment and records,
# and the Nigerian content duties that run through execution at Associate;
# supplier segmentation, performance reviews, change control, supplier risk,
# the Nigerian content plan and reports in depth, and poor performance at
# Professional; and contract strategy, claims, disputes, termination and exit,
# close-out, and integrity and governance at Expert; and examines each tier with
# scenario questions keyed to cited passages, the Expert exam being a written
# case bank.
#
# TIER OWNERSHIP:
#
#   Associate    FROM AWARD TO STEADY RUNNING. What contract management is, the
#                lifecycle and the roles; the sources with their editions,
#                licences and the dates they were checked, and the review
#                date; award handover, the contract management plan, the
#                kick-off and mobilisation; reading scope, price basis,
#                precedence and the working clauses; indicators and service
#                levels; invoices, certification, records and instructions;
#                the content Act in execution in words (first consideration,
#                employment and training, the plan and the reports).
#   Professional SUPPLIERS OVER THE LIFE OF THE CONTRACT. Segmentation by
#                profit impact and supply risk (Kraljic, by concept) and
#                contract tiering; the review cycle, the scorecard, the review
#                meeting and improvement plans; what counts as a change,
#                authority, assessment, the limits on modifying a public
#                contract and the change register; supplier risk, financial
#                standing, single sources and resolution planning; the Nigerian
#                content plan, employment and expatriate positions, training,
#                reports and monitoring; poor performance from concern to
#                formal notice and the remedies.
#   Expert       STRATEGY, DISPUTES AND CLOSE-OUT. Contract strategy, delivery
#                models, packaging and the price basis for the risk; claims,
#                notice, entitlement and fair assessment; the dispute
#                escalation ladder, mediation, expert determination and
#                arbitration; termination, step-in, exit and a supplier in
#                distress; completion, the final account, evaluation at close
#                and lessons learned; conflicts of interest, fraud and
#                corruption, governance and assurance, and reading sources as
#                they change; the written case brief.
#
# A higher tier may USE a lower tier's ideas (a Professional review reads an
# Associate indicator), and each tier exam examines only its own tier.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * tender evaluation, the award decision, the lowest evaluated cost, the
#     cost of lump-sum, reimbursable and day-rate contracts under uncertainty,
#     should-cost and Nigerian content at the tender (NOGICD Act s.14, s.16)
#     are OWNED BY the procurement course (SC2); this course starts at award;
#   * inventory, spares and stock policy are OWNED BY the materials course
#     (SC3); vessel fleets and voyages by the marine course (SC4);
#   * joint operating agreements, cash calls and partner consent are OWNED BY
#     the joa course; gas sales agreements by the gsa course;
#   * risk registers and management of change as a discipline are OWNED BY the
#     riskchange course, audit as a discipline by the compliance course.
#
# NO PANELS. A practice course has no calculator: every lesson closes with a
# WRITTEN SCENARIO EXERCISE on the synthetic Ekene contracts the pack
# registers (the learner writes a short answer, a checklist or a note; the
# lesson then gives the reading the sources support). PANEL_IDS is empty and
# every manifest lesson carries `panels: []` and `exercise: 'written-scenario'`.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no
# "X, not Y" contrastive (nor "rather than", ", never", "instead of", "and
# not", "and never") anywhere a learner reads, headings and module titles
# included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY: there is no engine and no history of
# one, so no module and no framed section tells one.
#
# NAMING COLLISIONS, legislated in the pack's vocabulary section:
#   * "the Act" alone is never used: each Act is named (the content Act, the
#     Nigerian Oil and Gas Industry Content Development Act 2010; the
#     Procurement Act, the Public Procurement Act 2007; the UK Procurement Act
#     2023);
#   * "the Board" is always the Nigerian Content Development and Monitoring
#     Board, "the Bureau" the Bureau of Public Procurement;
#   * "variation", "change" and "modification" are the contract's word first;
#     "modification" is the UK Act's word for a change to a public contract;
#   * "KPI" is a key performance indicator that the contract states; a
#     measure the contract does not state is a management measure;
#   * "claim" is a request for more time or money under the contract; a
#     "dispute" is a claim or other matter the parties have not agreed.
#
# PER-LESSON WORD COUNTS. The band is 420 to 560 PROSE WORDS, measured by
# lengths.py (front matter and table rows excluded, HEADINGS COUNTED). The
# minimum is DERIVED from est_minutes: 420 at 12, 460 at 13, 500 at 14. An
# est_minutes with no declared minimum RAISES.
BAND = (420, 560)
MIN_BY_MINUTES = {12: 420, 13: 460, 14: 500}
EXERCISE = 'written-scenario'


def min_words(est_minutes):
    """The minimum prose words a lesson of this length must carry."""
    if est_minutes not in MIN_BY_MINUTES:
        raise ValueError(
            f'no minimum word count is declared for {est_minutes} estimated minutes; '
            f'declared: {sorted(MIN_BY_MINUTES)}')
    return MIN_BY_MINUTES[est_minutes]


PANEL_IDS = []

# Each lesson: (key, title, est_minutes, topics). Topics are the pack's topic
# ids (T01 to T16, PACK.md); every topic is taught somewhere and each lesson
# names at least one, which is what the source-trace gate holds a lesson's
# passages to.
TIERS = {
 'beginner': [
  ('m01-contract-management-and-its-sources', 'Contract Management and Its Sources', [
    ('l01-what-contract-management-is', 'What contract management is', 12, ['T01']),
    ('l02-the-contract-lifecycle', 'The contract lifecycle from award to close', 13, ['T01', 'T15']),
    ('l03-owners-managers-and-the-supplier', 'Owners, managers and the supplier', 13, ['T01']),
    ('l04-the-sources-and-their-dates', 'The sources and the dates they were checked', 13, ['T01']),
    ('l05-a-practice-course-and-its-written-work', 'A practice course and its written work', 12, ['T01']),
  ]),
  ('m02-award-handover-and-mobilisation', 'Award Handover and Mobilisation', [
    ('l01-from-tender-team-to-contract-team', 'From tender team to contract team', 12, ['T02']),
    ('l02-the-contract-management-plan', 'The contract management plan', 13, ['T02']),
    ('l03-the-kick-off-meeting', 'The kick-off meeting', 13, ['T02']),
    ('l04-mobilisation-and-first-deliveries', 'Mobilisation and first deliveries', 13, ['T02', 'T05']),
  ]),
  ('m03-reading-the-contract-you-manage', 'Reading the Contract You Manage', [
    ('l01-scope-and-specification', 'Scope and specification', 12, ['T03']),
    ('l02-the-price-basis', 'The price basis and what it asks of you', 13, ['T03']),
    ('l03-order-of-precedence', 'The order of precedence between documents', 13, ['T03']),
    ('l04-clauses-a-contract-manager-uses', 'Clauses a contract manager uses every week', 14, ['T03', 'T08']),
  ]),
  ('m04-kpis-and-service-levels', 'KPIs and Service Levels', [
    ('l01-what-a-kpi-measures', 'What a key performance indicator measures', 12, ['T04']),
    ('l02-designing-an-indicator', 'Designing an indicator that drives the right behaviour', 13, ['T04']),
    ('l03-service-levels-and-service-credits', 'Service levels and service credits', 13, ['T04']),
    ('l04-data-evidence-and-a-disputed-score', 'Data, evidence and a disputed score', 13, ['T04', 'T05']),
  ]),
  ('m05-payment-records-and-the-audit-trail', 'Payment, Records and the Audit Trail', [
    ('l01-checking-an-invoice', 'Checking an invoice against the contract', 12, ['T05']),
    ('l02-certifying-work-done', 'Certifying work done', 13, ['T05']),
    ('l03-records-that-survive-an-audit', 'Records that survive an audit', 13, ['T05']),
    ('l04-correspondence-and-instructions', 'Correspondence and instructions in writing', 13, ['T05', 'T08']),
  ]),
  ('m06-nigerian-content-in-execution', 'Nigerian Content in Execution', [
    ('l01-the-content-act-and-the-board', 'The content Act and the Board', 12, ['T10']),
    ('l02-first-consideration-in-practice', 'First consideration in practice', 13, ['T10']),
    ('l03-nigerians-employed-and-trained', 'Nigerians employed and trained on the job', 13, ['T10']),
    ('l04-plans-and-reports-a-contract-carries', 'Plans and reports a contract carries', 13, ['T10']),
    ('l05-preparing-for-the-associate-exam', 'Preparing for the Associate exam', 13, ['T01', 'T10']),
  ]),
 ],
 'intermediate': [
  ('m01-segmenting-suppliers', 'Segmenting Suppliers', [
    ('l01-why-suppliers-get-different-attention', 'Why suppliers get different attention', 12, ['T06']),
    ('l02-profit-impact-and-supply-risk', 'Profit impact and supply risk', 13, ['T06']),
    ('l03-tiering-contracts-by-risk-and-value', 'Tiering contracts by risk and value', 13, ['T06']),
    ('l04-relationship-models-for-each-segment', 'Relationship models for each segment', 13, ['T06']),
    ('l05-segmenting-the-ekene-suppliers', 'Segmenting the Ekene suppliers', 14, ['T06']),
  ]),
  ('m02-supplier-performance-reviews', 'Supplier Performance Reviews', [
    ('l01-the-review-cycle', 'The review cycle', 12, ['T07']),
    ('l02-the-scorecard-and-its-evidence', 'The scorecard and its evidence', 13, ['T07', 'T04']),
    ('l03-running-the-review-meeting', 'Running the review meeting', 13, ['T07']),
    ('l04-improvement-plans-that-close', 'Improvement plans that close', 13, ['T07']),
  ]),
  ('m03-variations-and-change-control', 'Variations and Change Control', [
    ('l01-what-counts-as-a-change', 'What counts as a change', 12, ['T08']),
    ('l02-authority-to-instruct-a-change', 'Authority to instruct a change', 13, ['T08']),
    ('l03-assessing-a-change-request', 'Assessing a change request', 13, ['T08']),
    ('l04-limits-on-modifying-a-public-contract', 'Limits on modifying a public contract', 14, ['T08']),
    ('l05-the-change-register', 'The change register', 12, ['T08', 'T05']),
  ]),
  ('m04-supplier-risk-and-resilience', 'Supplier Risk and Resilience', [
    ('l01-risks-a-supplier-carries-in', 'Risks a supplier carries into your operation', 12, ['T09']),
    ('l02-financial-standing-and-early-warnings', 'Financial standing and early warnings', 13, ['T09']),
    ('l03-single-sources-and-continuity', 'Single sources and continuity plans', 13, ['T09']),
    ('l04-resolution-planning', 'Resolution planning for critical contracts', 13, ['T09']),
  ]),
  ('m05-nigerian-content-obligations-in-depth', 'Nigerian Content Obligations in Depth', [
    ('l01-the-nigerian-content-plan', 'The Nigerian content plan', 12, ['T10']),
    ('l02-employment-and-expatriate-positions', 'Employment and expatriate positions', 13, ['T10']),
    ('l03-training-and-capacity-building', 'Training and capacity building', 13, ['T10']),
    ('l04-performance-reports-and-monitoring', 'Performance reports and monitoring', 13, ['T10']),
  ]),
  ('m06-poor-performance-and-remedies', 'Poor Performance and Remedies', [
    ('l01-from-concern-to-formal-notice', 'From concern to formal notice', 12, ['T07']),
    ('l02-remedies-the-contract-gives', 'Remedies the contract gives', 13, ['T07', 'T14']),
    ('l03-recording-poor-performance', 'Recording poor performance', 13, ['T07']),
    ('l04-preparing-for-the-professional-exam', 'Preparing for the Professional exam', 13, ['T06', 'T07']),
  ]),
 ],
 'advanced': [
  ('m01-contract-strategy', 'Contract Strategy', [
    ('l01-what-a-contract-strategy-decides', 'What a contract strategy decides', 12, ['T11']),
    ('l02-delivery-models-and-make-or-buy', 'Delivery models and make or buy', 13, ['T11']),
    ('l03-packaging-the-work', 'Packaging the work', 13, ['T11']),
    ('l04-choosing-the-price-basis', 'Choosing the price basis for the risk', 13, ['T11', 'T03']),
    ('l05-a-strategy-for-an-ekene-campaign', 'A strategy for an Ekene campaign', 14, ['T11']),
  ]),
  ('m02-claims', 'Claims', [
    ('l01-what-a-claim-is', 'What a claim is', 12, ['T12']),
    ('l02-notice-and-its-timing', 'Notice and its timing', 13, ['T12']),
    ('l03-entitlement-and-evidence', 'Entitlement and evidence', 13, ['T12', 'T05']),
    ('l04-assessing-a-claim-fairly', 'Assessing a claim fairly', 13, ['T12']),
  ]),
  ('m03-disputes-and-their-resolution', 'Disputes and Their Resolution', [
    ('l01-the-escalation-ladder', 'The escalation ladder', 12, ['T13']),
    ('l02-negotiation-and-mediation', 'Negotiation and mediation', 13, ['T13']),
    ('l03-expert-determination-and-adjudication', 'Expert determination and adjudication', 13, ['T13']),
    ('l04-arbitration-and-the-courts', 'Arbitration and the courts', 14, ['T13']),
  ]),
  ('m04-termination-step-in-and-exit', 'Termination, Step-In and Exit', [
    ('l01-grounds-for-termination', 'Grounds for termination', 12, ['T14']),
    ('l02-step-in-and-other-interventions', 'Step-in and other interventions', 13, ['T14']),
    ('l03-exit-planning', 'Exit planning and handover to a successor', 13, ['T14']),
    ('l04-a-supplier-in-distress', 'A supplier in distress', 13, ['T14', 'T09']),
  ]),
  ('m05-close-out-and-lessons-learned', 'Close-Out and Lessons Learned', [
    ('l01-completion-and-acceptance', 'Completion and acceptance', 12, ['T15']),
    ('l02-the-final-account', 'The final account and releasing securities', 13, ['T15', 'T05']),
    ('l03-evaluating-the-supplier-at-close', 'Evaluating the supplier at close', 13, ['T15', 'T07']),
    ('l04-lessons-learned', 'Lessons learned that change the next contract', 13, ['T15']),
  ]),
  ('m06-integrity-governance-and-the-written-case', 'Integrity, Governance and the Written Case', [
    ('l01-conflicts-of-interest-and-gifts', 'Conflicts of interest and gifts', 12, ['T16']),
    ('l02-fraud-and-corruption-in-execution', 'Fraud and corruption in execution', 13, ['T16']),
    ('l03-governance-and-assurance', 'Governance and assurance of the contract portfolio', 13, ['T01', 'T16']),
    ('l04-reading-the-sources-as-they-change', 'Reading the sources as they change', 13, ['T01', 'T10']),
    ('l05-the-written-case-brief', 'The written case brief', 13, ['T11', 'T12', 'T14', 'T15']),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}
TOPICS = [f'T{i:02d}' for i in range(1, 17)]
# The last lesson of each tier prepares its exam; the Expert exam is the
# written-case bank.
EXAM_BRIEFS = {
    'beginner': 'l05-preparing-for-the-associate-exam',
    'intermediate': 'l04-preparing-for-the-professional-exam',
    'advanced': 'l05-the-written-case-brief',
}
# The 21 banks: six module banks of 15 and one exam of 42 per tier.
BANK_PREFIX = {'beginner': 'sc5b', 'intermediate': 'sc5i', 'advanced': 'sc5a'}
MODULE_BANK_N = 15
EXAM_N = 42


def flat():
    """Every lesson as (tier, module_key, module_title, module_order,
    lesson_order, lesson_key, lesson_title, est_minutes, topics, min_words)."""
    out = []
    for tier, mods in TIERS.items():
        for mi, (mkey, mtitle, lessons) in enumerate(mods, 1):
            for li, (lkey, ltitle, est, topics) in enumerate(lessons, 1):
                out.append((tier, mkey, mtitle, mi, li, lkey, ltitle, est, topics, min_words(est)))
    return out


def banks():
    """The 21 banks as (tier, bank id, file stem, expected questions)."""
    out = []
    for tier, pre in BANK_PREFIX.items():
        for i in range(1, 7):
            out.append((tier, f'm{i:02d}', f'{pre}_m{i:02d}', MODULE_BANK_N))
        out.append((tier, 'exam', f'{pre}_exam', EXAM_N))
    return out


CONTRASTIVE = r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band (?:not|never)\b'


def check(quiet=False):
    import re
    rows = flat()
    problems = []
    per_tier = {}
    for r in rows:
        per_tier[r[0]] = per_tier.get(r[0], 0) + 1
    for tier, n in per_tier.items():
        if n != 26:
            problems.append(f'{tier} has {n} lessons, expected 26')
        if len(TIERS[tier]) != 6:
            problems.append(f'{tier} has {len(TIERS[tier])} modules, expected 6')
    if len(rows) != 78:
        problems.append(f'{len(rows)} lessons in the wave, expected 78')
    if len(TIERS) != 3:
        problems.append(f'{len(TIERS)} tiers, expected 3')
    if PANEL_IDS:
        problems.append(f'a practice course declares no panel, and PANEL_IDS carries {PANEL_IDS}')
    for r in rows:
        if not r[8]:
            problems.append(f'{r[0]}/{r[5]} names no pack topic')
        for t in r[8]:
            if t not in TOPICS:
                problems.append(f'{r[0]}/{r[5]} names an unknown topic {t}')
        if not (BAND[0] <= r[9] <= BAND[1] - 60):
            problems.append(f'{r[0]}/{r[5]} minimum {r[9]} leaves under sixty words of room in the band')
    taught = {t for r in rows for t in r[8]}
    for t in TOPICS:
        if t not in taught:
            problems.append(f'topic {t} is in the pack and no lesson teaches it')
    for tier, mods in TIERS.items():
        mkeys = [m[0] for m in mods]
        if len(set(mkeys)) != len(mkeys):
            problems.append(f'{tier} repeats a module key')
        for i, mkey in enumerate(mkeys, 1):
            if not mkey.startswith(f'm{i:02d}-'):
                problems.append(f'{tier}: module {mkey} is not numbered m{i:02d}')
        for mkey, _, lessons in mods:
            lkeys = [l[0] for l in lessons]
            if len(set(lkeys)) != len(lkeys):
                problems.append(f'{tier}/{mkey} repeats a lesson key')
            for i, lkey in enumerate(lkeys, 1):
                if not lkey.startswith(f'l{i:02d}-'):
                    problems.append(f'{tier}/{mkey}: lesson {lkey} is not numbered l{i:02d}')
    titles = [(tier, t) for tier, mods in TIERS.items() for mkey, mtitle, lessons in mods
              for t in [mtitle] + [l[1] for l in lessons]]
    if len({t for _, t in titles}) != len(titles):
        problems.append('a module or lesson title is repeated')
    for tier, t in titles:
        if re.search('[–—]', t):
            problems.append(f'{tier}: title carries a dash: {t}')
        if re.search(CONTRASTIVE, t, re.I):
            problems.append(f'{tier}: title carries a contrastive: {t}')
        if re.search(r'\d', t):
            problems.append(f'{tier}: title carries a digit, which is a measurement and not a count: {t}')
        if re.search(r'\bAI\b|AI-powered|artificial intelligence', t, re.I):
            problems.append(f'{tier}: title claims AI: {t}')
        if re.search(r'\bcapstone\b|\bcalculator\b|\bpanel\b|\bengine\b', t, re.I):
            problems.append(f'{tier}: a practice course has no capstone, calculator, panel or engine, and a title names one: {t}')
    # NO HISTORY: the course teaches none, so nothing may read like it.
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for k, t in [(mkey, mtitle)] + [(l[0], l[1]) for l in lessons]:
                if re.search(r'used-to|was-repaired|repair-history|no-longer', k) or \
                   re.search(r'\bused to\b|\bno longer\b|\bwas repaired\b', t, re.I):
                    problems.append(f'{tier}/{k}: reads as repair history, and this course teaches none')
    # ONE EXAM BRIEF A TIER, and it is the last lesson of the last module.
    for tier, mods in TIERS.items():
        last = mods[-1][2][-1][0]
        if last != EXAM_BRIEFS[tier]:
            problems.append(f'{tier}: the exam brief {EXAM_BRIEFS[tier]} is not the last lesson ({last})')
    bs = banks()
    if len(bs) != 21 or len({b[2] for b in bs}) != 21:
        problems.append(f'{len(bs)} banks declared, expected 21 distinct')
    per_bank_tier = {}
    for tier, _, _, n in bs:
        per_bank_tier[tier] = per_bank_tier.get(tier, 0) + n
    for tier, n in per_bank_tier.items():
        if n != 132:
            problems.append(f'{tier} banks carry {n} questions, expected 132')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'SC5 contracts structure: {len(rows)} lessons, '
              f'{sum(len(m) for m in TIERS.values())} modules, {len(TIERS)} tiers, a practice course')
        for tier in ('beginner', 'intermediate', 'advanced'):
            mods = TIERS[tier]
            print(f'  {tier:13s} {len(mods)} modules, {per_tier[tier]} lessons, '
                  f'topics {sorted({t for r in rows if r[0] == tier for t in r[8]})}')
        print(f'  estimated minutes present: {minutes}, '
              f'minimum prose words: {[MIN_BY_MINUTES[m] for m in minutes]}, band ceiling {BAND[1]}')
        print(f'  total estimated minutes: {sum(r[7] for r in rows)}, '
              f'total minimum prose words: {sum(r[9] for r in rows)}')
        print(f'  panels declared: none; every lesson closes with a {EXERCISE} exercise')
        print(f'  banks: {len(bs)} ({per_bank_tier}); the Expert exam is the written-case bank')
        print('  history modules: none (this course teaches no repair history)')
        print(f'  PROBLEMS: {len(problems)}')
        for p in problems:
            print(f'   {p}')
    return problems


if __name__ == '__main__':
    import json
    import sys
    if '--modules' in sys.argv:
        probs = check(quiet=True)
        if probs:
            print(json.dumps({'REFUSED': probs}))
            sys.exit(1)
        print(json.dumps({TIER_NAMES[t]: {m[0][:3]: {'key': m[0], 'title': m[1], 'lessons': [l[0][:3] for l in m[2]]}
                                          for m in mods} for t, mods in TIERS.items()}))
        sys.exit(0)
    sys.exit(1 if check() else 0)
