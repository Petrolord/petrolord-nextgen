# The surface decrement

The decrement is one number in the input list and it is the only one that moves every mandrel except the first.

{{panel:pd-valve-explorer}}

## What the decrement actually does

Each stage runs on a surface pressure of the kickoff pressure less the decrement times the number of valves already placed. On westTexasOil the kickoff is 1014.7 psia and the decrement is 25.00 psi per valve, so the stages read 1014.7000, 989.7000, 964.7000, 939.7000, 914.7000, 889.7000, 864.7000 and 839.7000 psia. That falling surface pressure is the mechanism that shuts the upper valves as the point of injection walks down, and it is also the reason the head available to each new mandrel shrinks.

## Valve 1 never moves

| Decrement, psi per valve | Valves | Stop reason | Valve 6 depth, ft | Multipointing stages |
| --- | --- | --- | --- | --- |
| 15.00 | 7 | targetDepth | 7356.086682982 | 2, 3, 4, 5, 6 |
| 20.00 | 7 | targetDepth | 7192.676806596 | 2, 3, 4, 5 |
| 25.00 | 8 | targetDepth | 7030.205599209 | 2, 3, 4 |
| 30.00 | 7 | minSpacing | 6868.665870065 | 2, 3 |
| 50.00 | 6 | minSpacing | 6231.668461708 | none |

Valve 1 reads 2119.249955500 ft in every row of that sweep, because it is set by the kickoff pressure and a full column of kill fluid and the decrement has not been applied yet.

## The move compounds downward

At 20.00 psi per valve the shifts against the published design run 12.954034679 ft at valve 2, then 37.279455211, 71.347168823, 113.572690006 and 162.471207387 ft at valve 6. At 50.00 psi per valve the shifts turn shallow and run -64.630249541 ft at valve 2 and -798.537137501 ft at valve 6. The same change is small at the top and large at the bottom in both directions, because each valve inherits the displacement of the one above it and adds its own.

## The mistake

Reading a decrement change as a local adjustment, and then quoting a depth from the old table. It is worse than a stale number, because the sweep is monotone and the wrong answer looks reasonable. It also decides things that are not depths: 15.00 psi per valve multipoints at five stages, 25.00 at three, and 50.00 at none, while the deepest mandrel drops from 7500.000000000 ft to 6231.668461708 ft. Buying a clean unloading with a bigger decrement is buying it with depth.

## What it refuses

The engine will not choose the decrement. It is a statement about how far the surface facility can bleed the casing between stages, and nothing in the module derives it, checks it against a compressor or warns that a design leaning on 15.00 psi per valve needs a control that fine.

## Exercise

Run westTexasOil at 20.00, 25.00 and 30.00 psi per valve and record valve 1, valve 6 and the stop reason for each.

Then say which of the three columns changes least between runs, and why that is the expected result rather than a coincidence.
