# The four capacities

Every number in a balanced plug calculation is a length multiplied by a capacity. Get the capacities right and the rest of the job is arithmetic.

{{panel:wi-pa-explorer}}

## Three the engine prints, one it hides

A capacity is a volume per metre of depth. The engine builds all of them from one area formula applied to a diameter, and it reports three of them.

| Capacity | Engine field | Published fixture, m3 per metre |
| --- | --- | --- |
| Full hole or casing bore | cHoleM2 | 0.036644 |
| Annulus, hole less stinger steel | cAnnM2 | 0.023976 |
| Stinger bore | cInM2 | 0.009263 |

The fourth capacity is the one that never appears in the output: the stinger's outside area, the space the steel itself occupies. You can see it only as a subtraction, because the annulus capacity is the hole capacity with that steel taken out. It is real and it matters, because the moment the stinger leaves the hole that space becomes available to the slurry.

## How each one enters

The hole capacity sizes the job. The design slurry volume is hole capacity times plug length times one plus the excess, and it is also what the settled plug is spread across at the end.

The annulus capacity and the inside capacity work as a pair, never alone. They add together to give the capacity the slurry occupies while the stinger is in the hole, and that sum is what the balanced height divides by.

The inside capacity does two more jobs on its own. It converts the spacer ahead into the spacer behind, and it converts a depth interval of empty stinger into the displacement volume you actually pump.

## The ratio worth memorising

On the published fixture the annulus and inside capacities together come to 0.9071 of the hole capacity. Less capacity for the same volume means a taller column, so the slurry stands taller with the stinger in the hole than the finished plug ever will. That single ratio drives everything in Module 2.

## Where the engine refuses you

Geometry that cannot exist is rejected outright rather than producing a plausible number. The stinger needs an ID greater than zero and less than its OD, and the OD has to clear the hole ID. A stinger as wide as the hole would give a zero or negative annulus capacity, and a divide by that would return a confident answer to an impossible job.

## Exercise

Read the three capacities off the panel and check that the annulus and bore capacities do not add up to the hole capacity. Say where the missing volume went.

Narrow the stinger ID and watch which outputs move and which do not.
