# Efficiency at duty

Efficiency comes off a second cubic, fitted independently of the head cubic, and it is the number that turns hydraulic work into shaft work.

{{panel:pd-stage-explorer}}

## Two fits, one stage

The published vendor curve carries an efficiency at each of its five points: 55.00, 68.00, 74.00, 72.00 and 65.00 percent at 1500, 2000, 2500, 3000 and 3500 bbl/d. The efficiency fit is a cubic with coefficients -0.420571428583, 3.403333333388, -2.905000000079 and 0.571666666703, and a residual of 0.0021380899 fraction.

Four coefficients through five points cannot pass through any of them. The fit reads 0.54942857 at 1500 bbl/d and 0.73657143 at 2500 bbl/d, residuals of -0.00057143 and -0.00342857 fraction against the published 55.00 and 74.00 percent. The 74.00 percent point is the one the fit misses hardest.

## Across the published range at 60 Hz

| Rate, bbl/d | Efficiency, fraction |
| --- | --- |
| 1500 | 0.54942857 |
| 2000 | 0.68228571 |
| 2500 | 0.73657143 |
| 2750 | 0.73737500 |
| 3000 | 0.72228571 |
| 3500 | 0.64942857 |

The curve rises, turns and falls. Its peak sits at 2635.0000 bbl/d with a value of 0.739054805 fraction, found by a 400 step scan of the fit across the published range at a spacing of 5.0000 bbl/d, so the rate returned is a grid point and not a solved stationary point.

## Efficiency does not move with speed

Head scales with the square of the speed and brake power with the cube, but efficiency scales with nothing. At 50 Hz and 2500 bbl/d the equivalent rate on the 60 Hz curve is 3000.000000 bbl/d and the efficiency is 0.7222857143 fraction. Reading the 60 Hz curve at 3000 bbl/d gives 0.72228571. The same equality holds at 40 Hz and 3200 bbl/d, which maps to 4800 bbl/d and 0.2576457143 either way.

Efficiency is also blind to the fluid. At 1500 bbl/d and 60 Hz it reads 0.54942857 on a 1.00 specific gravity fluid and 0.54942857 on a 0.90 one.

## The mistake

Quoting the peak because the duty is near it. At 2500 bbl/d the stage is at 0.73657143 and not at 0.739054805, and at 2000 bbl/d it is at 0.68228571. Efficiency divides the brake power, so a peak quoted in place of a duty reading understates the shaft work at every stage in the stack.

## What it refuses

Given no efficiency points at all, the fit still succeeds and the head still reads 27.914286 ft at 2500 bbl/d, but the best efficiency rate comes back NaN and so does the brake power per stage. Asked for the best efficiency point with no efficiency fit behind it, both the rate and the head are NaN.

## Exercise

Read the efficiency at 2500 and 2750 bbl/d at 60 Hz and write both against the peak value and the peak rate.

Then read 2500 bbl/d at 50 Hz, write its equivalent rate on the 60 Hz curve, and say why the efficiency there is not the 60 Hz efficiency at 2500 bbl/d.
