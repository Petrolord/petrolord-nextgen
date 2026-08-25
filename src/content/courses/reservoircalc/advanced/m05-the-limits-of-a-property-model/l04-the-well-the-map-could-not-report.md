# The well the map could not report

Ekene-2 is the one well kriging fails to reproduce. The reason is not in the kriging. It is in where the well sits relative to the grid, and it is the same well that gave the mapping tier the same trouble for a related reason.

## Where Ekene-2 sits

The frame starts at an easting of 400 m and a northing of 800 m, with 100 m spacing in both directions. So nodes exist at eastings of 400, 500, 600 and so on, and at northings of 800, 900, 1000 and so on.

Ekene-2 is at an easting of 2200 m and a northing of 1150 m.

The easting is fine: $2200 = 400 + 18 \times 100$, so it sits on column 18. The northing is not. 1150 lies halfway between the rows at 1100 and 1200 m.

Every other well in the set has both coordinates on a node. Ekene-2 is the exception, by 50 m.

## What happens when you sample there

A grid holds values at nodes. Asking for the value at a location between nodes requires interpolation, and the sampler uses bilinear interpolation from the four surrounding nodes.

For Ekene-2 that means the two nodes at a northing of 1100 m and the two at 1200 m, at eastings of 2200 m. Since the easting is exactly on a column, the interpolation reduces to a straight average in the northing direction, weighted equally because 1150 is exactly halfway.

So the reported value at Ekene-2 is the mean of the grid values 50 m north and 50 m south of it.

## Why the plane survives it and kriging does not

Bilinear interpolation of a linear function is exact. The average of a plane's values at two points is the plane's value at their midpoint, because a plane has no curvature to lose.

So the trend model reports 0.195226 at Ekene-2, which is exactly the plane evaluated there. The trend residual at Ekene-2 is an honest measure of the model's misfit, uncontaminated by sampling.

Kriging is not linear. Its surface bends sharply toward the data at each well, so the kriged grid has a local peak at the node nearest Ekene-2 and falls away from it. Averaging two nodes either side of the well cuts the top off that peak.

The kriged grid reports 0.191177 against the measured 0.19. The kriging honoured the data; the sampling did not preserve it.

## The same well, the same cause, a different symptom

The mapping tier ran into Ekene-2 for the same underlying reason and got a different symptom.

There, the question was the structural grid, and three of the four nodes surrounding Ekene-2 were dead, since the well sits near the edge of the mapped area. Only the node at an easting of 2200 m and a northing of 1200 m carried a depth, at 1564.34 m, so the map could not report a depth at one of its own control wells at all.

Here, the property grid is populated at every node in the frame, dead or alive, so a value always comes back. The failure is quieter: a number is returned and it is slightly wrong.

The general lesson is worth stating in its general form. A gridded model can only report exactly at its nodes. Everywhere else it interpolates, and whether that interpolation preserves your data depends on whether the surface between nodes is linear.

## Reading it off the panel

Set the method to krige and look at the Ekene-2 post.

{{panel:rc-property-explorer}}

Its ring is red while the other five are green, and the bracket reads plus 0.0012. Nothing about the model is wrong; the well simply does not sit where the grid can speak exactly.

Now switch to trend. Every ring is red, including Ekene-2, but Ekene-2's number is now the plane's honest value at that location rather than a sampling artefact.

## Worked example

Confirm the mechanism by predicting the discrepancy's direction before checking it.

Kriging puts a local high at Ekene-2's value of 0.19, in a neighbourhood where the surrounding trend of the data is higher, since Ekene-6 at 0.22 lies 800 m to the north west. So the kriged surface should rise as you move away from Ekene-2 in most directions.

Averaging the nodes 50 m north and 50 m south of the well therefore samples two points that are both a little higher than the well. The reported value should come out above 0.19.

It does: 0.191177, which is 0.001177 high. The sign follows from the geometry without any computation.

## Exercise

State the condition under which sampling a gridded property at an arbitrary location returns the exact modelled value, and say which of the three population methods satisfies it everywhere.

Self check: the sample is exact when the modelled surface is linear between nodes, since bilinear interpolation reproduces a linear function exactly. Both the constant and the trend methods satisfy this, the constant trivially and the trend because it is a plane. Kriging does not, so any kriged value read off between nodes is an approximation to the model rather than the model.
