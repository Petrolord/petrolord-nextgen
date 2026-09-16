# A band nobody here can state

Every fitted correlation has a range it was fitted over, and a number computed outside that range is an extrapolation whether or not anybody says so. The validity band of this correlation, in Reynolds and in Prandtl, is not established in this repository. The engine says so rather than pretending otherwise, and the way it says it is the model for how a held item behaves.

## The correlation block on every answer

Every film answer carries a correlation block, and on the studio case that block reports a validity band of null with the Reynolds and Prandtl numbers beside it. The note reads: The validity band of the Dittus-Boelter fit, in Reynolds and in Prandtl, is not established in this repository. Re and Pr are returned on every call so they can be checked against the source the caller trusts. Nothing here grades them.

Read the middle sentence twice. The engine cannot tell you whether you are inside the band, so it hands you the two numbers you would need in order to find out from a source you have and it does not. That is the honest shape for a held item: name the gap, hand over what a reader needs to close it themselves, and grade nothing that depends on it.

{{panel:fc-coefficient-explorer}}

## The viscosity correction, and its own held exponent

| wall viscosity given | Sieder-Tate applied | correction factor | film coefficient |
| --- | --- | --- | --- |
| none | no | 1.000000 | 547.762384 |
| 0.320000 cp | yes | 1.064473 | 583.078474 |

The Sieder-Tate correction is applied when a wall viscosity is given and skipped when it is not, and the answer reports which of those happened rather than leaving a reader to infer it from the number. Its exponent is a second held item, on the same footing as the band above, so the same rule applies to it.

Notice that the factor is reported on a key of its own, so the two film coefficients in the table can be told apart by a reader holding only one of them. A correction folded silently into a result is a correction nobody can audit.

## A pin is not a validation

Several numbers inside this correlation are pinned by their literal value in the engine gate. It is worth being precise about what that buys, because it is easy to read a pin as evidence and it is not.

A pin means that changing the number is a reviewed act rather than a silent one. That is worth having and it is all it is. No oracle can validate a fit: a fitted constant is a fact about somebody's data set rather than a consequence of anything, so a second route to the same answer cannot confirm it and an analytic limit cannot either. Move a pinned constant in the engine and in its oracle at the same time and every published case stays green. On a shared constant, every case green is the finding.

That is why nothing in this course grades a film coefficient, and why the films arrive stated wherever a coefficient is worked here.

## Exercise

Write down what the correlation block reports for the validity band and the two numbers it hands over instead. Then record the film coefficient with and without the viscosity correction, and the factor between them as the engine reports it. Finish by stating in one sentence what a pin gives you and what it does not.
