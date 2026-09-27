# The trailing trim

{{panel:prms-reserves-calculator}}

{{panel:prms-aggregation-calculator}}

The Professional tier cut the Ekene forecasts at an economic limit and read the Reserves that remained. This module asks which rule set that limit. There are two, and they usually agree. This lesson reads the first: the canonical trailing trim of cashflow.ts, the economic limit every economics course in the academy uses. The cash flow ledger itself belongs to the cash flow course.

## The rule

Working backward from the last year of a forecast, the trailing trim cuts every trailing year whose revenue less royalty less opex is below 0. It stops at the first year that pays. A year with capital is kept, and a year at exactly 0 is kept. The engine names the rule in its basis, verbatim:

> computeCashFlow of engines/economics/cashflow.ts with apply_economic_limit (JV regime at 100%, the stated royalty and tax), checked against PRMS 3.1.3.1

The engine carries no cash flow of its own. It runs the canonical computeCashFlow for each case with its economic limit switched on, and keeps the years up to the limit year that function returns.

## On EKN-1

The Ekene Main waterflood, cut at its licence expiry in 2040, reaches its economic limit under the trailing trim in these years:

| case | economic limit (engine) | trailing years cut (engine) |
| --- | --- | --- |
| low | 2033 | 7 |
| best | 2037 | 3 |
| high | 2040 | 0 |

Each case is cut on its own. The low case pays less each year and stops paying earlier. The high case pays through to the licence expiry, so nothing is trimmed and the licence sets its end.

## At the boundary

Two golden cases differ by one barrel in the last year, at 50 a barrel against opex of 1000000:

| last-year oil (stated) | economic limit | trailing years cut | 2P oil |
| --- | --- | --- | --- |
| 20000 | 2029 | 0 | 170000.000000 |
| 19999 | 2028 | 1 | 150000.000000 |

At 20000 barrels the last year's revenue less opex is exactly 0, and the year is kept. One barrel less and it is below 0, and the year is cut, taking its barrels out of the 2P. The boundary is inclusive at 0.

## What the rule looks at

The trailing trim reads the years from the end. A loss year in the middle of a forecast, followed by years that pay, is kept: the trim stops at the first paying year from the end. That is why a forecast with a late dip and a recovery can carry a limit year the second rule would not give. The next lesson reads that second rule.

## Exercise

Open the reserves calculator on the view "The economic limit and the entitlement" and start from "EKN-1 Ekene Main waterflood, net entitlement". Read each case's economic limit and trailing years cut. Then open the aggregation calculator on the view "The economic limit: the two rules" and start from "A last year at exactly 0"; read the limit and the 2P oil. Switch to "A last year one barrel short" and read them again. Say which year was cut and why.
