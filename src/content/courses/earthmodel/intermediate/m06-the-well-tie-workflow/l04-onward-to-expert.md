# Onward to Expert

This tier put wells into the container and measured the disagreement. You built minimum-curvature trajectories from survey stations, landed twelve picks in 3D, sampled the clamped surfaces at the landings, and read the tie table by its structure: a mild uniform TopB bias, an eastern BaseB contradiction that is really the clamp's pinch-out meeting 30 m of logged zone, and a deviated well whose vertical-assumption residuals are not just wrong but wrong-signed. You also derived the products the next tier consumes: four zone control points with MD weights, one of them standing 211 m east of its wellhead.

## What the Expert tier does with your work

The Expert tier cuts the model with a fault polygon and fills the blocks with properties, and both halves lean directly on this tier's outputs.

The fault polygon crosses the map at x equals 1575 in the region that matters, and the first thing block labelling does to the wells is decide which side each one's CONTROL POINT stands on. W2's wellhead is west of that line; the zone A control point you computed at x 1610.8719179395334 is east of it. The consequence, worked in full up there, is that one block ends up with two wellheads but only one control value, and every property statistic in it follows from that single fact. The 211 m migration this tier derived stops being a curiosity and becomes the shape of the data.

Population then runs two methods through the control points: a least-squares plane and simple kriging, per block, with the MD weights this tier attached. The per-block weighted porosity that the Expert capstone grades, 0.286 in the larger block, is a weighted mean over exactly the points and weights you built here.

Finally, volumes go per block, and the whole-model 45,000,000 m3 anchor from the Associate tier becomes the closure check: the block volumes must sum back to it, node for node.

## The ladder's shape, restated

The Associate tier built the container and read its honesty metrics: clamp counts, means over stated denominators. This tier tied the container to rock and read the disagreements. The Expert tier partitions the container and fills it, and its honesty metric is closure. Each tier's QC instrument is built from the tier below's outputs, which is why the ladder is a ladder and not three courses.

One caution to carry up: this tier ends with the eastern BaseB contradiction OPEN. The Expert tier does not resolve it either; it works on zone A precisely because zone B's geometry is contested. A property model built on a contested container inherits the contest, and knowing which zone is safe to model is itself a product of the tie table.

## Exercise

Before starting the Expert tier, answer from this tier's numbers: which fault block will each of the four zone A control points fall into, given the fault boundary at x 1575 in the south of the map (west of it is one block, east the other)? Use the control point coordinates: W1 (1100, 2100), W2 (1610.8719179395334, 2200), W3 (1900, 2700), W4 (2050, 2150). Then state which block has fewer control points than wellheads and why.
