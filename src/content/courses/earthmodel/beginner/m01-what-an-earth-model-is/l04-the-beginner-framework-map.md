# The beginner framework map

This tier has four working modules after this one, and together they build one thing: the structural framework and the bulk rock volume that comes out of it. Each module produces something the next module consumes. This lesson lays the whole path out so that no module arrives without a place to sit.

The order is fixed. Resample onto one frame, clamp depth down, difference into zone thicknesses, then integrate to bulk volume. Depths and thicknesses are in metres throughout, areas in square metres, volumes in m3.

## Step 1: resample onto one frame

Module 2 solves the problem the last lesson set up. Three surfaces arrive on three different grids, so before anything can be subtracted they have to be rewritten onto one common frame.

The frame is 25 by 20 nodes at 50 m cells with its origin at (1000, 2000), which is 500 nodes at 2500 square metres each. Resampling visits each of those 500 nodes, works out where it sits in the world, and reads a value out of the source grid at that position. The output is three surfaces that share one geometry, so that node number 137 means the same place on the ground on all three.

After resampling, all 500 nodes are live on all three surfaces, which means every node carries a depth and none was left blank.

## Step 2: clamp depth down

Module 3 makes the three surfaces agree with each other. Sharing a frame does not make a stack of surfaces geologically valid. Two surfaces gridded independently can cross, so that the deeper one comes out shallower than the one above it at some nodes.

The clamp enforces the rule that a deeper surface is never shallower than the surface above it, working from the top down. On this model it reports how many nodes it had to fix on each surface, and the counts are 0 on TopA, 0 on TopB, and 180 on BaseB.

That last number is not a nuisance to be silenced. 180 of 500 nodes is 36 percent of the model, and it is the pinch out of zone B expressed as a count. Module 3 is about reading it that way.

After the clamp the three surfaces stand as follows on the model frame, each mean averaged over all 500 nodes.

| surface | mean (m) | min (m) | max (m) | live nodes |
| --- | --- | --- | --- | --- |
| TopA | 1539.5 | 1500 | 1579 | 500 |
| TopB | 1575.5 | 1530 | 1620.9999999999998 | 500 |
| BaseB | 1585.74 | 1561 | 1620.9999999999998 | 500 |

TopB and BaseB share the same maximum, which is the clamp at work. Where zone B has pinched out, the clamp has brought BaseB down onto TopB, because the clamp sets an offending node to the deeper of the two values. The long tail of digits on that shared maximum is floating point arithmetic showing through, not geology.

## Step 3: difference into zone thicknesses

Module 4 subtracts. Zone A thickness is TopB minus TopA at every node, and zone B thickness is BaseB minus TopB.

| zone | mean over all 500 nodes (m) | max (m) | min (m) | nodes with positive thickness |
| --- | --- | --- | --- | --- |
| A | 36 | 42 | 30 | 500 |
| B | 10.24 | 31 | 0 | 320 |

Two checks fall out of the surface table above. The difference of the surface means equals the mean thickness exactly: 1575.5 minus 1539.5 is 36 for zone A, and 1585.74 minus 1575.5 is 10.24 for zone B. That is a free quality control step and you should take it every time.

Zone B is where this tier earns its keep. It has positive thickness at 320 nodes and zero thickness at the other 180, and its mean is therefore either 10.24 m averaged over all 500 nodes of the frame, or 16 m averaged over only the 320 nodes where the zone exists. Both describe the same rock. Only the denominator changed, and it moved the headline number by 56 percent. Module 4 ends on that point and the capstone tests it.

## Step 4: integrate to bulk volume

Module 5 turns thickness into volume. Bulk rock volume is the mean thickness times the number of nodes times the cell area, and on this fixture it comes out exact.

Zone A gives 36 times 500 times 2500, which is 45,000,000 m3, or 45 x 10^6 m3. Zone B gives 10.24 times 500 times 2500, which is 12,800,000 m3. Computing zone B the other way, over only the 320 nodes where it is present, gives 16 times 320 times 2500, which is the same 12,800,000 m3. The denominator changes the mean and leaves the volume alone, which is the cleanest way to see what a mean without its denominator is worth.

That volume is where this course stops and hands over.

## The six graded numbers

The capstone asks for six values, and each comes from a step above.

| Number | Value |
| --- | --- |
| mean TopB depth on the model frame | 1575.5 m |
| BaseB nodes fixed by the clamp | 180 |
| zone A mean thickness | 36 m |
| zone A maximum thickness | 42 m |
| zone B mean thickness | 10.24 m |
| zone A bulk rock volume | 45 x 10^6 m3 |

You are not expected to memorise them. You are expected to say, for each one, which step produced it, what it depends on, and roughly which way it would move if one of its inputs moved.

The panel below runs the whole path at once, showing the three clamped surfaces, the two thickness grids and the framework statistics on the model frame.

{{panel:em-framework-explorer}}

## Exercise

Write the four steps in order and note beside each what it takes in and what it hands on. Then answer two questions in one sentence each. Which step would change the number 180? Which of the six graded numbers is unaffected by the choice of denominator for zone B?

Self check: the steps are resample onto one frame, clamp depth down, difference into zone thicknesses, and integrate to bulk volume, each taking the previous step's output as its input. The count of 180 is produced by the clamp, so it would change if the resampled surfaces changed, which means a different frame, a different resampling or a different source grid, and not by anything done after the clamp. Zone A bulk rock volume of 45 x 10^6 m3 is unaffected, since zone A is present at all 500 nodes and has only one possible denominator, and in any case the zone B volume of 12,800,000 m3 is the same whichever denominator is used for its mean.
