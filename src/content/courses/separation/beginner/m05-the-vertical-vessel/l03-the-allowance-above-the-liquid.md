# The allowance above the liquid

A vertical vessel is the liquid depth plus a fixed allowance for everything above it. On ABANA-1 that allowance is 6.000000 ft, which takes a liquid depth of 10.605223 ft to a vessel 16.605223 ft tall.

{{panel:fc-separator-explorer}}

## What the allowance is paying for

The space above the liquid is not empty. It holds the inlet device, the disengagement height where the gas spreads out and slows down, the mist extractor and its support, and the clearance between the liquid surface and the bottom of that mist extractor. A drop knocked out of the gas has to have somewhere to fall that is not straight back into the flow.

It also holds the level instrument's working range, because the liquid surface is a controlled variable rather than a fixed line.

## It is an input, and it is flat

The allowance does not scale with anything. It is a single figure added to the liquid depth, and the engine takes it as given: 6.000000 ft on ABANA-1, and 6.000000 and 7.000000 ft on the two published vertical cases.

| case | liquid ft | allowance ft | height ft |
| --- | --- | --- | --- |
| vertical12ft3sGasSized | 2.485623 | 6.000000 | 8.485623 |
| vertical30ft3sGasSized | 2.495370 | 7.000000 | 9.495370 |
| ABANA-1 at 2.052551 ft | 10.605223 | 6.000000 | 16.605223 |

The two published cases hold almost identical liquid depths, 2.485623 and 2.495370 ft, and finish a foot apart at 8.485623 and 9.495370 ft, entirely because their allowances differ. On a short vessel the allowance is most of the height.

## Where it dominates and where it disappears

On vertical12ft3sGasSized the 6.000000 ft allowance is more than twice the liquid depth. On ABANA-1 at the gas-required diameter the same 6.000000 ft sits under a liquid column of 10.605223 ft and is the smaller half.

So the same number means quite different things on different vessels, and a designer widening a drum to shorten it runs into the allowance as a floor. A vessel cannot be shortened below its allowance however wide it gets, because the liquid depth tends to zero and the allowance does not.

## What the method does not check

Nothing tests the allowance against the diameter. A tall narrow vessel and a short wide one receive the same 6.000000 ft, though the gas has a very different distance to travel across them. The allowance is a convention supplied by the user, and this method takes it at face value.

## The mistake

Leaving a standard allowance in place while making a large change to the diameter. The figure was chosen for a particular arrangement of inlet and internals, and a vessel that has doubled in width has a different disengagement problem from the one the allowance was written for.

## Exercise

Take the ABANA-1 liquid depth to a vessel height using the allowance. Then say what the space above the liquid is holding, and explain why the two published cases finish at 8.485623 and 9.495370 ft despite liquid depths within a hundredth of a foot of each other.
