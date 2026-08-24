# Filling the gaps

The grid from the previous module is a lattice of empty boxes. On the Ekene fixture at a 100 m cell it is 25 columns by 20 rows, which is 500 nodes, and every one of them wants a depth. What you actually have is six numbers: Ekene-1 at (1000, 1000) picking 1548 m, Ekene-2 at (2200, 1150) picking 1565 m, Ekene-3 at (1400, 2300) picking 1541 m, Ekene-4 at (2600, 2500) picking 1590 m, Ekene-5 at (600, 1900) picking 1552 m, and Ekene-6 at (1900, 1800) picking 1546 m.

Six knowns, hundreds of unknowns. The rule that turns the first into the second is called interpolation, and this module is about what that rule can and cannot claim.

## The problem stated plainly

Interpolation is the job of producing a value at a location where nothing was measured, using the values that were measured elsewhere. It is not a physical calculation. Nothing in the six picks contains information about the rock at a node 400 m from the nearest well. What an interpolation method supplies is an assumption about how surfaces behave, applied consistently everywhere, so that the empty boxes fill in a way you can describe, defend and repeat.

That last word matters. Two mappers with the same picks and the same method get the same map. Two mappers with the same picks and different methods get different maps, and both maps honour the data. That is a property of the problem, not a flaw in any particular software.

## The family of answers

Four families cover almost everything you will meet.

Nearest neighbour assigns each node the value of the closest control point, full stop. A node 50 m from Ekene-6 gets 1546 m and so does a node 500 m from Ekene-6, as long as no other well is closer. The result is a mosaic of flat tiles with cliffs at the tile boundaries. It is blocky and nobody would contour it, but it is honest in a particular way: every number on the map is a real pick, just possibly in the wrong place.

Inverse distance weighting takes an average of the control points, weighting each one by one over its distance raised to some power, so near wells count for more than far ones. The output is continuous and smooth over most of the map, which is a real improvement. Its characteristic weakness is the bullseye. Because a well's weight runs away as you approach it, the surface tends to form a small circular dome or pit tight around each control point, and the map ends up decorated with six little rings that reflect the algorithm rather than the structure. It also cannot leave the range of the data: every value is a weighted average of the picks, so nothing can be shallower than 1541 m or deeper than 1590 m.

Triangulation connects the control points into a mesh of triangles and fits a flat plane across each one. Between three wells the surface is a straight ramp. It reproduces the data exactly, extends nowhere beyond the outer triangles without extra rules, and leaves visible creases along every triangle edge, so contours come out as straight segments with kinks. It is a good sanity check and a poor final product.

Minimum curvature and spline methods take a different view. Instead of averaging, they ask which single smooth surface passes through all the control points while bending as little as possible overall. The mental picture is a thin flexible sheet forced through a set of fixed pins and otherwise left to relax. The output looks like a geological surface, with no tiles, no creases and no bullseyes, and it is what this course and the Mapping app use. The next lesson is entirely about it.

## What they all share

Notice what is common to all four. Every one of them returns the measured value at the location where it was measured. Nearest neighbour does it trivially, inverse distance does it in the limit, triangulation does it at the triangle corners, and the spline does it by construction. A method that failed this test would be rewriting your picks, and you would notice immediately.

So the methods do not disagree about the data. They agree completely about the data. They disagree only about the space between the data, which is the great majority of the map, and that is precisely where no observation exists to referee the argument. You cannot test which method is right at a node 400 m from every well, because there is no measurement there. That is the whole reason the node needed filling in the first place.

The practical consequence is a habit rather than a formula. Choose a method for reasons you can state, know the artefacts it tends to produce so you can recognise them on your own map, and keep the distinction between a contour supported by picks and a contour produced by the algorithm alive in your head, because the printed map will not keep it for you.

## Exercise

Take the six Ekene picks and predict, in words, what the map would look like under each of the four methods. As a self-check: nearest neighbour gives six flat tiles with step boundaries, its shallowest value 1541 m and deepest 1590 m; inverse distance gives a smooth surface with a small dome around each well, also bounded by 1541 m and 1590 m; triangulation gives flat facets with creases along the triangle edges and no coverage outside the outer triangles; a spline gives one smooth surface with no tiles, creases or bullseyes. Then answer in one sentence: which of the four could be checked against a measurement at a point 400 m from the nearest well? None of them, because there is no measurement there.
