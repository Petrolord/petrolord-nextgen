# The masks interact

The isochore of the Ekene SAND has 201 live nodes, and so do both of the surfaces it came from. This lesson explains why that is not a coincidence, and why it is not a general rule either.

## The rule for blanks

Each input surface has blanks: nodes the gridder refused to fill because they are outside the convex hull of the control points, or further than 800 m from every control point. The Associate tier called these dead nodes and the panel leaves them uncoloured.

When two surfaces are combined, the rule is strict:

> A node is live in the result only if it was live in **both** inputs.

The output blank set is the union of the two input blank sets, and the output live set is their intersection. There is no filling in, no borrowing from the other surface and no extrapolating across.

That is the honest rule and it has an unavoidable consequence: **an isochore can only be smaller than its inputs, never larger.** Combining maps loses coverage. Combine three surfaces and you keep only the area all three cover.

## Why Ekene loses nothing

On this dataset the intersection is the whole of both live sets, and the reason is in how the mask is computed.

A node is live if two geometric tests pass: it is inside the convex hull of the control points, and it is within the extrapolation limit of at least one of them. Read what those tests use. Both depend only on the **locations** $(x, y)$ of the control points. Neither looks at the $z$ values at all.

The six Ekene wells carry both a TOP_SAND and a BASE_SAND pick, at the same six coordinates. So the control geometry of the two surfaces is identical, both masks are computed from the same six points, and the two live sets are not merely the same size, they are the same set of nodes.

The isochore therefore keeps all 201, and the capstone grades that count exactly.

## When it does not hold

Change one thing and the coincidence breaks.

Suppose Ekene-4 in the northeast had a TOP_SAND pick but the well had been abandoned before reaching the base. The top surface would still be controlled by six points and keep its 201 live nodes. The base surface would be controlled by five, its convex hull would shrink to exclude the northeast corner, and the engine reports that removing Ekene-4 drops the live count to 133. The isochore would then have 133 live nodes, a third less coverage than the depth map above it, and the entire northeast of the field would carry a depth with no thickness.

Nothing about the depth map would change. The loss would appear only in the thickness map and in anything computed from it.

## Why this matters downstream

Volumetrics multiplies thickness by area. A blank node contributes no thickness and therefore no volume, so lost coverage in the isochore is **volume the calculation does not claim**.

That is the honest behaviour and it is better than the alternative, which is a gridder that fills the gap with an extrapolated guess and reports a volume that includes rock nobody has any evidence for. But it has to be said out loud in the report, because a volume from 133 nodes and a volume from 201 nodes are not comparable and neither figure carries its own coverage.

The habit is to quote the live node count with every mapped statistic. The capstone grades it for that reason.

## Worked example

A field has a top surface with 480 live nodes and a base surface with 350 live nodes, and the two sets overlap over 340 nodes. What does the isochore have, and what should the report say?

The isochore has 340 live nodes, the intersection. Not 350, because 10 of the base surface's live nodes sit where the top is blank, and not 480, because the top's extra coverage has no base to subtract from.

The report should state the 340, state that it is 71 percent of the top surface's coverage, and name the reason, which is that the base is constrained by fewer or differently placed picks. A volume computed from that isochore covers 71 percent of the mapped structure and the remaining 29 percent is not zero volume, it is unquantified volume.

## Exercise

Explain in one sentence why the Ekene isochore keeps all 201 live nodes, then state what its live count would be if the BASE_SAND pick were missing from Ekene-4 and say which of the six capstone fields would change as a result.

As a self-check: it keeps all 201 because the mask is computed from the control locations alone and both surfaces use the same six well positions, so the two live sets are identical rather than merely equal in size. Without Ekene-4's base pick the isochore would fall to 133 live nodes, and the live count, the minimum, the maximum and the map mean would all change, while the mean of the six well thicknesses would change too since only five wells would carry a thickness; the depth at P-1 on the top surface would be untouched.
