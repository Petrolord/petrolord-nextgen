# Vertical section

The horizontal axis of every well plan drawing, and the one quantity that needs a choice.

{{panel:wd-survey-explorer}}

## The problem it solves

A well path is three dimensional. A drawing is two dimensional. The section view a well plan is drawn on has depth down the page and something horizontal across it, and that something is the vertical section.

## The definition

Choose an azimuth, called the vertical section azimuth. Project the horizontal displacement onto it:

    VS = N cos(vs azimuth) + E sin(vs azimuth)

That is a signed projection. A well heading exactly along the chosen azimuth has VS equal to its full horizontal displacement. A well heading at right angles to it has VS of zero however far out it goes. A well heading backwards has a negative one.

## The choice

The vertical section azimuth is a choice and it must be stated. The usual convention is the azimuth from the surface location to the main target, so that the plan is drawn along the direction the well is trying to go.

The engine defaults to the closure azimuth at total depth, which is the same idea computed from the path itself, and it lets the caller override it.

Two engineers plotting the same well against different vertical section azimuths get different-looking drawings of the same well. Neither is wrong and they are not comparable.

## Why it can shrink

Because it is a projection, the vertical section can DECREASE while the well keeps drilling.

A well that reaches its target and then turns to drill along a different azimuth adds horizontal displacement while adding little or nothing to the projection, and if it turns past 90 degrees from the section azimuth it starts subtracting.

A section-view plot that appears to double back is usually this, not an error.

## Vertical section against closure

Closure distance is the straight-line horizontal distance from the wellhead, which is a magnitude and always positive. Vertical section is that displacement projected onto a chosen direction, which is signed.

They are equal only when the well is heading exactly along the vertical section azimuth. On the golden feet well in the panel they agree to thirteen figures, because that well ends exactly on its section azimuth of 75 degrees, and its closure azimuth comes out at exactly 75 as well.

That is a property of that well, arranged by whoever built the fixture, and it is a good illustration precisely because it is the special case.

## What it is used for

**Plan drawings**, as the horizontal axis.

**Comparing plan against actual**, since a well drilled off-plan in azimuth shows as a smaller vertical section at the same measured depth.

**Anti-collision plots**, sometimes, though the traveling cylinder in the Expert tier is the better tool.

It is not used for anything physical. No pressure, volume or stress depends on it.

## The misconception to avoid

"Vertical section is the horizontal displacement." It is one component of it. A well can have 2000 m of closure and 400 m of vertical section if it is heading well off the section azimuth, and reading the section-view drawing as though it showed the whole displacement understates how far out the well is.

## Exercise

Open the panel on the metric well and read its closure distance, closure azimuth and vertical section at total depth.

Compute what the vertical section would be if the section azimuth were rotated by 30 degrees, and by 90 degrees. State all three, and say which one you would put on a plan drawing and why.
