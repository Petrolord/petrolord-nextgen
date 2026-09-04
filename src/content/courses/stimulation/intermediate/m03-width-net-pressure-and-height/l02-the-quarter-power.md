# The quarter power

The single most useful fact in this module is an exponent, and the exponent is one quarter.

{{panel:st-frac-explorer}}

## Where it sits

Both width models are the same shape. Gather the treatment and the rock into one bracket, then raise the bracket to the power 0.25.

    PKN:  w_max = 2.31 [ qi mu xf / E' ]^(1/4)
    KGD:  w_max = 3.22 [ qi mu xf^2 / (E' hf) ]^(1/4)

Rate, viscosity and half-length all enter the bracket to the first power in PKN. Whatever the quarter power does to one of them, it does to all of them.

## What a quarter power does

It flattens everything. Sixteen times the input buys twice the output, because 16 to the power 0.25 is exactly 2.

You can see it in the model sweep, which varies half-length at fixed rate, viscosity, height and modulus.

| half-length, m | PKN average width, m | KGD average width, m |
|---|---|---|
| 40 | 0.002885917599896949 | 0.005403467152053133 |
| 100 | 0.0036288492654207656 | 0.008543631731195638 |
| 150 | 0.004015981871358954 | 0.0104637691458403 |
| 300 | 0.0047758342151420115 | 0.01479800423958849 |

From 40 m to 300 m the half-length rises by a factor of 7.5. The PKN width rises by 1.6548754598234365, which is 7.5 to the power 0.25 to every digit shown. KGD rises by 2.7386127875258306, which is 7.5 to the power 0.5, because xf enters the KGD bracket squared and the quarter power halves the exponent rather than quartering it.

The sweep is in half-length, but rate sits in the same bracket at the same first power, so the same rule governs it. Sixteen times the rate, everything else held, buys twice the width.

## What that means on a job

Width is not something you can pump your way into. Going from 0.053 m3/s to a rate no pump fleet on a normal location can deliver would still leave you short of double the width.

Viscosity behaves the same way, which is why crosslinked fluids widen fractures but never by the factor their viscosity ratio suggests.

The consolation is that the damping runs both ways. If your viscosity estimate is wrong by a factor of eight, your width is wrong by less than a factor of two. The quarter power forgives a bad fluid characterisation far more than it rewards a good one.

## Exercise

In the panel, raise the rate until the PKN average width doubles, and record the factor on rate you needed.

Then halve the viscosity and predict the new width before you read it. Finally, explain why the KGD width moves faster with half-length than the PKN width does.
