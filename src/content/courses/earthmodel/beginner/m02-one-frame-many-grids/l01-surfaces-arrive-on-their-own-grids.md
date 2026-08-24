# Surfaces arrive on their own grids

A framework build starts with whatever the interpreters hand over, and what they hand over is almost never tidy. This lesson looks hard at the three source surfaces of the golden model, because the shape of that mess is the reason the next three lessons exist.

## The three source grids

Here are the three surfaces exactly as they arrive, shallow to deep.

| surface | grid | cell size | origin |
| --- | --- | --- | --- |
| TopA | 40 x 32 | 40 by 40 m | (900, 1900) |
| TopB | 27 x 27 | 60 by 45 m | (950, 1950) |
| BaseB | 30 x 25 | 55 by 55 m | (880, 1880) |

Go through the table column by column and check how little agreement there is.

The node counts differ. TopA is 40 across by 32 up, TopB is 27 by 27, BaseB is 30 by 25. No two of them hold the same number of nodes, so no two of them can be put side by side and subtracted.

The cell sizes differ. TopA is on 40 m cells, BaseB is on 55 m cells, and TopB is on 60 m across by 45 m up, which is not even square. A surface on rectangular cells is perfectly legal and it happens whenever somebody grids to a survey geometry that is not square, but it means TopB's resolution is different in the two directions.

The origins differ. TopA starts at (900, 1900), TopB at (950, 1950), BaseB at (880, 1880). Even if two of the surfaces had happened to share a cell size and a node count, an origin offset would put their nodes in different places on the ground.

And none of the three matches the model frame, which sits at 25 by 20 nodes on 50 m cells with its origin at (1000, 2000).

## Why this is normal

It is tempting to read that table as evidence that somebody was careless. It is not. It is what a real project looks like, for four ordinary reasons.

Different vintages. TopA might have been mapped from a survey shot ten years before the one that gave TopB. Each interpretation was gridded on whatever was appropriate at the time.

Different contractors. Surfaces bought from two processing houses come back on two grid conventions, because each house has house defaults.

Different data density. A surface with dense well control and a strong seismic pick can support a fine grid. A surface picked on a weak reflector with three wells on it cannot, and gridding it finely would fabricate detail. Choosing a coarser cell size for the poorer surface is the honest choice, and it leaves you with two grids that do not match.

Different purposes. A surface gridded for a regional overview covers a wide area coarsely. The same horizon gridded for a development area covers less ground finely. Both are legitimate, and a project accumulates both.

None of those reasons goes away by complaining about them. The framework build takes the surfaces as they are.

## What the mismatch costs you

The cost is precise: nothing can be subtracted.

A zone thickness is a subtraction of one surface from another, node by node. That operation needs the two surfaces to share a frame, so that node number 137 on one refers to the same place on the ground as node number 137 on the other. Across these three grids no such correspondence exists. Node 137 on TopA and node 137 on TopB are two different points in the field, and subtracting them produces a number with no meaning attached to any location.

The same problem blocks everything downstream. No thickness means no zone. No zone means no volume. No shared frame means the clamp in module 3 has nothing to compare, because it can only ask whether BaseB is below TopB at a node if both surfaces have a value at the same node.

There is a second and quieter cost. Because the surfaces cover slightly different ground, a naive comparison of their statistics is not a comparison of the same field. A mean depth of one surface computed over its own 40 by 32 grid and a mean depth of another computed over its own 27 by 27 grid were averaged over different areas. They are not comparable, even though both are labelled a mean depth in metres. That is the first appearance in this course of the habit that runs through all of it: a mean means nothing until you say what it was averaged over.

## Reading a grid specification

One piece of arithmetic before the next lesson, because you will do it many times.

A grid specification is an origin, two node counts and a cell size, and everything else follows from it. The world position of a node is the origin plus the column number times the cell size across, and the origin plus the row number times the cell size up. The extent of the grid is therefore the node count minus one, times the cell size.

Work TopA through. It has 40 nodes across at 40 m, so 39 intervals, which is 1560 m, and it runs in x from 900 to 2460. It has 32 nodes up at 40 m, so 31 intervals, which is 1240 m, and it runs in y from 1900 to 3140. Do the same for TopB and BaseB and you find that all three source grids cover the ground the model frame occupies, with room to spare on every side.

That last fact matters more than it looks, and the resampling lesson comes back to it. A model frame node that falls outside a source grid has no value to read, and the surface has a hole at that node. On this model no node falls outside, which is why the resampled surfaces come out complete.

## Exercise

Using the grid specification rule above, compute the extent of the BaseB source grid in x and in y, and state the map coordinates of its last node in each direction. Then say in one sentence why a mean depth quoted from TopA's own grid cannot be compared with a mean depth quoted from TopB's own grid.

Self check: BaseB has 30 nodes across at 55 m, so 29 intervals of 55 m, which is 1595 m, running in x from 880 to 2475. It has 25 nodes up at 55 m, so 24 intervals, which is 1320 m, running in y from 1880 to 3200. If you got 30 and 25 intervals you dropped the fence post, which the next lesson deals with directly. The two mean depths are not comparable because they were averaged over different sets of nodes covering different ground, so the difference between them mixes a real difference in depth with a difference in what was averaged.
