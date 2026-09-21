# Steps that tile the axis

The curve is drawn as steps. The course states the geometry: each step's width is its tonnes a year and its height its cost per tonne, and the steps tile the axis from 0. This lesson reads the cumulative columns the engine prints for the six invented AGBOR measures, with costs in US dollars.

{{panel:carbon-abatement-explorer}}

## The cumulative columns

| order | measure | tonnes a year | cumulative start t | cumulative end t |
| --- | --- | --- | --- | --- |
| 1 | Tune the fired heaters | 760.000 | 0.000 | 760.000 |
| 2 | Repair failed steam traps | 1150.000 | 760.000 | 1910.000 |
| 3 | Heat integration project | 3400.000 | 1910.000 | 5310.000 |
| 4 | Vapour recovery on the storage tanks | 1850.000 | 5310.000 | 7160.000 |
| 5 | Solar for purchased power | 2100.000 | 7160.000 | 9260.000 |
| 6 | Flare gas recovery | 6200.000 | 9260.000 | 15460.000 |

## Reading the tiling

The first step starts at 0.000. Every later step starts at the figure where the step before it ends: 760.000, 1910.000, 5310.000, 7160.000 and 9260.000 each appear twice in the table, once as an end and once as the next start. There is no gap between steps and no overlap. The last step ends at 15460.000 t, and the engine prints totalAbatementTonnes 15460.000.

The height of each step is the cost per tonne from the last lesson. The first three steps sit below zero, at -167.4364, -156.4390 and -14.2492 USD a tonne. The last three sit above it, at 35.4193, 45.8573 and 78.1002 USD a tonne.

## What the axis counts

The horizontal axis is tonnes a year, added in rank order. Its end, 15460.000 t, is the tonnes of all six measures taken together as the curve adds them. The lab also prints additive false for this curve, with an interaction note: two of the measures act on the same source, and "the cumulative curve is an upper bound." Module three reads that note. For now, read 15460.000 t as the sum the curve draws.

## What the area of a step is

The course defines the cost per tonne as the net annual cost over the tonnes abated a year. So a step's area, its width in tonnes a year times its height in US dollars a tonne, is that measure's net annual cost in US dollars a year. The lab prints each one, and the next lesson adds them up to the net annual cost of all.

## Two checks on any curve

Reading a curve, check the first start and the last end. Here they are 0.000 and 15460.000 t. Then check that each width is the measure's own tonnes a year: the Heat integration project's step runs from 1910.000 to 5310.000 t, and its tonnes a year are 3400.000. In practice a step chart that fails either check has lost or doubled some tonnes somewhere along the axis.

## The tiling follows the rank

The cumulative columns are built in the order of the last lesson, cheapest first. Vapour recovery on the storage tanks, order 4, starts at 5310.000 t, where the three measures ranked above it end. Flare gas recovery, order 6, starts at 9260.000 t and carries the last stretch of the axis, 6200.000 t a year. The course names the oracle route for the curve: the curve by explicit rank.

## Exercise

Read the cumulative start and cumulative end of every step, and totalAbatementTonnes. Say what the six pairs, read in order, show about how the steps sit on the axis, and what the last cumulative end shows about totalAbatementTonnes.
