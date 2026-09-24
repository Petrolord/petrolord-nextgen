# A label from a stated rule

{{panel:ml-validate-explorer}}

The first three modules predicted a number, DT in us/ft. This module predicts a class: is a sample pay or not? A class model needs a label on every training row, and a label is only as good as the rule that made it. This course always states the rule.

## The Ekene pay rule

A sample is pay, PAY = 1, when its core calibrated porosity PHIC is at least 0.16 and its deep resistivity RT is at least 10 ohm.m. Otherwise PAY = 0. On the Ekene wells, 94 of the 300 samples are pay.

Read the rule for its boundaries: "at least" means a PHIC of exactly 0.16 qualifies, and so does an RT of exactly 10 ohm.m. A rule that said "above" would label different rows. When you report a label, report the rule with its inequalities.

## What the model sees

The rule reads PHIC, and PHIC is not given to the model. The model sees RHOB (g/cm3), NPHI (v/v) and RT (ohm.m), and must learn the label from them. RT enters both the rule and the features, so part of the label is directly visible to the model; the porosity half has to be read through density and neutron.

## The pay split

Every one of the ten wells carries a PAY label, including EKENE-6, which has no sonic but has every log the pay model needs. So the pay teaching split is `groupSplit` over all ten wells, test fraction 0.3 and seed 5:

| role | wells | rows |
| --- | --- | --- |
| test | EKENE-3, EKENE-5, EKENE-7 | 90 |
| training | EKENE-1, EKENE-10, EKENE-2, EKENE-4, EKENE-6, EKENE-8, EKENE-9 | 210 |

The sonic teaching split held out EKENE-4, EKENE-5 and EKENE-8 from nine wells; the same fraction and seed on ten wells give a different shuffle. Say which wells a split was drawn from. Of the 210 training rows, 70 are pay.

## Labels the engine refuses

Logistic regression needs both classes in the training labels, and it needs them written as 0 and 1. The engine refuses anything else, naming the field. A training set with one class only:

> y must contain both classes, 0 and 1

A label that is neither 0 nor 1, here the third row passed, counted from 0:

> y[2] must be 0 or 1

The second refusal matters when labels arrive as text, as "pay" and "non-pay", or as a facies code. Mapping them to 0 and 1 is a stated choice the caller makes: which class is 1 decides what every probability and every ratio in the next modules is about. In this course 1 is pay.

## What the label is

The model's output will be a probability of PAY = 1 for a row, under this rule. Change the rule, the cutoffs or the core calibration, and the label changes under the model.

## Exercise

Open the validate explorer's logistic view, which loads the Ekene pay table with RHOB, NPHI and RT as features and PAY as the target. Confirm that the test wells are EKENE-3, EKENE-5 and EKENE-7. Then replace the table with a small one of your own, four wells of three rows each, with every PAY set to 0, and read the refusal and the field it names. Change one PAY value to 2 and read that refusal.
