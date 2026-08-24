# Nodes are not wells

Everything in this module so far has been geometry. This lesson is the one that matters for how you talk about a map, and it rests on a single distinction that is easy to state and easy to forget.

A well pick is a measurement. A node value is a computed estimate. They are printed the same way, to the same number of decimals, on the same map, and they are not the same kind of thing.

## The count

The Ekene capstone grid holds 500 nodes. The field has six wells. So at least 494 of the values on that map were produced by an algorithm rather than observed by any tool in any hole.

Even that count is generous to the map. Only 201 of the 500 nodes are live at all, so the printed surface carries 201 numbers, of which at most six could coincide with a measurement. And a node only lines up with a well when the well happens to sit exactly on the lattice. At the capstone frame, origin (400, 800) with 100 m cells, five of the six wells do land on nodes. Ekene-2 does not: its y coordinate of 1150 is 350 m above the origin, which is three and a half cells, so the nearest nodes sit 50 m to either side of it.

That is the first consequence. A node near a well is still not the well. It is a value the algorithm wrote at a lattice position, and the fact that a measurement happens to be 50 m away does not convert it into one.

The second consequence is subtler and applies even to the five wells that do sit on nodes. The value at such a node is what the interpolation produced there. This course uses an interpolator that honours its control, so those values match their picks closely, but the number on the map is still an output of the surface, not a copy of the pick. If you change the interpolation settings, the node can move. The pick cannot. It is a measurement, and measurements do not depend on your gridding preferences.

## What that means for reporting

Three habits follow, and they are the difference between a map that informs a decision and a map that misleads one.

Never quote a node value with the authority of a pick. "TOP_SAND is at 1548 m in Ekene-1" is a statement about rock, and it is defensible in a well report. "TOP_SAND is at 1542.62 m at P-1" is a statement about a model. Both are useful, and they carry very different weight when someone is deciding whether to spend money. Say which kind you are making.

Always state the control count alongside a map statistic. A crest of 1539.72 m, a mean of 1550.27 m, a live node count of 201: none of these numbers means anything without the fact that six wells produced them. Six is the number that sets how much the map is entitled to claim. Quoting a mean to two decimals while omitting the control count gives an impression of precision that the data does not support.

Remember that a map redrawn with different settings changes its numbers while the wells do not. The previous lesson demonstrated exactly this. The crest moved a few centimetres and the live node count went from 794 to 50 across three cell sizes, and through all of it the six picks sat exactly where they always were. If a number on your map moves when you change a setting, that number is a property of the model. Treat it accordingly.

## Preview: P-1

The capstone ends with a question in this shape. A prospect location called P-1 sits at map coordinates (1600, 1600), and you are asked for the mapped depth of TOP_SAND there. The answer is 1542.62 m.

Look at what that number is. There is no well at (1600, 1600). Nothing has been drilled there, nothing has been logged there, and the 1542.62 was computed by sampling the gridded surface at that position, between the four nodes that surround it.

How far is the nearest real information? The closest control point is Ekene-6, at (1900, 1800). The offset is 300 m in x and 200 m in y, so the distance is the square root of 300 squared plus 200 squared, which is the square root of 130000, about 361 m. Every other well is further: Ekene-3 is about 728 m away, Ekene-2 about 750 m, Ekene-1 about 849 m.

So the honest reading of the capstone answer is this. At a location 361 m from the nearest measurement, the model estimates TOP_SAND at 1542.62 m, based on six control points and a thin-plate interpolation. That sentence is longer than "P-1 is at 1542.62 m", and it is the one you should be able to write. Module 4 will sharpen it further by asking whether the map should have offered a value at that location at all.

## Exercise

State in one sentence why the depth at P-1 is a different kind of number from the depth at Ekene-1, then compute the distance from P-1 to Ekene-3 at (1400, 2300).

As a self-check: Ekene-1 at 1548 m is a measurement made in a borehole, while P-1 at 1542.62 m is a value computed by the gridding algorithm at a location no well has reached. For the distance, the offsets are 200 m in x and 700 m in y, so the distance is the square root of 40000 plus 490000, which is the square root of 530000, about 728 m. That is roughly twice as far as Ekene-6, which is why Ekene-6 dominates the estimate at P-1.
