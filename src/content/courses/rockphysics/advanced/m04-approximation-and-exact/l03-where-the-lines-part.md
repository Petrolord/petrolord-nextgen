# Where the lines part

The panel draws the approximation and the exact solution together for both cases. This lesson reads that gap.

## The gap at the graded angle

The capstone asks for the exact Zoeppritz value at 30 degrees for the gas case:

$$R_{exact}(30) = -0.12239091302671612$$

The three term Shuey value there is $-0.12456555923100084$.

The difference is $0.0021746462042847164$.

## Why the capstone asks for the exact one

Because the difference is larger than the tolerance on the approximated fields.

The graded intercepts and gradients carry a tolerance of 0.001. The gap between Shuey and exact at 30 degrees is 2.17 times that.

So a capstone that asked for the Shuey value at 30 degrees and graded it to 0.001 would be treating a difference it considers significant elsewhere as though it were noise. Asking for the exact value avoids that, and it makes a point: the approximation and the exact solution are distinguishable at the precision this tier works to.

## The gap across the range

| angle | gas gap | brine gap |
| --- | --- | --- |
| 0 | +0.000166 | -0.000113 |
| 10 | -0.000375 | -0.000141 |
| 20 | -0.001571 | -0.000251 |
| 30 | -0.002175 | -0.000974 |
| 40 | -0.000246 | -0.005972 |

Two features stand out and both are worth explaining.

The gas gap is not monotonic. It grows to 30 degrees and then shrinks again, ending at 40 degrees smaller than it was at 20. The three term Shuey form happens to bend back toward the exact curve at wide angle for this contrast, which is luck rather than design.

The brine gap does the opposite: it is tiny out to 30 degrees and then grows sharply. The largest error over the whole range is 0.005972 for the brine case against 0.002192 for the gas case, which is the next lesson's subject.

## What the gap is made of

Shuey's derivation linearises in the fractional contrasts. Its error is therefore of second order in those contrasts, which means it grows roughly as the square of how different the two rocks are.

At Ekene the brine sand differs from the shale by 16.7 percent in compressional velocity and the gas sand by 5.9 percent. Squaring those gives a ratio of about 8, which is the right order for the observed difference in error, and it is the mechanism the next lesson names.

## Reading it off the panel

The solid and dashed lines of the same colour are the exact and approximate curves for one case.

{{panel:rp-avo-explorer}}

At 25 Hz with the default threshold, look at the amber pair first. They are close everywhere and are furthest apart around 30 degrees, and they converge again by 40.

Now look at the blue pair. They are nearly on top of each other out to about 25 degrees and then separate visibly, with the dashed line falling below the solid one.

The two error tiles read those two maxima directly: 0.002192 and 0.005972.

## Worked example

Put the errors in perspective by comparing them against the quantities they perturb.

The gas intercept is -0.0628. The largest approximation error on the gas curve is 0.002192, which is 3.5 percent of it.

The brine intercept is 0.0343. The largest error on the brine curve is 0.005972, which is 17.4 percent of it.

Neither is negligible, and the second is large. A brine case modelled with Shuey and compared against data at wide offsets carries a 17 percent systematic error relative to its own intercept, which is easily enough to explain a mismatch that would otherwise be blamed on the rocks.

## Exercise

State why the approximation error is worth quoting relative to the intercept rather than as an absolute number.

Self check: because reflection coefficients are small and their absolute size varies a great deal between interfaces, an absolute error of 0.006 is negligible against a strong reflection and large against a weak one. At Ekene the same order of absolute error is 3.5 percent of the gas intercept and 17.4 percent of the brine intercept, and only the relative form makes the difference visible.
