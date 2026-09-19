# The rate ratio and its interval

{{panel:ss-intervals-explorer}}

The ERHA comparison, east over west, as the engine returns it:

| what the engine returns | value |
| --- | --- |
| rateRatio, east over west | 2.047326 |
| rateRatioLower, 95 percent | 0.621694 |
| rateRatioUpper, 95 percent | 6.039396 |
| upperUnbounded | false |
| pValue, central two-sided | 0.256209 |

East's rate is 2.047326 times west's. The interval runs from 0.621694 to 6.039396, and it includes 1.

## What the ratio is

The rate ratio is east's rate divided by west's, both on the same base. Because the base cancels, the engine computes it from the counts and hours alone: 6 events in 240500 hours over 11 events in 902700 hours. A ratio of 1 means equal rates. A ratio above 1 means east is worse, and below 1 means east is better.

A ratio is often more useful to a manager than a difference in rates. It reads the same whichever base the two sides reported on, and it answers the question most comparisons are really asking: how many times worse is one side than the other?

## Where the interval comes from

The engine's method line names it as a Clopper-Pearson rate-ratio interval. The conditional test already turned the comparison into a binomial: east's 6 out of 17, against an expected share of 0.210374 set by the hours. Clopper-Pearson is the exact interval for that binomial share, built the same central way as the Garwood interval, with half the miss in each tail. Each limit on east's share of the events is then converted back into a ratio of rates using the hours. The result is an interval on the rate ratio that is exact in the same sense the Garwood interval is.

## Reading this interval

The lower limit, 0.621694, is below 1. The upper limit, 6.039396, is well above it. So at 95 percent the data are consistent with east having a rate somewhat below west's, the same as west's, or six times west's. The point estimate of 2.047326 sits inside that range, and nothing in the data picks it out as the truth.

The p-value of 0.256209 agrees. It is above 0.05, and the interval includes 1. Both say the data do not rule out equal rates at 95 percent. Module five shows that this agreement is designed in, and what happens under a convention that breaks it.

## Why the interval is so wide

East has 6 events and west 11. The ratio inherits the uncertainty of both counts, and the smaller count dominates, just as the single count dominated the IMO ladder. A ratio built on counts in the single figures will almost always have a wide interval. A report that quotes 2.047326 by itself tells the reader east is about twice as bad. The interval tells the reader that the data cannot say so.

## Exercise

Open the comparison view and enter ERHA east's 6 in 240500 hours against west's 11 in 902700 hours at confidence 0.95. Confirm the rate ratio and both limits. Then swap the two sides so west is the first group, record the ratio and its limits, and check that each new figure is one over one of the old ones. State which old limit became which new one.
