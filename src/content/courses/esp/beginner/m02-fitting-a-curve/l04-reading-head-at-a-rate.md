# Reading head at a rate

Reading head is one polynomial evaluation, at a rate that is usually not the one you asked about.

{{panel:pd-stage-explorer}}

## The reference curve at 60 Hz

At the reference frequency the duty rate and the reference rate are the same, so the read is direct.

| Rate, bbl/d | Head, ft | Efficiency |
| --- | --- | --- |
| 1500 | 31.985714 | 0.54942857 |
| 1750 | 31.423214 | 0.62630357 |
| 2000 | 30.557143 | 0.68228571 |
| 2250 | 29.387500 | 0.71862500 |
| 2500 | 27.914286 | 0.73657143 |
| 2750 | 26.137500 | 0.73737500 |
| 3000 | 24.057143 | 0.72228571 |
| 3250 | 21.673214 | 0.69255357 |
| 3500 | 18.985714 | 0.64942857 |

Head falls across the range and falls faster as the rate rises. The first step takes it from 31.985714 ft at 1500 bbl/d to 31.423214 ft at 1750 bbl/d. The last step, the same distance in rate, takes it from 21.673214 ft at 3250 bbl/d to 18.985714 ft at 3500 bbl/d. That steepening is why an error in the duty rate costs more at the top of the range than at the bottom.

## Off the reference frequency

At any other drive speed the engine does not read at the rate you asked about. It divides by the speed ratio, reads the reference curve at the equivalent rate, then multiplies head by the square of the ratio.

A duty of 2500 bbl/d at 50 Hz maps to 3000.000000 bbl/d on the 60 Hz curve and returns 16.7063492063 ft. The same 2500 bbl/d at 60 Hz maps to itself and returns 27.9142857143 ft. Two readings, one duty rate, and the gap is not small.

## Where the read comes from

Head at a rate is `polyEval` on the head fit and nothing else. There is no interpolation between vendor points, no lookup table and no bracketing. The number is whatever the cubic says at that value of z, which is why fit quality is the whole story: whatever the cubic got wrong at the points, it gets wrong between them too.

## The mistake

Reading the 60 Hz curve at the duty rate when the drive is not at 60 Hz. That hands back 27.9142857143 ft where the answer at 50 Hz is 16.7063492063 ft, and it looks reasonable because both numbers are heads on the same curve.

The tell is the equivalent rate. A reference rate different from the duty rate means the affinity mapping has happened. The same one means either the drive is at 60 Hz or something is wrong.

## What it refuses

At zero frequency the speed ratio is not positive, so head comes back NaN with a region of `invalid` and inside the published range false. Everywhere else it hands back a number, including rates the vendor never measured.

## Exercise

Read head at 1750, 2500 and 3250 bbl/d at 60 Hz and note how far apart the readings sit at each end.

Then read 2500 bbl/d at 50 Hz, write down the equivalent rate the panel reports, and say which reference rate 16.7063492063 ft came from.
