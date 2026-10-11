# The confusion matrix and a fluid hypothesis

`confusionMatrix` counts, for every labelled sample, its true facies against the facies the model predicts. Rows are the true facies and columns the predicted, in the order shale, oil sand, brine sand; the diagonal is what the model got right. One figure, the share correct, summarises the matrix, and on a heavily shale split it hides the row that matters.

## Impedance alone

The one-attribute model on AI (acoustic impedance, Vp x density), on its own samples, share correct 0.934872:

| true facies | shale | oil sand | brine sand |
| --- | --- | --- | --- |
| shale | 2469 | 45 | 5 |
| oil sand | 3 | 49 | 127 |
| brine sand | 0 | 26 | 439 |

Shale is called shale 2469 times out of 2519. Brine sand is called brine sand 439 times out of 465. The oil sand is the failure: 49 of its 179 samples are called oil sand and 127 are called brine sand. On AI alone most oil-sand samples are called brine sand, and the share correct still reads high, because shale fills most of the matrix.

## Impedance and Vp/Vs

The two-attribute model, share correct 0.973443:

| true facies | shale | oil sand | brine sand |
| --- | --- | --- | --- |
| shale | 2464 | 19 | 36 |
| oil sand | 0 | 160 | 19 |
| brine sand | 1 | 9 | 455 |

The oil-sand row changes most: 160 of its 179 samples are now called oil sand, and 19 brine sand. Brine sand improves to 455. Shale moves the other way, from 2469 correct to 2464, with more shale called brine sand. A second attribute is no free gain in every row, so the matrix is read row by row and quoted with its share correct.

## What the matrix is

Both matrices are measured on the samples each model was fitted to, at log scale. They show how well the classes separate in the chosen attributes; they are no blind test. A blind figure needs samples the model never saw, as the left-out wells gave the porosity transform, and the course prints no such test for the facies model. A study states which kind of matrix it quotes.

## A fluid hypothesis

A facies named for a fluid, oil sand or brine sand, is a hypothesis about the pore fluid. The labels came from a stated contact and the kit's logs. On a map, a point called oil sand is a point that resembles the labelled oil sand, and the fluid is the interpretation. QI Studio marks the difference in its output: a class named for a fluid is labelled fluid_hypothesis, and every other class calibrated_prediction. Shale, here, is a calibrated prediction of lithology; oil sand and brine sand are fluid hypotheses.

A report carries that label through to every map and table. The oil-sand probability is a probability under stated priors, labels and attributes that the seismic resembles oil-bearing sand, which is evidence for a prospect and no measurement of its fluid.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer's properties view, fit the Bayesian facies model on the Ekene pack logs on AI alone, with the cut-off at 0.350000, the contact at 5118.110236 ft and sample-proportion priors, and read the confusion matrix; check it against the first table. Add Vp/Vs and read the second. For each matrix, write the share of the oil-sand row that lands on its diagonal as a count out of 179, then switch to equal priors and record which row gains and which loses.
