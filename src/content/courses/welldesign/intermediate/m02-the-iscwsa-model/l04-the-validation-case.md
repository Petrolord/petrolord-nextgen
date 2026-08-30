# The validation case

One well, published to full precision, so that any implementation can be checked.

{{panel:wd-uncertainty-explorer}}

## What it is

The industry group that maintains the error model publishes an example well with its expected results. The well is 268 stations, 8000 m of measured depth, starting vertical and ending horizontal at 90 degrees on a 75 degree azimuth, reaching a true vertical depth of 3521.0557980706303 m.

Its header states a total field of 50000 nT, a dip of 72 degrees, a declination of minus 4 degrees, zero convergence, azimuths referenced to true north, and standard gravity.

The published results come in two forms: the per-source covariance entries at four depths, from the maintaining group's own workbook, and the totals at every station.

## Why it exists

Because a model described in a paper is not a model until two implementations agree on a number.

The weighting functions are trigonometric expressions with sign conventions, singular cases and frame choices. A plausible implementation can be wrong in a way that only shows up at high inclination or on a particular azimuth. The validation case exercises the whole range and publishes the answer.

## What the panel reports

The panel prints, in its closing note, how well this implementation does: how many published per-source values were checked, the worst relative error over all of them, and the worst relative error on the totals at total depth.

Read those numbers. They are the reason to believe anything else in this tier.

## Four depths, twenty-seven sources, six entries each

The workbook publishes the covariance entries at 1200, 2100, 5100 and 8000 m. Twenty-seven sources at four depths is a hundred and eight rows, each with six independent covariance entries, and the check compares all of them.

Four depths is a deliberate spread: 1200 m is still vertical, 2100 m is through the build, 5100 m is in the tangent and 8000 m is horizontal. Every inclination regime and every singular formulation is exercised.

## The Totals row

The workbook also publishes a row labelled Totals at each depth, which is the sum over sources. The check skips it, because it is not a source: including it would compare the sum against a source that does not exist.

That is a small thing and it is exactly the kind of thing that makes a check report a spurious failure, or worse, report success because the mismatch was quietly swallowed.

## What agreement proves and does not prove

**It proves** that this implementation computes the published model. Every weighting function, every propagation mode, every singular override, every frame convention.

**It does not prove** that the model describes any real well. The model is a consensus estimate of survey tool behaviour, based on tool specifications and field experience, and it is periodically revised. Rev4 is not the last word and there are later versions.

**It does not prove** that the parameter set applies to your survey. The magnitudes are for a standard MWD run with standard corrections. A run with in-field referencing has different magnitudes and a smaller answer.

## The misconception to avoid

"The model was validated, so the uncertainty is right." The IMPLEMENTATION was validated against the model. Whether the model's assumed magnitudes match the survey that was actually run is a separate question, answered by knowing what corrections were applied, and it changes the answer by more than any implementation error would.

## Exercise

The validation well is checked at four depths spanning vertical to horizontal.

Say why a check at only the deepest station would be insufficient, and name one class of implementation error that a vertical-only check would miss and a horizontal-only check would catch.
