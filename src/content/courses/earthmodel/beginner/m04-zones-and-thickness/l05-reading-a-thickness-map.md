# Reading a thickness map

You now have two thickness grids on the same 25 by 20 model frame, 500 nodes each, and a set of statistics for both. Statistics are a summary. The map is the thing itself, and there are questions a map answers that a table cannot.

This lesson is about reading one.

## What the map is

A thickness map, also called an isochore map, plots metres of rock at each node rather than metres of depth. The frame is the same, the geography is the same, and the colour scale means something different. On a depth map, low values are shallow ground. On a thickness map, low values are thin rock and zero is no rock.

Because the two zone grids sit on the same frame, they can be read side by side node for node. A place on the zone A map and the same place on the zone B map are the same piece of ground.

## Zone A: a blanket

Read the zone A map first, because it is the simple one. Thickness runs from 30 m to 42 m and every one of the 500 nodes carries a positive value. There is no zero anywhere on it.

The eye should be looking for three things. Where is the thick part, which is the region approaching 42 m. Where is the thin part, which is the region approaching 30 m. And which way does the thickness change between them, because that direction usually has a depositional meaning, whether it is a channel axis, a direction of sediment supply or a slow structural thickening across the map.

What the zone A map does not have is an edge. The zone continues past the frame in every direction as far as this model knows, and where the map stops is where the frame stopped rather than where the rock stopped. That is worth saying explicitly whenever you hand one over, because a reader sees a rectangle and it is easy to read a rectangle as a boundary.

## Zone B: a zone with an edge

The zone B map is a different animal. Values run from a maximum of 31 m down to zero, 320 nodes are positive and 180 are zero.

Read it in three regions. There is ground where the zone is well developed, up towards 31 m. There is ground where the values fall away towards zero, which is the zone thinning. And there is ground where the value is zero over a continuous area, which is where the zone has gone.

The line between the second and third regions is the one to draw carefully. It is the zero contour of the thickness grid, and it is the pinch-out edge of zone B. It marks where the zone terminates, and it belongs on any map of this model that anyone is going to make a decision from. A well planned outside that line does not encounter a thin zone B. It encounters no zone B at all.

## A zero is a geological statement

The whole map hangs on that word zero.

A zero at a node says the model computed a thickness there and found none. TopB and BaseB occupy the same depth at that node, there is no rock between them, and the zone is absent. It is a result, produced from data, at a node where everything the calculation needed was present.

Compare that with what the mapping course called a dead node. There, the grid held a null, the industry sentinel value, at nodes the extrapolation limit had masked. A null says nothing was computed here, because the control points did not reach this ground. It is a statement about the map's support rather than about the subsurface. The rock beyond that limit may be thick, thin or absent, and the map declines to guess.

Two words that look similar on a colour scale, two entirely different claims:

| value | claim | about |
|---|---|---|
| zero thickness | there is no rock here | the subsurface |
| null | nothing was computed here | the coverage of the data |

On this model every node of every grid is live. All 500 nodes carry values on all three surfaces, so both thickness grids are complete and neither contains a single null. Every zero you see on the zone B map is a geological zero.

## Why the distinction changes what you do

Three consequences, and each of them can turn a good model into a bad report.

For statistics, a null must be excluded from a mean, because it is not a measurement, while a zero must be included or its exclusion declared. That is exactly the choice the last lesson was about, and it is why 10.24 m and 16 m are both correct. There is no equivalent choice with nulls, because averaging in a sentinel value is never defensible.

For volume, a zero node contributes no volume and does count as ground you looked at and found empty. A null node contributes no volume either, but it also shrinks the area your volume was integrated over, which means a bulk volume from a grid with nulls in it applies to a smaller map area than the frame suggests. Quote the area with the volume.

For presentation, never patch a zero. It is tempting to fill the pinch-out region with a small positive thickness so that the map looks smooth, or to interpolate across it so the contours flow. Doing that puts rock into the model where the geology says none exists, and it erases the pinch-out line, which is usually the most valuable feature on the map. Colour the zero region distinctly and label it as absent.

The panel below shows both thickness grids on the model frame so you can compare the two maps directly.

{{panel:em-framework-explorer}}

## Exercise

Describe each of the two thickness maps in two sentences, giving the range of values and the number of nodes where the zone is present. Then answer: on the zone B map, what would a reader be entitled to conclude if the 180 zero nodes had instead been nulls?

Self check: zone A runs from 30 m to 42 m with a mean of 36 m over all 500 nodes, is present at all 500 nodes and has no edge inside the frame. Zone B runs from 0 m to 31 m with a mean of 10.24 m over all 500 nodes, is present at 320 of them, and its zero contour is the pinch-out edge. If those 180 nodes were nulls, a reader could conclude nothing at all about zone B there, because a null says the map has no coverage rather than saying the zone is absent, and the volume would then apply only to the 320 nodes of frame area that were mapped.
