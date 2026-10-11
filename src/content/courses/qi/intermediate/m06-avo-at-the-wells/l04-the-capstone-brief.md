# The capstone brief

The Professional capstone runs the steps of this tier, from velocity to AVO at the wells, on a held-out synthetic case. The case is never the Ekene field: the members-only videos speak the Ekene answers aloud, so a graded figure on Ekene could be answered by watching. The case arrives as a case file, and the learner pastes it into the prestack explorer, which runs the same engines this tier has used on the Ekene pack.

## What the case file holds

- one NMO-corrected CDP gather, with its RMS velocity table;
- the modelled intercepts and gradients at four wells, and the seismic intercepts and gradients at the same four wells.

It also states every input the six figures depend on: the layer, the offset and the time, the target sample, the angle bins and ranges, the angles the fit is placed at and the number of terms. Nothing the grade depends on is left to the learner's choice. If a step seems to need a choice the case does not state, read the case file again: the input is there.

## The six figures

| figure | engine function | where this tier taught it |
| --- | --- | --- |
| the Dix interval velocity of a stated layer | `dixInterval` | RMS to interval velocity |
| Walden's angle at a stated offset and time | `waldenAngle` | Walden's straight-ray angle |
| the NMO stretch at that offset and time | `nmoStretch` | NMO stretch and the stretch mute |
| the far partial stack amplitude at the target sample | `angleGather`, `partialStack` | angle gathers, partial stacks |
| the two-term Shuey intercept at the target sample | `fitShuey` | the Shuey fit from near, mid and far |
| the one scale over the four wells | the comparison at the wells | one scale over every well |

Every figure is a return value of an engine on the case, read from the panel. Each one is the end of a chain the tier has walked: the interval velocity comes from two rows of the case's table; the angle reads the RMS and interval velocities on the trace clock at the stated time; the stretch reads the same offset and time with the RMS velocity as the NMO velocity; the far stack comes from the angle gather built with that table and the stated bins; the intercept comes from the near, mid and far stacks at their stated angles; and the scale comes from the four wells' modelled and seismic points together.

## What is graded and what is not

The six figures are graded. Nothing else is: no figure from a video, no Ekene figure, no class name, no verdict, and no figure that depends on a choice the case does not state.

## How to work it

State every choice the case states, in your own notes, before reading a figure: the layer and its two rows, the offset, the time, the target sample, the bin edges, the ranges, the angles, the terms. Then run the chain in order: the angle reads the velocities, and the stacks and the intercept read the angles. Check the units as you go: velocities in m/s, times in milliseconds two-way, offsets in metres, angles in degrees, and stack amplitudes and the intercept in the case's trace units until the scale ties them to reflectivity.

A refusal is the engine's own message and means an input is outside what the function accepts. Re-read the case file for that input.

{{panel:qi-prestack-explorer}}

## Exercise

Rehearse the capstone on the Ekene pack in the prestack explorer. Choose a layer of the published RMS velocity table, an offset and a time on gather 5, and a target sample, and write each choice down. Then run the six steps in order across the Angles from velocity and AVO views: the interval velocity, Walden's angle, the stretch, the far partial stack, the two-term intercept and the one scale over the four wells. Beside each figure, note every input it read.
