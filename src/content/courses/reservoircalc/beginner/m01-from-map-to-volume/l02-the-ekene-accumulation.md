# The Ekene accumulation

The fixture does not change. This is the same Ekene field you gridded in the mapping course, the same six wells at the same map coordinates, with the same TOP_SAND picks you already know. One thing is added: every well now also carries a pick on BASE_SAND, so the reservoir has a floor as well as a roof.

Keeping the data fixed is deliberate. By the time you reach the capstone, nothing about the field should be new, and the only thing you should be learning is what volumetrics does to it.

## The control set, both surfaces

| Well | x (m) | y (m) | TOP_SAND (m) | BASE_SAND (m) | Sand thickness (m) |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | 1000 | 1000 | 1548 | 1580 | 32 |
| Ekene-2 | 2200 | 1150 | 1565 | 1601 | 36 |
| Ekene-3 | 1400 | 2300 | 1541 | 1570 | 29 |
| Ekene-4 | 2600 | 2500 | 1590 | 1615 | 25 |
| Ekene-5 | 600 | 1900 | 1552 | 1583 | 31 |
| Ekene-6 | 1900 | 1800 | 1546 | 1580 | 34 |

The first four wells are the ones you correlated, and their sand thicknesses of 32, 36, 29 and 25 m are the thicknesses that correlation produced. Ekene-5 and Ekene-6 are the two wells that sat off the section line and were essential to the map.

Read the last column before you read anything else. The sand ranges from 25 m at Ekene-4 to 36 m at Ekene-2, an 11 m spread across six wells. Notice which wells sit at the ends of that range. Ekene-4 at 1590 m is the deepest well on TOP_SAND and carries the thinnest sand. Ekene-2 at 1565 m is the second deepest and carries the thickest. Thickness on this fixture does not track structural depth, so you cannot predict one from the other, and the base surface has to be mapped in its own right rather than assumed as a constant offset below the top.

## Two surfaces, one mask

Both surfaces go through the identical gridding recipe you already know: a thin-plate spline through all six control points, a 100 m cell, two cells of padding, and an extrapolation limit of 800 m from the nearest control point.

The frame is unchanged. Origin at x0 = 400 and y0 = 800, 25 columns by 20 rows, which is 500 nodes in the frame. Of those, TOP_SAND has 201 live nodes and BASE_SAND has 201 live nodes, and the number of nodes where both surfaces are live is also 201.

That third number is the one to hold on to. The two surfaces share one mask.

The reason is that the mask is built from the control geometry rather than from the depths. A node is live if it is inside the hull and within 800 m of a well, and the six wells are at the same six coordinates for both surfaces because each well picked both tops. The distance test therefore returns the same answer on both grids, node for node.

This matters more than it looks. Every calculation in this course subtracts one surface from the other, node by node. If the two grids had different live sets, some nodes would carry a top with no base, and you would have to decide what to do with them. On this fixture that problem does not arise.

Each of the 201 live nodes stands for one cell of 100 by 100 m, which is 10,000 square metres of ground, so the mapped area is about 2 square kilometres. That is the ground on which the whole booking rests.

## What the two mapped surfaces look like

The mapped extremes are worth putting side by side, because the two surfaces do not behave the same way.

| Surface | Shallowest mapped value (m) | Deepest mapped value (m) |
| --- | --- | --- |
| TOP_SAND | 1539.7181396484375 | 1590 |
| BASE_SAND | 1570 | 1615 |

Compare each of those against the picks in the control table. The deepest mapped value on TOP_SAND, 1590 m, is exactly the Ekene-4 pick. Both mapped extremes on BASE_SAND land exactly on picks as well: 1570 m is the Ekene-3 base and 1615 m is the Ekene-4 base.

The shallowest mapped value on TOP_SAND does not. There is no pick at 1539.7181396484375 m. The shallowest measurement in the whole dataset is Ekene-3 at 1541 m, and the mapped crest sits 1.2819 m above it, at a node roughly 300 m away from that well. You met this in the mapping course as the spline overshoot. It is still here, it has not been corrected, and module 2 shows you what it does to a volume.

## Why both surfaces are needed at all

A reasonable question at this point is why the base surface is being mapped when the oil sits at the top of the structure.

The answer is that the top alone cannot tell you where the rock ends. Oil occupies the pore space in the sand, and the sand has a bottom. If the fluid contact were deep enough, the accumulation would fill the sand all the way to its floor and the volume would be limited by the base surface rather than by the contact. Without the base you would have no way to know when that happens, and you would keep adding rock below the reservoir.

Whether that actually occurs on Ekene at the contact this course uses is a question with a definite answer, and module 2 settles it node by node. The point for now is that you cannot answer it without both surfaces on the same mask.

## Exercise

From the control table, list the six sand thicknesses and identify the thickest and thinnest wells. Then answer two questions in one sentence each. First, why do TOP_SAND and BASE_SAND end up with the same 201 live nodes? Second, if Ekene-5 had a TOP_SAND pick but no BASE_SAND pick, what would change about the mask?

Self check: the thicknesses are 32, 36, 29, 25, 31 and 34 m, thickest at Ekene-2 with 36 m and thinnest at Ekene-4 with 25 m, and both of those are among the deepest wells on TOP_SAND, so thickness does not follow structural depth here. The two surfaces share a mask because the mask is decided by the control geometry rather than the depths: the same six coordinates, the same hull and the same 800 m distance limit give the same live set on both grids. If Ekene-5 had no base pick, the base surface would be built from five control points instead of six, so its mask would shrink where Ekene-5 was the only well within 800 m, and the two surfaces would no longer share one live set.
