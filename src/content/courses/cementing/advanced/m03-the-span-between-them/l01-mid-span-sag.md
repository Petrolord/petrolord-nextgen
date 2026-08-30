# Mid-span sag

The pipe between two centralizers is a beam, and it droops.

{{panel:cm-standoff-explorer}}

## The picture

Two centralizers hold the casing near the middle of the hole. Between them, nothing does. The pipe there is a beam supported at both ends, loaded by its own buoyed weight resolved perpendicular to the hole, and it sags toward the low side.

The standoff at the middle of the span is therefore worse than at the ends.

## The formula

    sag = w_perp x L^4 / (384 x E x I)

which is the mid-span deflection of a uniformly loaded beam with FIXED ends.

    w_perp = buoyed weight per metre x sin(inclination)
    L      = spacing
    E x I  = the bending stiffness of the casing

## The stiffness

For 7 inch 29 lb/ft casing:

    E x I = 3965678.921984168 N m squared

from the same `stringProperties` function the torque and drag engine uses.

## Worked

**12 m at 40 degrees**, with a perpendicular weight of 345.6133299031847 times sin 40:

    sag = 0.0030250613857131267 m

**12 m at 90 degrees**:

    sag = 0.004706160075469288 m

Against a clearance of 0.019049999999999997 m, that is 16 percent and 25 percent of the whole clearance, from sag alone.

## How the engine combines it

    deflection at the centralizer = clearance x (1 - standoff at the centralizer)
    mid-span standoff = (clearance - that deflection - sag) / clearance

So the sag is ADDED to whatever the centralizer already gave away. The pipe is off centre by the centralizer's deflection at the ends, and by that plus the sag in the middle.

Then

    standoff = min(standoff at the centralizer, mid-span standoff)

and since the sag is never negative, the mid-span value is always the smaller of the two. The minimum is the mid-span value, always, on every interval of every well.

## Fixed ends, not pinned

A pinned-end beam sags five times as much: the coefficient is 5/384 rather than 1/384.

Fixed ends is the right choice, because the casing continues through the centralizer rather than stopping there, so the slope is continuous and the ends are restrained.

It is also the less conservative of the two by a factor of five, which is worth knowing.

## Exercise

Compute the sag for a 9 m spacing at 90 degrees on this casing.

Then express it as a fraction of the clearance, and compare it against the 25 percent that 12 m gives.
