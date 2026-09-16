# Abandonment as a lump sum

One outflow in one year, after tax, at the full amount. Each of those three phrases is a choice the engine made for you.

{{panel:ec-fiscal-explorer}}

## Where it lands

The published abandonment_final_year case adds abandonment_cost_usd of 10000000.00 to a two-year joint venture ledger. The 2031 tax is 32500000.00 with or without it and the taxable income 65000000.00 either way, while net cash flow drops from 37500000.00 to 27500000.00. NPV falls from 21590909.09 to 12500000.00, the lump sum discounted one year, and IRR from 200.0000 to 120.0000 percent. Total tax is unchanged: the outflow is charged after the cascade has finished.

Name a year beyond the data and the engine builds one. With abandonment_year 2033 a row appears with no revenue, depreciation of 5000000.00, a loss carried forward of 5000000.00 and a net cash flow of -10000000.00 discounted to -7513148.01. NPV is 14077761.08 and the IRR is null, the appended row having handed the vector a terminal negative. Later is cheaper, and the row it takes to get there banks a loss for nothing.

## AKATA's version

| Placement | NPV | IRR, percent | Total tax |
| --- | --- | --- | --- |
| none | 72534830.66 | 29.2361 | 148425219.46 |
| 60000000 in 2035, the final year | 38666394.86 | null | 148425219.46 |
| 60000000 in 2037, beyond the data | 44544387.85 | null | 148425219.46 |

The 2035 net cash flow goes from 30401798.05 to -29598201.95, a terminal negative, and the IRR is null. Since engines 3.10.0 a rate is named only where exactly one rate in the band zeroes the NPV, and until that repair this run printed 23.2570 percent, one root of a curve that had another. At 200000000 the final flow is -169598201.95 and the null has the opposite cause, the NPV being negative at every sampled rate, -40359955.35 at the applied rate. The tax total never moves.

## The number that is already the share

jv_abandonment_wi_60 runs the same two years at a 60 percent working interest. Gross revenue is 60000000.00, royalty 12000000.00 and tax 19500000.00, all the share; the abandonment_cost column reads the entered 10000000.00 and the 2031 net cash flow is 12500000.00. NPV 3863636.36, IRR 66.6667 percent, unit technical cost 43.333333 USD per boe against 40.000000 at a full interest, one whole bill spread over the share's barrels.

AKATA shows the size of it. At 100 percent a 60000000 lump sum takes NPV from 72534830.66 to 38666394.86; at 50 percent it takes it to 2398979.53 and the unit technical cost from 45.475732 to 50.944861 USD per boe. abandonment_cost_usd is a share-level number: enter the share, or the flows will pay for the partners.

## The mistake

The careful mistake is to relieve it. A reader who expects the cost to be deductible reduces the final year's tax and reports a net cash flow higher than the row. Every abandonment case carries the same total tax as the run without it, 148425219.46 on AKATA. Deductibility is real in some regimes, not in this one.

## What the engine refuses

It refuses to deduct the lump sum from any base or to scale it by working interest, which is why the number entered must already be the share. It no longer hides a changed sign behind a rate: the IRR comes back null with a status. And it refuses to spread the cost; for that the funding mode has to change.

## Exercise

Write the 2035 AKATA net cash flow with and without the 60000000 lump sum and say what property of the vector changed. Then explain why a 50 percent partner should not enter 60000000.
