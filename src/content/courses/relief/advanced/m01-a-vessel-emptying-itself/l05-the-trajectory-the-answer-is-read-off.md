# The trajectory the answer is read off

This route does not return an answer. It returns a curve, and the answer is something you read off it. That distinction is the reason the march exists in this form, and it changes what you are able to ask.

{{panel:fc-blowdown-explorer}}

## What the march actually did

On AFIESERE as stated the march took 2685 steps at a time step of 0.100000 s, subdivided 0 of them, and returned 270 stations. Each station carries a time, a pressure and a temperature.

Notice the three counts. 2685 steps against 270 stations means the trajectory is thinned before it is handed back, to one station a second on this case, which is enough to draw a curve with and coarser than the march that produced it. The step count and the step size are returned alongside it so the thinning cannot mislead you about how the march was actually run.

## Why a curve and not a number

A depressuring study asks more than one question of the same run.

The time to the end pressure is the headline, and on AFIESERE it is 268.419002 s. But a fire study wants to know where the vessel was after a set interval rather than when it finished, and a metallurgy question wants the temperature at a pressure rather than at a time. Both are readings off the same stations. A route that returned only 268.419002 s would force a second call for each of them, on inputs that might not match.

| row | time s | pressure psia | temperature degR |
| --- | --- | --- | --- |
| 0 | 0.000000 | 1240.000000 | 545.000000 |
| 7 | 70.000000 | 673.744535 | 476.918145 |
| 14 | 140.000000 | 380.316049 | 420.840135 |
| 21 | 210.000000 | 222.032848 | 374.101352 |
| 27 | 268.419002 | 145.000000 | 340.807983 |

Those rows come from the listing of every tenth station, so they stand ten seconds apart and the last of them is the end of the march.

## The mass, which the curve does not carry

The stations carry no mass. The march reports the mass at the two ends only: 3469.2925 lb at the start, 648.7449 lb remaining, a fraction of 0.813004 of the inventory removed.

That is a real limit of the return, because an inventory profile is a thing people want and you cannot read one off this call. What you can do is call the march repeatedly at different end pressures, which is how the digest builds its end-pressure table, and which is also the honest way to get any quantity a route does not return.

## The reading habit this module wants

Read the fields the march returns about itself before you read the answer. The step size, the step count, the subdivided count, the choked floor and the warning are all there so that you can decide whether the number you are about to quote deserves quoting. A time read off a march whose warning you did not look at is a time you are guessing about.

The next module reads the time off the curve properly, against a customary limit that this engine has never heard of.

## Exercise

Record the step count, the step size, the subdivided count and the number of stations for AFIESERE as stated. Explain in two sentences why the route returns a trajectory rather than a single time, and name one question you can answer from the stations and one you cannot. Then record the two masses and the fraction removed, and say how you would obtain an inventory profile from this route.
