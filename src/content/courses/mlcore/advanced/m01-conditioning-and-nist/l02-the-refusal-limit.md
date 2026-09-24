# The refusal limit and why it sits there

{{panel:ml-diagnose-explorer}}

The engine refuses a least squares or ridge fit when the scaled condition number of the design is above `maxCondition`. The default is 100000000, which the course writes as 1.00e+8. This lesson shows the refusal on an exact copy of a column, explains why the limit sits there, and brackets it on a published design.

| case | scaled condition number | maxCondition | result |
| --- | --- | --- | --- |
| the three logs with a fifth column exactly twice NPHI | 6.22e+16 | 1.00e+8 | refused |
| Longley | 43275.043587 | 43000 | refused |
| Longley | 43275.043587 | 44000 | fitted |

## An exact copy

Take the teaching design and add a column that is exactly twice NPHI. The two coefficients cannot be told apart: any amount taken from one can be given to the other. Read with maxCondition raised to 1.00e+300, so that the number is returned, the scaled condition number is 6.22e+16. At the default the engine refuses, in its own words:

> X is too ill-conditioned for a float64 least squares fit: the scaled condition number 62175765717049960 is above maxCondition 100000000, so some coefficients could carry no reliable digits; drop or combine collinear features, centre or rescale them, or raise maxCondition knowingly

The message is a sentence for a person, and its figure prints every digit. The figure you reason with is the numeric field `scaledConditionNumber`, returned when the limit is raised, which the course prints as 6.22e+16. The message also names three remedies: drop or combine the collinear features, centre or rescale them, or raise the limit knowingly.

## Why 1.00e+8

A least squares solution can lose up to about kappa^2 x machine epsilon of relative accuracy in the worst case, where kappa is the condition number and machine epsilon is the spacing of float64 numbers near one. At kappa = 1.00e+8, kappa^2 times that epsilon comes to 2.220446. A relative error bound of that size is as large as the coefficient itself, so at that point no digit of some coefficient can be guaranteed. The engine states its rule in its basis:

> 2-norm condition number of the design with unit-length columns; refused above maxCondition 100000000

The limit comes from a worst-case bound, stated in advance. A refusal carries no number of its own. What the engine declines to do is print coefficients whose digits it cannot vouch for. Raising the limit is left to you, and the message asks you to do it knowingly.

## The limit, bracketed

The NIST Longley design has a scaled condition number of 43275.043587. Set maxCondition to 43000 and the engine refuses it; set it to 44000 and the engine fits it. Those two calls pin the rule from both sides. A value exactly at the limit is fitted: the refusal is for a number strictly above it. That boundary belongs to this rule alone. Each rule in the engine draws its own, and the logistic stopping rule, for instance, is read in a later module.

## Exercise

Open the panel on the condition view with the sonic rows and the features GR, RHOB and NPHI. Add a column to the table that is exactly twice NPHI, name it in the features, and fit at the default maxCondition. Copy the field the refusal names. Then raise maxCondition to 1.00e+300 and read the scaled condition number the engine returns. Last, fit your own two-column design at a maxCondition just below and just above its scaled number, and write down which call was fitted.
