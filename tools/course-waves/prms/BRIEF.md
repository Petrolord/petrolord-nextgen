# EC11 Reserves & Resources under SPE-PRMS 2018: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the sixth course of the academy's upstream commercial line in the `economics`
module (path order 76), after EC10 farmout. It is an ENGINE COURSE: there is
no Suite app, and every practical runs in the course's own three calculator
panels over the vendored engine `engines/economics/prms.js`.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Five
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-prms.md`, vendored beside the oracle (engines PR #279) | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (a published check, a boundary) the digest recomputes it through the engine; quote the digest line. |
| `oracle_prms.py` and the golden `prms_cases.json` | PROVENANCE. The standard library oracle and the cases it wrote. The digest reads the golden's INPUTS and prints the engine's own figures. |
| the fixture README under `test-data/economics/ekene-prms` | PROVENANCE. Its eight projects are tabled in the digest with the class the engine gives each. |
| `make_prms_fixtures.py` | the writer of the Ekene fixture. Its values reach you through the digest. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

A resources estimate is a stated set of facts, forecasts and distributions that
can be written down and computed, so the course teaches the resources classes,
the categories and the low estimate as the P90, the resources framework and the
Nigerian terms in words at Associate; the project maturity sub-classes, the
seven commerciality criteria, incremental and cumulative categories, the
economic limit with 1P set to 0 when the low case fails, entitlement and
licence expiry at Professional; and arithmetic and probabilistic aggregation
(the 2011 Application Guidelines' two blocks, correlation, the SEC summation
rule), risked quantities, reconciliation, the two economic-limit rules and why
the engine refuses where they disagree, and what the engine does not compute
at Expert; and grades each tier on its own question with numbers the engine
returns.

## AN ENGINE COURSE, SAID PLAINLY

There is no Suite app for this course. Every lesson that sends a learner to
work says so in plain words: the practical runs in the course's calculator
panel (the classification calculator at Associate, the reserves calculator at
Professional, the aggregation calculator at Expert), which calls the same
vendored engine the lessons quote. Never write that a learner opens a Suite
app, a module or a dashboard for this course.

## THE REGULATORY RULE (binding on every lesson, bank question and key)

1. **Every standard, Act, regulation, guide and release is named with its
   edition or gazette date, its licence and the date it was read.** The
   digest's sources section tables them all; every one was read on
   2026-09-27. When a lesson names a text for the first time, it gives the
   edition as that table does: SPE-PRMS 2018 (June 2018; CC BY-NC-ND 4.0);
   the PRMS FAQs (November 2022, answers dated October 2022); the Guidelines
   for Application of the PRMS (November 2011); 17 CFR 229.1202, 229.1203 and
   210.4-10 (the eCFR current at 2026-09-01, public domain); the Petroleum
   Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021); the
   Significant Crude Oil and Gas Discovery Regulations, 2023 (S.I. No. 37 of
   2023, Official Gazette No. 111, Vol. 110, 20 June 2023); the Nigerian
   Upstream Petroleum (Commercial) Regulations, 2025 (S.I. No. 7 of 2025); the
   NUPRC release of 1 April 2026.
2. **Licensed texts are never quoted.** SPE-PRMS 2018 is licensed CC
   BY-NC-ND 4.0 (non-commercial, no derivatives) and this course is sold, so
   it is CITED BY SECTION and taught in the course's own words: never a
   sentence of it, with or without quotation marks. The PRMS FAQs (copyright
   SPE, all rights reserved) and the 2011 Application Guidelines (no licence
   printed, treated as copyright) are used for their NUMBERS and section or
   answer numbers only. `gate_no_prms_prose.py` refuses any run of eight words
   of the three texts anywhere a learner reads.
3. **The NUPRC release is cited for its figures and date only.** Its page reads
   all rights reserved.
4. **Only public texts are quoted, with their citation.** The Act, S.I. No. 37
   of 2023 and the SEC rules. Every quotation the digest prints is in
   `concepts.json` and is checked against the text by `quote_check.py`.
5. **No legal figure is invented.** The five years of PRMS 2.1.2.3 (a
   recommended benchmark), the 10 years of PIA 2021 s.78(9), the 5 and 8 years
   of reg. 6(3) of S.I. No. 37 of 2023 and the 2 years of s.79(1) are cited;
   every fact, chance, estimate, forecast, price, cost, royalty and its form,
   tax rate, working interest, licence expiry, renewal expectation, reporting
   basis, discount rate, BOE factor, distribution, correlation, seed, draw
   count, movement and tolerance is a stated input with no default. A figure a
   lesson needs that the digest does not print is not written.
6. **No gazetted NUPRC reserves reporting regulation was found.** Say so
   plainly where Nigerian reporting comes up: the course teaches the PRMS
   classes, and states no Nigerian booking rule because none was read.

## THE READINGS THE ENGINE STATES (quote them verbatim, grade none)

The engine states each in its own reasons or basis, and the digest's readings
section prints each where it acts:

1. The five-year benchmark: "time-frame: development starts within 5 years against the 5-year benchmark: met (PRMS 2.1.2.3)"
2. The economic test: "SPE-PRMS 2018 (June 2018, v1.03 with the 2022 errata; CC BY-NC-ND 4.0, cited by section): 3.1.2.1 (undiscounted cumulative net cash flow above 0, ADR included), 3.1.2.8"
3. The economic limit: "computeCashFlow of engines/economics/cashflow.ts with apply_economic_limit (JV regime at 100%, the stated royalty and tax), checked against PRMS 3.1.3.1"
4. The reconciliation: "opening + movements = closing, category by category; production comes out of every Reserves category alike (the movement headings are the engine's stated convention)"
5. The replacement ratio and the life index: "2P replacement ratio: every movement other than production (additions, revisions and transfers) 5.7 over production 1.1 = 5.181818; 2P life index 23.272727 years at the period's production rate"
6. The tolerance: "the reconciliation closes: every category within the stated tolerance 0.25"
7. The Monte Carlo low: "lib/conventions/percentile.js (P90 = the 0.1 quantile of the totals, the low estimate)"

Teach each as the engine's stated choice beside the text it reads, with the
alternative the digest names. The 2011 Guidelines' Table 6.2 read with normal
marginals is the Guidelines' own reading, taken by the golden input; the
digest prints the lognormal reading beside it.

## WHAT IS GRADED, AND WHAT NEVER IS

Every graded number is a return value of the engine on fixed inputs (the
digest's graded section). No graded figure is a Monte Carlo draw: the sampled
P90, P50, P10 and mean of an aggregation are taught with their seed and draw
count and never graded. Three capstones, six fields each, run their own
synthetic fields that are never in the digest. No capstone field depends on any
of the readings.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | CLASSES, CATEGORIES AND THE LOW ESTIMATE | the resources framework, discovered and undiscovered, Reserves and Contingent Resources, categories and the range, the low estimate and probability, Nigerian terms in words | 1 to 13 and 31 |
| Professional | MATURITY, COMMERCIALITY AND THE ECONOMIC LIMIT | project maturity sub-classes, the seven commerciality criteria, incremental and cumulative categories, the economic limit, entitlement and the reporting basis, licence expiry and time | 3 to 6, 9, 14 to 19 and 31 |
| Expert | AGGREGATION, RECONCILIATION AND THE LIMITS | arithmetic aggregation, probabilistic aggregation, risked quantities and classes, reconciliation, the two economic-limit rules, what the engine does not compute | 1 to 7 and 20 to 31 |

Section 31 is the vocabulary, and every tier owns it. Section 6 (the refusals)
is owned across all three tiers.

## THE DATASET

One Ekene field, the vendored fixture file under
`packages/engines/test-data/economics/ekene-prms`, written by a stated script
and labelled SYNTHETIC in the file. It carries 8 projects, and the engine
classifies each on its stated facts: EKN-1 and EKN-2 are Reserves, EKN-3,
EKN-4 and EKN-5 Contingent Resources, EKN-6 and EKN-7 Prospective Resources
(EKN-6 is the farm-out course's prospect, with a chance of commerciality of
20.000000 percent), and EKN-8 Discovered Unrecoverable. The economic limit,
the two aggregations and the reconciliation all come from the same file.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **The chance of commerciality** (section 9): Pg x Pd for a prospect, Pd for
   a discovered project, none for Reserves; EKN-7 is 10.500000 percent.
2. **Categories both ways** (sections 11 and 16): the Ekene Main Reserves
   stated cumulatively as 8.890000, 16.650000 and 24.990000 give a Probable of
   7.760000 and a Possible of 8.340000.
3. **The low estimate is the P90** (section 12), per
   lib/conventions/percentile.js.
4. **The economic limit** (section 17): on EKN-1 the canonical cash flow cuts
   the low, best and high cases in 2033, 2037 and 2040, and the 2P on the
   net-entitlement basis is 11229764.729167 BOE.
5. **1P = 0 when the low case fails** (sections 4 and 17): the FAQ 3.3
   figures give 1P 0.000000 and 2P 7000000.000000.
6. **Entitlement** (section 18): the same 2P is 18873554.166667 BOE gross and
   13211487.916667 at the working interest; a production tax deducts no
   volume.
7. **Aggregation** (sections 20 and 21): the Ekene Reserves add up
   arithmetically to a 1P of 15.809794, and the seeded Monte Carlo (seed
   20271112, 20000 draws) puts the P90 of the total at 17.300834. That
   figure is an estimate, and it is not graded.
8. **The 2011 Guidelines' blocks** (section 4): arithmetic 71.800000; the
   sampled P90 of independent blocks 76.623299 (seed 2011, 200000 draws),
   against the exact 76.654150; read as lognormals, 76.434906.
9. **The risked mean** (section 22): 10.114488 against a sum of means of
   20.637674.
10. **Reconciliation** (section 23): the Ekene Reserves close at 18.300000,
    25.600000 and 33.900000.
11. **The two rules** (section 24): on a late-dip profile the trailing trim
    gives 2030 and the cumulative peak 2027, and the engine refuses.

## THE REFUSALS

Digest section 6 tables 81 refusals across 5 functions, each with the field
it names and the engine's message verbatim. **Quote a refusal in a blockquote
as the engine's own words.** A result returned with a reason (a criterion not
met, a low case that fails, a reconciliation that does not close) is a result.
It is no refusal.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `prms_capstone.mjs` and written to `fields.json` by
`make_fields.mjs`. The capstones run their own synthetic fields, with their
own projects, chances, estimates, forecasts, prices, costs, distributions and
movements. The capstone names, inputs and values are NOT in the digest and
must never enter a lesson, a bank or a panel; `gate_capstone_leak.mjs` sweeps
all of them and these briefs. The tolerance of every field is made in exactly
one place, `gradedTolerance.js` in the NextGen repository. **Never type a
tolerance.**

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 31 carries the rule for each.

1. **"reserves"** is the PRMS class; a national or company figure is "reported reserves" with its date.
2. **"resources"** alone means all quantities; each class is named in full.
3. **"P90"** is always the low estimate.
4. **"proved"** is cumulative 1P; the increment is Proved (P1); the same pattern for probable and possible.
5. **"economic limit"** is always of a named rule and a named case.
6. **"risked"** always names its chance.
7. **"entitlement"** is always of a named basis.

## SCOPE SEAMS

Decline and type curves belong to the dca course; material balance to the
mbal course; volumetric estimates to the reservoircalc course (Reservoir
Volumetrics); the cash flow ledger, discounting and NPV to the cashflow course;
the Nigerian fiscal system to the pia course; distributions, correlation and
Monte Carlo as a subject to the uncertainty course. Refer to each in one
sentence and never re-teach it. `wave.json` records each seam.

## THIS COURSE TEACHES NO REPAIR HISTORY

The lead's decisions on the engine landed before any lesson was written. They
are provenance. A sentence about former engine behaviour anywhere in this
course is a defect.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, and none of its cousins
("rather than", ", never", "instead of") anywhere a learner reads, headings and
titles included.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
