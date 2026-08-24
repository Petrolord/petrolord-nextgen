# The model frame

The three source surfaces cannot agree with each other, so somebody has to decide what they will all be rewritten onto. That decision is the model frame, and this lesson is about making it deliberately.

## A decision, not an inheritance

The most common way a model frame gets chosen is by accident. Somebody loads the first surface, the software adopts its grid as the project grid, and every later surface is quietly resampled to match. The frame of the model then turns out to be the frame of whichever surface happened to be loaded first, which was chosen by a contractor years ago for reasons nobody in the room can reconstruct.

That is a bad way to end up with a frame, because the frame is not a neutral container. It sets the resolution of every map you will make, the area the model covers, the number of nodes every mean will be averaged over, and the cell area every volume will be built from. It deserves a decision.

The golden model's frame is a decision. It is 25 by 20 nodes at 50 m cells with its origin at (1000, 2000). That is 500 nodes, and a cell area of 50 times 50, which is 2500 square metres.

Look at what that frame is not. It is not any of the three source grids. It is not the finest of them and it is not the coarsest. Its origin at (1000, 2000) is a round number chosen by a person, not the corner of somebody's survey. The frame was picked to cover the area of interest at a resolution the model needs, and then all three surfaces were brought to it.

## What choosing a frame commits you to

Four commitments follow from those numbers, and all four are irreversible once the model is built on them.

The first is resolution. A 50 m cell can carry structural detail down to roughly the scale of a few cells and nothing finer. Any feature narrower than that is either smoothed away or represented by one or two nodes, which is not a representation you should trust. If the model has to resolve a narrow channel or a tight fault sliver, 50 m may be too coarse, and no amount of careful work later recovers what the frame threw away.

The second is extent. The frame covers a fixed rectangle of ground. Rock outside it is not in the model, so it is not in any volume the model produces. A volume from this model is a volume within this rectangle, and nowhere else.

The third is cost. The node count scales with the inverse square of the cell size, so halving the cell size roughly quadruples the work in every operation on the model. That matters more in the tiers above this one, where properties are populated node by node.

The fourth is the denominator. Every mean this course quotes is averaged over the 500 nodes of this frame. Change the frame and every mean changes, even though the geology did not move. This is why a reported mean thickness has to travel with a statement of what it was averaged over.

## The fence post arithmetic

The mapping course taught this rule and it applies here without change, so this is a reinforcement rather than a fresh idea.

Nodes are the fence posts and intervals are the panels. A run of 25 nodes has 24 intervals between them, because the first node sits at the start of the first interval and every interval after it adds one node at its far end.

Work the model frame both ways. Across, 25 nodes at 50 m spacing means 24 intervals, which is 24 times 50, or 1200 m, so the frame runs in x from 1000 to 2200. Up, 20 nodes at 50 m means 19 intervals, which is 950 m, so the frame runs in y from 2000 to 2950. The last node of the grid sits at (2200, 2950), and the total node count is 25 times 20, which is 500.

The rule in both directions: to go from a node count to a distance, subtract one and multiply by the cell size. To go from a distance to a node count, divide by the cell size and add one. The error of dropping the one does not announce itself, because the map still draws. It just covers less ground than you think, and every number computed from it is quietly wrong.

## Nodes are the accounting unit

There is a second counting question that is specific to volumes, and it is worth settling now so that module 5 is not a surprise.

The frame has 500 nodes and 24 by 19 intervals between them. Volume in this course is built on the node count, not the interval count. Each of the 500 nodes carries one cell area of 2500 square metres, so the model accounts for 500 times 2500 square metres of ground, and a bulk volume is the mean thickness times the node count times the cell area.

That is how the zone A anchor of this course is built: 36 m mean thickness times 500 nodes times 2500 square metres gives 45,000,000 m3, or 45 x 10^6 m3.

Be consistent about it. The point is not that one convention is the only defensible one, it is that a volume, a node count and a cell area have to come from the same convention. Mixing a node based mean with an interval based area count produces an error of a few percent that no review will catch, because the answer looks entirely reasonable.

## Exercise

State the model frame in full, then compute the coordinates of the last node in each direction from the origin, the node counts and the cell size alone. Then answer this: if the frame were rebuilt at 25 m cells over exactly the same ground, would the zone A mean thickness of 36 m be averaged over the same number of nodes, and would you expect the bulk rock volume to change much?

Self check: the frame is 25 by 20 nodes at 50 m cells with its origin at (1000, 2000), holding 500 nodes at 2500 square metres each. Across, 24 intervals at 50 m is 1200 m, so the last node in x is at 1000 plus 1200, which is 2200. Up, 19 intervals at 50 m is 950 m, so the last node in y is at 2000 plus 950, which is 2950. At 25 m cells over the same ground there would be far more nodes and a far smaller cell area, so the mean would be averaged over a different denominator, but the bulk volume should stay close to the same, since the ground area covered and the thickness at each place did not change. That is the useful test of a volume calculation: refining the frame should barely move it.
