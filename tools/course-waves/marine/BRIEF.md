# SC4 Offshore & Marine Logistics: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the fourth course of the academy's supply chain line in the `supply_chain`
module (path order 78), after SC3 materials. It is an APP COURSE: the Suite
app is the Marine Logistics Planner, in the Suite's Midstream & Downstream
module, which runs the same engine file. Every practical also runs in the
course's own four calculator panels over the vendored engine
`engines/supplychain/marineLogistics.js`, so a learner without a Suite seat
can work every exercise.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Five
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-marine.md`, vendored beside the oracle (engines PR #283) | PROVENANCE. The engine's validation record with the lead's decisions. Where it quotes a teachable figure (a published check, a boundary) the digest recomputes it through the engine; quote the digest line. |
| `oracle_marine.py` and the golden `marine_cases.json` | PROVENANCE. The standard library oracle and the cases it wrote. The digest reads the golden's INPUTS and prints the engine's own figures. |
| the fixture README under `test-data/supplychain/ekene-marine` | PROVENANCE. Its planted situations are tabled in the digest with what the engine returns for each. |
| `make_marine_fixtures.py` | the writer of the Ekene fixture. Its values reach you through the digest. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

Offshore supply is a set of stated routes, vessels, cargoes, rates and rules
that can be written down and computed, so the course teaches voyage time,
weather, fuel, the capacity constraints and the binding one at Associate;
fleet sizing over a period with its rounding rules and deck planning by
first-fit decreasing at Professional; and shore base berth queues (M/M/c by
Erlang C, M/D/c by the Cosmetatos approximation), the fleet under weather and
demand variability through the canonical seeded Monte Carlo, the engine's
readings and boundaries and what it does not compute at Expert; and grades
each tier on its own question with numbers the engine returns.

## AN APP COURSE, SAID PLAINLY

The Suite app for this course is the Marine Logistics Planner. Name it where
the practicals come up, once, as the tool a Suite user has. Every exercise
still runs in the course's own calculator panel (the voyage and fleet
calculator at Associate, the voyage and fleet calculator and the deck
calculator at Professional, the shore base calculator and the variability
calculator at Expert), which calls the same vendored engine the lessons
quote. Never write that a learner must open the Suite to finish an exercise,
and never describe a Suite screen the digest does not describe.

## THE SOURCE RULE (binding on every lesson, bank question and key)

1. **Every source is named with its edition or date, its licence and the date
   it was read.** The digest's sources section tables them all; every one was
   read on 2026-09-27. When a lesson names a source for the first time, it
   gives the edition as that table does: Adan and Resing, Queueing Systems (26
   March 2015); Iversen, Teletraffic Engineering Handbook (draft, 20 June
   2001); Liu, Pantelidis, Tam and Chow (arXiv 2102.05851v2, CC BY 4.0); Skoko
   et al. (J. Mar. Sci. Eng. 12(2), 263, 1 February 2024, CC BY 4.0); Aas,
   Halskau and Wallace (Maritime Economics & Logistics 11(3), 302-325, 2009);
   the Wikipedia article on first-fit decreasing (revision 1317275412, CC
   BY-SA 4.0).
2. **No source prose is quoted.** Adan and Resing and Iversen print no licence:
   FIGURES AND FORMULAS ONLY, cited by table, equation and example. The
   Wikipedia article is CC BY-SA 4.0: cited, its wording never pasted. Aas,
   Halskau and Wallace is publisher copyright: BY CONCEPT ONLY. Skoko et al.
   and the arXiv paper are CC BY 4.0 and the course still cites them by table
   and equation. `gate_no_source_prose.py` refuses any run of eight words of
   the six texts anywhere a learner reads.
3. **A printed slip is taught as a slip.** Adan and Resing's Table 5.1 prints
   1.53 at five servers where the formula gives 1.524986, which rounds to
   1.52. Skoko et al. print the PSV's optimal fuel cost as USD 186,274.10;
   their rounded Table 5 days give 186214.104000 through the engine, so the
   course uses the AHTS row (80847.360000) and leaves the PSV total out.
4. **No figure is invented.** The engine holds no domain figure: every speed,
   distance, time, capacity, fraction, density, tank, fuel burn, price,
   weather factor and its activities, demand, minimum visits, period,
   available days, rounding rule, footprint, packing rule, berth count,
   arrival rate, working day, service term, queue model, distribution, draw
   count and seed is a stated input. A figure a lesson needs that the digest
   does not print is not written.

## THE READINGS THE ENGINE STATES (teach each with its alternative, grade none)

The digest's readings section prints each where it acts, on a golden input:

1. READING ONE: a load exactly at a capacity is feasible
2. READING TWO: a binding tie goes to the first constraint in the order
3. READING THREE: a count rounds up on its twelve-digit figure
4. READING FOUR: the nearest whole vessel rounds a half up
5. READING FIVE: demand equal to the minimum visits names the demand
6. READING SIX: first-fit decreasing puts the heavier of two equal footprints first
7. READING SEVEN: a unit that fills the deck exactly fits
8. READING EIGHT: a berth target is met at or below it
9. READING NINE: short means strictly above the planned capacity
10. READING TEN: the P90 of a requirement is the low figure

THE CHOICES A CALL STATES are a different thing: the activities the weather
slows, the voyage and vessel rounding rules, the packing rule, the queue model
and the concurrent choice are required inputs, and every capstone states each
one it uses. Teach them as inputs a plan must name.

## WHAT IS GRADED, AND WHAT NEVER IS

Every graded number is a return value of the engine on fixed inputs (the
digest's graded section). No graded figure is a Monte Carlo draw: the mean,
P90, P50 and P10 of the fleet under variability are taught with their seed and
draw count and never graded. Three capstones, six fields each, run their own
synthetic clusters that are never in the digest. No capstone field depends on
any of the readings.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | VOYAGES, CAPACITY AND THE BINDING CONSTRAINT | offshore supply as a system, routes and voyage time, weather and fuel, deck and bulk capacity, the binding constraint, planning a voyage end to end | 1 to 13 and 30 |
| Professional | FLEET SIZING AND DECK PLANNING | demand over a period, voyages and vessel-days, vessels required, deck cargo and footprints, first-fit decreasing, published packing examples | 3 to 5, 14 to 19 and 30 |
| Expert | SHORE BASE QUEUES, VARIABILITY AND THE LIMITS | the shore base as a queue, Erlang C and M/M/c, constant service and M/D/c, weather and demand variability, readings and boundaries, what the engine does not compute | 1 to 6 and 20 to 30 |

Section 30 is the vocabulary, and every tier owns it. Section 5 (the refusals)
is owned across all three tiers.

## THE DATASET

One Ekene cluster, the vendored fixture file under
`packages/engines/test-data/supplychain/ekene-marine`, written by a stated
script and labelled SYNTHETIC in the file: six bulk products, one PSV and one
AHTS, four installations with a week's demand and one voyage's cargo, a milk
run, one voyage of deck cargo and a supply base.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Voyage time and fuel** (sections 8 to 10): the Ekene PSV sails its milk
   run in 62.072727 hours with the weather factor on sailing and field time,
   burning 19.876364 t of fuel that costs 17292.436364.
2. **The binding constraint** (sections 11 and 12): deck area binds the milk
   run at 0.900000; the same cargo on the AHTS is overloaded on deck area,
   deadweight and tank water, with deck area at 1.309091.
3. **Fleet sizing** (sections 14 to 16): the week asks for 3.100000 voyages of
   demand, driven by deck area and rounded up to 4; 10.345455 vessel-days;
   2 vessels with 2.654545 spare vessel-days.
4. **The deck plan** (sections 17 and 18): first-fit decreasing carries
   599.229600 m2 of one voyage's deck cargo and leaves 11 small units behind;
   first fit in the booked order carries 580.629600 m2 and strands a casing
   bundle of 35.100000 m2; two voyages carry it all, the lower bound.
5. **The shore base** (sections 20 to 22): two berths at a utilisation of
   0.533333; a mean wait of 3.180124 hours as M/M/c and 1.665786 hours as
   M/D/c; one berth is refused.
6. **Variability** (section 23): on seed 20260927 and 20000 draws the P90 of
   the week's vessel-days is 7.977705 and the P10 11.908677, and 0.001400 of
   the draws need more than two vessels give. These are estimates, never
   graded.

## THE REFUSALS

Digest section 5 tables 79 refusals across 5 functions, each with the field
it names and the engine's message verbatim. **Quote a refusal in a
blockquote as the engine's own words.** A result returned with a reason (an
overloaded voyage, a voyage longer than the days available, a shortfall of
vessel-days, overflow on the deck, a berth target no count meets) is a result.
It is no refusal.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `marine_capstone.mjs` and written to `fields.json` by
`make_fields.mjs`. The capstones run their own synthetic clusters, with their
own vessels, installations, legs, cargo, demand, deck items and base terms.
The capstone names, inputs and values are NOT in the digest and must never
enter a lesson, a bank or a panel; `gate_capstone_leak.mjs` sweeps all of them
and these briefs. The tolerance of every field is made in exactly one place,
`gradedTolerance.js` in the NextGen repository. **Never type a tolerance.**

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 30 carries the rule for each.

1. **"voyage"** is one sailing from the base and back.
2. **"capacity"** is always of a named constraint.
3. **"binding"** is the constraint with the highest utilisation, by the stated tie rule.
4. **"vessel-days"** is voyages times voyage days, added over the sets.
5. **"utilisation"** is always of a named thing.
6. **"wait"** is the mean wait in the queue on the working-hour clock.
7. **"P90"** of a requirement or a cost is the LOW figure, quoted with its seed and draws.

## SCOPE SEAMS

Monte Carlo as a subject belongs to the uncertainty course; contracting a
vessel to the procurement course; spares and stock to the materials course;
supplier management to the contracts course; discounting and NPV to the
cashflow course. Refer to each in one sentence and never re-teach it.
`wave.json` records each seam.

## THIS COURSE TEACHES NO REPAIR HISTORY

The lead's decisions on the engine landed before any lesson was written. They
are provenance. A sentence about former engine behaviour anywhere in this
course is a defect.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, and none of its cousins
("rather than", ", never", "instead of", "and not", "and never") anywhere a
learner reads, headings and titles included. Never cite the digest or its
section numbers in learner text: say "the course".

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
