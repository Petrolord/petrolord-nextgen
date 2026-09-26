# EC9 Joint Ventures, Operating Agreements & Cost Recovery: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the fourth course of the academy's upstream commercial line in the `economics`
module (path order 74), after EC8 gsa. It is an ENGINE COURSE: there is no
Suite app, and every practical runs in the course's own three calculator
panels over the vendored engine `engines/economics/jointVenture.js`.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Five
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-jointVenture.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (a published figure, a fixture situation, a boundary) the digest recomputes it through the engine; quote the digest line. |
| `oracle_jointventure.py` and the golden `jointventure_cases.json` | PROVENANCE. The standard library oracle and the cases it wrote. The digest reads the golden's INPUTS and prints the engine's own figures. |
| the fixture README under `test-data/economics/ekene-jv` | PROVENANCE. Its planted situations are tabled in the digest with the engine behaviour that finds each. |
| `make_jv_fixtures.py` | the writer of the Ekene fixture. Its values reach you through the digest. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

A joint operating agreement is a set of interest, payment and remedy rules that
can be written down and computed, so the course teaches participating, paying
and beneficial interests, cash calls, budget control and operator overhead at
Associate; the cash call ledger, carries with uplift and caps, the back-in of
PIA 2021 s.85(4), default cover and interest, and PSC cost recovery through the
canonical applyPSC with its three published checks at Professional; and sole
risk and non-consent with the premium and reversion, buy-in, the engine's three
stated readings, the reference texts' quirks and what the engine does not
compute at Expert; and grades each tier on its own question with numbers the
engine returns.

## AN ENGINE COURSE, SAID PLAINLY

There is no Suite app for this course. Every lesson that sends a learner to
work says so in plain words: the practical runs in the course's calculator
panel (the account calculator at Associate, the recovery calculator at
Professional, the agreement calculator at Expert), which calls the same
vendored engine the lessons quote. Never write that a learner opens a Suite
app, a module or a dashboard for this course.

## THE REGULATORY RULE (binding on every lesson, bank question and key)

1. **Every Act, model contract, accounting agreement and guide is named with its
   edition or gazette date and the date it was read.** The digest's sources
   section tables them all; every one was read on 2026-09-26. When a lesson
   names a text for the first time, it gives the edition as that table does.
   The Norwegian agreement is an unofficial English translation, cited from its
   Wayback Machine capture of 26 May 2024; say so where it is quoted.
2. **Licensed texts are never quoted.** The AIPN model joint operating
   agreement, the COPAS accounting procedures and the AAPL forms are licensed,
   and are taught by concept only. The public texts (the Petroleum Industry Act
   2021, the Norwegian agreement, the Kenya Model PSC 2015, World Bank Briefing
   Note 8, IMF FARI TNM/16/01, IMF WP/24/89, OpenOil) may be quoted, short and
   exact, with their citation.
3. **Only public texts are quoted, with their citation.** Every quotation the
   digest prints is in `concepts.json` and is checked against the text by
   `quote_check.py`.
4. **No legal figure is invented.** The Act's 60 percent participation ceiling
   (s.85(4)(a)) and its refundable kinds (development and production,
   s.85(4)(c)) are cited; every contractual rate, tolerance, scale, multiple,
   share, lag and grace is a stated input with no default. A figure a lesson
   needs that the digest does not print is not written.
5. **No public text prints a worked schedule** for a carry recovered with
   interest, a non-consent premium recovered from production, a cash call
   reconciliation, a default cover or an overhead scale applied to figures.
   Those figures are the stated clause arithmetic of the Norwegian agreement
   and PIA s.85(4), run by the engine. The PSC cost recovery has published
   worked examples, and the digest runs all three.

## THE THREE READINGS THE ENGINE STATES (quote them verbatim, grade none)

The engine states each in its own basis, and the digest's readings section
prints each where it acts:

1. The PSC income tax: "income tax is charged on the contractor's profit oil share, as FARI TNM/16/01 and World Bank Note 8 assume (applyPSC in engines/economics/cashflow.ts)"
2. The grace: "a default cured within it carries no interest; one cured later carries interest from the due date, as the Kenya Model PSC 2015 Participation Agreement Art. 6.7 prints"
3. The cover: "the non-defaulting parties advance the unpaid amounts in proportion to their paying interests among themselves (the parties that pay cost; a carried party pays none)"

Teach each as the engine's stated choice beside the text it reads. The limit
base of a PSC is a different thing: a required input with no default
(`costOilLimitBase`), which a contract states.

## WHAT IS GRADED, AND WHAT NEVER IS

Every graded number is a return value of the engine on fixed inputs (the
digest's graded section). Nothing in the engine samples or searches. Three
capstones, six fields each, run their own synthetic joint ventures that are
never in the digest. No capstone field depends on any of the three readings.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | INTERESTS AND THE JOINT ACCOUNT | what a joint operating agreement fixes, participating interests, paying and beneficial interests, cash calls, budget control, overhead basics | 1 to 10 and 25 |
| Professional | RECOVERY, DEFAULT AND COST RECOVERY | the cash call ledger, carries with uplift and caps, back-in under the Act, default cover and interest, PSC cost recovery, the published PSC checks | 2 to 5, 11 to 16 and 25 |
| Expert | SOLE RISK, THE READINGS AND READING THE ENGINE | sole risk and non-consent, buy-in and entry, the stated readings, reference texts and their quirks, what the engine does not compute, conventions and the partner report | 1 to 6 and 17 to 25 |

Section 25 is the vocabulary, and every tier owns it. Section 5 (the refusals)
is owned across all three tiers.

## THE DATASET

One Ekene joint venture, the vendored fixture file under
`packages/engines/test-data/economics/ekene-jv`, written by a stated script and
labelled SYNTHETIC in the file. Four parties: EKO 40.000000 percent (the
operator), PA 25.000000, PB 15.000000 and NOC 20.000000, with NOC carried in
full, pro rata, so the paying interests are 50.000000, 31.250000, 18.750000 and
0.000000. Digest section 4 tables the 13 planted situations with the engine
behaviour that finds each.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Interests** (section 7): the beneficial interest is the participating
   interest; the paying interest moves only under a carry. On the Ekene carry
   NOC's beneficial interest is 20.000000 and its paying interest 0.000000.
2. **Cash calls** (sections 8 and 11): the difference of a called month adjusts
   the call a stated lag later. January 2027's over-call of 400000.000000 is
   credited in March, two months later; a month below the stated threshold
   makes no call and is billed in arrears.
3. **Budget control** (section 9): an overrun of exactly the item tolerance is
   inside it; the budget tolerance is the lower of a percentage and an amount,
   3000000.000000 on the Ekene 2027 budget.
4. **Overhead** (section 10): a marginal scale on the base after exclusions; the
   Ekene 2031 operating base is 58000000.000000 and the total overhead
   3580000.000000.
5. **Carries** (section 12): the uplift accrues on the opening balance and the
   Ekene carry with its compound uplift is recovered in 2033; under PIA
   s.85(4), with no uplift, in 2031.
6. **Back-in** (section 13): NOC's back-in refund is 98000000.000000, with
   156000000.000000 of costs excluded under s.85(4)(c), recovered in 2034.
7. **Default** (section 14): PB's unpaid 2000000.000000 is covered by EKO
   1230769.230769 and PA 769230.769231; simple interest gives 20625.000000 and
   monthly compounding 20210.781250.
8. **PSC cost recovery** (sections 15 and 16): the canonical applyPSC with the
   pool threaded; the World Bank example returns 43.200000 and 56.800000 where
   the note prints 43 and 57.
9. **Non-consent and buy-in** (sections 17 and 18): PB's premium on its
   proportionate share of 2700000.000000 is 10800000.000000, recovered by 2035;
   entry at the Norwegian multiple costs 27000000.000000.

## THE REFUSALS

Digest section 5 tables 78 refusals across 9 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A result returned with a reason (a month with no
cash call, a carry not recovered by the last year, a consequence not
triggered) is a result. It is no refusal.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `joa_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstones run their own synthetic joint ventures, with their own parties,
months, budgets, scales, costs and terms. The capstone names, terms and values
are NOT in the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them and these briefs. The tolerance of
every field is made in exactly one place, `gradedTolerance.js` in the NextGen
repository. **Never type a tolerance.**

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 25 carries the rule for each.

1. **"interest"** is always qualified: participating, paying, beneficial or carried interest; default interest for money charged on a late payment.
2. **"carry"** is a carried party's cost share paid by its carriers; a pool, a credit or a balance is "carried forward" or "carried to" a named period.
3. **"recovery"** is always of something named: carry recovery, premium recovery, cost recovery under a PSC.
4. **"premium"** is the stated multiple of a non-consenting party's proportionate share of an operation's cost.
5. **"cash call"** is the operator's monthly request for advances; an adjustment is an earlier month's difference applied to a later call.
6. **"overhead"** is the operator's charge on a stated scale over a stated base.

## SCOPE SEAMS

The cash flow ledger, discounting and NPV as a subject belong to the cashflow
course; fiscal regime design to the fiscal course; the Nigerian fiscal system
(royalty by terrain, hydrocarbon tax, companies income tax) to the pia course;
portfolio choice and the field development plan to the portfolio and fdp
courses. Refer to each in one sentence and never re-teach it. `wave.json`
records each seam.

## THIS COURSE TEACHES NO REPAIR HISTORY

The lead's decisions on the engine landed before its merge and before any
lesson was written. They are provenance. A sentence about former engine
behaviour anywhere in this course is a defect.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, and none of its cousins
("rather than", ", never", "instead of") anywhere a learner reads, headings and
titles included.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
