# The BLS case with its interval

{{panel:ss-intervals-explorer}}

The BLS worked example, with the interval the Associate tier left out:

| case | count | hours | base | rate | lower 95 | upper 95 | upper against golden |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BLS ABC Company recordables | 7 | 400000 | 200000 | 3.500000 | 1.407182 | 7.211338 | 7.39e-16 |

The BLS worked example's 3.5 is consistent, at 95 percent, with any true rate from 1.407182 to 7.211338 per 200,000 hours.

## The case

BLS publishes this example to show how a firm computes its incidence rate: 7 recordable cases in 400000 hours on the 200,000 base give 3.5. The Associate tier reproduced it through the engine as 3.500000. Nothing in the published example says how sure that figure is, because the example is about arithmetic. This lesson adds the part the example leaves unsaid.

## Where the limits come from

The count is 7, and the Garwood count limits at 95 percent are 2.814363051520 and 14.422675361702. Each is multiplied by the base over the hours, 200,000 over 400000, which is one half. The result is 1.407182 and 7.211338 per 200,000 hours. The upper limit agrees with the golden to 7.39e-16, which is agreement to the limit of double precision.

## What the interval says

7 cases is a small count. The upper limit is more than twice the rate and the lower limit is less than half of it. A firm reporting 3.500000 could have a true rate under half that figure or over twice it, and the count cannot tell which. Anyone ranking this firm against another would need to know that first.

The width relative to the rate is a property of the count. A firm with ten times the cases in ten times the hours would print the same 3.500000 and carry a far narrower interval. The engine would compute it in a moment. What the reader needs is a report that shows it.

## How it should read

The house form this course uses puts the rate, the base, the count and hours it came from, and the interval with its confidence in one line:

"3.500000 per 200,000 hours (7 cases in 400000 hours; 95 percent exact interval 1.407182 to 7.211338)"

Every part has a job. The base says what the number is per. The count and hours let a reader recompute it. The interval and its confidence say how far the true rate might be from the one printed.

## Why start the module here

The BLS example is the rate calculation most readers learn first. If the interval changes how it reads, it changes how every smaller workforce's rate reads, and most workforces are smaller than they think in the only sense that matters here: their counts.

## Exercise

Take the count limits for 7 at 95 percent, 2.814363051520 and 14.422675361702, and multiply each by 200,000 over 400000. Confirm that you reproduce 1.407182 and 7.211338. Then divide the upper limit by the rate of 3.500000 and the rate by the lower limit, and state which side of the rate the interval stretches further.
