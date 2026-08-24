# The monotonic clamp

The rule from the last lesson has to be enforced somewhere. The engine enforces it with one pass through the model, node by node, in a routine called the depth-down monotonic clamp. It is a short piece of logic and it is worth understanding line by line, because the choices inside it decide what your model looks like where the surfaces disagreed.

## Walking the stack from the top down

Pick one node of the 500 node frame. At that node you have three depths, one from each surface, shallow to deep. The clamp walks them in that order and carries one piece of memory as it goes, a running value that holds the deepest depth it has seen so far in this column.

The first surface, TopA, has nothing above it. Whatever depth it carries is accepted, and it becomes the running value. Nothing on TopA is ever moved, because there is no constraint for it to break.

The second surface, TopB, is compared against the running value. If TopB is deeper than or equal to TopA, it is accepted and it becomes the new running value. If TopB is shallower than TopA, which is the illegal case, TopB is overwritten with the running value. The node is counted as fixed, and the running value carries on.

The third surface, BaseB, gets exactly the same treatment against whatever the running value has become. Then the clamp moves to the next node and starts again with a fresh memory.

That is the whole algorithm. It is one pass, it is local to a single node, and it needs no iteration, no smoothing and no solver.

## The word monotonic

Monotonic means moving in one direction and never turning back. Read the three depths in a column from the top of the stack downward and, after the clamp, they never decrease. They may stay the same, and where they stay the same the zone between them has zero thickness, but they never go back up.

That is the mathematical statement of the geological rule. Written out for one node:

$$z_1 \le z_2 \le z_3$$

The clamp is the cheapest possible way of forcing it: any value that would break the sequence is replaced by the value that came before it.

## Clamping down rather than pushing up

The comparison could have been resolved in either direction. Where BaseB sits above TopB you could pull BaseB down onto TopB, or you could push TopB up onto BaseB. Both produce a legal stack. The house convention, and the engine's behaviour, is to clamp down, which means the offending deeper surface is moved down onto the one above it and the shallower surface is never touched.

There are three reasons, and they are worth being able to state.

The first is that the correction stays where the problem is. Moving the deeper surface changes only that surface and the zone immediately above it. Pushing the shallower surface up would change the zone above it too, and if you kept doing that the correction could ripple all the way to the top of the model, so that one bad node on the deepest surface moved the crest of the shallowest.

The second is that the top of the stack is usually the surface you trust most. Shallow reflectors are typically better imaged, better tied and pickable over a wider area than deep ones. A convention that never edits the shallower surface is a convention that never damages your best data with your worst.

The third is that clamping down is conservative for volume. Pushing the shallower surface up would thicken the zone above it, which puts rock into the model that nobody interpreted. Clamping the deeper surface down leaves every zone above the correction exactly as it was, and the only zone whose thickness changes is the inverted one, which collapses to zero.

## What it does to the geometry

Consider a node where BaseB had come out above TopB. Before the clamp, the two surfaces have crossed, and the zone between them is inverted. After the clamp, BaseB holds exactly the same depth as TopB. The two surfaces touch, and the zone between them has thickness zero.

That is the important sentence of this lesson. The clamp does not turn a negative thickness into a small positive thickness, and it does not average the two surfaces to some compromise depth in between. It collapses the zone to nothing at that node. Where the surfaces crossed, the model says the zone is absent, which is a statement a geologist can read, argue with and check against a well.

An inverted zone is uninterpretable. A pinched-out zone is ordinary geology. The clamp converts the first into the second, and that is the only thing it does.

## Nulls and the running value

One detail matters for models less tidy than this one. A node can be null on one surface and live on another, for example where a surface was mapped over a smaller area. The clamp skips null nodes. A null stays null, it is never filled in, and it does not update the running value, so the next live surface below is compared against the last live surface above it rather than against nothing.

On this model that path is never taken. All 500 nodes are live on all three surfaces, so every column the clamp walks is a complete column of three depths.

## The counts are the output

The clamp returns two things. It returns the corrected surfaces, and it returns a count for each surface of how many nodes it had to fix. The count is a first-class result rather than a log line, and on a real project it is the number a reviewer asks for first. The next two lessons are about the counts this model produced and about how to read them.

## Exercise

Take one node where the resampled BaseB came out shallower than TopB. Write down what the clamp does to that node, what depth BaseB ends up with, what thickness zone B has there, and whether anything happens to TopA or TopB.

Self check: the clamp compares BaseB against the running value, which at that point in the column is TopB's depth. BaseB is shallower, so it is overwritten with TopB's depth and the fixed count for BaseB goes up by one. BaseB and TopB now hold the same number, so zone B has a thickness of exactly zero at that node and zone A is unchanged. TopA and TopB are not touched at all, because the clamp only ever moves the surface that broke the sequence, and it moves it onto the surface above rather than to any value in between.
