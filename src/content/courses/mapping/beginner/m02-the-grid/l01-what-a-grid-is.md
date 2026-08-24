# What a grid is

The previous module left you with control points: six wells, each with an x, a y and a depth for TOP_SAND. That is the input. The output of mapping is a gridded surface, and before you can grid anything you need to know exactly what that object is.

A gridded surface is a regular rectangular lattice of nodes. Every node sits at a fixed position in map coordinates, and every node holds one number, the depth of the mapped surface at that position. Some nodes hold no number at all, because the map declines to guess that far from the data. The lattice is the map. Everything you later do to a map, contour it, difference it, sample it, integrate it, is done to that lattice of numbers.

## Why not just keep the points

It is fair to ask why the points are not enough, since they are the only real data. The answer is that a scattered set of points supports none of the four operations a map exists for, while a regular array supports all four almost trivially.

Contouring needs neighbours. A contour line is traced by walking from cell to cell and asking, on each cell edge, where the chosen depth value falls between the two ends. That question only has an answer if you know which node is next to which, and a lattice answers it by construction: the node to the right, the node above. Six loose points have no defined neighbours, so there is no path for a contour to follow.

Differencing needs a shared frame. Subtracting a top surface from a base surface to get thickness is a node-by-node subtraction. It works only when both surfaces are stored on the same lattice, so that node number 137 on one means the same place on the ground as node number 137 on the other. Two clouds of points measured at different wells cannot be subtracted at all.

Sampling needs coverage. Asking for the depth at a proposed well location means asking for a value at a place with no measurement. On a grid the location falls inside one cell, bounded by four nodes, and a value can be interpolated between them. On a point set the honest answer is that there is no value there.

Integration needs area. Gross rock volume is a sum over the map area, each cell contributing its own small volume from its known and constant footprint. Points have no area, so nothing can be integrated over them.

That is the trade the grid makes. It converts a small set of measurements into a large set of estimates, and it buys computability with that conversion. Module 3 covers how the estimates are produced. This module covers the lattice they are written onto.

## The vocabulary

Four words appear in every lesson from here to the capstone, and this course uses them consistently.

A **node** is one lattice position. It is a location plus at most one value. It is not a cell, not a well and not a pick. When a summary panel reports a count of nodes it is counting lattice positions, nothing else.

The **cell size** is the spacing between neighbouring nodes, quoted in metres. This course grids square cells, so the same number applies across and up. A cell size of 100 m means adjacent nodes sit 100 m apart on the ground.

The **frame**, also called the **spec**, is the geometry of the lattice with no depth values in it yet: an origin, meaning the map coordinates of the first node, a count of nodes across and a count up, and the cell size. Give those numbers to the engine and the position of every node follows. The next lesson computes the frame for the Ekene field explicitly.

A **live node** carries a value. A **null node** was deliberately left blank, because it sits too far from any control point for the map to make a defensible estimate. Null is not an error and it is not a missing number waiting to be filled in. It is a statement: the data does not reach here. Module 4 is entirely about that statement, and the capstone grades how many nodes you allowed to go live.

Notice what the pair implies. A grid always has a total node count fixed by its frame, and a live count that is usually smaller. Both numbers matter, and they mean different things. Total nodes tells you how finely you chose to sample the area. Live nodes tells you how much of that area your six wells were able to support.

## Reading the grid convention

One more detail, because it explains the shape of the numbers you will see. The engine stores the values in a single row-major array, and the world position of a node follows the frame directly: x is the origin x plus the column number times the cell size, and y is the origin y plus the row number times the cell size. That is why a grid is always quoted as a pair of counts, across then up, and why the total node count is simply the two multiplied together.

## Exercise

In your own words, define node, cell size, frame and live node, then state one map operation from this lesson that a scattered point set cannot support and say why.

As a self-check: a node is one lattice position holding at most one value; cell size is the ground spacing between neighbouring nodes; the frame is the origin plus the two node counts plus the cell size, which fixes where every node sits; a live node is one carrying a value, as opposed to a null node deliberately left blank. Any of contouring, differencing, sampling or integration is a valid answer, and the reason in every case comes back to the same thing: the operations need defined neighbours, a shared frame or an area, and loose points have none of those.
