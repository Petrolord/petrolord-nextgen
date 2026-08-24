# The golden model

Every number in this course comes from one model. It is worth knowing exactly what that model is before you compute with it, because its properties are the reason every step of the workflow can be checked to the last digit.

## A committed fixture

The model is a synthetic. Nobody drilled it and nobody interpreted it. It was constructed as a committed test fixture, so that the answer to each step of the build is known in advance and can be checked against an independent implementation written in a different language. The capstone answer key at the end of this tier was produced by running the same pipeline you are learning, and it agrees with that independent oracle.

The practical consequence is the same one every good teaching fixture gives you. If your arithmetic returns something else, your arithmetic is wrong. On a real field you never have that comfort, because a wrong framework looks exactly like a right one until a well proves otherwise.

## The model frame

The model frame is 25 by 20 nodes at 50 m cells, with its origin at (1000, 2000). That is 500 nodes in total, and each node accounts for a cell area of 2500 square metres.

That frame is a decision, made once, and everything in the model is written onto it. The next module is about how that decision is made and what it commits you to. For now, hold on to two numbers, because they turn up in every calculation from here to the capstone: 500 nodes, and 2500 square metres per cell.

## Three surfaces, three grids

The model is built from three source surfaces, named shallow to deep: TopA, TopB and BaseB. Each of them arrives on its own grid, and none of those grids matches any other or the model frame.

| surface | grid | cell size | origin |
| --- | --- | --- | --- |
| TopA | 40 x 32 | 40 by 40 m | (900, 1900) |
| TopB | 27 x 27 | 60 by 45 m | (950, 1950) |
| BaseB | 30 x 25 | 55 by 55 m | (880, 1880) |

Read that table carefully, because it is the reason module 2 exists. The node counts differ, the cell sizes differ, one of the surfaces does not even use square cells, and all three origins differ from each other and from the model frame origin at (1000, 2000). Three surfaces in this state cannot be subtracted from each other, which means they cannot yet produce a thickness or a volume.

This is what real data looks like. Each surface came from a different interpretation, made at a different time, sometimes by a different contractor, and gridded with whatever settings suited that surface. Nobody was being careless. The first job of a framework build is to put them all on one frame anyway.

## Two zones

The three surfaces define two zones.

Zone A is the rock between TopA and TopB. Zone B is the rock between TopB and BaseB.

The two zones do not behave the same way, and that contrast is the spine of this tier. Zone A is present everywhere on the frame, at every one of the 500 nodes, with a mean thickness of 36 m and a maximum of 42 m. Zone B is present at some nodes and absent at others, because it pinches out. Its mean thickness averaged over all 500 nodes of the frame is 10.24 m, and its maximum is 31 m.

A zone that is present everywhere and a zone that pinches out need to be summarised in different ways, and getting that wrong is the most common reporting error in volumetrics. Module 4 takes it apart node by node.

## What else is in the fixture

The model is bigger than the slice you will work on. Two more things are in the file, and both belong to the tiers above this one.

Four wells are tied to the framework, one of them genuinely deviated with a 45 degree build. The Professional tier tracks those trajectories through the model with minimum curvature and compares what each well actually found against what the framework predicts at that location. Deviation is the interesting part, because a deviated hole reaches the bottom of the model somewhere other than under its surface location.

A fault polygon also sits in the fixture, splitting the model into two blocks. The Advanced tier labels each node with the block it belongs to, populates rock properties per block, and reads bulk rock volume per block, then checks that the block volumes add back to the whole zone volume you will compute in module 5.

You are not examined on either of those at this tier. They are mentioned so that you know the model has more in it than you are using, and so that when you meet the wells and the fault later you recognise the framework underneath them as the one you built.

## Why a synthetic

Learning a framework build on a real field means arguing about picks. Every discrepancy has two possible explanations, a mistake in your workflow or a genuine feature of the geology, and a beginner has no way to tell them apart.

On this model there is no such ambiguity. The surfaces were made, the frame was chosen, and the correct framework statistics follow from them by arithmetic. Zone A bulk rock volume is 45 x 10^6 m3, and that is not a consensus value, it is a fact about the fixture. When you reach the same number, you have the method right, and you can then take the method to a field where nobody knows the answer.

## Exercise

From the table above, state which of the three source surfaces has the largest node count, which has the coarsest cells in the x direction, and which of them shares an origin with the model frame. Then say in one sentence why the three surfaces cannot be subtracted from each other in the state they arrive in.

Self check: TopA has the largest node count at 40 by 32 nodes, TopB has the coarsest cells across at 60 m in x, and none of the three shares the model frame origin of (1000, 2000), since they start at (900, 1900), (950, 1950) and (880, 1880). They cannot be subtracted because subtraction is done node against node, and a node index on one of these grids does not refer to the same place on the ground as the same index on either of the others.
