# What F2 replaces

{{panel:fc-sizing-explorer}}

Above the critical pressure ratio the coefficient C leaves the equation entirely, and a different constant and a different factor take its place. The constant is 735.000000000000 and the factor is written F2. Neither appears anywhere in the choked form.

## Two closed forms, one route

The engine chooses between the two forms on the back pressure ratio and returns whichever answer that choice implies. Both forms are closed, so nothing iterates and nothing is looked up. A caller who hands over a back pressure and a set of gas properties gets one answer, and the engine reports which of the two forms produced it.

F2 is computed from the isentropic exponent and the pressure ratio together, which makes it the only factor in this module that needs two inputs. That is also why it cannot be tabulated the way C can: a chart of F2 needs two axes.

| k (stated) | F2 at a ratio of 0.8 |
| --- | --- |
| 1.050000 | 0.851784 |
| 1.100000 | 0.857982 |
| 1.200000 | 0.868947 |
| 1.300000 | 0.878343 |
| 1.400000 | 0.886483 |
| 1.500000 | 0.893603 |
| 1.600000 | 0.899884 |
| 1.800000 | 0.910457 |

## The other axis

Holding the gas fixed and walking the ratio instead gives the second direction. On the ORUBIRI gas these are the subcritical rows of the branch sweep.

| back pressure ratio (stated) | F2 | required area in2 |
| --- | --- | --- |
| 0.600000 | 0.735763 | 2.237461 |
| 0.700000 | 0.808025 | 2.352545 |
| 0.800000 | 0.875668 | 2.658695 |
| 0.900000 | 0.939468 | 3.504623 |

F2 rises as the ratio rises, and the required area rises with it. That pairing surprises people who expect a larger factor to shrink an area, and the resolution is in the shape of the published form. The subcritical equation divides by the square root of the relieving pressure multiplied by the differential across the valve, and that differential shrinks as the outlet pressure climbs. So two things move at once, and the shrinking differential moves the answer harder than the rising factor does.

Read the two columns as two readings of one call rather than as cause and effect. The course prints no relation between them, and a quotient formed here would be a number nothing computed.

## Where the 735 came from

The subcritical leading constant is not exported either. It was recovered by taking one subcritical area and rearranging it against its own stated inputs and the engine's own F2, which leaves 735.000000000000 and nothing else.

There is a general caution in that. A measured constant that comes back finite and wrong reads on the page exactly like one that came back finite and right, so the measurement is worth only as much as whatever it was compared against afterwards. Recovering a leading constant means arranging a call in which every other factor is one, and getting that arrangement slightly wrong yields a plausible number rather than an obvious failure. This is why the figure above is quoted as a measurement with the question that produced it named beside it.

## What checks F2

For the subcritical rows the oracle integrates the subcritical nozzle flux from the isentropic expansion in absolute SI units. F2 is therefore checked against a derivation rather than restated in a second place. Nothing about F2 is held for literature, because it is computed at every call from the exponent and the ratio.

## Exercise

State the two inputs F2 needs and say why that stops it being a single curve on a chart. Then read the second table and describe what happens to the required area as the back pressure ratio rises, without dividing any two rows.
