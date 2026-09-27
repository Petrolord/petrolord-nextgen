# Three technical forecasts

{{panel:prms-reserves-calculator}}

A Reserves figure starts from a forecast of what the project will produce. The engine builds none. It takes three stated technical forecasts, low, best and high, year by year from a stated effective year, and works out how much of each the project can produce and sell before it stops paying. Where the forecasts come from is another course's subject: decline and type curves belong to the decline curve analysis course, and in-place volumes to the reservoir volumetrics course.

## What a forecast row holds

Each case is a list of rows, one a year, each with a year, the oil in barrels and the gas in Mscf. Ekene Main waterflood (EKN-1, synthetic) states three forecasts from 2027 to 2041, with gas at 0.800000 Mscf a barrel. Beside them sit the other stated inputs: oil at 65.000000 and gas at 2.500000 a unit, flat; opex of 30000000.000000 a year; capital of 15000000.000000 in 2027; abandonment of 40000000.000000; and the royalty, tax, working interest, licence and basis that later lessons take one at a time.

| case | forecast | technical oil |
| --- | --- | --- |
| low | 2027 to 2041 | 10854176.000000 |
| best | 2027 to 2041 | 18252916.000000 |
| high | 2027 to 2041 | 25590784.000000 |

The technical oil is the whole forecast, before anything is cut. None of it is Reserves yet.

## What the engine does with them

For each case the engine works five steps in order. It cuts the years after the licence expiry when no renewal is expected. It runs the canonical cash flow of cashflow.ts at 100 percent with the stated prices, royalty, tax and costs. It keeps the years up to that cash flow's economic limit year, found by the canonical trailing trim. It calls the case economic when the undiscounted net cash flow, after tax and abandonment, is above 0. Then it reports the Reserves categories from the three kept quantities on the stated basis, or none when the best case fails.

## One row a year, in order

The rows are checked before any arithmetic. Each case, the prices and the opex must have one row a year from the effective year, in order. A gap is refused, verbatim:

> forecasts.best[3].year must be 2030 (one row a year from 2027, in order); got 2031

A price table one row short is refused too:

> prices must have 15 rows, one a year from 2027 to 2041; got 14

And a forecast cannot hold a negative quantity:

> forecasts.low[0].oil must be a finite number at or above 0; got -1

A missing year would otherwise vanish from the sums without a word.

## Three forecasts, three answers

The low, best and high forecasts are three views of one project. Each is cut at its own limit, so the engine reports three limit years and three quantities.

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". In the box, find the three forecasts, the prices and the opex rows, and read the first and last year of each.
2. In the first result table, read the forecast years and the technical oil of each case.
3. Delete the last row of the prices and read the refusal. Undo the change.
4. Change the year of the fourth row of the best forecast to 2031 and read the refusal. Write one sentence on why a gap is refused before any cash flow is run.
