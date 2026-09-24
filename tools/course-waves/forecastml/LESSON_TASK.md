# D4 Data-Driven Production Forecasting: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle, the library
pins, the dataset generator's source and the engine's source comments are
PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every rate, level, trend, forecast, fitted value, residual, error,
smoothing parameter, sum of squares, mean squared error, percentage error,
scaled error, scale, percentile, Arps qi, Di and b, R2 and RMSE to SIX
decimals; counts, month indices, origins, steps, horizons, evaluations, seeds
and path counts as whole numbers; very small magnitudes and tie bands in
exponent form; an engine message verbatim, figures and all.

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
Ekene series or their own, never to recall a number.

## THE TIER LINE, AND WHY IT IS HARD

Every tier's lessons may use a lower tier's methods. **No tier's lessons may use
a higher tier's.** An Associate lesson never shows an out-of-sample error, a
MAPE, a MASE, a backtest or a comparison with Arps; a Professional lesson never
shows a bootstrap interval, a P90 or P10, the Arps fit's own parameters, a tie
band, a ranking rule or a cap. The kit's `leakage.mjs` judges a reach by which
digest section owns the figure: sections 1 to 10 are Associate, 11 to 17
Professional, 18 to 24 Expert.

An Associate lesson may say that a fit is in-sample and that testing it is the
Professional tier's question (section 9 says so); the Professional tier may
name that the comparison ranks by MASE (section 17), and the ranking rules
themselves are Expert (section 21).

## MONTHS, INDICES, STEPS AND SEEDS

The engine counts months from 0: month 0 is the first month on production.
Say "month 22, counted from 0" when you name one. A one-step forecast is the
fitted value of a month inside the series; an h-step forecast is step 1, 2,
... past the last month, and step 1 of a 48-month series forecasts month 48. A
seeded result is quoted WITH its seed and its number of paths: the teaching
bootstrap is damped on EKENE-P1, h 12, seed 11, 1000 paths. A backtest is
quoted with its first origin, horizon and step, and whether the parameters were
refitted.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

Every refusal and every reason in `notes` carries figures inside a sentence,
printed as the shortest decimal that reads back to the number. THE RULE: a
lesson quotes a NUMERIC FIELD at the digest's precision, as the digest prints
it. A message or a basis string may appear only verbatim, in double quotation
marks, a `> ` blockquote, a backtick span or a four-space indented block,
exactly as the digest prints it, and never as the source of a figure the
lesson then reasons with.

HOW THE GATE KNOWS. `numsweep_forecastml.mjs` exempts a quoted span only when
its text is EXACTLY a message or a basis the digest prints. A quote that
differs by one character is swept like any other text, and any figure of more
than fifteen significant figures outside such a quote fails as FLOAT NOISE
even where the truth file would resolve it (the digest prints EKENE-P1's Arps
b as returned, 0.49999999999999994, beside its six-decimal field 0.500000; a
lesson that needs b quotes 0.500000 and says the printed value is not the
decimal it looks like).

## THE REFUSALS, BY NAME

Digest section 3 tables 59 refusals across 6 functions. **Quote the engine's
message in a blockquote.** The ones each tier must teach:

* Associate m01 l05: a missing month (named by its index), a series too short
  for its method, a method the engine does not offer.
* Associate m02 to m05: an alpha outside 0 to 1, a beta or a phi on ses, a phi
  on holt, a given phi of 0 or above 1, an h outside 0 to 10000.
* Professional m01 to m03: forecasts that do not match the actuals one for one,
  a lag of 0, an empty training series.
* Professional m04 and m05: a horizon or step of 0, a first origin outside the
  range the method and horizon allow, the origin cap.
* Expert m01 and m02: no seed, a seed outside 0 to 4294967295, nSims of 0 or
  above 100000, a residual pool of 1.
* Expert m03 and m04: fewer than 3 positive months for Arps, a rising series
  with no Arps fit, a method listed twice, a metric the ranking does not offer.

**A metric returned as null is not a refusal.** MAPE through a shut-in month
and MASE on the plateau return null with the reason in `notes`, and the other
metrics are still numbers. Say "returned as null, with the reason", never
"refused".

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **On a steady decline simple smoothing becomes the naive forecast, section
   5.** Fitted, alpha stops on its upper bound 1 on four of the five long
   wells; the noisy EKENE-P4 fits 0.528376.
2. **A straight trend runs below zero, section 6.** Holt fitted on EKENE-P5
   crosses zero between step 16 (0.078646) and step 17 (-0.623541); the damped
   trend on the same well is 6.569332 at step 24.
3. **The lag is part of the figure, section 13.** On the teaching hold-out
   holt's MASE is 0.241874 at m 1 and 0.024087 at m 12.
4. **A shut-in month voids MAPE and caps sMAPE, section 12.** With the shut-in
   in the actuals MAPE is null, and each shut-in term of sMAPE scores
   200.000000; sMAPE is 108.172490.
5. **A workover changes the winner, section 17.** Before the shut-in arps ranks
   first by MASE (0.389192); after the workover holt ranks first (0.571171) and
   arps third (0.605968).
6. **A point forecast can sit outside its own interval, section 18.** ses on
   EKENE-P1 forecasts 211.400000 at step 12; the P10 (high) of its paths is
   69.250000.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices, in the digest's words (the
table is section 24): the component form, the start at the first month with
the second spent, the least one-step SSE by a grid and a compass search in a
stated box, the fitted phi range, MAPE null at a zero actual, sMAPE with
absolute values on 0 to 200, MASE scaled in-sample on the training months, the
expanding window, the residual bootstrap with residuals as fitted, the
platform's quantile, P90 as the low case, a month as a day for Arps, and the
ranking by MASE. Say what the alternative is and why the engine did not take
it.

## HONESTY ABOUT THE SYNTHETIC FIELD

The Ekene field is synthetic, and section 2 says so. EKENE-P1 was drawn from an
Arps curve, which is why the Arps baseline ranks first on it; a lesson that
leans on that says the well was built that way.

## THE VOCABULARY

Binding. Digest section 25: "forecast" names its method; "error" is actual
minus forecast; "P90" is the low case and P10 the high case; "accuracy" names
its metric and months; "trend" is the smoothed state b; "machine learning"
names the method. No lesson calls a method artificial intelligence, and no P
label is used in any meaning but exceedance.

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included. Never
cite a digest section number in learner-visible text: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words; the kit's `leakage.mjs` for
graded answers and cross-tier reaches; `numsweep_forecastml.mjs` (the kit's
`numsweep.mjs` against `truth-forecastml.json`, the harvest of the digest, with
the quoting rule above) and the kit's `litsweep.py` for literals that resolve
against nothing; `lengths.py --tier <tier>` for the prose-word band;
`gate_capstone_leak.mjs` for any capstone field name, dataset, stated input or
answer; and `gate_claims.mjs` for every number in every brief. Read the counts
rather than the exit code.
