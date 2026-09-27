# SC5 Contract & Supplier Management: the wave brief

**Read this before anything else, and read `PACK.md` beside it.** This is the
fifth course of the academy's Supply Chain & Logistics module (`supply_chain`,
path order 79) and THE FIRST PRACTICE COURSE (Suite
`docs/scope/NextGen-Catalog-Regroup-PLAN.md` section 3): no engine, no
calculator panel, no Suite app and no numeric capstone. It stands on a dated,
cited source pack, scenario question banks audited against that pack, a
visible "Practice course" badge and a review date.

## THE ONE RULE ABOUT TRUTH

**`PACK.md` is the only teaching truth for this course.** It is built by
`build_pack.py` from `sources/SOURCES.json` and `passages.json` and prints 215
numbered passages (P001 to P215) from 32 sources, each with its source, edition,
locator and mode. Things around this wave that look like truth and are not:

| file | what it is |
| --- | --- |
| `sources/passages_draft.json`, `sources/SOURCES_draft.json` | PROVENANCE. The drafts written when the texts were fetched and read; `curate_pack.py` turns them into the pack and records each decision. |
| `sources/NOTES.md` | PROVENANCE. What was fetched, what failed, the licence reasoning, the figures that could not be sourced. |
| the fetched PDFs and their `.txt` conversions | THE TEXTS THEMSELVES. A writer reads a passage in the pack; the text is there to check it, and never to lift a new figure from. |
| your own memory of an Act, a standard or a model contract | NOTHING. A rule, a figure or a clause that no passage carries is not written. |

## THE COURSE STATEMENT, IN ONE SENTENCE

A contract is managed by rules and records that can be written down and
checked, so the course teaches award handover, the contract as the manager
reads it, performance measures, payment and records, and the Nigerian content
duties that run through execution at Associate; supplier segmentation,
performance reviews, change control, supplier risk, the Nigerian content plan
and reports in depth, and poor performance at Professional; and contract
strategy, claims, disputes, termination and exit, close-out, and integrity and
governance at Expert; and examines each tier with scenario questions keyed to
cited passages, the Expert exam being a written-case bank.

## A PRACTICE COURSE, SAID PLAINLY

There is no calculator and nothing is computed. Every lesson closes with
`## Exercise`, a WRITTEN SCENARIO on one of the synthetic Ekene contracts the
pack registers (section 4 of the pack: EKC-01 to EKC-07). The learner writes
something short (a note to a supplier, a checklist, a decision with its
reason, a line for a register), and the lesson then gives the reading the
sources support. Associate m01 l05 says it once in plain words: this is a
practice course, its practicals are written scenario work, and each tier's
certificate is issued when the learner passes that tier's final exam (the
Expert final exam is a written case). Never send a learner to a calculator, a
panel, an engine, a Suite app or a capstone.

## WHICH RULE APPLIES TO WHOM (binding)

The sources are of three kinds, and a lesson always says which kind it is
teaching from:

1. **Nigerian law.** The Nigerian Oil and Gas Industry Content Development Act
   2010 (the content Act) binds operators, contractors and sub-contractors in
   the Nigerian oil and gas industry, and the Ekene contracts sit inside it.
   The Public Procurement Act 2007 binds federal procuring entities; for an
   operator it is a published statement of public procurement practice, and a
   lesson says so before it uses it. The Arbitration and Mediation Act 2023
   governs arbitration and mediation seated in Nigeria.
2. **UK public procurement law and government guidance.** The Procurement Act
   2023 and its guidance, GovS 008 and the Sourcing Playbook bind UK
   contracting authorities. The course teaches them as published, openly
   licensed statements of good practice, and names them as UK texts every time.
3. **World Bank texts.** The Procurement Regulations for IPF Borrowers and its
   guidance bind borrowers on Bank-financed contracts. The course teaches them
   by concept (their licence is non-commercial) as another published body of
   practice.

An Ekene scenario is never said to be governed by UK law or by the World Bank
Regulations. A lesson may say "the UK guidance recommends" or "the World Bank
guidance expects" and then ask what that practice would mean on an Ekene
contract.

## THE REGULATORY RULE (binding on every lesson, bank question and key)

1. **Every Act, regulation, standard and guidance is named with its edition
   and the date it was read**, as the pack's sources section tables it; every
   text was read on or before 2026-09-27, and the course is due for review by
   2027-09-27. The first time a lesson names a text it gives the edition:
   the content Act (Act No. 2 of 2010, commenced 22 April 2010); the Public
   Procurement Act 2007 (Act No. 14, Official Gazette No. 65, Vol. 94, 19
   June 2007); GovS 008 (version 2.2, issued 1 April 2026); the Sourcing
   Playbook (June 2023); the Procurement Act 2023 as enacted; the World Bank
   Procurement Regulations (Seventh Edition, September 2025); the World Bank
   Contract Management Practice guidance (Second Edition, 2024).
2. **Only public texts are quoted, word for word, with their citation.** The
   pack marks each passage QUOTED or BY CONCEPT. A QUOTED passage may appear in
   a lesson in quotation marks with its source and locator. A BY CONCEPT
   passage is taught in the course's own words and never quoted.
   `gate_quotes.py` checks every quotation against its text.
3. **Licensed texts by concept only.** The World Bank texts (non-commercial
   licence), the AIPN and LOGIC model contracts, FIDIC conditions (including
   the FIDIC text inside World Bank standard documents), ISO 44001, CIPS
   material and Kraljic's 1983 article are explained in the course's own words
   and never quoted or closely paraphrased. `gate_licensed_prose.py` refuses
   any run of eight words of a licensed text the wave holds.
4. **No legal figure is invented.** Every percentage, day count, money
   threshold, period and penalty a lesson states is printed by a passage, with
   the passage's citation (the content Act s.68 and its five per cent of the
   project sum; the Public Procurement Act 2007 s.35(1) and its mobilisation
   fee of not more than 15%; the Procurement Act 2023 s.52(1) and its three
   KPIs above £5 million). The pack's figures register lists them all. A
   figure a lesson needs that no passage prints is not written.
5. **Nigerian law is cited by section.** "The content Act, s.60", never "the
   Act says".
6. **Doubts the pack records are taught as doubts.** The printed Public
   Procurement Act 2007 s.16(12) gives its record retention period garbled
   ("often years"), so no retention period is taught; the Sourcing Playbook
   prints two different counts of published KPIs, so only the Procurement Act
   2023 s.52 count is taught; the World Bank's delay damages cap is an
   illustration and is taught as one.
7. **The expatriate quota guideline is not used.** NCDMB's guideline is marked
   internal use only; the expatriate rules come from the content Act ss.31 to
   33.

## THE TRACE (what replaces "call the engine")

Every lesson records the passages it rests on in `TRACE.json`, under its key
(`beginner/m01-.../l01-...`): at least two passage ids, at least one on a topic
`structure.py` gives the lesson. Every bank question carries the ids its key
rests on (the `src` argument of `q()`). `gate_source_trace.py` checks both and
refuses a passage id, the word "pack" or a pack section number in anything a
learner reads. Learner text cites the SOURCE and its locator.

## WHO OWNS WHAT

`structure.py` is the authority on the module and lesson keys, the titles, the
`est_minutes` and each lesson's topics; the pack section of each topic names
its owners.

| tier | question | modules |
| --- | --- | --- |
| Associate | FROM AWARD TO STEADY RUNNING | contract management and its sources; award handover and mobilisation; reading the contract you manage; KPIs and service levels; payment, records and the audit trail; Nigerian content in execution |
| Professional | SUPPLIERS OVER THE LIFE OF THE CONTRACT | segmenting suppliers; supplier performance reviews; variations and change control; supplier risk and resilience; Nigerian content obligations in depth; poor performance and remedies |
| Expert | STRATEGY, DISPUTES AND CLOSE-OUT | contract strategy; claims; disputes and their resolution; termination, step-in and exit; close-out and lessons learned; integrity, governance and the written case |

## THE SCENARIOS

Seven synthetic Ekene contracts (the pack's section 4): EKC-01 well services
call-off framework (WS-A), EKC-02 platform supply vessel time charter (MV-B),
EKC-03 camp catering and facility services (CF-C), EKC-04 casing and tubulars
frame agreement (TB-D), EKC-05 flowline replacement works (FW-E), EKC-06
instrument maintenance service (IM-F), EKC-07 environmental monitoring
consultancy (EM-G). Every scenario says it is synthetic. A scenario may add
facts of its own (a late delivery, a missed service level, a change request)
as long as they are plainly the scenario's facts and never a legal figure.

## THE CERTIFICATE

The same Associate, Professional and Expert ladder as every course, issued
when the learner passes the tier's final exam at the existing pass mark
(academy_claim_practice_certificate). There is no capstone: no lesson may
mention one except to say this course has none. The Expert final exam is the
WRITTEN-CASE BANK: 42 scenario questions, each set in an Ekene contract, each
keyed to a cited passage, auto-graded, with no numeric field.

## THE VOCABULARY, LEGISLATED AND BINDING

The pack's section 3: the content Act, the Procurement Act, the Board, the
Bureau, variation / change / modification, KPI, service level and service
credit, claim and dispute, contract manager and contract owner, synthetic.

## SCOPE SEAMS

Tender evaluation, the award decision, contract cost under uncertainty and
Nigerian content at the tender (the content Act s.14 and s.16) belong to the
procurement course (Procurement, Tendering & Contracting); inventory to the
materials course; vessel fleets to the marine course; joint operating
agreements to the joa course; gas sales agreements to the gsa course; risk
registers and management of change as disciplines to the riskchange course;
audit to the compliance course. Refer to each in one sentence and never
re-teach it.

## THIS COURSE TEACHES NO REPAIR HISTORY

There is no engine and no history of one.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, and none of its
cousins ("rather than", ", never", "instead of", "and not", "and never")
anywhere a learner reads, headings and titles included. A quoted passage keeps
its source's words exactly.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson
carries between its own minimum and 560 prose words: 420 at 12 minutes, 460
at 13, 500 at 14. 132 questions a tier: 15 per module bank plus a 42 question
exam; 396 in all.
