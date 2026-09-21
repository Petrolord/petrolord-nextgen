# H1 Safety Performance Statistics & KPIs: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task file
is quoted from it. The engine's FINDINGS record, the oracle and the engine's
source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares the precisions: rates on every base, interval limits, rate ratios,
p-values, proportions, exposure units, centre lines and derived hours to SIX
decimals; chi-square and gamma quantities to TWELVE; counts and stated hours as
whole numbers.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. It self-checks and reports zero
problems. Do not add, rename or reorder a lesson: change `structure.py` and
re-run it.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, markdown table rows and `{{panel` lines are excluded, and headings are
counted. A raw word count over the whole file is a different, larger measure.

Keep the H1 that `scaffold.py` writes (the lesson title exactly) and the panel
line where `structure.py` says one goes. An opening paragraph under the H1,
then short `##` sections ending in `## Exercise`: the written lessons carry
four or five `##` headings at Associate and Expert and five or six at
Professional, the Exercise included. A small table, numbers first, and an
`## Exercise` that asks the learner to DO something with a number the lesson
printed, never to recall one.

## THE TIER LINE, AND WHY IT IS HARD

Every tier's lessons may use a lower tier's arithmetic. **No tier's lessons may
use a higher tier's.** An Associate lesson never shows an interval or a
p-value; a Professional lesson never draws a u-chart. The kit's `leakage.mjs`
judges a reach by which digest section owns the figure: sections 1 to 12 are
Associate, 13 to 20 Professional, 21 to 27 Expert.

## THE REFUSALS, BY NAME

Digest section 4 tables 22 refusals across 9 functions. **Quote the engine's
message in a blockquote.** A paraphrase teaches a message the learner will
never see. The ones each tier must teach:

* Associate m01 l05: the `count`, `exposureHours` and `base` refusals, and why
  the base has no default.
* Associate m04 l04: events in a period with no hours, named by its index.
* Professional m02 l04: `confidence` given as 95, and no confidence at all.
* Professional m04 l05: both groups empty.
* Expert m01 l05: a u-chart point with no hours, and a chart with no events.

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **The base, section 2.** UGHELLI's 9 recordables in 2318640 hours read
   0.776317 per 200,000 hours and 3.881586 per 1,000,000.
2. **Hours and never headcount, section 3.** Two crews of 40 with one recordable
   each read 2.500000 and 1.717033 per 200,000 hours, and the same per head.
3. **Sum then divide, section 10.** KWALE's pooled rate is 0.968312; the mean of
   its site rates is 1.754760.
4. **The rolling rate, section 11.** AKASO's first window reads 1.208038 against
   a mean of monthly rates of 2.026485, because one short month's own rate is
   10.964912.
5. **Zero events, section 17.** A crew with no recordables in 41300 hours cannot,
   at 95 percent, rule out a true rate as high as 17.863823 per 200,000 hours;
   the rule of three gives 14.527845.
6. **A quiet chart, section 23.** EGBEMA's month 3 reads 8.227913 and does not
   signal, because with 97230 hours its upper limit is 10.211920.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices: the base is required; the
severity rate has no single standard; the API RP 754 tier is an input; sum then
divide; the central p-value; strictly outside. Say what the alternative is and
why the engine did not take it, using the digest's own words.

## THE VOCABULARY

Binding. Digest section 28. Always "Poisson distribution" or "Poisson count
model". Always "severity rate". A confidence interval is an interval on an
estimated rate and no P label is used. Write "observed FAR" where a predicted one
could be meant.

## NO HISTORY

This engine has none. A sentence that begins "the engine used to" or "before the
repair" is a defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included.

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the four legislated words; the kit's `leakage.mjs` for
graded answers and cross-tier reaches; the kit's `numsweep.mjs` and
`litsweep.py` for literals that resolve against nothing; `gate_capstone_leak.mjs`
for any capstone workplace, count, hours or answer; and `gate_claims.mjs` for
every number in every brief. Read the counts rather than the exit code.
