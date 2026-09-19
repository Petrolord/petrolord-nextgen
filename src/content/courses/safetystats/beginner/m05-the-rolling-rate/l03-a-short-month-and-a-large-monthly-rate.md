# A short month and a large monthly rate

{{panel:ss-rates-explorer}}

AKASO's month 11 was short: 18240 hours, with 1 recordable. Its own rate is 10.964912 per 200,000 hours. In the first twelve month window the rolling rate is 1.208038, and the mean of the twelve monthly rates is 2.026485. The short month is the reason those two numbers are so far apart.

| month | recordables | hours | monthly rate per 200,000 |
| --- | --- | --- | --- |
| 1 | 2 | 212400 | 1.883239 |
| 2 | 1 | 198750 | 1.006289 |
| 3 | 0 | 224310 | 0.000000 |
| 4 | 3 | 205880 | 2.914319 |
| 5 | 0 | 0 | none: no hours |
| 6 | 1 | 219960 | 0.909256 |
| 7 | 2 | 231040 | 1.731302 |
| 8 | 0 | 208520 | 0.000000 |
| 9 | 1 | 196330 | 1.018693 |
| 10 | 2 | 214670 | 1.863325 |
| 11 | 1 | 18240 | 10.964912 |
| 12 | 0 | 222150 | 0.000000 |

## One month with the weight of a full one

Month 11 had one recordable in a small fraction of a normal month's hours. Its own rate, 10.964912, is several times higher than any other month's. That is what one event over very few hours looks like. It says little about how safe month 11 was, because one event is one event, and the same recordable in a full month such as month 2 reads 1.006289.

In the rolling rate, month 11 counts for its hours. It adds 1 to the window's count and 18240 to the window's hours, and the window's rate barely notices. In the mean of the monthly rates, month 11's rate of 10.964912 enters with the weight of a full month. It is one of eleven rates averaged, and it pulls the mean up hard. That is why the mean of the monthly rates sits above the rolling rate in every window.

| window | rolling rate | mean of monthly rates |
| --- | --- | --- |
| 1 | 1.208038 | 2.026485 |
| 2 | 1.209454 | 2.028541 |
| 3 | 1.207931 | 2.027310 |
| 4 | 1.306019 | 2.111567 |

Every window contains the short month, and in every window the gap is there. The gap is steady because the cause is steady: the same short month sits in all four windows.

## What the engine prints beside it

The engine returns the mean of the monthly rates beside each rolling rate, labelled, so a reader who wants to see the gap can. Its note says what the mean is for:

"meanOfPeriodRates is shown for comparison only; a period with no hours has no rate and is left out of that mean"

The second half of the note is why eleven rates are averaged in window 1 and twelve are pooled. Month 5, the shutdown, has no hours and so no rate, and the mean leaves it out. The rolling rate includes it, but it adds nothing to either sum.

## The choice, and its alternative

Averaging monthly rates is the obvious way to build a rolling figure from a monthly report that prints only rates. The engine does not do it, and the reason is on this page. A short month, a partial month at start up or a month cut short by a shutdown gets the same say as a full month of work. One event in a short month then moves a twelve month figure more than several events in full months would. Summing the counts and the hours gives every hour worked the same weight, which is what a rate over a year should mean.

## Exercise

Multiply month 11's 1 recordable by 200,000 and divide by 18240, and check you reach 10.964912. Then look at window 1 in the table and divide the mean of 2.026485 by the rolling rate of 1.208038. Write one sentence saying which single month is responsible for most of that gap, and one saying which of the two figures you would report as AKASO's rolling rate.
