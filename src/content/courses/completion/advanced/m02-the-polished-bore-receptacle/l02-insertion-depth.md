# Insertion depth

The one number the rig floor controls, and how it is actually set.

{{panel:cd-spaceout-explorer}}

## What sets it

The tally. The seal assembly lands where the accumulated length of everything above it puts it, and the string is made up from joints of known length.

To land two metres deeper, you add two metres of pipe above. To land shallower, you take pipe out.

## Pup joints

Full joints are around nine and a half metres, which is far too coarse. So a completion carries pup joints, which are short joints in a range of lengths, and the space out is achieved by selecting a combination of them.

A typical set gives increments of a foot or less. That is fine granularity against a bore of several metres, which is why the space out calculation can treat insertion depth as a continuous variable.

## Why it is not simply set to the design value

Because the string that arrives at the rig is not exactly the string on the tally. Joints get measured, and the measured lengths differ from nominal.

The space out is computed with measured lengths, on the rig, once the string is made up to the point where the total is known. That is why it is an operation and not a desk calculation.

## The consequence of getting it wrong

The seals land somewhere other than intended, and the two available travels are wrong by the error, in opposite directions.

A metre too deep means a metre less available for contraction and a metre more for elongation. If the design was balanced, the completion is now unbalanced, and the direction it is unbalanced towards is usually the one that matters most, because contraction is usually the larger case.

## What is not adjustable afterwards

Everything. Once the packer is set and the string is landed, the insertion depth is fixed for the life of the completion.

There is no mechanism to change it, no way to observe it directly, and no second chance without pulling the string. That is why this calculation gets done carefully and checked.

## Exercise

Explain how insertion depth is physically set and why pup joints exist.

Then say why the space out is computed on the rig rather than in the office.

Finally, take a design landing and suppose the string comes out one metre longer than the tally said. Say what happens to both available travels and which case is now at risk.
