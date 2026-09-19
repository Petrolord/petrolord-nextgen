# The mean of rates is another number

{{panel:ss-rates-explorer}}

KWALE's three site rates are 1.171189, 0.840001 and 3.253090 per 200,000 hours. Their mean is 1.754760. The pooled rate for the same field is 0.968312. The mean of the rates is 1.812185 times the pooled rate, and both are printed by the engine for the same data.

| what | value |
| --- | --- |
| pooled rate, `rate` | 0.968312 |
| mean of the site rates, `meanOfPeriodRates` | 1.754760 |
| mean over pooled, derived | 1.812185 |
| weight of each site in the mean of rates, derived | 0.333333 |
| jetty's share of the hours, derived | 0.024805 |

## Where the gap comes from

The mean of rates gives each site the same weight, one third, 0.333333. The pooled rate gives each site its share of the hours. The jetty worked 61480 of the field's 2478540 hours, a share of 0.024805. In the mean of rates the jetty counts for a third of the answer. In the pooled rate it counts for its small share of the hours.

The jetty also has the highest site rate on the field, 3.253090, from a single recordable in very few hours. The mean of rates lets that one small site pull the average up. The mean of rates weights a jetty crew like a flow station, and the flow station worked 1904760 hours to the jetty's 61480.

## The engine returns both, and labels them

The engine returns the mean of the period rates beside the pooled rate, labelled, so a reader can see both. Its own note says which one is the pooled rate:

"meanOfPeriodRates is the unweighted mean of the per-period rates over periods with hours; it is NOT the pooled rate"

That is the engine's declared choice. The alternative, reporting the mean of the site rates as the field rate, is easy to compute from a table of site figures and common in practice. The engine does not take it, because the mean of rates describes no workforce. The pooled rate is the rate of the whole workforce: the events that happened over the hours worked.

## The same gap in the IOGP figures

IOGP's yearly fatal accident rates from 2020 to 2024 are 0.550271, 0.746540, 1.279566, 0.820324 and 0.769438. Their mean is 0.833228. The five year rate by sum then divide is 0.826095, and that is the figure IOGP computes. The gap is much smaller than KWALE's, because the five years' hours are far less unequal than KWALE's sites. The size of the gap depends on how unequal the hours are.

| year | fatalities | hours | FAR that year |
| --- | --- | --- | --- |
| 2020 | 14 | 2544201000 | 0.550271 |
| 2021 | 20 | 2679026000 | 0.746540 |
| 2022 | 33 | 2579000000 | 1.279566 |
| 2023 | 27 | 3291382000 | 0.820324 |
| 2024 | 32 | 4158877000 | 0.769438 |

## Why this matters in a report

A group safety report that averages its sites' rates makes this mistake on every page: a small site with one bad month can drag a group average up, and a large site can barely move it. When you are handed a rate for several sites or years, ask which one it is. If it is a mean of rates, ask for the counts and hours and pool them.

## Exercise

Add KWALE's three site rates and divide by three, and check you reach 1.754760. Then divide 1.754760 by the pooled 0.968312 and confirm 1.812185. Finally, divide the jetty's 61480 hours by the field's 2478540 and confirm the share of 0.024805. Write one sentence explaining why that share, set against a weight of 0.333333, is the whole reason the two numbers differ.
