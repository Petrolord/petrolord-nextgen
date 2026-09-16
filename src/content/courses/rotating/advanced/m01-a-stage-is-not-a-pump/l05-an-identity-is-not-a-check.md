# An identity is not a check

The two power routes on a compressor stage agree to the last bit. That agreement is worth showing, and it is worth understanding, because a reader who takes it for a validation has been reassured by nothing.

{{panel:fc-compressor-explorer}}

## The agreement

On the SOKU stage the gas horsepower by the polytropic route is 2279.6019 and by the isentropic route is 2279.6019, and the difference between them is -9.094947017729282e-13 hp. That is rounding in double precision and it is not a measurement of anything.

The reason is algebra. The exponent ratio times the polytropic efficiency is the isentropic exponent ratio exactly, and the identity table of this module shows the residual at 2.7755575615628914e-17 and 5.551115123125783e-17 on its four pairs. Because that identity holds, dividing the isentropic head by the isentropic efficiency and dividing the polytropic head by the polytropic efficiency are one expression written two ways.

## So the comparison cannot come out false

It is tempting to read the agreement of those two routes as a strong check that neither head is transcribed wrong. It is an algebraic identity. It holds for every input, including one that is transcribed wrong, so it validates nothing at all.

It is kept, and it is labelled as the shape property it is. A shape property is useful, because it says the two expressions really are the same expression and a refactor can break that. It just does not say that either of them is right.

## The question to ask of any gate

Ask what input would make it fail. If there is none, the gate is a restatement of the formula rather than a test of it, and the confidence it produces is manufactured.

Applied here, the answer is that nothing makes it fail, so the real check had to come from somewhere outside the formula. It does. The polytropic head is checked against a numerical quadrature of the integral of v dp along the polytropic path, computed independently, with a negative control that moves the exponent and must break the comparison. The control is the load-bearing half. A comparison nobody has ever seen fail is a comparison nobody has ever tested.

## Where this bites in ordinary work

The same rule applies to a spreadsheet that computes brake horsepower two ways and shows them matching in a checking column. It is the identity dressed up.

A useful cross-check is a route that does not share the derivation: a measured shaft power, a heat balance on a cooler, a vendor performance run. None of those is in this package, which is a limit this course states rather than papers over.

## The mistake

The mistake is quoting the agreement of the two routes as evidence in a design review. It is evidence that the code is internally consistent, and it carries less than it looks. Say what the check could have caught, and if the answer is nothing, say that too.

## Exercise

Give the two gas horsepower figures for the SOKU stage and the difference between them, and explain in terms of the exponent identity why they cannot disagree. Then state the question to ask of any gate, say what the real check on the polytropic head is, and explain why its negative control is the part that makes it a test.
