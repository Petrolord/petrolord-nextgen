# The Ekene joint venture

{{panel:joa-account-calculator}}

Every worked example in this course comes from one joint venture: the Ekene shallow water licence joint venture. It is synthetic. A stated script wrote it for this platform, and the fixture file says so in its own words:

> SYNTHETIC teaching data for the Ekene field (ours). No real company, contract, budget, price or regulator decision.

Money is in US$, in whole dollars, on the terrain of the Ekene Alpha case of the Petroleum Industry Act course.

## The four parties

| party | name | participating interest |
| --- | --- | --- |
| EKO | Ekene Operator (synthetic) | 40.000000 |
| PA | Partner A (synthetic) | 25.000000 |
| PB | Partner B (synthetic) | 15.000000 |
| NOC | State participant (synthetic) | 20.000000 |

The participating interests sum to the whole. EKO is the operator. NOC stands for a state participant, and the fixture carries it: NOC is carried for 100 percent of its cost share, and the carriers are EKO, PA and PB pro rata. A module of this tier explains what that does to each party's paying interest.

## The terms this tier uses

Each term below is a term of the synthetic contract, stated in the file:

* **Cash calls for 2027.** A reconciliation lag of 2 months, a negative call rule of `"carry"`, and no cash call in a month whose forecast is below 500000.000000. Twelve months of forecasts and actuals.
* **The 2027 budget.** An item tolerance of 10.000000 percent, a budget tolerance of the lower of 5.000000 percent and 3000000.000000, and an unbudgeted allowance of 500000.000000.
* **Overhead for 2031.** A marginal scale for each cost category, 2000000.000000 of operating cost excluded from the base, and a flat corporate charge of 0.625000 percent as a separate case.

The fixture's other terms (a default, a carry recovery, a back-in, a non-consent operation and a PSC variant) belong to the later tiers.

## What is planted in it

The fixture was built so that each rule of this tier shows up. Among its planted situations:

* the January over-call is credited in March, two months later;
* April (forecast 0) and May (below the threshold) make no call, and May's actual is billed in June;
* geology and geophysics overruns by exactly its 10 percent tolerance and is inside;
* exploration drilling is beyond its item tolerance, and the budget is beyond the lower of 5 percent and 3,000,000;
* 2,000,000 of operating cost is excluded from its overhead base.

Each planted situation is found by the engine behaviour this tier teaches: the adjustment of a cash call, the threshold and billing in arrears, the item boundary, the budget total, and the overhead exclusions.

## Why synthetic data

A real joint venture's books are confidential, and no real set of books shows every rule at once. A synthetic venture can be built so that every rule fires, and every figure the course quotes can be recomputed by the same engine on your screen, to six decimals.

## Exercise

Open the account calculator. In the view "Cash calls", find the lag, the negative call rule and the threshold in the three controls above the box, and check each against the list above. In "Budget control", start from "The Ekene 2027 budget" and check the four tolerance controls. In "Operator overhead", start from "The Ekene 2031 overhead" and find the `excluded` key in the box. Write down, for each view, one planted situation from the list that you can see in the output.
