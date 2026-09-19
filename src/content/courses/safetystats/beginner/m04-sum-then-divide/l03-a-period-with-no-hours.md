# A period with no hours

{{panel:ss-rates-explorer}}

Add a mothballed fourth site to KWALE, with 0 hours and 0 events. The pooled rate stays 0.968312. The mothballed site's own period rate comes back as null. The result reports `periodsWithoutHours` as 1, and the mean of the rates over the sites with hours stays 1.754760.

| what, with the mothballed site listed | value |
| --- | --- |
| pooled rate | 0.968312 |
| mothballed site's period rate | null |
| `periodsWithoutHours` | 1 |
| mean of the rates over sites with hours | 1.754760 |

A site with no hours and no events contributes nothing. It adds 0 to the count and 0 to the hours, so the pooled rate does not move.

## Why the rate is null

A rate of zero is a statement: people worked, and nothing happened. A site with no hours makes no such statement. Nobody worked there, so there was nothing that could happen, and its rate is undefined. The engine returns null for that period to say exactly that. A zero there would be read as a clean safety record from a site that did no work.

The distinction matters most in the mean of the rates. If the mothballed site's rate were counted as zero, it would drag the mean down and make the field look safer. Because the engine leaves it out, the mean stays at 1.754760 over the three sites that worked, and `periodsWithoutHours` tells the reader one period was set aside.

## A rolling window with no hours

The same rule applies inside a rolling rate. Take three periods with 0, 0 and 5000 hours and 0, 0 and 1 events, and a window of two periods. The first window covers the two empty periods. It has no hours, so its rate is null and the engine gives the reason in its own words: "no hours in this window: the rate is undefined". The second window covers the second and third periods and reads 40.000000, and its mean of rates is also 40.000000.

| window | rate | mean of rates | the engine's returned reason |
| --- | --- | --- | --- |
| 1 | null | null | no hours in this window: the rate is undefined |
| 2 | 40.000000 | 40.000000 | null |

The window is still listed, with a reason, so a reader sees that a window existed and had nothing in it.

## When nothing has hours

If every period has zero hours, there is nothing to pool. The engine refuses the whole call and names the hours:

> exposureHours sum to zero: a rate over no exposure is undefined

That is the pooled version of the refusal a single rate gets for zero hours. One empty period among many is set aside; a series that is all empty has no rate at all.

## Exercise

Open the rates explorer's pooling view with KWALE's three sites and note the pooled rate of 0.968312. Add a fourth site with 0 events and 0 hours, and confirm the pooled rate does not move and the fourth period's rate reads null. Then set every site's events and hours to 0, and record the refusal the engine prints and the field it names.
