# The workflow end to end

Five modules have each taken one part of mapping apart. This lesson puts them back together in working order, because in practice the parts are not independent. Every step constrains the ones that follow, and a decision taken carelessly early on cannot be repaired by care later.

The order is: assemble control, choose the frame and cell, interpolate, mask, present and read. Nothing in this course happens outside that sequence.

## Step 1: assemble the control

Reduce every well to three numbers: an easting, a northing, and a picked depth on the surface being mapped. That is the whole of the input. Everything else in the well file, the logs, the deviation survey, the completion history, is either already baked into the pick or irrelevant to the map.

The important part of this step is the bookkeeping about wells that do not make it in. A well drilled short of the surface, a well where the top was not picked because the section was faulted out, a well where the pick exists but the coordinate does not, all of these have to be recorded as absent rather than quietly filled in. A missing pick entered as zero is not a small error. It is a control point claiming the surface comes to sea level, and a spline will honour it.

On Ekene, all six wells carry a TOP_SAND pick and a map position, so the control set is six points and nothing has to be dropped. Six is the number the capstone grades first, and it is the number every later step is built on.

## Step 2: choose the frame and cell size

The frame is the rectangle the map covers, and the cell size is the spacing of the nodes inside it. Choose them together, because the node count falls out of the pair and the node count is what you will actually be quoting.

The course settings put the frame origin at (400, 800), which is two cells of padding outside the control, and the cell at 100 m. That gives 25 columns by 20 rows, and 25 times 20 is 500 nodes. Every node is a location where the interpolator will be asked for a depth.

Note what the cell size does and does not do. It does not add information. Six picks are six picks at any cell size. What it changes is the resolution of the sampling of whatever surface the method produces, and therefore how many numbers you end up carrying around. That is why the cell size has to be quoted whenever a node count is quoted.

## Step 3: interpolate with a method you can defend

Now the empty frame gets filled. The course uses a thin-plate spline fitted through all six control points at once: the single smooth surface that passes through every pick while bending as little as it can overall.

Defensible means two things. It means you can say why this method rather than another, and it means you know the artefacts it produces so you can recognise them on your own map. A spline gives no tiles, no creases and no bullseyes, and in exchange it is free to run outside the range of the data, which is a behaviour you will have to account for in step 5.

At this stage the surface exists everywhere in the frame. All 500 nodes have a number. That is the point at which an unwary mapper prints the map.

## Step 4: mask beyond the control

The masking step deletes the values the map is not entitled to claim. The rule used here is a distance limit: a node further than 800 m from every control point is set to null and stays blank.

On Ekene that removes 299 of the 500 nodes and leaves 201 live. Just over 40 percent of the frame survives. The blank corners are not a failure of the software or a gap to be filled by hand. They are the honest statement that six wells about a kilometre apart do not constrain a surface out at the frame edges, and the map is the right place to say so.

## Step 5: present and read

A gridded, masked surface is still just numbers. Presentation is what makes it readable, and reading it is what makes it useful.

Contour it at an interval chosen for the relief. Ekene at a 100 m cell contours at 10 m, which puts a handful of well spaced lines across roughly 50 m of structure. Post the control points on top, so a reader can tell at a glance which contours sit near a pick and which are the algorithm talking. Then sample the specific locations that matter.

Reading the finished Ekene map gives the shape the control set predicted back in module 1. The mapped crest, the shallowest depth anywhere on the live surface, is 1539.72 m in the central to northern part of the field. The prospect at P-1, where nothing has been drilled, reads 1542.62 m. The surface falls away hard to the northeast toward Ekene-4.

That is the whole workflow. Six points in, a frame, a method, a limit, and a map you can quote numbers from.

## Exercise

Write the five steps from memory in order, and beside each write the single Ekene number it produces. As a self-check: assemble control gives 6 points; frame and cell give 25 by 20, which is 500 nodes at a 100 m cell; interpolation fills all 500; masking at 800 m leaves 201 live and blanks 299; presentation and reading give a 10 m contour interval, a crest of 1539.72 m and a depth at P-1 of 1542.62 m. Then answer in one sentence: which step is the only one that removes information rather than adding it, and why is that a feature? Masking, because everything it deletes was invented by the interpolator rather than measured.
