# Sample or population standard deviation

{{panel:dq-outliers-explorer}}

There are two standard deviations in common use, and they differ only in what they divide by. The sample standard deviation divides the sum of squared deviations by n - 1. The population standard deviation divides it by n. The engine lets the caller choose, and it names the choice in the result's basis block.

The EKENE-3 gauge readings under each:

| what | sample SD | population SD |
| --- | --- | --- |
| mean | 215.250000 | 215.250000 |
| standard deviation | 8.732220 | 8.284111 |
| z of entry 7 | 2.845783 | 2.999718 |
| largest absolute z | 2.845783 | 2.999718 |
| flags at the threshold 3 | 0 | 0 |

## What changes and what does not

The mean is the same in both columns, because the choice touches only the spread. The population standard deviation, 8.284111 degF, is smaller than the sample one, 8.732220, because it divides by the larger number. A smaller spread in the denominator makes every z larger, so entry 7 moves from 2.845783 to 2.999718. It still does not pass 3, and neither column flags anything.

## Why the engine defaults to the sample standard deviation

The ten readings are a sample of what the gauge could have recorded. The sample standard deviation is the estimate of the spread that statistics texts use for a sample, and it is the one NIST/SEMATECH 1.3.5.17 uses to define the z-score. The engine takes that definition as its default so a result can be checked against the published page. The alternative, dividing by n, treats the ten readings as the whole population of interest. A caller who means exactly that can pass `sd: 'population'` and the engine will use it and say so.

The default is a choice, and the engine writes it into the basis block. Neither standard deviation is wrong. They answer slightly different questions, and a report has to say which one it used.

## The ceiling moves with the choice

The next lesson shows that a sample of n values cannot produce a z larger than a fixed ceiling. That ceiling depends on the standard deviation chosen, and the engine's basis block names which ceiling it applied. With the sample SD the ceiling is (n - 1) / sqrt(n). With the population SD it is sqrt(n - 1).

The engine's own worked case: nine zeros and a one, with `sd: 'population'` and a stated threshold of 2.9.

| setting | ceiling, `maxPossibleAbsZ` | `thresholdReachable` | flags | statistic of the one |
| --- | --- | --- | --- | --- |
| population SD, threshold 2.9 | 3.000000 | true | 1 | 3.000000 |
| sample SD on the same ten values | 2.846050 | | | |

A flag carries its figures twice, as numeric fields and inside a reason sentence that prints every digit of the computed statistic. This course quotes the numeric field at six decimals, so the flagged value's `statistic` reads 3.000000 here, and module six shows the reason string that goes with it. Whenever you report a z, quote the field and name the standard deviation it was measured against.

## Exercise

In the explorer's z view, type nine zeros and a one. Run it with the sample standard deviation and read the largest possible absolute z, 2.846050. Switch the selector to the population standard deviation, set the threshold to 2.9, and confirm the ceiling of 3.000000 and the single flag. Write one sentence for a report that states which standard deviation you used and why.
