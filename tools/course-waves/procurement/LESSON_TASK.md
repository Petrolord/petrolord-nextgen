# SC2 Procurement, Tendering & Contracting: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle and its
golden, the fixture README and writer, and the engine's source comments are
PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every price, amount, total, correction, discount, deviation,
omission, adjustment, evaluated cost, life-cycle cost, estimate, share amount,
payment, margin, overrun, cost, day count, score, points total, percentage,
content, lead, ratio, weight, mean, standard deviation, limit, percentile and
probability to SIX decimals; counts, ranks, weeks, years, seeds and iterations
as whole numbers; an engine message verbatim, figures and all. A money figure
may be written with its thousands grouped by commas, with the same digits the
digest prints.

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
panel, with the Ekene tenders or their own bids, never to recall a number.

## AN ENGINE COURSE

Every `## Exercise` sends the learner to the calculator panel the lesson tags
(the envelope calculator, the award calculator or the contract calculator) and
names the view to open. There is no Suite app for this course; never send a
learner to one. Module 1 of the Associate tier says it once in plain words:
the practicals run in the course's own calculator panels, which call the same
engine the lessons quote.

## THE TIER LINE, AND WHY IT IS HARD

Every tier's lessons may use a lower tier's methods. **No tier's lessons may use
a higher tier's.** An Associate lesson never shows a life-cycle cost, the
weighting band, an abnormally low test, a Nigerian content percentage or an
s.14 lead; a Professional lesson never shows a contract-type comparison, a cost
percentile, a should-cost or the boundary table. The kit's `leakage.mjs` judges
a reach by which digest section owns the figure: sections 1 to 10 are
Associate, 11 to 16 Professional, 17 to 24 Expert.

An Associate lesson may say that the award can also go to the lowest evaluated
cost with a life-cycle cost and that this is the Professional tier's question.

## IDS, SETTINGS AND SEEDS

A bid is named by its code (WS1 to WS6, MS1 to MS5); a criterion, a bill line
and a content item by their fixture ids. Every evaluated cost is quoted with its
omission rule and its schedule; every combined score with its technical weight
and methods; every s.14 figure with its reading; every Monte Carlo figure with
its seed and iteration count (the well services contracting runs 20000
iterations on seed 20270211).

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

Every reason and basis carries figures inside a sentence, printed as the
shortest decimal that reads back to the number (the engine's reason for MS2
prints its content as 61.584657109647424%). THE RULE: a lesson quotes a NUMERIC
FIELD at the digest's precision, as the digest prints it. A message, a reason
or a basis string may appear only verbatim, in double quotation marks, a `> `
blockquote, a backtick span or a four-space indented block, exactly as the
digest prints it, and never as the source of a figure the lesson then reasons
with.

HOW THE GATE KNOWS. `numsweep_procurement.mjs` exempts a quoted span only when
its text is EXACTLY a message or a basis the digest prints. A quote that
differs by one character is swept like any other text, and any figure of more
than fifteen significant figures outside such a quote fails as FLOAT NOISE.

## THE REFUSALS, BY NAME

Digest section 4 tables 113 refusals across 11 functions. **Quote the engine's
message in a blockquote.** The ones each tier must teach:

* Associate m01 l05: no pass mark, weights summing to 99, a price method the
  engine does not offer, no award basis.
* Associate m02 to m06: a score above its maxScore, a missing score, a
  mandatory entry with no met flag, decimalMisplaced on a line of quantity 0,
  omission rule lowest, an item both omitted and priced, a receipt time without
  its zone, no technical weight, every bid rejected.
* Professional m01 to m06: a life cycle of 0 years, four annual costs in a
  five-year life cycle, a technical weight of 1.2, four bids and no cost
  estimate, a Schedule line the engine does not hold, valves reported by
  tonnage, mixed units and no weights, a stated target with no source, no s.14
  reading, Nigerian content with a combined award.
* Expert m01 to m05: no seed, no iterations, a duration with min above mode,
  both a fee fraction and a fixed fee, an activity the wellCost engine refuses
  (passed through by name), no band, an empty programme, the caps.

**A result with a reason is not a refusal.** A bid excluded at a stage, s.14
not engaged, a null s.14 lead and a flag on the band return a result with the
reason. Say "returned with the reason", never "refused".

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **The lowest evaluated cost and the award can differ, section 10.** On the well services
   tender WS5 has the lowest evaluated cost, 862141.000000, and the combined
   score awards WS3 at 96.998434; under a lowest-cost award WS5 wins.
2. **A bid at the pass mark passes, section 6.** WS5 scores exactly 70.000000
   and passes; WS4 scores 65.000000 and its price is never opened.
3. **An omission is priced at the average, section 8.** WS3 omits nitrogen; the
   other responsive bids quote 33600.000000, 35400.000000 and 37200.000000,
   and the engine adds 35400.000000.
4. **The reading of the Act decides, section 15.** MS2 leads MS4 by 4.541020
   percentage points, or by 7.960608 percent of MS4's content: MS4 stands under
   the first reading and s.14 selects MS2 under the second.
5. **For a cost, P90 is the low figure, section 18.** The day rate's P90 cost is
   837897.131515 and its P10 1029964.481686, on seed 20270211 with 20000
   iterations.
6. **The Guidance disagrees with itself, section 21.** Annex 2 prints Company
   B's total as 82; its printed scores sum to 77.000000.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices, in the digest's words (the
table is section 24): the arithmetic tolerance, the tie key and tie-break, the
completion-time base, who prices an omission, overall content across units,
the s.14 group, the plan of a contract, an overrun, the cost percentiles, the
should-cost band and the ALB standard deviation. Say what the alternative is and
why the engine did not take it.

## HONESTY ABOUT THE SYNTHETIC DATA AND THE SOURCES

The Ekene tenders are synthetic, and section 3 says so; a lesson that leans on
a planted situation says it was planted. Every source is named with its edition
and the date it was read (section 2). No licensed text is quoted. The course
teaches the omission rule of the cited texts, the average, and grades nothing
on the uncited 'highest' option.

## THE VOCABULARY

Binding. Digest section 25: "responsive" names the stage; "lowest evaluated
cost" names the evaluated cost; "most advantageous" names the highest combined
score; "content" is Nigerian content in its measured unit; "P90" of a cost is
the LOW figure, printed beside its definition; "should-cost" is the company's
estimate. No other P label anywhere. No "AI".

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included. Never
cite a digest section number in learner-visible text: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words; the kit's `leakage.mjs` for
graded answers and cross-tier reaches; `numsweep_procurement.mjs` (the kit's
`numsweep.mjs` against `truth-procurement.json`, the harvest of the digest,
with the quoting rule above) and the kit's `litsweep.py` for literals that
resolve against nothing; `lengths.py --tier <tier>` for the prose-word band;
`gate_capstone_leak.mjs` for any capstone name, code, scope, price or value;
and `gate_claims.mjs` for every number in every brief. Read the counts rather
than the exit code.
