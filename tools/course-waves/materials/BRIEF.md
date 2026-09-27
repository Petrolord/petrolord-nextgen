# SC3 Materials, Spares & Inventory Management: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the third course of the academy's `supply_chain` module (path order 77), after
SC2 procurement. It is an APP COURSE: the Suite app is the Materials & Spares
Planner (in the Suite's Midstream & Downstream module), and the course's own
three calculator panels carry every practical over the same vendored engine
`engines/supplychain/inventory.js`, so a learner without a Suite seat does
every exercise.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Five
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-inventory.md`, vendored beside the oracle (engines PRs #281 and #283) | PROVENANCE. The engine's validation record and the lead's decisions. Where it quotes a teachable figure (a published check, a boundary) the digest recomputes it through the engine; quote the digest line. |
| `oracle_inventory.py` and the golden `inventory_cases.json` | PROVENANCE. The standard library oracle and the cases it wrote. The digest reads the golden's INPUTS and prints the engine's own figures. |
| the fixture README under `test-data/supplychain/ekene-materials` | PROVENANCE. Its planted situations are recomputed in the digest. |
| `make_inventory_fixtures.py` | the writer of the Ekene register. Its values reach you through the digest. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

A stock policy is a stated set of criteria, costs, demands, lead times, service
targets and bands that can be written down and computed, so the course teaches
the materials register, criticality classes, ABC by annual usage value, the
economic order quantity with its stated rounding and slow-moving and obsolete
stock at Associate; quantity discounts, demand over the lead time, the cycle
service level, the fill rate, periodic review and Poisson demand for slow
movers at Professional; and insurance spares, the Poisson anchor, lead-time
risk by the canonical Monte Carlo, stockouts and the reorder point, the
readings, ties and boundaries, and what the engine does not compute at Expert;
and grades each tier on its own question with numbers the engine returns.

## AN APP COURSE, SAID PLAINLY

The Suite app for this course is the Materials & Spares Planner, route
`/dashboard/apps/midstream-downstream/materials-spares-planner`, which vendors
the same engine. Every lesson that sends a learner to work names the course's
calculator panel it tags (the register calculator at Associate, the stock
calculator at Professional, the spares calculator at Expert), which calls the
same vendored engine the lessons quote, and may add that the same inputs typed
into the Planner give the same figures. Never write that a learner needs a
Suite seat: the panels carry every practical. Never promise that a certificate
unlocks or discounts the Planner.

## THE REGULATORY RULE (binding on every lesson, bank question and key)

1. **Every text is named with its edition or date, its licence and the date it
   was read.** The digest's sources section tables them all; every one was read
   on 2026-09-27. When a lesson names a text for the first time, it gives the
   edition as that table does: Harris, "How Many Parts to Make at Once",
   Factory 10(2), February 1913 (public domain; read in the 1990 Operations
   Research reprint); C. Caplice, MIT ESD.260J Logistics Systems, Fall 2006,
   lectures 7, 8, 11, 12 and 13 (MIT OpenCourseWare, CC BY-NC-SA 4.0);
   MIL-HDBK-338B, 1 October 1998 (public domain).
2. **Licensed texts are never quoted.** The MIT OpenCourseWare lectures are
   licensed CC BY-NC-SA 4.0 (non-commercial) and this course is sold, so they
   are CITED BY LECTURE AND SLIDE for their figures and taught in the course's
   own words: never a slide, never a slide title, never a sentence of slide
   text, with or without quotation marks. `gate_no_ocw_prose.py` refuses any
   run of eight words of the five lectures anywhere a learner reads.
3. **Only public-domain texts are quoted, with their citation**: the 1913
   words of Harris and MIL-HDBK-338B. Every quotation the digest prints is in
   `concepts.json` and is checked against the text by `quote_check.py`.
4. **No figure is invented.** Every cost, demand, rate, service level and
   measure, cut-off, band, write-down, cover limit, weight, class minimum,
   override, rounding rule and multiple, safety-factor rounding and floor,
   lead time and its spread, review period, days a year, failure rate,
   downtime cost, search limit, reorder point, seed and draw count is a stated
   input with no default. A figure a lesson needs that the digest does not
   print is not written.
5. **SPE-PRMS 2018 is named only** where the engine's P-label sentence names
   it, and never quoted; the prms course of this academy teaches it.

## THE READINGS THE ENGINE STATES (quote them verbatim, grade none)

The engine states each in its own basis or reasons, and the digest's readings
section prints each where it acts, with its alternative:

1. The ties: "weighted score = sum of weight x score / 5 over 4 criteria; classes V at or above 70, E at or above 44, D at or above 0; compared at 12 significant digits"
2. The halves: "EOQ = sqrt(2 x 25 x 50 / 1) = 50; ordered as 100 (the nearest multiple of 100 (halves upward)), a relevant cost of 62.5 a year against 50 at the EOQ"
3. The class minimum: "X: weighted score 70 is at or above 70, the minimum for class V"
4. The discount tie: "order 100 at a total cost of 200 a year (band 0), the lowest of 2 candidates; tied on cost, the smaller quantity is taken"
5. The Poisson target: "level 1: P(X <= 1) = 0.735759 is at or above 0.7357588823428847; at 0 it is 0.367879 (Poisson mean 1)"
6. The Poisson fill target: "X ~ Poisson(demandRate x (leadTime + reviewPeriod)); p(x) = p(x - 1) m / x from p(0) = exp(-m); F(s) = P(X <= s); L(0) = m, L(x + 1) = L(x) - (1 - F(x)) = E[(X - x - 1)+]; the smallest level meeting the target, compared at 12 significant digits"
7. The ABC tie: "annual usage value = annualUsage x unitCost, ranked highest first (ties by id); the cumulative share including the item decides against A 80% and B 95%; compared at 12 significant digits"
8. The spares tie: "0 spares: holding 0 a year against expected downtime 365000, total 365000, the lowest for 0 to 2; one more spare adds 230724 of holding and saves 230724 of downtime"
9. The band minimum and 10. the cover limit: "bands active from 0 months (0%), slow from 12 months (25%), very slow from 24 months (50%), obsolete from 36 months (100%), a band reached at or above its minimum; cover = onHand / monthlyUsage, excess above 24 months; compared at 12 significant digits"
11. The stockout: "0 of 50 draws have a lead-time demand above the reorder point 20: a stockout probability of 0 a cycle"
12. The service index: "reorderPointForService is the sorted lead-time demand at index ceil(0.95 x n) - 1"
13. The P90: "lib/stats basicStats on the sorted values: P90 = index floor(0.1 n), P50 = floor(0.5 n), P10 = floor(0.9 n). P-labels per lib/conventions/percentile.js: P90 means a 90% probability the actual quantity meets or exceeds the value, so for a lead time or a demand P90 is the LOW figure (10th percentile) and the stockout risk sits at the P10 end"

Teach each as the engine's stated choice with the alternative the digest
names. The sentence the Monte Carlo returns, "P90 means a 90% probability the
actual quantity meets or exceeds this value, per SPE PRMS.", is quoted only
verbatim, as the engine's words, with the digest's reading of it: the
platform's one P-label convention, and for a lead time or a demand the P90 is
the low figure.

## WHAT IS GRADED, AND WHAT NEVER IS

Every graded number is a return value of the engine on fixed inputs (the
digest's graded section). No graded figure is a Monte Carlo draw: the sampled
P90, P50, P10, mean, stockout probability and reorder point for a service
level are taught with their seed and draw count and never graded. Three
capstones, six fields each, run their own synthetic registers that are never in
the digest. No capstone field depends on any of the readings, and the one
capstone that carries a Monte Carlo block grades none of its figures.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | CRITICALITY, CLASSES AND THE ORDER QUANTITY | materials and the register, criticality, ABC by annual usage value, the economic order quantity, rounding and the flat bottom, slow-moving and obsolete stock | 1 to 4, 6 to 14 and 30 |
| Professional | SERVICE LEVELS, SAFETY STOCK AND DISCOUNTS | quantity discounts, demand over the lead time, the cycle service level, the fill rate, periodic review, Poisson demand for slow movers | 4 to 9, 15 to 20 and 30 |
| Expert | SPARES, LEAD-TIME RISK AND THE LIMITS | insurance spares, the Poisson anchor, lead-time risk by Monte Carlo, stockouts and the reorder point, readings, ties and boundaries, what the engine does not compute | 1 to 9 and 21 to 30 |

Section 30 is the vocabulary, and every tier owns it. Section 8 (the refusals)
is owned across all three tiers, and Associate m01 l05 introduces them. The
capstone briefs are Associate m06 l04, Professional m06 l05 and Expert m06 l05;
the printed slips are taught at Professional m04 l04 and Professional m06 l04;
the Ekene register is introduced at Associate m01 l03.

## THE DATASET

One Ekene register, the vendored fixture file under
`packages/engines/test-data/supplychain/ekene-materials`, written by a stated
script and labelled SYNTHETIC in the file. It carries 18 stock items and a
stated policy, and one stated case for each costing function: BARYTE for the
EOQ, CSG-958 for the quantity discount, CHK-BEAN for the normal safety stock,
PSV-KIT for the Poisson stock, ESP-MTR for the insurance spares and MECH-SEAL
for the lead-time risk.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **The safety override** (sections 6 and 10): PSV-KIT scores 68.000000 and
   is class V by its maximum safety score; MECH-SEAL scores exactly 70.000000,
   the V minimum, and is V.
2. **The item that crosses a cut-off** (section 11): CEM-G, at a cumulative
   share of 83.536840, is B under at-or-below and A under include-crossing.
3. **The EOQ and the quantity ordered** (sections 12 and 13): BARYTE's EOQ is
   137.408584, ordered as 140.000000 at a relevant cost of 7861.142857 against
   7859.770989 at the EOQ, a penalty of 0.017454 percent.
4. **Slow-moving stock** (section 14): a total write-down of 97955.000000.
5. **Discounts both ways** (section 15): CSG-958 all-units orders 120.000000 at
   349720.000000 a year; incremental orders 141.000000 at 365590.042553.
6. **The two service measures** (sections 17 and 18): CHK-BEAN at a cycle
   service level of 0.95 has k 1.644854 and a reorder point of 13.316294, held
   as 14.000000; at a fill rate of 0.98, k is 1.026327.
7. **Poisson for a slow mover** (section 20): PSV-KIT at a mean of 2.000000
   needs a level of 5.
8. **Insurance spares, one for one** (section 21): the ESP motor's cheapest
   stock is 4 spares at 160003.732064 a year.
9. **The printed slips** (section 5): lecture 11 slide 24 prints 348 where the
   fill-rate rule gives 339.179604; lecture 13 slide 12 prints 0.009 where the
   loss recursion gives 0.001619.
10. **Lead-time risk** (section 23): the mechanical seal's stockout probability
    of 0.058600 on seed 20270301 and 20000 draws is an estimate, and it is not
    graded.

## THE REFUSALS

Digest section 8 tables 89 refusals across 9 functions, each with the field it
names and the engine's message verbatim, and the stated probes that reach every
other refusal a call can produce. **Quote a refusal in a blockquote as the
engine's own words.** A result returned with a reason (an item below a class
minimum, a stock of spares at the search limit, a stockout in some draws) is a
result. It is no refusal.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `materials_capstone.mjs` and written to `fields.json` by
`make_fields.mjs`. The capstones run their own synthetic registers, with their
own items, scores, usages, costs, schedules, demands, lead times, service
targets, failure rates and bands. The capstone names, inputs and values are NOT
in the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them and these briefs. The tolerance of
every field is made in exactly one place, `gradedTolerance.js` in the NextGen
repository. **Never type a tolerance.**

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 30 carries the rule for each.

1. **"service level"** always names its measure: the cycle service level or the fill rate.
2. **"safety stock"** is k times sigma over the protection period; the reorder point and the order-up-to level are named as such.
3. **"EOQ"** is the unrounded figure; the quantity ordered is the rounded one.
4. **"criticality class"** is of the stated policy, a different thing from the ABC class.
5. **"P90"** of a sampled lead time or demand is the low figure.
6. **"obsolete", "slow" and "excess"** are always of a stated band or cover limit.
7. **"insurance spare"** is always of the stated one-for-one model.

## SCOPE SEAMS

Tendering, bid evaluation and contract types belong to the procurement course;
terminal and depot stock to the supply course; failure rates from field data to
the rotating course and the reliability parts of the academy; distributions and
Monte Carlo as a subject to the uncertainty course; discounting and NPV to the
cashflow course; the PRMS framework behind the P-label sentence to the prms
course. Refer to each in one sentence and never re-teach it. `wave.json`
records each seam.

## THIS COURSE TEACHES NO REPAIR HISTORY

The lead's decisions on the engine landed before any lesson was written. They
are provenance. A sentence about former engine behaviour anywhere in this
course is a defect.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, and none of its cousins
("rather than", ", never", "instead of", "and not", "and never") anywhere a
learner reads, headings and titles included.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
