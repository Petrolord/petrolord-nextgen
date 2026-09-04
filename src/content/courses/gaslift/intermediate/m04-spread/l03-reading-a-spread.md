# Reading a spread

A spread column is read against the drop per stage at the same depth, and down a string the two run at each other.

{{panel:pd-valve-explorer}}

## The spread falls

| deepHighPressure valve | Injection at depth, psia | Production at depth, psia | Spread, psi |
| --- | --- | --- | --- |
| 1 | 1517.796497793 | 527.443159448 | 39.204722432 |
| 2 | 1545.877187269 | 753.867326137 | 31.352978343 |
| 3 | 1552.882760861 | 927.631030496 | 24.751590761 |
| 4 | 1543.360806066 | 1057.406176621 | 19.237292009 |
| 5 | 1520.931589905 | 1150.652275787 | 14.658099458 |
| 6 | 1488.502397616 | 1213.736305005 | 10.877055670 |

R is the same 0.039586601 on every row. The injection side rises, turns over and comes back down, because each valve sits a stage lower in surface pressure than the one above it and the added depth stops paying for the 40.00 psi per valve it is charged. The production side climbs steadily on the unloading gradient. The gap closes from both ends.

## The drop climbs

On midDecrementKnifeEdge the drop at depth, measured from each valve's own opening stage to the stage after it, runs 28.652797457, 30.078345259, 31.219546623, 32.122462454, 32.824113062 and 33.355029522 psi. The spreads it meets run 55.525309973, 46.733519484, 39.016557082, 32.272254090, 26.401432257 and 21.310451869 psi.

One column climbs slowly and the other falls fast. They cross between valve 4 and valve 5, and the crossing is visible in the warnings: stages 2, 3, 4 and 5 report multipointing and stages 6 and 7 are clean.

## What that shape means

Multipointing risk lives at the top of a string, where the spread is widest, and it runs out with depth. The deep valves carry the opposite exposure: a narrow interval, closed hard by the operating pressure and easily reopened by a casing excursion. Reading only the top of a spread column tells you about one failure mode, reading only the bottom tells you about the other, and reading a single row tells you about neither.

## The mistake

Comparing spreads between two strings. deepHighPressure opens at 39.204722432 psi and midDecrementKnifeEdge at 55.525309973 psi, and the second string is not the safer one: it is the one that multipoints, at four stages, because its drops are smaller too. Both numbers of the pair travel together or neither of them means anything.

## What it refuses

The spread printed on a stage row is the design condition value repeated. It is a fixed budget. What actually moves stage to stage is the acting pressure at the valve, and that is what the margin carries, so a stage table with a constant spread column is not evidence that the valve is unchanged.

## Exercise

Write the spread column and the first post opening drop for every charged valve of midDecrementKnifeEdge, side by side.

Then name the valve where the two columns cross, and check it against the list of stages that raise a multipointing warning.
