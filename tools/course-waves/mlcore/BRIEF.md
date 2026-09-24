# D2 Machine Learning on Well Data: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the second course of the academy's `data_ai` module (path order 67), after D1
Oilfield Data Quality.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Four
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-ml.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (the NIST certified values, the digits reached, the Longley brackets) the digest recomputes it through the engine; quote the digest line. |
| `oracle_ml.py` and `pin_ml.py` | PROVENANCE. The standard library oracle that wrote the golden and the library pins beside it. |
| `d2_fields.mjs` | the generator of the Ekene teaching wells. Its values reach you through the digest, which prints what a lesson may quote. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

A model is a rule fitted to some wells and judged on wells it has never seen,
so the course teaches how to split by whole wells, scale on the training rows,
fit least squares and read what it returns (Associate), how to penalise,
cross-validate by wells, catch leakage and score a classifier (Professional),
and when the engine refuses, stops or extrapolates, and how to write a
prediction back honestly (Expert), and grades each tier on its own question
with numbers the engine returns.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | A MODEL AND ITS TEST | what a model is, data the model has not seen, scaling on the training rows, ordinary least squares, fit metrics and residuals, one well held out end to end | 1 to 10 |
| Professional | VALIDATING A MODEL | ridge and the bias-variance trade, cross-validation by wells, leakage, logistic regression, the confusion matrix and its ratios, ROC, AUC and log loss | 11 to 16 |
| Expert | WHEN THE ENGINE REFUSES, STOPS OR EXTRAPOLATES | conditioning and the NIST reference problems, separation, convergence and its stated rule, importance and learning curves, missing-log prediction end to end, reading the engine honestly | 17 to 25 |

Section 26 is the vocabulary, and every tier owns it. Every section heading
names its owner modules; section 3 (the refusals) is owned across all three
tiers, and section 24 (the boundary table) by Expert m06 and Professional m04
l04.

## THE DATASET

One generator, `d2_fields.mjs`, draws the Ekene field's teaching wells through
the canonical mulberry32 of lib/stats on one stated seed. Ten wells, EKENE-1
to EKENE-10, 30 samples each, 300 rows: GR, RHOB, NPHI, RT, CALI and DT, a
core calibrated porosity PHIC, a PAY label from a stated rule, and four
well-level attributes constant down each well (easting, northing, kb, mud
weight). EKENE-6 has no sonic, so 270 rows in 9 wells carry a DT. Digest
section 2 tables all 7 planted structures with the method that finds each, and
the build fails if any is not found: a well-level sonic offset, attributes that
name a well, a logs-only split that flatters nothing, the no-sonic well, its
hot shale, the stated pay rule, and a caliper that carries no sonic signal.

**The teaching split** is `groupSplit` with test fraction 0.3 and seed 5 on the
nine sonic wells: test wells EKENE-4, EKENE-5, EKENE-8, 90 rows; 180 training
rows. The pay model uses the same fraction and seed over all ten wells: test
wells EKENE-3, EKENE-5, EKENE-7.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Scaling is fitted on the training rows only**, with the POPULATION
   standard deviation (section 6). On 180 rows the sample SD is larger by the
   factor 1.002789. D1's z-score uses the sample SD; say which, every time.
2. **Names sort by character before the shuffle**: EKENE-10 before EKENE-2.
   The test size is ceil(fraction x count) with a 1e-9 whole-number rule:
   0.28 x 25 is 7.000000000000001 in float and holds out 7 (section 5).
3. **A test R-squared is taken about the mean of the TEST targets** unless
   `referenceMean` is given: 0.815322 against 0.816151 about the training
   mean on the teaching split (section 8).
4. **Ridge leaves the intercept unpenalised** and its lambda is on the sum of
   squares, scikit-learn's alpha (section 11).
5. **k-fold deals shuffled wells round robin**: it balances wells, where
   scikit-learn's GroupKFold balances rows (section 12).
6. **Least squares is refused above a scaled condition number of 1e8**, strictly
   above; Longley at 43275.043587 is refused at 43000 and fitted at 44000
   (section 17).
7. **Logistic tests for separation before any Newton step** and stops when the
   largest FULL step is at most tol, in coefficient units (sections 19 and 20).
8. **A probability of exactly 0.5 is class 0** (section 14).

## THE REFUSALS

Digest section 3 tables 31 refusals across 18 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A logistic fit that stops before it converges is a
result with a `warning`, never a refusal (section 20).

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `d2_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstone fields, their wells, their datasets and their answers are NOT in
the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them and these briefs. The tolerance of
every field is made in exactly one place, `gradedTolerance.js` in the NextGen
repository. **Never type a tolerance.** Where a capstone value depends on a
seed, the capstone brief states the seed; the lessons teach that a seeded
number is quoted with its seed.

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 26 carries the rule for each.

1. **"test"** means rows the model was not fitted on: a whole well held out
   unless the text names a random-row split.
2. **"standard deviation"** names its divisor.
3. **"R-squared"** names its rows and its reference mean.
4. **"separation"** is the logistic property; a split is a split.
5. **"importance"** is for this fitted model, these rows, this seed.
6. **"machine learning"** names a fitted statistical model by its method. No
   lesson calls a model artificial intelligence, and no P label is used.

## SCOPE SEAMS

Regression fit quality of a decline or a well test belongs to the decline and
well test courses; Monte Carlo and uncertainty to the uncertainty course;
outlier statistics to D1; clustering and facies to D3; forecasting a rate
series to D4. `wave.json` records each seam.

## THIS COURSE TEACHES NO REPAIR HISTORY

The engine's lead-review changes landed before its merge and before any lesson
was written. They are provenance. A sentence about former engine behaviour
anywhere in this course is a defect.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. Never write a contrastive of your own.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
