# The band with no correlation

The engine leaves the laminar branch at a Reynolds number of 2100 and calls the flow turbulent at 4000. Between those two figures it labels the answer transitional and computes it on the turbulent branch.

{{panel:fc-liquid-explorer}}

## Walking across the lower boundary

| Reynolds number | f | regime |
| --- | --- | --- |
| 2099.0000 | 0.030490709862 | laminar |
| 2100.0000 | 0.048678586645 | transitional |
| 2500.0000 | 0.046053830366 | transitional |
| 3000.0000 | 0.043519188769 | transitional |
| 3999.0000 | 0.039909964901 | transitional |
| 4000.0000 | 0.039907014056 | turbulent |

One unit of Reynolds number separates the first two rows and the friction factor jumps between them. At the OGBIA relative roughness of 0.0002255356 the same step runs from 0.0304761905 to 0.0488545386, a jump of 60.303955 percent.

## The word and the arithmetic disagree

The lower value is reported as laminar and the upper as transitional, and the upper one is computed on the turbulent branch. So inside the band the label says transitional while the arithmetic is the turbulent law, and reading the label as a third correlation would be reading something that is not there.

The upper boundary behaves quite differently. From 3999.0000 to 4000.0000 the regime changes from transitional to turbulent and the friction factor agrees to four decimal places, because both rows were computed the same way and only the word changed.

## What the jump does to a loss

Raising the viscosity of the OGBIA crude from 40.000000 cp to 60.000000 cp moves the Reynolds number from 3026.9533 to 2017.9688, across the lower boundary, and the friction loss falls from 51.289913 psi to 37.305974 psi.

A thicker oil in the same pipe at the same rate came out cheaper. The two rows were computed on different branches, and the discontinuity between those branches is what produced it.

## How to read an answer in the band

Take the number as the turbulent law's opinion about a flow that is not reliably turbulent, and say so when quoting it. A design that depends on a friction factor between 2100 and 4000 is a design resting on the least settled part of this method, and the honest response is to report the regime alongside the value.

## Inside the band the numbers behave

The interior rows fall steadily, from 0.048678586645 at 2100.0000 to 0.046053830366 at 2500.0000 and 0.043519188769 at 3000.0000. Nothing about that sequence looks wrong, which is the difficulty: the values are smooth and the branch they came from was chosen for a different regime.

The published cases carry one of these. At a Reynolds number of 3000.0000 and a relative roughness of 0.002000 the engine returns 0.045288801703 and reports it transitional, and the oracle returns the same figure.

## The mistake

Interpolating across the boundary. The two branches are different laws and the engine steps from one to the other, so a value taken halfway between a laminar answer and a turbulent one corresponds to nothing the method computes.

## Exercise

Give the two Reynolds numbers that bound the band and say which branch the engine computes on inside it. Then give the size of the jump at the OGBIA relative roughness, and say what happens to the friction factor at the upper boundary.
