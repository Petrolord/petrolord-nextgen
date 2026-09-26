# SC2 Procurement, Tendering & Contracting: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the second course of the academy's `supply_chain` module (path order 71), after
MD3 Terminals, Depots & Fuel Supply. It is an ENGINE COURSE: there is no Suite
app, and every practical runs in the course's own three calculator panels over
the vendored engine `engines/supplychain/tender.js`.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Five
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-tender.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (a published worked example, a fixture situation, a boundary) the digest recomputes it through the engine; quote the digest line. |
| `oracle_tender.py` and the golden `tender_cases.json` | PROVENANCE. The standard library oracle and the cases it wrote. |
| the fixture README under `test-data/supplychain/ekene-tender` | PROVENANCE. Its planted situations are tabled in the digest with the engine behaviour that finds each. |
| `make_tender_fixtures.py` | the writer of the Ekene tender fixtures. Its values reach you through the digest. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

A tender is decided by rules that can be written down and computed, so the
course teaches the two-envelope evaluation by hand (technical scoring against a
pass mark, arithmetic correction, the evaluated cost and the combined score) at
Associate; the lowest evaluated cost with a life-cycle cost, the Rated Criteria
weighting band, abnormally low bids and the Nigerian content measures of the
2010 Act with its sections 14 and 16 at Professional; and contract types under
uncertainty with the cost P-label reversal, should-cost, the whole tender in one
call and a reading of the engine's own sources, readings and errata at Expert;
and grades each tier on its own question with numbers the engine returns.

## AN ENGINE COURSE, SAID PLAINLY

There is no Suite app for this course. Every lesson that sends a learner to
work says so in plain words: the practical runs in the course's calculator
panel (the envelope calculator at Associate, the award calculator at
Professional, the contract calculator at Expert), which calls the same vendored
engine the lessons quote. Never write that a learner opens a Suite app, a
module or a dashboard for this course.

## THE REGULATORY RULE (binding on every lesson, bank question and key)

1. **Every Act, regulation and guidance is named with its edition or gazette
   date and the date it was read.** Digest section 2 tables them all; every one
   was read on 2026-09-26. When a lesson names a text for the first time, it
   gives the edition as that table does.
2. **Licensed texts are never quoted.** The AIPN model contracts and paid
   standards (the API numbers the materials criteria name) are taught by
   concept and named by number only.
3. **Only public texts are quoted, with their citation**, and a quotation is
   short and exact.
4. **No legal threshold, rate or Schedule value is invented.** Every figure the
   engine applies is cited in the digest to its section. A figure a lesson
   needs that the digest does not print is not written.
5. **The 2010 Schedule only.** The content Act's Schedule is taught as enacted
   in 2010; any later Board target is a stated input with its source.

## WHAT IS GRADED, AND WHAT NEVER IS

Every graded number is a return value of the engine on fixed inputs (digest
section 5). The only random draws are the contract-type Monte Carlo on a stated
seed and iteration count. Three capstones, six fields each, run their own
synthetic tenders and a job that are never in the digest.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | TWO ENVELOPES, BY HAND | what a tender evaluation decides, the technical envelope, arithmetic correction, evaluated cost, the combined score, reading an award | 1 to 10 |
| Professional | LOWEST EVALUATED COST AND THE CONTENT ACT | lowest evaluated cost over the life of the asset, rated criteria and price scoring, abnormally low bids, measuring Nigerian content, Section 14 of the Act, Section 16 and the award | 11 to 16 |
| Expert | CONTRACTS, SHOULD-COST AND READING THE ENGINE | contract types on one job, cost percentiles and their labels, should-cost, whole-tender evaluation, reading the engine honestly, conventions and the evaluation report | 17 to 24 |

Section 25 is the vocabulary, and every tier owns it. Section 4 (the refusals)
is owned across all three tiers. Section 9 (the combined score) is also owned by
Professional m02, section 10 (the award) by Expert m04 l01, and section 13 (the
abnormally low test) by Expert m03 l04.

## THE DATASET

Two Ekene tenders, vendored fixture files under
`packages/engines/test-data/supplychain/ekene-tender`, written by a stated
script and labelled SYNTHETIC in every file; the bidders are codes. The well
services tender has six bids, WS1 to WS6, on five weighted criteria with a pass
mark of 70 and a combined award at technical weight 0.7. The materials tender
has five bids, MS1 to MS5, a pass mark of 60, a five-year valve maintenance
life cycle at 0.1 and a lowest-cost award. The well services file also carries
the contracting and should-cost inputs for the same two-well programme. Digest
section 3 tables the 13 planted situations with the engine behaviour that finds
each.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **The technical envelope** (section 6): mandatory requirements first; the
   technical percentage is the sum of weight x score / maxScore with the
   weights summing to 100; a bid AT the pass mark passes (WS5 at 70.000000); a
   failed bid's price is never opened.
2. **Arithmetic correction** (section 7): the unit rate prevails over the line
   amount unless the line carries decimalMisplaced, an input the evaluator records once the Employer judges the decimal point obviously misplaced (ITB 35.1(a)); a gap EQUAL
   to the tolerance is not corrected; the subtotals prevail over a stated
   total. WS2's correction is 18000.000000.
3. **The evaluated cost** (section 8): corrected price less the discount, plus
   priced deviations, omissions, the completion-time adjustment and the
   life-cycle cost. An omitted item is priced at the AVERAGE the other
   responsive bids quote (WS3's nitrogen: 35400.000000); no credit for early
   completion. WS5 is the lowest evaluated cost at 862141.000000.
4. **The combined score** (section 9): B = technical weight x St + the rest x
   Sc, St = 100 x T / Thigh, Sc = 100 x Cmin / C. WS3 is most advantageous at
   96.998434. The price method can move the award (section 12).
5. **The life-cycle cost** (section 11) is a net present cost through the
   canonical NPV of `engines/economics/cashflow.ts`; this course imports it and
   never restates it.
6. **Section 14** (section 15): the Act does not say whether "at least 5%
   higher" is points or relative, so the engine has no default. Teach BOTH
   READINGS SIDE BY SIDE as an open question of the Act, and state the reading
   beside every figure that depends on it. On the materials tender the lead is
   4.541020 percentage points or 7.960608 percent of the runner-up, and the
   reading decides the award.
7. **Cost percentiles** (section 18): P90 means a 90% probability the cost
   meets or exceeds the value, so the P90 cost is the LOW cost. The day rate's
   P90 is 837897.131515 and its P10 1029964.481686.
8. **Should-cost** (section 19) is built by importing wellCost and the AFE
   partner split; its screening band is a stated input with no published
   threshold. The well services estimate is 895361.041667.

## THE REFUSALS

Digest section 4 tables 113 refusals across 11 functions, each with the field
it names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A result returned with a reason (a bid excluded, s.14
not engaged, a null lead) is a result. It is no refusal.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `sc2_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstones run their own synthetic tenders and job, with their own bid
codes, scopes, prices and settings. The capstone names, codes, scopes, prices
and values are NOT in the digest and must never enter a lesson, a bank or a
panel; `gate_capstone_leak.mjs` sweeps all of them and these briefs. The
tolerance of every field is made in exactly one place, `gradedTolerance.js` in
the NextGen repository. **Never type a tolerance.** A Monte Carlo value is
quoted with its seed and iteration count; every capstone states its settings.

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 25 carries the rule for each.

1. **"responsive"** names a bid still in the evaluation at that stage.
2. **"lowest evaluated cost"** names the evaluated cost. The quoted price is a different figure.
3. **"most advantageous"** names the highest combined score under stated settings.
4. **"content"** is Nigerian content in the Schedule's measured unit.
5. **"P90"** of a cost is the LOW figure, printed beside its definition.
6. **"should-cost"** is the company's independent estimate. No bid is one.

## SCOPE SEAMS

NPV and discounting belong to the economics courses; Monte Carlo and reserves
P labels to the uncertainty course; well time and cost estimating to the
drilling courses; the Petroleum Industry Act and fiscal terms to the pia
course; supply chain operations to MD3. `wave.json` records each seam.

## THIS COURSE TEACHES NO REPAIR HISTORY

The engine's lead decisions landed before its merge and before any lesson was
written. They are provenance. A sentence about former engine behaviour anywhere
in this course is a defect. The uncited 'highest' omission option is taught in
Expert m05 as what the engine offers today and says about itself.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. Never write a contrastive of your own.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
