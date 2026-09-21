# The distance to a concentration

{{panel:cq-release}}

A plume answers one question directly: given a receptor, what concentration reaches it? Studies usually need the inverse. How far downwind does the plume stay above a concentration that matters, an alarm level, an exposure limit, a level at which people must shelter? `plumeDistanceToConcentration` answers that inverse, and it reports the answer as one of three states.

## The method, in the engine's words

The method string reads, verbatim: "root of the ground-reflected Gaussian plume centreline concentration, Briggs rural sigmas; bisection".

The engine evaluates the same reflected plume taught in module five, along the centreline at the receptor height, and searches for the distance at which it equals the target. Bisection brackets the root and halves the bracket until it closes. Because the search is on the centreline, the distance to a concentration is ALWAYS a centreline distance. A receptor to the side sees less, so the centreline distance is the furthest the target reaches.

## Three states

The engine reports one of three states:

- **REACHED.** The target is met, and the distance, or distances, are returned.
- **NOT_REACHED.** The peak concentration is below the target, so the plume never reaches it.
- **BEYOND_SEARCH_RANGE.** The plume is still above the target at the largest distance searched.

A result with no distance still says why there is none, and a number is never returned in place of a state.

The states matter because the distance is where a study draws its line on a plot plan. A null with NOT_REACHED means the whole plume stays below the target, which is a finding in its own right. A null with BEYOND_SEARCH_RANGE means the opposite: the plume is above the target at the edge of the search, and the zone is larger than anything the search covered. Reading the distance without the state would confuse the two.

## From a ground level release

UBIT, ground level release and receptor, classes D and F, three targets:

| class | target mg/m3, stated | state | near distance m | far distance m |
| --- | --- | --- | --- | --- |
| D | 500 | REACHED | null | 331.629944 |
| D | 100 | REACHED | null | 830.322126 |
| D | 20 | REACHED | null | 2265.987260 |
| F | 500 | REACHED | null | 943.433416 |
| F | 100 | REACHED | null | 2564.337939 |
| F | 20 | REACHED | null | 9384.252298 |

From the ground the concentration falls steadily with distance, so each target is met once, and the near distance is null. The stable class carries every target much further: 100 mg/m3 reaches 830.322126 m in class D and 2564.337939 m in class F.

The round trip checks the answer. Run the plume at the far distance and it returns the target: in class D, at 830.322126 m, the plume gives 100.000000 mg/m3.

## A target of zero

A target of zero would be met nowhere, since the plume only approaches it, so the engine refuses:

> targetConcentrationMgM3: must be a concentration above 0 mg/m3

The target is in mg/m3. A limit written in ppm needs converting first, with the molar mass and a stated temperature.

## Exercise

On the plume view, set the target to 100 mg/m3 in class D with the UBIT defaults and read the state and the far distance. Then run the plume itself at that distance and confirm it returns the target. Switch to class F and read the new distance. Write one sentence on why a night-time release carries the same target so much further, using the sigmas.
