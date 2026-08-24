# The grid frame

The frame is the geometry the map is written onto: an origin, a count of nodes across, a count of nodes up, and the cell size. You do not type those numbers into the app. The engine derives them from the control points and one setting you do choose, the cell size, plus a fixed padding margin. This lesson works the derivation through by hand for the Ekene field, because the numbers it produces reappear in the capstone.

## What the engine is given

The control for TOP_SAND is the six Ekene wells. Their map coordinates span x from 600 to 2600 and y from 1000 to 2500. Ekene-5 is the western well at x 600, Ekene-4 the eastern one at x 2600 and also the northern one at y 2500, and Ekene-1 the southern one at y 1000. That rectangle is the smallest box containing every measurement.

The engine does not use that box as the map. It pads it, by a fixed two cells on every side. The reason is practical: a map that stops exactly at the outermost well has no room to close a contour around a well on its edge, so every contour would run off the sheet. Two cells of margin gives the surface somewhere to go.

Note what the pad is measured in. It is two cells, not a fixed distance, so its size in metres follows the cell size you chose: 200 m each side at a 100 m cell, 400 m at a 200 m cell. The frame therefore changes shape when you change the cell size, which is the subject of the next lesson.

## The arithmetic across

Take the capstone setting, a cell size of 100 m, and work the x direction first.

The control spans x from 600 to 2600, which is 2000 m wide. The pad is two cells at 100 m, so 200 m, subtracted from the western edge and added to the eastern one. The origin x is therefore 600 minus 200, which is **400**, and the eastern edge is 2600 plus 200, which is **2800**.

Now count the nodes. The frame runs from 400 to 2800, a span of 2400 m. At 100 m spacing that span contains 2400 divided by 100, which is 24 intervals. Nodes sit at both ends of every interval, so the node count is 24 plus 1, which is **25**.

That 25 is one of the six numbers the capstone asks you for, so it is worth being able to reproduce it two ways. The second way is the engine's own formula: take the control span of 2000 m, divide by the cell size to get 20, add 1 for the fence-post, then add two cells of pad on each side, which is 4 more. That gives 20 plus 1 plus 4, which is 25 again.

## The arithmetic up

The y direction runs the same way with different numbers. The control spans y from 1000 to 2500, which is 1500 m. Pad 200 m each side: the origin y is 1000 minus 200, which is **800**, and the northern edge is 2500 plus 200, which is **2700**.

The frame spans 2700 minus 800, which is 1900 m. At 100 m spacing that is 19 intervals, so 19 plus 1, which is **20** nodes.

By the engine's formula: 1500 divided by 100 is 15, plus 1 is 16, plus 4 for the pad is 20. The two routes agree.

So the Ekene capstone frame is an origin at (400, 800), 25 nodes across and 20 nodes up, at a 100 m cell. The map covers x from 400 to 2800 and y from 800 to 2700. Multiply the counts and the grid holds 25 times 20, which is 500 nodes in total.

## The fence-post rule

The single most common arithmetic error in gridding is the one the Well Data course already warned you about, and it is worth stating again in map form.

A span of 2400 m at 100 m spacing holds 25 nodes, not 24. The 24 is the number of gaps between nodes. The 25 is the number of nodes, because the first node sits at the start of the first gap and every gap after it adds one more node at its far end. Fence posts and fence panels: a straight 24 panel fence needs 25 posts.

Get this wrong and every number downstream shifts. A 24 by 19 frame would place its last node at 2700 in x, 100 m short of where the pad intended, and its total node count would be 456 rather than 500. The error does not announce itself, because the map still draws. It just quietly covers less ground than you think.

Whenever you convert a distance to a node count, add the one. Whenever you convert a node count back to a distance, subtract the one before multiplying by the cell size. The span from origin to last node is always the count minus one, times the cell size: 24 times 100 is 2400 m across, and 19 times 100 is 1900 m up, exactly as computed above.

## What the frame does not tell you

The frame is geometry only. It fixes where the 500 nodes sit and says nothing about which of them carry a depth. Only 201 of these 500 end up live at the capstone setting, and that split comes from the extrapolation rule in module 4, not from anything in this lesson. Keep the two apart in your head: the frame is a decision about coverage and resolution, and liveness is a decision about honesty.

## Exercise

Recompute the Ekene frame at a cell size of 100 m from the control span alone, and then state the map coordinates of the last node in each direction.

As a self-check: x spans 600 to 2600, so 2000 divided by 100 is 20, plus 1 is 21, plus 4 for the two-cell pad on each side is 25 nodes, with the origin at 400. The last node across sits at 400 plus 24 times 100, which is 2800. In y, 1500 divided by 100 is 15, plus 1 is 16, plus 4 is 20 nodes, origin at 800, last node at 800 plus 19 times 100, which is 2700. If you got 24 and 19, you dropped the fence-post and should reread that section.
