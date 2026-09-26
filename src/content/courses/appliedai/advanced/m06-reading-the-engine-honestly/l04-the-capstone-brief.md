# The capstone brief

{{panel:ae-trust-explorer}}

The Expert capstone grades 6 fields, and every one answers the Expert question: how far do two annotators agree, and how well calibrated is a set of probabilities, read term by term? Each field is a figure the engine returns, graded against the engine's own result on data you have not seen in this course.

| graded field | where it comes from |
| --- | --- |
| an unweighted kappa | two annotators' grades on the four-grade scale, labels stated in order |
| a linear-weighted kappa | the same grades, linear weights |
| a Brier score | a set of calibration rows, each a probability and an outcome |
| a reliability REL | the Murphy decomposition of the same rows, at a stated bin count |
| a resolution RES | the same decomposition |
| the within-bin covariance term WBC | the same decomposition, WBC as the paper labels it |

## What you are given

Two annotators' ratings on the grades 0 to 3, as two lists in the same item order, and a set of calibration rows, each a probability given to 2 decimals and an outcome of 0 or 1. The brief states every setting a field depends on: the labels and the weighting for each kappa, and the bin count and the edge rule for the calibration. None of the capstone's values appear anywhere in this course, and every figure in these lessons belongs to the Ekene documents.

## How to work it

Work each field in the trust explorer view that teaches it. For the two kappas, paste the two rating lists into "Cohen's kappa", type the labels in the order the brief gives, and read the kappa under none and then under linear weights. For the calibration fields, paste the outcomes and the probabilities into "The Murphy decomposition", set the bin count the brief states, and read the Brier score, REL, RES and WBC from the table. Check the closure before you copy anything: a closure near 1e-16 says the terms and the Brier score agree.

## What catches people

Reading the quadratic kappa where the linear one is asked for, or the unweighted one twice. Leaving the bin count at its default of 10 when the brief states another. Forgetting that a probability exactly on an interior edge opens the upper bin, so a table rebuilt by hand with the library's rule will not match. Halving WBC: WBC is the fifth term of Stephenson, Coelho and Jolliffe (2008) eq. 7, the within-bin covariance term, which is twice the pooled within-bin covariance, and the engine's figure is the one graded. Swapping the outcomes and probabilities boxes, which the engine usually refuses because a probability such as 0.35 is not 0 or 1.

## A rehearsal on the Ekene data

Every step can be rehearsed in the panel. The Ekene annotators on all 183 pairs, labels 0, 1, 2, 3: unweighted kappa 0.579841, linear kappa 0.675940. The Ekene calibration set at 10 bins: Brier score 0.168382, REL 0.080032, RES 0.064570, WBC 0.001669, closure -8.33e-17. If your panel work reproduces those, your method is the engine's.

## Exercise

Before you open the capstone, run all six rehearsal steps in the trust explorer and write each result beside the field it rehearses, with its settings. Then change the bin count to 5 and mark which of the six figures moved and which did not.
