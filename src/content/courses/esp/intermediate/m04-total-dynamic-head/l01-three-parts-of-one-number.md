# Three parts of one number

Total dynamic head is one division. The three parts are a report of it, and they add back to the same number.

{{panel:pd-lift-explorer}}

## The division

The published gassyOffshore design discharges at 3200.0 psia against an intake of 1340.0000 psia, so the pressure the pump must add is 1860.0000 psi. The fluid inside the pump has a gradient of 0.3736183828 psi/ft, and dividing gives 4978.341767 ft.

The published highWaterCut design runs 2600.0 psia against 932.0000 psia, adds 1668.0000 psi at 0.4392779296 psi/ft, and needs 3797.140461 ft.

Head is feet of the fluid being pumped, so the gradient is not a detail of the conversion. It is half of it.

## The three parts, and the closure

| Part | gassyOffshore, ft | Share | highWaterCut, ft | Share |
| --- | --- | --- | --- | --- |
| Net vertical lift | 3413.452705 | 68.5661 percent | 3678.336385 | 96.8712 percent |
| Tubing friction | 494.277929 | 9.9286 percent | 50.510182 | 1.3302 percent |
| Wellhead term | 1070.611133 | 21.5054 percent | 68.293893 | 1.7986 percent |
| Sum | 4978.341767 | | 3797.140461 | |

Summed and compared against the head the two pressures gave, the difference is 0.000000000000 ft on gassyOffshore and 0.000000000000 ft on highWaterCut. A number that is the sum of three named parts, and that can be shown to be, is worth more than one a reader has to take on trust.

The teaching well IBENO-2 closes the same way at 725.090193 ft, and QUA-IBOE-4 at 4032.187516 ft, where the residual prints as -0.000000000000 ft.

## Which part is the big one

The net lift is 68.5661 percent of gassyOffshore and 96.8712 percent of highWaterCut. It is the largest term on both published designs and on QUA-IBOE-4, where it is 73.7397 percent.

That is not a rule. On IBENO-2 the net lift is 28.9634 percent and the wellhead term is 59.0164 percent, because the well stands nearly full and a live wellhead pressure is being paid for over a short lift.

## The mistake

Treating total dynamic head as friction plus wellhead pressure, which is the pipeline habit. Leaving the net lift out understates the stage count by roughly an order of magnitude on these cases, because the term dropped is the majority of the number on three of the four.

## What it refuses

The decomposition reports a head already computed from two pressures, and is never a second route to it. `tdhBreakdown` adds the three terms it is handed and returns the sum. It does not go back to the pressures and check. The closure of 0.000000000000 ft is a property of how the three parts were derived, not a test the function performs, so running it is yours to do.

## Exercise

Read the three parts on both published designs in the panel, sum them, and subtract the head that came from the two pressures.

Then say which of the four cases has the smallest net lift share, and what that tells you about the well.
