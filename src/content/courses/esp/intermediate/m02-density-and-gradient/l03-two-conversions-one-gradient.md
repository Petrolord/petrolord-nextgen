# Two conversions, one gradient

The module carries the same conversion twice, in two forms that do not agree. This was found, examined and deliberately left alone, and the reason it was left alone is the lesson.

{{panel:pd-lift-explorer}}

## The two forms

`gradientFromDensity` divides density by 144, which makes its implied constant 62.4 divided by 144, or 0.433333333333 psi/ft per unit specific gravity. The module also exports `PSI_PER_FT_SG`, the rounded field constant 0.433000. They differ by 0.000333333333 psi/ft per SG, which is 0.076982 percent.

The rounding is not confined to one constant. `HP_HEAD_DIVISOR` is 135635.80083124, built from the exact form, and multiplying it by 62.4 divided by 144 gives 58775.513694 against the familiar rounded 58824, a relative deviation of 0.0008242606.

## Where the two forms meet

The design chain takes its gradient from the density. `diagnoseOperation` builds its gradient the other way, as 0.433000 times a specific gravity. Hand one well a specific gravity computed as density divided by 62.4 and the two routes read different heads from the same pressures.

| Case | True SG | Head on the design gradient, ft | Head on the true SG route, ft | Gap, ft |
| --- | --- | --- | --- | --- |
| gassyOffshore, published | 0.8621962680 | 4978.341767 | 4982.174209 | 3.832442 |
| highWaterCut, published | 1.0137182991 | 3797.140461 | 3800.063587 | 2.923126 |
| QUA-IBOE-4, teaching | 0.7142524966 | 4032.187516 | 4035.291586 | 3.104070 |
| IBENO-2, teaching | 0.9707015220 | 725.090193 | 725.648384 | 0.558191 |

Every gap in that column is 0.076982 percent of its head. The constant disagreement is fixed; what it is worth in feet is not, because it scales with the head.

## The adjudication

The engines review of this wave examined five findings and changed exactly one, and this was not the one. The reason is that both the goldens and the live application derive the specific gravity from the design gradient, so on every case that ships, the two routes never actually meet. The disagreement is reachable only by computing a specific gravity some other way and handing it to the diagnostics.

Editing 144 or editing 0.433000 would move a number somebody is looking at today in a live application, and it would move it to fix a case that no shipped consumer produces. So it was recorded, named as a convention, and left.

## What that teaches

Knowing which defects you are allowed to fix is part of the job. A finding can be real, reproducible, priced in feet on four cases, and still be the wrong thing to change. The professional output here is a stated convention and a test that it holds, not a patch.

## What it refuses

Neither conversion refuses anything. No warning fires when the two routes are mixed. The design chain returns its head, the diagnostics return theirs, each is internally consistent, and the 3.832442 ft on gassyOffshore arrives silently and small enough to read as rounding.

## Exercise

Compute the true specific gravity for gassyOffshore, highWaterCut and QUA-IBOE-4 as the pumped density divided by 62.4, then check all four heads and gaps in the panel.

Then say what the gap would be on a well whose head requirement is twice gassyOffshore's, and what stays constant.
