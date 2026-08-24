# Resampling

Resampling is the operation that takes a surface off the grid it arrived on and writes it onto the model frame. It sounds like a file format conversion. It is not, because it involves an estimate at every node, and estimates have costs.

## What happens at one node

Take one node of the model frame, say the node in column 5 and row 7. Its world position follows from the frame: 1000 plus 5 times 50 in x, and 2000 plus 7 times 50 in y. That is a location on the ground, and it exists whether or not any source grid has a node there.

Now go to the source surface, TopB for example, which sits on 27 by 27 nodes at 60 by 45 m from (950, 1950). The frame node's position falls somewhere inside one of TopB's cells, bounded by four TopB nodes at its corners. The resampler reads those four depths and interpolates between them according to how far into the cell the position sits, then writes the result into the model frame node.

Repeat for every node of the frame. On this model that is 500 estimates per surface, and three surfaces, so 1500 of them. The output is three surfaces on one geometry, which is exactly what could not be done before.

Two properties of that operation are worth stating plainly. It is local, meaning each output node depends only on the handful of source nodes around it, so a change in one corner of the field cannot move a value in the other corner. And it is exact at coincidence, meaning that when a frame node lands precisely on a source node, the source value is returned unchanged.

## What comes out on this model

After resampling, all 500 nodes are live on all three surfaces. Every node of the model frame carries a depth on TopA, on TopB and on BaseB, and none was left blank.

That is a consequence of the geometry from the first lesson. All three source grids cover the ground the model frame occupies, with room to spare on every side, so every frame node falls inside a source cell and has four corners to interpolate between. Nothing had to be invented beyond the edge of the data.

Do not take that for granted on a real project. When a model frame sticks out past the edge of a source grid, the nodes outside have no four corners to read, and there are only two honest outcomes: leave those nodes blank, or extrapolate and be explicit that you have done so. The dangerous third option is to extrapolate quietly, which produces a full, confident looking surface with invented ground around its rim. Check the live node count of every surface after resampling and compare it with the node count of the frame. On this model both numbers are 500, and the check passes.

## What resampling costs

Resampling produces a new value at every node, and none of those values is data. Three costs follow.

**It cannot add detail.** The output can only contain the information the source held. Take BaseB, which arrives on 55 m cells. Rewrite it onto a 25 m frame and every node gets a number, the map draws smoothly, and the contours look crisp. Not one of those extra nodes is new knowledge. The 55 m grid never resolved a feature 30 m across, so the fine resampled version cannot either. It is a smooth interpolation of a coarse surface wearing the appearance of a detailed one, and that appearance is the most misleading thing in this module. Resolution and node spacing are two different things, and after a resample the node spacing tells you nothing about the resolution.

**It can lose detail.** The reverse case is real too. TopA arrives on 40 m cells and goes onto a 50 m frame, so it is being written onto a coarser geometry than it came from. Whatever it carried at the scale of one or two of its own cells cannot survive at 50 m spacing. Narrow features are smoothed, and a small sharp crest can be flattened by a few metres because the frame node landed on its flank rather than on its top.

**It smooths.** Interpolation between four corners is an averaging operation, so extremes soften slightly. Depth is positive down here, so the largest depth value on a resampled surface is generally no larger than the largest value on the source, and the smallest no smaller. A crest is the shallowest point of a surface, so a resampled crest usually comes out slightly deeper than the source crest, and that is the frame at work rather than the geology.

None of these three is a reason to avoid resampling, because there is no alternative if the surfaces are to be subtracted. They are reasons to know what you are looking at afterwards.

## Reading the result

Here is what the resampling and the clamp together deliver on this model. The clamp is module 3's subject, and it adjusted nothing at all on TopA and TopB, so their statistics below are the resampled values.

| surface | mean depth (m) | min (m) | max (m) | live nodes |
| --- | --- | --- | --- | --- |
| TopA | 1539.5 | 1500 | 1579 | 500 |
| TopB | 1575.5 | 1530 | 1620.9999999999998 | 500 |

Read the mean carefully, and say it out loud in the form this course insists on. The mean TopB depth is 1575.5 m averaged over all 500 nodes of the model frame. Not over TopB's own 27 by 27 source grid, which covers different ground. Not over the wells. Over the 500 nodes of this frame, which is a denominator chosen by whoever chose the frame.

That number is one of the six the capstone asks for, and the reason it is graded is that it can only be produced by getting the resample onto the right frame and then averaging over the right set of nodes.

## Exercise

Explain in your own words why a surface resampled from 55 m cells onto a 25 m frame contains no more information than it did before, and name one thing about the resampled map that will nonetheless look better. Then state the check you should run on every surface immediately after resampling, and what its result is on this model.

Self check: the values at the new nodes are interpolated from the same coarse source values, so they add no measurement and cannot show any feature the 55 m grid did not resolve. What looks better is the smoothness of the map and its contours, which is an appearance produced by the interpolation rather than by the data. The check to run is the live node count of each surface against the node count of the frame, and on this model every surface returns 500 live nodes out of 500, so no node fell outside a source grid.
