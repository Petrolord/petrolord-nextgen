# Abandonment as a lump sum

One outflow in one year, after tax, at the full amount. Each of those three phrases is a choice the engine made for you.

{{panel:ec-fiscal-explorer}}

## Where it lands

The published abandonment_final_year case adds abandonment_cost_usd of 10000000.00 to a two-year joint venture ledger. The 2031 tax is 32500000.00 with or without it, the taxable income 65000000.00 either way, and the net cash flow drops from 37500000.00 to 27500000.00. The discounted flow goes from 34090909.09 to 25000000.00 and NPV from 21590909.09 to 12500000.00, the lump sum discounted one year. IRR falls from 200.0000 to 120.0000 percent. Total tax is 65000000.00, unchanged, because the outflow is charged after the cascade has finished.

Name a year beyond the data and the engine builds one. With abandonment_year 2033 a row appears with no revenue, depreciation of 5000000.00, a loss carried forward of 5000000.00 that nothing will use, and a net cash flow of -10000000.00 discounted to -7513148.01. NPV is 14077761.08 and IRR 170.4159 percent. Later is cheaper on present value, and the row it takes to get there banks a loss for nothing.

## AKATA's version

| Placement | NPV | IRR, percent | Total tax |
| --- | --- | --- | --- |
| none | 72534830.66 | 29.2361 | 148425219.46 |
| 60000000 in 2035, the final year | 38666394.86 | 23.2570 | 148425219.46 |
| 60000000 in 2037, beyond the data | 44544387.85 | 24.6309 | 148425219.46 |

The 2035 net cash flow goes from 30401798.05 to -29598201.95, a terminal negative, so the IRR of 23.2570 percent is one root of a curve that may have another. At 200000000 the final flow is -169598201.95, the IRR is null, and the NPV is negative at every sampled rate: -40359955.35 at the applied rate, -58362170.82 at 0 percent. The tax total never moves.

## The number that does not scale

jv_abandonment_wi_60 runs the same two years at a 60 percent working interest. Royalty is 12000000.00 and tax 19500000.00, both the share; the abandonment_cost column reads 10000000.00, the full amount, and the 2031 net cash flow is 12500000.00. NPV 3863636.36, IRR 66.6667 percent.

AKATA shows the size of it. At 100 percent the 60000000 lump sum takes the IRR from 29.2361 to 23.2570 percent; at 50 percent it takes it to 12.7634 with NPV 2398979.53, because half the field now carries the whole bill. The lump sum is a share-level number: enter the working interest share of the cost, or the flows will pay for the partners.

## The mistake

The careful mistake is to relieve it. A reader who expects the cost to be deductible reduces the final year's tax and reports a net cash flow higher than the row. Total tax on every abandonment case in the digest equals the total without abandonment: 65000000.00 on the two-year case, 148425219.46 on AKATA. Deductibility is a real feature of some regimes, and not of this one.

## What the engine refuses

It refuses to deduct the lump sum from any base or to scale it by working interest. It refuses to warn that the final flow has changed sign, so the IRR beside it must be read with the profile. And it refuses to spread the cost; for that the funding mode has to change.

## Exercise

Write the 2035 AKATA net cash flow with and without the 60000000 lump sum, and say what property of the whole vector changed. Then explain why the cost a 50 percent partner should enter is not 60000000.
