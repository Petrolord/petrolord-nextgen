# Choosing features by whole-well scores

{{panel:ml-diagnose-explorer}}

{{panel:ml-validate-explorer}}

The first step of a missing-log prediction is to decide what to predict with. The engine does not choose the features, lambda or the model: a course or an app does that, with the folds `groupKFold` returns, and prints the scores it compared. This lesson does that for EKENE-6's sonic.

| features | lambda | mean test RMSE over the three folds (us/ft) |
| --- | --- | --- |
| GR, RHOB, NPHI | 0 | 5.888677 |
| GR, RHOB, NPHI | 10 | 5.826789 |
| GR, RHOB, NPHI, CALI | 0 | 5.908607 |
| GR, RHOB, NPHI, CALI | 10 | 5.851480 |
| the logs and the four attributes | 100 | 6.773053 |

## The folds

The comparison uses the k-fold of the Professional tier: k 3, seed 5, over the nine sonic wells. The wells are sorted, shuffled once with the seed, and dealt round robin, so every well is tested exactly once, in a fold of three wells, by a model fitted on the other six. Each candidate is ridge on its features at its lambda, fitted and scored fold by fold, and the table reports the mean of the three fold RMSEs, the arithmetic mean of the three.

Every candidate is scored on the same folds, so a difference between two means is a difference between the candidates on the same wells.

## The candidates

The three logs at lambda 0 and 10 come from the Professional tier's table, which tried six lambdas. One more candidate is scored here on the same folds, the logs with the caliper. The attribute set appears at lambda 100, its best mean in the Professional tier's table.

Read the table top to bottom. Adding CALI raises the mean at both lambdas: 5.908607 against 5.888677 at lambda 0, and 5.851480 against 5.826789 at lambda 10. The permutation importance of the previous module found CALI last; here, scored on wells the model has not seen, it does not help either. The four attributes, at their best lambda, read 6.773053, above every logs-only candidate here: they name the wells they were fitted on and extrapolate to the rest.

## The choice

The lowest mean is the three logs at lambda 10, 5.826789 us/ft. So the prediction for EKENE-6 will be ridge on GR, RHOB and NPHI at lambda 10.

That mean is the expected error for a new well like the nine, and it is the number the write-back carries. Every fold held out wells drawn from the same nine, so the estimate describes a new well of the same kind. A well that differs from all nine in a way the logs cannot see is outside what the estimate describes, and the next lesson shows that EKENE-6 is one.

## What the table does not say

The table prints means over one set of three folds: 5.826789 for the logs at lambda 10 against 5.888677 at lambda 0. Another k can reverse the order: leaving one well out, k 9, the Professional tier read 5.495600 for the logs at lambda 0 and 5.501614 at lambda 10. Quote the choice with its folds and seed, and never claim that lambda 10 is better than lambda 0 for every well. The choice is the lowest mean on these folds, stated as that.

## Exercise

Open the validate panel on the cross-validation view with the sonic rows, k 3 and seed 5, and confirm the mean test RMSE of 5.826789 for GR, RHOB and NPHI at lambda 10. Add CALI to the features and confirm 5.851480. Then run both at seed 6 and write down the two means. Say in one sentence whether your choice of features would change.
