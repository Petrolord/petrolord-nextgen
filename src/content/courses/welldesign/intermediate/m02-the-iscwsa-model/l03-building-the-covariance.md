# Building the covariance

Twenty-seven sources, one matrix per station, and what the engine actually returns.

{{panel:wd-uncertainty-explorer}}

## The call

The error model takes a station list, a header describing the earth and the tool reference, and a model name. It returns:

- the prepared survey: depths, inclinations and TRUE azimuths in radians, and TVDs;
- one entry per error source, each with its code, its propagation mode, a depth-only flag, its per-station sensitivities and its own covariance at every station;
- the total covariance at every station.

Keeping the per-source covariances rather than only the total is what makes the budget in module 4 possible. A model that returned only the sum could tell you the answer and not where it came from.

## The azimuth conversion

Notice that the prepared survey holds TRUE azimuths.

The header states which north the input azimuths are referenced to, along with the declination and the convergence, and the model converts before doing anything. That conversion is not cosmetic: the magnetic weighting functions need the angle relative to MAGNETIC north, and the position accumulation needs the angle relative to whatever frame the positions are in.

Getting that conversion wrong rotates the whole answer, and it is invisible unless the header is read.

## The order of the sum

For each source: compute the weighting function over the whole survey, scale by the magnitude, convert to position space through the dr/dp matrix, accumulate according to the propagation mode, and add the result into the running total.

Twenty-seven times. The engine does it in one pass and keeps everything.

## The singular overrides

Several sources have expressions that are singular at vertical or at horizontal. The engine has a set of overrides applied only to those sources, computed instead of the general expression where the general one would divide by zero.

That is the kind of detail that separates an implementation that reproduces the published workbook from one that is close. The next lesson shows what "reproduces" means quantitatively.

## Reading the panel

The panel runs the model on the validation well and shows one station at a time.

The tiles give the attitude, the three borehole-frame sigmas, and the ellipse. The table gives every source's share.

Move the station selector from the shallow vertical section to total depth and watch three things: the magnitudes grow by orders of magnitude, the ranking of sources changes completely, and the ellipse's orientation swings.

None of those is obvious from the model description. All three are consequences of the geometry, and seeing them is the point of the panel.

## What one station costs

The whole model over 268 stations and 27 sources runs in a few milliseconds, because it is dense linear algebra on three by three matrices.

That matters practically: an anti-collision scan needs the full model on both wells, and a planner adjusting a trajectory wants the answer to move as they drag. It is one of the few places in this module where the arithmetic is genuinely cheap.

## The misconception to avoid

"The covariance is the tool's specification." It is the tool's specification put through the well's geometry. The same tool on a vertical well and on a horizontal well produces covariances that differ by orders of magnitude and by which sources dominate. The specification is an input; the covariance is a result.

## Exercise

Open the panel and record, at the shallow station and at total depth, the three borehole-frame sigmas and the total variance.

Compute the ratio of total variance between the two. Then say which sensor set is responsible for most of the growth, using the source table.
