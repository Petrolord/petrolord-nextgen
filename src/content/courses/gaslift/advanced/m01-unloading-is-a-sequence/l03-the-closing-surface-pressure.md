# The closing surface pressure

Six numbers are fixed before the sequence starts, and the whole unloading run is one falling casing pressure walking down past them.

{{panel:pd-unloading-explorer}}

## One number per valve, set once

The closing surface pressure is the dome charge at valve temperature carried back up a gas column to surface. On midDecrementKnifeEdge the six charged valves carry 1112.854990002, 1096.382496723, 1077.766814639, 1057.575218651, 1036.185737940 and 1013.861991357 psia. Valve 7 is an orifice at 9000.000000000 ft and has no closing pressure at all. Deeper valves close at lower surface pressures, because a hotter dome and a longer column do not cancel.

## The casing walks past them

The stage casing pressures are 1164.7000 down to 1004.2000 psia. Against valve 1, which the engine closes at 1112.854991112 psia:

| Stage casing, psia | Surface margin on valve 1, psi | Open |
| --- | --- | --- |
| 1137.9500 | 25.095008888 | true |
| 1111.2000 | -1.654991112 | false |
| 1084.4500 | -28.404991112 | false |
| 1057.7000 | -55.154991112 | false |
| 1030.9500 | -81.904991112 | false |
| 1004.2000 | -108.654991112 | false |

The margin falls by the decrement at every transfer, because the only thing moving is the casing. A valve shut on a casing that only falls stays shut, which is why the open valve list at any stage is a run of the shallowest valves and never a scattered set.

## Two roads, and they agree here

The oracle tests the acting pressure at valve depth against the dome at valve temperature. At stage 3 valve 1 that is 1180.251805285 psia against 1182.023754759 psia, a margin of -1.771949474 psi. The engine tests 1111.2000 psia at surface against 1112.854991112 psia, a margin of -1.654991112 psi. Two different numbers, computed down two different roads, one verdict. Verdict agreement across all 7 stages of this design is true.

## The mistake

Treating the closing surface pressure as a property of the stage. It is a property of the valve, fixed by its dome, its bellows area of 0.77 in2 and its 0.25 in port. Change the port and every one of those six numbers moves, and the sequence that walks past them is unchanged.

## What it refuses

On a production operated string this number is computed on the wrong fluid. The dome balances against the tubing and the engine still inverts it up a casing column, then compares it with the casing. Valve 1 of constantPressurePPO is tested as 1114.7 psia against a closing surface pressure of 389.713022538 psia, clearing by 724.986977462 psi and called open, while the rule it should face, 357.547660568 psia of tubing at valve depth against a dome at valve temperature of 409.797201414 psia, misses by 52.249540846 psi and calls it shut. This is a pinned known divergence, and it is the clearest case in this course of a verdict that is confident and wrong.

## Exercise

Read valve 1 of midDecrementKnifeEdge at stages 2 and 3 and write the two surface margins.

Then say which single input you would change to move all six closing surface pressures at once, and which input moves none of them.
