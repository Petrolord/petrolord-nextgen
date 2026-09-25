# Shut-in months dropped before the fit

{{panel:pf-uncertainty-explorer}}

A shut-in month has a rate of exactly 0. The smoothing methods take it as a value like any other and run their recursion through it. The Arps fit works on the log, the reciprocal or a negative power of each rate, and none of those is defined at zero. The decline curve engine therefore drops zero and negative rates before it fits, and the forecasting engine says so in its basis:

> fitArpsModel drops zero and negative values (shut-in months) before fitting

## EKENE-P2, three months at zero

EKENE-P2 is shut in for months 22 to 24, counted from 0, at rate 0, and a workover lifts its rate from month 25 on. The Arps fit uses 45 of its 48 months: the 3 shut-in months are dropped.

The months after the shut-in keep their own time index. Month 25 is still passed as day 25, so the gap stays in the time axis. The fit sees a decline with three points missing, followed by rates the workover has lifted.

## What the fit makes of it

Auto-Select on EKENE-P2 returns a hyperbolic fit with qi 979.700443, Di 0.057021 per month and b 0.950000, with R2 0.963683. The generator stated qi 950, Di 0.05 and b 0.3 for this well's underlying decline, before the shut-in and the uplift were planted on it. The fit reads every positive month, the lifted ones included, so it answers a different question from the one the generator was set: it finds the single Arps curve that best follows the whole record, workover and all. A b this far from the stated one is a hint that one Arps curve does not describe the whole history, which the next module tests on the same origins.

## Where t = 0 sits

Time starts at the first positive value. Put two months of 0 in front of the same well (stated) and the basis reads:

> step k is passed as day k, so qi is per step and Di per step; t = 0 at index 2, the first positive value

The result carries `t0Index` 2, drops 2 months, and returns `fitted` as null before index 2. qi is then the rate at index 2, the first month that produced.

## Too few positive months

Dropping zeros can leave too little to fit. `fitArpsModel` needs at least 3 positive values. Two months passed are refused, naming the field `y`:

> y has 2 values: fitArpsModel needs at least 3 positive values

Five months with only two producing are refused the same way, with the count of positive values in the message:

> y has 2 positive values: fitArpsModel needs at least 3 (it drops zero and negative rates)

The boundary is 3 positive values fitted, with zeros around them dropped, and 2 refused.

## Exercise

Open the view "The Arps baseline" and start from EKENE-P2 with Auto-Select. Read the months dropped and first positive month tiles, and the fitted b. Then edit the series: put two values of 0 in front of it and run again, and read the same two tiles. Finally, cut the series to its first five months with three of them set to 0, and read the engine's words for the refusal.
