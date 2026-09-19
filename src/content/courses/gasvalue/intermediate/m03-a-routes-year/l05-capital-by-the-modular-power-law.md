# Capital by the modular power law

The year table of lesson 3 carries no capital. The capital comes from a reference plant, scaled by a power law that flareToValue takes from modularRefinery.

{{panel:gasvalue-route-explorer}}

## The law

Capital is scaled from the route's reference plant: cost = reference cost times (capacity over reference capacity) to the exponent. modularRefinery exports two exponents:

| SCALING_EXPONENT | value |
| --- | --- |
| STICK_BUILT | 0.6 |
| MODULAR | 0.9 |

EGBEMA's study typed a reference plant for each route:

| route | reference capital, dollars | reference capacity MMscfd |
| --- | --- | --- |
| Compressed natural gas | 24000000 | 6 |
| Mini LNG | 80000000 | 15 |
| LPG and condensate extraction | 38000000 | 10 |
| Gas to power or gas to wire | 50000000 | 12 |

Every reference cost and capacity is invented and illustrative.

## The capital on EGBEMA

| route | capitalCost | scalingExponent | the six-tenths rule on the same plant | modular minus six-tenths |
| --- | --- | --- | --- | --- |
| Compressed natural gas | 29337983.06 | 0.9 | 27438303.12 | 1899679.94 |
| Mini LNG | 42870938.50 | 0.9 | 52780316.43 | -9909377.93 |
| LPG and condensate extraction | 29331801.26 | 0.9 | 31975721.65 | -2643920.39 |
| Gas to power or gas to wire | 32753824.67 | 0.9 | 37713602.10 | -4959777.43 |

Every route's scalingExponent reads 0.9, the MODULAR value. capitalCost prints to two decimals, in dollars.

The table prints the six-tenths rule on the same plant beside the engine's figure, and it prints the difference as its own column. That column is the only comparison between the two this lesson draws. On CNG, modular minus six-tenths is 1899679.94. On mini LNG it is -9909377.93, on LPG -2643920.39, and on gas to power -4959777.43. One route's difference is positive and three are negative. The six-tenths column is a reading the engine does not use for these routes: the capital each route carries is capitalCost, on the exponent 0.9.

## Two routes read through

On CNG the study's reference plant costs 24000000 dollars at 6 MMscfd. The capital EGBEMA's CNG route carries is 29337983.06 on the exponent 0.9. The six-tenths reading on the same plant is 27438303.12, and the difference column prints 1899679.94.

On mini LNG the reference plant costs 80000000 dollars at 15 MMscfd. The capital is 42870938.50 on the exponent 0.9. The six-tenths reading is 52780316.43, and the difference column prints -9909377.93.

The capacity each route is scaled to is an input of the law. The table prints the reference plant and the scaled capital, and it prints no row for the scaled capacity, so this lesson reads the reference and the result and computes nothing between them.

## The cash flow handed on

The engine assembles the cash flow and hands it on; it does not discount it. Year 0 is the capital as a negative, and the recurring figure is the margin:

| route | cashFlow.year0 | cashFlow.recurring |
| --- | --- | --- |
| Compressed natural gas | -29337983.06 | 21008150.00 |
| Mini LNG | -42870938.50 | 11301509.38 |
| LPG and condensate extraction | -29331801.26 | 1990363.00 |
| Gas to power or gas to wire | -32753824.67 | 7540432.50 |

cashFlow.year0 is the capitalCost with its sign turned. cashFlow.recurring is the grossMarginPerYear of the route's year.

The engine's valuation note reads: "Capital, operating cost and revenue are assembled here and handed to the sanctioned economics engine. A second discounted cash flow in this module would be a second answer." This course reads the two figures of the cash flow. It discounts neither of them.

## No reference plant, no capital

With the reference cost left blank, the capital is null, and the note reads: "No capital cost: a reference plant cost and capacity are required to scale from." The engine gives no capital figure without a plant to scale from.

## Where the capital is read again

The capital sits in the bid table of module 5 beside the value per Mscf, and the ranking note there reads: "Ranked on gross margin per Mscf, which ignores the capital. Compare that against the capital column before concluding, and value the shortlist in the sanctioned economics engine."

In the panel, read each route's capital with the six-tenths reading beside it, then change a route's reference capacity and read both move.

## Exercise

Read the mini LNG row. Give its reference capital and capacity, its capitalCost, its scalingExponent, the six-tenths reading and the difference column. Then give its cashFlow.year0 and cashFlow.recurring, say which figure of the route's year the recurring figure is, and quote the valuation note's second sentence.
