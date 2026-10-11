# The capstone brief

The Professional capstone runs the steps of this tier, from velocity to AVO at the wells, on a held-out synthetic case. The case is never the Ekene field: the members-only videos speak the Ekene answers aloud, so a graded figure on Ekene could be answered by watching. The case arrives as a case file, which the learner pastes into the prestack explorer with Data set to "Paste a case file"; the controls the case covers then start from the values it states.

## What the case file holds

- one NMO-corrected CDP gather, with its RMS velocity table;
- the modelled intercepts and gradients at four wells, and the seismic intercepts and gradients at the same four wells.

It also states every input the six figures depend on: the layer, the offset and the time, the target sample, the angle bins and ranges, the angles the fit is placed at and the number of terms. If a step seems to need a choice the case does not state, read the case file again: the input is there.

## The six figures

| figure | engine function | where this tier taught it |
| --- | --- | --- |
| the Dix interval velocity of a stated layer | `dixInterval` | RMS to interval velocity |
| Walden's angle at a stated offset and time | `waldenAngle` | Walden's straight-ray angle |
| the NMO stretch at that offset and time | `nmoStretch` | NMO stretch and the stretch mute |
| the far partial stack amplitude at the target sample | `angleGather`, `partialStack` | angle gathers, partial stacks |
| the two-term Shuey intercept at the target sample | `fitShuey` | the Shuey fit from near, mid and far |
| the one scale over the four wells | the comparison at the wells | one scale over every well |

All six figures are return values of an engine on the case, read from the panel; the scale is the One scale over every well tile of the "AVO at the wells" view. Each ends a chain the tier has walked: two rows of the case's table give the interval velocity; the angle and the stretch read the velocities at the stated offset and time; and the far stack and the intercept read the angle gather built with that table and the stated bins.

## What is graded and what is not

The six figures are graded. Nothing else is: no figure from a video, no Ekene figure, no class name, no verdict, and no figure that depends on a choice the case does not state.

## How to work it

Write down every choice the case states before reading a figure, then run the chain in order: the angle reads the velocities, and the stacks and the intercept read the angles. Check the units as you go: velocities in m/s, times in milliseconds two-way, offsets in metres, angles in degrees, and amplitudes in the case's trace units.

A refusal is the engine's own message and means an input is outside what the function accepts. Re-read the case file for that input.

{{panel:qi-prestack-explorer}}

## Exercise

Rehearse the capstone with Data set to "Ekene teaching pack", writing each choice down. In "Dix and Walden", choose a layer in Dix layer ending at, a Time and an Offset, and read the layer's Dix interval velocity, Walden angle at the offset and time, and NMO stretch at the offset and time. In "Angle gathers and partial stacks", choose a Sample time and a far range and read the partial stack tile. In "Shuey fit and the background trend", read Intercept A at the same sample with two terms. In "AVO at the wells", read One scale over every well. Beside each figure, note every input it read.
