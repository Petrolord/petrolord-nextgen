# EC10 Farm-ins, Farm-outs & Asset Valuation: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the fifth course of the academy's upstream commercial line in the `economics`
module (path order 75), after EC9 joa. It is an ENGINE COURSE: there is no
Suite app, and every practical runs in the course's own three calculator
panels over the vendored engine `engines/economics/farmout.js`.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Five
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-farmout.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (a published figure, a fixture situation, a boundary) the digest recomputes it through the engine; quote the digest line. |
| `oracle_farmout.py` and the golden `farmout_cases.json` | PROVENANCE. The standard library oracle and the cases it wrote. The digest reads the golden's INPUTS and prints the engine's own figures. |
| the fixture README under `test-data/economics/ekene-farmout` | PROVENANCE. Its planted situations are tabled in the digest with the engine behaviour that finds each. |
| `make_farmout_fixtures.py` | the writer of the Ekene fixture. Its values reach you through the digest. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

A farm-out is a set of stated deal terms that can be written down and
computed, so the course teaches what a farm-out is, the earning obligation, the
promote and its ratio, the cash bonus and the past-cost reimbursement, and the
consent process in words at Associate; caps and overrun rules, drill-to-earn
vesting, the value of the deal to each side by EMV, the break-even promote and
chance, and the consent fee of the 2024 Regulations with its day rules at
Professional; and the value of information to each side, risk sharing, the
price of an interest and transaction ratios, a development carry and a back-in
through the joint venture engine, the readings and the texts' quirks, and what
the engine does not compute at Expert; and grades each tier on its own
question with numbers the engine returns.

## AN ENGINE COURSE, SAID PLAINLY

There is no Suite app for this course. Every lesson that sends a learner to
work says so in plain words: the practical runs in the course's calculator
panel (the earning calculator at Associate, the deal calculator at
Professional, the valuation calculator at Expert), which calls the same
vendored engine the lessons quote. Never write that a learner opens a Suite
app, a module or a dashboard for this course.

## THE REGULATORY RULE (binding on every lesson, bank question and key)

1. **Every Act, regulation, guide and teaching text is named with its edition
   or gazette date and the date it was read.** The digest's sources section
   tables them all; every one was read on 2026-09-27. When a lesson names a
   text for the first time, it gives the edition as that table does: the
   Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August
   2021); the Nigerian Upstream Petroleum (Assignment of Interests)
   Regulations, 2024 (S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111,
   9 April 2024); the HMRC Oil Taxation Manual pages with the dates each page
   carries (Open Government Licence v3.0); and Penn State EME 801, Lesson 6.
2. **Licensed texts are never quoted.** Licensed model farm-out and operating
   agreements (the AIPN, AAPL and CAPL forms) are taught by concept only and
   never quoted or named as a source.
3. **Penn State EME 801 is used for its NUMBERS only.** Its licence
   (CC BY-NC-SA 4.0) is non-commercial and this course is sold, so no sentence
   of it is quoted anywhere: its printed payoffs and EMVs are cited as figures,
   with the citation, and nothing else.
4. **Only public texts are quoted, with their citation.** Every quotation the
   digest prints is in `concepts.json` and is checked against the text by
   `quote_check.py`.
5. **No legal figure is invented.** The seven per cent of reg. 19(2) (two per
   cent processing fee and five per cent premium), the days of reg. 19(7) to
   (9) and the 50 percent of PIA s.95(14) are cited; every deal term (the share
   paid, the interest earned, a cap and its overrun rule, the vesting rule, the
   bonus, the reimbursement, a chance, a cost, a value, a likelihood, a price,
   an uplift) is a stated input with no default. A figure a lesson needs that
   the digest does not print is not written.
6. **No public text prints a farm-in schedule.** The validation record says so
   in its own words ("No public text prints a farm-in schedule or a break-even
   promote"); the earning, cap, break-even, fee and carry figures are the stated
   deal arithmetic, run by the engine. The one published worked figure is the
   Penn State problem, which the engine reproduces.
7. **The value of the transaction is a stated input.** The course teaches reg.
   19(3)'s definition (the amount payable to the assignor stated in the
   application or contract, or an amount the Commission prescribes) and the
   engine charges the gazetted rates on whatever amount the call states.

## THE READINGS THE ENGINE STATES (quote them verbatim, grade none)

The engine states each in its own basis, and the digest's readings section
prints each where it acts:

1. The valuation timing: "the success-case value is at the valuation date; well costs, bonus, reimbursement and fees fall at the valuation date, undiscounted"
2. The fee day count: "days from the notification of the consent to the payment"
3. The ninetieth surcharge day: "then 0.01% of the fee a day straight line for up to 90 days, after which the consent is deemed withdrawn (reg. 19(7) to (9))"
4. The simple uplift: "a recovery pays the accrued interest first, then the principal"

Teach each as the engine's stated choice beside the text it reads. The value
of the transaction is a different thing: a required input with its source,
which a deal states.

## WHAT IS GRADED, AND WHAT NEVER IS

Every graded number is a return value of the engine on fixed inputs (the
digest's graded section). No graded figure is a Monte Carlo draw: the risk
view's chance of a loss and low and high cases are taught and never graded.
Three capstones, six fields each, run their own synthetic deals that are never
in the digest. No capstone field depends on any of the readings.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | THE DEAL AND WHAT IT COSTS | what a farm-out is, the earning obligation, the promote and its ratio, cash bonus and reimbursement, the consent process in words, interests after the deal | 1 to 11 and 28 |
| Professional | CAPS, VESTING, VALUE AND THE FEE | caps and overrun rules, drill-to-earn vesting, deal value to each side, break-even promote and chance, the consent fee, paying the fee on time | 2 to 5, 12 to 17 and 28 |
| Expert | INFORMATION, RISK, PRICE AND AFTER THE FARM-IN | information value to each side, risk sharing, pricing an interest, carries and back-ins after the farm-in, readings and source quirks, what the engine does not compute | 1 to 6 and 18 to 28 |

Section 28 is the vocabulary, and every tier owns it. Section 5 (the refusals)
is owned across all three tiers.

## THE DATASET

One Ekene exploration prospect, the vendored fixture file under
`packages/engines/ec10-farmout/test-data/economics/ekene-farmout`, written by a
stated script and labelled SYNTHETIC in the file. EKO holds 70.000000 percent
and PA 30.000000; FIN farms in for 30.000000 percent by paying 40.000000
percent of the exploration well, which costs 40000000.000000 as a dry hole and
46000000.000000 on a success, at a chance of success of 25.000000 percent.
Digest section 4 tables the 9 planted situations with the engine behaviour
that finds each.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **The promote** (sections 7 and 8): the share paid less the interest held
   after the event. On the Ekene well FIN pays 18200000.000000, EKO
   14000000.000000 and PA 13800000.000000; the carry is 4400000.000000.
2. **The consideration** (section 9): carry, bonus and reimbursement, a
   consideration of 10000000.000000; FIN's equivalent working interest is
   51.739130 percent.
3. **Caps** (section 12): the two overrun rules split the same excess
   differently (FIN pays 18400000.000000 under one and 16000000.000000 under
   the other) and PA pays 14400000.000000 under both.
4. **Vesting** (section 13): with one event completed, "all-events" vests
   0.000000 and "per-event" 20.000000, for the same payment of
   16000000.000000.
5. **Deal value** (section 14): EKO's EMV is 18418808.982316 alone and
   19833033.704181 after the farm-out; FIN's is -1806224.721864, so it
   declines.
6. **Break-evens** (section 15): FIN's EMV is 0 paying 35.594574 percent; its
   break-even chance is 27.281304 percent.
7. **The fee** (sections 16 and 17): 392000.000000 on the stated
   5600000.000000; one surcharge day costs 39.200000.
8. **Information** (section 18): the survey is worth 6745331.458602 to FIN and
   6892331.458602 to EKO.
9. **Price** (section 20): 263125.842605 a percent risked; the stated price is
   2.026914 times it.
10. **After the farm-in** (section 21): the development carry is recovered in
    2036 under both the compound and the simple uplift at 8.000000 percent.

## THE REFUSALS

Digest section 5 tables 67 refusals across 8 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A result returned with a reason (an event not
completed, a break-even that does not exist, a consent deemed withdrawn) is a
result. It is no refusal.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `farmout_capstone.mjs` and written to `fields.json` by
`make_fields.mjs`. The capstones run their own synthetic deals, with their own
parties, wells, prospects, signals, prices, costs and terms. The capstone
names, terms and values are NOT in the digest and must never enter a lesson, a
bank or a panel; `gate_capstone_leak.mjs` sweeps all of them and these briefs.
The tolerance of every field is made in exactly one place,
`gradedTolerance.js` in the NextGen repository. **Never type a tolerance.**

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 28 carries the rule for each.

1. **"interest"** is always qualified: participating, working, carried or vested interest; "simple interest" or an "uplift" for money added to a carry.
2. **"promote"** is the share of the gross cost paid less the interest held after the event, in points; the promote ratio is the share paid over the interest held.
3. **"carry"** is the part of the farmor's cost share the farminee pays.
4. **"consideration"** is what the farmor receives: carry, cash bonus and reimbursement.
5. **"EMV"** is always of a named position.
6. **"break-even"** is always of a named term: the break-even promote or the break-even chance of success.
7. **"farmor and farminee"** are the engine's names; the texts' own words are quoted as they print them.

## SCOPE SEAMS

Carries, back-ins and the joint operating agreement belong to the joa course;
decision trees, EMV and the value of information as methods to the decision
course; portfolio choice and its risk measures to the portfolio course; the
cash flow ledger, discounting and NPV to the cashflow course; the Nigerian
fiscal system to the pia course. Refer to each in one sentence and never
re-teach it. `wave.json` records each seam.

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
