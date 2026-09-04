# The convention that stays exact

There is a way to hold both conversions at once and lose nothing. It is not a correction, it is a rule about where the specific gravity comes from.

{{panel:pd-lift-explorer}}

## The rule

Compute the design gradient from the pumped mixture density, then define the specific gravity as that gradient divided by 0.433000. Multiplying it back by 0.433000 returns the design gradient identically, so the design chain and the diagnostics chain read the same head from the same pressures.

| Case | True SG, density over 62.4 | Laundered SG, gradient over 0.433 | Gap between the routes, ft |
| --- | --- | --- | --- |
| gassyOffshore, published | 0.8621962680 | 0.8628600064 | 0.000000000000 |
| highWaterCut, published | 1.0137182991 | 1.0144986827 | 0.000000000000 |
| QUA-IBOE-4, teaching | 0.7142524966 | 0.7148023446 | 0.000000000000 |
| IBENO-2, teaching | 0.9707015220 | 0.9714487903 | 0.000000000000 |

Those zeros are exact, not small. The disagreement between 0.433333333333 and 0.433000 has not been reduced. It has been kept out of the one place it could show up.

## It is already the number in use

The laundered value is not an exercise. It is what the sizing is handed: the published golden design gassyOffshore is sized on a specific gravity of 0.8628600064 and the published golden design highWaterCut on 1.0144986827, and those are the values the goldens were cut on. A designer who recomputes the specific gravity as density divided by 62.4 to be more careful is the one who breaks the agreement.

## What the convention costs

It is not free, and pretending otherwise is dishonest. The laundered specific gravity is 0.8628600064 where the physically true value is 0.8621962680, so the number carried through the design is 0.076982 percent off the fluid. Everything built on it is consistent with everything else built on it, which is what a convention buys, and the residual bias is uniform.

## The mistake

Fixing half a chain. Deriving a true specific gravity and passing it to the diagnostics while the design gradient still comes from the division by 144 produces two heads for one well: on gassyOffshore, 4978.341767 ft and 4982.174209 ft, a gap of 3.832442 ft. On the teaching well IBENO-2, which is not a published case, the same mistake is worth 0.558191 ft, because the gap is a percentage of a much shorter head.

## What it refuses

The module will not detect an inconsistent specific gravity. There is no cross check between the gradient it was given and the specific gravity it was given, and no warning exists for the case. The convention is enforced by the caller and by the gates, never by the arithmetic.

## Exercise

For all four cases, divide the design gradient by 0.433 and confirm you recover the laundered specific gravity the panel reports.

Then compute the true specific gravity for one of them and say, in feet, what handing that value to the diagnostics would cost.
