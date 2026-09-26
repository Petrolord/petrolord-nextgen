# EC7 Petroleum Industry Act 2021 & Nigerian Fiscal Terms: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The audit, the engine's FINDINGS record, the oracle and
its golden, and the engine's source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every amount of money, rate, fraction, share, percentage,
benchmark, price, allowance, levy, tax, take and daily rate to SIX decimals;
years, counts and whole barrels, Mscf and bopd inputs as whole numbers; an
engine message and an engine note verbatim. A money figure may be written with
its thousands grouped by commas, with the same digits the digest prints. A rule
figure of a text (5 percent, 10,000 bopd, 65 percent) is written as the text
states it, and the digest prints the text beside the section that computes
it (the royalty texts beside the royalty sections, every other text in the
section of the quoted texts). A figure of sixteen or more significant digits is
written with its thousands grouped by commas, as the digest prints it.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. It self-checks and reports zero
problems. Do not add, rename or reorder a lesson: change `structure.py` and
re-run it, then `scaffold.py`.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, markdown table rows and `{{panel` lines are excluded, and headings are
counted. Run `python3 lengths.py --tier <tier>` on your own tier only.

Every stub `scaffold.py` wrote carries the lesson title as its H1 and one
`{{panel:...}}` line per panel tag. Keep both exactly (`scaffold.py --check`
reports any drift). An opening paragraph under the H1, then short `##`
sections ending in `## Exercise`. A small table, numbers first, and an
`## Exercise` that asks the learner to DO something in the course's calculator
panel, with the Ekene cases or their own terms and rows, never to recall a
number.

## AN ENGINE COURSE

Every `## Exercise` sends the learner to the calculator panel the lesson tags
(the royalty calculator, the hydrocarbon tax calculator or the ledger
calculator) and names the view to open. There is no Suite app for this course;
never send a learner to one. Associate m01 l05 says it once in plain words: the
practicals run in the course's own calculator panels, which call the same
engine the lessons quote.

## THE SEAMS: TEACH THE ACT AS A SYSTEM

This course asks "which provision puts this line here, and what does the text
say about it". It never re-walks a ledger row: discounting, NPV, IRR, payback,
the ledger row order, loss-pool arithmetic and working-interest scaling are
"the cash flow course", named in one sentence and not re-derived. Regime design
in the abstract is "the fiscal course". A lesson may cite a digest figure from a
ledger row only to name the provision behind it.

## THE TIER LINE

Every tier's lessons may use a lower tier's material. **No tier's lessons may
use a higher tier's graded question.** An Associate lesson names the
hydrocarbon tax as one instrument on one line of the stack and never works its
deductions, the cost price ratio or the allowances; a Professional lesson never
works the year-by-year framework switch, the deep offshore readings under the
Nigeria Tax Act 2025, the escrow condition or the decomposition by provision.
An Associate or Professional lesson may say that a later tier takes a question
up, in one sentence.

## THE OPEN READINGS

Taught as open questions, side by side, and never as the law (`BRIEF.md`).
Every figure that depends on the royalty by price names the Regulations base in
one plain sentence. A figure on a new-acreage lease onshore or in shallow water
that the rate moves is quoted with the stated rate; a deep offshore hydrocarbon
tax under the Nigeria Tax Act 2025 is quoted with its stated reading, and all
three readings are shown together.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

A lesson quotes a NUMERIC FIELD at the digest's precision, as the digest prints
it. An engine message or note may appear only verbatim, in double quotation
marks, a `> ` blockquote, a backtick span or a four-space indented block,
exactly as the digest prints it, and never as the source of a figure the lesson
then reasons with. `numsweep_pia.mjs` exempts a quoted span only when its text
is EXACTLY a message the digest prints.

## THE REFUSALS, BY NAME

Digest section 7 tables 19 refusals. **Quote the engine's message in a
blockquote.** The ones each tier must teach:

* Associate m01 l05 and m02: a marginal field given as a terrain (first
  sentences only), a terrain the engine does not accept, a licence type from
  before the Act, a lease status the engine does not accept.
* Professional m02 to m05: a new-acreage onshore lease with no stated rate, a
  stated rate of 20, a capital allowance life of 4 (first sentences only), an
  in-country gas share of 120.
* Expert m02 and m03: a deep offshore NTA year with no reading, a custom reading
  with no rate, a fund contribution in an NTA year with no escrow statement, an
  override the engine does not accept.

## SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **The tranche edge belongs to the tranche below it.** At 5,000 bopd onshore
   and shallow water pay 0.050000; at 10,000 bopd both pay 0.062500; deep
   offshore pays 0.050000 at 50,000 bopd.
2. **Condensate counts in the daily rate.** On Ekene Alpha in 2026 the daily
   rate is 8320.000000 bopd, crude plus condensate over 365 days, and the rate
   0.059976.
3. **The Act's own example agrees with the engine on both bases.** At 75 USD/bbl
   in 2020 the royalty by price is 0.025000 on the Act base and on the
   Regulations base.
4. **The stated rate moves only the hydrocarbon tax.** On the new onshore lease
   crossing the cap the 2026 chargeable profit is 151411548.913043 under both
   stated rates, and companies income tax is 50223464.673913 under both.
5. **The deep offshore allowance stops in 2026.** The deep offshore lease earns
   175200000.000000 in 2025 and 0.000000 in 2026.
6. **The escrow condition moves the tax.** On the NTA fund case, 2026 companies
   income tax is 30069497.282609 with the condition met and 33069497.282609
   without it.
7. **The share scales the money and leaves the take.** Ekene Alpha's take is
   66.564877 at 100 and at 50 percent.

## HONESTY ABOUT THE SYNTHETIC DATA AND THE SOURCES

The Ekene cases are synthetic, and digest section 6 says so. Every text is named
with its edition and the date it was read (section 2). No licensed text is
quoted. A misprint in a text is quoted as printed and said to be one.

## THE VOCABULARY

Binding. Digest section 25. No "AI".

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included. Never
cite a digest section number in learner-visible text: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words, repair-history framing and open
readings stated as law; the kit's `leakage.mjs` for graded answers;
`numsweep_pia.mjs` (the kit's `numsweep.mjs` against `truth-pia.json`, the
harvest of the digest, with the quoting rule above) and the kit's `litsweep.py`
for literals that resolve against nothing; `lengths.py --tier <tier>` for the
prose-word band; `gate_capstone_leak.mjs` for any capstone name, term, row or
value; and `gate_claims.mjs` for every number in every brief. Read the counts
rather than the exit code.
