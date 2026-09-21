# The distance to a heat flux

{{panel:cq-fire}}

The last lesson went from a distance to a heat flux. A layout question usually runs the other way: at what distance does the heat flux fall to a stated level. The engine answers by searching along the ground for the distance where the solid flame heat flux meets the target, and it reports one of three states. This lesson reads the search, its answers and its one refusal.

## The search

The engine's method, verbatim: "bisection on the solid-flame heat flux (Fmax, fixed transmissivity) against distance from the pool centre". Bisection brackets the answer between a distance where the heat flux is above the target and one where it is below, then halves the bracket until the two meet. It assumes the heat flux falls steadily with distance over the range it searches.

## ERHA searched

ERHA as before: the stated heptane bund fire of 20 m, the heptane Babrauskas burning flux, a 4 m/s wind, the sooty surface emissive power and the STATED transmissivity of 0.8. Three target heat fluxes:

| target heat flux W/m2, stated | state | distance from centre m | distance from edge m |
| --- | --- | --- | --- |
| 35000 | NOT_REACHED | null | null |
| 12500 | REACHED | 36.451220 | 26.451220 |
| 5000 | REACHED | 53.796232 | 43.796232 |

## Three states

REACHED means the heat flux falls to the target within the search, and the engine returns the distance twice: from the pool centre and from the pool edge, which differ by the base radius D/2. The centre distance is what the view factor reads; the edge distance is often what a plot plan shows, measured from a bund wall. Quote the one the question asks for, and say which it is. NOT_REACHED means the heat flux never reaches the target even at the flame; the engine returns null distances with the largest heat flux it found, so you can see how far short it fell. BEYOND_SEARCH_RANGE means the heat flux still exceeds the target at the search limit. Each state is an answer, and a note quotes the state with the number.

## Why 35000 W/m2 is never reached

ERHA's surface emissive power is 52025.691247 W/m2, and the stated transmissivity is 0.8. The heat flux can never exceed the surface emissive power times the transmissivity, and the view factor of a ground target outside the flame holds it lower still. For this fire the heat flux never climbs to 35000 W/m2, and the engine reports the largest it found. A NOT_REACHED result is information: this fire, with these choices, cannot deliver that heat flux to a ground target anywhere downwind.

## A search needs a fixed transmissivity

The search refuses to run without a stated transmissivity, naming `transmissivity`:

> transmissivity: a fixed transmissivity in (0, 1] is required for a distance search

The reason is the Bagster band. As the search moves the target, the path through the air changes, and a transmissivity computed by Bagster at each step would walk out of the band where the fit may be used. A stated transmissivity keeps every step of the search on one defined basis, and it keeps the answer gradable.

## Exercise

In the fire panel's heat flux view, load ERHA with the stated transmissivity and search for 12500 and 5000 W/m2, confirming both rows. Then search for 35000 W/m2 and record the largest heat flux the panel reports. Finally clear the transmissivity, run the search once more and copy the refusal with its field.
