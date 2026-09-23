# D1 Oilfield Data Quality: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the first course of the academy's `data_ai` module (path order 66).

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Four
other things in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-quality.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure (the NIST worked examples and their errata) the digest recomputes it through the engine; quote the digest line. |
| `oracle_quality.py` and `pin_quality.py` | PROVENANCE. The standard library oracle that wrote the golden and the library pins beside it. |
| `d1_fields.mjs` | the generator of the Ekene teaching dataset. Its values reach you through the digest, which prints what a lesson may quote. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

Data quality is a set of stated rules applied to a well log or a production
series, every flag carrying the rule that fired and its reason, so the course
teaches whether the data are there, valid, indexed, consistent and uniquely
named (Associate), which values stand apart from the rest and by which measure
(Professional), and whether the process that makes the data has changed,
scored and written up as a policy (Expert), and grades each tier on its own
question with numbers the engine returns.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it
self-checks. The engine exports five dimension names in `DIMENSIONS`; the
tiers are drawn along them.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | IS THE DATA FIT TO USE | what data quality means, is it there, is it valid, the depth and time index, does it agree with itself, names and one dataset end to end | 1 to 16 |
| Professional | WHICH VALUES STAND APART | the z-score and its ceiling, the median and the MAD, quartiles and Tukey fences, a moving window, formal tests and many variables, outliers in a report | 17 to 24 |
| Expert | HAS THE PROCESS CHANGED, AND WHAT IS THE POLICY | the individuals chart, the EWMA chart, the tabular CUSUM, the scorecard, designing a QC policy, reading the engine honestly | 25 to 31 |

Section 32 is the vocabulary, and every tier owns it. Every section heading
names its owner modules; section 4 (the refusals) is owned across all three
tiers, section 13 (the phase-sum tolerance) by Associate m05 and Expert m05,
and section 31 (errata) by Expert m06 and Professional m06 l01.

## THE DATASET

One generator, `d1_fields.mjs`, draws the Ekene field's teaching data through
the canonical mulberry32 of lib/stats on stated seeds and plants documented
defects. Digest section 2 tables all 22 planted defects with the check that
finds each, and the build fails if any defect is not found. The streams:
EKENE-7's 240-sample log, the EKENE-7 splice index, EKENE-3's 90 days of
production, 13 well names, 14 core plugs, 10 gauge readings, and 90 days of
wellhead pressure in two phases.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Missing is null, undefined or NaN.** Infinity is refused. A sentinel is a
   present value: EKENE-7's gamma ray with -999.25 in place reads a completeness
   of 1.000000 and 4 range failures (section 3).
2. **Limits are definitional only**, keyed by unit, and a unit the engine does
   not list is refused and never converted. Plausibility ranges are the
   caller's (sections 7 and 8).
3. **Strictly beyond.** Every flag fires strictly beyond its limit: a value on a
   Tukey fence, on a Hampel threshold or equal to maxStep in coverage is inside
   (sections 6, 20 and 21).
4. **The last present value.** A cumulative is compared with the last present
   value before it: EKENE-3's day 70 falls 7496.700000 bbl against day 68
   (section 11).
5. **The Petrolord defaults are choices** (section 30): the phase-sum tolerance
   0.005 of the TOTAL, frozen runs of 5 against the run's first value, the
   Mahalanobis alpha 0.025, R7 quartiles for the fences.
6. **The sample standard deviation** for z and Grubbs, with the ceiling
   (n - 1) / sqrt(n) reported: at ten readings it is 2.846050 and no z can pass
   3 (section 17). The modified z uses 0.6745 as printed (section 18).
7. **Target and sigma come from history** for EWMA, **k and h carry a stated
   unit** for CUSUM, and **no reset after a signal** (sections 26 and 27).
8. **No grade bands** on the scorecard (section 29).

## THE REFUSALS

Digest section 4 tables 23 refusals across 20 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A refusal carries no number.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `d1_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstone fields, their wells, their series and their answers are NOT in
the digest and must never enter a lesson, a bank or a panel;
`gate_capstone_leak.mjs` sweeps all of them and these briefs. The tolerance of
every field is made in exactly one place, `gradedTolerance.js` in the NextGen
repository. **Never type a tolerance.**

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 32 carries the rule for each.

1. **"outlier"** is a value a stated rule flags. Say which rule.
2. **"sigma"** always names its source: sample SD, MRbar / 1.128, 1.4826 x
   MAD, or historical in-control data.
3. **"control limit"** is never a specification or a plausibility range.
4. **"missing"** is null, undefined or NaN; a sentinel is present.
5. **No P label** anywhere. A quantile is named by its probability and its rule.

No lesson calls any method in this course artificial intelligence or machine
learning. Every one is a stated statistical rule.

## SCOPE SEAMS

The u-chart and the Poisson count model belong to the safety statistics
course; regression fit quality to the decline and machine learning courses;
Monte Carlo to the uncertainty course. The charts here are for measured values.

## THIS ENGINE HAS NO REPAIR HISTORY

It was written, oracle-gated and merged in one pull request. The NIST errata in
section 31 are about a published page. A sentence about
former engine behaviour anywhere in this course is a defect.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. Never write a contrastive of your own.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
