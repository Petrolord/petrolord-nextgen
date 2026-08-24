# The extrapolation limit

The previous lesson ended with a requirement: the map must show where it stops knowing. The engine meets that requirement with a distance rule. Nodes that are too far from any control point are not mapped at all. They are not smoothed, not faded, not flagged in a legend. They are written as nulls, which means the map has no value there and never claims to.

## What the code actually does

The gridding routine allocates the output array and fills every node with the null sentinel before it computes anything. Values are then written over that null background, node by node, and only where two tests pass.

The first test is geometric: the node must lie inside the convex hull of the control points, the taut band from the previous lesson. The second test is the extrapolation limit. The routine walks the control set and asks whether any well is within the limit of this node, comparing squared distances:

```
dx = x - point.x
dy = y - point.y
if (dx * dx + dy * dy <= maxExtrap2) { near = true; break }
```

Two details in those three lines are worth noticing. First, nothing is square rooted. The limit is squared once, before the loop over nodes begins, and every comparison is made in squared units, which is the same test with less arithmetic. With an 800 m limit the stored threshold is $800^2 = 640{,}000$. Second, the loop breaks at the first control point that qualifies. A node does not need to be near all the wells, or near most of them. One well inside the limit is enough to make it mappable.

If either test fails, the routine moves on and the node keeps the null it was initialised with. Nothing is written and the live counter is not incremented. Blank is the default state of the grid, and a value is something a node has to earn.

## Why 800 m for the Ekene map

The limit is a setting, not a law of nature. The engine's own default is two grid cells, which at a 100 m cell would be a cautious 200 m. This course overrides it to 800 m, and the reasoning is about well spacing rather than about the grid.

Work out how far apart the Ekene wells actually are. Ekene-3 (1400, 2300) and Ekene-6 (1900, 1800) are $\sqrt{500^2 + 500^2}$, about 707 m apart. Ekene-2 (2200, 1150) and Ekene-6 are about 716 m apart. Ekene-1 (1000, 1000) and Ekene-5 (600, 1900) are about 985 m apart, and Ekene-1 to Ekene-6 is about 1204 m. Call it roughly a kilometre between neighbours.

An 800 m limit therefore lets the map reach a little under halfway toward wherever the next well would be if somebody drilled one, and no further. That is a defensible statement to make in a review: this map extends its estimates about half a well spacing past the data, which is the distance over which a trend measured between wells has some claim to persist. Anything further is a different kind of claim, and it should be made deliberately, in writing, not by leaving a gridding parameter large.

## The arithmetic consequence

The Ekene frame at a 100 m cell starts at (400, 800) and runs 25 columns by 20 rows, which is $25 \times 20 = 500$ nodes. Of those, 201 pass both tests and carry a value. The other $500 - 201 = 299$ are null.

That is 201 divided by 500, or 40.2 percent live, against 299 divided by 500, or 59.8 percent blank. Just under 60 percent of the frame you allocated is deliberately empty. That is not waste and it is not a failure of the gridding. It is the map declining to answer where it has no basis for an answer.

The shape of the live area is worth a moment too. The frame is a rectangle, because a grid has to be. The mapped area inside it is not, because the six wells are scattered rather than arranged in a neat rectangle. The live region is a rough polygon that follows the well pattern, with corners of the frame left blank because the hull edge cuts across them. Cross check it with area: 201 live nodes at a 100 m cell cover $201 \times 10{,}000 = 2{,}010{,}000$ square metres, and the hull drawn around the six wells encloses about 1.96 million square metres. The two agree closely, which tells you that at this well spacing almost every point inside the hull is already within 800 m of some well, so the hull edge is what trims most of the frame. On a long, thin survey, or with wells 3 km apart, the distance limit would be the gate that bites hardest.

One last property: the limit changes where values exist, not what they are. The spline is fitted to all six wells before any masking happens, so a node that is live at an 800 m limit holds exactly the same depth if you raise the limit to 2000 m. Widening the limit does not refine the map. It only lights up more ground on the strength of the same six measurements.

Try it yourself: the blank ground in the panel below is where the 800 m limit stopped the grid.

{{panel:mp-map-explorer}}

## Exercise

A node sits 640 m from its nearest well and 1100 m from the next nearest. Decide whether it is live under the course limit of 800 m, and whether it would be live if a reviewer tightened the limit to 500 m. Do the test the way the code does, in squared units.

Self check: the node's squared distance to the nearest well is $640^2 = 409{,}600$. The 800 m threshold squares to 640,000, and 409,600 is less than that, so the node is live and the loop stops at the first well without ever looking at the second. The 500 m threshold squares to 250,000, and 409,600 is greater, so under the tighter rule the node is null. The second well at 1100 m is irrelevant in both cases, since one qualifying well is all a node needs.
