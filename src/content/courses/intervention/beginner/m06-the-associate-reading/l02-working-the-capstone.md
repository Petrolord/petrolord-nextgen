# Working the capstone

There is a right order for this work. Most of what goes wrong at this tier comes from doing the steps in the wrong one.

{{panel:pd-diagnostic-explorer}}

## Fit the raw history before you choose anything

The Associate reading is `logLogSlope` on a whole ratio history, with no late window, no fraction and no classifier anywhere near it. Hand in every sample you were given, in producing days against the ratio. Do not run the diagnosis first and read its slope back out: that number was fitted on a window and this one is not.

## Take all four continuous members, in one pass

Slope, intercept, fit quality and span come out of one call and belong together. Write them at full precision rather than rounding on the way, the way the published power law returns 1.350000000000, 1.308332819650, 1.000000000000 and 2.000000000 over eleven points. Fit quality is a fraction in the return object and a percentage in the module's own error sentences, so say which you are quoting.

The intercept is ln y where ln x is zero, so it lives at x = 1 and is a coefficient rather than a level. Take exp of it if you want the coefficient.

## Count the points the fit used, against the points you supplied

The n that comes back is the count after every non-positive y has been dropped, and nothing announces the drop. Compare it against the length of your own array. If they differ, the reported span is short of the span you handed in and the fit is describing a subset. That comparison is the only warning you will get.

## Build the geometry group in one direction

Take the natural log of the drainage radius over the wellbore radius, subtract 3/4, then add the skin. Only then compute the floor, the same group with the skin removed and the sign flipped. On the published geometry, re = 2000.000000 ft and rw = 0.350000 ft, that gives ln(re/rw) = 8.650724584041 and a floor of -7.900724584041.

Keep radii in ft and the skin dimensionless. The group adds the skin undivided, so a skin entered with the wrong sign moves the answer more than any plausible error in the radii.

## Check the contract the function actually uses

| Step | What passing looks like |
| --- | --- |
| History | Every sample, in days against the ratio |
| Fit | Four members recorded together, full precision |
| Point count | Equal to the samples you supplied |
| Span | Stated in log cycles beside the slope |
| Group | ln(re/rw) less 3/4 plus skin, in that order |
| Floor | Read through `Number.isFinite` |

`skinPiMultiplier` reports failure as ok = false with a sentence. The group, the floor and the inverse return a bare NaN with nothing said, so a call site testing only for an ok flag carries the NaN forward and prints it as an answer.

## Exercise

Work a ratio history through this order and write one line per step: the sample count you supplied, the four fit members, the point count returned, the span, the group and the floor.

Then name the step that, done out of order, leaves every later number defensible on its own and the reading wrong.
