# The cycle against the well

Faster cycling is the obvious answer to a plunger that cannot keep up. On the teaching well OGUTA-2 it is not enough, and the sweep says by how much.

{{panel:pd-remedy-explorer}}

## Where the cycle time goes

The cycle on OGUTA-2 is 89.90356589 min: a rise of 10.93333333 min at 750.0 ft/min, a fall of 8.97023256 min under 1000.0 ft/min in gas and 172.0 ft/min in liquid, 30.0 min of afterflow and 40.0 min of shut-in. That gives 16.01716223 trips a day and 14.83375148 bbl/d against a well liquid make of 194.91525424 bbl/d.

Only two of those four terms are open to an operator. The rise and the fall are set by velocities the module states as typical inputs, so the whole of the available saving is the 30.0 min of afterflow and the 40.0 min of shut-in.

## Spend all of it

Remove the afterflow entirely and walk the shut-in down to nothing.

| Shut-in, min | Cycle, min | Trips per day | Liquid per day, bbl/d | Well make over cycle |
| --- | --- | --- | --- | --- |
| 40.0 | 59.90356589 | 24.03863574 | 22.26256708 | 8.75529105 |
| 30.0 | 49.90356589 | 28.85565338 | 26.72368457 | 7.29372680 |
| 20.0 | 39.90356589 | 36.08700044 | 33.42075135 | 5.83216254 |
| 10.0 | 29.90356589 | 48.15479215 | 44.59692729 | 4.37059829 |
| 5.0 | 24.90356589 | 57.82304455 | 53.55085130 | 3.63981617 |
| 2.0 | 21.90356589 | 65.74272003 | 60.88539010 | 3.20134689 |
| 0.0 | 19.90356589 | 72.34884482 | 67.00342849 | 2.90903404 |

The zero row is not an installation anybody would run: no shut-in and no afterflow at all, a trip every 19.90356589 min. It still carries 67.00342849 bbl/d against 194.91525424 bbl/d, so the well makes 2.90903404 times what the cycle can lift. The gap is a slug size and a well, not a timing setting.

## The only timing check there is

`screenPlungerLift` has one warning about the cycle and it fires on trips a day. Give OGUTA-2 a 1500.0 min shut-in and the cycle becomes 1549.90356589 min at 0.92909006 trips a day, and the screen raises insufficientGas and slowCycle: "At 1549.9 minutes a cycle this well would make fewer than one trip a day. Check the shut-in and afterflow times."

That warning counts trips. It does not count barrels, and no warning anywhere in the module does. Note also which warnings that case carries: insufficientGas is still there, because the gas check and the timing check are independent and neither of them is looking at liquid.

## What a careful person gets wrong

The mistake is treating the liquid shortfall as a tuning problem, because the cycle time is the field-adjustable thing and the sweep obediently improves when you shorten it. The ratio falls from 8.75529105 to 2.90903404 across the whole sweep and never reaches one. Reading only the direction of that movement, and not the value it stops at, is how a shortfall of that size gets promised away in a design review.

## Exercise

Take the sweep and name the shortest cycle the module will produce for this well and the liquid it carries.

Then state what would have to change, other than timing, for the ratio to reach one, and why the slowCycle warning would not have told you.
