# Cell size and the thickness map

The Associate tier established that live node counts are a setting rather than knowledge. This lesson runs the same test on the isochore and sorts its six capstone fields into the ones the cell size moves and the ones it cannot touch.

{{panel:mp-isochore-explorer}}

## The sweep

Grid both surfaces at 50, 100 and 200 m and read the isochore each time.

| | 50 m | 100 m | 200 m |
| --- | --- | --- | --- |
| Frame | 45 x 35 = 1575 | 25 x 20 = 500 | 15 x 13 = 195 |
| Live nodes | 794 | 201 | 50 |
| Minimum | 25 | 25 | 26.733154296875 |
| Maximum | 36 | 35.897705078125 | 35.897705078125 |
| Map mean | 32.28733137692853 | 32.25429068038713 | 32.271982421875 |
| At P-1 | 34.050048828125 | 34.050048828125 | 34.050048828125 |
| Contour interval | 2 m | 2 m | 1 m |
| Well mean | 31.166666666666668 | 31.166666666666668 | 31.166666666666668 |

## Three kinds of number

Read the table by row rather than by column and the six capstone fields sort themselves into three groups.

**Fixed by the fit.** The thickness at P-1 is byte-identical at all three settings: 34.050048828125 m. P-1 lands on a node in every frame and a node value is the spline evaluated there, so the grid is only a sampling of a function that never changed.

**Fixed by the wells.** The mean of the six well thicknesses is 31.166666666666668 m at every setting, because no gridding is involved in it at all. It is six numbers averaged.

**A property of the grid.** The live node count is 794, 201 or 50 depending purely on the cell size, and every one of those is a correct answer to the question the count asks, which is how many nodes survived the mask. The count carries no information about the rock, which is why the capstone fixes the cell size at 100 m before grading it exactly.

The remaining three fields, the minimum, the maximum and the map mean, sit in between: they are statistics over the node set, so the cell size moves them, but only a little and for reasons that can be named.

## Why the extremes move

The minimum is 25 m at 50 and 100 m, and 26.733 m at 200 m. The maximum is 36 m at 50 m and 35.8977 m at 100 and 200 m.

Both are node placement, covered two lessons ago. At 50 m the grid has a node at Ekene-2 and captures its 36 m; at 100 and 200 m it does not. At 200 m the grid loses the node at Ekene-4 and with it the 25 m minimum.

The extremes of a map are the values most sensitive to node placement, because an extreme is by definition a single node. Every other statistic is an average over many.

## Why the mean barely moves

The map mean is 32.2873, 32.2543 and 32.2720 at the three settings. The total spread is 0.033 m across a factor of sixteen in node count.

That stability is worth noticing. The mean is an average over the live nodes, and refining the grid mostly adds nodes between existing ones, where the spline value is close to what its neighbours already reported. Averages are robust to that; extremes are not.

The practical consequence is a ranking of trust. On a map derived from sparse control, believe the mean, treat the extremes as approximate, and treat the node count as a setting.

## The one number that is robust for a different reason

The gap between the map mean and the well mean is $+1.121$ m at a 50 m cell, $+1.088$ m at 100 m and $+1.105$ m at 200 m.

That gap survives a sixteenfold change in node count almost unchanged, which says it is a property of the field and the well pattern rather than an artefact of gridding. It is the subject of the next module, and this is the evidence that the module is about something real.

## Worked example

A colleague reports that refining the grid from 100 m to 50 m changed the mapped thickness at a prospect by 3 m, and concludes the map is unstable. What is the likely explanation?

Not instability. On this dataset a node value does not change at all with cell size, so a 3 m move means the prospect does **not** land on a node in one of the two frames and is being bilinearly interpolated between nodes there. Bilinear interpolation between nodes of a curved surface undershoots the curvature, and the size of that undershoot scales with the square of the cell size.

The response is to check whether the location falls on a node, and if it does not, to read the value from the fit rather than from the grid, or to refine until the interpolation error is negligible.

## Exercise

Sort the six capstone fields into those that change with cell size and those that do not, then state the total spread of the map mean across the three settings and say what that spread implies.

As a self-check: the thickness at P-1 and the mean of the six well thicknesses do not change; the live node count, the minimum, the maximum and the map mean all do. The map mean spans 32.2543 to 32.2873, a spread of 0.033 m across a sixteenfold change in node count, which implies the mean is essentially a property of the surface rather than of the grid and can be quoted with the cell size attached as a condition rather than as a caveat.
