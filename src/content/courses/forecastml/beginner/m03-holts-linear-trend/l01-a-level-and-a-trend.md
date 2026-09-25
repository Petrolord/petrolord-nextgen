# A level and a trend

{{panel:pf-smoothing-explorer}}

Simple smoothing forecasts a flat line because it tracks only a level. Holt's linear trend adds a second state, the trend, which follows how the level changes from month to month. With a trend, the forecast can slope, and on a declining well it can fall.

## The recursion, in the engine's words

The basis of a Holt fit reads:

    Holt's linear trend: f_t = l_{t-1} + b_{t-1}, l_t = alpha y_t + (1 - alpha) f_t, b_t = beta (l_t - l_{t-1}) + (1 - beta) b_{t-1}; forecast l_n + h b_n

Read it one piece at a time. The fitted value for month t is last month's level plus last month's trend. The level update is the same weighted average as in simple smoothing, with alpha as the weight on the new rate. The trend update is a second weighted average: beta times the newest change in level, plus 1 - beta times the old trend. In this course "trend" always means this smoothed state b, in bbl/d per month.

## Alpha 0.5 and beta 0.2 on EKENE-P1

With both parameters given and held fixed:

| month t | rate y_t | fitted value f_t | residual | level l_t | trend b_t |
| --- | --- | --- | --- | --- | --- |
| 0 | 1176.100000 | null | null | 1176.100000 | -22.700000 |
| 1 | 1153.400000 | 1153.400000 | null | 1153.400000 | -22.700000 |
| 2 | 1078.600000 | 1130.700000 | -52.100000 | 1104.650000 | -27.910000 |
| 3 | 1005.200000 | 1076.740000 | -71.540000 | 1040.970000 | -35.064000 |
| 4 | 954.800000 | 1005.906000 | -51.106000 | 980.353000 | -40.174600 |
| 5 | 934.200000 | 940.178400 | -5.978400 | 937.189200 | -40.772440 |

Month 2's fitted value is month 1's level plus month 1's trend: 1153.400000 plus -22.700000 gives 1130.700000. The rate comes in at 1078.600000, lower still, so the level drops to 1104.650000 and the trend steepens to -27.910000. Over these months the trend keeps steepening as the well keeps surprising the method on the low side. By month 5 the fitted value is within a few bbl/d of the rate.

Months 0 and 1 carry no residual. Why month 1 is not scored is the subject of the next lesson.

## Beta, the trend's weight

Beta does for the trend what alpha does for the level. A large beta lets the trend swing with each month's change in level; a small beta keeps it steady and slow to respond. Like alpha, beta must lie from 0 to 1, and the engine refuses anything else by name:

> beta must be a number from 0 to 1 (inclusive)

Leave beta blank and the engine fits it inside that box, together with alpha if alpha is blank too.

## The forecast is a straight line

After the last month, Holt's h-step forecast is l_n + h b_n: the final level plus h times the final trend. Every step falls by the same amount, b_n, so the forecast is a straight line from the final state. That is the method's strength on a steady decline and, as a later lesson shows, its weakness on a well near the end of its life.

## Exercise

In the smoothing explorer choose "The recursion, month by month", load EKENE-P1, pick holt and give alpha 0.5 and beta 0.2. Check month 2's fitted value by hand from month 1's level and trend. Then give beta 0.8 and watch how much faster the trend moves over months 2 to 5.
