# Sampling a location

Contours answer the question "what does this surface look like". A different question comes up constantly in practice: "how deep is the horizon at this particular spot". A proposed well location, a platform slot, a lease corner, a prospect crest. The spot is almost never a node and it is almost never a well, so the map has to be interrogated at an arbitrary point.

The operation is called sampling, and the capstone asks you to do it once.

## How the engine samples

The grid is a lattice with a known origin and a known cell size, so converting a map coordinate into a position on that lattice is arithmetic. Subtract the origin from the coordinate and divide by the cell size. The result is a fractional index: how many cells across, and how many cells up, the point sits.

The whole number part of that fraction identifies the cell the point falls in. The fractional part says where inside the cell it sits. The engine then takes the four nodes at the corners of that cell and blends them, weighting each corner by how close the point is to it in each direction. This is bilinear sampling, and the name describes it: linear along x, then linear along y.

Two behaviours of the implementation are worth carrying with you. If the point falls outside the grid frame entirely, the sample returns null. And if any one of the four surrounding nodes is dead, the sample returns null as well, even if the other three are live and the point sits close to them. That is deliberate and it matches the contouring rule: the engine will not report a depth built partly from an absence. A location just outside the mapped area does not get a slightly less reliable number, it gets no number. There is one exception built into the arithmetic. If the point lands exactly on a node, the fractional part is zero in both directions, no neighbouring node carries any weight, and only that one node needs to be live.

## The capstone case

Prospect P-1 sits at (1600, 1600). Sampled on the Ekene grid, its mapped depth is 1542.62 m. That is one of the six numbers the capstone grades.

Do not accept it just because the app printed it. Sanity check it against the control, which is the habit this whole course is trying to build.

The nearest well to P-1 is Ekene-6 at (1900, 1800), about 361 m away, picking 1546 m. So the sampled value at P-1 is about 3.4 m shallower than the nearest measured point. Is that reasonable? P-1 does not sit off on its own. It sits between Ekene-6 and Ekene-3, which is at (1400, 2300) and picks 1541 m, a full 5 m shallower than Ekene-6. Moving from Ekene-6 towards Ekene-3 means moving towards shallower rock, and P-1 has moved part of the way. A value of 1542.62 m, between the two picks and nearer the shallow end, is exactly what a smooth surface through those two wells should produce.

Notice what the check did and did not establish. It did not prove 1542.62 m is correct. Nothing can prove that short of drilling. What it established is that the number is consistent with the surrounding control and that no digit slipped. A sample that came back at 1552 m, or at 1538 m, would have failed this check immediately and sent you looking for a units error, a coordinate swap or a bad pick.

## Stability as quality control

There is a second, sharper test available, and it costs nothing.

Regrid the same six picks at a different cell size and sample P-1 again. At a 50 m cell the grid has 1575 nodes with 794 live. At 100 m it has 500 nodes with 201 live. At 200 m it has 195 nodes with 50 live. Three quite different lattices. P-1 reads 1542.620 m on all three.

That agreement is informative. It says the sampled value is being driven by the underlying interpolated surface rather than by the accident of where the nodes happened to land. In this part of the map the surface is well constrained, the control is close by on more than one side, and any reasonable lattice recovers the same shape.

Now imagine the opposite result. Suppose P-1 had read 1542.6 m at 50 m, 1544.1 m at 100 m and 1539.8 m at 200 m. The picks did not change and the method did not change, so a swing like that is the grid resolution talking. That happens where the surface is poorly constrained: far from control, near the edge of the mask, or in a spot where the interpolator is bridging a large empty gap and small changes in node placement move the bridge. A sample that swings with cell size is a warning that the number is soft, and it should be reported with that caveat or not reported at all.

Make it routine. Whenever a single sampled depth is going to carry weight in a decision, sample it on at least two grids of different cell size before you quote it. Stable across both, quote it. Unstable, say so.

## Exercise

Sample the Ekene surface at Ekene-6's own location, (1900, 1800), on the 100 m grid, and predict the answer before you look. As a self-check: with the origin at (400, 800) and a 100 m cell, that location works out to exactly 15 cells across and 10 cells up, so it lands on a node rather than between nodes, no neighbour carries any weight, and the interpolator honours the control, so the sample returns Ekene-6's pick of 1546 m. Then predict what a sample at (400, 2700), the far northwest corner of the grid frame, returns. As a self-check: null, because that corner is more than 800 m from every well, so the surrounding nodes are dead and the sample refuses to blend them.
