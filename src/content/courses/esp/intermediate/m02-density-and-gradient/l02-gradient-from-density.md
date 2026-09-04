# Gradient from density

A gradient is a density in different clothes. The conversion is one division, and the whole design chain is downstream of it.

{{panel:pd-lift-explorer}}

## The conversion

`gradientFromDensity` divides a density in lbm/ft3 by 144, the square inches in a square foot. That is exact arithmetic with no fitted constant and no fluid assumption in it at all.

| Case | Density through the pump, lbm/ft3 | Design gradient, psi/ft |
| --- | --- | --- |
| gassyOffshore, published | 53.80104712 | 0.3736183828 |
| highWaterCut, published | 63.25602186 | 0.4392779296 |
| QUA-IBOE-4, teaching | 44.56935579 | 0.3095094152 |

## Which density goes in

The one the pump swallows. On the published golden design gassyOffshore the whole stream weighs 50.53658537 lbm/ft3 and the pumped fluid weighs 53.80104712 lbm/ft3, and running the stream density through the conversion instead gives a gradient 0.0226698733 psi/ft light. On the published golden design highWaterCut, with a separator efficiency of 0.0000, the two densities agree and the choice cannot be made wrongly.

## What the gradient is for

Total dynamic head is the pressure the pump must add divided by this gradient. A light gradient makes the same pressure look like more feet, and feet are what stages are counted in. On gassyOffshore the design gradient of 0.3736183828 psi/ft turns the pump's pressure rise into 4978.341767 ft of head.

That is the whole reason the intake calculation exists. Everything before this point is a route to one number in psi/ft. The teaching well IBENO-2, which is not a published case, reaches 0.4206373262 psi/ft by the same single division, and a short shallow stack is sized on it exactly as a deep one is.

## The mistake

Carrying the whole stream gradient forward on a well that has a separator. It is the friendly error in both directions at once: a lighter fluid gives more feet of head for the same pressure, and the gas that was vented is also missing from the rate, so a designer who mixes the two is sizing a pump for a stream that does not exist anywhere in the well.

## What it refuses

The conversion knows nothing about the fluid. Hand it a number and it divides. There is no check that the density came from intake conditions, no bound on what is physical, and no unit inference. A density in the wrong units converts as cleanly as a right one.

A gradient of zero is the one case that stops the chain, and it stops it quietly: total dynamic head returns NaN while still reporting the pressure difference, which on the module's own fixture is 2000.0 psi. The NaN then propagates into the stage count, which also returns NaN. Nothing raises a warning at the point the gradient went bad.

## Exercise

Divide each of the three pumped densities in this reading by 144 and check the gradients against the panel.

Then run gassyOffshore twice, once on 50.53658537 lbm/ft3 and once on 53.80104712 lbm/ft3, and record the gap between the two gradients.
