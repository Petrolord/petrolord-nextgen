# Complete separation

{{panel:ml-diagnose-explorer}}

The Professional tier's logistic fit of the Ekene pay label had an answer because no hyperplane in its features divided the pay rows from the rest. This lesson takes the case where one does. In this course the word separation means exactly that logistic property, and a split of the rows into training and test wells is always called a split.

| the pay rule, restricted to one set of rows | value |
| --- | --- |
| the stated pay rule | PAY = 1 when PHIC >= 0.16 and RT >= 10 ohm.m |
| rows with RT at or above 10 ohm.m | 106 |
| what decides PAY on those rows | PHIC alone, at 0.16 |
| logistic on PHIC for those rows, l2 = 0 | refused before any iteration |

## A label from a rule, and the rows the rule reads

The Ekene pay label is the output of a stated rule: a sample is pay when PHIC is at least 0.16 and RT is at least 10 ohm.m. The Professional tier's model saw RHOB, NPHI and RT, never PHIC, the core calibrated porosity the rule reads, and had to learn the label from the logs.

Now restrict the rows to the 106 with RT at or above 10 ohm.m. On those rows the RT half of the rule is always met, so PAY is 1 precisely when PHIC is at least 0.16. On PHIC alone, one threshold divides the classes perfectly.

## Why the maximum likelihood answer is infinite

Logistic regression chooses the coefficients that make the observed labels most likely. When a hyperplane in the features puts every PAY = 1 row strictly on one side and every PAY = 0 row strictly on the other, the likelihood can always be raised by steepening the curve: make the PHIC coefficient larger, keep the boundary where it is, and every probability moves closer to its own label. The log likelihood keeps rising as the coefficients grow, and the maximum likelihood coefficients are infinite.

A fit that simply iterated would make the coefficients larger at each step and print whatever it had reached when it stopped: a number set by the stopping point, saying nothing about the rock.

## The engine's refusal

With no penalty the engine does not iterate on separated data. It tests for separation first, and on these rows at l2 = 0 it refuses, in its own words:

> y is completely separated by a linear combination of the features (every row lies strictly on its own class side of a hyperplane), so the maximum likelihood coefficients are infinite: add an L2 penalty (l2 > 0) or remove the separating feature

The field named is `y`, and the message gives two remedies: a penalty, which the last lesson of this module fits, or removing the separating feature.

## What separation tells you

On these rows the cause is plain: PHIC is an input of the rule that made the label, so on the rows where RT is met it is the label in disguise. Whatever the cause on your own data, a finite coefficient from an unpenalised fit of separated labels would be a number with no meaning, and the refusal makes you look for the cause before any coefficient is printed.

## Exercise

Open the panel on the separation view. The default table holds the 106 high-RT rows with PHIC as the feature and l2 at 0. Run it and copy the field the refusal names. Then change one PAY value in the table so that one row sits on the wrong side of 0.16, run it again, and write down whether the engine still refuses and, if it fits, how many iterations it took.
