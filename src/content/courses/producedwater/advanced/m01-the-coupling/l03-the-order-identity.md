# The order identity, and what it does not answer

Reorder the stages of a train and every stage number moves. The outlet does not. That is one of the strongest statements this module makes about itself, and it is also one of the easiest to over read.

{{panel:pw-train-explorer}}

## What the engine reports

Run the OGBOTOBO devices as designed, then run the same four devices in reverse order. The outlet concentration is 160.391597 ppm both ways, agreeing to 7.09e-16 relative, which is float rounding rather than a difference. The outlet droplet median is 3.185598 micron both ways.

| position | device as designed | removal percent | device reversed | removal percent |
| --- | --- | --- | --- | --- |
| 1 | API 421 basin | 3.237437 | Walnut shell filter | 60.582215 |
| 2 | Hydrocyclone bank | 85.209861 | Induced gas flotation | 48.170414 |
| 3 | Induced gas flotation | 27.278164 | Hydrocyclone bank | 56.381625 |
| 4 | Walnut shell filter | 14.382082 | API 421 basin | 0.006985 |

The per stage removals move by as much as 57.344778 percentage points. Every number in the middle of the plant changed and the number at the end of it did not.

## Why the identity holds

The reason is worth more than either fact. A device removes a fixed FRACTION of each droplet size. So the volume surviving in any one size bin is the PRODUCT of the survivals across the devices, and a product does not care what order it is taken in.

That is a statement about multiplication. It needs no data, no calibration and no published case to be true, which is exactly why it makes such a good check on the code: an engine that gets it wrong has broken the coupling itself.

## What it does not answer

Here is where the reading has to stop. The identity says the MODEL does not care about order, and nothing about whether a plant does.

A designer still puts the coarse device first, and the reasons are real. Fouling, plugging, and how much oil each device can take in its reject decide the arrangement, and this module carries none of them. Put the walnut shell filter first and the model credits it with 60.582215 percent of the oil, which in a real plant is oil loaded into a bed that has to be backwashed, a maintenance problem the engine does not model.

So the correct statement of the lesson is the flat one. An invariance in a model is a statement about the model. It tells you what the model is insensitive to, and everything left out of the model is also, by construction, something the invariance cannot see.

## The two habits it should leave you with

A reader comparing two trains must compare their OUTLETS, because the stage numbers are functions of the arrangement and will differ for reasons that have nothing to do with performance. A reader judging one stage must know what reached it, because the same walnut shell filter reports 14.382082 percent in one position and 60.582215 percent in another.

Both habits protect against the same mistake, which is treating a stage removal as a property of a device. It is a property of a device and a water together, and in a train the water is whatever the stages before it chose to leave.

## Exercise

Build the OGBOTOBO train in the panel and record the outlet and the outlet median. Reverse the four stages and record them again.

Then write down two questions about this plant that the identity settles, and two that it leaves entirely open. Check that none of your four sentences claims the arrangement is free to choose.
