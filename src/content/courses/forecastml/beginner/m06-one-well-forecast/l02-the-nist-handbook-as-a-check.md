# The NIST handbook as a published check

{{panel:pf-smoothing-explorer}}

Everything so far has been the engine checked against itself and against the course's own oracle. This lesson checks it against a source from outside the programme: the NIST/SEMATECH e-Handbook of Statistical Methods, which works exponential smoothing by hand on two small series and prints its figures.

## The source

The handbook's section 6.4.3 (sections 6.4.3.1, 6.4.3.2 and 6.4.3.4, at https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc43.htm, read 2026-09-24) is a public domain U.S. government publication. The engine's validation golden carries the handbook's inputs, and every figure below is the engine's own, run on those inputs, beside the figure the handbook prints.

Across 6 golden cases the handbook prints 64 figures, and the engine rounds to every one of them at the handbook's printed decimals. A selection:

| golden case | engine field | NIST printed | engine, six decimals | decimals printed by NIST |
| --- | --- | --- | --- | --- |
| nist-6431-ses-alpha-0.1 | fitted.1 | 71.00 | 71.000000 | 2 |
| nist-6431-ses-alpha-0.1 | fitted.11 | 71.67 | 71.665283 | 2 |
| nist-6431-ses-alpha-0.1 | mse | 19.0 | 18.983492 | 1 |
| nist-6431-ses-alpha-0.1 | forecast.0 | 71.50 | 71.498754 | 2 |
| nist-6434-holt-fit | params.alpha | 0.3623 | 0.362309 | 4 |
| nist-6434-holt-fit | params.beta | 1.0000 | 1.000000 | 4 |
| nist-6434-ses-fit | params.alpha | 0.977 | 0.977276 | 3 |
| nist-6434-ses-fit | forecast.0 | 22.4 | 22.378582 | 1 |
| nist-6434-ses-alpha-1 | mse | 8.8867 | 8.886667 | 4 |

## Why the figures agree

The first case is the handbook's 12-point series 71, 70, 69, 68, 64, 65, 72, 78, 75, 75, 75, 70, smoothed at alpha 0.1. The handbook starts the level at the first observation, as this engine does (l_1 = y_1), and divides its MSE by the scored errors, as this engine does. Same start, same divisor, same recursion: the figures agree to every decimal the handbook prints. The engine's MSE of 18.983492 prints in the handbook as 19.0, because the handbook prints one decimal there.

Compare to the printed precision, never beyond it. The handbook's 71.67 and the engine's 71.665283 agree at two decimals, which is all the handbook claims.

The case nist-6434-ses-alpha-1 is simple smoothing at alpha 1, the naive forecast of module two, on the handbook's second series. Its MSE prints as 8.8867 in the handbook and 8.886667 from the engine, agreeing at all four decimals printed. The case nist-6434-ses-fit is a fitted alpha: the handbook's 0.977 against the engine's 0.977276, agreeing at the three decimals the handbook prints.

## A published fit on a bound

The handbook's double smoothing example fits alpha 0.362309 and a trend weight of 1.000000, on its upper bound, so the engine lists "beta = 1" in `atBounds`. The handbook uses its own start for the trend, b_1 = 0.8, and the golden gives that start to the engine as `initialTrend`. With a different start the figures would differ. This is the start lesson of module three from the other side: to reproduce another tool, match its start first.

## Why a published check matters

An oracle written by the same programme can share a misunderstanding with the engine. A handbook written by other people, for other purposes, is far less likely to share it. Agreement with the handbook says that the recursion, the start and the MSE divisor mean what the literature means by them. It checks the arithmetic, and on the two fitted cases the search's answer on a short series. It says nothing about forecasting skill.

## Exercise

In the smoothing explorer choose "The recursion, month by month" and type the handbook's series 71, 70, 69, 68, 64, 65, 72, 78, 75, 75, 75, 70. Pick ses, give alpha 0.1 and read the fitted values at months 1 and 11. Switch to "Fit a method" with h 1 and read the MSE and the step 1 forecast. Round each to the handbook's decimals and compare with the table.
