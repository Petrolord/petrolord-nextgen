#!/usr/bin/env python3
"""CURATE THE SC5 SOURCE PACK: from the fetched drafts to the pack the course
teaches from.

Inputs (written when the sources were fetched and read, 2026-09-27):
  sources/SOURCES_draft.json    33 sources with editions, URLs, licences,
                                sha256 of the fetched files and read dates;
  sources/passages_draft.json   219 candidate passages (quotes verified word
                                for word by sources/verify_quotes.py).
Outputs:
  sources/SOURCES.json          the sources the course cites;
  passages.json                 the passages it teaches from, P001 onward.

THE DECISIONS, each applied below and each reported by this script:

 1. THE WORLD BANK TEXTS ARE TAUGHT BY CONCEPT. S17 (Contract Management
    Practice), S18 (Procurement Regulations) and S19 (PPSD guidance) are
    licensed for NON-COMMERCIAL reproduction ("may not be modified" for S18),
    and this course is sold: the same reasoning the prms course applied to
    SPE-PRMS 2018 (CC BY-NC-ND). Their quote policy becomes 'concept' and
    every quoted passage from them is rewritten in the course's own words,
    keeping every figure and the locator, with the original words kept as the
    passage's 'anchor' (provenance, never printed). gate_licensed_prose.py
    sweeps all three texts for any eight-word run.
 2. THE NCDMB EXPATRIATE QUOTA GUIDELINE IS NOT USED. S24 is posted publicly
    but every page reads "for internal use only ... exclusive property of
    NCDMB ... Restricted". Its two passages are dropped and the source is
    removed; the expatriate rules the course teaches are cited to the content
    Act itself.
 3. THE NCDMB COPY OF THE CONTENT ACT IS A CROSS-CHECK. S21 carries
    "(c) 2016 NCDMB PROPRIETARY" on every page and is used only to confirm the
    FAOLEX copy (S20); it is kept, marked cross_check_of S20, and no passage
    cites it.
 4. Passages are renumbered P001 onward in draft order; each keeps its draft
    id as 'draft_id'.

    python3 curate_pack.py          write sources/SOURCES.json and passages.json
    python3 curate_pack.py --check  write nothing; exit 1 if either differs
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'sources')

CONCEPT_BY_LICENCE = {'S17', 'S18', 'S19'}
DROP_SOURCES = {'S24'}
CROSS_CHECK = {'S21': 'S20'}

# The course's own words for every World Bank passage that was a quotation.
# Figures and locators are kept; the draft wording stays as the anchor.
REWRITE = {
    'P006': "The World Bank's guidance treats appointing a contract manager for each contract as good practice.",
    'P007': 'The guidance reminds its reader that a contract is managed according to its own terms.',
    'P008': 'The Regulations give contract management one aim: that every party meets what it owes under the contract.',
    'P009': 'The Regulations call for contract management that is planned, carried out, monitored and evaluated systematically, so that performance is optimised and risks are managed.',
    'P018': 'Under the Regulations a contract management plan is drafted while the contract is being created and finished by the time it is signed.',
    'P019': 'For the contracts its procurement strategy identifies, the Borrower prepares a contract management plan that sets key performance indicators and milestone events.',
    'P021': 'The guidance asks the contract manager to confirm at the start that each party has put its authorisations and delegations in place, since a contracting decision is valid and enforceable only when the person taking it holds the authority to take it.',
    'P024': 'At a consulting kick-off meeting the guidance lists a walk through the contract documents, so that everyone understands the key provisions, which document takes priority over which, the conditions, the terms of reference, the payment schedule and the milestones.',
    'P026': 'Under a lump-sum contract the contractor or consultant performs the defined scope for a fixed contract amount.',
    'P027': 'A unit price contract states estimated quantities and a unit price for each item, and pays the quantities actually delivered at those unit prices.',
    'P028': 'A performance-based contract ties payment to measured outputs that meet functional needs of quality, quantity and reliability.',
    'P042': 'When a KPI is missed, the guidance expects the underlying cause to be found and the problems dealt with through an action plan.',
    'P043': 'Where they are needed, the Regulations set key performance indicators to confirm that the contractor performs satisfactorily and meets the requirements of the contract.',
    'P055': 'For works, the Regulations provide that a contract may, where appropriate, allow for a mobilisation advance, for advances against the plant and materials the contractor brings, for regular payments as progress is made, and for a reasonable retention that is released once the contractor has met its obligations.',
    'P057': "The World Bank's supply positioning model places each procurement by its relative supply risk and its value.",
    'P086': "For a contract subject to the Bank's prior review, the Borrower seeks the Bank's no objection before agreeing a variation or amendment that, alone or added to all earlier ones, adds more than 15 percent to what the contract first cost, extensions of time included; extreme urgency is the stated exception.",
    'P087': 'The guidance asks for clear roles in change management, with named people holding delegated authority to act on a change request or to escalate it when there are problems.',
    'P099': 'The guidance expects the contract manager to review the risk register regularly while the contract runs, with input from the parties where that is appropriate.',
    'P147': 'Among the contents of the procurement strategy, the Regulations list the contracting strategy: how the work is packaged and which types of contract are used.',
    'P154': 'The guidance stresses that a contractor gives notice of a claim and submits it on time, because a late notice or a late submission can carry consequences under the contract.',
    'P155': 'A claim, the guidance says, should state the breach of contract or the other legal basis it relies on.',
    'P157': 'The guidance expects the contract manager to see that a claim is backed by an analysis of its costs and by documents such as invoices, reports and records.',
    'P161': 'The guidance expects the contract manager to know in advance which costs, possible extra costs included, sit with the contractor and which sit elsewhere.',
    'P162': 'The guidance lists what to record: how the supplier performed and delivered, every communication and notice, the dates, and who was involved.',
    'P164': 'The guidance describes dispute resolution as a range of techniques, from informal talks, through formal negotiation, to mediation and arbitration; it asks that a dispute be managed actively and at the right level or levels, and it treats arbitration and litigation as the last resort for resolving a dispute.',
    'P185': 'The guidance calls termination the ultimate remedy for a default.',
    'P192': 'The Regulations require an evaluation of how the contract was carried out, made at completion, to assess performance and, where it applies, to draw lessons for later contracts.',
    'P193': "Among the checks the Regulations list for value for money, the Borrower confirms that the final price of the contract compares well with comparable benchmarks.",
    'P194': 'At close-out the guidance asks for the changes made during the contract to be evaluated for their effect on cost, schedule and performance, and kept as lessons for the future.',
    'P195': 'The guidance asks for the KPIs to be used in the review after the contract ends, and for the lessons to be recorded for future operations.',
    'P196': 'Payment errors found before the final payment is made should be corrected, the guidance says.',
    'P209': 'The Bank requires borrowers, bidders, consultants, contractors, suppliers, their sub-contractors and agents, and all of their personnel, to keep to the highest ethical standard through procurement, selection and the execution of Bank-financed contracts, and to refrain from fraud and corruption.',
    'P210': "The Regulations define a corrupt practice as offering, giving, receiving or soliciting anything of value, directly or indirectly, to influence another party's actions improperly.",
    'P212': "The guidance says suspected fraud or corruption should be reported promptly to the Bank's Integrity Vice Presidency.",
    # Draft paraphrases of the same texts that kept an eight-word run of the
    # original (gate_licensed_prose.py), rewritten again.
    'P146': 'The World Bank Regulations tie the choice of contract type and arrangement to what is being bought, how risky and complex it is, and value for money. Among the types they list are framework agreements, lump-sum and unit price contracts, time-based and performance-based contracts, turnkey contracts, and build-own-operate and build-operate-transfer arrangements.',
    'P058': "The World Bank's supply positioning model has four quadrants: Strategic Security (low cost and strategically important), Strategic Critical (high cost, few suppliers), Tactical Acquisition (routine and low value, with many suppliers) and Tactical Advantage (high cost and low risk, with many suppliers). The guidance usually counts a contract as high cost when its estimate reaches 1 percent of the project's total estimated procurement cost.",
}


def build():
    srcs = json.load(open(os.path.join(SRC, 'SOURCES_draft.json'), encoding='utf-8'))
    draft = json.load(open(os.path.join(SRC, 'passages_draft.json'), encoding='utf-8'))
    report = []
    out_s = []
    for s in srcs:
        s = dict(s)
        if s['id'] in DROP_SOURCES:
            report.append(f"dropped source {s['id']} ({s['title'][:60]}): marked internal use only and Restricted")
            continue
        if s['id'] in CONCEPT_BY_LICENCE:
            report.append(f"{s['id']} quote policy {s['quote_policy']} -> concept (non-commercial licence; the course is sold)")
            s['quote_policy'] = 'concept'
        if s['id'] in CROSS_CHECK:
            s['cross_check_of'] = CROSS_CHECK[s['id']]
        out_s.append(s)
    out_p, dropped, rewritten = [], 0, 0
    for p in draft:
        if p['source'] in DROP_SOURCES:
            dropped += 1
            continue
        q = {k: p[k] for k in ('id', 'source', 'locator', 'mode', 'text', 'topics')}
        if p.get('anchor'):
            q['anchor'] = p['anchor']
        if p['source'] in CONCEPT_BY_LICENCE and (p['mode'] == 'quote' or p['id'] in REWRITE):
            if p['id'] not in REWRITE:
                sys.exit(f'curate REFUSES: {p["id"]} quotes {p["source"]}, which is taught by concept, and has no rewrite')
            if p['mode'] == 'quote':
                q['anchor'] = p['text']
            q['text'] = REWRITE[p['id']]
            q['mode'] = 'paraphrase'
            rewritten += 1
        out_p.append(q)
    unused = set(REWRITE) - {p['id'] for p in draft if p['source'] in CONCEPT_BY_LICENCE}
    if unused:
        sys.exit(f'curate REFUSES: rewrites for passages that are not World Bank passages: {sorted(unused)}')
    for i, q in enumerate(out_p, 1):
        q['draft_id'] = q['id']
        q['id'] = f'P{i:03d}'
    report.append(f'{rewritten} World Bank passages rewritten in the course\'s own words; {dropped} passages dropped with S24')
    report.append(f'{len(out_s)} sources, {len(out_p)} passages ({sum(1 for p in out_p if p["mode"] == "quote")} quoted)')
    ordered = [{k: q[k] for k in ('id', 'draft_id', 'source', 'locator', 'mode', 'text', 'topics', 'anchor') if k in q} for q in out_p]
    return out_s, {'passages': ordered}, report


def main():
    s, p, report = build()
    files = [(os.path.join(SRC, 'SOURCES.json'), s), (os.path.join(HERE, 'passages.json'), p)]
    texts = [(f, json.dumps(o, indent=1, ensure_ascii=False) + '\n') for f, o in files]
    for line in report:
        print('  ' + line)
    if '--check' in sys.argv:
        bad = [os.path.basename(f) for f, t in texts if not os.path.exists(f) or open(f, encoding='utf-8').read() != t]
        print(f'  curate --check: {"both reproduce" if not bad else "DIFFERS: " + ", ".join(bad)}')
        return 1 if bad else 0
    for f, t in texts:
        open(f, 'w', encoding='utf-8').write(t)
    return 0


sys.exit(main())
