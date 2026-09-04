# Three inputs never read

`runRodPumpDesign` accepts a structural unbalance, a crank offset and a kinematics object. It reads none of the three.

{{panel:pd-balance-explorer}}

## What the three are for

Structural unbalance is the standing load in lb that the beam structure itself puts on the polished rod, and the counterweight has to carry it. Crank offset is the angle in deg between the counterweight and the crank arm, and it moves where in a revolution the counterweight moment peaks. `kin` is the linkage: the geometry that turns a crank angle into a polished rod position. All three belong to the balance of the unit.

`runRodPumpDesign` destructures all three in its signature and lists all three in its own documented input list. Its body references none of them anywhere.

## What they do to a function that reads them

`balanceUnit` reads two of them, so the size of what was skipped can be priced. Teaching figures on ODUMA-4, run through the published linkage.

| Passed to `balanceUnit` | Moment, in-lb | Peak torque, in-lb | Effect, lb |
| --- | --- | --- | --- |
| Both at zero | 609641.972281 | 450016.096192 | 13508.771698 |
| Unbalance 600 lb | 574806.731952 | 449370.675144 | 13336.873879 |
| Offset 10 deg | 574964.630971 | 428310.641751 | 12740.372690 |
| Both together | 542110.870876 | 428905.480981 | 12612.381566 |

Together those two numbers move the counterbalance moment by 67531.101405 in-lb, which is 11.077174 percent, the peak gearbox torque by 21110.615211 in-lb, which is 4.691080 percent, and the counterbalance effect at the polished rod by 896.390132 lb.

## What the design returns

Run the design twice on ODUMA-4. Run A passes a structural unbalance of 0 lb, a crank offset of 0 deg and no kinematics. Run B passes 600 lb, 10 deg and a full kinematics object. Nothing else differs.

Peak polished rod load is 19545.877783338576 lb in both. Minimum polished rod load 2625.472705679025 lb. Plunger stroke 98.526653099789 in. Polished rod horsepower 18.955924636901 hp. Produced rate 316.565396142022 bbl/d. Worst section loading 82.873308395930 percent. Ten outputs compared and the count of differences is 0.

Not close. Equal, to the last figure a double carries.

## The consequence a caller meets

A gearbox rating percentage on ODUMA-4 is 134.032962807 percent when the balance behind it did read those two numbers, and 140.630030060 percent when it did not. Both are plausible percentages and both sit above 100. Nothing in the returned object says which one you are holding.

## What it refuses, and what it does not

This engine is not a quiet one. It refuses a rod size it cannot read as a diameter, a linkage that does not close, a plunger with no differential to lift against and a damping ratio of 0, each with a message naming the problem. It refuses badly formed input and accepts in silence input it will never use. Run B raises no warning at all.

## Exercise

Write the three inputs `runRodPumpDesign` accepts and does not read, and beside each what it is physically for.

Then state, in one sentence with two numbers, what a caller loses by typing a structural unbalance and a crank offset into the design function instead of into the balance.
