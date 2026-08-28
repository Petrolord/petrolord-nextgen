# When a path misses

A trajectory can produce no connections at all, or fewer than intended. The intersector reports what it found rather than what you hoped for, and the failure modes are worth recognising because none of them is loud.

## The three ways a path misses

**Outside the areal grid.** The path's easting or northing falls beyond the model. Every step returns no cell and the connection list is empty.

**Above the top or below the base.** The path is inside the grid areally and its depths are outside the layers, so it passes over or under the rock. This is the common one, and it usually means a depth reference mismatch.

**Partially outside.** Part of the path is in the model and part is not, so the connection list is shorter than the trajectory. This is the dangerous one, because it produces a valid-looking well.

## What the validator does

It refuses a spec whose well has a trajectory and an empty connection list, with a message naming the well:

> Well X has a trajectory that misses the grid entirely.

And it refuses any connection whose indices fall outside the grid dimensions.

What it cannot do is tell you a well is HALF outside. Eleven connections where you expected eighteen is a valid deck, and the only person who can notice is somebody who knew what to expect.

## The depth reference trap

The commonest cause of a well that misses vertically.

A directional survey is usually referenced to a drilling datum such as the rotary table or the kelly bushing, which is tens of feet above sea level. The grid is referenced to a subsea datum. Feed survey depths into a subsea grid without subtracting the elevation and the whole trajectory sits too shallow by the rig floor height.

On this field the sand is about 5100 ft down and a rig floor might be 80 ft up, so the error is under two percent of the depth and the path would still land in the grid areally. It would simply be above the reservoir, and the well would return no connections at all.

The tell is an empty connection list on a well whose map position is clearly inside the field.

## The unit trap

The same shape of error. Survey depths in metres fed into a grid in feet put the trajectory at roughly a third of its true depth, which on this field is well above the top of the sand.

Again, no connections, and again the map position looks fine.

## How to catch it

Compare the trajectory's depth range against the grid's before intersecting. The grid's shallowest top and deepest base bracket everything the model contains, and a path that does not overlap that interval cannot possibly connect.

That is two numbers and a comparison, and it catches both traps above before the intersector runs.

## The partial case again

Worth returning to, because it is the one that survives every check above.

A well planned to land in the reservoir and drilled long can exit the far side of the model, or a lateral can run past the edge of the grid. Some connections exist, the deck validates, and the well is short.

The defence is to know the expected connection count before you look. A 2000 ft lateral in 100 m cells should cross roughly six columns; if it reports three, half of it is somewhere the model does not extend to.

## The misconception to avoid

"If the deck validates, the well is completed where I intended." Validation checks that connections are inside the grid, not that they are all the connections there should be. A well with one connection where you expected twelve is a perfectly valid deck describing a well that barely touches the reservoir.

## Exercise

First, the grid's shallowest top is 5055.774278215223 ft and its deepest base is 5251.120588883762 ft. State the check you would run on a trajectory before intersecting it, and what a survey in metres would give.

Second, explain in two sentences why a partially missing well is more dangerous than one that misses entirely.
