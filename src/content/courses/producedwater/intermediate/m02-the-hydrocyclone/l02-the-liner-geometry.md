# The liner geometry, and the travel a droplet makes

To be captured, a droplet has to reach the oil core before the water carries it out of the liner. That is a distance problem before it is a velocity problem, and the distance is set by two choices the module states.

{{panel:pw-device-explorer}}

## Where the median droplet starts

Water entering a liner is spread across the whole cross section, so droplets do not all start at the same radius. This module spreads them BY AREA, which is the only honest way to do it: equal areas of the inlet carry equal volumes of water, so equal areas carry equal volumes of oil.

Spread that way, the droplet in the middle of the distribution enters at the HALF AREA RADIUS, the radius inside which half of the flow area sits. That is a fraction of the bore radius equal to one over the square root of two. It is a criterion rather than a constant: it is where the median droplet is, by construction, and the module never stores it as a chosen number.

## Where the oil core is taken to sit

The other end of the travel is the core. This module places it at 0.5 of the liner radius, declared as `coreRadiusFraction`, and the travel is the gap between the two radii. On the 0.035 m bore that gap is 0.003624368671 m.

The core position is a DECLARED choice and it is worth a great deal:

| core radius fraction | travel m | cut micron |
| --- | --- | --- |
| 0.2 | 0.008874368671 | 6.933042 |
| 0.35 | 0.006249368671 | 5.817992 |
| 0.5 | 0.003624368671 | 4.430689 |
| 0.65 | 0.000999368671 | 2.326580 |

A reader who moves that input is moving a modelling assumption about where oil accumulates in a spinning tube, and the module has no published source for it. Read the travel column beside the cut column and the shape of the device becomes clear: the whole answer turns on a gap of a few millimetres, so a small change at either end of it is a large change in what the liner catches.

## The refusal that is a criterion

Push the core outward far enough and the model stops being able to answer. The module refuses in its own words:

a core at 0.75 of the radius: REFUSED: the oil core must sit inside the half-area radius for the median droplet to have anything to cross, so its radius fraction lies between 0 and 0.7071, and this is 0.75

That is a real criterion rather than a range check somebody chose. Past the half area radius the median droplet STARTS inside the core, so there is no gap for it to cross and the question the model answers has stopped making sense. A range check would have quoted a limit. This one quotes a reason, and the reason is the same geometry the cut size comes from.

## Exercise

In the panel, move the core radius fraction from 0.5 to 0.35 and read the travel and the cut size at each setting.

Then say why the refusal above is stated at the half area radius rather than at the liner wall.
