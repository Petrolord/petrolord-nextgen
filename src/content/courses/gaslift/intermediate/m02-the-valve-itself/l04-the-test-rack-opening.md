# The test rack opening

The number a shop dials is not the dome pressure and not the opening pressure at depth, it is the one pressure at which the valve can be checked with nothing but atmosphere on the far side.

{{panel:pd-valve-explorer}}

## Vent the far side and the balance collapses

On the rack the tubing side is open to atmosphere and the dome is back at 60 degF, so the force balance loses one of its three terms and the opening pressure becomes the 60 degF charge divided by one minus R. Everything downhole about the valve, its depth, its stage pressure and its temperature, has already been folded into the charge before the tester sees it.

| westTexasOil valve | Dome at temperature, psia | Dome at 60 degF, psia | Test rack opening, psia |
| --- | --- | --- | --- |
| 1 | 1021.076842603 | 895.736722296 | 956.727988968 |
| 2 | 1042.112668650 | 884.561445498 | 944.791780671 |
| 3 | 1051.188589741 | 870.463855622 | 929.734277193 |
| 4 | 1050.683966027 | 854.265989240 | 912.433488084 |
| 5 | 1042.530383853 | 836.510382916 | 893.468891559 |
| 6 | 1028.299535707 | 817.570604431 | 873.239491858 |
| 7 | 1009.270910717 | 797.713205958 | 852.029990859 |

## The two columns do not move together

The dome at valve temperature rises to valve 3 and then falls. The rack numbers fall from the first valve to the last without a single reversal. Nothing about the well reverses at valve 3: the temperature correction is doing it. Deeper valves are hotter, so a given rack charge buys more downhole pressure, and the charge required to hold a rising downhole target starts falling before the target itself does.

That is why a rack sheet reads as a tidy descending list while the pressures the valves actually see do not descend at all. The multiplier is set by the bellows the port sits in: on deepHighPressure valve 1 a dome of 1478.591775361 psia at temperature comes back as 1246.612923784 psia at the rack and opens at 1297.996180658 psia, on an R of 0.039586601.

## The mistake

Dialling the dome pressure at valve temperature onto the rack. On valve 1 that is 1021.076842603 psia instead of 956.727988968 psia, and the valve leaves the shop holding far too much. The error is largest where the two columns are furthest apart, which is at the bottom of the string, exactly where an unloading failure costs the most time.

## What it refuses

Only charged valves have a rack setting. westTexasOil valve 8 at 7500.000000000 ft is an orifice, and deepHighPressure valve 7 at 8644.662255376 ft is an orifice too. Neither has a dome, a rack opening or a closing pressure, and the engine reports nothing for them beyond a depth, the pressures either side and a throughput. A bottom orifice is not a valve that always opens, it is a hole.

## Exercise

Record the rack opening and the dome at valve temperature for westTexasOil valves 1 through 7.

Then say in one sentence why one of those two columns turns and the other does not.
