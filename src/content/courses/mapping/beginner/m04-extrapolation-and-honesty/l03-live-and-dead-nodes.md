# Live and dead nodes

The mask from the previous lesson splits the grid into two populations, and the rest of the course depends on keeping them apart. This lesson gives them their names and works through the consequences, because most of the ways a mapper misreports a map come from treating one population as if it were the other.

## The vocabulary

A **live node** is a node that carries a value. It passed the hull test and the distance test, the spline was evaluated at its coordinates, and a depth was written into the grid.

A **dead node**, also called a null node or simply a blank, carries no value. It failed one of the tests, so the routine skipped it and it kept the null it was initialised with. In the engine that null is the industry export sentinel, 1.0e30, the same value that appears as `1.0000000E+30` in a CPS-3 or ZMAP file. It is not zero, and it is not a depth. It is a marker that says nothing was computed here.

The two words that matter are *by design*. A dead node is not a hole in the map, not a gap that better software would have filled, and not something to be patched before delivery. It is the map's statement that the control does not reach that ground.

## Statistics run over live nodes only

The engine tracks the live count as it goes, incrementing it only when it writes a value, and it updates the running minimum and maximum inside that same branch. Nulls never enter the comparison. The reported statistics are therefore live only by construction, and yours must be too.

For the Ekene map at a 100 m cell, the mean depth is 1550.27 m and the live count is 201. Both numbers are computed over the 201 live nodes, not over the 500 nodes in the frame. This is exactly the rule the Well Data course insisted on when it made you compute log statistics over finite samples only, with nulls excluded rather than counted as data. The rule has not changed just because the data is now a surface. If you averaged all 500 nodes with the sentinel included, the 299 nulls at 1.0e30 apiece would swamp the sum and you would report a mean of roughly 6 times 10 to the 29, which is not wrong by a little.

So when you quote a mean depth, a minimum, a maximum, or an area from a gridded surface, the population is the live nodes. Say so.

## The live count belongs to the settings, not to the geology

The live count is one of the six capstone numbers you will report at the end of this course, and it is the one most easily misread, because it sounds like a property of the field. It is not. It is a property of how you set up the grid.

Same six wells, same picks, same 800 m extrapolation limit, three cell sizes:

| Cell size | Frame nodes | Live nodes | Live share |
| --- | --- | --- | --- |
| 50 m | 1575 | 794 | 50.4 percent |
| 100 m | 500 | 201 | 40.2 percent |
| 200 m | 195 | 50 | 25.6 percent |

Nothing about the subsurface differs between those three rows. The surface is the same surface; only the sampling changed. A learner who says "the map has 794 live nodes" without saying the cell was 50 m has said almost nothing, because the same map has 201 live nodes and also 50 live nodes, depending on how finely you chose to sample it.

What is nearly invariant is the ground the live nodes cover. Each live node stands for one cell of area, so multiply:

* 50 m cell: $794 \times 2{,}500 = 1{,}985{,}000$ square metres.
* 100 m cell: $201 \times 10{,}000 = 2{,}010{,}000$ square metres.
* 200 m cell: $50 \times 40{,}000 = 2{,}000{,}000$ square metres.

All three land within about 1 percent of 2.0 million square metres, roughly 2 square kilometres. That is the honest quantity: the mapped area, which is set by the wells and the extrapolation limit. The live count is that area divided by the cell size you happened to pick, and the small differences between the three rows are just how the node pattern happens to fall against the mask edge at each resolution.

The practical habit follows directly. A live count is only meaningful when it is quoted with its cell size, and if you want a number that survives a change of grid settings, convert to area before you report it.

## Blank is information

The last point is the one that is easiest to lose when you are trying to make a map look finished. A blank area is not an absence of output. It is output.

The blank ground on the Ekene map tells a reader four things at a glance: where the wells are not, how far the study was willing to extend beyond them, that somebody set that limit deliberately, and which parts of any contour pattern are therefore unsupported. A map that filled that ground with smoothly extrapolated values would look more complete and would tell the reader none of it.

When a manager asks why 60 percent of the frame is empty, the answer is not an apology. It is that six wells over about 2 square kilometres of mapped ground is what the data supports, and the empty frame is the honest picture of how much ground that is.

## Exercise

You are handed a surface with 1250 live nodes and told the cell is 25 m. Work out the mapped area in square kilometres, then work out how many live nodes the same mapped area would give at a 100 m cell, and state in one sentence what you would have to add to the sentence "the surface has 1250 live nodes" to make it a useful statement.

Self check: $1250 \times 625 = 781{,}250$ square metres, which is about 0.78 square kilometres. At a 100 m cell each node covers 10,000 square metres, so the same area is about 78 nodes. The sentence needs the cell size, because without it the count fixes neither the area nor anything else about the map.
