# Critical flow

Below a pressure ratio of 0.551208318 the downstream pressure stops mattering. A throughput quoted without its regime is half a statement.

{{panel:pd-valve-explorer}}

## The flat part

A 0.25 in port at 1000.0 psia, 140.0 degF and a gas gravity of 0.65, with the downstream pressure walked from choked to nearly balanced.

| Downstream, psia | Ratio | Throughput, Mscf/d | Regime |
| --- | --- | --- | --- |
| 100.0000 | 0.100000000 | 1255.291662 | critical |
| 300.0000 | 0.300000000 | 1255.291662 | critical |
| 500.0000 | 0.500000000 | 1255.291662 | critical |
| 551.2083 | 0.551208318 | 1255.291662 | subcritical |
| 700.0000 | 0.700000000 | 1187.215029 | subcritical |
| 900.0000 | 0.900000000 | 796.940795 | subcritical |
| 980.0000 | 0.980000000 | 374.864323 | subcritical |
| 999.0000 | 0.999000000 | 84.778842 | subcritical |

Walking the downstream pressure from 100.0000 psia up to 500.0000 psia changes the rate by nothing whatever. Walking it from 900.0000 through 980.0000 to 999.0000 psia takes the same port from 796.940795 to 374.864323 to 84.778842 Mscf/d.

## Why the curve is flat

Once the ratio reaches the critical value the gas leaves the port at the speed of sound and the downstream pressure can no longer send information upstream. The engine handles this by clamping the ratio at 0.551208318 before it evaluates the bracket, so one expression covers both branches continuously and the flat part is exact rather than approximate. The critical value follows from k, which is 1.27 here.

## Which valves are on which branch

Regime is a property of a valve at a stage, not of a design. On deepHighPressure valves 1 and 2 are critical and valves 3 through 7 are subcritical. On midDecrementKnifeEdge valves 1, 2 and 3 are critical and 4 through 7 are subcritical. The pattern is the same one the spread column shows: the two pressures close on each other with depth, so the deep valves sit on the sensitive branch.

## The mistake

Quoting the throughput of a deep valve as a fixed capability. A critical valve keeps its rate while the tubing pressure wanders. A subcritical one does not, and the module does not compute the tubing pressure at all: the flowing traverse is passed in from outside. midDecrementKnifeEdge valve 6 passes 1347.108582683 Mscf/d at a ratio of 0.734747861, and every psi of change on the production side moves that number.

## What it refuses

The regime label is a ratio test on two static pressures. There is no velocity anywhere in the annulus model, so the upstream pressure is a shut in gas column, and the label tells you which branch of the equation was used rather than what the valve is doing in the well.

## Exercise

Walk the downstream pressure across the critical ratio in the panel and record where the throughput first moves.

Then read the regime of every valve on deepHighPressure and midDecrementKnifeEdge, and say what the two lists have in common.
