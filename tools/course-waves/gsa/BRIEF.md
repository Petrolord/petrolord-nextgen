# EC8 Gas Commercialisation & Gas Sales Agreements: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the third course of the academy's upstream commercial line in the `economics`
module (path order 73), after EC7 pia. It is an ENGINE COURSE: there is no
Suite app, and every practical runs in the course's own three calculator
panels over the vendored engine `engines/economics/gasContract.js`.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Five
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-gasContract.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (a published figure, a fixture situation, a boundary) the digest recomputes it through the engine; quote the digest line. |
| `oracle_gascontract.py` and the golden `gascontract_cases.json` | PROVENANCE. The standard library oracle and the cases it wrote. The digest reads the golden's INPUTS and prints the engine's own figures. |
| the fixture README under `test-data/economics/ekene-gsa` | PROVENANCE. Its planted situations are tabled in the digest with the engine behaviour that finds each. |
| `make_gsa_fixtures.py` | the writer of the Ekene fixtures. Its values reach you through the digest. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

A gas sales agreement is a set of quantity, price and remedy rules that can be
written down and computed, so the course teaches the contract quantities,
volume to energy, the daily balance and one take-or-pay year by hand at
Associate; the multi-year ledger with make-up, carry-forward and seller
shortfall damages, contract price formulas with averaging and lag, and the
Nigerian domestic gas prices and delivery obligation of the Petroleum Industry
Act 2021 at Professional; and energy parity and the S-curve, the whole contract
in money with the gas royalty and the NPV, the engine's four stated readings,
the reference texts' quirks and what the engine does not compute at Expert; and
grades each tier on its own question with numbers the engine returns.

## AN ENGINE COURSE, SAID PLAINLY

There is no Suite app for this course. Every lesson that sends a learner to
work says so in plain words: the practical runs in the course's calculator
panel (the quantity calculator at Associate, the ledger calculator at
Professional, the contract calculator at Expert), which calls the same vendored
engine the lessons quote. Never write that a learner opens a Suite app, a
module or a dashboard for this course.

## THE REGULATORY RULE (binding on every lesson, bank question and key)

1. **Every Act, regulation, model contract and guide is named with its edition
   or gazette date and the date it was read.** The digest's sources section
   tables them all; every one was read on 2026-09-26. When a lesson names a
   text for the first time, it gives the edition as that table does.
2. **Licensed texts are never quoted.** The AIPN model gas sales agreement is a
   licensed text, taught by concept only. The Commonwealth model gas sales
   agreement (2025) is published under Creative Commons Attribution 4.0 and may
   be quoted, short and exact, with its attribution.
3. **Only public texts are quoted, with their citation.** Every quotation the
   digest prints is in `concepts.json` and is checked against the text by
   `quote_check.py`.
4. **No legal figure is invented.** Every rate, floor and adder the engine
   applies is cited to its section. A figure a lesson needs that the digest
   does not print is not written.
5. **The domestic base price is a stated input, quoted only as reported.** The
   figures for 2026 and 2025 are reported by BusinessDay (31 March 2026) and by
   Advocaat Law Practice through Legal 500 (7 April 2026); the regulator's
   circular was not read. Quote them in that form only; the course grades
   none of them. The power plant fixture holds the reported 2026 figure flat
   as a stated planning assumption; say so beside any figure that rests on it.
6. **Flaring is concept only.** The Act leaves the flare fine to regulations,
   and the regulations copy read is unnumbered and undated. No flare rate is
   printed anywhere in this course.

## THE FOUR READINGS THE ENGINE STATES (quote them verbatim, grade none)

The engine states each in its own basis, and digest section 18 prints each
where it acts:

1. "seller shortfall measured against the quantity the seller made available"
2. "make-up right equals the deficiency actually paid after any carry-forward credit"
3. "a last-contract-year deficiency creates no make-up right (forfeit/refund applies to earlier years' make-up only)"
4. "royalty is charged on delivered gas value and not on deficiency payments"

Teach each as the engine's stated choice beside the text it reads. The
recovery order of make-up is a different thing: a required contract input with
no default, with the model agreement's order named as the reference text's.

## WHAT IS GRADED, AND WHAT NEVER IS

Every graded number is a return value of the engine on fixed inputs (digest
section 6). Nothing in the engine samples or searches. Three capstones, six
fields each, run their own synthetic agreements that are never in the digest.
No capstone field depends on any of the four readings, and none uses the
domestic base price.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | QUANTITIES AND ONE CONTRACT YEAR | what a gas sales agreement fixes, volume to energy, contract quantities, the daily balance, take-or-pay basics, reading one contract year | 1 to 10 and 24 |
| Professional | THE LEDGER, THE PRICE AND THE NIGERIAN RULES | the take-or-pay ledger, make-up expiry and the end of the term, carry-forward and seller shortfall, price formulas, domestic gas prices, the Domestic Gas Delivery Obligation | 2 to 5, 11 to 15 and 24 |
| Expert | PARITY, THE WHOLE CONTRACT AND READING THE ENGINE | energy parity and the S-curve, whole-contract cash flows, the stated readings, reference texts and their quirks, what the engine does not compute, conventions and the contract report | 1 to 6, 9, 11 to 14 and 16 to 24 |

Section 24 is the vocabulary, and every tier owns it. Section 5 (the refusals)
is owned across all three tiers. Section 9 (the daily balance) is also owned by
Expert m03 l01, sections 11 and 12 (the ledgers) by Expert m04 l02, section 13
(prices) by Expert m05 l02 and section 14 (domestic prices) by Expert m05 l04.

## THE DATASET

Two Ekene agreements, vendored fixture files under
`packages/engines/test-data/economics/ekene-gsa`, written by a stated script and
labelled SYNTHETIC in every file. The power plant agreement runs 2027 to 2034
at a DCQ of 21000.000000 MMBtu per day, take-or-pay 80 percent, make-up for 3
contract years taken only after the Adjusted ACQ, forfeited at the end. The
export feed agreement runs 2027 to 2036 at 63000.000000 MMBtu per day,
take-or-pay 90 percent, make-up for 5 contract years after the take-or-pay
quantity, refunded at the end, with carry-forward capped at 50 percent and an
oil-indexed S-curve price. Digest section 4 tables the 12 planted situations
with the engine behaviour that finds each.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Energy** (section 7): the International Table Btu, and gross or net
   heating value carried as the contract states it. The power plant DCQ is
   21000.000000 MMBtu from 20 MMscf at 1050 Btu/scf.
2. **The day count** (section 8): stated days, a calendar year or a period
   with its end date excluded; 2028 counts 366 days. Effective swing is the
   swing factor over the take-or-pay fraction, 1.666667 on HMRC's own figures
   (the manual prints 1.66).
3. **The daily balance** (section 9): in January 2027 the power plant's buyer
   shortfall totals 31270.000000 and its seller shortfall 6300.000000, and the
   reconciliation identity closes exactly.
4. **One take-or-pay year** (section 10): the take-or-pay quantity is a stated
   percentage of the Adjusted ACQ; exactly met is no deficiency.
5. **The ledger** (section 11): the power plant's 2028 deficiency payment is
   1501584.000000, and 210000.000000 of that make-up expires at the end of 2031,
   the last year of its period.
6. **Carry-forward** (section 12): on the export ledger in 2029 a credit of
   3219250.000000, at the 50 percent cap, leaves a deficiency payment of
   31575852.662500; the 2036 end of term refunds 3700831.335000.
7. **Prices** (section 13): the export price averages its index over 6 months
   ending 1 month before the priced month, resets quarterly and rounds to four
   decimals; the 2029 annual average is 9.808450.
8. **Domestic prices and the obligation** (sections 14 and 15): the commercial
   price is the base price plus US$0.50 per MMBtu; the 2028 obligation penalty
   is 2366700.000000 on 676200.000000 MMBtu penalised at 3.500000.
9. **Parity and the NPV** (sections 16 and 17): the parity slope at 5.8 MMBtu
   per barrel is 0.172414; the export contract's NPV of the seller revenue is
   1,157,367,784.116539 through the canonical npv of `cashflow.ts`, which this
   course imports and never restates.

## THE REFUSALS

Digest section 5 tables 84 refusals across 9 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A result returned with a reason (a deficiency with no
make-up right, a price held at its floor, an excused quantity) is a result. It
is no refusal.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `gsa_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstones run their own synthetic agreements, with their own buyers,
quantities, index series and terms. The capstone names, terms, series and
values are NOT in the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them and these briefs. The tolerance of
every field is made in exactly one place, `gradedTolerance.js` in the NextGen
repository. **Never type a tolerance.**

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 24 carries the rule for each.

1. **"shortfall"** is always qualified: seller shortfall or buyer shortfall.
2. **"deficiency"** is the quantity below the take-or-pay quantity; the money is the deficiency payment.
3. **"make-up"** is gas paid for in a deficiency year and taken later.
4. **"carry-forward"** is excess takes credited against a later deficiency.
5. **"Adjusted ACQ"** is the ACQ less the stated reductions.
6. **"domestic base price"** is a stated input, quoted only as reported.

## SCOPE SEAMS

Flare to value, LPG and CNG belong to the gasvalue course; the cash flow ledger,
discounting and NPV as a subject to the cashflow course; the Nigerian fiscal
system (royalty by terrain, hydrocarbon tax, companies income tax) to the pia
course. Refer to each in one sentence and never re-teach it. `wave.json`
records each seam.

## THIS COURSE TEACHES NO REPAIR HISTORY

The lead's decisions on the engine landed before its merge and before any
lesson was written. They are provenance. A sentence about former engine
behaviour anywhere in this course is a defect.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, and none of its cousins
("rather than", ", never", "instead of") anywhere a learner reads, headings and
titles included. The one exempt string is the Act's own s.110(14)(a) wording,
quoted verbatim.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
