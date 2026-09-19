# The price along the exchange rate

A cap is fixed and a chain's price is not. The question an importer or a regulator asks of a capped price is which input, moved how far, makes the cap stop covering the chain. `priceSensitivity` answers the first half of that. It re-prices the whole chain at each value of one driver and reports the price at each.

{{panel:supply-price-explorer}}

## The driver

The BADAGRY cargo is bought in dollars and sold in naira, and the exchange rate enters the landed cost once, at the end. So every dollar in the walk reaches the pump price through that one input. That makes the exchange rate the driver this module sweeps.

Every figure in the sweep rests on the BADAGRY record, and every rate on that record is invented for this course: the freight, the insurance, the import duty and every landed charge, every margin and levy on the pump price, the value added tax and the cap of 1150.0000 naira a litre. The exchange rates in the sweep are invented values chosen to cover a range. None describes any market on any date.

## The sweep

The engine re-prices the chain at each exchange rate and compares each price with the invented cap:

| naira to the dollar | pump price naira/L | shortfall naira/L | cap covers |
| --- | --- | --- | --- |
| 1200.0000 | 876.2757 | -273.7243 | true |
| 1350.0000 | 969.2294 | -180.7706 | true |
| 1500.0000 | 1062.1833 | -87.8167 | true |
| 1650.0000 | 1155.1370 | 5.1370 | false |
| 1800.0000 | 1248.0908 | 98.0908 | false |
| 1950.0000 | 1341.0445 | 191.0445 | false |
| 2100.0000 | 1433.9982 | 283.9982 | false |

Each row is a full re-pricing: the landed cost in dollars converted at that row's rate, then every invented pump element added in order, then the invented value added tax on the running total. The shortfall is that price less the cap, with the same sign convention as the fourth module.

## What re-pricing the whole chain means

The engine does not take one price and scale it. At each exchange rate it builds the chain again from its inputs. That matters for two reasons.

The first is the percentage element. The value added tax is a percent of the running total, and the running total contains the landed cost. A shortcut that moved only the landed cost and kept the tax amount fixed would misprice each row away from the base rate. Rebuilding the chain applies the tax to each row's own running total.

The second is honesty about what moves. The per-litre margins and the per-litre levies are the same invented amounts on every row, because they are per-litre amounts and the driver does not touch them. Only the landed cost and what is levied on it change.

## Reading the verdict column

The verdict is true on the first three rows and false on the last four. The cap covers the chain at 1500.0000 naira to the dollar and does not at 1650.0000. So the exchange rate at which the price meets the cap lies somewhere between those two rows. The table does not say where. A sweep reports the price at the values it was given, and the value where the verdict turns is almost never one of them. Finding it is the job of the next lesson.

## Exercise

From the sweep, record the pump price, the shortfall and the verdict at 1500.0000 and at 1650.0000 naira to the dollar. Say what those two rows, read together, show about where the exchange rate that breaks the invented cap must lie, and why the sweep alone cannot give that rate.
