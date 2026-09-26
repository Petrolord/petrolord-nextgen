# EC7 Petroleum Industry Act 2021 & Nigerian Fiscal Terms: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is a
course of the academy's `economics` module (path order 72), slug `pia`. It is
an ENGINE COURSE: there is no Suite app, and every practical runs in the
course's own three calculator panels over the vendored engine
`engines/economics/cashflow.ts` (the default path of ENGINE_VERSION 3.12.0).

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. These
things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `AUDIT-PIA-ENGINE.md`, `AUDIT-PIA-2021.md`, `FINDINGS-pia2021.md` | PROVENANCE. The audit of the engine against the gazetted texts and the record of the engine repair. Where they state a figure, the digest recomputes it through the engine; quote the digest line. |
| `oracle_pia2021.py` and the golden `pia2021_cases.json` | PROVENANCE. The standard library oracle and its cases. The digest reads the golden INPUTS only and prints the engine's own figures. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |
| `concepts.json` | the gazette quotations with their citations. The digest prints every one; quote the digest line. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

The Petroleum Industry Act 2021 is a system that decides which instrument
applies, to whom, on what base and since when, so the course teaches the map
(the institutions, licences and terrains, royalty by terrain, volume and price,
and the instruments stacked on one year) at Associate; the hydrocarbon tax as a
system (the tranches, what the tax charges, the deductions and the cost price
ratio, the allowances and companies income tax beside it) at Professional; and
the transitions (conversion, what the Nigeria Tax Act 2025 moved and changed,
gas and incentives) with the reading of a fiscal outcome by provision at
Expert; and grades each tier on its own question with numbers the engine
returns.

## AN ENGINE COURSE, SAID PLAINLY

There is no Suite app for this course. Every lesson that sends a learner to
work says so in plain words: the practical runs in the course's calculator
panel (the royalty calculator at Associate, the hydrocarbon tax calculator at
Professional, the ledger calculator at Expert), which calls the same vendored
engine the lessons quote. Never write that a learner opens a Suite app, a
module or a dashboard for this course.

## WHAT THIS COURSE IS NOT: THE SEAMS

* The ledger arithmetic belongs to **the cash flow course** (`cashflow`):
  discounting, NPV, IRR, payback, the order of the ledger rows, loss-pool
  arithmetic and working-interest scaling. This course names the provision
  behind a line and says "the cash flow course" for the arithmetic. Never
  re-walk a ledger row step by step.
* Fiscal regime design belongs to **the fiscal course** (`fiscal`): the four
  instruments in the abstract, sliding scales, R-factors, templates and
  progressivity. The take wording is the shared `fiscalConventions.js`
  (digest section 20).

## THE REGULATORY RULE (binding on every lesson, bank question and key)

1. **Every Act, regulation and statement is named with its edition or gazette
   date and the date it was read.** Digest section 2 tables them; every one was
   read on 2026-09-26. When a lesson names a text for the first time it gives
   the edition as that table does: the Petroleum Industry Act 2021 (Official
   Gazette No. 142, Vol. 108, 27 August 2021), the Petroleum Royalty
   Regulations 2022 (S.I. No. 73, Official Gazette No. 205, Vol. 109,
   22 November 2022), the Nigeria Tax Act 2025 (Official Gazette No. 117,
   Vol. 112, 26 June 2025, re-gazetting ordered and no Certified True Copy
   read), the Finance Act 2023.
2. **Licensed texts are never quoted.** Model contracts sold under licence and
   paid commentary are taught by concept only.
3. **Only public texts are quoted, with their citation**, and a quotation is
   short and exact: quote the digest row that prints the text (each dash the
   gazette prints shown as a colon). The royalty texts sit beside the royalty
   sections (9 to 11) and the texts behind the stack beside it (12), all owned by
   the Associate tier; the conversion texts sit in section 5 and the
   institutions in section 4; every other text is in section 24, owned by the
   Professional and Expert tiers. Quote a text from the section your tier owns.
4. **No legal threshold, rate or schedule value is invented.** Every figure the
   engine applies is cited in the digest. A figure a lesson needs that the
   digest does not print is not written.
5. **Two values rest on secondary sources and are said to**: the tertiary
   education tax of 2.5 percent before 2023, and the NDDC levy on the total
   annual budget (digest section 2).

## COMPUTED OR CONCEPT-ONLY

Digest section 3 is the provision map: 41 provisions, 27 computed and 14
concept-only. **A concept-only provision is taught from its text and never
graded on a number**: the fiscal oil price and the additional tax at it, a
field lying partly in two terrains, associated against non-associated gas,
exploration expensing and the acquisition allowance, the election to defer a
loss, consolidation, production
sharing contracts under the Act, leases that do not convert, conversion itself,
the non-associated gas credit, gas incentives, stabilisation, the company-level
minimum effective tax test, and who assesses and collects.

## THE OPEN READINGS: TAUGHT, NEVER GRADED

The texts leave three questions open. Teach each as an open question, side by
side, and never key a question to one reading as the law:

1. **The royalty by price base year.** The Act starts the benchmarks in 2020,
   the Regulations' Schedule in 2021. The engine's default is the Regulations;
   any figure that depends on the royalty by price names the Regulations base in
   one plain sentence. In 2025 the Regulations' benchmarks are 54.120000,
   108.240000 and 162.360000 and the Act's 55.200000, 110.400000 and
   165.610000 (digest section 11).
2. **The hydrocarbon tax rate of a lease granted out of new acreage, onshore or
   in shallow water** (15 or 30). The engine refuses such a lease until the rate
   is stated (digest sections 7 and 13).
3. **The deep offshore hydrocarbon tax under the Nigeria Tax Act 2025**, three
   readings: conservative_zero, aggressive_pml_30 and custom (digest
   section 18).

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Every graded number is a return value of the engine on fixed terms and rows
(digest section 8). Three capstones, 6 fields each, 18 in all, computed by the
vendored engine in `pia_capstone.mjs` and written to `fields.json` by
`make_fields.mjs`. The capstones run their own Ekene synthetic leases, with
their own names, terms, rows and settings. The capstone names, terms, rows and
values are NOT in the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them and these briefs. Every graded field
is proved identical under every open reading (`pia_capstone.mjs`,
`discriminate.mjs`). The tolerance of every field is made in exactly one place,
`gradedTolerance.js` in the NextGen repository. **Never type a tolerance.**

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys. The digest's
section headings name their owners.

| tier | question | modules | digest sections it owns |
| --- | --- | --- | --- |
| Associate | THE MAP OF THE ACT | who decides what; licences, leases and terrains; royalty by terrain; royalty by price; the instruments stacked; the Associate reading | 1 to 12, 14, 19, 20 and 25 |
| Professional | THE HYDROCARBON TAX AS A SYSTEM | the small-field tranches; what the hydrocarbon tax charges; deductions and the cost price ratio; allowances; companies income tax alongside; the Professional reading | 6 to 9, 13 to 16, 19 and 22 to 25 |
| Expert | TRANSITIONS AND READING AN OUTCOME | conversion and the legacy terms; what the Nigeria Tax Act moved; what it changed at the edges; gas and incentives; reading a fiscal outcome; the Expert reading | 1 to 3, 5 to 8, 10, 13, 15, 17, 18 and 20 to 25 |

## THE DATASET

The Ekene teaching cases (digest section 6), every one synthetic, read from the
vendored golden file's inputs: Ekene Alpha (shallow water, converted lease,
crude with condensate and associated gas, 2026 to 2032) and Alpha at a 50
percent working interest; an onshore lease across 1 January 2026; a deep
offshore lease at 60,000 bopd under two readings; a gas field; a new onshore
lease crossing the allowance cap; condensate at its own price on both bases; a
case where the cost price ratio binds; decommissioning funds with and without
the escrow condition; the minimum effective tax rate; a converted marginal
field; frontier acreage; the NDDC opex base; a ledger forced to the Act alone.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **The daily rate** is the year's crude oil plus condensate over the calendar
   days of the year; the Regulations work month by month (a stated note).
2. **Shared costs** enter the hydrocarbon tax at the crude-plus-condensate share
   of gross revenue (a stated note; the texts allocate associated gas costs to
   crude oil and the engine cannot tell the two gases apart).
3. **The realised price stands in for the fiscal price** (a stated note).
4. **The framework is read year by year**: a year before 2026 is a year under the
   Act alone and 2026 onward a year under the Nigeria Tax Act 2025.
5. **Every figure is at field level first**, then every money line is scaled to
   the working interest share: Ekene Alpha's take is 66.564877 at 100 and at 50
   percent (digest section 20).

## THE REFUSALS

Digest section 7 tables 19 refusals. **Quote a refusal in a blockquote as the
engine's own words.** Two of them end with a sentence naming the platform
switch `pia_legacy_pre_audit`; this course does not teach that switch, so quote
their first sentences only. A result returned with a note in `kpis.pia_notes` is
a result, never a refusal.

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 25 carries the rule for each: royalty, royalty by price, terrain,
converted lease, new lease, a year under the Act alone, a year under the Nigeria
Tax Act 2025, open reading, stated reading, government take, at the share and
concept-only.

## THIS COURSE TEACHES NO REPAIR HISTORY

The engine follows the gazetted texts; that is how it is described. A sentence
about former engine behaviour anywhere in this course is a defect.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. Never write a contrastive of your own.
Never cite a digest section number in learner-visible text: say "the course".

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
