# A stream worth its product price

The simplest stream values are the ones that print their product's price. This lesson reads the four streams in ABUA that do, asks why, and then shows one of them printing something else when the plan is changed.

{{panel:refinery-plan-explorer}}

## Four streams, four prices

| stream | marginal value ($/bbl) | surplus (bbl) | product, at its price | unit it feeds |
| --- | --- | --- | --- | --- |
| reformate | 111.0000 | 0.00 | Gasoline 111.0000 | (no unit) |
| kero | 105.5000 | 0.00 | Jet A-1 105.5000 | (no unit) |
| ulsd | 104.8000 | 0.00 | Diesel (ULSD) 104.8000 | (no unit) |
| residue | 59.0000 | 0.00 | Fuel oil 59.0000 | (no unit) |

Each of these streams has exactly one home. Its recipe goes into one product, and no unit consumes it. Each is placed in full, with no surplus. And no product it goes into is at its ceiling: Module 3 showed every product reading false for "at its ceiling".

The lab's stream balance prints each of the four placed in full, made against placed: reformate 346525.81 and 346525.81 bbl, kero 288354.84 and 288354.84, ulsd 630500.00 and 630500.00, residue 633129.03 and 633129.03.

Read those columns beside the value. Kero goes into one product, Jet A-1, feeds no unit, and Jet A-1 is below its ceiling; the plan prints kero at 105.5000, Jet A-1's price. The other three rows read the same way: one product, no unit, no ceiling reached, and a value equal to that product's price.

## A row where one differs

The lab prints one change under which one of the four moves off its product's price, a jet floor of 300000 and a fuel oil floor of 700000:

| change | reformate | kero | ulsd | residue |
| --- | --- | --- | --- | --- |
| the plan as typed | 111.0000 | 105.5000 | 104.8000 | 59.0000 |
| a jet floor of 300000 and a fuel oil floor of 700000 | 111.0000 | 105.5000 | 104.8000 | 79.6607 |

Residue reads 79.6607 under the floors, and Fuel oil's price is still 59.0000. The plan must sell at least 700000 barrels of Fuel oil, and it sells 700000.00: the fuel oil floor is met exactly, true. Bonny Light (illustrative) is the crude only partly run, at 567857.14 bbl, and residue is valued at its break-even: (82.5500 - 0.2300 x 72.5000 - 0.1500 x 105.5000 - 0.3100 x 89.5000 - 0.0300 x 0.0000) / 0.2800 = 79.6607.

So under the floors residue's value is Bonny Light's break-even, and the course prints the working. A stream's value is the plan's value, under the plan's limits.

## Across the other changes

Read the four columns across every row of the lab's change table and reformate, kero and ulsd print 111.0000, 105.5000 and 104.8000 in every row. Residue prints 59.0000 in every row but the floors. Across the six rows the lab prints, the floors are the only change that moves one of these four values.

## What to read first

Read each stream's value beside its product's price. Where the two agree, as they do for all four in the plan as typed, the printed value is that one product's price. Where they part, as residue's 79.6607 parts from 59.0000 under the floors, the course prints the working that explains the gap, and that working is the thing to read.

## Exercise

Read residue's marginal value in the plan as typed, 59.0000, and under a jet floor of 300000 and a fuel oil floor of 700000, 79.6607, beside the Fuel oil price of 59.0000. Say what the floors changed about the next barrel of residue, and why reformate, whose product no floor in that row touches, still prints 111.0000.
