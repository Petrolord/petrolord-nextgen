# Honouring the wells

A thin-plate spline passes exactly through its control points. That property survives the subtraction, mostly. This lesson checks it at all six wells and finds one that cannot be checked at all.

{{panel:mp-isochore-explorer}}

## The check

For each well, compare its **measured** thickness, base pick minus top pick, against the **mapped** thickness sampled from the isochore at its own coordinates.

| Well | Location | Measured | Mapped | Difference |
| --- | --- | --- | --- | --- |
| Ekene-1 | (1000, 1000) | 32 | 32 | 0 |
| Ekene-2 | (2200, 1150) | 36 | blank | not available |
| Ekene-3 | (1400, 2300) | 29 | 29 | 0 |
| Ekene-4 | (2600, 2500) | 25 | 25 | 0 |
| Ekene-5 | (600, 1900) | 31 | 31 | 0 |
| Ekene-6 | (1900, 1800) | 34 | 34 | 0 |

Five of six are exact, to every digit. The sixth returns no value at all.

## Why five are exact

The spline honours its control exactly, so at Ekene-1 the top surface returns 1548 and the base surface returns 1580, and their difference is 32 with no rounding worth mentioning.

That the difference is also exact is a small extra step. Both surfaces are exact at that node, so the subtraction of two exact values is exact. An interpolator that only approximately honoured its control, such as a smoothing spline with a tension parameter, would leave a small residual on each surface and the isochore would carry the sum of the two.

The exactness only holds **at the node**. Five of the six wells sit on grid nodes because their coordinates happen to be multiples of the 100 m cell offset from the frame origin at (400, 800). That is a property of this teaching fixture, not of well locations in general.

## Why Ekene-2 is blank

Ekene-2 is at (2200, 1150). The frame has $y_0 = 800$ and $dy = 100$, so grid rows sit at 800, 900, 1000, 1100, 1200 and so on. There is no row at 1150.

Sampling a value there means bilinear interpolation from the four surrounding nodes: (2200, 1100), (2300, 1100), (2200, 1200) and (2300, 1200). Check them on the top surface:

| Node | Value |
| --- | --- |
| (2200, 1100) | blank |
| (2300, 1100) | blank |
| (2300, 1200) | blank |
| (2200, 1200) | 1564.3404541015625 |

Three of the four are dead. Ekene-2 is a vertex of the control hull, sitting on the boundary of the mapped area, and the nodes on its outer side fall outside the hull. Bilinear interpolation with any dead corner returns a blank, so the map returns no value at Ekene-2.

**The map cannot report a value at one of its own control wells.**

That is not a bug and it is not a failure of the spline, which honours Ekene-2 perfectly in the sense that the fitted surface passes through 1565 at exactly (2200, 1150). It is a consequence of sampling a masked grid at a location on its boundary. The information is in the fit; it is the gridded, masked, node-based representation that cannot deliver it.

## What to do about it

Three responses, in order of preference.

**Check control honouring at the fit rather than at the grid** where the tool allows it, since that is the question actually being asked.

**Move the frame** so that the wells land on nodes. Shifting $y_0$ from 800 to 750 would put Ekene-2's row on a node and the check would run. On a real project with dozens of wells that is not achievable for all of them.

**Accept the blank and say so.** Reporting that five of six wells honour exactly and the sixth cannot be sampled because it lies on the mask boundary is a complete and honest statement. Reporting five of five, quietly dropping Ekene-2, is not.

## Worked example

A quality-control script samples a thickness map at every well and reports the mean absolute difference between measured and mapped. On Ekene it would find five differences of zero, one blank, and report a mean absolute difference of 0.

Is that a passing result? Only with the blank stated. A mean of zero over five wells says the interpolator is honouring its control, which is worth confirming. It says nothing at all about the sixth well, and the sixth is the one on the edge of the map where the surface is least constrained and most likely to be wrong away from the pick.

## Exercise

State how many of the six wells the isochore reproduces exactly and which one it cannot report, then explain in two sentences why that well returns a blank even though the spline fits it perfectly.

As a self-check: five of six are reproduced exactly and Ekene-2 returns a blank. Its coordinates (2200, 1150) do not land on a grid row, so the value there must be interpolated from four surrounding nodes, and three of those four lie outside the control hull and are dead; bilinear interpolation returns a blank whenever any corner is dead, so the masked grid cannot deliver a value at a location the underlying fit honours exactly.
