# What geometry decides

Move one dimension at a time and the unit sorts itself into two kinds of number: the ones a length sets, and the ones the whole shape sets.

{{panel:pd-string-explorer}}

## The crank sets the stroke, almost proportionally

Everything else on the published unit held, the crank radius walked:

| Crank radius, in | Stroke, in | Upstroke fraction | Stroke over crank radius |
| --- | --- | --- | --- |
| 20.000 | 69.945046950 | 0.519444444 | 3.497252348 |
| 22.000 | 77.597628915 | 0.525000000 | 3.527164951 |
| 24.000 | 85.541277269 | 0.530555556 | 3.564219886 |
| 26.000 | 93.887872553 | 0.533333333 | 3.611072021 |
| 28.000 | 102.847938830 | 0.541666667 | 3.673140672 |
| 28.800 | 106.687716837 | 0.544444444 | 3.704434612 |
| 30.000 | 112.872291178 | 0.552777778 | 3.762409706 |
| 32.000 | 125.499172938 | 0.569444444 | 3.921849154 |

The last column drifts by more than a tenth of itself across that sweep, so a stroke scaled from one crank radius to another is wrong and wrong in a direction: bigger cranks give more stroke per inch of crank. At 34.000 in the sweep stops, because the pitman can no longer reach the beam.

## The front arm sets it exactly

Walk the front arm from 80.0000 in to 90.0000, 100.0000, 106.6667, 110.0000 and 120.0000 in and the stroke over the front arm reads 1.000197032783 at every single one, with an upstroke fraction of 0.544444444 at every single one too. The arm is a pure lever ratio. It changes the size of the motion and nothing about its shape or its timing.

## Timing is a property of the whole shape

The upstroke fraction moved only from 0.519444444 to 0.569444444 while the stroke nearly doubled, and it did not move at all under the front arm. It is not owned by any one length. The generic geometry makes the point plainly: it scales one fixed shape to any requested stroke, and it returns an upstroke fraction of 0.544444444 at 54.0, 74.0, 100.0, 120.0 and 144.0 in alike.

## The mistake

Reading a unit's API designation as its geometry. The designation carries ratings, not dimensions: C-320D-200-100 parses to a conventional unit with a gearbox rating of 320000 in-lb, a structural capacity of 20000 lb and a stroke of 100 in, and M-228D-173-86 to a Mark II at 228000 in-lb, 17300 lb and 86 in. Those three numbers are what a design is checked against. Not one of them is a front arm.

## What it refuses

The package ships no named unit dimensions at all, because real beam dimensions are manufacturer data and differ between makers for the same designation. What it offers instead announces itself: "Generic conventional geometry, scaled to the requested stroke. Not a manufacturer's unit; enter real dimensions for a real design."

## Exercise

Set the crank radius to 20.000, 24.000, 28.800 and 32.000 in and record the stroke over crank radius at each.

Then hold the crank and walk the front arm, and say in one sentence which of the two you would use to hit a target stroke.
