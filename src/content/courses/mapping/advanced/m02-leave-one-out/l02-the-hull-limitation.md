# The hull limitation

Five of the six runs returned a blank. This lesson explains exactly why, using the gridder's own rule, and shows that the outcome is geometric and predictable rather than a quirk of this dataset.

{{panel:mp-validation-explorer}}

## The rule that produces the blanks

The gridder fills a node only if two tests pass.

**Inside the hull.** The node must lie inside the convex hull of the control points. The convex hull is the smallest convex polygon containing them, the shape a rubber band would take around the set.

**Within reach.** The node must be within the extrapolation limit, here 800 m, of at least one control point.

Both tests use the control point **locations** only. Neither looks at the depth values.

## What removing a well does to the hull

The convex hull of the six Ekene wells has **five vertices**: Ekene-5 at (600, 1900), Ekene-1 at (1000, 1000), Ekene-2 at (2200, 1150), Ekene-4 at (2600, 2500) and Ekene-3 at (1400, 2300).

Ekene-6 at (1900, 1800) is not among them. It sits **inside** the pentagon the other five make.

Now remove a well and see what happens to the polygon.

Remove a **vertex** and the hull shrinks. The polygon closes in, and it closes in past the location of the removed well, because that well was on the boundary. Its own site is now outside the hull, the first test fails there, and the map has no value to offer.

Remove the **interior** well and the hull is unchanged. Ekene-6 was not holding the boundary anywhere, so the remaining five make the same pentagon, and Ekene-6's location is still comfortably inside it.

That is the whole mechanism.

## The counts confirm it

| Removed | Hull vertices remaining | Live nodes |
| --- | --- | --- |
| Ekene-1 | 4 | 144 |
| Ekene-2 | 5 | 130 |
| Ekene-3 | 4 | 183 |
| Ekene-4 | 5 | 133 |
| Ekene-5 | 4 | 155 |
| Ekene-6 | 5 | 201 |

Five of the six runs lose between 9 and 35 percent of the map. The sixth loses nothing at all, and it is the only one that keeps its own withheld location inside the mapped area.

Note that removing a vertex does not always reduce the vertex count, because a well that was interior can become a vertex when its neighbour leaves. Removing Ekene-2 or Ekene-4 leaves five vertices, with Ekene-6 promoted onto the boundary. The live node count is the more direct measurement, and it falls in every case.

## Why this is not a fixable problem

Three responses are natural and none of them works.

**Widen the extrapolation limit.** That relaxes the second test and not the first. The hull test is a hard boundary and no extrapolation setting reaches past it.

**Turn off the mask.** Then every leave-one-out prediction is an extrapolation from five wells to a point outside their hull, which is exactly the kind of number the mask exists to refuse. Six residuals obtained that way would be a report of what the spline does outside its control, not a measurement of predictive skill.

**Use a different interpolator.** Some will produce a value outside the hull, but that value is still an extrapolation, and calling it a validation because the software did not blank it is worse rather than better.

The blanks are the honest answer. Five of these six wells simply cannot be cross validated on this control set.

## The general rule

> Only wells **strictly inside** the convex hull of the others can be cross validated.

That rule has a consequence worth stating for any project: on a small or linear well pattern, most wells are hull vertices, so most of them are not cross validatable. A six-well pattern with one interior well gives one testable point. A pattern of wells along a single line gives **none**, because every point on a line is a vertex of the degenerate hull.

Cross validation gets useful as well counts rise, and it is least available exactly when a map is least constrained, which is the awkward part.

## Worked example

A field has nine wells: eight around a ring and one in the middle. How many can be cross validated?

One. The eight ring wells are all hull vertices, so removing any of them puts its own location outside the hull of the remaining seven. Only the central well is interior.

Adding a tenth well between the ring and the centre would make two, since the new well and the original central one would both be interior. The count grows with **interior** wells, not with total wells, which is why an infill programme improves validatability far more than a step-out programme does.

## Exercise

State the rule that decides whether a well can be cross validated, name the only Ekene well that satisfies it, and explain in two sentences why widening the extrapolation limit does not help.

As a self-check: only a well strictly inside the convex hull of the other control points can be cross validated, and on Ekene that is Ekene-6 alone at (1900, 1800), the other five being vertices of the pentagon that bounds the set. Widening the extrapolation limit relaxes only the distance test, while the blank is produced by the hull test, which is a hard geometric boundary that no distance setting reaches past; disabling the hull test instead would produce values by extrapolating outside the control, which is not a measurement of predictive skill.
