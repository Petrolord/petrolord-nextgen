# D2 Machine Learning on Well Data: the key-truth writer's task

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. The engine's FINDINGS record, the oracle, the
library pins and the engine's source comments are PROVENANCE.

## TWO JOBS

1. **The key truths.** One sentence a learner should be able to say afterwards,
   with the number that makes it checkable.
2. **The second reader of every bank, before `gen_migration.py`.** Read prompt,
   options, explanation, digest and lesson for every question, one tier at a
   time, and CALL THE ENGINE (through the lab or the panel) for every keyed
   figure. Swap roles where the explanation supports a distractor.

## THE DEFECT CLASSES TO READ FOR, from the FC, H and D1 audits

1. **A distractor that became true.** The engine returns the distractor's
   number under some stated setting the question did not rule out.
2. **A wrong failure-mode gloss.** "Refused" said of a fit that returns with a
   warning; "fails" said of a value that is only extrapolated.
3. **A false superlative.** "the largest", "always", "never" where the digest
   shows one case.
4. **An exam question that near-duplicates a module question** (audit at
   Jaccard 0.45).
5. **A sentence characterising a relationship nobody computed.** Every "worse",
   "more", "higher" rests on two printed figures.
6. **The answer printed before the work** in the prompt or a table above it.
7. **A capstone input or value** in any prompt, option or explanation.
8. **The answer-length tell**, and the D1 tell: three distractors opening the
   same way while the key does not.
9. **Printed alike keyed as equal.** Two figures equal at six decimals are
   equal only where the digest says the engine returns them equal.
10. **A boundary stated globally.** Each rule draws its own (section 24): a
    scaled condition number exactly at the limit is fitted, a probability of
    exactly 0.5 is class 0, a Newton step exactly at tol stops the fit.
11. **A message quoted inexactly.** A refusal or warning is quoted verbatim or
    not at all.
12. **A digest section number in learner-visible text.** Say "the course".

## THE KEY TRUTHS THIS COURSE OWES ITS LEARNERS

### Associate

1. A test score counts only rows the model was not fitted on: a random-row
   split of the 270 sonic rows puts test rows in all 9 wells.
2. Scaling is fitted on the training rows: the GR centre is 59.844500 there
   and 60.250741 over every row.
3. A coefficient carries the target's unit over the feature's: GR moves DT by
   0.288005 us/ft per gAPI.
4. The intercept is where every feature is zero, far outside the data: -0.552686
   us/ft with a standard error of 30.261214.
5. A test R-squared names its reference: 0.815322 about the test mean, 0.816151
   about the training mean.
6. Rows of one well share its offset: the well mean residuals span 12.562737
   us/ft.

### Professional

7. Ridge trades bias for variance: the test RMSE falls from 16.999672 at lambda
   0 to 5.759287 at lambda 100 and rises to 8.607538 at lambda 1000.
8. Cross-validation by wells tests every well once: the logs score 5.826789 at
   their best lambda, the attributes 6.773053 at theirs.
9. Leakage needs a feature that names a well: optimism positive on 12 of 12
   seeds with the attributes, negative on 7 of 12 without.
10. A logistic coefficient is log odds per unit: RT's 0.241141 multiplies the
    odds of pay by 1.272700 per ohm.m.
11. Precision and recall read different rows: pay precision 0.857143, recall
    1.000000.
12. AUC reads order and log loss reads probabilities: 0.997475 and 0.115676.

### Expert

13. A scaled condition number measures collinearity: the attribute design reads
    7608.495043, and centring brings it to 8.661304.
14. A refusal at the default declines digits nobody can vouch for: Filip forced
    to fit reaches 7.66 digits, its float-design limit.
15. Separation is decided before any Newton step: PHIC on the 106 rows at or
    above the RT cutoff is refused, and fitted with l2 1 at 0.817700.
16. The stopping rule is in coefficient units: the compressibility case
    converges at tol 0.1 and warns at the default.
17. An importance names its seed and repeats: CALI ranks last at -0.031931.
18. A prediction for a well outside the range misses by more than the k-fold
    estimate: 13.176539 against 5.826789.

## THE RULES

Digest section 26's vocabulary is binding. No em dashes, no en dashes, no "X,
not Y" contrastive. No key truth may carry a capstone field name, well, stated
input or graded answer at any precision.
