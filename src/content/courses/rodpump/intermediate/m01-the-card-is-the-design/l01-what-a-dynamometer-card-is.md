# What a dynamometer card is

A card is a closed loop of load against position over one settled stroke, and in this engine it is computed and not measured.

{{panel:pd-card-explorer}}

## The loop is a prediction

`predictCard` marches the damped wave equation down a rod string and back, and the card is what that march draws at the surface: polished rod load against polished rod position, one point per surviving step, closed on itself once the cycle repeats. Nothing on it was recorded at a well. The plunger stroke, the two loads and the horsepower are readings taken off that computed curve afterwards.

The package holds a second solver, `diagnoseCard`, which propagates Fourier harmonics of a card that was measured. The two share no code path. Treating a predicted card as an observation quietly merges them.

## One loop, in numbers

The teaching well ODUMA-4, a three-way taper of 1 in rods over 7/8 over 3/4, marches 6110 steps in a cycle and returns 186 card points at a stride of 33.

| Point of 186 | Cycle fraction | Position, in | Load, lb |
| --- | --- | --- | --- |
| 15 | 0.075614 | -7.971015582 | 14906.739434298 |
| 22 | 0.113421 | -16.961503810 | 17380.901803107 |
| 29 | 0.151227 | -27.960212851 | 19545.877783339 |
| 36 | 0.189034 | -39.726669456 | 15375.724844921 |

The highest load on the returned card is that 19545.877783339 lb at point 29. The lowest is 2625.472705679 lb at point 134, cycle fraction 0.718331, at a position of -68.394081411 in.

## The pump card is the same march at the other end

Away from the valve transfers the pump load takes exactly two values on ODUMA-4: 4690.299657039 lb while it lifts, and 0 lb while it falls. The two vertical sides of the parallelogram are the transfers, where the plunger is held still and the rod above it stretches or relaxes.

The pump card encloses 413225.894771 in-lb per cycle against a surface card area of 750654.615621 in-lb per cycle. The surface loop is larger by 337428.720850 in-lb per cycle, and that is the work the rods and the damping absorb between the two ends.

## What the card will not do

It will not be drawn without damping. A damping ratio of 0 is refused outright, with the message that with no damping the string never settles into a repeating stroke and that field strings sit between about 0.05 and 0.15 of critical. A measured card carrying fewer than sixteen samples is refused too.

Nor will a card be produced at or above the string's own note. ODUMA-4 has a fundamental of 59.134268421585 spm and runs at 10 spm, a ratio of 0.169106683.

## Exercise

In the panel, read the load at cycle fractions 0.075614, 0.151227 and 0.718331 on ODUMA-4 and write the three positions that go with them.

Then state the surface and pump card areas and say in one sentence what the 337428.720850 in-lb per cycle between them paid for.
