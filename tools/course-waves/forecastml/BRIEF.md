# D4 Data-Driven Production Forecasting: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the fourth course of the academy's `data_ai` module (path order 69), after D1
Oilfield Data Quality, D2 Machine Learning on Well Data and D3 Electrofacies.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Four
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-forecast.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (the NIST/SEMATECH e-Handbook's printed smoothing figures) the digest recomputes it through the engine; quote the digest line. |
| `oracle_forecast.py` and `pin_forecast.py` | PROVENANCE. The standard library oracle that wrote the golden and the library pins beside it. |
| `d4_fields.mjs` | the generator of the Ekene production wells. Its values reach you through the digest, which prints what a lesson may quote. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

A data-driven forecast extends a rate series from its own history, and it is
worth something only when it is tested on months it never saw, so the course
teaches how simple, Holt and damped exponential smoothing turn a well's monthly
rates into a forecast and how their parameters are fitted (Associate), how to
score a forecast honestly with errors, percentage errors, the scaled error and
rolling-origin backtests (Professional), and how to put intervals around a
forecast with a seeded residual bootstrap, test it against the Arps decline
baseline and read every rule the engine applies (Expert), and grades each tier
on its own question with numbers the engine returns.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | SMOOTHING A RATE SERIES INTO A FORECAST | what a data-driven forecast is, simple exponential smoothing, Holt's linear trend, the damped trend, fitting the parameters, one well forecast end to end | 1 to 10 |
| Professional | TESTING A FORECAST HONESTLY | forecast errors, percentage errors, the scaled error, rolling-origin backtests, pooling backtest errors, methods compared end to end | 11 to 17 |
| Expert | UNCERTAINTY, THE ARPS BASELINE AND THE ENGINE'S RULES | the residual bootstrap, percentiles and their labels, the Arps baseline, ranking methods against Arps, boundaries bounds and caps, reading the engine honestly | 18 to 24 |

Section 25 is the vocabulary, and every tier owns it. Every section heading
names its owner modules; section 3 (the refusals) is owned across all three
tiers. Section 17 (methods compared) is also owned by Expert m04 l01, because
the comparison's origins are the Expert tier's ranking lesson.

## THE DATASET

One generator, `d4_fields.mjs`, draws the Ekene field's production through the
canonical mulberry32 and randomNormal of lib/stats on one stated seed,
20260925, and shapes each decline with engines/dca/arps.js. Six producing
wells, EKENE-P1 to EKENE-P6: five carry 48 months of monthly average oil rate
in bbl/d, and EKENE-P6, a new well, 3. Digest section 2 tables
all 7 planted structures with the engine behaviour that finds each, and the build fails if
any is not found: a clean hyperbolic decline (EKENE-P1), a shut-in of three
months at rate 0 and a workover uplift after it (EKENE-P2), a facility-limited
plateau of exactly 1500.000000 for the first 9 months (EKENE-P3), a noisy
allocation (EKENE-P4), a steep decline to a low tail (EKENE-P5) and the new
well.

**The teaching well** is EKENE-P1. **The teaching hold-out** fits months 0 to
35 and scores months 36 to 47. **The teaching backtest** is holt from first
origin 24, horizon 6, step 6: origins 24, 30, 36, 42. **The teaching bootstrap**
is damped on EKENE-P1, h 12, seed 11, 1000 paths.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **The start is the first observation** (section 5 and 6): l_1 = y_1, and for
   holt and damped b_1 = y_2 - y_1, so the second month is forecast exactly and
   is NOT scored. `scoredFrom` is 1 for ses and 2 for holt and damped; MSE
   divides by the scored errors only. Compare methods by MSE.
2. **The fit is a grid then a compass search** (section 8) in the box alpha and
   beta from 0 to 1 and a fitted phi from 0.8 to 0.98. A parameter given is
   held fixed; a given phi may be any value above 0 and at most 1. `atBounds`
   lists a fitted parameter on an edge: ses fits alpha 1, the naive forecast,
   on every long well but EKENE-P4, which fits 0.528376.
3. **An error is actual minus forecast** (section 11): ME below 0 means the
   forecast was high. On the teaching hold-out ses has ME -51.683333.
4. **MAPE is null when any actual is 0** (section 12), with the reason in
   `notes`; sMAPE is on 0 to 200 and a term with actual and forecast both 0
   scores 0. **MASE divides by the in-sample lag-m naive MAE of the training
   months** (section 13), m 1 by default; it is null when that scale is 0.
5. **A backtest's window expands from month 0** (section 14); refit true
   re-estimates at every origin, refit false holds the first window's
   parameters. Pooled MASE scales each error by its own origin's scale, and one
   null origin scale leaves the pooled MASE null (section 16).
6. **The bootstrap replays the residuals as fitted** (section 18), one
   mulberry32 stream on a stated seed, and the simulated value updates the
   state. The residuals are drawn WITHOUT CENTRING (their mean is not
   subtracted), and the engine's basis says so in words: a method whose
   residuals have a non-zero mean drifts, so on a declining well a flat
   method's paths can fall below its own point forecast. Quote the basis
   wording from section 18. ses on EKENE-P1 at step 12 forecasts 211.400000
   while the P10 (high) of its paths is 69.250000.
7. **P90 is the low case** (section 19): the 10th percentile of the paths, by
   the platform's exceedance convention; P10 is the high case. With
   `nonNegative` true a negative percentile is reported as 0 and counted.
8. **The Arps baseline is engines/dca/arps.js, imported** (section 20). A month
   is passed as a day, so Di is per month; zero months are dropped before the
   fit.
9. **A ranking is lowest first by the chosen metric, MASE by default**
   (section 21); values within 1e-12 relative keep the listed order, arps last;
   a null metric is unranked.

## THE REFUSALS

Digest section 3 tables 59 refusals across 6 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A metric returned as null with its reason in `notes`
(MAPE through a shut-in month, MASE on a flat training window) is a result,
never a refusal; section 3 tables every such reason the course meets. No fit in
this course reaches the search's evaluation cap, so no result here carries a
warning.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `d4_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstone fields, their wells, their datasets and their answers are NOT in
the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them and these briefs. The tolerance of
every field is made in exactly one place, `gradedTolerance.js` in the NextGen
repository. **Never type a tolerance.** Where a capstone value depends on a
seed, the capstone brief states the seed and the number of paths; the lessons
teach that a bootstrap figure is quoted with its seed and nSims.

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 25 carries the rule for each.

1. **"forecast"** is the point forecast of one fitted method, named with its
   method; a one-step forecast is a fitted value; a percentile is named as a
   percentile.
2. **"error"** is actual minus forecast; a residual is an in-sample one-step
   error.
3. **"P90"** is the low case, the 10th percentile of the paths; P10 the high
   case. Never "the 90th percentile".
4. **"accuracy"** names its metric and its months.
5. **"trend"** is the smoothed trend state b, in bbl/d per month.
6. **"machine learning"** names the method: exponential smoothing, a residual
   bootstrap, a least-squares Arps fit. No lesson calls a method artificial
   intelligence.

## SCOPE SEAMS

Arps decline curves themselves (the equations, EUR) belong to the decline curve
analysis course, named with a pointer; regression and splits by whole wells to
the machine learning course (D2); gaps, outliers and conditioning to the data
quality course (D1); Monte Carlo in general to the uncertainty course;
clustering to D3. `wave.json` records each seam.

## THIS COURSE TEACHES NO REPAIR HISTORY

The engine's review changes landed before its merge and before any lesson was
written. They are provenance. A sentence about former engine behaviour anywhere
in this course is a defect.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. Never write a contrastive of your own.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
