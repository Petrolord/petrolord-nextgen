# SC4 Offshore & Marine Logistics: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle and its
golden, the fixture README and the engine's source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every distance, speed, time in hours or days, vessel-day, fuel
tonnage, amount of money, area, weight, volume, fraction, utilisation,
probability, factor, count that is not whole and queue figure to SIX decimals;
whole counts (voyages rounded up, vessels, berths, units, draws, seeds) and
whole inputs as whole numbers; an engine message, reason and basis verbatim. A
figure a source prints (Adan and Resing's tables, Iversen's example, Skoko et
al.'s tables, the Wikipedia article's packings) is cited as the source prints
it, with its table, equation or example, and without the source's words.

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
panel, with the Ekene cluster or their own inputs, and never to recall a
number.

## AN APP COURSE

The Suite app is the Marine Logistics Planner, which runs the same engine.
Associate m01 l05 says it once in plain words: the practicals run in the
course's own calculator panels, which call the same engine the lessons quote,
and a Suite user will find the same figures in the Marine Logistics Planner.
Every `## Exercise` sends the learner to the calculator panel the lesson tags
(the voyage and fleet calculator, the deck calculator, the shore base
calculator or the variability calculator) and names the view and the start to
open. Never make the Suite a requirement. Every required input has a visible
control in the panel that writes it into the box; a lesson that asks a learner
to change an input names the control. A case file with several blocks (a milk
run and dedicated voyages, an M/M/c and an M/D/c base) is read at the block
chosen in the view's block selector.

## NO SOURCE PROSE

Cite each source by table, equation, section or example ("Adan and Resing,
Table 5.1", "eq. 5.3", "Iversen, Example 12.3.1", "Skoko et al., Table 7") and
explain every idea in the course's own words. Do not paraphrase closely, and
do not quote a sentence of any of the six sources, with or without quotation
marks: `gate_no_source_prose.py` finds any run of eight of their words. Aas,
Halskau and Wallace is taught by concept only.

## THE SEAMS

This course plans voyages, sizes fleets, packs decks and queues the shore
base. Monte Carlo as a subject is "the uncertainty course"; contracting a
vessel is "the procurement course"; spares and stock are "the materials
course"; supplier management is "the contracts course"; discounting and NPV
are "the cash flow course". Name each in one sentence where it touches this
course and do not re-derive it.

## THE TIER LINE

Every tier's lessons may use a lower tier's material. **No tier's lessons may
use a higher tier's graded question.** An Associate lesson plans a voyage and
reads its binding constraint; it does not size a fleet, pack a deck by a rule
or queue a base. A Professional lesson does not work a queue or a Monte Carlo.
An Associate or Professional lesson may say that a later tier takes a question
up, in one sentence.

## THE READINGS AND THE STATED CHOICES

The ten readings (`BRIEF.md`) are the engine's stated conventions, each taught
with its alternative and never keyed as the law. The stated choices (the
activities the weather slows, both rounding rules, the packing rule, the queue
model, the concurrent choice) are inputs: a lesson says a plan must name them.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

A lesson quotes a NUMERIC FIELD at the digest's precision, as the digest prints
it. An engine message, reason or basis may appear only verbatim, in double
quotation marks, a `> ` blockquote, a backtick span or a four-space indented
block, exactly as the digest prints it, and not as the source of a figure the
lesson then reasons with. `numsweep_marine.mjs` exempts a quoted span only
when its text is EXACTLY a string the digest prints. A reason prints a
computed quantity to six decimals with trailing zeros dropped: the AHTS reason
reads "(130.909091%)" and the lesson reasons with the field, a utilisation of
1.309091; the shortfall reason reads "short by 2.916667 vessel-days" and the
field is 2.916667.

## THE MONTE CARLO FIGURES

Every sampled figure is quoted with its seed and its draw count, as the digest
prints it, and called an estimate: the P90 of the Ekene week's vessel-days of
7.977705 on seed 20260927 and 20000 draws. A lesson never reasons from a
sampled figure to a graded one.

## THE REFUSALS, BY NAME

Digest section 5 tables 79 refusals. **Quote the engine's message in a
blockquote.** The ones each tier must teach:

* Associate m01 l05 to m06: an unknown key, a missing speed, a usable fraction
  of zero or above one, a weather factor below one or above the cap, an
  activity the engine does not know, a milk run with a stop missing or
  repeated, the wrong number of legs, a distance on a milk run, a load of a
  product the vessel has no tank for, a missing tank.
* Professional m01 to m06: available days above the period, a missing or
  unknown rounding rule, minimum visits that are not whole, a missing demand,
  a packing rule the engine does not know, zero voyages, a quantity that is
  not whole, the units cap.
* Expert m01 to m06: a berth utilisation at or above one with the printed
  bound, a service of zero hours, a model the engine does not know, no
  concurrent choice, a working day above 24 hours, the berths cap, no seed, a
  triangular out of order, the draws cap.

## SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **Sailing hours are distance over speed.** The Ekene milk run sails
   206.000000 NM at 11 knots.
2. **The weather factor acts on the activities a plan names.** Port time stays
   at 12.000000 hours with the factor on sailing and field time, and becomes
   14.400000 when port time is named too.
3. **Fuel follows time.** 19.876364 t at USD 870 a tonne costs 17292.436364.
4. **The binding constraint has the highest utilisation.** Deck area at
   0.900000 on the PSV milk run.
5. **Demand over capacity sets the voyages.** 3.100000 voyages of demand by
   deck area, rounded up to 4.
6. **Vessel-days are voyages times voyage days.** 10.345455 for the week on
   the PSV milk run.
7. **First-fit decreasing packs the big units first.** 599.229600 m2 carried
   and 11 small units left behind, where first fit in the booked order
   carries 580.629600 m2.
8. **A second berth makes a queue.** A mean wait of 3.180124 hours as M/M/c and
   1.665786 hours as M/D/c at a berth utilisation of 0.533333.
9. **A printed table can slip.** Adan and Resing print 1.53 at five servers;
   the formula gives 1.524986.
10. **A Monte Carlo figure carries its seed.** 7.977705 and 11.908677 as the P90
    and P10 of the week's vessel-days (seed 20260927, 20000 draws).

## HONESTY ABOUT THE SYNTHETIC DATA AND THE SOURCES

The Ekene cluster is synthetic, and the digest says so. Every source is named
with its edition, its licence and the date it was read. No source prose is
quoted. A source's quirk (the printed slip, the total the rounded days do not
reproduce, the draft handbook, the living page) is shown as the digest shows
it.

## THE VOCABULARY

Binding. Digest section 30. No "AI".

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of", no "and not", no "and never". Headings included.
Never cite a digest section number in learner-visible text, and never write
"the digest" there: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for repair-history framing, a reading stated as the law,
a hidden default and a source quoted; `gate_no_source_prose.py` for any run of
eight words of the six sources; the kit's `leakage.mjs` for graded answers;
`numsweep_marine.mjs` (the kit's `numsweep.mjs` against `truth-marine.json`,
the harvest of the digest, with the quoting rule above) and the kit's
`litsweep.py` for literals that resolve against nothing; `lengths.py --tier
<tier>` for the prose-word band; `gate_capstone_leak.mjs` for any capstone
name, input, series or value; and `gate_claims.mjs` for every number in every
brief. Read the counts, as well as the exit code.
