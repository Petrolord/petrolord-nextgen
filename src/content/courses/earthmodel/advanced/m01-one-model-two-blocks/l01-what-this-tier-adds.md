# What this tier adds

The Associate tier built one unbroken container; the Professional tier tied wells to it and left the disagreements on the table. This tier introduces the one structural element the model still lacks, a fault, and everything that follows from having one: labelling, per-block statistics, per-block property population, and per-block volume with an exact closure check.

## Why a fault changes the arithmetic

A fault is not decoration. It is a claim that the rock on one side moved relative to the other, and the operational consequence is that averaging ACROSS it is forbidden by default. A porosity trend fitted through wells on both sides of a sealing fault smears two populations into one; a thickness map contoured across it manufactures rock where the throw is. The moment a fault enters, every statistic in the model needs a block label attached, and "the field's mean porosity" stops being a single number.

This tier's machinery is exactly that relabelling. A fault polygon in world coordinates is laid over the frame; every node gets a block label; control points get labels through the same test; population and volumes then run per label. Nothing else about the engines changes, which is the point: the fault multiplies the bookkeeping, not the mathematics.

## What is already yours

From the Associate tier: the census 326 and 174, hand counted, and the block volumes 31.00125 and 13.99875 million m3 summing back to the 45 million anchor. From the Professional tier: four zone A control points with MD weights, one of which, W2's at x 1610.8719179395334, stands on the far side of the fault line from its own wellhead. This tier does not rediscover those; it derives the machinery that makes them inevitable and then builds on top.

## What is graded

The Expert capstone reads six values off this model: the block 1 node count (174, exact), the plane-trend porosity at (1250, 2250), the kriged porosity at (1500, 2500), the kriged porosity AT well W1 (the exactness check), zone A's weighted porosity in block 0, and zone A's bulk volume in block 1. Two are about labelling, three about population, one about volume: the tier in miniature.

Two of the six deserve a flag now. The kriged value AT a well is graded with the tightest tolerance in the ladder, 0.0005, because it is an exactness property of the method rather than a computed estimate: simple kriging with this engine's covariance honours its data exactly, and the capstone checks you know that. And the trend probe at (1250, 2250) is graded at 0.001 but is hand-reachable in three multiplications, for reasons module four will make embarrassing to forget.

## Worked example

Feel the "no averaging across faults" rule in one number. The four zone A control values are 0.315, 0.2935651232824187, 0.277 and 0.2765. All-well weighted mean: 0.2903935560727246. Now split at the fault: block 1 contains only W1's point, so its porosity is 0.315, full stop; block 0's weighted mean over the other three is 0.28631191845445614. The field-wide 0.290 describes NEITHER block: one is 0.025 higher, the other 0.004 lower. If the fault seals, the single number was never the porosity of anything.

## Exercise

The fault polygon will turn out to put 174 of 500 nodes in block 1. Before learning the mechanics: state what must be true of the four control points' LOCATIONS, not their values, for per-block population to be possible at all in both blocks, and what the fallback must be when a block ends up with too few points for a given method. Two sentences.
