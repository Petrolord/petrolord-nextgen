# No closed form in this engine

Every form so far answered the same question: given two pressures, what rate. The studio works in the other direction. A designer knows the rate the terminal has contracted for and wants the pressure it will see, and for that question this engine has no closed inversion.

{{panel:fc-gasline-explorer}}

## What it does instead

It bisects on the outlet pressure. It picks a pressure, calls the published form with it, compares the rate that comes back against the rate that was asked for, and narrows. The form being inverted is the same code the forward direction uses, so whichever of the four the caller named is the one being solved, and no second implementation of the physics exists to drift away from the first.

The search runs inside a bracket, and that bracket is a piece of physics rather than a convenience. Its floor is atmospheric. Its ceiling is the pressure at which the driving group vanishes, and the whole of the next lesson is about where that sits.

## The round trip

| form | rate scfd | outlet recovered psia | against the stated outlet psia |
| --- | --- | --- | --- |
| weymouth | 66104956.1404 | 620.000000 | 0.000000 |
| panhandleA | 86864172.0167 | 620.000000 | 0.000000 |
| panhandleB | 88369202.2673 | 620.000000 | 0.000000 |
| general | 73861363.0502 | 620.000000 | 0.000000 |

Each form was run forward from an outlet of 620.000000 psia to a rate, and the rate was handed back to the solver. All four recover the outlet they came from, with a difference of 0.000000 psi on every row.

Read what that proves and what it does not. It proves the inversion is faithful to the form it inverts, to the precision printed. It proves nothing at all about whether the form is right, because the same correlation was used in both directions. A round trip is a test of a solver and never a test of physics.

## An answer that came out of a solver

No equation produced this figure. Asked for 60000000.0000 scfd through Weymouth, the trunk arrives at 666.307057 psia, a drop of 183.692943 psi. That number is the endpoint of a search, and it carries a different kind of trust from a closed-form result: it is only as good as the bracket it searched and the form it called.

That is a different question from whether the arithmetic inside the loop is correct, and it is the one the rest of this module asks. Which is why the bracket is worth a lesson of its own. A closed-form answer can be wrong in its algebra. A bracketed answer can be wrong by never having contained the answer at all, and it will still return a number.

## The mistake

The mistake is reading the recovered outlet as a validation of the form. It validates the solver against the form and nothing further.

The second mistake is assuming an inverse exists because a forward calculation does. Here the inversion is numerical, it has a range, and outside that range the engine refuses rather than extrapolating.

## Exercise

State the direction the studio works in and why the engine cannot answer it in closed form. Give the four round trips and their differences. Then give the outlet and the drop when the trunk is asked for 60000000.0000 scfd through Weymouth, and say what the round trip does not prove.
