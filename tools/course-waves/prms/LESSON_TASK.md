# EC11 Reserves & Resources under SPE-PRMS 2018: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle and its
golden, the fixture README and the engine's source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every quantity, volume, barrel, BOE, Mscf, amount of money, cash
flow, NPV, percentage, chance, probability, correlation, ratio and index to
SIX decimals; years, year counts, project counts, draws, seeds and whole
inputs as whole numbers; an engine message, reason and basis verbatim. A rule
figure of a text (the five-year benchmark of PRMS 2.1.2.3, the 10 years of PIA
2021 s.78(9), the minimum retention years of reg. 6(3) of S.I. No. 37 of 2023)
is written as the text states it and cited to its section or regulation. A
figure printed by the PRMS FAQs, the 2011 Guidelines or the NUPRC release is
cited as a figure and without the text's words.

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
panel, with the Ekene field or their own inputs, and never to recall a
number.

## AN ENGINE COURSE

Every `## Exercise` sends the learner to the calculator panel the lesson tags
(the classification calculator, the reserves calculator or the aggregation
calculator) and names the view to open. There is no Suite app for this course;
do not send a learner to one. Associate m01 l05 says it once in plain words:
the practicals run in the course's own calculator panels, which call the same
engine the lessons quote. Every required input has a visible control in the
panel that writes it into the box; a lesson that asks a learner to change an
input names the control. A case file with several blocks (a prospect and a
lead, two category sets, two aggregations) is read at the block chosen in the
view's block selector.

## NO PRMS PROSE

SPE-PRMS 2018 is licensed CC BY-NC-ND 4.0 and this course is sold. Cite it by
section ("PRMS 2.1.2.1", "PRMS 3.1.3.1") and explain every idea in the
course's own words. Do not paraphrase closely, and do not quote a sentence of
it, of the PRMS FAQs or of the 2011 Guidelines, with or without quotation
marks: `gate_no_prms_prose.py` finds any run of eight of their words.

## THE SEAMS

This course teaches classifying, categorising, adding up and reconciling
reserves and resources. Decline and type curves are "the decline curve
analysis course"; material balance is "the material balance course";
volumetric estimates are "the reservoir volumetrics course"; the cash flow
ledger, discounting and NPV are "the cash flow course"; the Nigerian fiscal
system is "the Petroleum Industry Act course"; distributions, correlation and
Monte Carlo as a subject are "the uncertainty course". Name each in one
sentence where it touches this course and do not re-derive it.

## THE TIER LINE

Every tier's lessons may use a lower tier's material. **No tier's lessons may
use a higher tier's graded question.** An Associate lesson classifies a
project, reads a chance of commerciality and a category table; it does not
work an economic limit, an entitlement basis, an aggregation or a
reconciliation. A Professional lesson does not work an aggregation, a risked
mean or a reconciliation. An Associate or Professional lesson may say that a
later tier takes a question up, in one sentence. The Nigerian terms at
Associate are in words.

## THE READINGS AND THE STATED INPUTS

Taught as the engine's stated choices, verbatim, beside the text each reads
(`BRIEF.md`), and never keyed as the law. Every fact, chance, estimate,
forecast, price, cost, rate, basis, distribution, correlation, seed and
movement is a stated input; a lesson says which text prints a figure (the
Act, S.I. No. 37 of 2023, the SEC rules) and that the engine holds none of the
facts of a project.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

A lesson quotes a NUMERIC FIELD at the digest's precision, as the digest prints
it. An engine message, reason or basis may appear only verbatim, in double
quotation marks, a `> ` blockquote, a backtick span or a four-space indented
block, exactly as the digest prints it, and not as the source of a figure the
lesson then reasons with. `numsweep_prms.mjs` exempts a quoted span only when
its text is EXACTLY a string the digest prints. A reason prints a computed
quantity to six decimals with trailing zeros dropped: the Ekene net
entitlement 2P reads 11229764.729167 in its reason line and the lesson reasons
with the field, 11229764.729167; the undiscounted net cash flow of the best
case reads 382377266.94 in its reason and the field is 382377266.937500.

## THE MONTE CARLO FIGURES

Every sampled figure is quoted with its seed and its draw count, as the digest
prints it, and called an estimate: the Ekene Reserves P90 of 17.300834 on
seed 20271112 and 20000 draws. A lesson never reasons from a sampled figure to
a graded one.

## THE REFUSALS, BY NAME

Digest section 6 tables 80 refusals. **Quote the engine's message in a
blockquote.** The ones each tier must teach:

* Associate m01 l05 to m06: an unknown key, a discovery status the engine does
  not accept, a sub-class outside the three Prospective ones, a chance stated
  for Reserves, estimates out of order, the incremental method for
  Prospective Resources, the Nigerian notes on an undiscovered accumulation.
* Professional m01 to m06: a sub-class the facts contradict, production
  without an investment decision, a criterion left out or not true or false,
  a zero increment against a negative one, mixed forms, a high case that fails
  when the best passes, the prices one row short, capital after the licence
  expiry, a royalty form the engine does not accept, no loss relief choice.
* Expert m01 to m06: no correlation, a missing pair, a correlation of 1, a
  matrix that is not positive semidefinite, no seed, a triangular that cannot
  be fitted, a normal whose low estimate is below 0, a chance stated for
  Reserves, production by category, production in Contingent Resources, the
  two economic-limit rules disagreeing, and the caps.

## SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **A prospect's chance of commerciality is the product of two chances.**
   EKN-6: 20.000000 percent; EKN-7: 10.500000 percent.
2. **The low estimate is the P90.** The Ekene Main 1P of 8.890000 carries the
   P90 label.
3. **Increments rebuild the cumulative categories.** A Probable of 7.760000 and
   a Possible of 8.340000 from 8.890000, 16.650000 and 24.990000.
4. **The economic limit cuts each case on its own.** 2033, 2037 and 2040 on
   EKN-1.
5. **1P is 0 when the low case fails.** The FAQ 3.3 figures: 1P 0.000000 and
   2P 7000000.000000.
6. **The basis moves the figure.** 2P of 18873554.166667 BOE gross,
   13211487.916667 at the working interest and 11229764.729167 net.
7. **A sum of low estimates is the low of the total only under total
   dependence.** 15.809794 arithmetic against a sampled P90 of 17.300834 (seed
   20271112, 20000 draws).
8. **The Guidelines' two blocks.** 71.800000 arithmetic; the sampled P90 of
   independent blocks 76.623299 (seed 2011, 200000 draws).
9. **A risked mean names its chances.** 10.114488 against 20.637674 unrisked.
10. **A reconciliation adds stated movements.** The Ekene Reserves close at
    18.300000, 25.600000 and 33.900000.
11. **Two economic-limit rules can disagree.** 2030 by the trailing trim, 2027
    by the cumulative peak.

## HONESTY ABOUT THE SYNTHETIC DATA AND THE SOURCES

The Ekene field is synthetic, and the digest says so. Every text is named with
its edition, its licence and the date it was read. No licensed text is quoted.
A text's quirk (the table and the figure with two numbers, the release that
prints one figure short, the bilingual edition) is shown as the digest shows
it. Say plainly that no gazetted NUPRC reserves reporting regulation was found.

## THE VOCABULARY

Binding. Digest section 31. No "AI".

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
reading stated as the law, a hidden default and a licensed text quoted;
`gate_no_prms_prose.py` for any run of eight words of SPE-PRMS 2018, the FAQs
or the 2011 Guidelines; the kit's `leakage.mjs` for graded answers;
`numsweep_prms.mjs` (the kit's `numsweep.mjs` against `truth-prms.json`, the
harvest of the digest, with the quoting rule above) and the kit's
`litsweep.py` for literals that resolve against nothing; `lengths.py --tier
<tier>` for the prose-word band; `gate_capstone_leak.mjs` for any capstone
name, input, series or value; and `gate_claims.mjs` for every number in every
brief. Read the counts, as well as the exit code.
