# Zone B pinches out

Zone B is the rock between TopB and BaseB. It is built by exactly the same subtraction as zone A, on the same frame, with the same code, and it behaves nothing like it.

## The statistics

| quantity | value | population |
|---|---|---|
| mean thickness | 10.24 m | all 500 nodes of the frame |
| maximum thickness | 31 m | all 500 nodes |
| minimum thickness | 0 m | all 500 nodes |
| nodes with positive thickness | 320 | out of 500 |

The mean of 10.24 m is one of the six graded capstone numbers, to a tolerance of 0.05 m. The engine holds the maximum as 31.000000000000455, which is 31 m for every purpose you have, for the reasons the last lesson set out.

Put the last two rows side by side and the whole character of the zone is there. The minimum thickness is zero, and 320 of the 500 nodes carry a positive thickness. At the other 180 nodes the thickness is exactly zero.

## 180 again

That number has appeared before. In the previous module the clamp reported that it had fixed 180 nodes on BaseB, and $320 + 180 = 500$ accounts for the frame exactly.

They are the same 180 nodes, and the reason is mechanical. When the clamp finds BaseB above TopB at a node, it writes TopB's depth into BaseB. The two surfaces then hold the same number, so the subtraction that builds the thickness grid returns exactly zero at that node. Every node the clamp fixed is a node where zone B has zero thickness, and no other node can be zero unless the two surfaces happened to arrive at identical depths on their own.

This is the internal consistency check for the whole framework, and it is one you should run every time. Count the nodes the clamp fixed on a surface. Count the nodes where the zone below the surface above it has zero thickness. The two counts must agree. If they do not, the thickness grid was built from something other than the clamped surfaces, which is a common mistake in a workflow that keeps both the raw and the clamped versions in memory.

## What a pinch-out is

A pinch-out is a unit that thins to nothing and terminates. The rock is there, then it gets thinner in some direction, then it is not there. There are two ordinary ways to make one.

The unit can be truncated. It was deposited across the area, then uplift and erosion removed it from a structural high, and the surface above it now lies directly on the rock below. Or the unit can onlap. A high already existed, sediment filled in around it and thinned against its flank, and the unit was never deposited on the high at all.

Both are everyday stratigraphy, and both produce the same thing in a model: a region where the top and base of the zone are the same surface. In this model, where the zone B thickness reaches zero, TopB and BaseB coincide.

Pinch-outs matter well beyond geometry. The line where a zone dies out is a place where a reservoir can be sealed against the rock above, which makes it a trapping mechanism worth mapping carefully. It is also the line beyond which a well cannot find the zone at all, however good the rest of the prospect looks.

## What it does to a thickness map

A thickness grid with a pinch-out in it reads differently from one without.

There will be a region where the values are healthy, up to the maximum of 31 m. There will be a region where they run down towards zero. Between them there is a line where the thickness first reaches zero, and that line is the pinch-out edge, which is one of the outputs a geologist will actually want from you. Beyond it the grid holds zeros over a continuous region rather than an occasional isolated node.

The single most important thing to keep straight is what those zeros mean. A zero says the top and base of the zone are in the same place and there is no rock between them. It is a value, computed at a live node, and it is a geological statement: this zone is absent here. It is not a gap in the data, it is not a null, and it is not something to be filled in.

That distinction is the whole subject of lesson 5, and it changes how you handle these nodes at every later step. For now, notice that all 500 nodes of the zone B thickness grid carry a value. None of them is missing. 320 of those values are positive and 180 of them are zero.

## The awkward consequence

Now put the mean back in front of you. Zone B has a mean thickness of 10.24 m over all 500 nodes, and it has a maximum of 31 m, and it does not exist at all over 180 nodes.

Ask yourself what 10.24 m is describing. It is not the thickness anywhere in particular. It is not what a well would find in the region where the zone is present, and it is not what a well would find where the zone has gone, which is nothing. It is an average taken across a region that includes a large area of absent rock, and how you handle that is the difference between a defensible number and a misleading one.

The panel below shows both thickness grids on the model frame, together with the framework statistics.

{{panel:em-framework-explorer}}

## Exercise

From the statistics above, work out how many nodes of the zone B thickness grid hold a zero, and check that number against something you learned in the previous module. Then say in one sentence what the zero at one of those nodes means.

Self check: the grid is defined at all 500 nodes and 320 of them are positive, so $500 - 320 = 180$ nodes hold a zero. That is the same 180 that the clamp reported fixing on BaseB, which is the cross-check that confirms the thickness grid was built from the clamped surfaces. A zero at one of those nodes means TopB and BaseB sit at the same depth there and zone B is absent, rather than thin and rather than unmeasured.
