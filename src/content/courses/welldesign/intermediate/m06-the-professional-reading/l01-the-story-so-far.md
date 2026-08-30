# The story so far

Five modules, and one number with three components.

## The claim

A survey position is a measurement with an uncertainty, the uncertainty is described by a published model, and the model's answer is a long thin ellipse pointing across the well whose size is dominated by a handful of sources that change with depth.

## What each module established

**Module 1.** Three measurements, three instruments, none exact. Errors do not average out, because most of them are systematic: a sensor bias is the same at every station in a run and a declination error is a single rotation of the whole well. Accelerometers measure inclination well and fail near horizontal; magnetometers measure azimuth poorly and fail near vertical, at high dip and on north-south holes; depth is counted rather than measured. The model needs the total field and the dip before it will compute anything, and refuses without them.

**Module 2.** A weighting function converts a sensor error into an inclination, azimuth and depth error at a station. A second matrix converts that into a position error at every station BELOW it, which is why errors accumulate. Random sources add in variance, systematic and global ones add in amplitude first, and that single difference in the order of squaring produces a factor of ten over a hundred stations. The implementation reproduces the published validation workbook to machine precision, which is verification and not validation.

**Module 3.** The covariance in the map frame hides the shape: the north-east covariance on the validation well is large and negative and the ellipse is tilted well away from the axes. Rotating into the borehole frame separates along-hole, highside and lateral, which govern depth control, reservoir containment and collision respectively. On this well lateral is more than four times highside, so the ellipse is nine times longer than it is wide and points across the well. The confidence factor is a convention, the two-dimensional factors are not the one-dimensional ones, and 95 percent in two dimensions is k equal to 2.7955.

**Module 4.** Five sources out of twenty-seven account for the great majority of the variance at total depth, and the leader is axial magnetic interference, which is the drill string's own magnetism and is fixed with collars and survey procedure rather than with a better tool. At 1200 m, still vertical, the ranking is entirely different and the total is thousands of times smaller. Three sources are depth-only and land almost entirely in the along-hole component.

**Module 5.** A target hit is a probability, not a comparison of point estimates, and the target's own position uncertainty is often larger than the well's. Vertical uncertainty is small but routinely exceeds a lateral's reservoir window, which is why geosteering exists. An ellipse quoted without its k, its dimension, its model revision, its parameter set and its station is not comparable with anything. And the model excludes gross errors, surface position, hole radius and its own model error, so the ellipse is a lower bound rather than a worst case.

## The numbers to carry

- The two-dimensional 95 percent confidence factor: 2.7955, not 1.96.
- The two-dimensional confidence at k = 1: 39.3 percent, not 68.
- The along-hole sigma at total depth on the validation well: 10.554140502828378 m, about one part in a thousand of the depth.
- The worst relative error against the published workbook: about 4e-14.
- The number of error sources: 27, of which 3 are depth-only.

## What this tier does not cover

The neighbours. Every ellipse in this tier belongs to one well, and the question the ellipse exists to answer is whether two wells are far enough apart. That needs both wells' covariances, a geometry for closest approach, and a convention for combining them, and it is the Expert tier.

## Exercise

Without looking back, write down the three borehole-frame components in the order of their size on a long horizontal well, and name the sensor set that dominates each.

Then state the five things that must accompany a quoted semi-major axis.
