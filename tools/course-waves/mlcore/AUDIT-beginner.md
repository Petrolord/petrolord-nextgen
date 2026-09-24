# D2 mlcore, Associate (beginner) key-truth audit

Auditor: D2 Associate key-truth auditor, 2026-09-24. Branch feat/d2-mlcore-course, worktree /root/wt-dai-d2-nextgen, head at audit start 3b92ac0ab.
Scope: the 7 banks d2b_m01..m06 + d2b_exam (132 questions), read in full against digest.txt (sections 1 to 10, 24 to 26) and the Associate lessons where a question leans on lesson prose.
Engine: the vendored packages/engines/engines/dataai/ml.js, called through node on the d2_fields.mjs Ekene rows. Scripts and their output are in
/root/dai-wip-mlcore/audit-b/ (base.mjs + t2..t7.mjs, each with a .out): t2 splits, seeds, sort order and every refusal a question quotes; t3 scalers,
the teaching OLS, metrics, the referenceMean sweep, the scale-on-all-rows fit; t4 the 270-row fit and the one-well workflow at seeds 1 to 6; t5/t6 RMSE
against MAE at equal miss sizes; t7 leakageDemo on the logs alone. "sN" means digest SECTION N (this file only, never learner text).

## Summary

- Wrong keys: 1 (exam Q29, true in exact arithmetic, false as the engine returns it). Fixed.
- A distractor that can be read as true: 1 (m06 Q9). Fixed.
- A false engine claim in an explanation: 1 (m02 Q6). Fixed.
- Clarity: 1 (m02 Q7 prompt said "the same rows" while the explanation says the splits hold out different rows). Fixed.
- The writer's three arithmetic-only keys: exam Q29 fixed (above); exam Q30 and m06 Q6 confirmed true by the engine and kept.
- Forward reach: none. No Associate item needs a penalty, a fold, a classifier or a condition number (engine calls used: groupSplit, randomRowSplit,
  fitStandardScaler, fitMinMaxScaler, applyScaler, ols, predict, regressionMetrics only; m02 Q4 quotes the basis string naming groupKFold and m02 Q7
  rests on the sign of a random-row score, neither needs a fold or a Professional figure).

## Wrong keys

### 1. exam Q29 (class 9, printed alike keyed as a law; the writer's flag)

Before, key: "RMSE is at least as large as MAE, and equal only when every miss has the same size." Prompt: "which relation ... always holds?"
Explanation: "Every table in the course shows it".

Engine (t6): regressionMetrics on 472 cases whose misses are EXACTLY one size as doubles (yTrue 0/1, yPred +-d, d in 0.1, 0.3, 0.7, 1.1, 2.3, 3.3,
0.01, 7.77, n 2..60) returns rmse < mae in 103 of them (e.g. d 0.1, n 11: rmse 0.10000000000000003, mae 0.10000000000000005). t5 (near-equal misses
from float subtraction): 199 of 590 below, worst gap 1.35e-15 relative. Unequal misses (1.5,2,3,5 vs 1,2,3,4): rmse 0.559017 > mae 0.375 as expected.
So the relation holds in exact arithmetic and up to rounding in what the engine returns; "at least as large ... always" is false in the last digit.

After, key: "Up to rounding, RMSE is at least as large as MAE, and the two meet only when every miss has one size." Explanation now says the engine works
in floating point and at one miss size the two can differ in the last digit either way; "Every table in the course shows it" (a superlative over tables
nobody enumerated) is now "On real rows the gap is plain". Distractors lengthened (still false) to keep length balance: key now rank 3 of 4.
Every printed pair still has RMSE above MAE (t3/t4: training 5.758010/4.810983, test 4.282693/3.526103, the three test wells, the five one-well rows,
the worse-than-mean case 1.632993/1.333333).

## Other defects fixed

- m06 Q9 (class 1, a distractor that could be true). Distractor "So the reader can check the scoring without having to trust that the seed was ever run
  at all" is a real benefit of naming the wells. Replaced with "So the test fraction is on record, since a seed and a split name leave the fraction out
  of a write-up" (false: the prompt's write-up already states fraction 0.3), and the explanation now says so. Key unchanged ("The seed alone tells a
  reader nothing about which wells were held out until the call is run again", the lesson m06 l03 sentence). Openings: because / so / the(key) /
  because, no tell.
- m02 Q6 explanation (class 2 style: an engine claim the engine contradicts). "RMSE is defined on any rows" is false for this engine:
  regressionMetrics({yTrue:[5], yPred:[4]}) is refused on `yTrue` ("yTrue has zero variance (every value is equal), so R-squared about its mean is
  undefined"), and so is any test set whose targets are all equal, RMSE and MAE included. Now "RMSE has no 30-row minimum", which is what the distractor
  (a 30-row rule) needed.
- m02 Q7 prompt (clarity). "compare with a whole-well test score on the same rows?" while the explanation says the two splits hold out different rows
  (81 against 90). Now "both split from the same 270 sonic rows?". Key ("either side as the draw falls") confirmed by t7: leakageDemo, OLS on the logs,
  fraction 0.3, seeds 1..12, optimism -0.048 0.761 1.082 -1.004 -1.748 -0.811 -1.511 -1.839 1.220 -1.091 0.561 1.256 (7 negative, 5 positive).

## The writer's three arithmetic-only keys

| item | verdict | engine evidence |
| --- | --- | --- |
| exam Q29, RMSE >= MAE on the same rows | FIXED, see wrong keys | t6: 103 of 472 exact equal-size cases return rmse < mae by one ulp |
| exam Q30, R-squared about any other mean is higher | TRUE, kept | t3 sweep with referenceMean on the 90 test rows: own mean 105.214444 gives 0.815322480971; own mean +-1e-6 gives a strictly larger value (the float compare is true); 100 gives 0.855015770313, 110 gives 0.849927952253, 105.883333 gives 0.816150708623, 0 gives 0.998357882877. SSE fixed at 1650.730996, so R-squared rises with the denominator, which is least about the own mean. |
| m06 Q6, EKENE-3 smaller RMSE but lower own-mean R-squared | TRUE, kept | t4: EKENE-3 (seed 4) SSE 381.246215, SST 1445.194667, variance about its own mean 48.173156; EKENE-8 (seed 1) SSE 425.321167, SST 2540.147000, variance 84.671567. EKENE-3's DT spread is smaller, so its similar misses are a larger share. About the training mean the order holds too (0.739681 against 0.869208), so distractor A ("different references") stays false. |

## Every keyed figure the engine was asked for (all match the digest)

- Splits (t2): randomRowSplit 81 test / 189 train, sharedGroups 9, purpose string verbatim; groupSplit 0.3 seed 5 EKENE-4, 5, 8 / 90 / 180, order
  EKENE-8, 4, 5, 2, 1, 3, 10, 9, 7, rule string verbatim; seeds 1..6 match the s4 table; nTestGroups 1 at seeds 1..6: EKENE-8, 5, 2, 3, 8, 7 (seed 5
  repeats seed 1's well, m06 Q8); nTestGroups 2 seed 5: EKENE-4 and EKENE-8 (exam Q14); numeric names: basis "numbers ascending" (exam Q13); 0.28 x 25
  holds out 7 in both splits (m02 Q12).
- Refusals (t2), field and message verbatim for every one a question quotes: X[150][1], X.mudWeight, sd ('unbiased' gives the tabled message), X.CALI
  min-max, applyScaler X, groups (one well), testFraction 0.95, nTestGroups (both given), groups[1] (mixed), seed (-1), X (3 rows for 4), X (4 rows for 4,
  n = p), X.CALI zero column, y constant, y[20], X[20][1], yTrue constant, model. Also: 5 rows for 4 coefficients is fitted, dfResidual 1 (exam Q26); 3
  rows for 3 coefficients with intercept false is refused on X (m01 Q13 explanation); a feature with one differing training row is fitted, scale 0.4
  (exam Q20).
- Scalers (t3): training centres 59.844500, 2.391150, 0.255072; population scales 22.375203, 0.142322, 0.033503; sample 22.437616, 0.142719, 0.033597,
  ratio 1.002789; all-rows 60.250741 ... 0.033238; first test row z -0.520420, -0.303186, -0.360332, basis verbatim; test rows under the training scaler
  come out with means 0.054468, 0.138458, -0.137798 and population SDs 0.856064, 0.869723, 0.969610 (m03 Q7: no feature, GR included, lands at 0 and 1);
  min-max on EKENE-6: GR 0.320959 to 1.219324 with 4 rows above 1, RHOB and NPHI inside, none below 0.
- Teaching OLS (t3): coefficients, standard errors, t values, s 5.823075 = sqrt(RSS/176), RMSE 5.758010 = sqrt(RSS/180), RSS, TSS, R-squared,
  adjusted, df 176 all as s7; NPHI alone 11.127468, R-squared 0.001327; the training fit about the test mean reads 0.684804 (m04 Q9 distractor stays false).
- Metrics (t3): training 5.758010 / 4.810983 / 0.683457 / 105.883333; test 4.282693 / 3.526103 / 0.815322 / 105.214444; about the training mean
  0.816151 with RMSE unchanged; per-well EKENE-4, 5, 8 as s8; plain mean of the three well RMSEs 4.249888 (m05 Q8 distractor stays false);
  worse-than-mean 1.632993 / 1.333333 / -3.000000.
- Scaling leak for least squares (t3, m03 Q12 prompt "moves only by rounding"): scaler fitted on all 270 rows, then OLS: test RMSE identical to the
  training-scaler fit (difference 0), predictions within 2.84e-14 of the raw fit.
- 270-row fit (t4): R-squared 0.728027, s 5.333216, 270 residuals summing to -1.99e-12, well means as s9, span 12.562737.
- One-well workflow (t4): seed 1/5 EKENE-8, 240 training rows, coefficients 8.829369, 0.320501, 17.445328, 139.804854, R-squared 0.709438, test
  3.765285 / 2.958753 / 0.832560, training 5.462405; standardised coefficients 105.119167, 6.898926, 2.402069, 4.610720 with GR's population scale over
  the 240 rows 21.525450 = 6.898926 / 0.320501; predictions within 1.42e-14; seeds 2, 3, 4, 6 as the s10 table (EKENE-2 largest RMSE and lowest R-squared,
  exam Q36).

## Lesson defects and digest gaps (recorded only, not edited)

- G1 (lesson gap, exam Q29). No Associate lesson states that RMSE is at least MAE; m05 l01 says only that RMSE weighs a large miss more and that the two
  "sit close together" when misses are similar. The fixed key is derivable from the two formulas the lesson prints; the fix pass may add one sentence
  ("up to rounding, RMSE is never below MAE").
- G2 (lesson gap, exam Q30). m05 l02 says the two R-squared values differ "because the denominators differ" but never says why the training-mean one is
  higher (the squared spread is least about the rows' own mean). The key is true (engine sweep above); the lesson could carry the reason.
- G3 (digest gap, m06 Q6 and m05 Q15). The digest prints per-well RMSE and own-mean R-squared but not the spread of each well's DT; "EKENE-3 varies less"
  rests on arithmetic of printed figures (3.564857^2 / (1 - 0.736197) = 48.17 against 84.67 for EKENE-8). A digest line printing the per-well SST or
  variance would put it on a printed figure.
- G4 (engine note for the fix pass, not a defect in the banks now). regressionMetrics refuses the whole call when yTrue has zero variance, so a one-row
  test set, or a held-out well whose targets are all equal, gets no RMSE or MAE either, although both are defined. The message says only that
  R-squared is undefined. Either the digest states that the refusal withholds RMSE and MAE too, or the engine returns RMSE/MAE with r2 null; the lead's
  call. m05 Q7's explanation ("returns no score at all") is correct as the engine stands.
- G5 (lesson, m05 l01). "When a few rows are badly predicted, RMSE rises more than MAE does" is true in the usual case and is what m05 Q2 keys; it is a
  general statement with no printed pair behind it. The lesson's own exercise (change one prediction, watch both move) supplies the evidence, so it is
  recorded for a read only.

No lesson or digest file was edited.

## Checked and kept (the likelier traps)

- m01 Q3: logistic's non-converged result carries a `warning` (s20), but it is still a result with a basis, so the key's two shapes cover it; the
  distractor ("a list inside basis that fills up whenever an input looked doubtful") stays false.
- m03 Q3 "larger by 1.002789 for every feature": the ratio is sqrt(180/179) for any feature on 180 rows; engine GR 1.002789.
- m03 Q15 / exam Q38 units: us/ft per population SD over the 240 training rows (engine scale 21.525450 reproduces the ratio).
- m04 Q9: 0.815322 as "the training fit about the test mean" is false (engine 0.684804).
- m05 Q2: RMSE rises more than MAE for a few badly predicted rows (see G5).
- m06 Q14 explanation "the predictions are the same either way up to rounding": true for any affine rescaling (t3/t4).
- exam Q36: EKENE-7's R-squared 0.502611 is above EKENE-2's 0.482707, so "the lowest R-squared" on the EKENE-7 option stays false.

## Every question

key = 0-based answer index after the fixes. Evidence names the engine call (t2..t7) or the digest line.

| bank | Q | key | verdict | evidence |
| --- | --- | --- | --- | --- |
| m01 | 1 | 2 | true | s7 coefficients; predict takes model and X (t3) |
| m01 | 2 | 0 | true | s7 target DT, features GR/RHOB/NPHI |
| m01 | 3 | 3 | true | s1 reply shapes; see checked-and-kept |
| m01 | 4 | 1 | true | s1 no fill; t2 X[20][1] refusal |
| m01 | 5 | 1 | true | s1/s25 linear models only |
| m01 | 6 | 3 | true | s2 no-sonic well, 270 rows |
| m01 | 7 | 0 | true | s2 pay rule |
| m01 | 8 | 2 | true | s2 attributes; t2 mudWeight refusal on one well |
| m01 | 9 | 3 | true | s2 CALI planted row; t2 zero-column refusal is the only CALI one |
| m01 | 10 | 0 | true | t3 predict({model, X}) returns values |
| m01 | 11 | 2 | true | t2 X[150][1] |
| m01 | 12 | 1 | true | t2 y[20] verbatim |
| m01 | 13 | 0 | true | t2 X (3 rows for 4); no intercept 3 for 3 also refused |
| m01 | 14 | 3 | true | t2 message verbatim |
| m01 | 15 | 2 | true | s26 machine learning |
| m02 | 1 | 1 | true | t2 sharedGroups 9 |
| m02 | 2 | 3 | true | t2 seed 5 test wells; seed 1 draw |
| m02 | 3 | 0 | true | t2 81 / 90 |
| m02 | 4 | 2 | true | t2 purpose string |
| m02 | 5 | 2 | true | s26 test |
| m02 | 6 | 0 | true; explanation fixed | s9 offsets; t2/regressionMetrics one-row refusal |
| m02 | 7 | 3 | true; prompt clarified | t7 optimism both signs |
| m02 | 8 | 1 | true | t2 seeds 2 and 5 |
| m02 | 9 | 0 | true | s5 sort; s2 tops |
| m02 | 10 | 3 | true | s5 i = 2 row |
| m02 | 11 | 1 | true | t2 rule string |
| m02 | 12 | 2 | true | t2 0.28 x 25 holds out 7 |
| m02 | 13 | 3 | true | t2 nTestGroups refusal |
| m02 | 14 | 0 | true | t2 testFraction refusal |
| m02 | 15 | 1 | true | t2 seed refusal |
| m03 | 1 | 3 | true | s6; t3 applyScaler basis |
| m03 | 2 | 1 | true | t3 centres |
| m03 | 3 | 0 | true | t3 scales, ratio 1.002789 |
| m03 | 4 | 2 | true | s6 basis |
| m03 | 5 | 0 | true | t2 sd 'unbiased' refused |
| m03 | 6 | 3 | true | t3 z row |
| m03 | 7 | 1 | true | t3 test z means and SDs |
| m03 | 8 | 2 | true | t2 mudWeight |
| m03 | 9 | 3 | true | t3 min-max EKENE-6 |
| m03 | 10 | 0 | true | t3 4 rows above 1 |
| m03 | 11 | 2 | true | t4 1.42e-14 |
| m03 | 12 | 1 | true | t3 all-rows scaler: RMSE difference 0 |
| m03 | 13 | 3 | true | t2 applyScaler X |
| m03 | 14 | 0 | true | t2 X.CALI min-max |
| m03 | 15 | 2 | true | t4 standardised GR 6.898926 |
| m04 | 1 | 0 | true | t3 RSS |
| m04 | 2 | 2 | true | s7 reading |
| m04 | 3 | 1 | true | s7 1.387836 |
| m04 | 4 | 3 | true | t3 NPHI alone |
| m04 | 5 | 3 | true | t3 intercept, SE; training mean 105.883333 |
| m04 | 6 | 1 | true | s7 |
| m04 | 7 | 0 | true | t3 df 176 |
| m04 | 8 | 2 | true | t3 sqrt(RSS/176), sqrt(RSS/180) |
| m04 | 9 | 0 | true | t3 R-squared; training about test mean 0.684804 |
| m04 | 10 | 3 | true | t3 adjusted 0.678062 |
| m04 | 11 | 2 | true | s7 SE assumption; s9 blocks |
| m04 | 12 | 1 | true | t3 t values |
| m04 | 13 | 1 | true | t2 4 rows refused |
| m04 | 14 | 3 | true | t2 X.CALI zero column |
| m04 | 15 | 0 | true | s4 six wells |
| m05 | 1 | 2 | true | s8 formulas, basis |
| m05 | 2 | 0 | true | see G5 |
| m05 | 3 | 3 | true | t3 per-well RMSEs; unscaled fit |
| m05 | 4 | 1 | true | t3 same SSE, two references |
| m05 | 5 | 0 | true | t3 referenceMean 105.214444 |
| m05 | 6 | 2 | true | t3 worse-than-mean |
| m05 | 7 | 3 | true | t2 yTrue refusal |
| m05 | 8 | 1 | true | t3 pooled 4.282693, plain mean 4.249888 |
| m05 | 9 | 3 | true | t4 well means, sum -1.99e-12 |
| m05 | 10 | 0 | true | t4 span 12.562737 |
| m05 | 11 | 1 | true | s9 largest difference 0.637253 |
| m05 | 12 | 2 | true | t4 residual sum |
| m05 | 13 | 0 | true | t4 0.728027, 5.333216 |
| m05 | 14 | 3 | true | s8/s26 |
| m05 | 15 | 1 | true | t3 per-well variances (see G3) |
| m06 | 1 | 1 | true | s10 order of calls |
| m06 | 2 | 3 | true | t2 nTestGroups 1 seed 5 EKENE-8; t4 240 rows |
| m06 | 3 | 0 | true | t4 0.709438, 0.832560 |
| m06 | 4 | 2 | true | t4 5.462405 / 3.765285; EKENE-2 7.260092 |
| m06 | 5 | 0 | true | t4 five wells |
| m06 | 6 | 3 | true (writer's flag) | t4 variances 48.173156 / 84.671567 |
| m06 | 7 | 1 | true | t4 0.320501 on 240 rows; t3 0.288005 on 180 |
| m06 | 8 | 2 | true | t2 seed 5 and seed 1 both EKENE-8 |
| m06 | 9 | 2 | true; distractor fixed | lesson m06 l03 |
| m06 | 10 | 0 | true | lesson m06 l03 three sentences |
| m06 | 11 | 3 | true | lesson m06 l03 refusals in the record |
| m06 | 12 | 1 | true | s2 planted table |
| m06 | 13 | 3 | true | s2 seed 20260913 |
| m06 | 14 | 0 | true | t4 standardised predictions within 1.42e-14 |
| m06 | 15 | 1 | true | t3 predict needs no y; t2 y[20] |
| exam | 1 | 2 | true | t2 every message starts with its field |
| exam | 2 | 0 | true | s1 no intervals |
| exam | 3 | 3 | true | s1; four-feature OLS fits (s21 design) |
| exam | 4 | 1 | true | t2 y refusal |
| exam | 5 | 0 | true | t3 applyScaler |
| exam | 6 | 2 | true | s26 standard deviation |
| exam | 7 | 1 | true | s2 |
| exam | 8 | 3 | true | t2 189 |
| exam | 9 | 1 | true | s5 i = 8, j 6 |
| exam | 10 | 0 | true | t2 seeds 3 and 4 |
| exam | 11 | 2 | true | t2 groups[1] |
| exam | 12 | 3 | true | t2 groups (found 1) |
| exam | 13 | 0 | true | t2 basis numbers ascending |
| exam | 14 | 1 | true | t2 nTestGroups 2 |
| exam | 15 | 3 | true | t3 0.033503 |
| exam | 16 | 2 | true | t3 z |
| exam | 17 | 0 | true | t3 min-max |
| exam | 18 | 1 | true | s1 table |
| exam | 19 | 3 | true | s6 basis |
| exam | 20 | 2 | true | t2 one differing row fitted |
| exam | 21 | 1 | true | t3 trainIndices centre |
| exam | 22 | 0 | true | t3 TSS |
| exam | 23 | 3 | true | t3 sqrt(RSS/176) |
| exam | 24 | 2 | true | t3 NPHI alone; t 6.319645 |
| exam | 25 | 0 | true | t2 X[20][1] |
| exam | 26 | 3 | true | t2 5 rows fitted, 4 refused |
| exam | 27 | 1 | true | s7 units |
| exam | 28 | 2 | true | s7 intercept |
| exam | 29 | 3 | FIXED (wrong key) | t5/t6 |
| exam | 30 | 3 | true (writer's flag) | t3 referenceMean sweep |
| exam | 31 | 1 | true | t3 training metrics |
| exam | 32 | 2 | true | s9 residual sign |
| exam | 33 | 0 | true | t4 / s9 two fits |
| exam | 34 | 3 | true | t3 3.501687 vs t4 3.765285 |
| exam | 35 | 2 | true | t4 270 residuals |
| exam | 36 | 2 | true | t4 EKENE-2 |
| exam | 37 | 0 | true | t4 step five |
| exam | 38 | 3 | true | t4 standardised GR |
| exam | 39 | 1 | true | t3 min-max |
| exam | 40 | 2 | true | s26 |
| exam | 41 | 0 | true | t4 deterministic calls |
| exam | 42 | 3 | true | s2/s4 |

## Gates, after the fixes

| gate | command | result |
| --- | --- | --- |
| bankkit emit | python3 banks/d2b_*.py (literal emit paths) | 7 of 7: "all banks in this batch passed every gate" |
| lengthtails | lengthtails.py banks --prefix d2b | worst single strategy 33.3 pct (refuse above 40.0) |
| option openings | scratch copy of banks/_chk.py over d2b_*.py | 0 OPEN-TELL; ties only exam Q2, Q6, Q22 (pre-existing, accepted by bankkit) |
| dupaxes 0.45 | dupaxes.py banks --prefix d2b | 0 pairs within, exam-vs-module, module-vs-module |
| litsweep | litsweep.py <wave> --prefix d2b | 1043 resolved, 0 not in the digest, 0 forward reach; 15 human-read flags all legitimate (GR centre, EKENE-8, 1.42e-14, 180/240 rows, 0.320501) |
| kit numsweep | numsweep.mjs <wave> --banks banks | 561 checked, 0 unresolved |
| wave numsweep | numsweep_mlcore.mjs --banks banks | 0 unresolved |
| truth_check | truth_check.py | truth-mlcore.json is the harvest of digest.txt |
| capstone leak | gate_capstone_leak.mjs --banks banks | FINDINGS: 0 |
| vocabulary | gate_vocabulary.py | BREACHES: 0 |
| check-bank-sources | tools/course-banks/check-bank-sources.py mlcore | 21 banks, 396 questions byte for byte |
| copy rule | grep U+2013/U+2014 (raw and \u escaped), ", not", "digest", "section N", "rather than", "instead of" over d2b_*.py/json | 0 hits |

Committed as 52f9d96ec on feat/d2-mlcore-course (only the six changed d2b files under tools/course-banks/mlcore/beginner, by explicit path), pushed fast-forward. The other d2b files regenerate byte-identical to the committed copies. Engine scripts and outputs: /root/dai-wip-mlcore/audit-b/ (not committed; the wave dir is not a repository).
