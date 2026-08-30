# The pedal curve

Why the uncertainty in a direction is not the ellipse's radius in that direction.

{{panel:wd-clearance-explorer}}

## The question

An ellipse, and a direction. How big is the ellipse "in" that direction?

There are two different answers and they are not the same.

## Answer one: the radius

Walk from the centre along the direction until you leave the ellipse. That is the radial distance, and it is what most people picture.

## Answer two: the pedal radius

Find the tangent line to the ellipse that is PERPENDICULAR to the direction, and measure from the centre to that tangent line.

That is the pedal radius, and it is the correct one for a separation calculation.

## Why the second one

Because the question is not "how far does the ellipse reach along this line" but "how far can the ellipse extend towards the other well".

The point of the ellipse closest to the other well is not generally the point along the line of centres: on a long thin ellipse tilted relative to that line, the nearest point is off to one side. The pedal radius measures to the supporting tangent, which is what governs whether the two regions touch.

For a circle the two answers coincide. For a long thin ellipse they differ substantially, and the difference is largest exactly when the ellipse is tilted relative to the direction of interest, which on real wells is most of the time.

## The formula

For a covariance C and a unit direction u, the pedal radius at confidence k is

    r = k sqrt( u' C u )

which is the projection of the covariance onto the direction. That is the same expression as the previous lesson's projection, and the pedal interpretation is what makes it the right one rather than an approximation.

The radial distance, by contrast, involves the inverse of the covariance and is a different quantity entirely.

## What the engine reports

Both wells' pedal radii at every reference station, separately.

That separation is worth having. If the reference well's pedal radius is 4 m and the offset's is 14 m, the uncertainty is the offset's problem, and improving your own survey will not help. That is a common and important finding when clearing against an old well.

## The combination

The two pedal radii combine in quadrature, along with the surface position term:

    sigma_combined = sqrt( r_ref^2 + r_off^2 + sigma_surface^2 )

Quadrature because the errors are treated as independent. Where they are not independent, because the wells share a surface location or a geomagnetic reference, that assumption is wrong and the next module is about correcting it.

## Why the standard specifies the method

Because the difference between the pedal method and the radial one is a real number, and two operators using different methods will disagree about the same pair of wells.

Specifying it removes an argument. The standard clearance examples in this course are computed with the pedal-curve method and the published factors reflect it.

## The misconception to avoid

"The uncertainty towards the other well is the ellipse's radius in that direction." It is the pedal radius, measured to the supporting tangent, which for a tilted elongated ellipse is larger. Using the radial distance understates the uncertainty and overstates the separation factor, in the direction that makes wells look safer than they are.

## Exercise

Sketch a long thin ellipse tilted at 45 degrees to a horizontal direction.

Mark the radial distance along that direction and the pedal radius perpendicular to it. State which is larger, and say what happens to both as the tilt goes to zero.
