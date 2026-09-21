# Limits from the chi-square distribution

{{panel:ss-intervals-explorer}}

For a count of 7 at 95 percent, the engine reads two chi-square quantiles, halves them and gets the limits on the count:

| quantity at N = 7, 95 percent | value |
| --- | --- |
| chi-square lower quantile, 14 degrees of freedom | 5.628726103040 |
| half of it, the count lower limit | 2.814363051520 |
| chi-square upper quantile, 16 degrees of freedom | 28.845350723405 |
| half of it, the count upper limit | 14.422675361702 |

The engine's own countLower is 2.814363051520 and its countUpper is 14.422675361702, the same figures to all twelve decimals the digest prints.

## The formula and the method line

For a count N the limits are chi2(alpha/2; 2N)/2 and chi2(1 - alpha/2; 2N + 2)/2, and both are then multiplied by the base over the hours. The engine names its method in its own words:

> Garwood (1936) exact Poisson interval, chi-square form: [chi2(alpha/2, 2N)/2, chi2(1-alpha/2, 2N+2)/2] x base / exposureHours

Here alpha is one minus the confidence, so at 95 percent it is five percent, and alpha/2 is 0.025.

## Where the two degrees of freedom come from

The lower limit is the Poisson mean at which N or more events has probability alpha/2. That mean is a quantile of the gamma distribution of shape N. The upper limit is the Poisson mean at which N or fewer events has probability alpha/2, and that is a quantile of the gamma distribution of shape N + 1. Twice a gamma of shape k is a chi-square on 2k degrees of freedom. That one fact explains both the halves in the formula and the extra two degrees of freedom on the upper side: shape N becomes 2N degrees of freedom, and shape N + 1 becomes 2N + 2.

For N = 7 that is 14 degrees of freedom below and 16 above, which is exactly what the table shows.

## From a count to a rate

The count limits carry no base and no hours. The BLS worked example is 7 recordables in 400000 hours on the 200,000 base, so each count limit is multiplied by 200,000 over 400000, which is one half. The engine returns 1.407182 and 7.211338 per 200,000 hours around the rate of 3.500000. Those are half of 2.814363051520 and half of 14.422675361702, rounded to the six decimals this course prints for a rate.

That split is worth holding on to. The uncertainty lives entirely in the count. The base and the hours only rescale it, which is why the base you name changes the limits and the rate together and leaves their ratio alone.

## Why the word exact

Exact here means the limits come from the Poisson distribution itself, with no normal approximation standing in for it. The chi-square form costs nothing extra once the quantile function exists, and it holds at the small counts safety work usually has. The engine exports that function as `chiSquareQuantile`, beside `chiSquareQuantileUpper`, which a later lesson in this module explains.

## The Garwood table at a glance

At 95 percent on a base of 1 over 1 hour, a count of 0 gives limits of 0.000000000000 and 3.688879454114, a count of 10 gives 4.795388696132 and 18.390356042018, and a count of 100 gives 81.363991250923 and 121.626793792427. Each matches the golden to within a few parts in ten to the fifteen.

## Exercise

Take the count limits for N = 10 from the Garwood table, 4.795388696132 and 18.390356042018. Suppose those 10 events were recorded in 1000000 hours. Multiply each limit by 200,000 over 1000000 and compare your two figures with the IMO ladder's row for 10 events, which reads 0.959078 to 3.678071.
