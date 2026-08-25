# The grid crossed the fault

Everything so far has treated the partition as an operation applied to a finished map. This module asks where that map came from, and the answer undermines the partition in a way that is worth facing directly.

## The order of operations

The model was built in this order.

The six wells supplied their TOP_SAND and BASE_SAND picks. The gridder fitted a smooth surface through each set of six values across the whole frame. The contact clipped an oil column out of the two surfaces. Only then were the labels applied and the volumes summed per block.

Read that list again and notice what is missing. At no point did the surface construction know about the fault. The gridder was given six points and a frame, and it interpolated.

## What the interpolator did at the fault trace

The gridder fits a smooth surface, which means it produces a continuous depth field with no breaks anywhere in the frame. It has no mechanism for producing a break, because nothing told it one exists.

So at the fault trace the mapped TOP_SAND passes from the western side to the eastern side without a step. A node at 1700 m and its neighbour at 1900 m differ by whatever the smooth fit says, typically a metre or two, and the surface between them is drawn as though the rock were unbroken.

Physically that is unlikely. A fault that seals almost always seals because it has displaced the reservoir, putting sand against shale. Displacement means the top of the sand is at a different depth on the two sides, sometimes by tens of metres. The map has drawn a continuous surface across a discontinuity.

## The two errors this creates

The first error is in the depths near the fault. If the true surface steps down by, say, 20 m across the fault, then the smooth map is too deep on the upthrown side and too shallow on the downthrown side for some distance either way. Oil columns computed from those depths are wrong in both directions.

The second error is subtler and larger, and it is the subject of the next lesson. The interpolator does not merely smooth across the fault. It uses wells on one side to decide depths on the other. Every well within reach of a node contributes to that node's value, and the fault does not reduce anyone's reach.

## Why the model is built this way anyway

It is worth saying that this order of operations is normal, not a blunder invented for this course.

Building fault aware surfaces is a substantially harder problem. It needs the fault as an interpreted surface rather than a line, it needs the displacement along it, and it needs an interpolator that can honour a discontinuity. That machinery exists in full earth modelling packages and it is not what a volumetric estimate reaches for first.

More importantly, the sequence is often genuinely the right one for the early estimate. You map what the wells support, you get a volume, and only later does the fault interpretation firm up enough to justify rebuilding the surfaces around it. The failure is not doing it in this order. The failure is doing it in this order and then reporting the block volumes as though the map had been built for the partition.

## Worked example

Here is a thought experiment that makes the geometry concrete.

Suppose the Ekene fault has 20 m of normal displacement, with the eastern side down. The true TOP_SAND immediately east of the fault is 20 m deeper than the smooth map says.

At the capstone contact of 1560 m, the eastern cells nearest the fault carry mapped columns of roughly 10 to 16 m. Push their tops down 20 m and most of them lose their oil entirely, because their tops fall below the contact.

The east block's 52 cells would become a much smaller number and its 2.283591 MMstb would fall sharply. Nothing about the west block would change, and the field total would fall by whatever the east lost. A single interpretation parameter that the volumetric model never asked for is capable of removing most of one compartment.

## Exercise

State the order in which surfaces, contacts and fault labels were applied in this model, and identify the earliest step at which knowledge of the fault could have changed the answer.

Self check: surfaces were gridded first, then clipped against a contact, then labelled by block. The earliest step at which the fault could have mattered is the first one, the gridding, because a fault aware surface would have honoured a discontinuity and would have restricted which wells inform which side. Applying the fault only at the labelling step means every depth in the model was computed as though the fault did not exist.
