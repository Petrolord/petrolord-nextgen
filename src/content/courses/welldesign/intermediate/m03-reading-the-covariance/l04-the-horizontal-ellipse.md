# The horizontal ellipse

The two-dimensional projection everyone quotes, and what it leaves out.

## The construction

Take the three by three covariance, keep the north and east block, and find its eigenvalues and eigenvectors.

The eigenvectors are the ellipse's axis directions. The square roots of the eigenvalues, times a confidence factor, are the semi-axis lengths. The engine returns the semi-major, the semi-minor and the azimuth of the major axis.

## Why the horizontal projection

Because a well is drawn in plan, targets are drawn in plan, and lease boundaries are in plan.

It is also the projection that matters for anti-collision at similar depths, which is the usual case: two wells at the same TVD, separated horizontally.

## What it leaves out

The vertical component entirely.

That is fine when the two objects being compared are at the same depth and matters when they are not. A well passing above another one is separated vertically, and a horizontal ellipse says nothing about it. The Expert tier's clearance calculation uses the full three-dimensional covariance for exactly this reason.

## The shape on the validation well

At total depth the ellipse is dramatically elongated: the semi-major axis is more than nine times the semi-minor.

The semi-minor is 10.553786790186573 m at one sigma, which is very close to the along-hole sigma from the previous lesson, and that is not a coincidence: in a horizontal well the along-hole direction is horizontal, so it appears in the horizontal projection.

The semi-major is the lateral uncertainty, essentially unchanged by the projection because lateral is horizontal by construction.

So on a horizontal well the plan-view ellipse is very nearly the lateral and along-hole sigmas drawn as an ellipse, and its long axis points across the well. Read the azimuth in the panel and compare it against the well's own azimuth of 75 degrees: the difference is close to ninety degrees.

## The confidence factor

The semi-axis lengths scale linearly with whatever factor is applied, and the choice of factor is a convention.

**k = 1** is one sigma, which in two dimensions covers about 39 percent of the distribution, not 68. The one-dimensional intuition does not carry over.

**k = 2.7955** is the two-dimensional 95 percent factor, which is why it appears in this course.

**k = 3.5** is what the anti-collision standard uses, and it corresponds to a much higher confidence in two dimensions.

Quoting an ellipse without its k is quoting an unscaled shape. The next lesson is about the factors.

## Reading the azimuth

The ellipse azimuth is the compass direction of the LONG axis.

On a well that has been drilling straight for a long distance it is roughly perpendicular to the well, because lateral dominates. On a well that has changed direction it can be anywhere, because the accumulated errors from different sections point in different directions and the eigenvector is their resultant.

That is a genuinely useful diagnostic: an ellipse whose long axis is NOT across the well is telling you that the uncertainty came from somewhere other than the current heading.

## The misconception to avoid

"The ellipse is where the well is." It is a contour of an assumed probability distribution, at a chosen confidence, built from an assumed parameter set, ignoring the vertical dimension and ignoring gross errors. It is the best available description of where the well might be and it is not a boundary the well is inside.

## Exercise

At one sigma the validation well's plan-view ellipse has a semi-minor axis of 10.553786790186573 m and a ratio of more than nine between its axes.

Compute the semi-major from that ratio. Then scale both to the 95 percent factor of 2.7955 and state the area of the ellipse at both confidences.
