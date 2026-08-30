# Closure, and when it equals the vertical section

Two numbers that agree on one well and disagree on most.

## Closure

Closure is the straight-line horizontal distance from the wellhead to the point, and the compass direction of that line:

    closure distance = sqrt(N^2 + E^2)
    closure azimuth = atan2(E, N)

It is the simplest possible summary of how far out the well has gone and in which direction, and it is what a plan view shows.

Unlike vertical section, it involves no choice. Two engineers computing closure on the same station list get the same answer.

## When the two agree

Vertical section is the closure distance times the cosine of the angle between the closure azimuth and the vertical section azimuth.

So they are equal exactly when those two azimuths coincide, that is, when the well's net displacement is along the section the plan was drawn on.

On the feet golden well that is the case at total depth: its closure azimuth comes out at 75 degrees, which is exactly its vertical section azimuth, so the two columns agree to the last digits the arithmetic carries.

That is worth seeing once, because it is a good demonstration of the two quantities being the same thing in one specific circumstance and different things in general. On the metric well, whose closure azimuth is 200 degrees against a section azimuth of 200 degrees, the same coincidence is arranged.

Both fixtures were built this way. Real wells are not.

## The general case

A well that lands its main target and then drills a lateral in a different direction has a closure azimuth that swings away from the plan azimuth. From that point on:

- closure distance keeps growing, because the well is still going out;
- vertical section grows more slowly, or shrinks;
- the two diverge, and the section-view drawing stops telling the whole story.

That is normal and it is why plan view and section view are both drawn.

## Closure through the well

Closure is computed at every station, so the column tells a story: it rises through the build, keeps rising through the tangent, and its AZIMUTH tells you whether the well is drilling straight out or curving around.

A closure azimuth that changes steadily down the tangent means the well is turning, even if each station's turn rate looks small.

## Where it is used

**Well spacing.** Closure distance from a platform is what fills a slot pattern and what a surface location study is drawn on.

**Lease boundaries.** A bottom hole location is a closure from a surveyed surface point.

**Quick anti-collision sense.** Two wells whose closures at the same TVD are hundreds of metres apart cannot be in conflict, which is a cheap first filter before the proper scan.

## The misconception to avoid

"Closure and vertical section are both the horizontal displacement, so use whichever is on the sheet." They agree only when the well is on its section azimuth. Using one where the other is meant understates the displacement by the cosine of the angle between them, and that angle is exactly what is not being looked at when somebody makes the substitution.

## Exercise

A well has 900 m north and 1200 m east of displacement, and its plan was drawn on a vertical section azimuth of 45 degrees.

Compute the closure distance, the closure azimuth, and the vertical section. State the difference between the closure distance and the vertical section, and say what fraction of the displacement the section view is failing to show.
