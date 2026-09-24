# Repeats and their spread

{{panel:ml-diagnose-explorer}}

A permutation is a random draw, so one shuffle gives one reading of a feature's importance. The engine shuffles each feature several times, `nRepeats`, and reports the mean drop and its spread. This lesson reads the repeats, the spread and the seed, and why an importance is always quoted with both.

| feature | mean drop, seed 5 | mean drop, seed 6 | SD over the repeats, seed 5 |
| --- | --- | --- | --- |
| GR | 4.747694 | 4.954327 | 0.315115 |
| RHOB | 1.754752 | 1.752107 | 0.112173 |
| NPHI | 3.786311 | 3.651470 | 0.323271 |
| CALI | -0.031931 | -0.022098 | 0.026894 |

## Five repeats of GR

On the teaching setting, with 5 repeats and seed 5, GR's five drops in test RMSE are 4.955540, 4.682248, 4.227650, 4.704944 and 5.168088 us/ft. Their mean is 4.747694 and their SD 0.315115. The SD is the population SD of the 5 drops, divided by n. That is the same divisor the course's scaler uses, and it describes the spread of these five draws; it is no standard error of the mean.

The five drops run from 4.227650 to 5.168088: that range is what a single shuffle could have reported as GR's importance. The mean gathers the five, and the SD says how far they scatter. Read both whenever two features' means are to be ranked against each other, and read them for every feature, CALI included, whose SD of 0.026894 sits beside a mean of -0.031931.

## One stream for the whole call

The engine draws every permutation from one mulberry32 stream seeded by `seed`, the platform's canonical random number generator. Features go in column order and repeats inner: GR's five shuffles, then RHOB's five, then NPHI's, then CALI's. Each shuffle is Fisher-Yates from the end over the row order, and row i then takes the feature's value from row perm[i]. The engine's basis states it: "mulberry32(seed), one stream for the call; features in column order, repeats inner; Fisher-Yates from the end over the row order; row i takes the value from row perm[i]".

Because it is one stream, the drops depend on the seed and on nRepeats together: a run with a different number of repeats draws a different sequence of shuffles for the features after the first, and so can read different drops even at the same seed.

## A different seed

With seed 6 the mean drops read GR 4.954327, RHOB 1.752107, NPHI 3.651470 and CALI -0.022098. Every mean moved, and the ranking is GR, NPHI, RHOB, CALI, the same as at seed 5. Quote an importance with its seed and its repeats: "GR, mean drop 4.747694 us/ft in test RMSE, 5 repeats, seed 5". Without them the figure cannot be reproduced, and a reader comparing it with a figure from another run cannot tell whether the difference is the model or the draw.

## Exercise

Open the panel on the importance view with the teaching defaults. Run it at permutation seed 5 and then at seed 6, and confirm the two sets of means above. Then set the repeats to a larger number of your own choosing, run it at seed 5, and write down each feature's mean and SD. Say in one sentence which of the four means moved most when the repeats changed.
