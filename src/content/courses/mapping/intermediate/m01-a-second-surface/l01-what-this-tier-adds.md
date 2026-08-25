# What this tier adds

The Associate tier built one surface. Six TOP_SAND picks became six control points, a frame of 25 by 20 nodes at a 100 m cell, a thin-plate spline filled the gaps, an 800 m mask left 201 live nodes of 500, and contours at 10 m made it readable. You finished with a crest of 1539.72 m, a deepest point of 1590 m and a depth of 1542.62 m at prospect P-1.

Everything in that sentence stays true here. This tier adds a second surface and starts doing arithmetic between the two.

## From a picture to an operand

A depth map is usually treated as an end product: something to look at, contour and hand over. That view runs out quickly, because almost every question a project actually asks needs two surfaces rather than one.

How thick is the reservoir? Base minus top. How much rock is there? Thickness times area. Has the interval thinned toward the flank? Compare the thickness map with the depth map. Did the sand shale out to the east? Look at where the thickness goes to nothing.

None of those can be answered from a single surface, and all of them are ordinary. So the Professional tier stops treating a grid as a picture and starts treating it as a **number at every node**, which two grids can be combined into a third.

## The second pick

The same six Ekene wells already carry a second pick, BASE_SAND, at the base of the same reservoir interval. Grid it on the same frame, at the same cell size, by the same method and with the same extrapolation limit, and you have two surfaces that are comparable node for node. Subtract the top from the base and the difference is an **isochore**: a map of thickness rather than depth.

That is the whole mechanical content of this tier, and it takes about two minutes to run. The rest of the tier is about what the result means and where it misleads, which takes considerably longer.

## What you will read

Six numbers, all from the isochore panel.

- The **minimum thickness**, 25 m.
- The **maximum thickness**, 35.897705078125 m.
- The **mean thickness** over the map, 32.25429068038713 m.
- The **thickness at prospect P-1**, 34.050048828125 m.
- The **live node count** of the isochore, 201, which is graded exactly.
- The **plain arithmetic mean of the six well thicknesses**, 31.166666666666668 m.

The last two are the interesting ones. The live count is 201, the same as both input surfaces, and understanding why that is not a coincidence is module 2. And the two means, 32.254 from the map and 31.167 from the wells, are both honest averages of the same rock and they are not the same number. Module 4 exists for that gap.

## Three results to carry

**A grid is arithmetic, not a picture.** Two surfaces on the same frame can be added, subtracted and compared node by node, and the result is a grid with its own statistics, its own extremes and its own contour interval.

**The frames must match exactly.** Same origin, same cell size, same node count. Subtracting grids that disagree about where node (0,0) is produces a plausible-looking map of nothing.

**A map mean is an area average and a well mean is not.** They answer different questions, both are correct, and quoting one when the other was wanted is how a volume estimate goes wrong without anybody making an arithmetic mistake.

## What this tier does not do

It does not revisit gridding. The spline, the mask, the cell size and the crest problem are the Associate tier's material and they are unchanged here.

It does not validate anything. Whether the isochore is any good, whether the map predicts thickness at a location with no well, and how far wrong it is likely to be, are all Expert tier questions. This tier builds the instrument. The tier above tests it.

## Exercise

Name three project questions that cannot be answered from a single depth surface, and say for each one which two surfaces would answer it. Then state, in one sentence, why the two means in the capstone differ.

As a self-check: reservoir thickness needs the base and the top of the same interval; gross rock volume needs a thickness map and an area, which is the same pair plus the mask; and whether an interval thins toward a flank needs the thickness map read against the depth map. The two means differ because the well mean weights six wells equally while the map mean weights 201 nodes equally, which is a weighting by area rather than by well, and the area each well happens to control is set by the well spacing and by where the mask falls.
