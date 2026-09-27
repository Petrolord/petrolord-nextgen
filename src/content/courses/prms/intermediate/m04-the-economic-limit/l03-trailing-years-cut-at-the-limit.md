# Trailing years cut at the limit

{{panel:prms-reserves-calculator}}

Every forecast declines. Late in a field's life the barrels stop covering the cost of lifting them, and a Reserves figure stops at that point. The engine takes the stopping point from the canonical cash flow of cashflow.ts: the economic limit of the trailing trim. This lesson reads that rule, applies it to each Ekene case, and shows its edge.

## The rule

Working back from the last year, the canonical cash flow cuts every trailing year whose revenue less royalty less opex is below 0. A year with capital in it is kept, and a year at exactly 0 is kept. The first year it keeps, counting back, is the economic limit of that case. The barrels after it are reported as beyond the limit and taken out of the quantity.

## Each case on its own

On EKN-1 the three forecasts reach their limits in different years:

| case | licence cut | economic limit | trailing years cut | oil beyond the limit | economic oil, gross |
| --- | --- | --- | --- | --- | --- |
| low | 2040 | 2033 | 7 | 1864516.000000 | 8890704.000000 |
| best | 2040 | 2037 | 3 | 1291471.000000 | 16653136.000000 |
| high | 2040 | 2040 | 0 | 0.000000 | 24989527.000000 |

The low forecast produces less each year, so it stops paying first: its economic limit is 2033, with 7 trailing years cut. The high forecast pays to the licence expiry in 2040 and loses nothing to the limit. The years after 2040 are cut before any of this, because the licence ends then and no renewal is expected; module six takes that up.

The engine's reason on the best case, verbatim:

> best case: forecast 2027 to 2041, cut at the licence expiry 2040 (no renewal expected); economic limit 2037 (3 trailing years cut); undiscounted net cash flow 382377266.94 at 100%: economic (PRMS 3.1.2.1: above 0); within the limit 16653136 bbl oil and 13322509 Mscf gas gross

## The edge of the rule

Two golden inputs differ by one barrel in their last year: 20000 and 19999 barrels at 50 a barrel, against opex of 1000000.

| golden input | last-year oil (stated) | economic limit (engine) | trailing years cut (engine) | 2P oil (engine) |
| --- | --- | --- | --- | --- |
| econ-tail-exactly-zero-kept | 20000 | 2029 | 0 | 170000.000000 |
| econ-tail-one-below-cut | 19999 | 2028 | 1 | 150000.000000 |

At 20000 barrels the last year's revenue exactly covers its opex, so it is kept. One barrel less and it falls below 0 and is cut. The rule is strict on one side and inclusive on the other, and the engine prints which side each case fell on.

## A check beside the rule

The standard's rule places the economic limit in the year the cumulative net cash flow peaks (PRMS 3.1.3.1). On a forecast that declines steadily, as the Ekene forecasts do, the two rules give the same year, and the engine checks that they agree. Where a forecast dips and recovers they can part, and the Expert tier takes up that case.

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". Read the economic limit and trailing years cut of each case, and the oil beyond the limit.
2. Start from "A last year at exactly 0". Read the limit, then change the last-year oil of all three forecasts to 19999 and read it again.
3. Start from "A last year at exactly 0" again and lower the last-year oil price to any figure of your own below 50. Predict the limit before you read it.
4. On EKN-1, set "Abandonment cost (stated, 0 for none)" to 0. Read whether any economic limit moves, and write one sentence on why.
