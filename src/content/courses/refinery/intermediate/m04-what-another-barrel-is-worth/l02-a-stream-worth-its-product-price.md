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

Put those together and the value follows. One more barrel of kero arriving from outside has one place to go, Jet A-1, and Jet A-1 can take it because it is not at its ceiling. So the month sells one more barrel of Jet A-1 at 105.5000 dollars, and nothing else in the plan has to change. The stream is worth its product's price because selling it is the whole of what the plan can do with it.

## What would make it differ

The reasoning has three conditions, and the value holds only while all three hold: the product can take another barrel, the stream has no better home, and nothing else in the plan must move to make room.

A product at its ceiling breaks the first. One more barrel of its stream could not be sold as that product, and the stream's value would be what its next home pays, or nothing.

A floor breaks the third. SECTION 14 prints the stream values under a jet floor of 300000 and a fuel oil floor of 700000:

| change | reformate | kero | ulsd | residue |
| --- | --- | --- | --- | --- |
| the plan as typed | 111.0000 | 105.5000 | 104.8000 | 59.0000 |
| a jet floor of 300000 and a fuel oil floor of 700000 | 111.0000 | 105.5000 | 104.8000 | 79.6607 |

Residue reads 79.6607 under the floors, and Fuel oil's price is still 59.0000. The plan is being made to sell at least 700000 barrels of Fuel oil. One more barrel of residue arriving from outside counts toward that floor, so it is worth its sale price and also whatever it relieves the plan of doing to meet the floor from crude. The plan prints the whole of that as 79.6607, and the digest prints no split of it into those parts.

That is the general lesson in one row. A stream's value is the plan's value, under the plan's limits. When a floor forces the plan's hand, the stream it forces is valued by what the force costs.

## Across the other changes

Read the four columns across every row of SECTION 14's change table and reformate, kero and ulsd print 111.0000, 105.5000 and 104.8000 in every row. Residue prints 59.0000 in every row but the floors. For these streams, only a change that forces the plan's hand moves the value.

## Why a planner cares

A stream worth its product price is a stream with slack in its market. The refinery could sell another barrel of it at the going price and nobody in the plan would notice. The day that value departs from the price is the day the market or a commitment has started to bind, and the stream value table shows it before the margin does.

## Exercise

Read residue's marginal value in the plan as typed, 59.0000, and under a jet floor of 300000 and a fuel oil floor of 700000, 79.6607, beside the Fuel oil price of 59.0000. Say what the floors changed about the next barrel of residue, and why reformate, whose product no floor in that row touches, still prints 111.0000.
