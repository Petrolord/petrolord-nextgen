# The level and the smoothing weight alpha

{{panel:pf-smoothing-explorer}}

Simple exponential smoothing keeps one number about a well: its level, the rate the method believes the well is producing now. Each month the level is nudged toward the newest rate, and alpha sets how hard. This lesson reads the recursion the engine runs and what alpha does to it.

## The recursion, in the engine's words

The engine states its method in the `basis` of every result. For simple smoothing it reads:

    simple exponential smoothing: f_t = l_{t-1}, l_t = alpha y_t + (1 - alpha) f_t; forecast l_n at every step

Two lines do all the work. The fitted value for month t is the level from the month before, f_t = l_{t-1}. Once month t's rate arrives, the new level is a weighted average of that rate and the fitted value it replaces. alpha is the weight the newest month gets, and 1 - alpha goes to the old forecast.

## Alpha 0.3 on EKENE-P1

With alpha 0.3, given and held fixed, each level is 0.3 of the new rate plus 0.7 of the forecast it replaces:

| month t | rate y_t | fitted value f_t | level l_t |
| --- | --- | --- | --- |
| 0 | 1176.100000 | null | 1176.100000 |
| 1 | 1153.400000 | 1176.100000 | 1169.290000 |
| 2 | 1078.600000 | 1169.290000 | 1142.083000 |
| 3 | 1005.200000 | 1142.083000 | 1101.018100 |

In month 1 the rate is 1153.400000 and the fitted value 1176.100000, so the level becomes 0.3 x 1153.400000 + 0.7 x 1176.100000, which is 1169.290000. That level is the fitted value for month 2, and the step repeats. The level moves toward each new rate by a fraction alpha of the gap, so on a falling well it trails the rates from above.

## Why it is called exponential

Unroll the recursion and every past month appears in today's level, with weights that shrink by a factor of 1 - alpha for each month further back. At alpha 0.3 the newest month carries 0.3 of the weight, the month before 0.7 times that, and so on. Old months never vanish, they just fade. A large alpha makes the level follow the newest rates closely; a small alpha averages over many months and reacts slowly.

## Alpha must lie from 0 to 1

A weight outside that range is not an average any more, and the engine refuses it by name. Alpha 1.2 and alpha -0.1 both return:

> alpha must be a number from 0 to 1 (inclusive)

Both ends are allowed. Alpha 0 and alpha 1 are real settings with plain meanings, and a later lesson in this module reads each. Leave alpha blank and the engine fits it inside that same box.

## Exercise

In the smoothing explorer choose "The recursion, month by month", load EKENE-P1, pick ses and give alpha 0.3. Check month 1's level by hand from the rate and the fitted value. Then give alpha 0.9 and read months 1 to 3 again: note how much closer each level sits to its month's rate. Finally type alpha 1.2 and read the refusal.
