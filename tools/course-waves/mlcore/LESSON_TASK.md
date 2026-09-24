# D2 Machine Learning on Well Data: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle, the library
pins, the dataset generator's source and the engine's source comments are
PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every coefficient, standard error, score, metric, probability,
centre, scale, condition number and difference to SIX decimals; counts, row
numbers, iterations, seeds and well numbers as whole numbers; relative
differences and very small magnitudes in exponent form.

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
`## Exercise` that asks the learner to DO something in the panel with the
Ekene rows or their own, never to recall a number.

## THE TIER LINE, AND WHY IT IS HARD

Every tier's lessons may use a lower tier's methods. **No tier's lessons may use
a higher tier's.** An Associate lesson never shows a penalty, a fold, a
classifier or a condition number; a Professional lesson never shows a condition
number, a separation test, a Newton trace, an importance or a learning curve.
The kit's `leakage.mjs` judges a reach by which digest section owns the figure:
sections 1 to 10 are Associate, 11 to 16 Professional, 17 to 25 Expert.

## ROWS, WELLS AND SEEDS

The engine counts rows from 0. Say "row 150 of the 300 rows, counted from 0"
when you name one. A seeded result is quoted WITH its seed and fraction: the
teaching split is test fraction 0.3 and seed 5. Well names sort by character,
so EKENE-10 comes before EKENE-2 in every list the engine returns.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

Every refusal and warning carries figures inside a sentence, printed as the
shortest decimal that reads back to the number, so a condition number prints
every digit ("the scaled condition number 5206821213.915052") and a warning
prints its step ("a largest component of 5.791630774699914"). THE RULE: a
lesson quotes a NUMERIC FIELD at the digest's precision, as the digest prints
it. A message may appear only verbatim, in double quotation marks or a `> `
blockquote, as the engine's own words, and never as the source of a figure the
lesson then reasons with.

HOW THE GATE KNOWS. `numsweep_mlcore.mjs` exempts a quoted span only when its
text is EXACTLY a message or basis the digest prints: double quotation marks on
one line, or a `> ` blockquote line. A quote that differs by one character is
swept like any other text, and any figure of more than fifteen significant
figures outside such a quote fails as FLOAT NOISE even where the truth file
would resolve it.

## THE REFUSALS, BY NAME

Digest section 3 tables 31 refusals across 18 functions. **Quote the engine's
message in a blockquote.** The ones each tier must teach:

* Associate m01 l05: a missing value in X, a null target, too few rows for the
  coefficients.
* Associate m03: a constant feature on the training rows (the mud weight of
  one well).
* Professional m02: more folds than wells. Professional m04: one class only,
  a label other than 0 and 1.
* Expert m01: the doubled NPHI column and Filip at the default limit.
  Expert m02: complete and quasi-complete separation.
* Expert m03 teaches the WARNING of a fit that stops early, which is no
  refusal.

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **Rows of one well on both sides, section 4.** A random-row split of the
   270 sonic rows puts test rows in all 9 wells; the group split holds out
   EKENE-4, EKENE-5 and EKENE-8, 90 rows.
2. **A coefficient has a unit, section 7.** One gAPI moves the fitted DT by
   0.288005 us/ft; NPHI's 138.783590 is per whole v/v, 1.387836 per 0.01.
3. **Test can beat training, section 8.** On the teaching split the test RMSE
   is 4.282693 us/ft against a training RMSE of 5.758010: one split is one draw
   of wells.
4. **A penalty trades bias for variance, section 11.** With the four attributes
   the test RMSE is 16.999672 at lambda 0, 5.759287 at lambda 100 and 8.607538
   at lambda 1000.
5. **Leakage needs a path, section 13.** At seed 5 the attributes give a
   random-row RMSE of 5.311723 against a group RMSE of 16.999672; on the logs
   alone the optimism is -1.747549, and it is negative on 7 of the 12 seeds.
6. **A range check sees only the rows that leave the range, section 23.**
   EKENE-6's predicted sonic misses the withheld one by an RMSE of 13.176539
   against a k-fold estimate of 5.826789, and min-max flags 4 of its 30 rows.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices, in the digest's words (the
table is section 25): the population SD, mulberry32 and the sorted names,
round robin folds, the test mean for R-squared, the 1e8 refusal, the full-step
stopping rule, separation decided exactly, F1 as 2TP / (2TP + FP + FN), the
null start of the ROC curve, the log loss clip, the sign of an importance drop,
learning curves in wells. Say what the alternative is and why the engine did
not take it.

## HONESTY ABOUT THE SYNTHETIC FIELD

The Ekene field is synthetic, and section 2 says so. The planted well offsets
and the withheld sonic exist only because the generator drew them; a lesson
that uses them says it is doing what no real field allows, as section 23 does.

## THE VOCABULARY

Binding. Digest section 26: "test" is a well held out unless a random-row split
is named; "standard deviation" names its divisor; "R-squared" names its rows
and reference; "separation" is the logistic property; "importance" names its
model, rows and seed; "machine learning" names the method. No lesson calls a
model artificial intelligence, and no P label is used.

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included. Never
cite a digest section number in learner-visible text: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words; the kit's `leakage.mjs` for
graded answers and cross-tier reaches; `numsweep_mlcore.mjs` (the kit's
`numsweep.mjs` against `truth-mlcore.json`, the harvest of the digest, with the
message-quote rule above) and the kit's `litsweep.py` for literals that resolve
against nothing; `lengths.py --tier <tier>` for the prose-word band;
`gate_capstone_leak.mjs` for any capstone field name, dataset, stated input or
answer; and `gate_claims.mjs` for every number in every brief. Read the counts
rather than the exit code.
