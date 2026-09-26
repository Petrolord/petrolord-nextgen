# Bootstrap levels and their labels

{{panel:ae-trust-explorer}}

{{panel:ae-scoring-explorer}}

The Professional tier used a seeded bootstrap to put an interval on a mean over queries and on the difference between two systems. This lesson reads the rules around it.

## Four levels, four pairs of labels

`level` is one of four accepted values. Each interval is a percentile of a statistic, so each bound is labelled as a parameter percentile, and never with a P label, which the platform keeps for outcomes. System A's mean nDCG at 5, linear gain, grade 1 or more, on seed 7 and 2000 replicates:

| level | lower label (verbatim) | upper label (verbatim) | lower, A nDCG, seed 7 | upper |
| --- | --- | --- | --- | --- |
| 0.8 | 10th percentile of the bootstrap mean | 90th percentile of the bootstrap mean | 0.691350 | 0.822582 |
| 0.9 | 5th percentile of the bootstrap mean | 95th percentile of the bootstrap mean | 0.671684 | 0.838560 |
| 0.95 | 2.5th percentile of the bootstrap mean | 97.5th percentile of the bootstrap mean | 0.653604 | 0.852644 |
| 0.99 | 0.5th percentile of the bootstrap mean | 99.5th percentile of the bootstrap mean | 0.623984 | 0.877278 |

The intervals nest, because every bound is read from the same 2000 sorted replicates. A fixed list of levels keeps every label a well-formed ordinal. Any other level is refused, with the field named:

> level must be 0.8, 0.9, 0.95 or 0.99

## How a tail is read

The tails at level 0.95 are 0.025 and 0.975. In floating point, (1 - 0.95) / 2 lands a few bits above 0.025, which would move the quantile index off a whole number, so the engine rounds each tail to 12 decimals first. The index rule is the platform's one quantile, stated in the basis: idx = nBoot x p on the sorted values; when idx is whole and nBoot even, the bound is the mean of the idx-th and (idx+1)-th smallest. At 2000 replicates and 0.025 the index is 50, whole, so the lower bound is the mean of the 50th and 51st smallest replicate means.

The standard error beside the interval is the SD of the replicates with divisor nBoot - 1. With one replicate it has no value, and the engine returns it as null with the note:

> one replicate: the standard error is undefined

## The seed names the result

The bootstrap is the only random draw in the engine, and it is seeded. On seed 7 the paired nDCG interval for A minus B runs from -0.068015 to 0.058726; on seed 8 the same interval is -0.063543 to 0.055562. A bootstrap figure is quoted with its seed, its replicate count and its level, and then anyone can reproduce it bit for bit. The seed is required, and the refusals mark its range:

> seed must be a whole number from 0 to 4294967295

> nBoot must be a whole number from 1 to 100000

> values has 1 value: the bootstrap resamples at least 2

## The share at or below 0

The paired bootstrap also returns the share of replicates with a difference at or below 0. For nDCG on seed 7 it is 0.511000. A replicate of exactly 0 is counted, because "a does not beat b" includes a draw. The share is a count of replicates, and the engine does not call it a p-value.

## Exercise

Open the trust explorer on "A seeded bootstrap of a mean" with system A's nDCG values loaded. Step the level through 0.8, 0.9, 0.95 and 0.99 and confirm the table, labels included. Set nBoot to 1 and read the note; set the seed to -1 and read the refusal. Then open the scoring explorer on "Two systems and the paired bootstrap" and read the paired interval and share on seed 7 and on seed 8, each quoted with its replicates and level.
