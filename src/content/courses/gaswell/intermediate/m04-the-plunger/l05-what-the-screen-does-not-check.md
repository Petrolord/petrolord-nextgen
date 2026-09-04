# What the screen does not check

`liquidPerDayBbl` is computed, returned, and compared to nothing.

{{panel:pd-profile-explorer}}

## The comparison the screen already has the parts for

On OGUTA-2 the cycle carries 0.9261160790 bbl a trip at 16.01716223 trips a day, so `liquidPerDayBbl` reads 14.83375148 bbl/d.

The well makes 1150.0 Mscf/d at 5900.0 scf/bbl, which is 194.91525424 bbl/d of liquid. The well makes 13.13998380 times what the cycle carries, a shortfall of 180.08150275 bbl/d.

`feasible` is built from `pressureOk = true` and `glrOk = false` and nothing else. The liquid comparison is not in it, is not in a warning, and is not anywhere in the returned object.

## Cycling harder does not close it

Every row drops the afterflow and shortens the shut-in, which is the whole of the operator's freedom on cycle count.

| Shut-in, min | Cycle, min | Carried, bbl/d | Well over cycle |
| --- | --- | --- | --- |
| 40.0 | 59.90356589 | 22.26256708 | 8.75529105 |
| 30.0 | 49.90356589 | 26.72368457 | 7.29372680 |
| 20.0 | 39.90356589 | 33.42075135 | 5.83216254 |
| 10.0 | 29.90356589 | 44.59692729 | 4.37059829 |
| 5.0 | 24.90356589 | 53.55085130 | 3.63981617 |
| 2.0 | 21.90356589 | 60.88539010 | 3.20134689 |
| 0.0 | 19.90356589 | 67.00342849 | 2.90903404 |

A zero shut-in with no afterflow at all is not an installation anybody would run, and it still leaves the well making 2.90903404 times what the plunger carries. Timing is not the lever here, and no amount of cycling reaches it.

## Not a teaching well artefact

Run the same reading on the published case, with a well gas-liquid ratio of 4500.0 scf/bbl and a gas rate of 700.0 Mscf/d chosen for the demonstration. The cycle is 69.96279070 min at 20.58236937 trips a day, carrying 23.82707902 bbl/d against a liquid make of 155.55555556 bbl/d, a ratio of 6.52851973. The verdict reads `pressureOk = true`, `glrOk = false`, `feasible = false`, and the liquid comparison appears nowhere in it.

## The only timing check there is

`slowCycle` fires on trips, not on barrels. Give OGUTA-2 a 1500.0 min shut-in and the cycle runs 1549.90356589 min at 0.92909006 trips a day, and the warnings are `insufficientGas` and `slowCycle`.

So the screen will tell you a cycle is too slow to happen daily and will not tell you a cycle is too small to matter.

## The two questions

The screen answers whether this plunger can lift this slug against this casing. A reader hears whether a plunger will keep this well unloaded. Those are different questions, and the second needs a comparison the engine computes both sides of and never makes.

## Exercise

Take `liquidPerDayBbl` and the well's own liquid make on OGUTA-2 and write the ratio.

Then say which returned field you would put beside `feasible` in a report, and what it would have to be compared against.
