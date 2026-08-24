# Maps that mislead

You can now read a contour map: spacing for dip, closure for structure, the mask for support, and a sampled value for a location. This last lesson of the module turns the skill around. Instead of reading a map you trust, you are going to read a map that is trying to convince you of something, and you are going to catch it.

None of the examples below involve a mistake, bad data or dishonest intent. Every map in this lesson comes out of the same engine, from the same six picks, with every setting legal. They mislead anyway, which is why the defence has to be a habit rather than a suspicion.

## A coarse grid can lose real data

Grid the Ekene picks at a 200 m cell instead of 100 m. The frame holds 195 nodes, 50 of them live, and the deepest mapped value comes back as 1578.04 m.

Look at the control set. Ekene-4 picks TOP_SAND at 1590 m. The deepest well in the dataset is nearly 12 m deeper than the deepest point of the map that was built from it.

The reason is arithmetic rather than geology. At a 200 m cell the frame starts at (200, 600), so Ekene-4 at (2600, 2500) lands 12 cells across and 9.5 cells up. Nodes exist at whole cell counts, so there is no node at Ekene-4, and the surface is never evaluated at the one location where the deepest measurement was made. At that cell size only Ekene-1 falls exactly on a node. The other five wells all sit between nodes, and the map reports the smoothed surface near them rather than their picks.

At the 100 m capstone cell the same map reports a deepest value of exactly 1590 m, because five of the six wells land on nodes there and Ekene-4 is one of them.

So the mapped extremes are not the data extremes, and the gap between them grows with cell size. A map that never touches its own deepest well will understate depth across the deepest part of the field, and if a gross rock volume is computed above a contact from that surface, the missing 12 m becomes rock that was never there.

The check takes ten seconds. Compare the mapped minimum and maximum against the shallowest and deepest picks. They will rarely agree exactly. When they disagree by metres, find out whether the grid is sampling the wells at all.

## The worse map was drawn with more contours

Now the detail that catches almost everyone. Put the two maps side by side.

| Cell | Live nodes | Mapped range | Contour interval | Contour levels |
| --- | --- | --- | --- | --- |
| 100 m | 201 | 1539.72 to 1590.00 | 10 m | 6 |
| 200 m | 50 | 1539.72 to 1578.04 | 5 m | 8 |

The 200 m map rests on a quarter of the nodes and has lost the deepest well entirely. It is drawn with a finer contour interval and carries more contour lines than the map that is better in every respect.

There is nothing sinister in the mechanism. The interval is chosen automatically from the mapped range, aiming for roughly ten intervals across the surface. The coarse map lost the deep end of the range, so its range shrank from about 50 m to about 38 m, and the routine picked a smaller step to cover it. Fewer data, shorter range, finer interval, more lines.

The consequence is that contour density is not evidence of anything. A dense pattern of lines can mean a steep flank, and it can equally mean that a poorly supported map got a small contour interval. Read the interval off the legend before you read the pattern, and never compare two maps by how busy they look.

## Node counts are not knowledge

The same six picks give 794 live nodes at a 50 m cell, 201 at 100 m and 50 at 200 m. Nothing about the field changed between those three numbers.

A node count is a statement about sampling. It goes up when you choose a finer lattice and it goes down when you choose a coarser one, and neither direction adds or removes a single measurement. A report that leads with a live node count is telling you about a setting, and a reader who takes it as a measure of effort or coverage has been misled by a number that was true.

The quantity that survives a change of settings is area, which module four covered: multiply the live count by the cell area and all three maps come back at about 2 square kilometres of mapped ground, supported by six wells.

## Smoothness is not accuracy

The last habit is the hardest, because it works against how a finished map looks.

An interpolated surface is smooth because the method minimises bending, and it will be just as smooth over ground with no control as over ground with a well every 200 m. Smoothness is a property of the algorithm. It carries no information at all about how well the surface is known.

The Ekene map at a 100 m cell makes this concrete. Of its 201 live nodes, only 14 lie within 100 m of a well. Every one of the remaining 187 was produced by the interpolator, some of them more than 600 m from the nearest measurement, and all 201 look identical on the printed sheet. The line through hard data and the line through pure inference are the same weight of ink, which is the sentence this course opened with.

## Reading someone else's map

Five questions, in order, before you read a single contour.

What is the cell size, and does the grid sample the wells or step over them? What is the extrapolation limit, and is the mask still shown, or has the map been cropped to hide where support ends? What is the contour interval, and does the mapped range explain it? Are the control points posted with their values, so the surface can be checked against them? Do the mapped extremes agree with the shallowest and deepest picks?

A map that answers all five is a document you can work with. A map that answers none of them is a picture.

Try it yourself: grid at 200 m in the panel below, then compare the deepest mapped value against the pick posted at Ekene-4.

{{panel:mp-map-explorer}}

## Exercise

You are handed a depth map of a different field. It has no posted wells, no stated cell size, a contour interval of 2 m, contours covering the entire rectangular frame with no blank ground, and a note that the surface has 4,100 live nodes. List which of the five reading questions you cannot answer, and say what you would ask for first.

Self check: you cannot answer any of the five. The cell size is unstated, so the node count of 4,100 fixes neither area nor resolution; with no posted wells you cannot check the surface against control or compare the mapped extremes against the picks; and contours covering the whole frame with no blank ground mean either that the extrapolation limit was very loose or that the map was cropped to the mapped area, and nothing distinguishes those two from the sheet alone. Ask first for the control points with their values, because without them nothing else on the map can be checked at all.
