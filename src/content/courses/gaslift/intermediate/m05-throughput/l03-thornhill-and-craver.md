# Thornhill and Craver

One expression, a discharge coefficient of 0.865, a specific heat ratio of 1.27, and a clamp that makes the choked branch and the unchoked branch the same formula.

{{panel:pd-valve-explorer}}

## What the expression is made of

The rate is proportional to the port flow area and to the upstream pressure, divided by the square root of the gas gravity times the absolute upstream temperature, and multiplied by the square root of a bracket built from the pressure ratio alone. The discharge coefficient of 0.865 is the whole of the correction for a real hole rather than an ideal nozzle.

The ratio fed to that bracket is the downstream pressure over the upstream, clamped from below at the critical ratio of 0.551208318. Nothing branches. A choked valve is evaluated with the same line of code as an unchoked one, at a ratio that has been held still.

## The published rows, factor by factor

| Port, in | Upstream, psia | Ratio | Gravity, temperature | Throughput, Mscf/d |
| --- | --- | --- | --- | --- |
| 0.25 | 1000.0 | 0.300000000 | 0.65 at 140.0 degF | 1255.291661609 |
| 0.25 | 1000.0 | 0.900000000 | 0.65 at 140.0 degF | 796.940795075 |
| 0.1875 | 1400.0 | 0.500000000 | 0.7 at 200.0 degF | 908.229615247 |
| 0.5 | 900.0 | 0.944444444 | 0.6 at 120.0 degF | 2329.535423114 |

The first two rows isolate the bracket: same port, same upstream pressure, same gas, and the ratio alone takes 1255.291661609 down to 796.940795075 Mscf/d. The third row has the highest upstream pressure in the table and passes the least of any critical row, because 0.027611654 in2 is the smallest area in it and the gas is both heavier and hotter.

## Down a real string

The same 0.25 in port on every charged valve of midDecrementKnifeEdge passes 1529.098759722 Mscf/d at valve 1, edges up to 1534.198233515 at valve 2, then falls away to 1529.067116144, 1505.775891086, 1440.849796778 and 1347.108582683 Mscf/d. The upstream pressure at depth is still climbing over part of that string, and the ratio and the temperature are working against it. A throughput column that falls with depth is the normal shape, not a fault.

## The mistake

Treating the number as valve performance. This is an orifice with a discharge coefficient, and the real valve has a stem in the hole. Below full lift the stem, not the port, is the restriction, so the equation returns what the port could pass if the stem were out of the way. Sizing a valve to exactly meet a target on this number leaves no allowance for the throttling it does not model.

## What it refuses

It does not know the stem, the travel or the bellows. It does not know whether the well accepts the gas. And it takes its upstream pressure from a static annulus column with no friction, no velocity and no injection rate in it, which is not what a moving gas stream presents at the port.

## Exercise

Reproduce the four published rows and record the flow area and the ratio for each.

Then say which single factor separates the first row from the second, and which three separate the third from the fourth.
