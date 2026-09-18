# What authority decides

A valve that is correctly sized for the flow can still be incapable of controlling it. Whether it can comes down to one number, and that number is valve authority.

## The definition

Valve authority is the fraction of the system's total pressure drop that the valve itself takes at design flow. The rest of the drop is taken by the pipe, the fittings, the exchangers and everything else in the circuit.

The digest works one system with a total drop of 120.000000 psi and asks what the authority is as the valve's own share changes. A valve drop of 10.000000 psi gives an authority of 0.083333. A valve drop of 40.000000 psi gives 0.333333. A valve drop of 70.000000 psi gives 0.583333. A valve drop of 100.000000 psi gives 0.833333.

## Why the fraction decides whether control is possible

Think about what happens when the valve opens. The flow rises, and as it rises the drop taken by the rest of the circuit rises with it, because friction losses go up with flow. The total drop available is fixed by the pump and the system, so the drop left over for the valve falls.

If the valve was taking most of the drop to begin with, that redistribution is a small effect and the valve's opening translates fairly directly into flow. If the valve was taking a small fraction, then opening it further hands most of the newly released pressure straight to the pipework, the flow barely moves, and the valve has spent a large part of its travel achieving very little. The loop then has a gain that changes enormously across the range, which is what makes it impossible to tune.

The system drop the fraction is taken against has to be the drop at design flow through the whole circuit, which is a number somebody has to produce from a hydraulic calculation. Where that figure is a guess, the authority is a guess, and the verdict beside it inherits the guess without showing it.

## What the engine returns beside the number

The engine does not stop at the fraction. On each case it returns a verdict word and a recommended inherent characteristic with a label, so a designer reading the result gets the assessment and the consequence together.

That is the shape of this module. The authority is arithmetic over two pressure drops. The verdict is a judgement read off the authority against a screen, and the characteristic recommendation is a design action read off the same authority. The three answers are separate things and this course grades no verdict word.

## Exercise

Write down the authority the engine returns for valve drops of 25.000000 psi and 85.000000 psi on the system whose total drop is 120.000000 psi. Then explain, in two sentences, what happens to the share of the total drop taken by the pipework as the flow rises, and why that matters more on the first of your two cases than on the second.
