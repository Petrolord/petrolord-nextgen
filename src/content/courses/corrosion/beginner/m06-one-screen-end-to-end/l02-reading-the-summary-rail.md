# Reading the summary rail

{{panel:fc-inhibitor-integrity-explorer}}

A screening returns a set of fields and the rail down the side of the studio is where they are read together. Reading them in the engine's own order keeps you out of trouble, because the order carries the dependencies.

The wall shear is computed first. On the shipped case it is 14.408065 Pa with a film risk of low, so the corrosion inhibitor credit stands and the rate is computed with it. That order is deliberate: the rate depends on whether the film survives the flow, so a shear that cannot be computed makes the screening incomplete and no rate is issued at all. A blank density is a refusal rather than a missing row.

Then the rate, at 0.754524 mm/yr, with the band label high beside it and a field declaring that band held. Then the sour comparison, which reports the stream above the screening threshold. Then the regime, which is mixed here, with the rate marked as an upper bound. Then the life, at 4.207953 yr against a design life of 20.000000 yr, which the case does not meet. Then the limit that governs the answer.

## The corrosion inhibitor block

This part of the rail is where the arithmetic surprises people, and it is worth pausing on. The datasheet efficiency is 90.000000 percent and the availability is 95.000000 percent, and the effective protection the engine reports is 85.500000 percent, a shortfall of 4.500000 percentage points. The engine says what that costs in its own words:

> a 90 percent inhibitor at 95 percent availability gives 85.5 percent effective protection, which is 1.45 times the metal loss of the datasheet number: availability, not efficiency, is what limits it

Read the words above as the engine's own and keep the vocabulary straight in your own notes: the chemical here is a corrosion inhibitor, a filming amine on the steel, and it has nothing to do with the hydrate inhibitors the Flow Assurance course doses in the water phase.

## The allowance block, and the rows that are absent

The remaining allowance is 3.175000 mm, the remaining life is 4.207953 yr, the allowance the design life demands is 15.090473 mm and the shortfall against it is 11.915473 mm. The word integrity covers exactly that arithmetic on this screen and no more.

Four rows a reader looks for are listed as absent rather than left off. There is no inspection interval, no minimum thickness, no retirement thickness and no fitness for service assessment. Seeing them named is the point: an absence you can read is an absence you can plan around.

## Exercise

Copy the rail on the shipped case into six lines: shear, rate, sour, regime, life and binding limit. Beside the corrosion inhibitor block record the 90.000000 percent, the 95.000000 percent and the 85.500000 percent together. Then work out the percentage points between the datasheet figure and the effective figure, check it against the 4.500000 the engine reports, and say which of the two inputs your arithmetic says is doing the limiting.
