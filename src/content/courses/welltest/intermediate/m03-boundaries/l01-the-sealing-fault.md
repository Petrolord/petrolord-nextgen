# The sealing fault

The first thing the reservoir does when the disturbance runs into something.

{{panel:wt-diagnostic-explorer}}

## The picture

A well produces in a reservoir that has a sealing fault 800 ft away. For a while the disturbance spreads freely and the well behaves as though the reservoir were infinite. Then the disturbance reaches the fault.

Nothing crosses the fault. Fluid that would have come from beyond it does not, and the well has to draw everything from the side it is on. The pressure has to fall faster to keep the rate up.

## The image well

The mathematics is the same superposition trick as a buildup, in space rather than time.

A no-flow boundary is exactly equivalent to an identical well producing at the same rate, placed as a mirror image on the other side of the fault. The two wells' pressure fields add, and by symmetry no flow crosses the plane halfway between them, which is the fault.

So a well with a sealing fault at distance L behaves like two wells 2L apart in an infinite reservoir.

The engine implements this directly: the fault model's dimensionless group is `ld = L / rw`, the fault distance in wellbore radii, and the Laplace-space solution adds the image well's contribution at that separation.

## What it does to the derivative

Before the image well is felt, one well is producing and the derivative sits at the radial plateau.

After it is fully felt, two wells are producing and the pressure drop is twice what one well would give, so the derivative sits at twice the plateau.

Between the two, the derivative climbs. That climb, from one plateau to a plateau twice as high, is the signature of a single sealing fault and it is the most useful boundary diagnostic there is.

## The doubling is asymptotic

Here is what the textbook figure does not show. The climb does not finish.

On the fault fixture, which runs for a thousand hours with a fault only 800 ft away, the derivative averages 9.906923653538167 psi over the early radial stretch and 17.483282190120867 psi over the late one. The ratio is 1.7647539035871014, not 2.

The image well's contribution approaches the producer's only in the limit, because the image is at a distance and the logarithmic response at a distance takes a long time to catch up. A thousand hours of production against a fault 800 ft away has still not completed the doubling.

Any real test has the same problem, worse. Reading a fault distance off the time at which the doubling "completes" is reading off an event that does not occur.

## What the distance actually comes from

Two routes, and neither is the doubling time.

The classical one uses the intersection of the two semilog straight lines: the early radial line and the late doubled-slope line cross at a time from which the distance follows. It works, and it needs both lines to be well established, which is a strong requirement.

The modern one is to fit the model, which uses the whole shape of the climb rather than any single feature of it. That is the Expert tier's method, and on this fixture it recovers the planted 800 ft to within one percent.

## Two faults, and other boundaries

A single fault doubles the derivative. Two parallel faults, a channel, eventually produce linear flow and a half slope, because once the disturbance fills the channel width the flow is one-dimensional along it.

Two intersecting faults at an angle multiply the derivative by 360 divided by the angle: a right-angle corner gives a factor of four.

A closed reservoir, where every direction is bounded, gives a unit slope at late time. That is the fourth lesson in this module.

A constant-pressure boundary does the opposite of a fault: the derivative falls away steeply as the boundary supplies fluid the well would otherwise have to draw from storage.

## The misconception to avoid

"The derivative doubles, so a fault has been reached." A derivative that has risen by a factor of about 1.76 in a thousand hours is consistent with a single sealing fault that has not finished being felt. It is also consistent with several other things: a permeability that decreases outward, a fluid contact, or the beginning of a closed system. The doubling is a hypothesis that the model fit then tests, and this module's remaining lessons are about what happens if you skip that step.

## Exercise

Open the panel on the sealing-fault fixture and read the derivative at 1 hour, at 10 hours, at 100 hours and at 1000 hours.

Compute the ratio of each to the first. Then say, from the trend, roughly how long the test would have to run for the ratio to reach 1.9, and comment on whether that test would ever be run.
