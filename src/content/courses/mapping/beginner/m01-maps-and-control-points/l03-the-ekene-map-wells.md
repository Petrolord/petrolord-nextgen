# The Ekene map wells

Every worked example in this course uses one small field, so that by the time you reach the capstone the data is familiar and only the mapping decisions are new. The field is Ekene, and the surface being mapped is TOP_SAND.

## The control set

Six wells carry a TOP_SAND pick. Each one reduces to the three numbers from the previous lesson: an easting in metres, a northing in metres, and a depth in metres.

| Well | x (m) | y (m) | TOP_SAND (m) |
| --- | --- | --- | --- |
| Ekene-1 | 1000 | 1000 | 1548 |
| Ekene-2 | 2200 | 1150 | 1565 |
| Ekene-3 | 1400 | 2300 | 1541 |
| Ekene-4 | 2600 | 2500 | 1590 |
| Ekene-5 | 600 | 1900 | 1552 |
| Ekene-6 | 1900 | 1800 | 1546 |

That is six control points, and six is worth committing to memory, because it is one of the six values the Associate capstone grades. It is also a number worth being uneasy about. Six points is a thin basis for a surface covering several square kilometres, and most of what this course teaches is how to be honest about that thinness rather than how to hide it.

Every one of the six wells is treated as vertical, so the coordinates in the table are both the surface location and the location of the pick. No well in the fixture is missing the surface, so nothing has to be dropped.

## The four wells you already know

If Ekene-1 through Ekene-4 look familiar, they should. They are the same four wells you correlated in the previous course, and their TOP_SAND picks are the picks you made there. What is new is that each one now carries a map position.

That difference is the whole reason mapping is a separate discipline. A correlation section is one dimensional in map view: the wells are strung along a line, and the display shows depth against distance along that line. It has no way to represent a well that sits off to the side. A map is two dimensional, so every well can be posted in its true relative position, and the surface is free to bend in any direction rather than only along the section.

Ekene-5 and Ekene-6 are two extra wells that sit off the section line. They were of no use to the correlation panel, which is why you did not meet them, and they are essential to the map. That is the general rule: a map needs more control than a section does, and the wells have to be spread out rather than lined up. Four wells strung along a line tell you almost nothing about what the surface does perpendicular to that line.

## The story in the numbers

Before you grid anything, read the control set as a geologist would. The picks span from 1541 m at Ekene-3 to 1590 m at Ekene-4, so the surface has 49 m of relief across the six wells. That is a real structure, not noise.

The two shallowest picks are Ekene-3 at 1541 m, which sits in the north of the field, and Ekene-6 at 1546 m, which sits in the middle. So the high ground is somewhere in the central and northern part of the area, and a hydrocarbon accumulation on this surface would be looking to collect there.

The deepest pick by a clear margin is Ekene-4 at 1590 m, out in the far northeast corner. It is 25 m deeper than the next deepest well, Ekene-2 at 1565 m in the southeast, and 49 m deeper than Ekene-3. The surface therefore falls away hard toward the northeast.

The remaining two, Ekene-1 at 1548 m in the southwest and Ekene-5 at 1552 m on the western edge, sit close to the middle of the depth range and define a gentler western flank.

Put together, that is a crestal area in the centre and north, a mild western flank, and a steep drop into the northeastern corner. You should expect the finished map to show exactly that, and if it does not, you should suspect the map rather than the wells. Reading the control set before gridding is the cheapest quality control there is, because it gives you a prediction to test the map against.

## Prospect P-1

One more location matters, and it is not a well. Prospect P-1 sits at (1600, 1600), in the middle of the field, between Ekene-6 to the northeast of it and Ekene-1 to the southwest.

Nothing has been drilled at P-1. There is no pick there, no log, no rock. The capstone nonetheless asks for a mapped depth at P-1, and that is the point of including it. Predicting a depth at an undrilled location is the single most common thing a depth map is actually used for, because it is what a well proposal needs.

P-1 is a fair test of the map rather than an unfair one. Its nearest well is Ekene-6, about 361 m away, comfortably inside the well spacing of the field, so a prediction there rests on genuine nearby control. Later you will meet locations much further from any well, and learn where the map should stop making predictions at all.

Try it yourself: the panel below posts all six Ekene wells with their picks on the frame they control.

{{panel:mp-map-explorer}}

## Exercise

Without doing any gridding, sketch the six wells on a sheet of graph paper at their map coordinates and write each TOP_SAND depth beside its well. Mark P-1 at (1600, 1600). Then answer three questions in one sentence each: in which part of the field would you expect the shallowest mapped depth, in which direction does the surface fall away most steeply, and which two wells sit off the correlation section line.

As a self-check: the shallowest mapped depth should be in the central to northern part of the field, near Ekene-3 at 1541 m and Ekene-6 at 1546 m. The steepest fall is toward the northeast, into Ekene-4 at 1590 m, which is 49 m deeper than Ekene-3. The two wells off the section line are Ekene-5 and Ekene-6, since Ekene-1 through Ekene-4 are the four wells from the correlation course. If your sketch shows P-1 near the edge of the well pattern rather than inside it, check your axes: P-1 sits in the middle, about 361 m from Ekene-6.
