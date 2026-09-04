# Working the capstone

An order of operations, and three checks that catch almost every mistake.

{{panel:st-frac-explorer}}

## Work it in this order

The capstone runs on its own conditions, so nothing published in this tier is an answer to it. What carries over is the method.

First, the plane strain modulus. Compute it before anything else, because every width and every net pressure downstream contains it. The engine refuses a Poisson ratio outside the open interval from zero to one half and refuses a modulus that is not positive, and those refusals are the first thing to trip if a unit is wrong.

Second, choose the model and say why. Contained height with a half-length several times the height is the PKN case. A short fracture, with a half-length comparable to or less than the height and no strong confinement, is the KGD case. The reason belongs in the answer, because the choice is the engineering.

Third, compute both widths anyway. You need the other model to know what your choice was worth.

Fourth, take the net pressure from the model's own length scale. PKN divides the maximum width by twice the height. KGD divides it by four times the half-length. Mixing the two is the single most common error in this material, and it produces a number that looks reasonable.

Fifth, run the material balance on the average width, never on the maximum. The stored volume is two wings, times the height, times the average width.

Work in strict SI throughout. Metres, pascals, pascal seconds, cubic metres per second.

## The three checks

Disagreement. The two models must differ on average width by a large factor. In the digest sweep the ratio runs from 1.8723566993895047 at a half-length of 40 m to 3.0985171538556986 at 300 m. Two widths within a few percent of each other means the same expression was evaluated twice.

Volume. The injected volume must exceed the fracture volume, because leakoff only ever removes fluid. On the published case that is 209.09714590747427 m3 injected against 36.143836842230584 m3 stored.

Efficiency. It must lie strictly between zero and one. It reaches exactly one only when the leakoff coefficient is zero, as the sweep shows at a pump time of 681.9591857024639 s. An efficiency above one, or a negative one, means the balance was not solved.

## Exercise

Reproduce the published case in the panel, then write out the five steps above in order with the value each one produced.

Apply the three checks to your own work and record the result of each.
