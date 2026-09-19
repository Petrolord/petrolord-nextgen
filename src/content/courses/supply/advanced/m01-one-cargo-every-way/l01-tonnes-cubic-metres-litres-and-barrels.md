# Tonnes, cubic metres, litres and barrels

One cargo is quoted four ways before it reaches a tank. The seller invoices tonnes, the terminal strapped its tanks in cubic metres, the forecourt sells litres and a price screen quotes barrels. The Expert tier starts here because every later figure in this tier, the landed cost, the cost of a litre sold and the pump price, rests on which of those four quantities a charge is levied on.

{{panel:supply-price-explorer}}

## The one function and its three rules

`cargoQuantities` in the `fuelPricing` module expresses one cargo in all four units at once. It carries three rules and nothing else:

- m3 = tonnes x 1000 / density, with density in kg/m3;
- litres = m3 x 1000, the module's `LITRES_PER_M3` constant;
- barrels = m3 / 0.158987294928, the module's `M3_PER_BBL` constant.

Two of those rules are fixed arithmetic. The first is a measurement: mass becomes volume only through a density, and the density belongs to the cargo in front of you. The engine does not assume one, and the next lesson is about what it does when you leave it out.

## The BADAGRY cargo in every unit

BADAGRY is the course's invented petrol cargo, one record from bill of lading to nozzle. Its density is 742.8 kg/m3. Entered in each unit the trade quotes, the engine answers:

| quantity (stated) | unit (stated) | m3 | litres | tonnes | barrels |
| --- | --- | --- | --- | --- | --- |
| 34000 | tonne | 45772.752 | 45772751.75 | 34000.0000 | 287901.9470 |
| 45772.7 | m3 | 45772.700 | 45772700.00 | 33999.9616 | 287901.6215 |
| 45772700 | litre | 45772.700 | 45772700.00 | 33999.9616 | 287901.6215 |
| 287900 | bbl | 45772.442 | 45772442.21 | 33999.7701 | 287900.0000 |

Read the first row as the cargo itself: 34000 tonnes at 742.8 kg/m3 is 45772.752 m3, 45772751.75 litres and 287901.9470 barrels. That litre figure is the bill-of-lading quantity the rest of this tier divides and multiplies. The next module charges the regulatory line on it and a later module divides the landed total by what is left of it after the ocean loss.

## Why the other three rows do not return 34000 tonnes

The second, third and fourth rows are the same cargo typed from a rounded quote. 45772.7 m3 and 45772700 litres are one quantity in two units, and both come back as 33999.9616 tonnes. 287900 barrels comes back as 33999.7701 tonnes and 45772.442 m3. The engine loses nothing. It converts exactly what it is handed, and what it is handed in those rows is a rounding of the cargo.

That is the discipline this module teaches. A conversion is only as good as the figure typed into it, so the unit you enter should be the unit the governing document states. If the bill of lading is in tonnes, enter tonnes and let the engine produce the litres. Typing a litre figure somebody rounded from tonnes carries their rounding into every charge levied per litre.

## Precision travels with the unit

The engine prints m3 to three decimals, which is a litre, litres to two, tonnes and barrels to four. Quote each figure at the precision it prints. A cargo of 45772751.75 litres is one figure. A cargo quoted to the nearest thousand litres is a different figure, and a per-litre charge levied on it is a different charge.

## Exercise

From the table, record the m3, litres and barrels the engine returns for 34000 tonnes at 742.8 kg/m3. Then record the tonnes it returns for 45772.7 m3 and for 287900 barrels. Say what the two tonne figures, read against 34000.0000, show about entering a cargo in a unit other than the one its document states.
