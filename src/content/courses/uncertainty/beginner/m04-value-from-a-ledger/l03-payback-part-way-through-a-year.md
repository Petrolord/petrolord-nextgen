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

| case | shape | engine payback |
| --- | --- | --- |
| payback_spend_then_earn | -100 then +150 | 1.6667 |
| payback_exact_recovery | -100 then +100 | 2.0000 |
| payback_first_period_positive | positive from the first period | 0.0000 |
| payback_never | never recovers, life 5 | 5.0000 |
| payback_zero_period_after_negative | a zero period right after the crossing | 1.8333 |

The first is the E1 correction: -100 then +150 pays back two thirds of the way through the second period, 1.6667 years. Reaching exactly zero counts as recovered, so -100 then +100 pays back at 2.0000, the end of the second period.

## Payback ignores the discount rate

Payback uses the undiscounted cumulative, so the rate cannot touch it. On the 10 year base case every discount rate sweep from 0 to 20 percent returns 3.1115. Price does move it, and the price sweep exposes the gap between recovery and value: at 40 USD per bbl the case pays back at 8.4377 years while its NPV is -123.6336. A project can return its money in nominal terms and still destroy value. Discounted at 12 percent, ISIALA would take longer to recover, and the engine does not report that figure.

## The mistake

Three readings go wrong, and each prints a clean number. A payback equal to the project life means never: payback_never reports 5.0000 on a five period life, and ISIALA's Low scenario reports 20.0000 on its twenty year life. Read that as recovery in the last year and a project that never recovers looks merely slow.

A payback of 0.0000 means the cumulative was non-negative in the first year, and the engine never looks again. The edge field OKPOMA earns 9.2498 in 2027, spends its second half of capex in 2028 and closes that year at a cumulative of -2.2287. Payback still reads 0.0000, because once the cumulative has crossed the reading is not revisited.

The third is quoting payback as a calendar year. 3.2746 is a duration from the start of 2027; it lands in 2030, and "payback in 2030" and "payback of 3 years" both throw away the part of the year that the engine worked out.

## What it refuses

Payback says nothing about cash after the crossing: ISIALA earns another sixteen years of positive net cash flow that payback never sees. It uses no discount rate, it reports no second crossing if the cumulative dips again, and a value equal to the life cannot tell a project that recovered at the very end of its final year from one that never recovered.

## Exercise

Read ISIALA's payback from the cumulative column by hand and confirm 3.2746. Then give OKPOMA's cumulative after 2027 and after 2028, its reported payback, and explain why that reading is wrong.
