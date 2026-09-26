# The paired bootstrap

{{panel:ae-scoring-explorer}}

A mean over 23 queries would come out differently on another 23 queries. The bootstrap estimates how differently, using only the queries in hand: it resamples them with replacement many times, recomputes the statistic each time, and reads an interval from the spread of the results. The engine's bootstrap is seeded, so a seed and a replicate count name its result exactly, and the same inputs give the same interval on any machine.

## One system's mean

The engine states its resampling in the basis: 2000 replicates of 23 values drawn with replacement, each index drawn as floor(u x 23) from one mulberry32(7) stream, replicate by replicate, and each replicate's statistic its mean. The interval is read from the sorted replicates with the platform's one quantile rule.

| system | mean nDCG at 5 | seed | replicates | level | 2.5th percentile of the bootstrap mean | 97.5th percentile of the bootstrap mean | standard error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | 0.762753 | 7 | 2000 | 0.95 | 0.653604 | 0.852644 | 0.051501 |
| B | 0.764137 | 7 | 2000 | 0.95 | 0.666871 | 0.847238 | 0.046104 |

Each bound is a percentile of the bootstrap distribution of a mean, and the engine labels it that way: "2.5th percentile of the bootstrap mean". The two intervals overlap almost entirely.

## The difference, paired

Comparing two systems is a question about their difference. The paired bootstrap draws 23 query positions per replicate and averages A minus B at those positions, so both systems always see the same queries. At seed 7, 2000 replicates and level 0.95, on nDCG at 5, linear gain, grade 1 or more:

| comparison | difference A minus B | 2.5th percentile of the bootstrap difference | 97.5th percentile of the bootstrap difference | standard error | share at or below 0 |
| --- | --- | --- | --- | --- | --- |
| nDCG at 5, paired | -0.001384 | -0.068015 | 0.058726 | 0.032083 | 0.511000 |
| nDCG at 5, unpaired | -0.001384 | -0.133554 | 0.128297 | 0.066811 | 0.505000 |

The paired interval runs from -0.068015 to 0.058726. It crosses 0: on these 23 queries the data do not separate the two systems. The unpaired interval runs from -0.133554 to 0.128297, and the course derives its width as 0.261851 against the paired 0.126741. It ignores that both systems answered the same queries, so the query-to-query variation that cancels in each pair is left in, and the interval roughly doubles. The paired result is exactly the bootstrap of the per-query differences on the same seed, which the course checked bit for bit.

## The share at or below 0

The share is 0.511000, the share of paired replicates in which A did not beat B. It is a count of replicates, and the engine does not call it a p-value; this course never does either.

## A seed names the result

On seed 8 the same paired nDCG interval is -0.063543 to 0.055562. The bounds move a little and the conclusion does not. A bootstrap figure is quoted with its seed, its replicate count and its level, because each of the three changes it.

## Stated inputs

The seed is a required input, a whole number from 0 to 4294967295. Without one the engine refuses to draw:

> seed must be a whole number from 0 to 4294967295

The level must be one of the four the engine accepts:

> level must be 0.8, 0.9, 0.95 or 0.99

## Exercise

Open the view for two systems and the paired bootstrap with its defaults: A's and B's per-query nDCG, seed 7, 2000 replicates, level 0.95, paired. Read the difference, both bounds, the standard error and the share against the table. Set paired to no and read them again. Set paired back to yes and the seed to 8, and compare. Finally clear the seed and read the refusal.
