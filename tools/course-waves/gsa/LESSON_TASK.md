# EC8 Gas Commercialisation & Gas Sales Agreements: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle and its
golden, the fixture README and the engine's source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every quantity, price, amount of money, rate, ratio, share,
percentage, slope and present value to SIX decimals; years, day counts, month
counts and whole inputs as whole numbers; an engine message, reason and basis
verbatim. A figure of sixteen or more significant digits is written with its
thousands grouped by commas, as the digest prints it (the export contract's NPV
of the seller revenue is 1,157,367,784.116539). A rule figure of a text
(US$3.50 per MMBtu, US$0.50 per MMBtu, US$0.90 per MMBtu) is written as the text
states it and cited to its section, as the digest's provisions section does.

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
panel, with the Ekene agreements or their own terms, and never to recall a
number.

## AN ENGINE COURSE

Every `## Exercise` sends the learner to the calculator panel the lesson tags
(the quantity calculator, the ledger calculator or the contract calculator)
and names the view to open. There is no Suite app for this course; do not send
a learner to one. Associate m01 l05 says it once in plain words: the practicals
run in the course's own calculator panels, which call the same engine the
lessons quote.

## THE SEAMS

This course teaches gas contracting and domestic gas policy. Flare to value,
LPG and CNG are "the gas value course"; the cash flow ledger, discounting and
NPV as a subject are "the cash flow course"; the Nigerian fiscal system is "the
Petroleum Industry Act course". Name each in one sentence where it touches this
course and do not re-derive it.

## THE TIER LINE

Every tier's lessons may use a lower tier's material. **No tier's lessons may
use a higher tier's graded question.** An Associate lesson works one contract
year and names make-up as what a later year may do with a deficiency; it does
not work a multi-year ledger, a carry-forward credit or a price formula. A
Professional lesson does not work the S-curve, the whole contract in money, the
NPV or the four readings side by side. An Associate or Professional lesson may
say that a later tier takes a question up, in one sentence.

## THE FOUR READINGS AND THE DOMESTIC BASE PRICE

Taught as the engine's stated choices, verbatim, beside the text each reads
(`BRIEF.md`), and never keyed as the law. The domestic base price is a stated
input; a reported figure is quoted with its reports, and a figure resting on
the power plant fixture's held price says that the price is a stated planning
assumption.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

A lesson quotes a NUMERIC FIELD at the digest's precision, as the digest prints
it. An engine message, reason or basis may appear only verbatim, in double
quotation marks, a `> ` blockquote, a backtick span or a four-space indented
block, exactly as the digest prints it, and not as the source of a figure the
lesson then reasons with. `numsweep_gsa.mjs` exempts a quoted span only when its
text is EXACTLY a string the digest prints. The export refund reason prints
3700831.3350000004; the lesson reasons with the field, 3700831.335000.

## THE REFUSALS, BY NAME

Digest section 5 tables 90 refusals. **Quote the engine's message in a
blockquote.** The ones each tier must teach:

* Associate m01 l05 to m05: an unknown key (heatingvalue), a unit the engine
  does not accept, two day counts at once, gas taken above the gas made
  available, force majeure and maintenance above the DCQ, no make-up terms.
* Professional m01 to m06: a recovery order the engine does not accept, a
  seller shortfall with no stated rate, a series with a gap, an averaging
  window the series does not cover, no domestic base price, a signed agreement
  rate beside an adjusted rate.
* Expert m02 and m06: a royalty with no terrain, a discount rate of -1, a cap
  on the contract years.

## SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **A leap year is a longer contract year.** 2028 counts 366 days and an ACQ
   of 7686000.000000 at the power plant's DCQ; 2027 counts 365.
2. **Effective swing is the swing over the take-or-pay fraction.** 150 over 90
   gives 1.666667; HMRC's manual prints 1.66.
3. **The daily identity closes exactly.** In January 2027 buyer shortfall less
   over-take and Adjusted ACQ less taken are both 24740.000000.
4. **Gas made available and not taken is the buyer's.** On the stated day with
   100 made available and 60 taken, the seller shortfall is 0.000000 and the
   buyer shortfall 40.000000.
5. **Make-up expires at the end of its last year.** The power plant's 2028
   deficiency of 688800.000000 is paid at 1501584.000000; 210000.000000 of it
   expires at the end of 2031.
6. **The carry-forward cap binds.** The export ledger's 2029 deficiency of
   6438500.000000 draws a credit of 3219250.000000.
7. **The S-curve is flat outside the published kinks.** Figure 51's curve prices
   3.027500 at 15 and 5.255000 at 30 US$ per barrel.
8. **The obligation penalty.** 676200.000000 MMBtu penalised at 3.500000 is
   2366700.000000; an agreement rate of 2 is lifted to 3.500000.

## HONESTY ABOUT THE SYNTHETIC DATA AND THE SOURCES

The Ekene agreements are synthetic, and the digest says so. Every text is named
with its edition and the date it was read. No licensed text is quoted. A
printed figure in a text that the engine computes more exactly is quoted as
printed and said to be the text's.

## THE VOCABULARY

Binding. Digest section 24. No "AI".

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of". Headings included. Never cite a digest section
number in learner-visible text: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words, repair-history framing, a
reading stated as the law and a reported price with no attribution; the kit's
`leakage.mjs` for graded answers; `numsweep_gsa.mjs` (the kit's `numsweep.mjs`
against `truth-gsa.json`, the harvest of the digest, with the quoting rule
above) and the kit's `litsweep.py` for literals that resolve against nothing;
`lengths.py --tier <tier>` for the prose-word band; `gate_capstone_leak.mjs` for
any capstone name, term, series or value; and `gate_claims.mjs` for every number
in every brief. Read the counts, as well as the exit code.
