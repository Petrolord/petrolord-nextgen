# Intervals that widen with every step

{{panel:pf-uncertainty-explorer}}

The bootstrap intervals in this course grow as the steps go out. The reason is the state update of the first module: each path carries all its earlier draws, so the paths fan out as the steps pile up. This lesson measures the fan on the teaching run and says how to report it.

## The width, step by step

The width of an interval here is the P10 (high) less the P90 (low). On the teaching run, damped on EKENE-P1, seed 11, 1000 paths:

| step | P90 (low) | P10 (high) | P10 less P90 |
| --- | --- | --- | --- |
| 1 | 174.139087 | 225.708211 | 51.569125 |
| 6 | 83.953419 | 262.377587 | 178.424168 |
| 12 | 0.000000 | 324.803671 | 324.803671 |

At step 1 the width is 51.569125 bbl/d and reflects one draw per path. By step 6 it is 178.424168, and by step 12 it is 324.803671. The damped point forecast falls over the same steps, from 204.969642 to 169.556510, far more slowly than the interval widens.

## A width that the zero rule shapes

At step 12 the P90 (low) is reported as 0, so the width equals the P10 (high). Once a low case is reported as 0, the width stops measuring the spread of the paths below the median and measures only the high side. When a width matters to a decision, read it with `nonNegative` false as well, and say which one you quote.

## The high side, at three path counts

The widening is a property of the method's residuals and the state update, and more paths do not remove it. Damped on EKENE-P1, h 12, seed 11, the P10 (high) at step 12 is 308.081207 with 100 paths, 324.803671 with 1000 and 314.738791 with 10000. The figure moves with the paths, and it stays far above the point forecast at every count.

## The horizon has its own rule

The bootstrap forecasts at least one step. An h of 0, which `fitSmoothing` accepts and answers with an empty forecast, is refused here, naming the field `h`:

> h must be a whole number from 1 to 10000

The top of the range is the engine's cap on any horizon. A wide interval at step 12 is an honest statement that the method's own errors, replayed, leave the rate that far from certain.

## What to report

Report an interval at the steps a decision needs, with the method, seed, paths and `nonNegative` setting, and give the width at the last of them. A single figure for the whole horizon hides the widening.

## Exercise

Open the view "Bootstrap intervals" with EKENE-P1, damped, seed 11 and 1000 paths. Set h to 24 and read the P90 (low) and P10 (high) at steps 1, 12 and 24. Then open "Seeds, paths and clipping" with the same well, method and seed, nonNegative false, and read the P90 at step h for h 12 and h 24. Write two sentences on how the width grows, and on how the zero rule changes the width you would quote.
