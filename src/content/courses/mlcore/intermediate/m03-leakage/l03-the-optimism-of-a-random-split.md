# The optimism of a random split

{{panel:ml-validate-explorer}}

`leakageDemo` returns one number that sums up the comparison between the two splits. The engine calls it `optimism`: how much better the random-row test score looks than the group test score. For RMSE, where lower is better, it is

optimism = group test RMSE less random-row test RMSE

so a positive optimism means the random split flattered the model, and a negative one means the random split read worse. The sign is the engine's convention, and it matters: a figure quoted the other way round tells the opposite story.

## The table, with the attributes

Least squares on the nine sonic wells with GR, RHOB, NPHI and the four well-level attributes, test fraction 0.3, seeds 1 to 12, RMSE in us/ft:

| seed | random-row test RMSE | group test RMSE | optimism |
| --- | --- | --- | --- |
| 1 | 5.201187 | 5.902813 | 0.701626 |
| 2 | 4.925593 | 16.020627 | 11.095034 |
| 3 | 5.264627 | 7.995086 | 2.730459 |
| 4 | 5.107177 | 13.086835 | 7.979658 |
| 5 | 5.311723 | 16.999672 | 11.687949 |
| 6 | 5.262509 | 8.466595 | 3.204086 |
| 7 | 4.969623 | 10.923032 | 5.953408 |
| 8 | 4.570675 | 15.207603 | 10.636928 |
| 9 | 4.521297 | 9.661635 | 5.140337 |
| 10 | 4.441206 | 12.107460 | 7.666254 |
| 11 | 4.564491 | 6.337166 | 1.772675 |
| 12 | 4.299599 | 11.365950 | 7.066351 |

The optimism is positive on all 12 seeds. At seed 5, 16.999672 less 5.311723 is 11.687949 us/ft.

## Reading the size

The optimism is in the target's unit, us/ft, and it is the gap between two scores of the same model on two different test sets. It is not a correction to add to a random-row score. Across the 12 seeds the random-row column stays between 4.299599 and 5.311723, while the group column runs from 5.902813 at seed 1 to 16.999672 at seed 5, as the three held-out wells change. So the size of the optimism at any one seed depends on which wells were held out, and the sign across all 12 seeds is the evidence.

## Why the two test sets differ in size

At fraction 0.3 the random-row split holds out 81 of the 270 rows, and the group split holds out three whole wells, 90 rows. Both are the same fraction, rounded up by the engine's rule, ceil(testFraction x count), applied to rows in one case and to wells in the other. The comparison is still fair in the sense that matters: one model specification, one fraction, one seed, and the only difference is how the test rows were chosen.

## What the optimism is for

It is a diagnostic. A large positive optimism on every seed says the model has a path from a row's well to its prediction, and that a random-row score cannot be reported for new wells. It does not say what the path is; that comes from looking at the features, as the previous lesson did. And it does not say the group score is the whole truth either: it is one draw of wells, and cross-validation by wells is the fuller estimate.

## Exercise

Open the random-row against well split view with the seven default features and fraction 0.3. Run seeds 5, 8 and 11, and for each confirm the optimism tile against the table. Then compute the optimism at seed 2 by hand from the two RMSEs, and check your subtraction runs in the engine's direction. Finally write one sentence stating what a negative optimism would mean.
