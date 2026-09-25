# The quantile rule on sorted paths

{{panel:pf-uncertainty-explorer}}

After the paths are drawn, each step holds nSims simulated rates, sorted, and more than one rule is in use for reading a percentile from a sorted list. The engine uses the platform's one quantile, the `quantile` function of its statistics library, and states the rule in its basis:

> per step, lib/stats quantile at 0.1, 0.5, 0.9 of the simulated values (idx = nSims x p on the sorted values: idx not whole takes the ceil(idx)-th smallest, idx whole with nSims even the mean of the idx-th and (idx+1)-th, idx whole with nSims odd the (idx+1)-th); production is an outcome where more is better, so P90 (low) is the 10th percentile and P10 (high) the 90th

## The rule, one case at a time

The index is nSims times p. Three cases follow.

- The index is not a whole number: take the ceil(idx)-th smallest value.
- The index is whole and nSims is even: take the mean of the idx-th and the (idx+1)-th smallest.
- The index is whole and nSims is odd: take the (idx+1)-th smallest.

The rule applied to stated sorted values 1, 2, ..., n, through the same function the engine calls:

| n (stated) | idx = n x p at p = 0.1 | 10th percentile | 50th percentile | 90th percentile |
| --- | --- | --- | --- | --- |
| 10 | 1.000000 | 1.500000 | 5.500000 | 9.500000 |
| 9 | 0.900000 | 1.000000 | 5.000000 | 9.000000 |
| 1000 | 100.000000 | 100.500000 | 500.500000 | 900.500000 |
| 999 | 99.900000 | 100.000000 | 500.000000 | 900.000000 |

With n 10 the index at p 0.1 is 1, whole, and n is even, so the 10th percentile is the mean of the 1st and 2nd smallest, 1.500000. With n 9 the index is 0.9, which is fractional, so the 10th percentile is the 1st smallest. With n 1000 it is the mean of the 100th and 101st; with n 999 it is the 100th.

## What that means at the default

The default nSims is 1000, an even count, and 1000 times 0.1, 0.5 and 0.9 are all whole. So every percentile at the default is the mean of two simulated values. At step 1 of the teaching run, damped on EKENE-P1, seed 11, 1000 paths, the P90 (low) of 174.139087 is the mean of the 100th and 101st smallest simulated rates at that step, and the P10 (high) of 225.708211 is likewise the mean of two neighbouring sorted rates.

Change nSims to 999 and the rule changes case: every index is then not whole, and each percentile is a single simulated value. Because the stream runs path by path, the 999 paths are the first 999 of the 1000, so the comparison isolates the rule and one path.

## The alternative, and why it matters

Linear interpolation between neighbouring sorted values is the numpy default, and on the same sorted values it can give a different percentile. The engine keeps the platform's one quantile so that every percentile on the platform is read the same way.

The rule is exact on the sorted simulated values. There is no tolerance band on a percentile: the seed and nSims name the paths, and the rule names the value read from them.

## Exercise

Open the view "Bootstrap intervals" with EKENE-P1, damped, h 12, seed 11. Run it at 1000 paths and then at 999, and write down the P50 at step 1 for each. Then run 10 paths and 9 paths, and for each say which case of the rule gave the P90 (low): a mean of two values, or a single value, and which one.
