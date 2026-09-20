# Revenue, cost and margin

A route's year runs from the parcel to a value per Mscf in six printed steps. This lesson reads all four EGBEMA routes through them.

{{panel:gasvalue-route-explorer}}

## What the study typed

EGBEMA's four routes on 7.5 MMscfd and 355 days:

| route | yield per Mscf | recovery | price per unit, dollars | fixed opex, dollars a year | variable opex, dollars per Mscf |
| --- | --- | --- | --- | --- | --- |
| Compressed natural gas | 18.5 kg CNG | 0.88 | 0.55 | 1900000 | 0.35 |
| Mini LNG | 0.0175 t LNG | 0.86 | 455 | 5200000 | 0.65 |
| LPG and condensate extraction | 0.0052 t LPG | 0.82 | 470 | 2600000 | 0.28 |
| Gas to power or gas to wire | 0.085 MWh | 0.94 | 58 | 3600000 | 0.45 |

Each price is per unit of the route's own product: per kilogram of CNG, per tonne of LNG, per tonne of LPG, per MWh. Every price and every cost here is invented and illustrative. None is a market price.

## The six steps

- mscfPerYear is the volume in Mscf a day times the on-stream days.
- productPerYear is that times the yield times the recovery.
- revenue is product times price.
- operating cost is the fixed cost plus the variable cost per Mscf of the whole parcel.
- grossMarginPerYear is revenuePerYear minus operatingCostPerYear, on every row.
- valuePerMscf is the margin over mscfPerYear.

## The year the engine prints

| route | productPerYear | revenuePerYear, dollars | operatingCostPerYear, dollars | grossMarginPerYear, dollars | valuePerMscf, dollars |
| --- | --- | --- | --- | --- | --- |
| Compressed natural gas | 43345500.0000 kg CNG | 23840025.00 | 2831875.00 | 21008150.00 | 7.8904 |
| Mini LNG | 40070.6250 t LNG | 18232134.38 | 6930625.00 | 11301509.38 | 4.2447 |
| LPG and condensate extraction | 11352.9000 t LPG | 5335863.00 | 3345500.00 | 1990363.00 | 0.7476 |
| Gas to power or gas to wire | 212733.7500 MWh | 12338557.50 | 4798125.00 | 7540432.50 | 2.8321 |

Dollars of revenue, cost and margin print to two decimals. valuePerMscf prints to four.

## Reading one row

Take the CNG row. The product is 43345500.0000 kg of CNG, and at 0.55 dollars a kilogram the revenue is 23840025.00 dollars a year. The operating cost is the fixed 1900000 plus 0.35 dollars on each Mscf of the whole parcel, and it prints 2831875.00. The gross margin prints 21008150.00. Over the parcel's 2662500.0000 Mscf that margin gives a valuePerMscf of 7.8904 dollars.

Mini LNG reads the same way in tonnes. Its product is 40070.6250 t of LNG at 455 dollars a tonne, and the revenue prints 18232134.38. The fixed 5200000 plus 0.65 dollars on each Mscf of the parcel prints an operating cost of 6930625.00, and the margin prints 11301509.38. Mini LNG fails the study's screen in module 1, and it still has a year: the bid table prints these figures beside its verdict of fails.

Read the variable cost with care. It is charged per Mscf of the whole parcel. The recovery does not reduce it. The recovery enters the product and, through the product, the revenue.

Read the value per Mscf with the same care. Its denominator is the whole parcel's mscfPerYear. It is the margin spread over every Mscf the flare study counts.

## What the margin becomes

The margin appears three more times in this tier. In the cash flow routeEconomics hands on, the recurring figure is the margin. In the credit test of module 5, the gross margin is set against a hurdle margin. In the bid table, the routes are ranked on gross margin per Mscf, and the ranking note reads: "Ranked on gross margin per Mscf, which ignores the capital." The next lesson but one reads the capital that note warns about.

On EGBEMA with the study's limits, the bid table's bestByValuePerMscf is cng. The year table prints each route's value per Mscf and no difference or ratio between them, so this lesson quotes the four and stops: 7.8904, 4.2447, 0.7476 and 2.8321.

In the panel, change the CNG price and read revenue, margin and value per Mscf move while the operating cost stays at 2831875.00.

## Exercise

Read the LPG row. Give its product with its unit, its revenue, its operating cost, its gross margin and its value per Mscf, each at the precision printed. State the rule for the operating cost and the rule for the value per Mscf. Then quote the bid table's ranking note and say which figure it names as ignored.
