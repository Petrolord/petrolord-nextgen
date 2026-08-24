# From surfaces to zones

A framework of surfaces is not yet a model of rock. A surface is a boundary, and a boundary has no thickness and holds no volume. What a reservoir engineer wants from you is the rock between the boundaries, and that is a zone.

This module turns three valid surfaces into two zones with a thickness at every node of the frame. This lesson does the definition and the arithmetic, and gives you the check that tells you the arithmetic was right.

## A zone is the rock between two surfaces

Each pair of neighbouring surfaces in the stack bounds one zone. Three surfaces therefore give two zones, and in general $K$ surfaces give $K-1$ zones. Naming them on this model:

| zone | top surface | base surface |
|---|---|---|
| A | TopA  | TopB  |
| B | TopB  | BaseB |

TopB does double duty. It is the base of zone A and the top of zone B, which is the ordinary situation in a conformable stack, and it is the reason the two zones share a boundary rather than leaving a gap between them.

Read the names carefully when you meet a real project, because they are a common source of confusion. TopB is a surface. Zone B is the body of rock beneath it. The surface has depths, the zone has thicknesses, and they are quoted in the same unit of metres, which makes it easy to write one where you meant the other.

## Thickness is a difference grid

The zone A thickness grid is built node by node. At each node of the 500 node frame, take the depth of the base surface and subtract the depth of the top surface:

$$t_A(j) = z_{TopB}(j) - z_{TopA}(j)$$

Do the same for zone B with TopB and BaseB. The result is a new grid on the same 25 by 20 model frame, with the same 50 m cells and the same 500 nodes, holding metres of rock instead of metres of depth.

Three things follow from that definition and each of them matters.

The subtraction is base minus top, in that order, because depths are TVDSS positive down and the base is the larger number. Reverse the order and every thickness in your model is negative. That mistake announces itself immediately, which makes it one of the pleasant ones.

The result cannot be negative here, because the clamp in the last module guaranteed the ordering at every node. Thickness is zero where the two surfaces touch and positive everywhere else. A framework that has not been clamped can and will produce negative thicknesses, which is the failure that whole module was about.

A node is only computable where both surfaces have a value. Where either is null, the thickness is null and the node contributes to nothing. On this model that never happens, because all 500 nodes are live on all three surfaces, so both thickness grids are defined at all 500 nodes.

## Vertical thickness is what you have computed

Subtracting one depth grid from another gives the vertical distance between the surfaces at that node, which the industry calls an isochore. It is not the same as the perpendicular thickness of the bed, which is what a geologist means by true stratigraphic thickness, and on a dipping bed the vertical distance is the larger of the two.

At this tier the distinction is a label rather than a calculation. Bulk volume is properly built from vertical thickness times map area, which is exactly what you have, so nothing downstream needs correcting. Say isochore or vertical thickness when you report it, and be aware that a number labelled true stratigraphic thickness from a well report is a different quantity from the one your grid holds.

## The check: mean separation equals mean thickness

Here is a check that costs one subtraction and catches a surprising number of mistakes. The mean of a difference is the difference of the means, provided both are taken over the same population of nodes. So the mean thickness of a zone must equal the difference of the mean depths of the two surfaces that bound it.

On this model, with every mean taken over all 500 nodes of the frame:

| quantity | value (m) |
|---|---|
| mean TopA depth | 1539.500000 |
| mean TopB depth | 1575.500000 |
| mean BaseB depth | 1585.740000 |
| mean thickness of zone A | 36 |
| mean thickness of zone B | 10.24 |

Zone A: $1575.5 - 1539.5 = 36$, which is the mean thickness of zone A. Zone B: $1585.74 - 1575.5 = 10.24$, which is the mean thickness of zone B. Both check.

The condition attached to the check is the interesting part. It holds only when the two surfaces and the thickness grid are averaged over the same nodes. On this model that is easy, because all 500 nodes are live everywhere. On a model where one surface has dead nodes, the surface mean is taken over its live nodes while the thickness mean is taken over the smaller set where both surfaces are live, the two populations differ, and the identity fails without anything being wrong. If the check fails, ask about the populations before you go looking for a bug.

What the check does catch is a thickness grid built against the wrong surface, a subtraction done the wrong way round, a unit mismatch between two surfaces, and a thickness grid that was computed on a different frame from the one you are reading statistics off.

## Exercise

Compute the mean thickness of both zones from the surface means alone, then state each answer with the population it was averaged over.

Self check: zone A is $1575.5 - 1539.5 = 36$ m and zone B is $1585.74 - 1575.5 = 10.24$ m. Both are means over all 500 nodes of the model frame, because that is the population the three surface means were taken over, and quoting either number without that phrase leaves the next reader to guess. The rest of this module is about how much difference that phrase makes.
