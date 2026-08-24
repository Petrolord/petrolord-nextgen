# The crest problem

The mask keeps the map from claiming ground it cannot support, and the live count tells you how much ground that is. Both of those are about the edges. This lesson is about the middle, where the map is fully supported and still capable of telling you something that is not true.

The number in question is the crest: the shallowest value on the mapped surface. It is the first number anyone reads off a depth map, because shallow is where hydrocarbons collect, and it is the number most likely to be quoted as though a measurement produced it.

## The crest of the Ekene map is not at a well

Grid the six picks at the capstone's 100 m cell and the shallowest mapped value is 1539.72 m. Put that next to the control set. The shallowest pick in the whole dataset is Ekene-3 at 1541 m. The map's crest is 1.28 m shallower than the shallowest measurement that exists.

It is also somewhere else. The crest node sits at (1400, 2000), which is 300 m due south of Ekene-3. No well was drilled there, no pick was made there, and nothing about that location was measured. The map has produced a structural high that is both shallower than any well and displaced from every well.

Neither of those is a bug in the engine, and neither is a discovery. Both are the interpolator doing exactly what it was designed to do.

## Why a smooth surface bows above its own control

Module three introduced the thin-plate spline as the surface that passes through every control point while bending as little as possible overall. Read that definition again and notice what it does not say. It does not say the surface stays between the control values.

Bending is the thing being minimised, so the surface resists sharp changes in slope. Coming north across the field from Ekene-1 at 1548 m the surface is rising steadily towards Ekene-3 at 1541 m. A surface that arrived at Ekene-3 and stopped rising in the same instant would need a sharp kink at the well, and a kink is exactly what a minimum curvature solution refuses to pay for. So the rise carries a little past the last control before it turns over, and the turnover happens about 300 m short of the well, a metre and a bit above its pick.

This is called overshoot, and every smooth interpolator does it. It is the price of smoothness, and on this dataset it is small: 1.28 m on a surface with 49 m of relief, well under 3 percent. The size is not the point. The point is that the extreme value of the map is a place where the algorithm was extrapolating a trend rather than honouring a measurement, and extremes are what maps get read for.

## It is an interpolation artefact, not an extrapolation one

The natural reaction is to suspect the extrapolation limit, so test it. Regrid the same picks at 400 m, at 800 m, at 1200 m and at 2000 m. The live count moves from 121 to 201 and then stops, because the convex hull test takes over from the distance test once the limit is loose enough. Through all four the crest stays at 1539.72 m at the same node.

That result matters. The crest node is 300 m from a well, deep inside the mapped area and nowhere near the mask edge. Everything module four has given you so far protects the edges of the map, and none of it touches this. Tightening the extrapolation limit will not remove the overshoot, and loosening it will not make it worse.

Nor is it a sampling accident. Regrid at 50 m and the crest is 1539.69 m at (1450, 2000). A different lattice, the same bulge in the same place, read very slightly better because the finer grid samples nearer the true turnover. The overshoot belongs to the surface, not to the grid.

## The closed contour that follows

Now watch the artefact acquire a shape. The 1540 m contour on the Ekene map closes on itself. It is a loop of eleven points running from x 1346 to 1522 and y 1874 to 2154, enclosing about 36,000 square metres, roughly 0.036 square kilometres.

On a depth map a closed contour around shallower ground is the signature of a structural high, which is the geometry that traps hydrocarbons. A reader who has been taught to look for closure will find one here in the first two seconds of looking at the map.

Check its position against the wells and the problem is plain. The loop reaches only to y 2154, and Ekene-3 sits at y 2300. The closed high excludes the shallowest well in the dataset. Every square metre inside that contour is ground where no measurement was made, and the contour exists at all because the surface bowed 1.28 m above the pick that is standing just outside it.

Small closures near the limit of the contour interval deserve this check every time. A 0.036 square kilometre closure that contains no well and sits one contour above the nearest pick is not a prospect. It is the interpolator's rounding, drawn as a shape.

## Reporting the crest honestly

Four habits cover it.

Say what the number is. It is the shallowest mapped node, not the crest of the structure. The two are the same thing only if a well happens to sit at the shallowest node.

Quote it against the control. "Shallowest mapped node 1539.72 m at (1400, 2000), 1.28 m above the shallowest pick of 1541 m at Ekene-3, 300 m away." That sentence is the same length as a bare number and cannot be misread.

Check whether any closure depends on the overshoot. If the shallowest contour closes on ground with no well in it, say so before anyone maps a prospect onto it.

Never let the crest value travel alone into a volume calculation. Gross rock volume is measured up from a contact to the surface, so a surface that sits above its control across the crestal area adds volume that no well supports.

Try it yourself: read the shallowest mapped value in the panel below against the posted picks, and look at where the shallowest contour closes.

{{panel:mp-map-explorer}}

## Exercise

Using the Ekene map at a 100 m cell, write the one sentence you would put in a report to describe the crest, then answer two questions. First, if you tightened the extrapolation limit from 800 m to 400 m, would the reported crest change? Second, if the loop of the 1540 m contour had turned out to enclose Ekene-3, would that change how much confidence you place in the closure?

Self check: your sentence should carry the mapped value 1539.72 m, its location at (1400, 2000), the shallowest pick of 1541 m at Ekene-3, and the 1.28 m overshoot between them. Tightening the limit to 400 m drops the live count from 201 to 121 but leaves the crest at 1539.72 m, because the crest node is only 300 m from a well and stays live under either limit. A closure that enclosed Ekene-3 would be a different proposition, because then the shallow ground would contain a measurement rather than resting entirely on interpolated values; it would still be worth checking the contour interval against the size of the overshoot before calling it a structure.
