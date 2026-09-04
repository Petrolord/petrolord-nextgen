# The net lift

The pump does not lift from its own depth. It lifts from wherever the fluid is standing.

{{panel:pd-lift-explorer}}

## Two heights, and the difference between them

The intake pressure divided by the gradient of the pumped fluid is the height of fluid standing above the intake. On the published gassyOffshore design, 1340.0000 psia over 0.3736183828 psi/ft is 3586.547295 ft. The pump sits at 7000 ft TVD, so the fluid level stands 3413.452705 ft below surface, and that distance is the net vertical lift.

The published highWaterCut design: 932.0000 psia over 0.4392779296 psi/ft is 2121.663615 ft standing above an intake at 5800 ft TVD, so the level is 3678.336385 ft down.

The teaching well QUA-IBOE-4: 1432.0000 psia over 0.3095094152 psi/ft is 4626.676701 ft above an intake at 7600 ft TVD, so 2973.323299 ft.

## Deeper is not more lift

| Case | Pump depth, ft TVD | Fluid above intake, ft | Net lift, ft | Share of the head |
| --- | --- | --- | --- | --- |
| gassyOffshore | 7000 | 3586.547295 | 3413.452705 | 68.5661 percent |
| highWaterCut | 5800 | 2121.663615 | 3678.336385 | 96.8712 percent |
| QUA-IBOE-4 | 7600 | 4626.676701 | 2973.323299 | 73.7397 percent |

The deepest of the three has the smallest lift and the shallowest has the largest. Depth says where the pump is. The intake pressure says how much of the hole is already full, and only the empty part is lift.

## The extreme case

The teaching well IBENO-2 stands 1889.989191 ft of fluid above its intake and has a net lift of 210.010809 ft, 28.9634 percent of a 725.090193 ft requirement. Nearly the whole column supports itself, and what that pump mostly pays for is the wellhead term, 427.922081 ft, 59.0164 percent of the head.

## The mistake

Putting the pump setting depth where the net lift belongs. On gassyOffshore that writes 7000 ft in place of 3413.452705 ft, more than double, and every stage count downstream doubles with it. It looks reasonable because a pump depth is a number you were handed and a fluid level is one you had to work out.

The second version is using the perforation depth, 7500 ft TVD on gassyOffshore against a pump at 7000 ft TVD. The 500 ft between them is annulus column, worth 160.0000 psi at 0.3200 psi/ft, and it belongs to the intake pressure rather than to the lift.

## What it refuses

The fluid level here is computed, not observed. It is an intake pressure divided by a gradient, so it inherits the error in both, and it is not a sonic shot. The height above the intake is also expressed in feet of the fluid inside the pump, not of whatever stands in the annulus: gassyOffshore works its annulus at 0.3200 psi/ft and its pumped fluid at 0.3736183828 psi/ft, and those gradients belong to different parts of the calculation.

## Exercise

Compute the fluid above the intake for all three cases in the panel, then subtract each from its pump setting depth.

Say which case has the most lift, which has the deepest pump, and why those are not the same case.
