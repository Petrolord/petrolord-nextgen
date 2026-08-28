# Intersecting the grid

The path and the grid are both simple objects. Finding where they meet is a short algorithm, and knowing how it works tells you what its answer can and cannot be trusted for.

## The algorithm

Walk the path in small steps. For each step, take its midpoint, find which cell that point is in, and add the step's length to that cell's total. Merge consecutive steps that land in the same cell.

The step size is chosen as a fraction of the smallest cell dimension, so no cell can be crossed in a single step. On this grid the layers are the smallest dimension at about 6 ft, so the walk proceeds in steps of a foot or two.

## Finding the cell for a point

Two divisions and a search.

$$i = \left\lfloor \frac{x}{dx} \right\rfloor + 1, \qquad j = \left\lfloor \frac{y}{dy} \right\rfloor + 1$$

then walk down that column's layer interfaces until you find the layer containing the point's depth. If the point is above the column's top or below its base, it is outside the grid and the step is discarded.

That last case matters and lesson 5 takes it up.

{{panel:sim-build-explorer}}

The map shows the cells the trajectory crosses. Move the toe and watch the set change.

## The Ekene side-track

Eleven connections across eight distinct columns:

| i | j | k | length (ft) | dir |
|---|---|---|---|---|
| 20 | 19 | 1 | 204.54 | X |
| 19 | 19 | 1 | 69.14 | X |
| 19 | 20 | 1 | 257.84 | X |
| 19 | 20 | 2 | 83.55 | X |
| 18 | 20 | 2 | 204.54 | X |
| 18 | 21 | 2 | 177.17 | X |
| 18 | 21 | 3 | 28.81 | X |
| 17 | 21 | 3 | 208.86 | X |
| 17 | 21 | 4 | 132.52 | X |
| 17 | 22 | 4 | 69.14 | X |
| 16 | 22 | 5 | 204.54 | X |

Read it as a journey. The well starts in column (20, 19) in layer 1, steps west, steps north, drops into layer 2, keeps going, and finishes in column (16, 22) in layer 5. Eleven cells, eight columns, five layers.

## Why eleven and not eight

Because the path changes layer as it goes. Three columns are entered in one layer and left in the next, so they contribute two connections each rather than one.

That is visible in the table: column (19, 20) appears twice, once in layer 1 and once in layer 2, and so do (18, 21) and (17, 21).

## The lengths

They vary from 28.81 ft to 257.84 ft. The short ones are cells the path merely clips at a corner; the long ones are cells it runs the full width of.

Those lengths feed straight into the well index, so a 28 ft connection contributes about an eighth of what a 257 ft one does, all else equal. A connection list without lengths would treat them as equals and overstate the well's productivity.

## The answer is not exact

It is a discretised walk, so the lengths are accurate to about the step size. That is far below anything that matters for a well index, and it is worth knowing the answer is a numerical result rather than a closed form.

Halve the step size and the connection SET will be identical while the lengths shift in the second decimal. If the set changes when you refine the step, the path is grazing a cell boundary, and that is worth knowing about.

## The misconception to avoid

"The connection list can be read off a map." A map shows the columns, which is eight of the eleven. The layer transitions are invisible on a plan view and they are half the information. Reading a deviated completion off a map and typing it into COMPDAT loses the layer sequence and every length.

## Exercise

First, from the table, list the three columns the path enters in one layer and leaves in another, and confirm the count of eleven connections against eight columns.

Second, the shortest connection is 28.81 ft and the longest 257.84 ft. State the ratio and say what that implies about their relative contributions to the well.
