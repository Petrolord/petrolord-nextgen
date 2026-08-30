# Decimation

A modern gauge records more data than any analysis can use, and the excess is not free.

## The problem

A downhole gauge samples every second. A three-day test is a quarter of a million points.

None of the analyses in this course wants a quarter of a million points. A semilog fit over a decade of time needs enough points to define a line. A derivative needs enough points per decade to resolve a shape. Beyond that, more points cost computation, clutter the plot, and, most importantly, weight the fit towards late time.

## The weighting problem

This is the part that is easy to miss.

A gauge sampling at constant intervals produces points that are uniformly spaced in TIME. On a logarithmic axis, uniform spacing in time means almost all the points are in the last decade.

A test running from 0.01 to 100 hours spans four decades. Sampled every second, the first decade contains a handful of points and the last decade contains nine tenths of them.

Fit a least-squares line to that and the late data dominate completely. The early data, which is where storage and the near-well regimes live, contribute almost nothing to the fit even though they carry most of the diagnostic information.

## Log decimation

The fix is to resample so the points are uniformly spaced in the LOGARITHM of time: a fixed number per decade.

The engine's `logDecimate` does this. It keeps the first point, then walks forward keeping any point at least 1/pointsPerDecade of a decade beyond the last one kept, and always keeps the last point.

On the drawdown fixture, which already holds 45 points over four decades, decimating at 12 per decade returns all 45, at 6 per decade returns 23, and at 3 per decade returns 12.

That the fixture is unchanged at 12 per decade is not a coincidence: it was generated log-spaced at roughly 11 points per decade, which is the density a well test is normally analysed at.

## How many per decade

Between 5 and 20 is the usual range.

Too few and the derivative cannot resolve a feature. A dual-porosity dip that spans half a decade needs enough points inside it to have a minimum.

Too many and the noise is not reduced. Decimation is also a noise-reduction step: keeping one point in fifty and discarding the rest reduces the scatter simply by throwing samples away, and combined with the Bourdet window it is why real derivative plots are readable at all.

The professional practice is to decimate to about 10 per decade for the diagnostic plot, and to keep the full record for anything that needs it.

## What decimation is not

It is not averaging. `logDecimate` SELECTS points; it does not combine them. A point kept carries whatever noise it had.

Some workflows average within each log bin instead, which reduces noise further and is defensible, and which also smooths features. The engine does the simpler thing and leaves smoothing to the Bourdet window, where it is explicit and controllable.

## The order of operations

Despike first, then decimate, then differentiate.

Despiking after decimation is much less effective, because the spike may be one of the few points kept and its neighbours are now far away, so it no longer looks like an outlier against them.

Differentiating before decimating wastes the effort and produces a derivative dominated by the noise the decimation was going to remove.

## The misconception to avoid

"Discarding data loses information." Discarding data that are redundant on a logarithmic axis loses no information and removes a real bias in the fit weighting. What loses information is discarding data non-uniformly, for instance by trimming a test's early record because it "looks like storage": that is a judgement disguised as data preparation, and it should be made explicitly at the analysis window instead.

## Exercise

A gauge samples every 10 seconds for 72 hours.

Compute the number of points, and the number of them that fall in the first decade of a plot that starts at 0.01 hours. Express the second as a percentage of the first.

Then say how many points a decimation at 10 per decade would keep, and what fraction of the original record that is.
