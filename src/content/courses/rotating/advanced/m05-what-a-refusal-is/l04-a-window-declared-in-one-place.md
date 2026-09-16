# A window declared in one place

A correlation is valid over a range, and the range belongs to whoever owns the correlation. One module here declares the compressibility window and the compression module imports it.

{{panel:fc-compressor-explorer}}

## One owner for one window

The separator sizing module in this same package exports its validity bounds for the compressibility correlation and refuses outside them by name. The compression module imports those bounds, which is the one-owner rule the gas constant is settled by, applied to a range. A restated window drifts, and a package holding two opinions about where a correlation stops cannot say which of them any answer sits inside.

## Three probes, and what the solver thought

| probe | suction psia | suction degF | Ppr | Tpr | z at suction | solver says converged | error key | gas hp |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| inside the window, as a control | 600.000000 | 100.0000 | 0.895350 | 1.532881 | 0.919606033 | true | absent | 910.1014 |
| below the temperature floor | 1000.000000 | -150.0000 | 1.492250 | 0.848155 | refused | true | present | refused |
| above the pressure limit | 24000.000000 | 100.0000 | 35.814000 | 1.532881 | refused | true | present | refused |

The published window is a reduced temperature from 1.0 to 3.0 and a reduced pressure up to 30, and two of those three rows sit outside it.

## Convergence is not validity

The convergence column is the one to look at hardest. The solver reports true on all three rows, at a reduced temperature of 0.848155 and at a reduced pressure of 35.814000 alike, so reading that flag would never have caught either. A solver converges on the correlation it was given, wherever it is asked, and it cannot know the fit was never fitted to data out there. Convergence is about the arithmetic and validity is about the data behind it.

## The refusal carries the coordinates

Each refusal reports the reduced coordinates, the state they were taken at, and which end of the train died. Below the floor: Ppr 1.492250, Tpr 0.848155, at 1000.000000 psia and -150.0000 degF, state "suction". Above the pressure limit: Ppr 35.814000, Tpr 1.532881, at 24000.000000 psia and 100.0000 degF, also "suction".

The reduced pair is what the window is written in and the pressure and temperature are what the user typed, so reporting both saves working out the pseudo-criticals by hand.

## Two kinds of edge

A suction below the reduced pressure the fit data start at is accepted, exactly as the owning module accepts it, and noted: "Ppr 0.018 against 0.2 at 12 psia and 100 F is below the 0.2 where the DAK fit data start; the z-factor here runs toward the ideal-gas limit".

That is the right call. The surface runs to the ideal-gas limit as the reduced pressure goes to zero, so a low-pressure suction is an ordinary machine. A window has two kinds of edge: extrapolation into unknown behaviour, and extrapolation toward known behaviour.

## A window is a limit, and so are eight other things

A declared window is the well-behaved case, because the engine enforces it. Eight other things in this course are limits nobody enforces, held for literature: printed, used, and never deciding a graded answer.

The load-bearing one is the impeller trim shortfall model. It has no publication in this repository, so the trim's power leg stays the ideal cube and the engine returns the efficiency ratio its own answer implies rather than inventing a second unsourced model.

## Exercise

Say which module owns the compressibility window and why it is imported rather than restated. Give the window and explain why the convergence flag would not have caught either probe outside it. Then say why a low reduced pressure is noted instead of refused, and what it means for an item to be held.
