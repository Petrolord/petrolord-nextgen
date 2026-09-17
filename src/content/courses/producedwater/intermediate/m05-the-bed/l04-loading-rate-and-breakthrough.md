# Loading rate, and breakthrough

The bed area is not in the filter coefficient and it is not in the depth. It reaches the answer through one quantity only, the loading rate, and that makes this the cleanest input in the device to reason about.

{{panel:pw-device-explorer}}

## What the area does

Loading rate is the flow divided by the bed area, expressed here in m/hr. It is the velocity the water travels through the bed at, and it is the only route by which the area of a bed reaches its cut size.

| area m2 | loading m/hr | lambda per m | cut micron | warning |
| --- | --- | --- | --- | --- |
| 8 | 62.104412 | 2.618404314893 | 11.504808 | above the breakthrough loading |
| 12 | 41.402941 | 3.206877255895 | 10.395768 | above the breakthrough loading |
| 20 | 24.841765 | 4.140060735138 | 9.149437 | none |
| 40 | 12.420882 | 5.854930040680 | 7.693729 | none |
| 80 | 6.210441 | 8.280121470276 | 6.469629 | none |

A bigger bed at the same flow is a slower bed, water spends longer near the grains, and the filter coefficient rises. Notice that the bed area never appears anywhere else in the calculation. It is not in the exponential, it is not in the depth and it is not in the grain term, so the whole effect of buying a wider vessel arrives through this one column.

## The declared rate the coefficient comes from

Lambda falls as the loading rate to the power 0.5, from a value DECLARED at 10 m/hr. That reference is part of a triple: 3.5 per m at a 20 micron droplet, 800 micron media and 10 m/hr. The triple is ONE calibration of this module and it has no published source here.

Everything in the loading column is that declared value scaled to a different rate. A reader arguing with a bed cut size should start with the triple rather than with the arithmetic.

## Breakthrough

The module warns above 25 m/hr because a bed loses depth capture at that rate and breaks through early. Breakthrough is the bed passing oil before it is anywhere near full, and it is a real operating failure rather than a modelling nicety.

The warning withholds nothing. The top two rows of the table still carry a cut size, and the module still reports it. What it says is that a bed run that hard will not behave the way a clean depth filtration model expects.

## The floor at the other end

There is a limit underneath as well. The module declares `filterMinLoadingMHr` at 1 and REFUSES below it, because the coefficient is declared at one rate and what a bed does far under its design rate is held for literature.

That is a different act from the warning above. A warning reports an answer and says something about it. A refusal reports no answer at all, names the input, and says why the method has nothing to offer there.

## Exercise

Work out which way the cut size moves when a bed is made larger at constant flow, and name the single quantity that carries the change.

Then say what the module does at a loading of 62.104412 m/hr and what it does at a loading below 1 m/hr, and why those two responses are different.
