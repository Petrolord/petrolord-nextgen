# Choosing lambda

{{panel:dq-monitor-explorer}}

lambda sets how much of each new reading the EWMA takes and how long it remembers the old ones. On EKENE-3's forty monitored days, with the target and sigma from phase one and L 3, lambda 0.100000 first signals low on day 28 and signals on 18 days; lambda 0.200000 first signals low on day 22 and signals on 15; lambda 1.000000 also first signals low on day 22 and signals on 2.

| lambda, stated | asymptotic half-width, psi, derived | first low signal day | days signalling |
| --- | --- | --- | --- |
| 0.100000 | 2.597488 | 28 | 18 |
| 0.200000 | 3.774063 | 22 | 15 |
| 0.300000 | 4.756270 | 22 | 10 |
| 0.500000 | 6.536869 | 22 | 5 |
| 1.000000 | 11.322188 | 22 | 2 |

## Reading the table

Read the rows from top to bottom. The half-width of the limits grows, from 2.597488 psi at lambda 0.100000 to 11.322188 at lambda 1.000000, because a larger lambda lets the EWMA swing further with each reading and the limits have to allow for it. The days signalling fall from 18 to 2 down the same rows. The first low signal is day 28 at lambda 0.100000 and day 22 in every other row.

## lambda 1 is the individuals chart

At lambda 1 the EWMA is the reading itself and the limits are target +/- 3.000000 sigma, derived: the individuals chart on phase one's standard. That row's 2 days are the individuals chart's own low signal on day 22 and its high one on day 8. The other rows add memory, and with memory comes the run of low signals from the shifted days.

## What a small lambda does

A small lambda remembers long. It gathers a small, persistent shift into the EWMA and signals on it for longer; on EKENE-3, lambda 0.100000 signals on 18 days. The same memory makes it slow: its first low signal comes on day 28. A larger lambda answers faster to a large change and forgets it sooner. No row of the table is right in general. Each is a trade between how quickly a chart answers and how small a shift it holds on to.

## A choice, stated

lambda does not appear among the engine's defaults. The chart takes it as an input, the EKENE-3 value of 0.2 is stated for this course, and a monitoring plan states its own with a reason. The reason is the size of shift the plan most needs to catch and how quickly it needs to know. Whatever is chosen is written into the plan before phase two begins; choosing lambda after looking at which value gives the preferred signals makes the chart say what the chooser wanted.

## Exercise

In the panel's EWMA view, set lambda to 0.100000 and confirm the first low signal on day 28. Then set it to 0.3 and to 0.5, and for each, list the days that signal. Write down which of the shifted days, from day 16 on, still signal at 0.5, and explain in two sentences what the chart lost as lambda rose.
