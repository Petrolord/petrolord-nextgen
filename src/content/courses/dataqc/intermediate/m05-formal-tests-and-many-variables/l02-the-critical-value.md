# The critical value from the t distribution

{{panel:dq-outliers-explorer}}

Grubbs' test compares G with a critical value that depends on the sample size, the significance level and the side of the test. The engine computes it from Student's t distribution, as NIST/SEMATECH 1.3.5.17.1 gives it:

critical = (N - 1) / sqrt(N) x sqrt(t^2 / (N - 2 + t^2))

where t is the upper alpha / (2N) point of Student's t on N - 2 degrees of freedom for the two-sided test, and the upper alpha / N point for a one-sided test. G above the critical value rejects.

The engine's critical values at alpha 0.05, beside the largest G any sample of that size can produce:

| n | two-sided critical at 0.05 | one-sided critical at 0.05 | largest possible G |
| --- | --- | --- | --- |
| 6 | 1.887145 | 1.822120 | 2.041241 |
| 8 | 2.126645 | 2.031652 | 2.474874 |
| 10 | 2.289954 | 2.176068 | 2.846050 |
| 14 | 2.507321 | 2.371654 | 3.474396 |
| 20 | 2.708246 | 2.556581 | 4.248529 |
| 30 | 2.908473 | 2.745132 | 5.294651 |

## Working the fourteen plugs

At N = 14, two-sided, alpha 0.05, the tail probability is alpha / (2N), which the engine returns as 0.001786. The t point with that upper tail on 12 degrees of freedom is 3.611249. Put t into the formula and the critical value is 2.507321. The core plugs' G of 2.985356 is above it, so the test rejects.

The engine exports its helpers `studentTUpperQuantile` and `regularizedBeta`, so the t point can be checked on its own.

## Why alpha is divided by N

G is the largest of N standardised deviations. If each one had probability alpha of being extreme, the chance that the largest of them is extreme would be much more than alpha. Dividing alpha by N, and by 2N for two sides, is a correction for looking at the most extreme of many. A fixed threshold of 3 draws the same line however many values were examined.

## Reading the table

The critical value rises with n. A larger sample is expected to produce a larger maximum by chance, so the bar for calling one extreme goes up. At n = 6 it is 1.887145 two-sided; at n = 30 it is 2.908473.

The one-sided critical is lower than the two-sided one at every n, because a one-sided test looks in one direction only and so spends all of alpha there. Use it only when the direction was decided before the data were looked at, such as a screen agreed in advance for high readings only.

The last column is the ceiling of module one, the largest absolute z a sample of n values can produce: 2.846050 at ten values and 3.474396 at fourteen. At every n in the table the critical value sits below the ceiling, so at those sizes Grubbs' test can reject at alpha 0.05. The z threshold of 3 could not be reached at ten values; the Grubbs critical of 2.289954 can.

## The critical value ignores the data

The critical value depends on n, alpha and the side only. The values the rows were run on do not enter it. Two different sets of fourteen plugs at alpha 0.05, two-sided, face the same 2.507321. The table above can be read for any data of that size.

## Exercise

Open the explorer's Grubbs view with the core plugs at alpha 0.05, two-sided, and read the t point used, 3.611249, and the critical value, 2.507321. Put t, N = 14 and the formula above into a calculator and reproduce the critical value. Then switch the side to the largest value and confirm that the critical value becomes the one-sided 2.371654.
