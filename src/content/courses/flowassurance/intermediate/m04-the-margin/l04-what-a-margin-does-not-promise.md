# What a margin does not promise

A margin is a subtraction with one end supplied by an engine and the other by a laboratory. The engine will not check the laboratory number, will not check the inputs behind its own end, and returns `ok: true` either way.

{{panel:pd-line-explorer}}

## The end the engine never draws

`flowlineThermal` says hydrate and wax boundaries "are fluid properties, they come from a lab or a compositional flash, and the consumer supplies them". `hydrateInhibition` says it "does NOT compute where the hydrate boundary is in the first place".

So every hydrate temperature in this course is an input. TEACHING LINE AKASO SPUR uses 71.00 degF flowing, a teaching number. Its heat loss arrival is 89.316029952695 degF and its margin is 18.3160299527 degF. Change the laboratory number and the margin changes while no engine output moves. A margin quoted without the source of its boundary is half an answer.

## What ok true means

`steadyStateProfile` refuses a zero length and a zero U with one message: the profile needs a length, a mass rate, a heat capacity and a heat transfer coefficient. That is the whole of its checking. `ok: true` says four inputs were present, and nothing about whether they described the line.

## A margin on a U that was never built

The published pipe with a 3.0 ft trench returns 5 terms and U 0.7455927364 Btu/(hr ft2 degF). The same trench entered as 0.3 ft returns 4 terms and U 1.3348791131, which is the engine's own no-burial build to 0.0000e+0 relative. The ground share that was silently removed is 44.145299 percent, the error in U is 79.035960 percent, and it comes back with `ok: true` and no note. Every margin built on that U is confident and wrong.

## A margin against the wrong area

The published buried build referred to the 6.065 in bore has U 0.713200037662; referred to the 8.625 in coated outside diameter the same physics has U 0.501513997498, on an identical total resistance of 0.883057962117. Hand the outside diameter coefficient to a consumer with the bore and, at 26400.0 ft, the arrival comes back at 138.61917975 degF against the correct 125.06144556 degF, an error of 13.55773419 degF. The relaxation length is out by 42.209398 percent, which is exactly the diameter ratio 1.4220939819 and nothing else. `overallU` reports `referenceIdIn` and no consumer can read it.

## A flowing margin says nothing about a stopped line

On AKASO SPUR the boundary moves to 78.00 degF once the line packs up. `cooldownTime` asked to fall from 64.1160299527 degF to 78.00 degF against a 45.0 degF seabed returns hours = -4.6959175559 with `ok: true`, no note, and 25 stations that warm by 24.2422513458 degF.

## Exercise

Write down the margin on AKASO SPUR and then list every input it is conditional on.

Then say which one, entered wrongly, leaves every printed number in the return looking normal.
