# Refusing with the evidence attached

Push 20000.000000 bpd of 56.000000 lb/ft3 crude at 8.000000 cp through 2.067000 in of bore over 20000.000000 ft, entering at 100.000000 psia, and the traverse refuses: { error: "the line cannot carry this rate: the pressure reaches zero absolute before 20000 ft" }.

{{panel:fc-liquid-explorer}}

## The refusal does not arrive empty

| what the refusal carries | value |
| --- | --- |
| stations it managed to stand behind | 1 |
| the last of those stations | 0.000000 ft at 100.000000 psia |
| the distance it died at | 20000.000000 ft |
| the pressure the arithmetic produced there | -47328.563502 psia |

Four pieces of evidence travel with the error string. The engine refuses with its working attached rather than instead of it.

## Why that is a design idea and not a convenience

A bare refusal tells a caller that something is wrong and nothing about what. The reader's next move is to re-run the case with instrumentation, or to bisect the inputs by hand until the failure reappears, and both of those are the engine's own work being repeated outside it.

Here the diagnosis survives the refusal. The station list says how far it got before the arithmetic left the physical world. The distance says where. The figure of -47328.563502 psia says by how much, and it is not a pressure at all, which is precisely the point: it is the number the arithmetic produced, shown as evidence rather than returned as an answer.

## A drop is not a pressure

The single call underneath still answers. The same line spends 47428.563502 psi, and there is nothing unphysical about that figure. A line can cost more pressure than any inlet holds, in the same way a journey can cost more money than is in the account. The cost is a real quantity and the balance is what makes it impossible.

So the two calls disagree because they were asked different questions. The single call was asked what this duty costs. The traverse was asked where the fluid is, station by station, starting from 100.000000 psia, and a rate that costs more than the inlet holds is a rate the line cannot pass. The traverse is the call that knows the inlet, and it is therefore the only one of the two in a position to refuse.

## What to do with the evidence

The distance it died at is the actionable figure. Compared against the line's length it says whether the duty is slightly beyond the line or nowhere near it, which is the difference between resizing a bore and rethinking a scheme.

## Refusing is not the same as failing

The engine did not fail on this case. It ran it, produced arithmetic, examined what that arithmetic implied and declined to present the result as a pressure. That sequence is why there is evidence to attach at all: a call that had thrown would have nothing to hand back, and a call that had not checked would have returned -47328.563502 psia as though it were an answer.

## The mistake

The mistake is catching the refusal, reading the error string and discarding the rest of the object. The string is the least informative part of it.

The second mistake is treating the two calls as contradicting each other. They answer different questions and both answers are correct.

## Exercise

Give the case conditions and the refusal the traverse returns. List the four pieces of evidence attached to it. Then give the spend the single call reports for the same line, and explain why one call refuses while the other answers.
