# A model must be valid

The last module put the three surfaces on one frame. TopA, TopB and BaseB now sit on the same 25 by 20 node grid at 50 m cells, 500 nodes apiece, and every node of one surface has a partner at the same place on the other two. That was necessary work and it was not sufficient work. Sharing a frame makes surfaces comparable. It does not make them consistent.

This lesson is about that gap, because closing it is the whole of this module.

## Comparable is not consistent

Resampling is an interpolation. It asks each source grid what its value is at a node of the model frame and writes the answer down. It does that surface by surface, and it has no opinion about what the other surfaces are doing at the same node. TopA was interpolated from its own 40 by 32 grid, TopB from a 27 by 27 grid, BaseB from a 30 by 25 grid. Three separate operations, three separate sets of neighbours, three separate roundings.

So nothing in the resampling step prevents the resampled BaseB from coming out shallower than the resampled TopB at some node. Nothing in it prevents TopB from coming out above TopA. The three surfaces were interpreted at different times, possibly by different people, possibly on different seismic volumes, and the interpolation faithfully carries whatever disagreement they already had into your model frame.

## The rule the stack has to obey

A structural framework is an ordered stack. TopA is the top of the model, TopB sits below it, BaseB sits below that. Depths here are TVDSS in metres, positive down, so a deeper surface carries a larger number.

The rule is short. At every node of the frame, and separately at every node, the surface listed lower in the stack must carry a depth at least as large as the surface above it:

$$z_{TopA} \le z_{TopB} \le z_{BaseB}$$

Read it as a statement about rock rather than about numbers. Between TopA and TopB there is a body of rock, zone A. Between TopB and BaseB there is another, zone B. Rock occupies space once. A column of rock cannot contain a boundary that is below another boundary in one place and above it in the same place. If the arithmetic says otherwise, the arithmetic is describing something that does not exist.

This is not a subtle error to be weighed against other considerations. A framework that violates the rule at even one node is not a slightly imperfect model. It is a model of an impossible piece of ground, and every number you take out of it is a number about that impossible ground.

## Negative thickness is the symptom

You will rarely catch the violation by looking at the surfaces. You catch it in the thickness grid, which is the next thing the workflow builds.

Zone thickness at a node is the deeper surface minus the shallower one. If BaseB has come out above TopB at that node, the subtraction returns a negative number. Negative thickness is the symptom the disease presents with. There is no geological reading of it. A zone cannot be a negative number of metres thick any more than a bed can be a negative amount of rock.

The trouble is that a negative thickness does not stay visible for long. It goes into a sum.

## Why nothing downstream will warn you

Take the bulk volume calculation you will meet in module 5. It multiplies thickness by cell area and adds up the nodes. A node with negative thickness contributes a negative volume, and that negative quietly cancels part of the positive volume of its neighbours. The total that comes out is smaller than the truth and it looks entirely ordinary. There is no zero, no null, no error and no flag. You get a plausible number that is wrong by an amount you cannot see.

The same silence runs further. A property model populated on an inverted cell writes rock properties into a cell with no interior. A flow simulator handed an inverted stack either refuses the grid or, worse, accepts a repaired version of it that nobody has looked at. A map of zone B thickness plots the negative area in whatever colour sits at the bottom of the scale, and to a reader that colour says thin, which is the opposite of what it means.

Silent failure is the reason this module exists. A framework has to be made valid deliberately, before anything is built on it, and the repair has to be reported.

## The means will not save you

Here are the mean depths of the three surfaces on this model, taken over all 500 nodes of the frame after the framework has been made valid.

| surface | mean depth (m) | mean separation from the surface above (m) |
|---|---|---|
| TopA  | 1539.500000 | |
| TopB  | 1575.500000 | 36 |
| BaseB | 1585.740000 | 10.24 |

Both separations are positive, and a reader glancing at that table would conclude the stack is in order. The table cannot tell them that. A mean separation of 10.24 m is an average over 500 nodes, and an average of positive and negative numbers is still positive as long as the positives win. Zone B is thin, and a thin zone gives the surfaces bounding it very little room to disagree before one crosses the other.

Validity is a node-by-node property. It has to be tested and enforced node by node, which is what the depth-down clamp in the next lesson does.

## Exercise

Using the table above, write down the mean separation for zone A and for zone B, then answer in two sentences: does a positive mean separation prove that no node in the model is inverted, and which of the two zones would you check first?

Self check: zone A separates by $1575.5 - 1539.5 = 36$ m and zone B by $1585.74 - 1575.5 = 10.24$ m, both positive. A positive mean proves nothing about individual nodes, because the mean is taken over all 500 nodes and a handful of negative thicknesses can hide inside a positive average. Check zone B first, because at less than a third of zone A's mean separation it has far less room to absorb any disagreement between the two surfaces that bound it.
