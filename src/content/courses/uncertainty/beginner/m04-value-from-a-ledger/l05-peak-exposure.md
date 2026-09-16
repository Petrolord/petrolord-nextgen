# Peak exposure

Peak exposure, printed as `maxExposure`, is the lowest point the undiscounted cumulative net cash flow reaches. On ISIALA it is -44.6035 million USD, the cumulative at the end of 2028, against a capex of 180.

{{panel:ec-screening-explorer}}

## Where it comes from

The engine walks the cumulative column and keeps its minimum. ISIALA's cumulative is -17.8210 after 2027, -44.6035 after 2028, -8.6381 after 2029 and positive from 2030. The deepest point is 2028, so peak exposure is -44.6035.

That is only about a quarter of the capex because the quick form produces from its first year. ISIALA spends 90.0000 of capex in 2027 but also sells 112.4200 of oil that year, so the hole is shallow. The 10 year base case has a development year with no revenue: 400.0000 of capex against gross revenue of 0.0000, and its peak exposure is the full -400.0000.

## The sign carries the meaning

| case | maxExposure | what it says |
| --- | --- | --- |
| ISIALA | -44.6035 | under water through 2029 |
| ISIALA Low scenario | -138.4263 | a far deeper hole |
| NTEJE | -169.0209 | closes at -154.5906, never recovers |
| OKPOMA | -2.2287 | dips below zero after a positive year |
| ISIALA High scenario | 25.0565 | never under water |
| payback_first_period_positive | 5.0000 | positive from the first period |

A positive peak exposure is the lowest cumulative of a project that was never below zero. ISIALA's High scenario, with capex scaled down and revenue up, earns more than it spends even in 2027 and bottoms out at 25.0565.

## The mistake

The careful mistake is to read the number as a size and drop its sign. Written as "exposure 25.0565", the High scenario looks like it needs funding when it needs none. The second mistake is to take peak exposure as the funding requirement. It is struck on annual rows, so a capex bill paid in the first months of 2027 against oil sold later that year can put the real trough deeper than the row shows. The third is to discount it: `maxExposure` is plain cash, and it will not agree with the discounted rows.

It also does not say when. OKPOMA's trough is 2028, after a 2027 that closed at 9.2498, and the metric prints -2.2287 with no year beside it. The cumulative column is the only place the year can be read. ISIALA's trough is 2028 because 2029 is its first year of positive net cash flow, 35.9654, and the trough year is when the money must already be in place.

## What it refuses

Peak exposure carries no financing cost, no interest on the hole and no time value. It reports one minimum, so a project that dips twice shows only the deeper dip. It says nothing about recovery either: NTEJE's peak of -169.0209 and its closing cumulative of -154.5906 are both negative, and neither figure alone reveals that the project never recovers.

## Exercise

Write ISIALA's cumulative after 2027, 2028 and 2029 and name its peak exposure. Then explain why ISIALA's High scenario prints a positive value, and why the 10 year base case's exposure equals its first year capex.
