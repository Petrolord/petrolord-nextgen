# Same seed, same answer

Run ISIALA's breakeven twice at seed 20260829 and the two samples match value for value. That is the whole of what the seed promises.

{{panel:ec-breakeven-explorer}}

## The proof on ISIALA

Two runs of 5000 iterations at seed 20260829 give identical samples: true. Both report a 10th percentile of breakeven price of 62.1713 USD/bbl, a median of 73.3297 and a 90th percentile of 85.5912. Change only the seed, to 7, and the median becomes 72.8475.

The same answer needs more than the seed. The beliefs, the production profile, royalty, tax, discount rate and target NPV must all match, and so must the iteration count. Change the count at the same seed and the percentiles move, because they are read off a sample of a different size:

| iterations at seed 20260829 | 10th percentile | median | 90th percentile |
| --- | --- | --- | --- |
| 100 | 61.1861 | 72.7058 | 86.3529 |
| 500 | 61.5530 | 72.9806 | 86.4976 |
| 1000 | 62.1241 | 72.9245 | 86.2728 |
| 5000 | 62.1713 | 73.3297 | 85.5912 |
| 20000 | 62.2724 | 73.0302 | 85.4380 |

The longer runs begin with exactly the shorter runs' iterations, draw for draw, and then add more. Only the sorted positions the percentiles are read from change.

## Reproducible is not accurate

The median does not creep steadily toward one value as iterations grow: 72.9245 at 1000, 73.3297 at 5000, 73.0302 at 20000. Across seeds 1 to 10 at 5000 iterations the medians span 72.6338 to 73.1287, and the default seed's 73.3297 is higher than every one of them. A reviewer who reruns at 20260829 gets 73.3297 every time, and it is still an unusually high draw of the median at that iteration count.

The published goldens show the same on another case. At 300 iterations, seed 1 gives a median of 176.5115 and seed 2 gives 179.4302, against a base case of 175.1500 for both.

## What the seed refuses

It refuses to average anything out, to report its own wobble, or to warn that a sample is small. The reproducibility sentence in the insight reads the same at 100 iterations as at 20000. The seed is a label on a sample, not a certificate on the answer.

## The mistake

The mistake is treating a matching rerun as validation. Two runs at 20260829 agreeing to four decimals proves that the inputs and the code did not change. It proves nothing about how close 73.3297 is to the distribution's true median. The opposite mistake is seeing 72.8475 at seed 7, calling the engine unstable and asking for a fix. Different seeds are supposed to differ. The size of that difference is the information, and it is read by running several seeds, never by picking one.

## Exercise

State the three percentiles of ISIALA's breakeven price at seed 20260829 over 5000 iterations, and the median at seed 7. List everything that must match for two runs to give identical samples. Then use the span of the ten seed medians to say how many decimals of 73.3297 a report should trust, and why.
