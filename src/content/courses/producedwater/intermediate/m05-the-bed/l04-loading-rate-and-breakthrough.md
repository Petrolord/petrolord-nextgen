# Loading rate, and breakthrough

The bed area is not in the filter coefficient and it is not in the depth. It reaches the answer through one quantity only, the loading rate, and that makes this the cleanest input in the device to reason about.

{{panel:pw-device-explorer}}

## What the area does

Loading rate is the flow divided by the bed area, in m/hr: the velocity the water travels through the bed at.

| area m2 | loading m/hr | lambda per m | cut micron | warning |
| --- | --- | --- | --- | --- |
| 8 | 62.104412 | 2.618404314893 | 11.504808 | above the breakthrough loading |
| 12 | 41.402941 | 3.206877255895 | 10.395768 | above the breakthrough loading |
| 20 | 24.841765 | 4.140060735138 | 9.149437 | none |
| 40 | 12.420882 | 5.854930040680 | 7.693729 | none |
| 80 | 6.210441 | 8.280121470276 | 6.469629 | none |

A bigger bed at the same flow is a slower bed, water spends longer near the grains, and the filter coefficient rises. The area appears nowhere else in the calculation, so the whole effect of buying a wider vessel arrives through this one column.

## The declared rate the coefficient comes from

Lambda falls as the loading rate to the power 0.5, from a value DECLARED at 10 m/hr as part of a triple: 3.5 per m at a 20 micron droplet, 800 micron media and 10 m/hr. The triple is ONE calibration with no published source here.

Argue with a bed cut size by starting at the triple.

## Breakthrough

The module warns above 25 m/hr, where a bed loses depth capture and breaks through early. Breakthrough is the bed passing oil long before it is full, a real operating failure. The warning withholds nothing: the top two rows still carry a cut size, with a statement that a bed run that hard will not behave the way a clean depth filtration model expects.

## The floor at the other end

The module declares `filterMinLoadingMHr` at 1 and REFUSES below it, because the coefficient is declared at one rate and what a bed does far under it is held for literature.

A warning reports an answer and says something about it. A refusal reports no answer, names the input, and says why the method has nothing to offer.

## Where the floor actually falls on this bed

Where that floor falls depends on the bed's area. On the KOKORI flow, three beds that still answer:

| area m2 | loading m/hr | lambda per m | cut micron |
| --- | --- | --- | --- |
| 200 | 2.484176 | 13.092021574467 | 5.145107 |
| 400 | 1.242088 | 18.514914469492 | 4.326502 |
| 490 | 1.013950 | 20.492255142381 | 4.112471 |

A 600 m2 bed on this flow is refused, and the refusal names four things: the loading it was given, the floor it is under, the reference loading the coefficient is declared at, and the bed that would run this flow AT the floor, 496.835297 m2.

That figure is the edge of what the module will size here. The engine refuses a loading BELOW 1 m/hr and answers at 1 m/hr itself, so the area the refusal names, at full precision, still comes back with a cut size and any wider bed is refused. Being inside the method is a weak recommendation, though: the same refusal says that at the floor the declared law already claims 3.162 times the one coefficient there is any calibration for. Taking 496.835297 as a design area reads the edge of a method as a target.

## Exercise

Work out which way the cut size moves when a bed is made larger at constant flow, and name the single quantity that carries the change.

Then say what the module does at a loading of 62.104412 m/hr and what it does at a loading below 1 m/hr, and why those two responses are different. Finally, say what the 496.835297 m2 the refusal names marks on this flow, and why sitting at it is a weak basis for a design.
