# D2 mlcore, Expert (advanced) key-truth audit

Auditor: D2 Expert key-truth auditor, 2026-09-24. Worktree /root/wt-dai-d2-nextgen, branch feat/d2-mlcore-course.
Inputs read in full: /root/dai-brief.md, BRIEF.md, KEY_TRUTH_TASK.md, BANK_TASK.md, digest.txt (856 lines),
all 7 Expert banks (132 questions); Expert lessons read where a question or an attention area touched them.

Every figure keyed in the 132 questions, and every distractor that a setting the question leaves open could
make true, was run through the VENDORED engine (packages/engines/engines/dataai/ml.js) on the Ekene data built
exactly as d2_dump.mjs builds it. The harness and the calls are in `audit-a/` (h.mjs copied from the
Professional harness; m01.mjs, m01b.mjs, m02.mjs, m03.mjs, m04.mjs, m05.mjs, m06.mjs) and their output is in
`audit-a/out_*.txt`. Engine call labels below (E1 to E45) are the labels printed there.

## Summary

- **Wrong keys: 0.** Every keyed figure reproduces from the engine at six decimals; every boundary key matches
  the engine's own comparison (E4, E19, E32, E34, E35, E42).
- **Defects fixed: 6** (m01 Q5, m04 Q13, m05 Q5, m06 Q1, exam Q4, exam Q10). Key positions unchanged.
- **Engine defects: 0.** One DIGEST GAP (ridge's condition number) and 2 LESSON defects, recorded only.
- Gates after the fixes: bankkit emit pass (all 7), lengthtails worst 33.3 pct (refuse above 40), openings tell
  0, dupaxes 0 pairs at 0.45, litsweep exit 0, kit numsweep 561 checked 0 unresolved, truth_check pass,
  gate_capstone_leak --banks banks 0 findings, gate_vocabulary 0 breaches, check-bank-sources mlcore 21 of 21
  reproduce (396 questions), em/en dash and ", not " grep 0.

## Attention areas, engine evidence

| area | finding | evidence |
| --- | --- | --- |
| class 10, condition limit | exactly at the limit is fitted: Longley at maxCondition = its full scaled number 43275.04358718098 is fitted; at the printed 43275.043587 it is REFUSED (the print is below the full number). m01 Q7 keys "nothing decisive" and is right | E4 |
| class 10, Newton tol | inclusive: tol set to the exact step of iteration 7, 8, 9 stops at that iteration converged true; tol just below it (x (1 - 1e-15)) takes one more step | E19 |
| class 10, p = 0.5 | class 0 | E42 |
| class 10, log loss clip | p = 1e-15 clips 0 rows, 1e-16 clips 1, for y 0 and y 1 | E32 |
| class 10, other rows of the boundary table | scaler [2,2,2.0000000001] scale 4.714e-11 fitted, [2,2,2] refused; ols 2 rows refused, 3 rows df 1; k 9 fitted, k 10 refused; zeroDivision case 0 undefined ratios; 0.28 x 25 holds out 7 | E34, E35, E31, E37, E38 |
| class 9, NIST LREs | Filip engine LRE 7.655291 against limit 7.66 (keyed only as agreeing at the two decimals printed: correct); Norris 14.061672 < 14.07; Pontius 13.509969 prints 13.51 beside 13.51; Wampler2 13.201462; NoInt1 and NoInt2 scaled condition number exactly 1 in float | E5, m01b, E8 |
| separation | high-RT rows: 106, 94 pay; no row has PHIC exactly 0.16 (pay min 0.162, non-pay max 0.158), so m02 Q1's "strictly on its own class side" holds; l2 1 gives 0.817700, 6 it, converged, type complete; l2 0.1 gives 6.814258 also in 6 it, converged, no warning; quasi case message verbatim; pay model certificate Stiemke. On a COMPLETE case only Gordan's programme runs (code: return before Stiemke) | E11, E12, E13 |
| convergence | trace reproduces all ten rows; maxIter 3: converged false, RT 0.196989, log likelihood -25.899408, standard errors returned at the iterate, trace field 5.791631 identical to the converged fit's third step; compressibility 6 it at tol 0.1, 100 updates and the verbatim warning at default, 0 halvings both; 0.1 / 6.834e+9 = 1.463e-11 | E17, E18, E20 |
| permutation importance seeds | seed 5 means, SDs (population: 0.315115 vs sample 0.352309) and drops reproduce; CALI's five drops all negative; seed 6 means and ranking GR, NPHI, RHOB, CALI reproduce; nRepeats 4 at seed 5 shifts RHOB's drops one shuffle along the stream (1.935358, 1.702529, ...) so m04 Q8's key holds; auc on ols refused verbatim; pay AUC drops reproduce | E21 to E24, E27 |
| learning curve | all six points reproduce; test rises only at EKENE-10 and EKENE-7; lowest test 4.205658 at five wells; [3,2,4] refused naming trainGroupCounts[1] | E25, E26 |
| missing log | y[20] refusal; ridge 270-row coefficients; first EKENE-6 row 117.793533 at 8092 ft; k 3 and k 9 means for all five candidates (CALI raises the mean at k 9 as well); min-max above 1: GR 4, RHOB 0, NPHI 0, max 1.219324 | E28, E29, E44, E45 |
| refusal order | 94 pay rows only: "y must contain both classes, 0 and 1"; labels 0,1,2: y[2] named before the both-classes check; tol 0; maxCondition 0.5; mixed groups names the first mismatched entry; seed -1; probability 1.2 | E14 to E16, E7, E40, E41, E33 |

## Defects fixed

| bank Q | class | before | after | evidence |
| --- | --- | --- | --- | --- |
| m01 Q5 | 1 and false explanation | distractor "It fitted ridge at lambda 10 on the same columns, since ridge returns the number that ols refuses on"; explanation "Ridge refuses above maxCondition as ols does, since the refusal rule belongs to both." Ridge at lambda 10 FITS the twice-NPHI design (scaled condition number 7.349273, the penalised system's), so the first half of the distractor was true and the explanation false | distractor at lambda 0; explanation "Ridge at lambda 0 refuses the same design in the same words, since the refusal rule belongs to both." | E3: ridge lambda 0 refused (61... in the message), lambda 1e-12 fitted at 23024294.2, lambda 10 fitted at 7.349273 |
| m04 Q13 | 1 | distractor "Every well holds 30 rows here, so a count in wells and a count in rows give the same curve in the end anyway": a count of 30, 60, ... rows taken in the shuffled well order does give the same curve | "... so counting in wells is a shorter way to write the row counts and carries no other reason" | E25; the stated reason is independence of rows |
| m05 Q5 | 9 (distractor rebuilt as a real class 9 wrong reading) | distractor "Four-decimal agreement between 5.495600 and 5.501614 would make the two lambdas equal" rested on a false premise (they differ at the third decimal) | "As a tie, since 5.495600 and 5.501614 print alike once rounded to two decimals, so either lambda may be quoted"; explanation now says they print alike at two decimals and differ at six | E44 k 9 means 5.495600, 5.501614 |
| m06 Q1 | 1 | distractor "The n - 1 divisor cannot be computed on one training row" is a true fact offered as the reason | "The n - 1 divisor would make the scale depend on the seed of the split" | digest convention table; E43 factor 1.002789 |
| exam Q4 | 9 (explanation) | "NoInt1 reads exactly 1.000000": an equality claimed from a print (true in float, E8, but the digest does not say the engine returns exactly 1) | "the value NoInt1 prints as 1.000000" | E8 |
| exam Q10 | key imprecise (no re-key) | key "It decides separation exactly with two linear programmes before iterating and refuses": on the high-RT PHIC rows (complete) Gordan's programme alone runs; Stiemke's is tested only when Gordan's is feasible | key "It decides separation exactly by linear programme before iterating and refuses, since no finite answer exists to print"; explanation adds "On these rows Gordan's programme alone decides it: infeasible, so complete, and Stiemke's is never reached." | E11 (type complete); ml.js separationTest returns before the Stiemke programme |

## Per question verdicts (all other questions: ok)

- m01: Q1 to Q15 ok after Q5 (E1 to E10, m01b). Q3 R-squared moves by exactly 0 (E1). Q7 checked both ways (E4). Q14 zero column verbatim (E6).
- m02: Q1 to Q15 ok (E11 to E13). Q10 distractor 3's 6.814258 is the l2 0.1 figure, also 6 iterations and converged; the distractor is false on "with a warning" and on the l2 in the prompt.
- m03: Q1 to Q15 ok (E17 to E20). Q4's "0.097613 at step 7": the step that produced the first -24.507027 print was itself above tol, so iteration 7 did not stop the fit (E19 shows the rule reads that step).
- m04: Q1 to Q15 ok after Q13 (E21 to E27).
- m05: Q1 to Q15 ok after Q5 (E28, E29, E44, E45).
- m06: Q1 to Q15 ok after Q1 (E30 to E43).
- exam: Q1 to Q42 ok after Q4 and Q10. Superlatives checked: Q19 lowest 4.205658; Q23 ranking; Q41 only Longley unseeded.

## Digest gap (record only)

1. **Ridge's scaled condition number is the PENALISED system's.** ml.js ridge measures the condition number of
   [Z; sqrt(lambda) I] (standardised features stacked on the penalty rows), so at any lambda above 0 an exact copy
   column is fitted (twice NPHI: 7.349273 at lambda 10, 23024294.2 at lambda 1e-12), and only lambda 0 refuses it
   like ols. The digest's refusal row "`ols`, `ridge` | refuse the scaled condition number above maxCondition"
   and section 17 read as if ridge measured the design. A sentence and one call belong in section 17 or 24.
2. The logistic fit at l2 = 0 carries its own fixed condition refusal ("X is rank deficient or too
   ill-conditioned for an unpenalised fit ... above 100000000; add an L2 penalty (l2 > 0) or drop collinear
   features") that the refusal table does not list. No Expert question relies on it.

## Lesson defects (record only, not edited)

1. m01 l02 line 5: "The engine refuses a least squares or ridge fit when the scaled condition number of the
   design is above `maxCondition`." For ridge the number is the penalised system's, so ridge with lambda above 0
   fits the exact-copy design this lesson then refuses with ols (gap 1).
2. m04 l05 line 20: "As wells are added the training score rises, to 5.758010 at six wells". It dips at the third
   well, 4.351546 to 4.346620 (the bank's m04 Q15 explanation says so); "rises overall" or naming the dip fixes it.

## Engine defects

None found.
