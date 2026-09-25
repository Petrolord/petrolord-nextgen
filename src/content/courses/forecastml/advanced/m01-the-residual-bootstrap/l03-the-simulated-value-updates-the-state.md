# The simulated value updates the state

{{panel:pf-uncertainty-explorer}}

In the engine's bootstrap the simulated rate is fed back into the method's recursion, so the level and the trend of each path change before its next step. This lesson follows one path through that loop.

## The loop on one path

The damped method's recursion, in the words of its basis:

> damped trend (Gardner and McKenzie 1985): f_t = l_{t-1} + phi b_{t-1}, l_t = alpha y_t + (1 - alpha) f_t, b_t = beta (l_t - l_{t-1}) + (1 - beta) phi b_{t-1}; forecast l_n + (phi + ... + phi^h) b_n

A path starts from the fitted final level l_n and trend b_n. At step 1 it forms the one-step forecast f = l_n + phi b_n, draws a residual, and adds it: that sum is the path's simulated rate for the first month past the series. The simulated rate then plays the part of y_t in the recursion. The level moves toward it by alpha, and the trend moves by beta toward the change in level. Step 2 forecasts from that new state, draws again, and updates again. The parameters stay at their fitted values on every path; only the states move.

## An early draw carries forward

Suppose a path draws a large negative residual at step 1. Its simulated rate sits below the forecast, so its level falls further than the fitted level would, and its trend becomes more negative. At step 2 its one-step forecast starts lower and falls faster, whatever it draws next. Each path carries all its earlier draws.

Across 1000 paths this makes the percentiles fan out. The P10 (high) less the P90 (low) of the teaching run, damped on EKENE-P1, seed 11, 1000 paths:

| step | P90 (low) | P10 (high) | P10 less P90 |
| --- | --- | --- | --- |
| 1 | 174.139087 | 225.708211 | 51.569125 |
| 6 | 83.953419 | 262.377587 | 178.424168 |
| 12 | 0.000000 | 324.803671 | 324.803671 |

At step 1 each path holds one draw, and the width reflects the spread of the residuals alone. By step 6 each path holds six, each one moving the state the next one starts from, and the width is 178.424168 bbl/d. At step 12 the P90 (low) is reported as 0, so the width equals the P10 (high).

## What the loop holds fixed

The paths vary the future rates. They do not vary the parameters: alpha, beta and phi are fitted once, on the whole series, and held for every path. The course lists this among what is not built: the bootstrap carries no parameter uncertainty. A bootstrap that also resamples the parameters is an alternative in common use; the engine's choice replays the method's own errors and assumes no distribution for them.

## The point forecast draws no residual

The point forecast comes from the fitted final state with no residual added, so it is the forecast of a path that draws 0 at every step. Whether it sits near the middle of the paths depends on the residuals themselves, the subject of this module's last lesson.

## Exercise

Open the view "Bootstrap intervals" with EKENE-P1, damped, seed 11 and 1000 paths. Set h to 1, then 6, then 12, and at each setting write down the P10 (high) less the P90 (low) at the last step. Repeat the three settings with ses. Describe, in two sentences, how the width grows with the step for each method, and give the method, seed and paths with each figure.
