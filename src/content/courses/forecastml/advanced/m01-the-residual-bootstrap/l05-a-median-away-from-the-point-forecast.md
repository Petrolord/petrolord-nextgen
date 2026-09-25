# A median away from the point forecast

{{panel:pf-uncertainty-explorer}}

The engine draws the residuals as fitted. It does not subtract their mean before it resamples, and its basis says so in these words:

> residuals are drawn as fitted without centring (their mean is not subtracted), so a method whose residuals have a non-zero mean drifts: on a declining well a flat method's paths can fall below its own point forecast

## Why a mean away from 0 makes the paths drift

Every path adds a drawn residual at every step, and the simulated value updates the state. When the residuals lean one way, every path leans with them, and the state carries the lean forward: a push down at step 1 is kept, and the next draw adds to it.

## A small lean: damped

On the teaching run, damped on EKENE-P1, seed 11, 1000 paths, the mean of the 46 residuals in the pool is -1.726983 bbl/d (derived). At step 1 the P50 is 206.724356 against a point forecast of 204.969642, a little above it. By step 12 the P50 is 137.469798 against 169.556510, below it. Read the middle of the paths from the percentiles themselves, step by step.

## A strong lean: ses

ses on EKENE-P1 shows the drift plainly. Its alpha fits to 1, so each one-step forecast is the month before, and each residual is a month-to-month change of the decline. Their mean is -20.525532 bbl/d (derived). ses has no trend, so its point forecast is flat at the last month's rate. ses on EKENE-P1, h 12, seed 11, 1000 paths, nonNegative false, so negative percentiles are left as simulated:

| step | ses point forecast | P90 (low), unclipped | P50, unclipped | P10 (high), unclipped |
| --- | --- | --- | --- | --- |
| 1 | 211.400000 | 157.500000 | 198.900000 | 213.200000 |
| 6 | 211.400000 | 8.050000 | 89.850000 | 160.650000 |
| 12 | 211.400000 | -145.100000 | -31.700000 | 69.250000 |

The unclipped P50 falls by 20.258333 bbl/d a step on average over the 12 steps (derived). The residuals carry the decline that the flat method leaves out, and the paths replay it. At step 12 the flat point forecast, 211.400000, lies above even the P10 (high) of the paths, 69.250000.

## Neither number is wrong

The point forecast is the method's, computed from the fitted final state. The paths are the method's residuals, replayed. Both are faithful to the method; they disagree because the method's errors lean one way. A point forecast outside its own interval is a finding about the method on this well: here, a flat method on a declining well.

## The alternative, and the engine's choice

A centred bootstrap subtracts the residual mean before resampling, so the draws average to 0. It is the alternative in common use. The engine's stated reason for its own choice is that no distribution is assumed and the method's own errors are replayed. The course prints no centred run, so it quotes no figure for one.

In a forecast note, report the point forecast and the percentiles together, name the method, seed and paths, and say plainly when the point forecast falls outside the interval.

## Exercise

Open the view "Seeds, paths and clipping" with EKENE-P1, method ses, h 12, seed 11, 1000 paths and nonNegative false. Check the P50 and the P10 (high) at step 12 against the table and compare them with the flat point forecast. Then switch the method to damped and repeat. Write two sentences: which method's point forecast sits outside its own P90 to P10 range, and what the residuals of that method on this well explain about it.
