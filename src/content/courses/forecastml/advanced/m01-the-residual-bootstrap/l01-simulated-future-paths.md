# Simulated future paths

{{panel:pf-uncertainty-explorer}}

A point forecast is one number per future month. The Expert question is how far the months to come could stray from it, and whether a data-driven forecast beats the Arps decline baseline once both are tested on the same months. This module answers the first half with the residual bootstrap in `forecastIntervals`, the engine's only source of intervals.

## What the function does

`forecastIntervals` fits the method exactly as `fitSmoothing` does, with every parameter you leave out fitted and every parameter you give held fixed. It then simulates future paths, 1000 of them when `nSims` is left out. Its point forecast is exactly the fitted method's h-step forecast, so nothing about the point forecast changes when you ask for an interval.

Each path starts from the fitted final level and trend. At every step it takes the method's one-step forecast, adds one residual drawn at random from the fitted residuals, and treats the sum as the rate for that month. The next step starts from there. After all the paths are drawn, the engine sorts the simulated rates at each step and reads three percentiles from them: P90 (low), P50 and P10 (high).

## The teaching bootstrap

The course's teaching run is damped on EKENE-P1, every parameter fitted (alpha 0.657029, beta 0.353869, phi 0.960949), h 12, seed 11, 1000 paths. A selection of its steps:

| step | point forecast | P90 (low) | P50 | P10 (high) |
| --- | --- | --- | --- | --- |
| 1 | 204.969642 | 174.139087 | 206.724356 | 225.708211 |
| 2 | 201.071747 | 159.918632 | 198.955730 | 228.840629 |
| 6 | 186.944047 | 83.953419 | 175.633354 | 262.377587 |
| 12 | 169.556510 | 0.000000 | 137.469798 | 324.803671 |

Read a row as three statements about the 1000 simulated rates at that step. At step 1 the damped point forecast is 204.969642 bbl/d, a tenth of the paths sit at or below 174.139087, half at or below 206.724356, and nine tenths at or below 225.708211. By step 12 the spread runs from 0.000000 to 324.803671. The zero is a reported value: the next module shows that a negative percentile is reported as 0 and counted.

## What comes back

Beside the point forecast and the three percentile arrays, the result carries the size of the residual pool it drew from, the count of percentiles reported as 0, the seed and the number of paths, and a basis that states the bootstrap in the engine's own words.

## Quoting an interval

A bootstrap figure depends on the draws, so the course quotes it with its method, its seed and its number of paths. "P10 (high) 225.708211 at step 1" is incomplete on its own; "damped on EKENE-P1, seed 11, 1000 paths, P10 (high) 225.708211 at step 1" names a result anyone can reproduce bit for bit. The lessons that follow take the machinery apart: the seeded stream, the state update, the pool, and the lean the residuals can give every path.

## Exercise

Open the view "Bootstrap intervals" with EKENE-P1, method damped, h 12, seed 11 and 1000 paths. Read the point forecast, P90 (low), P50 and P10 (high) at steps 1, 6 and 12 and check them against the table. Then switch the method to holt, keep the seed and the paths, and write one sentence on how the spread at step 12 compares with damped's, quoting the method, seed and paths with every figure you write down.
