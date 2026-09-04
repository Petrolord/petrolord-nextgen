# Working the capstone

BOMU-17 is worked in a fixed order. A step taken out of that order still returns a number that looks fine on its own, which is why the order is the work.

{{panel:pd-channel-explorer}}

## Count before you fit

Count the samples and check each carries a finite time and ratio. Fewer than six and the reading is refused outright: "A Chan reading needs a history, not a handful of points. Six producing samples is the bare minimum and a useful reading wants far more."

## Fit the raw history whole, before any window

Take the slope, the intercept, the fit quality, the point count and the span off the unwindowed history first, then set the count returned against the samples you handed in. `logLogSlope` drops every point whose value is not strictly positive, fits what survives, and reports the count after the drop without saying a drop happened.

## Set the window on purpose

Use the fraction you were asked for, not the default of 0.5, and read the window start back out of the result in days. The fraction is clamped to the range 0.1 to 1.0 with nothing naming the substitution, so identical window starts across different typed fractions are the clamp's only signature.

## Take both slopes and both point counts

The ratio slope is fitted over every late sample, the derivative slope over the late samples with a positive derivative only. The span field describes the derivative fit rather than the window, so quote the window start beside it. Check both against their gates first: a minimum fit quality of 0.5 as a fraction, a minimum span of 0.4 log cycles.

## Compare, then read the flags rather than inferring them

The derivative slope alone picks the mechanism, against a channelling boundary of 1.3. Record the margin as a signed number. The ambiguous band of 0.25 runs from 1.050000 to 1.550000 on that slope, and confidence and the ambiguous flag come out of the object, not out of your comparison.

## Price the alternative, then screen

`skinPiMultiplier` takes the two radii and the skin before and after, and returns an object with an ok flag and the geometry floor inside it. `pssDenominator`, `minimumSkin` and `skinFromPiRatio` hand back a bare NaN instead, so test for a finite value at every call site. Screen last, recording for each treatment the verdict, the blocked flag, the reason count and the block reason.

| Step | What passing looks like |
| --- | --- |
| Samples | Counted, times and ratios finite |
| Whole-history fit | Count checked against samples handed in |
| Window | Fraction used and start in days, both written down |
| Slopes | Both quoted, with the count each was fitted on |
| Margin | Signed, against 1.3, band checked |
| Multiplier | From an ok result, floor beside it |
| Screening | Verdict, blocked flag, reasons, block reason |

Units: days, ft for radii, a bare ratio for water-oil, scf/stb for gas-oil, percent for water cut, log cycles for spans, fit quality as a fraction, no unit on a slope.

## Exercise

Work one history through this order and write one line per step.

Then name the step that, taken out of order, leaves every later number defensible and the conclusion wrong.
