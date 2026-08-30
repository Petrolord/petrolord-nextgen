# The definition

A distance divided by an uncertainty, and every term in both.

## The formula

    separation factor = (centre-to-centre distance - Rr - Ro - Sm) / (k x sigma_combined)

Numerator: the geometric clearance from the previous module, the centre-to-centre distance less both hole radii and the tool projection allowance.

Denominator: the combined position uncertainty of the two wells, in the direction between them, scaled by the confidence factor.

## What each term does

**The distance** is geometry and it is the only term that is measured, in the sense that it follows from the two surveys.

**The two radii** are the holes. Known, and often larger than the bit size.

**The tool projection allowance** covers the assembly ahead of the sensor.

**The combined sigma** is the projection of both wells' covariances onto the line between them, combined, plus the surface position term.

**k** is the confidence factor, 3.5 in the standard.

## Why it is dimensionless

Because it is the honest comparison. Ten metres of clearance is comfortable between two well-surveyed modern wells and dangerous between two 1970s wells, and the factor says so.

A factor of 1 means the clearance exactly equals the combined uncertainty at the chosen confidence: the two ellipses just touch. Above 1 they do not touch; below 1 they overlap.

## The projection onto the line between the wells

This is the step people skip.

Each well has a three-dimensional covariance. What matters is the uncertainty in the DIRECTION from one well to the other, which is a single number obtained by projecting the covariance onto that direction:

    sigma^2 in direction u = u' C u

Both wells' covariances are projected onto the same direction and combined. The result is much smaller than either well's largest sigma if the direction happens to be along a short axis of both ellipses, and much larger if it is along the long axis.

That is why the ellipse ORIENTATION from the Professional tier matters so much here: two wells separated along the short axes of their ellipses are far apart in factor terms, and the same wells separated along the long axes are not.

## The pedal curve

The standard's method is more careful than a simple projection. It uses the PEDAL CURVE of the combined ellipsoid, which accounts for the ellipsoid's shape correctly in the direction of interest rather than treating it as a sphere of the projected radius.

The next lesson is about what that means geometrically. The engine returns the two wells' pedal radii separately, which is what lets a report show where the uncertainty is coming from.

## The surface position term

Added separately, because it is not in the survey error model. It is a single sigma for the wellhead position, and it enters the combined uncertainty like any other independent term.

In the standard example it is half a metre. Shallow, where the wells are only metres apart, it is often the dominant contribution.

## What the factor is not

It is not a probability. It is a ratio of a distance to a scaled uncertainty, and translating it into a probability of collision requires assumptions about the distributions that the standard deliberately does not make.

It is a screening statistic with agreed thresholds, and the thresholds carry the risk judgement.

## The misconception to avoid

"A separation factor of 2 means twice as safe as 1." It means the clearance is twice the scaled uncertainty. The relationship between that and a probability is steeply non-linear, and the interval between 1 and 1.5 carries far more risk difference than the interval between 3 and 3.5.

## Exercise

Two wells are 15 m apart centre to centre. Hole radii are 0.22 and 0.16 m, the tool allowance is 0.3 m, and the combined one-sigma uncertainty in the direction between them is 3.2 m.

Compute the separation factor at k = 3.5 and at k = 2. State which of the two you would report and why the choice needs to be agreed in advance.
