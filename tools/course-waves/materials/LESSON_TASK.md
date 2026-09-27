# SC3 Materials, Spares & Inventory Management: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle and its
golden, the fixture README and the engine's source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every quantity, cost, amount of money, score, share, percentage,
probability, safety factor, sigma, mean and ratio to SIX decimals; months,
days, counts, ranks, levels, spares, draws, seeds and whole inputs as whole
numbers or as given; an engine message, reason and basis verbatim. A figure a
lecture prints is cited by lecture and slide, as the digest prints it, and
without the lecture's words.

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
panel, with the Ekene register or their own inputs, and never to recall a
number.

## AN APP COURSE

Every `## Exercise` sends the learner to the calculator panel the lesson tags
(the register calculator, the stock calculator or the spares calculator) and
names the view and the start case to choose. The Suite app is the Materials &
Spares Planner; a lesson may say once that the same inputs typed into the
Planner give the same figures, and never that a learner needs a Suite seat.
Associate m01 l05 says it in plain words: the practicals run in the course's
own calculator panels, which call the same engine the lessons quote, and the
Planner in the Suite is built on the same engine. Every required input has a
visible control in the panel that writes it into the box; a lesson that asks a
learner to change an input names the control. A case file with several blocks
(three safety-stock calls, a Poisson call and a Monte Carlo call) is read at
the block chosen in the view's block selector.

## NO LECTURE PROSE

The MIT OpenCourseWare lectures are licensed CC BY-NC-SA 4.0 and this course is
sold. Cite a figure by lecture and slide ("lecture 11 slide 24") and explain
every idea in the course's own words. Do not paraphrase a slide closely, do not
copy a slide title, and do not quote a sentence of slide text, with or without
quotation marks: `gate_no_ocw_prose.py` finds any run of eight of their words.
Harris 1913 and MIL-HDBK-338B are public domain and may be quoted, only as the
digest quotes them.

## THE SEAMS

This course teaches criticality, ABC, order quantities, safety stock, spares
and slow-moving stock. Tendering and bid evaluation are "the procurement
course"; terminal and depot stock are "the supply course"; failure rates from
field data are "the rotating course"; distributions and Monte Carlo as a
subject are "the uncertainty course"; discounting and NPV are "the cash flow
course"; the reserves framework behind the P-label sentence is "the reserves
and resources course". Name each in one sentence where it touches this course
and do not re-derive it.

## THE TIER LINE

Every tier's lessons may use a lower tier's material. **No tier's lessons may
use a higher tier's graded question.** An Associate lesson classifies items,
ranks them by value, sizes an order and bands slow stock; it does not work a
discount, a safety stock, a fill rate, a Poisson level, an insurance spare or a
lead-time Monte Carlo. A Professional lesson does not work an insurance spare
or a lead-time Monte Carlo. An Associate or Professional lesson may say that a
later tier takes a question up, in one sentence.

## THE READINGS AND THE STATED INPUTS

Taught as the engine's stated choices, verbatim, beside the alternative each
names (`BRIEF.md`), and never keyed as the law. Every criterion, weight, cost,
rate, demand, lead time, service target, band and limit is a stated input; a
lesson says that the engine holds none of a register's figures and no default
policy.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

A lesson quotes a NUMERIC FIELD at the digest's precision, as the digest prints
it. An engine message, reason or basis may appear only verbatim, in double
quotation marks, a `> ` blockquote, a backtick span or a four-space indented
block, exactly as the digest prints it, and not as the source of a figure the
lesson then reasons with. `numsweep_materials.mjs` exempts a quoted span only
when its text is EXACTLY a string the digest prints. A reason prints money to
the cent and a computed figure to six decimals with trailing zeros dropped: the
BARYTE reason reads a relevant cost of 7861.14 and the lesson reasons with the
field, 7861.142857; the ESP motor reason reads a total of 160003.73 and the
field is 160003.732064.

## THE MONTE CARLO FIGURES

Every sampled figure is quoted with its seed and its draw count, as the digest
prints it, and called an estimate: the mechanical seal's stockout probability
of 0.058600 on seed 20270301 and 20000 draws. A lesson never reasons from a
sampled figure to a graded one, and says that the P90 of a sampled lead time
or demand is the low figure.

## THE REFUSALS, BY NAME

Digest section 8 tables 89 refusals and the stated probes beside them. **Quote
the engine's message in a blockquote.** The ones each tier must teach:

* Associate m01 l05 to m06: an unknown key, weights that do not add to 100, a
  class minimum that does not fall to 0, a score above the scale, the override
  list missing, the cut-offs out of order, a boundary rule not stated, no
  usage value at all, both holding costs or neither, a rounding rule missing,
  a rounding that orders nothing, a band minimum that does not start at 0.
* Professional m01 to m06: a first break above 0, prices that do not fall, a
  break that is not a multiple of the rounding, a discount type not stated, a
  service level of 1, a fill rate without an order quantity, a fill rate on
  certain demand, a protection period of 0, a safety-factor rounding or floor
  not stated, a Poisson mean above the cap.
* Expert m01 to m06: a failure rate or lead time of 0, days a year missing, a
  search limit that is not whole or above the cap, a seed missing, draws above
  the cap, a triangle out of order, a reorder point below 0, and the caps.

## SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **A maximum safety score places an item in the top class.** PSV-KIT scores
   68.000000 and is V.
2. **A class minimum is met at or above it.** MECH-SEAL at 70.000000 is V.
3. **The item that crosses a cut-off.** CEM-G at 83.536840 is B under
   at-or-below and A under include-crossing.
4. **The EOQ is unrounded; the order is rounded.** BARYTE 137.408584, ordered
   as 140.000000 at a penalty of 0.017454 percent.
5. **The discount type moves the order.** CSG-958 all-units 120.000000 at
   349720.000000; incremental 141.000000 at 365590.042553.
6. **Sigma adds as squares.** CHK-BEAN sigma 3.029476 from 2.529822 and
   1.666650.
7. **A service level names its measure.** k 1.644854 at a cycle service level
   of 0.95 and 1.026327 at a fill rate of 0.98.
8. **Periodic review protects over the review period too.** CHK-BEAN's
   order-up-to level 17.301878 against a reorder point of 13.316294.
9. **Poisson for a slow mover.** PSV-KIT needs a level of 5 at a mean of
   2.000000.
10. **Holding against downtime.** The ESP motor's 4 spares at 160003.732064 a
    year.
11. **A printed table can carry a slip.** 339.179604 by the rule against 348
    printed.

## HONESTY ABOUT THE SYNTHETIC DATA AND THE SOURCES

The Ekene register is synthetic, and the digest says so. Every text is named
with its edition, its licence and the date it was read. No licensed text is
quoted. The two printed slips are taught as slips, with the rule's own figure
beside the print. The one-for-one insurance model is stated plainly as the
engine's model, with its MIL-HDBK-338B anchor.

## THE VOCABULARY

Binding. Digest section 30. No "AI".

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of", no "and not", no "and never". Headings included.
Never cite a digest section number in learner-visible text: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words, repair-history framing, a
reading stated as the law, a hidden default and a licensed text quoted;
`gate_no_ocw_prose.py` for any run of eight words of the lectures; the kit's
`leakage.mjs` for graded answers; `numsweep_materials.mjs` (the kit's
`numsweep.mjs` against `truth-materials.json`, the harvest of the digest, with
the quoting rule above) and the kit's `litsweep.py` for literals that resolve
against nothing; `lengths.py --tier <tier>` for the prose-word band;
`gate_capstone_leak.mjs` for any capstone name, input or value; and
`gate_claims.mjs` for every number in every brief. Read the counts, as well as
the exit code.
