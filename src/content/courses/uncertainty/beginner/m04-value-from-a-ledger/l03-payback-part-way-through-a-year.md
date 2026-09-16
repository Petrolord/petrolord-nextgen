# Payback part way through a year

Payback is the time, counted from the start of the first year, until the undiscounted cumulative net cash flow stops being negative. The engine reads it part way through the crossing year, so ISIALA pays back at 3.2746 years, a little over a quarter of the way into 2030.

{{panel:ec-screening-explorer}}

## Reading it by hand

Find the first year whose cumulative is no longer below zero, take the shortfall carried into it, and divide by that year's net cash flow.

| year | index | ncf | cumulativeNCF |
| --- | --- | --- | --- |
| 2027 | 0 | -17.8210 | -17.8210 |
| 2028 | 1 | -26.7825 | -44.6035 |
| 2029 | 2 | 35.9654 | -8.6381 |
| 2030 | 3 | 31.4546 | 22.8165 |

The cumulative first reaches zero in index 3, which is 2030. The shortfall carried in is -8.6381 and 2030 earns 31.4546, so payback is 3 + 8.6381 / 31.4546 = 3.2746, the engine's own number. The index counts whole years already finished, and the fraction assumes the crossing year's cash arrives evenly through it.

## The published cases

The goldens pin the rule at its edges.

| case | shape | engine payback | paybackStatus |
| --- | --- | --- | --- |
| payback_spend_then_earn | -100 then +150 | 1.6667 | ok |
| payback_exact_recovery | -100 then +100 | 2.0000 | ok |
| payback_first_period_positive | positive from the first period | 0.0000 | no-investment |
| payback_never | never recovers, life 5 | null | not-recovered |
| payback_recrossed_after_crossing | -100, 50, -30, 20 | 1.6667 | recrossed |

The first is the E1 correction: -100 then +150 pays back two thirds of the way through the second period, 1.6667 years. Reaching exactly zero counts as recovered, so -100 then +100 pays back at 2.0000, the end of the second period. A case that never recovers reports null and says not-recovered. One that recovers and falls back reports its first crossing, 1.6667, says recrossed, and prints paybackLast 3.6000.

## Payback ignores the discount rate

Payback uses the undiscounted cumulative, so the rate cannot touch it. On the 10 year base case every discount rate sweep from 0 to 20 percent returns 3.1115. Price does move it, and the price sweep exposes the gap between recovery and value: at 40 USD per bbl the case pays back at 8.4377 years while its NPV is -123.6336. A project can return its money in nominal terms and still destroy value.

## The mistake

Three readings go wrong. The first is to take payback without the status beside it. ISIALA's Low scenario reports payback null with paybackStatus not-recovered, and before the 2026-09-15 repair it reported 20.0000, its own project life, which reads like recovery in the final year.

A payback of 0.0000 is two situations wearing one number. The edge field OKPOMA earns 9.2498 in 2027, spends its second half of capex in 2028 and closes that year at a cumulative of -2.2287. Payback is the first crossing, so it still reads 0.0000, with paybackStatus recrossed and paybackLast 2.0385, where the money is back for good. A field that was never under water reads 0.0000 too, with no-investment.

The third is quoting payback as a calendar year. 3.2746 is a duration from the start of 2027; it lands in 2030, and "payback in 2030" and "payback of 3 years" both throw away the part of the year that the engine worked out.

## What it refuses

Payback says nothing about cash after the crossing: ISIALA earns another sixteen years of positive net cash flow that payback never sees. It uses no discount rate. It reports two moments and no more, the first crossing and the last, so a cumulative that dips three times is described by the same two numbers.

## Exercise

Read ISIALA's payback from the cumulative column by hand and confirm 3.2746. Then give OKPOMA's cumulative after 2027 and after 2028, its payback, its paybackStatus and its paybackLast, and say what each of the three adds.
