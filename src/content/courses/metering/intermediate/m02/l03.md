# The regime ladder, rung by rung

{{panel:fc-choking-explorer}}

The regime word is a ladder read off the cavitation index, and the rungs are at stated values. Knowing where they sit turns the word into a number you can design against.

## Where the rungs are

The boundaries were found by bisecting the word the engine returns. Stable gives way to incipient cavitation at an outlet pressure of 174.180000 psia, where sigma is 3.000000. Incipient gives way to cavitating at an outlet pressure of 137.820000 psia, where sigma is 2.000000. The flow chokes at an outlet pressure of 67.679968 psia, where sigma is 1.217275.

The first two of those sigma values are the engine's own exported thresholds. The cavitating threshold the engine exports is 2.000000 and the incipient threshold the engine exports is 3.000000.

## Whose numbers these are

This is the part to hold on to. Both ladder thresholds are this engine's stated screen and neither is read from a standard. The engine exports them so that a reader can see exactly what decided the word on the screen, and this course grades no regime word anywhere as a result.

Treat the word the way you would treat a colour on a dashboard. It tells you which question to ask next. It does not tell you that a service is acceptable, because acceptability on a cavitating service depends on the trim, the materials, the duty cycle and how much of the year the valve spends at that operating point, none of which the index knows.

There is a second consequence of the thresholds being exported. Because they can be read, they can be replaced. An organisation that works to its own cavitation criteria knows exactly which two numbers it would have to change, and it can say what the word on the screen would have been under its own screen instead of arguing about a black box.

## Reading the ladder as a design tool

The third rung is different in kind from the first two. Choking is a hydraulic fact about the valve and the fluid. The first two rungs are a judgement about when damage starts to matter, and different organisations draw them in different places.

So the useful reading is the distance rather than the label. An index of 2.040786 at an outlet of 140.000000 psia sits between the two exported thresholds, and an index of 1.307130 at an outlet of 80.000000 psia sits below both of them. What a designer does with that is decide how much of the operating envelope sits on each rung, and whether the valve spends its working life there or passes through on the way to somewhere else.

## Exercise

Using the panel, move the outlet pressure until the regime word changes from `stable` to `incipient cavitation`, then again until it changes to `cavitating`. Write down the outlet pressure and the sigma at each change, and say which of the two exported thresholds each one corresponds to. Then say why this course grades no regime word.
