# D2 mlcore, Professional (intermediate) key-truth audit

Auditor: the D2 Professional key-truth auditor, 2026-09-24. Fix commit c7c7dd26f (pushed). Worktree `/root/wt-dai-d2-nextgen`, branch
`feat/d2-mlcore-course`, audited from 3b92ac0ab. Only the seven `d2i_*` pairs under
`tools/course-banks/mlcore/intermediate/` and this record were touched.

Read in full: all 132 questions (m01 to m06, 15 each; exam, 42), prompt, options and explanation, against
`digest.txt` (S = digest section) and the 26 intermediate lessons. Every keyed figure, and every distractor that
could be true under a setting the question does not rule out, was re-derived by calling the VENDORED engine
`packages/engines/engines/dataai/ml.js` on the Ekene wells built by `d2_fields.mjs` exactly as `d2_dump.mjs`
builds them. Scratch harness and scripts: `/root/dai-wip-mlcore/audit-i/` (`h.mjs` data + engine; `m01.mjs` to
`m06.mjs`, `m02b.mjs`, `m03b.mjs`, `ex.mjs` the calls). Calls are quoted in the table as ENGINE.

## Summary

- Wrong keys: **0**. Every keyed figure reproduces through the engine at six decimals; every refusal and basis
  string quoted in a d2i bank matches the engine's `error` / `basis` text verbatim.
- Defects fixed: **3 questions**, all in explanations or the prompt; no key text changed.
  - overclaimed key, class 5 (a relationship nobody computed): 1, m02 Q14 ("What keeps the winning mean from
    flattering the choice?" keyed "Deciding the grid before looking at the scores"). A fixed grid still crowns the
    lowest of twelve means on one set of folds, and the engine shows the winner turns on the folds (logs lambda
    10 against lambda 0: 5.826789 < 5.888677 at k 3 seed 5, 6.267234 > 6.258353 at k 3 seed 2, 5.501614 >
    5.495600 under leave one well out). Prompt now asks what lets a reader JUDGE how far the winning mean may
    flatter the choice; explanation prints the margin from digest figures.
  - false universal in an explanation, class 3: 1, m02 Q2 ("a contiguous block of the sorted names, which the
    engine never deals"). ENGINE groupKFold k 3 over seeds 0 to 1999 deals {EKENE-3, EKENE-4, EKENE-5} as one fold
    at 65 seeds (first seed 129). Now scoped to this seed.
  - copy: 1, exam Q11 explanation "the shuffled order rather than blocks of sorted names" (a contrastive
    construction) rewritten.
- Exam against module near-duplicates at Jaccard 0.45: 0 pairs after the fixes (the m02 Q2 rewording first
  produced one pair at 0.47 against exam Q8; reworded again to 0).
- Answer-length tells: lengthtails worst single strategy 37.2 percent (m05, refuse above 40.0); bankkit rank shares
  in band on every bank. Opening tell (three distractors opening alike while the key does not): 0 at one, two and
  three word openings.
- Answers printed in the stem: none found. Capstone inputs or values: none (gate FINDINGS 0).
- Digest section numbers or "the digest" in learner-visible text: none.

## The writer's soft spots, settled by the engine

1. **m03 Q8** (a calibration or mud effect constant down one well can leak; one clean result cannot show there is
   none). TRUE. ENGINE leakageDemo, seeds 1 to 12, OLS, fraction 0.3, on the logs plus ONE well-constant column:
   + kb optimism positive on 11 of 12, + northing 7, + mudWeight 6, + easting 5 (logs alone 5). Planted per-well
   calibration shifts on all three logs (three mulberry32 draws): positive on 5, 5 and 9 of 12. One constant-per-
   well column can leak, and whether a given set of seeds shows it depends on the draw, which is both halves of
   the key.
2. **m04 Q15** ("so its standard error grows"). TRUE. ENGINE logistic on the 210 pay training rows: RHOB SE
   5.414154 beside NPHI against 4.830472 in (RHOB, RT); NPHI SE 15.424455 beside RHOB against 13.409607 in (NPHI,
   RT). Not printed in the digest: DIGEST GAP G1.
3. **m02 Q9** (leave one well out folds are the same whatever the seed). TRUE. ENGINE groupKFold k 9 at seeds 0,
   1, 5, 6, 7, 12 and 999: the same nine one-well folds every time, only the fold numbers move; the LOO means
   agree to 1e-15 at every seed (5.495600, 5.501614, 6.288507).
4. **m02 Q14** (fixing the grid before looking). OVERCLAIMED, fixed: see Summary.
5. **exam Q20 and m03 Q4** ("positive on 5 seeds" = 12 minus 7). TRUE. ENGINE leakageDemo logs, seeds 1 to 12:
   positive at seeds 2, 3, 9, 11, 12 (5), negative on 7, exactly zero on none. The digest prints "positive on the
   rest" and no count (DIGEST GAP G2, minor).

## Other engine checks worth recording

- m01 Q6 (same lambda on fewer rows is a stronger penalty): ENGINE ridge lambda 10, seven features, effective
  degrees of freedom 5.568235 on the 180 training rows against 3.980840 on the first 90 of them.
- m06 Q5 (squaring the probabilities leaves the AUC unchanged): ENGINE rocCurve on the squared test
  probabilities returns the identical AUC (===) and 91 points; the smallest squared value is 1.88e-7, so no
  underflow tie is created.
- m05 Q10 distractor ("zeroDivision never applies to a recall or an F1"): FALSE as it should be. ENGINE
  classificationReport with labels [0, 1, 2] and label 2 absent from both lists puts precision, recall AND f1 of
  label 2 in `undefinedRatios`.
- exam Q37 ("only a non-pay row above one half can outrank a pay row"): ENGINE smallest pay probability
  0.539840; exactly 4 non-pay rows score above it, the 4 false positives.
- m06 Q6 (a perfect ranking hugging one half): ENGINE synthetic pay 0.51 to 0.53, non-pay 0.47 to 0.49: AUC 1,
  log loss 0.654050, near ln 2.

## Lesson defects (listed, NOT edited)

- L1 `m03-leakage/l04-when-a-random-split-flatters-nothing.md`, the exercise: "add back only mudWeight and run
  the same four seeds [5, 8, 9, 12] ... say in one sentence what that one feature changed". ENGINE logs +
  mudWeight optimism: seed 5 -1.585794, 8 -0.200461, 9 0.970279, 12 1.325836; logs alone -1.747549, -1.838526,
  1.220206, 1.256217. mudWeight changes NO sign at those four seeds, so the exercise shows nothing, and a learner
  may conclude a well-constant feature is harmless. kb does what the exercise wants: logs + kb reads 0.254556,
  3.265879, 0.455196, 1.192458 (seeds 5 and 8 turn positive; positive on 11 of 12 seeds overall). Suggest kb,
  with the figures added to the digest first (G3).
- L2 `m04-logistic-regression/l03-reading-the-fitted-coefficients.md`: "a coefficient that holds one fixed while
  the other varies describes a direction the rows rarely take, and its standard error grows ... and the standard
  error shows what that costs". True by the engine (item 2 above) but no line of the digest prints the
  comparison, so the lesson characterises a relationship the course never computes. Fix with G1.
- L3 (minor) `m03-leakage/l02-features-that-name-a-well.md`: "Under a random-row split it always was [in
  training]". ENGINE sharedGroups lists all 9 wells on every seed 1 to 12, but "always" is a universal the engine
  does not guarantee (a well could in principle land wholly in test). Suggest "on every seed the course runs".

## Digest gaps for the lead

- G1: the pay model's standard errors without the correlated partner (RHOB 4.830472 in RHOB, RT; NPHI 13.409607
  in NPHI, RT) beside the full-model 5.414154 and 15.424455, so "its standard error grows" rests on printed
  figures (lesson L2, bank m04 Q15).
- G2: the count of positive logs-only optimisms, 5 of 12 (none zero), beside "negative on 7" (m03 Q4, exam Q20).
- G3: leakageDemo on the logs plus one well-constant attribute (kb: positive on 11 of 12; mudWeight 6 of 12), for
  the L1 exercise and for m03 Q8's "a column constant down one well can leak".

## Engine defects

None found. Every message and basis string the d2i banks quote matched the engine verbatim.

## Gates after the fixes

| gate | result |
| --- | --- |
| bankkit (re-emit of all 7 d2i sources) | all banks passed every gate |
| check-bank-sources.py mlcore (worktree) | 21 of 21 pairs reproduce, 396 questions byte for byte |
| lengthtails.py banks --prefix d2i | worst single strategy 37.2 percent (refuse above 40.0) |
| option openings (one, two, three words) | 0 banks with three distractors opening alike against the key |
| dupaxes.py banks --prefix d2i 0.45 | 0 pairs within, exam against module, module against module |
| kit numsweep.mjs --banks | 561 literals of 7+ significant figures checked, 0 unresolved |
| truth_check.py | truth-mlcore.json IS the harvest of digest.txt |
| gate_capstone_leak.mjs --banks banks | FINDINGS 0 |
| gate_vocabulary.py | BREACHES 0 (396 bank questions swept) |
| grep em/en dash and ", not" in d2i banks | 0 |

## Every question

### d2i_m01 (15 questions)

| Q | key (as shipped after this audit) | digest line / engine call | verdict |
| --- | --- | --- | --- |
| 1 | Only the feature coefficients b_j; the intercept b0 is left out of the penalty. | basis objective (m01.mjs) | OK: key true, distractors false |
| 2 | 105.883333 us/ft, the training mean of DT | ENGINE ridge std intercept 105.883333 every lambda | OK: key true, distractors false |
| 3 | 0.965695 | ENGINE edf lam 1000 0.965695 | OK: key true, distractors false |
| 4 | Lambda 100, reading 5.759287 us/ft. | ENGINE test RMSE path 16.999672/16.831728/15.485689/9.418023/5.759287/8.607538 | OK: key true, distractors false |
| 5 | It falls at every step, from 0.861914 to 0.265317. | ENGINE training R2 falls every step | OK: key true, distractors false |
| 6 | It acts as a stronger penalty: the residual sum grows with rows and the penalty term ... | ENGINE ridge lam 10 edf 5.568235 on 180 rows, 3.980840 on 90 rows (same lambda weighs more on fewer rows) | OK: key true, distractors false |
| 7 | 0.278671 us/ft per gAPI | ENGINE lam 10 GR orig 0.278671; std/orig ratio 22.375203 | OK: key true, distractors false |
| 8 | 22.375203 gAPI, the population SD of GR on the 180 training rows | ENGINE fitStandardScaler pop GR scale 22.375203 = std/orig ratio | OK: key true, distractors false |
| 9 | To a largest relative difference of 3.44e-16 in original units, which is rounding. | ENGINE ols vs ridge lam 0, max rel diff 3.436e-16 (intercept included) | OK: key true, distractors false |
| 10 | Northing, from 4.173548 to -0.274348. | ENGINE std coefs lam 0/100: only northing changes sign | OK: key true, distractors false |
| 11 | As sum d_i^2 / (d_i^2 + lambda) over the singular values of the standardised features. | basis edf string | OK: key true, distractors false |
| 12 | The engine refuses by name: "lambda must be a finite number, zero or more". | ENGINE ridge lambda -1 refusal verbatim, field lambda | OK: key true, distractors false |
| 13 | Its attribute coefficients chase the six training wells' offsets and then extrapolate... | S11 prose; ENGINE path | OK: key true, distractors false |
| 14 | All seven feature coefficients, each shrunk toward zero. | ENGINE lam 1000 prints 7 std coefs, every |b| below its lam 0 value | OK: key true, distractors false |
| 15 | It is a fact about three test wells drawn by one seed; another seed may favour anothe... | S11; ENGINE k3 seed 2: logs lam 0 6.258353 < lam 10 6.267234 (another draw favours another lambda) | OK: key true, distractors false |

### d2i_m02 (15 questions)

| Q | key (as shipped after this audit) | digest line / engine call | verdict |
| --- | --- | --- | --- |
| 1 | Fold 0: EKENE-2 sits at shuffled position 3, and 3 mod 3 is 0. | ENGINE groupKFold k3 seed 5 order/folds | OK: key true, distractors false |
| 2 | EKENE-1, EKENE-4 and EKENE-9 | ENGINE fold 1 = EKENE-1,4,9; ENGINE groupKFold k3 over seeds 0..1999: a fold equal to {EKENE-3,4,5} at 65 seeds (first 129) | FALSE UNIVERSAL in explanation: "a contiguous block of the sorted names, which the engine never deals" (the engine deals that set at seed 129). Now "the middle three names of the sorted list make up none of the three folds at this seed". |
| 3 | Lambda 10, at 5.826789 us/ft. | ENGINE 3-fold means logs | OK: key true, distractors false |
| 4 | 6.773053 us/ft at lambda 100 | ENGINE 3-fold means attrs; teaching split lam 100 5.759287 | OK: key true, distractors false |
| 5 | Little about the attributes: a penalty that strong pulls every prediction toward the ... | ENGINE means lam 1000 both sets above every lower-lambda logs mean | OK: key true, distractors false |
| 6 | Into folds of 3, 2, 2 and 2 wells, which is 90, 60, 60 and 60 rows. | ENGINE k4 folds 3,2,2,2 (fold 0 holds 3) | OK: key true, distractors false |
| 7 | k 9 is dealt as leave one well out; k 10 is refused, naming `k`. | ENGINE k9 fitted, k10 refusal verbatim field k | OK: key true, distractors false |
| 8 | Lambda 0, reading 5.495600 us/ft against 5.501614 at lambda 10. | ENGINE LOO lam 0 5.495600 < lam 10 5.501614 | OK: key true, distractors false |
| 9 | With one well per fold, every order of the shuffle deals the same nine folds. | SOFT SPOT SETTLED. ENGINE groupKFold k9 at seeds 0,1,5,6,7,12,999: the nine one-well folds are the same set every time (only the fold numbers move); LOO means identical to 1e-15 (5.495600 / 5.501614 / 6.288507) at every seed | OK: key TRUE by engine |
| 10 | The engine balances wells and takes a seed; GroupKFold balances rows and takes none. | S12, S25 | OK: key true, distractors false |
| 11 | EKENE-9, at 8.291318 us/ft. | ENGINE LOO ols per well, max EKENE-9 8.291318 | OK: key true, distractors false |
| 12 | At most 2.04e-14 us/ft, which is rounding. | ENGINE LOO ridge 0 vs ols max 2.043e-14 | OK: key true, distractors false |
| 13 | The mean, 5.888677 us/ft, quoted as k-fold by wells, k 3, seed 5. | ENGINE 3-fold lam 0 mean 5.888677 | OK: key true, distractors false |
| 14 | Deciding the grid before looking at the scores, and printing all of it. | SOFT SPOT SETTLED. ENGINE: with the grid fixed, the winner still depends on the folds: logs lam 10 vs lam 0 at k3 seed 5 5.826789 < 5.888677, seed 2 6.267234 > 6.258353; LOO 5.501614 > 5.495600 | OVERCLAIMED KEY (class 5): "What keeps the winning mean from flattering the choice?" keyed "Deciding the grid before looking...". A fixed grid still crowns the lowest of twelve means on one set of folds, so fixing it does not keep the mean from flattering. Prompt now "What lets a reader judge how far the winning mean may flatter the choice?" (key text unchanged); explanation now shows the margin with digest figures (5.826789 against 5.888677, reversed under leave one well out). |
| 15 | Rows of one well share its sonic offset, so a split well would be scored on an offset... | S9, S12 | OK: key true, distractors false |

### d2i_m03 (15 questions)

| Q | key (as shipped after this audit) | digest line / engine call | verdict |
| --- | --- | --- | --- |
| 1 | Group test RMSE less random-row test RMSE, so a positive figure means the random spli... | ENGINE leakageDemo basis optimism "group test rmse - random-row test rmse" | OK: key true, distractors false |
| 2 | Random-row test RMSE 5.311723 against group test RMSE 16.999672. | ENGINE seed 5 attrs 5.311723 / 16.999672 | OK: key true, distractors false |
| 3 | The random-row split read worse than the well split on this draw: 6.030242 against 4.... | ENGINE seed 5 logs 6.030242 / 4.282693 | OK: key true, distractors false |
| 4 | Positive on 12 of 12 with the attributes; negative on 7 of 12 on the logs alone. | SOFT SPOT SETTLED. ENGINE leakageDemo seeds 1..12: attrs positive 12; logs negative 7, positive 5, zero 0 (so "positive on the other 5" is 12 - 7 with no zero) | OK: key and explanation TRUE by engine |
| 5 | Constant down each well, the attributes name it, so the model learns a well's offset ... | S13 | OK: key true, distractors false |
| 6 | No log names the well a row came from, so the model has no path to a well's offset. | S13 | OK: key true, distractors false |
| 7 | The engine's ceil(testFraction x count) is applied to 270 rows in one case and to 9 w... | ENGINE randomRowSplit nTest 81; groupSplit 3 wells 90 rows | OK: key true, distractors false |
| 8 | No. A log can carry a calibration or mud effect constant down one well, and one clean... | SOFT SPOT SETTLED. ENGINE leakageDemo seeds 1..12 on the logs plus ONE well-constant column: + kb positive on 11 of 12, + northing 7, + mudWeight 6, + easting 5 (logs alone 5). Per-well calibration shifts planted in all three logs (mulberry32 seeds 21/22/23): positive on 5, 5 and 9 of 12. One constant-per-well column can leak, and whether it shows depends on the draw | OK: key TRUE by engine ("can carry ... one clean result cannot show there is none") |
| 9 | Seed 5, at 11.687949 us/ft. | ENGINE attrs optimism max seed 5 11.687949 | OK: key true, distractors false |
| 10 | -1.838526 us/ft, from seed 8 | ENGINE logs min seed 8 -1.838526 | OK: key true, distractors false |
| 11 | The procedure is the defect: the test wells shaped the transform, however small the c... | ENGINE scaler leak log loss 0.126480 / 0.126152, diff -3.28e-4 | OK: key true, distractors false |
| 12 | With an intercept, rescaling a feature changes its coefficient and leaves the fitted ... | S10, S6 | OK: key true, distractors false |
| 13 | Centre 14.045286, scale 16.599700 | ENGINE RT centre/scale 14.045286/16.599700 vs 13.691967/16.255862 | OK: key true, distractors false |
| 14 | In each fold, on that fold's training wells, then applied unchanged to its test wells. | S13 | OK: key true, distractors false |
| 15 | It lowers the first on 12 and raises the second on 12. | ENGINE betterRR 12, worseG 12 | OK: key true, distractors false |

### d2i_m04 (15 questions)

| Q | key (as shipped after this audit) | digest line / engine call | verdict |
| --- | --- | --- | --- |
| 1 | PHIC is at least 0.16 and RT is at least 10 ohm.m. | S2 stated rule; ENGINE 94 pay of 300 | OK: key true, distractors false |
| 2 | 1, because both halves of the rule say at least. | S2 rule "at least" | OK: key true, distractors false |
| 3 | RHOB, NPHI and RT; the rule's PHIC is withheld from it. | S14 | OK: key true, distractors false |
| 4 | The pay split draws from all ten wells, EKENE-6 included, so the shuffle differs. | ENGINE groupSplit over ten wells seed 5: EKENE-3,5,7 | OK: key true, distractors false |
| 5 | 70 | ENGINE 70 of 210 train pay, 24 test pay, 66 non-pay | OK: key true, distractors false |
| 6 | It multiplies them by exp(0.241141), which is 1.272700. | ENGINE exp(0.241141) 1.272700 | OK: key true, distractors false |
| 7 | -0.107164 log odds | ENGINE RHOB/100 -0.107164; RHOB range 2.107 to 2.734 | OK: key true, distractors false |
| 8 | RT, at 6.212972. | ENGINE z 1.580826/-1.979331/-0.640305/6.212972 | OK: key true, distractors false |
| 9 | They do not pin down even its sign once RHOB and RT are in the model. | ENGINE NPHI z -0.640305 | OK: key true, distractors false |
| 10 | The intercept-only deviance and the fitted model's, each -2 x log likelihood. | ENGINE deviance 49.014054, null 267.335951, ll -24.507027 | OK: key true, distractors false |
| 11 | The rule's porosity half failed there, and the model sees porosity only through densi... | ENGINE row 61 PHIC 0.118 < 0.16, RT 27.7, p 0.817561 class 1 | OK: key true, distractors false |
| 12 | Class 0, since class 1 needs a probability above 0.5. | ENGINE predict eta 0: value 0.5 class 0; basis verbatim | OK: key true, distractors false |
| 13 | It refuses, naming `y`: "y must contain both classes, 0 and 1". | ENGINE one-class refusal verbatim field y | OK: key true, distractors false |
| 14 | Negative, because p = 1 / (1 + exp(-eta)) sits below one half only when eta is below ... | ENGINE row 60 p 0.068312 | OK: key true, distractors false |
| 15 | It describes a direction these rows rarely take, so its standard error grows. | SOFT SPOT SETTLED. ENGINE logistic on the pay training rows: RHOB SE 5.414154 beside NPHI against 4.830472 without it (RHOB, RT); NPHI SE 15.424455 beside RHOB against 13.409607 without it (NPHI, RT). Correlation -0.563498 / -0.405407 confirmed | OK: key TRUE by engine; the comparison is not printed in the digest (DIGEST GAP G1) |

### d2i_m05 (15 questions)

| Q | key (as shipped after this audit) | digest line / engine call | verdict |
| --- | --- | --- | --- |
| 1 | 4 non-pay rows the model called pay, the false positives. | ENGINE confusionMatrix [[62,4],[0,24]], layout basis verbatim | OK: key true, distractors false |
| 2 | 0.857143, which is 24 / (24 + 4) | ENGINE precision pay 0.857143 | OK: key true, distractors false |
| 3 | 1.000000: all 24 pay rows were called pay. | ENGINE recall pay 1 | OK: key true, distractors false |
| 4 | Every row called non-pay was non-pay, and 4 of its 66 rows were called pay. | ENGINE label 0 tp 62 fp 0 fn 4 | OK: key true, distractors false |
| 5 | 0.923077, from 2 x 24 / (2 x 24 + 4 + 0) | ENGINE F1 0.923077 / macro 0.945913 / weighted 0.956571 / 0.968750 | OK: key true, distractors false |
| 6 | As 2TP / (2TP + FP + FN), equal to the harmonic mean wherever precision and recall ar... | ENGINE f1 basis verbatim | OK: key true, distractors false |
| 7 | Macro 0.928571; weighted 0.961905. | ENGINE macro P 0.928571, weighted P 0.961905 | OK: key true, distractors false |
| 8 | As an identity: weighting each recall TP / support by its support leaves total TP ove... | ENGINE weighted recall === accuracy | OK: key true, distractors false |
| 9 | 0.166667, the mean of 0.5, 0 and 0 | ENGINE sand case zd0 macro P 0.166667 | OK: key true, distractors false |
| 10 | Shale and lime each occur once and are missed once, so FN 1 gives each an F1 of 0 by ... | ENGINE zd1 macro F1 0.222222 unchanged; ENGINE labels [0,1,2] with 2 absent lists recall and f1 of 2 in undefinedRatios (distractor "never to a recall or an F1" false) | OK: key true, distractors false |
| 11 | None: every label is predicted and occurs, so no denominator is zero. | ENGINE [0,1,1] vs [0,1,0] undefinedRatios [] | OK: key true, distractors false |
| 12 | A refusal naming `zeroDivision`: "zeroDivision must be 0 or 1". | ENGINE zeroDivision 0.5 refusal verbatim | OK: key true, distractors false |
| 13 | The rows the model called pay, TP + FP for the pay label. | ENGINE column sums 62, 28 | OK: key true, distractors false |
| 14 | With truth on the columns the off-diagonal cells swap, and 4 false positives read as ... | S15 layout | OK: key true, distractors false |
| 15 | It is right on 66 rows and finds none of the pay, which accuracy alone hides. | ENGINE all-non-pay report: accuracy 0.733333, no refusal, pay precision in undefinedRatios | OK: key true, distractors false |

### d2i_m06 (15 questions)

| Q | key (as shipped after this audit) | digest line / engine call | verdict |
| --- | --- | --- | --- |
| 1 | 91: one per distinct score, plus the start at (0, 0). | ENGINE rocCurve 91 points, 90 distinct | OK: key true, distractors false |
| 2 | FPR 0.333333 and TPR 1.000000, after a diagonal step. | ENGINE ties fpr/tpr at 0.4 = (0.333333, 1) | OK: key true, distractors false |
| 3 | 0.944444, and 0.500000 when every score is equal. | ENGINE ties AUC 0.944444; all tied 0.500000 | OK: key true, distractors false |
| 4 | The trapezoid AUC, 0.997475, to within 1.11e-16. | ENGINE pairs 1584, 1580 won, |diff| 1.11e-16 | OK: key true, distractors false |
| 5 | Nothing: squaring keeps the order of the scores, and AUC reads only the order. | ENGINE rocCurve on squared probabilities: AUC identical (===), 91 points | OK: key true, distractors false |
| 6 | AUC reads 1 for the perfect ranking; log loss sees how little confidence the probabil... | ENGINE synthetic pay 0.51..0.53, non-pay 0.47..0.49: AUC 1, log loss 0.654050 | OK: key true, distractors false |
| 7 | 0.693147, which is ln 2 | ENGINE logLoss half 0.693147 | OK: key true, distractors false |
| 8 | 8.723863, with 3 rows clipped | ENGINE clip case 8.723863, clipped 3 | OK: key true, distractors false |
| 9 | It is clipped to eps = 1.00e-15, and -ln(1.00e-15) is 34.538776. | ENGINE row y1 p0 charge 34.538776 | OK: key true, distractors false |
| 10 | A probability equal to eps is kept: p = 1.00e-15 clips 0 rows, and p = 1.00e-16 clips 1. | ENGINE p 1e-15 clipped 0, p 1e-16 clipped 1 | OK: key true, distractors false |
| 11 | 36.043653, against the engine's 34.538776, so a log loss is compared only with its cl... | ARITHMETIC -ln(2.220446e-16) 36.043653 | OK: key true, distractors false |
| 12 | A refusal naming `yTrue`, in the engine's words: "yTrue must contain both classes (fo... | ENGINE one-class rocCurve refusal verbatim | OK: key true, distractors false |
| 13 | Null, because JSON has no infinity. | ENGINE thresholds[0] null; thresholds[1] 0.999938 the highest probability | OK: key true, distractors false |
| 14 | Whether the probabilities themselves can be taken at face value. | ENGINE test log loss clipped 0 | OK: key true, distractors false |
| 15 | -ln(1 - 0.817561), since its label is 0 | S16 formula | OK: key true, distractors false |

### d2i_exam (42 questions)

| Q | key (as shipped after this audit) | digest line / engine call | verdict |
| --- | --- | --- | --- |
| 1 | The four well-level attributes: easting drops from 8.680036 to 0.098385 while GR goes... | ENGINE shrink factors lam 0 to 100: attrs 0.011/0.066/0.350/0.118, logs 0.559/0.878/0.475 | OK: key true, distractors false |
| 2 | It is recovered as mean y less the sum of b_j mean_j / sd_j, and the b_j shrink as la... | ENGINE ridge basis originalUnits verbatim | OK: key true, distractors false |
| 3 | Lambda 100: 3.458214 effective degrees of freedom, test RMSE 5.759287 us/ft. | ENGINE edf lam 100 3.458214 | OK: key true, distractors false |
| 4 | The sum runs over the seven standardised features only; the unpenalised intercept is ... | ENGINE edf lam 0 exactly 7 | OK: key true, distractors false |
| 5 | 4.243369 is us/ft per training population standard deviation of mud weight; 14.874015... | ENGINE lam 10 mudWeight std 4.243369, orig 14.874015 | OK: key true, distractors false |
| 6 | Bias: the penalty now pulls the fit so far from the training rows that the training R... | ENGINE R2 lam 1000 0.265317 | OK: key true, distractors false |
| 7 | It pulled easting, northing, kb and mud weight hardest toward zero, curbing how far t... | ENGINE leakage seed 5 attrs group 16.999672; ridge lam 100 5.759287; easting 0.098385 | OK: key true, distractors false |
| 8 | Positions 2, 5 and 8: EKENE-5, EKENE-3 and EKENE-7. | ENGINE k3 fold 2 EKENE-3,5,7 | OK: key true, distractors false |
| 9 | It is tested in exactly one fold and trains the model in the other two. | ENGINE folds 90/180 | OK: key true, distractors false |
| 10 | Ridge at lambda 10, 3.414773 against 3.514700 for least squares. | ENGINE LOO EKENE-1 ols 3.514700, ridge 10 3.414773; all folds differ at lam 10 | OK: key true, distractors false |
| 11 | The count of wells per fold, to within one well; row counts follow from whichever wel... | ENGINE k4 3,2,2,2; S25 | COPY: explanation "deals the shuffled order rather than blocks of sorted names" (a contrastive construction) now "deals the shuffled order round robin, never in blocks of sorted names". |
| 12 | A refusal naming `k`: "k must be a whole number from 2 to 9 (the number of distinct g... | ENGINE k1 refusal verbatim field k | OK: key true, distractors false |
| 13 | 6.773053, the mean over folds in which every well is tested once, quoted with k 3 and... | ENGINE 3-fold attrs lam 100 6.773053 | OK: key true, distractors false |
| 14 | Another seed shuffles the wells differently, grouping other wells into folds and givi... | ENGINE k3 seeds 1,2,3 deal other fold sets and other means | OK: key true, distractors false |
| 15 | 7.066351 us/ft | ENGINE seed 12 attrs optimism 7.066351 | OK: key true, distractors false |
| 16 | All nine: its `sharedGroups` lists every sonic well. | ENGINE sharedGroups 9 at seed 5 | OK: key true, distractors false |
| 17 | In its own words: "leakage demonstration only: rows of one well can fall on both side... | ENGINE randomRowSplit basis.purpose verbatim | OK: key true, distractors false |
| 18 | A penalty on standardised features depends on their scale, and the all-well scaler se... | ENGINE scaler leak RT coef 3.129011 / 3.083215, scale 16.599700 / 16.255862 | OK: key true, distractors false |
| 19 | Taking the scaler's centre and scale from all 270 sonic rows, then running `groupKFol... | S13 | OK: key true, distractors false |
| 20 | Only the draw: on the logs the sign falls either way, positive on 5 seeds and negativ... | SOFT SPOT SETTLED. ENGINE leakageDemo logs seeds 1..12: positive at 2,3,9,11,12 (5), negative 7, zero 0; seed 9 1.220206 | OK: key TRUE by engine |
| 21 | The attributes help on rows of wells already seen and hurt on wells the model has not... | ENGINE seed 5 moves; betterRR 12, worseG 12 | OK: key true, distractors false |
| 22 | 0.126480 against 0.126152: one model and one penalty, the scaler fitted on different ... | ENGINE 0.126480 / 0.126152; unpenalised 0.115676 | OK: key true, distractors false |
| 23 | EKENE-1, EKENE-10, EKENE-2, EKENE-4, EKENE-6, EKENE-8 and EKENE-9. | ENGINE pay split training wells | OK: key true, distractors false |
| 24 | Row 61, at 0.817561, a row whose PAY is 0. | ENGINE first five test rows | OK: key true, distractors false |
| 25 | The log odds of pay where RHOB, NPHI and RT are all zero, a point far outside the rows. | S14 | OK: key true, distractors false |
| 26 | No fit: the engine stops at the third label and names the field in its own words, "y[... | ENGINE y[2] refusal verbatim | OK: key true, distractors false |
| 27 | As sqrt(diag((X'WX)^-1)) at the solution, with W = p(1 - p). | ENGINE logistic basis standardErrors verbatim | OK: key true, distractors false |
| 28 | Among the 4 in row true 0, column predicted 1: one of pay's false positives. | ENGINE row 61 class 1, PAY 0 | OK: key true, distractors false |
| 29 | Class 0 from `predict`, yet positive in `rocCurve`, which calls a row at or above its... | ENGINE predict half class 0; rocCurve basis "at or above" | OK: key true, distractors false |
| 30 | 0.969697, the unweighted mean of 0.939394 and 1.000000. | ENGINE macro recall 0.969697 | OK: key true, distractors false |
| 31 | The precision of lime and the precision of shale. | ENGINE undefinedRatios lime, shale precision | OK: key true, distractors false |
| 32 | Non-pay, at 0.968750 against 0.923077 for pay. | ENGINE F1 0.968750 / 0.923077 | OK: key true, distractors false |
| 33 | Label 0's false negatives, which is why non-pay's recall reads 62 / 66. | ENGINE label 0 fn 4 | OK: key true, distractors false |
| 34 | The weighted recall: weighting TP / support by support and dividing by n leaves the s... | ENGINE weighted recall === accuracy | OK: key true, distractors false |
| 35 | The supports: 66 non-pay rows and 24 pay rows. | ENGINE row sums 66, 24 | OK: key true, distractors false |
| 36 | The recall of pay at that threshold: TP / (TP + FN). | S16 | OK: key true, distractors false |
| 37 | Every pay row clears one half, but some non-pay rows outscore some pay rows: 4 of 158... | ENGINE min pay probability 0.539840; the 4 non-pay rows above it are the 4 false positives | OK: key true, distractors false |
| 38 | 1584, every pairing of 24 pay rows with 66 non-pay rows. | ENGINE 1584 pairs | OK: key true, distractors false |
| 39 | 0: no probability on the test wells reaches the clip. | ENGINE clipped 0 | OK: key true, distractors false |
| 40 | 5: four distinct scores give four points, after the null-threshold origin. | ENGINE ties 5 points | OK: key true, distractors false |
| 41 | 0.356675, which is -ln(1 - 0.3), as its label is 0. | ENGINE row y0 p0.3 charge 0.356675 | OK: key true, distractors false |
| 42 | It takes one diagonal step: equal scores are one threshold and their rows move together. | ENGINE ties basis verbatim | OK: key true, distractors false |
