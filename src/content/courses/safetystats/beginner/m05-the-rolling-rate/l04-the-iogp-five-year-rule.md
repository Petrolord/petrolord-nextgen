# The IOGP five year rule

{{panel:ss-rates-explorer}}

IOGP computes its five year rolling fatal accident rate as the sum of fatalities over the sum of hours. For 2020 to 2024 the engine's figure is 0.826095 per 100,000,000 hours, matching the golden with a relative difference of 0. Averaging the five yearly rates gives 0.833228 instead.

| year | fatalities | hours | FAR that year |
| --- | --- | --- | --- |
| 2020 | 14 | 2544201000 | 0.550271 |
| 2021 | 20 | 2679026000 | 0.746540 |
| 2022 | 33 | 2579000000 | 1.279566 |
| 2023 | 27 | 3291382000 | 0.820324 |
| 2024 | 32 | 4158877000 | 0.769438 |

## A rolling window of five years

The IOGP five year rule is a rolling window of 5 years. Put the five years into the engine's rolling rate with a window of 5, on the 100,000,000 hour base, and it returns 1 window, because five years of data hold exactly one complete five year window. That window's rate is 0.826095, the same figure the pooled rate gives for the same five years.

| what | value |
| --- | --- |
| five year FAR, sum then divide | 0.826095 |
| mean of the five yearly FARs | 0.833228 |
| rolling windows from five years and a window of 5 | 1 |

A rolling rate is a pooled rate over a window. When the window covers the whole series there is one window, and its rate is the pooled rate.

## Why the gap is small here

On AKASO the mean of monthly rates sat far above the rolling rate, because one short month had a large rate and the weight of a full month. On the IOGP years the gap between 0.833228 and 0.826095 is much smaller. None of the five years is short. The hours run from 2544201000 in 2020 to 4158877000 in 2024, so 2024 carries more weight in the pooled figure than 2020 does, and its rate of 0.769438 is below the mean. That pulls the pooled figure a little under the mean of rates.

A small gap is still a gap. Quote the first figure, 0.826095, because it is the rate over every hour worked in the five years, and it is the figure IOGP itself computes. Quote the mean of rates only when you are showing why it differs.

## Why five years

A single year's fatal accident rate rests on a few dozen fatalities across the industry. The five yearly rates in the table run from 0.550271 in 2020 to 1.279566 in 2022, and much of that movement is what a small count does from year to year. A five year window pools more events and more hours into one figure, which moves less from one year to the next than any single year does. How much less, and how sure anyone can be of a rate built on a few dozen events, is the question the next tier of this course asks.

## Updating the window

When a new year's figures arrive, the window moves on: the oldest year drops out, the new one comes in, and the rate is again the sum of five years' fatalities over the sum of their hours. It is AKASO's monthly rule on a longer period and a larger base.

## Exercise

Open the rates explorer's rolling view on the 100,000,000 hour base. Type the five IOGP years from the table with a window of 5, and confirm the engine returns a single window reading 0.826095. Then switch to the pooling view with the same five years and confirm the pooled rate is the same. Finally, add the five yearly rates, divide by five, compare with 0.833228, and write one sentence saying which figure you would quote and why.
