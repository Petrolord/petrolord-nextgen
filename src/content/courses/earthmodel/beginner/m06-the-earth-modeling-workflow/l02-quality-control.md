# Quality control

A framework that is wrong looks exactly like one that is right. Both come out of the same engine, both plot as smooth surfaces, and both report their volumes to more digits than anybody needs. What separates them is whether somebody ran a fixed set of checks before the framework was allowed out of the office.

This lesson is that pass, written the way a reviewer would run it. Six checks, in the order the questions would be asked, before a volumetric estimate or a well plan is built on your model.

## Check 1: are all nodes live on all surfaces

The reviewer's first question is whether the model has any holes in it.

After resampling, this model has all 500 nodes live on all three surfaces. Every node of the frame carries a TopA depth, a TopB depth and a BaseB depth, so every node can produce a thickness and every node contributes to a volume.

Where a surface is dead over part of the frame, the counts stop agreeing. The zone built from that surface has fewer live nodes than the frame, the mean is taken over one set while the volume is summed over another, and the closed-form check in check 5 will not reconcile. Ask for the live node count of every surface, and expect it to be stated rather than assumed.

## Check 2: is the clamp count reported and explained

Ask how many nodes the clamp fixed on each surface, and expect a number rather than silence.

On this model the counts are 0, 0 and 180. Nothing on TopA, nothing on TopB, and 180 nodes on BaseB. That is 36 percent of the 500 nodes of the model, and it is not a defect. It is the pinch-out of zone B expressed as a count.

A reviewer treats a suppressed clamp count as a failure of the report rather than of the model. A clamp that quietly fixed 180 nodes and said nothing has hidden the single most important structural fact about zone B. A clamp count of zero on every surface is also worth a question, because it either means the surfaces genuinely never crossed or means the clamp was never run.

## Check 3: are the surfaces in depth order everywhere after the clamp

The point of the clamp is that afterwards the stack is valid, so confirm it.

TopA has a mean of 1539.5 m, TopB 1575.5 m and BaseB 1585.74 m, so the means are in order. Order in the means is necessary and not sufficient, so look at the extremes as well. TopB and BaseB share the same maximum of 1620.9999999999998 m, which is what a valid clamp looks like: the two surfaces are allowed to touch where the zone has closed, and BaseB is never shallower than TopB anywhere.

The equivalent test on the thickness side is that no zone has a negative minimum. Zone A's minimum is 30 m and zone B's is 0 m. Zero is permitted and negative is not, because a negative thickness is a surface pair still out of order.

## Check 4: does mean separation match mean thickness

Two independent parts of the framework should agree here, so check that they do.

1575.5 minus 1539.5 gives 36, which is zone A's mean thickness of 36 m. 1585.74 minus 1575.5 gives 10.24, which is zone B's mean thickness of 10.24 m over all 500 nodes.

A mismatch says the thickness grid and the surface statistics were computed over different node sets, or that one of them was built before the clamp and the other after it. This check costs one subtraction and catches a class of error that no amount of staring at a map will reveal.

## Check 5: does the closed-form volume reconcile

Mean thickness times node count times cell area, against the volume the engine reports.

For zone A, 36 x 500 x 2500 = 45,000,000 m3, and the engine agrees to the digit. The frame is regular, so this is an identity rather than an approximation, and a reported volume that does not reconcile is wrong in a way that can be traced. The usual culprits are a cell area taken as a cell length, a unit change somewhere in the chain, and a mean taken over a different node set from the count.

## Check 6: is every mean quoted with its denominator

Last, the reviewer reads the report rather than the model.

Zone B's mean thickness is 10.24 m over all 500 nodes of the frame, or 16 m over the 320 nodes where the zone is present. Both are true and the difference between the headline figures is 56 percent. A mean thickness written without its node set is not a result, because the reader will supply a denominator of their own and has no way of knowing they guessed wrong.

The same rule applies to every volume, which needs the zone definition beside it, and to every node count, which needs to say whether it counts the frame or the live part of it.

Try it yourself: run checks 1 to 5 against the panel below, reading the surface statistics and the thickness grids from the same view.

{{panel:em-framework-explorer}}

## Exercise

Run the six checks against this framework and write one line for each saying what passed. Then answer in one sentence: which check catches a thickness grid that was built from the surfaces before the clamp was applied?

As a self check: all 500 nodes are live on all three surfaces; the clamp fixed 0, 0 and 180 nodes and the 180 are reported as zone B's pinch-out; the means run 1539.5, 1575.5 and 1585.74 m in order, TopB and BaseB touch at a shared maximum of 1620.9999999999998 m, and no zone has a negative minimum; 1575.5 minus 1539.5 gives 36 and 1585.74 minus 1575.5 gives 10.24, matching the two mean thicknesses; 36 x 500 x 2500 = 45,000,000 m3 reconciles with the reported zone A volume; and both of zone B's means are quoted with their node sets, 10.24 m over 500 and 16 m over 320. Check 4 catches a pre-clamp thickness grid, because an unclamped zone B would carry negative thicknesses where the surfaces crossed, its mean would no longer be 10.24 m, and the separation of the clamped surface means would not match it.
