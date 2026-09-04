# A service factor is a judgement

Everything to the left of the service factor in the Goodman line is arithmetic. The service factor is somebody's opinion, and it decides the verdict.

{{panel:pd-balance-explorer}}

## What is fixed and what is chosen

Sa = ( T/4 + 0.5625 Smin ) SF. T is a published grade minimum, 115000 psi for API Grade D. Smin comes off the card the march produced. Neither of them moves when the service factor does. SF stands for the fluid, the corrosion and the operator's own practice, and the engine ships no default for it that would pretend otherwise.

## The sweep, with the design held still

On ODUMA-4 the same card, the same maximum stress of 25210.199822 psi in the top section and the same minimum stress of 2969.187943 psi stand behind every row. Only the line moves.

| SF | Allowable, psi | Loading | Warning |
| --- | --- | --- | --- |
| 0.9000 | 27378.151396 | 92.081454 percent | none |
| 0.8750 | 26617.647191 | 94.712352 percent | none |
| 0.8500 | 25857.142985 | 97.498010 percent | none |
| 0.8250 | 25096.638780 | 100.452495 percent | rodOverstressed |
| 0.8000 | 24336.134574 | 103.591635 percent | rodOverstressed |

At 1.0000 the loading reads 82.873308 percent and at 0.7000 it reads 118.390441 percent. Not one rod, one foot of depth or one stroke changed between those two readings.

## The crossing

Bisection on that sweep puts the crossing at a service factor of 0.828733084, where the allowable is 25210.199822 psi against a maximum stress of 25210.199822 psi and the loading is 100.000000000 percent. Above it the design is acceptable and below it the engine calls the string overstressed.

The crossing is the unity loading read as a fraction, which the line's linearity in SF guarantees, so the arithmetic hides nothing. The judgement does all the work: the number deciding whether this string is legal is an opinion about the fluid rather than a property of the steel.

## The mistake

Quoting a loading percentage without the service factor beside it. Someone handed 97.498010 percent cannot tell whether it came from a careful factor or a generous one, and 100.452495 percent is the same design one step of opinion away.

The warning does not close the gap. At a service factor of 0.8200 the message reads that the 1 section runs at 101.1 percent of its modified Goodman allowable, on a true loading of 101.065010 percent. It names the section and the percentage and never the factor that put it there. At 0.8300 the loading is 99.847360 percent and there is no message.

## A threshold is a chosen place, not a physical boundary

The fillage check has the same shape. It fires below 0.85 with no hysteresis: the silent design makes 301.389964 bbl/d and the warned design makes 301.354487 bbl/d, 0.035477 bbl/d apart, and one raises a warning. Nothing measurable separates them. Reading a warning list as a verdict is the same error as reading a Goodman loading without its factor.

## Exercise

Write the loading at service factors of 0.9000, 0.8500 and 0.8000, then the crossing factor.

Then say what a reviewer would need beside a loading percentage to check it, and why the warning list does not supply it.
