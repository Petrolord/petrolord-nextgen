# EC9 Joint Ventures, Operating Agreements & Cost Recovery: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle and its
golden, the fixture README and the engine's source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every amount of money, interest, share, percentage, rate,
multiple, balance and present value to SIX decimals; years, months, day counts,
hours and whole inputs as whole numbers; an engine message, reason and basis
verbatim. A rule figure of a text (the Act's 60 percent, the Norwegian 10
percent and the lower of 5 percent and NOK 75 million, the 0.65 percent) is
written as the text states it and cited to its section or article, as the
digest's provisions section does.

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
panel, with the Ekene joint venture or their own terms, and never to recall a
number.

## AN ENGINE COURSE

Every `## Exercise` sends the learner to the calculator panel the lesson tags
(the account calculator, the recovery calculator or the agreement calculator)
and names the view to open. There is no Suite app for this course; do not send
a learner to one. Associate m01 l05 says it once in plain words: the practicals
run in the course's own calculator panels, which call the same engine the
lessons quote. Every required contract term has a visible control in the panel
that writes it into the box; a lesson that asks a learner to change a term
names the control.

## THE SEAMS

This course teaches joint venture and operating agreement mechanics and PSC
cost recovery as contracts. The cash flow ledger, discounting and NPV as a
subject are "the cash flow course"; fiscal regime design is "the fiscal regime
course"; the Nigerian fiscal system is "the Petroleum Industry Act course";
portfolio choice and the field development plan are "the portfolio course" and
"the field development planning course". Name each in one sentence where it
touches this course and do not re-derive it.

## THE TIER LINE

Every tier's lessons may use a lower tier's material. **No tier's lessons may
use a higher tier's graded question.** An Associate lesson works one month's
cash call and its adjustment; it does not work a year's reconciliation ledger,
a carry recovery, a default or a PSC. A Professional lesson does not work a
non-consent premium, a buy-in or the three readings side by side. An Associate
or Professional lesson may say that a later tier takes a question up, in one
sentence.

## THE THREE READINGS AND THE STATED INPUTS

Taught as the engine's stated choices, verbatim, beside the text each reads
(`BRIEF.md`), and never keyed as the law. The limit base of a PSC, the
interest method, the grace, the reconciliation lag and every tolerance and
scale are stated inputs; a lesson says which text prints a figure (the
Norwegian agreement, the Kenya model) and that the engine holds none of them.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

A lesson quotes a NUMERIC FIELD at the digest's precision, as the digest prints
it. An engine message, reason or basis may appear only verbatim, in double
quotation marks, a `> ` blockquote, a backtick span or a four-space indented
block, exactly as the digest prints it, and not as the source of a figure the
lesson then reasons with. `numsweep_joa.mjs` exempts a quoted span only when its
text is EXACTLY a string the digest prints. A reason rounds money to the cent:
the Ekene carry's payout reason prints 7267760.62; the lesson reasons with the
field, 7267760.617882.

## THE REFUSALS, BY NAME

Digest section 5 tables 78 refusals. **Quote the engine's message in a
blockquote.** The ones each tier must teach:

* Associate m01 l05 to m06: interests that do not sum to 100, an unknown key
  (carry, wi), carriers with no stated rule, a month that skips, no
  reconciliation lag, no budget tolerance, a category with no overhead scale.
* Professional m01 to m06: a negative call rule the engine does not accept, no
  uplift, an uplift under basis "pia-s85-4", a back-in target of 61 under the
  Act, an upfront refund under the Act, no interest method, no grace, a paid
  share, a gross limit above the revenue left after royalty, no opening pool.
* Expert m01 to m06: every party consenting, a premium multiple below 100,
  years stated with a buy-in, and the caps.

## SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **A carry moves cost and never moves production.** On the Ekene carry NOC's
   beneficial interest is 20.000000 and its paying interest 0.000000; EKO pays
   50.000000.
2. **An over-call is credited a stated lag later.** January 2027's over-call of
   400000.000000 reaches the March call, two months later.
3. **The budget tolerance is the lower of two.** On the Ekene 2027 budget the
   allowed overrun is 3000000.000000, held by the amount.
4. **Overhead is marginal.** The Ekene 2031 operating base of 58000000.000000
   is charged 1455000.000000.
5. **A carry recovered with a compound uplift.** Recovered in 2033; the payout
   balance is 7267760.617882. Under PIA s.85(4), with no uplift, in 2031.
6. **The Act refunds development and production.** NOC's back-in refund is
   98000000.000000, with 156000000.000000 excluded.
7. **Cover is pro rata among the non-defaulting parties.** EKO covers
   1230769.230769 and PA 769230.769231 of PB's unpaid 2000000.000000.
8. **Simple and compounded monthly differ.** 20625.000000 and 20210.781250 on
   the same default.
9. **The published PSC checks.** The World Bank example returns 43.200000 and
   56.800000 where the note prints 43 and 57.
10. **The premium is on the proportionate share.** PB's share of 2700000.000000
    at the stated 400.000000 percent is 10800000.000000.

## HONESTY ABOUT THE SYNTHETIC DATA AND THE SOURCES

The Ekene joint venture is synthetic, and the digest says so. Every text is
named with its edition and the date it was read. No licensed text is quoted. A
printed figure in a text that the engine computes more exactly is quoted as
printed and said to be the text's; a printed figure that is wrong (OpenOil's
11.75) is shown with the arithmetic that corrects it.

## THE VOCABULARY

Binding. Digest section 25. No "AI".

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
reading stated as the law, a hidden default and a quoted licensed text; the
kit's `leakage.mjs` for graded answers; `numsweep_joa.mjs` (the kit's
`numsweep.mjs` against `truth-joa.json`, the harvest of the digest, with the
quoting rule above) and the kit's `litsweep.py` for literals that resolve
against nothing; `lengths.py --tier <tier>` for the prose-word band;
`gate_capstone_leak.mjs` for any capstone name, term, series or value; and
`gate_claims.mjs` for every number in every brief. Read the counts, as well as
the exit code.
