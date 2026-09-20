# Conditioning on the total count

{{panel:ss-intervals-explorer}}

ERHA east recorded 6 events in 240500 hours and ERHA west recorded 11 in 902700 hours. The engine compares them without ever estimating the common rate:

| what the engine returns | value |
| --- | --- |
| expectedProportion, east hours over all hours | 0.210374 |
| east share of the events, derived | 0.352941 |
| lowerTail, P(east count <= observed) | 0.951727 |
| upperTail, P(east count >= observed) | 0.128104 |
| pValue, central two-sided | 0.256209 |

Together the two sides recorded 17 events. Everything in the table follows from that total and the hours.

## The trick in one step

If the two sides share one true rate, that rate is unknown and would have to be estimated before anything could be tested. Conditioning removes it. Given that 17 events happened in total, and given equal rates, each event is equally likely to have landed in any hour worked. So each event lands on the east side with probability equal to the east share of the hours, and east's count out of 17 is binomial with that probability. The unknown rate has dropped out entirely.

This is the conditional exact test, and the engine names it in its own method line:

> conditional exact binomial test (Przyborowski and Wilenski 1940), central two-sided p-value (twice the smaller tail, capped at 1), Clopper-Pearson rate-ratio interval

## Reading the two tails

With the east share of the hours at 0.210374, the binomial says how many of the 17 events east should expect and how unusual its actual 6 is. The lower tail, the probability of 6 or fewer, is 0.951727. The upper tail, the probability of 6 or more, is 0.128104. The two overlap at exactly 6, which is why they add to more than one.

East saw a larger share of the events, 0.352941, than of the hours, so the upper tail is the small one. The central p-value is twice that smaller tail, 0.256209. Module five explains that convention.

## Why no base is taken

`compareRates` has no base argument. A ratio of two rates on the same base cancels the base, so the engine asks for counts and hours only. The same comparison would read identically whether the two sides reported on 200,000 hours or 1,000,000. That is one fewer way to make a mistake, and the engine takes it.

## What conditioning costs

The test uses only the split of the events. A comparison with few events in total has little to split, and the binomial on a small total is coarse. The ERHA total of 17 is modest, which is part of why the test finds no clear difference here. The lessons that follow show how that shows up in the rate-ratio interval.

## Exercise

Open the intervals explorer on the comparison view and enter ERHA east's 6 events in 240500 hours against west's 11 in 902700 hours at confidence 0.95. Confirm the lower tail of 0.951727 and the upper tail of 0.128104. Then state which tail is the smaller, double it, and compare your figure with the engine's central p-value of 0.256209. If the two differ in the last decimal, say why doubling a figure already rounded to six decimals can do that.
