# NEV, and what it hides

Six numbers in the map frame, and why they are the wrong six to look at.

## The matrix

The model returns, at every station, a three by three symmetric matrix in north, east and vertical:

    [ var(N)     cov(N,E)  cov(N,V) ]
    [ cov(N,E)   var(E)    cov(E,V) ]
    [ cov(N,V)   cov(E,V)  var(V)   ]

Six independent numbers: three variances on the diagonal and three covariances off it.

## What the diagonal says

The square roots of the diagonal are the one-sigma uncertainties along each map axis.

On the validation well at total depth the east variance is 712.693125074307 and the vertical variance is 468.126966260975 square metres, so the east and vertical sigmas are about 27 and 22 metres. The north variance is far larger.

Reading only the diagonal, you would say the well is much less certain north-south than east-west. That is true and it is not the useful statement.

## What the off-diagonal says

The north-east covariance at total depth is minus 2252.308676497604 square metres. It is large and it is NEGATIVE.

A negative covariance means the two errors move oppositely: a well that is further north than computed is also further west. That correlation is what makes the uncertainty region an ellipse tilted away from the axes rather than a rectangle aligned with them.

Ignoring the off-diagonal terms and treating north and east as independent is one of the standard mistakes, and it produces an uncertainty region that is both the wrong shape and the wrong size.

## Why the map frame is the wrong frame

Because the well does not care about north.

What matters operationally is the uncertainty ALONG the hole, which affects depth control, and the uncertainty ACROSS the hole, which affects whether you hit the target and whether you hit the neighbour. Those are directions defined by the well's own attitude, not by the map.

A well heading at 75 degrees has most of its lateral uncertainty pointing at roughly 165 degrees, which is neither north nor east, and the map-frame numbers spread that single physical quantity across three entries.

The next lesson rotates into the frame that separates them.

## The ellipsoid

Geometrically the matrix defines an ellipsoid: the set of positions at a given confidence, centred on the computed position.

Its axes are the eigenvectors and its semi-axis lengths are the square roots of the eigenvalues, scaled by whatever confidence factor is chosen. That is the honest three-dimensional picture, and the two-dimensional ellipse the industry quotes is its horizontal projection.

## What it is not

It is not a tolerance. It is not a guarantee. It is the second moment of an assumed distribution built from an assumed parameter set.

It is also not symmetric about anything physical: the true position is somewhere in there, but the model has no idea where, and a systematic error that was underestimated puts the well outside the ellipse with no warning at all.

## The misconception to avoid

"The north and east uncertainties are the two numbers to report." Reporting the diagonal alone discards the correlation, which on this well is comparable in size to the variances themselves. Two wells with identical diagonals and opposite correlations have ellipses at right angles to each other, and one of them clears the neighbour while the other does not.

## Exercise

At total depth the validation well has an east variance of 712.693125074307 and a vertical variance of 468.126966260975 square metres.

Compute the two sigmas. Then, given a north-east covariance of minus 2252.308676497604, say what sign of north-east tilt the ellipse has and in roughly which quadrant its long axis points.
