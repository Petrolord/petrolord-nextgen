# Where a thickness map lies

This module has treated the isochore as a useful instrument. This lesson is the counterweight: the five specific ways it misleads, each with the check that catches it.

{{panel:mp-isochore-explorer}}

## One: it looks like a measurement

An isochore has its own contours, its own extremes and its own statistics, and printed on its own it reads exactly like a mapped observation.

It is a **derived** quantity. Six wells constrain it, the same six that constrain the two depth surfaces. Two maps of six points do not make a map of twelve, and the thickness map has no independent evidence in it whatsoever.

**The check:** state the control count on the map. Six.

## Two: the contour interval flatters it

The Ekene isochore is contoured at 2 m against the depth map's 10 m, and a five times finer interval reads as five times more resolved.

It is not. The interval is finer because the range is smaller, and the rule that chose it knows nothing about precision.

**The check:** quote the interval with the range and the cell size, and fix the interval by hand whenever two maps are to be compared.

## Three: the extremes are not where you think

The mapped minimum of 25 m is a well value. The mapped maximum of 35.898 m at a 100 m cell is 50 m away from the well it comes from and 0.1 m below it, and refining the cell to 50 m moves it to exactly 36 m at the well.

Meanwhile the Associate tier's depth crest is a genuine spline overshoot that refinement does **not** remove.

**The check:** refine the cell size and re-read every extreme. If it settles toward the control, it was node placement. If it stays past the control, the fit is inventing it.

## Four: the mean is not the well average

The map mean of 32.254 m and the well mean of 31.167 m differ by 1.088 m, and about two thirds of that is because Ekene-6 controls a third of the map while counting a sixth in the well average.

Used in a volume, the wrong one costs 3.4 percent, which is small enough to survive review and systematic enough to bias every field mapped the same way.

**The check:** quote both, labelled, and use the map mean only where an area multiplies it.

## Five: the blanks are silent

The mask leaves 299 of the 500 nodes blank at the capstone settings, and a blank node contributes nothing to any statistic and nothing to any volume.

A volume from 201 nodes and a volume from 260 nodes under a wider mask are not comparable, and neither figure carries its own coverage. Worse, a blank reads as absence rather than as ignorance: a reader looking at the uncoloured margin sees no sand, when what is there is no information.

**The check:** quote the live node count and the mapped area with every statistic, and say explicitly that the area outside is unquantified rather than empty.

## The failure that is hardest to see

Combine three and five and there is a case that passes every visual inspection.

A base pick missing from one edge well shrinks the isochore's mask without touching the depth map. The depth map still covers 201 nodes; the thickness map covers 133. Both contour cleanly, both have plausible statistics, and a volume computed from the isochore now covers two thirds of the structure while being reported against the depth map's outline.

Nothing about either picture announces it. Only the node counts do, which is why they belong on the map.

## Worked example

A thickness map is presented with a 1 m contour interval, a mean of 30.4 m, and a note that it covers 4.2 km². What three questions should be asked before it is used?

How many wells control it, because the contour interval says nothing about that. What cell size and mask produced the 4.2 km², because the area is a setting as much as a fact. And whether the mean is the map mean or the well mean, because if it is the well mean it does not belong in a volume and if it is the map mean it needs its node count.

None of those questions challenge the map. All three are needed before the number can be used.

## Exercise

List the five ways a thickness map misleads and give the check for each in a few words. Then state which two of them the Ekene isochore actually exhibits at the capstone settings.

As a self-check: it looks like a measurement, checked by stating the control count; the contour interval flatters it, checked by quoting the interval with the range and cell size; the extremes are misplaced, checked by refining the cell and re-reading; the mean is not the well average, checked by quoting both labelled; and the blanks are silent, checked by quoting live nodes and mapped area. At the capstone settings Ekene exhibits the misplaced maximum, which sits 50 m from Ekene-2 and moves to exactly 36 m at a 50 m cell, and the mean gap of 1.088 m between the map and the wells.
