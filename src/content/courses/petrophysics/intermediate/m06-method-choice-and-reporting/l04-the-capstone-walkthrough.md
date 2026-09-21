# The capstone walkthrough

> **Open book, in part.** Some of the figures this capstone grades can be read in this tier's lessons or on a panel as it opens, so for now those check that you can find, read and report them correctly. A later update moves it to a case of its own.

You have now built every piece of the Professional workflow: three porosity methods, a fitted Pickett line, two shaly-sand saturation models and the discipline of sensitivity and reporting. The capstone asks you to run that workflow end to end on the typewell and report six numbers. This lesson walks through producing each one in the app, and closes the course by looking at what comes next.

## The six graded numbers

The Professional capstone grades exactly six quantities, every one of them reproducible by the engine from the typewell dataset and the given parameters:

| Quantity | Expected | Tolerance |
|---|---|---|
| SAND_A mean neutron-density porosity | 0.1762 | 0.002 |
| SAND_A mean Wyllie sonic porosity | 0.2069 | 0.002 |
| Pickett fit $aR_w$ over 2072 to 2078 m | read it from your own fit | 0.002 |
| Pickett fit $m$ over 2072 to 2078 m | read it from your own fit | 0.002 |
| SAND_A mean Simandoux $S_w$ | 0.4335 | 0.01 |
| SAND_A mean Indonesia $S_w$ | 0.4280 | 0.01 |

Notice what the six are: two porosity means testing the multi-method module, two fit parameters testing the Pickett module, two saturation means testing the shaly-sand module. The capstone is the course in miniature. Notice also the tolerances: they are wide enough to forgive rounding, and narrow enough that a wrong method, a wrong window or a wrong parameter will miss. You cannot pass this capstone by being close in spirit.

## Producing the numbers in the app

Open Petrophysics Studio in Learning Mode on the Professional tier. The intermediate panel runs the whole computation from the given parameters, so your work is to read it correctly and understand what each value means.

The porosity pair comes from the multi-method porosity step. The panel reports the SAND_A zone means for the neutron-density average and the Wyllie sonic. Check yourself against the module: $\phi_{ND}$ is the average of density porosity and NPHI at each sample, and its zone mean of 0.1762 must sit below the Wyllie mean of 0.2069 for the reasons you learned in the reconciliation lesson. If your two porosities land in the wrong order, something upstream is wrong.

The fit pair comes from the Pickett step, and the capstone moves the window on purpose. Over the true water leg at 2075 to 2078 m the 6-point fit lands on 0.0500 and 2.000, the given $R_w$ and $m$, which is the water leg confirming the given parameters. You already know those two numbers, so the capstone does not grade them. It grades the fit over 2072 to 2078 m, a window whose top reaches three metres above the water leg. Set the window top to 2072 and the base to 2078 in the Pickett explorer, click Fit water line and read the fitted $aR_w$ and $m$ with their point count. Then judge them: a window that takes in samples carrying hydrocarbon drags the slope and the intercept away from the givens, and the size of that drag is the lesson of the wrong-window exercise in the Pickett module.

The saturation pair comes from the shaly-sand step: Simandoux and Indonesia, both with linear $V_{sh}$ and $R_{sh}$ 2.0, averaged over SAND_A. Expect them close together and both below the Archie baseline, in the order Indonesia 0.4280, then Simandoux 0.4335.

Enter the six values in the capstone fields and submit. The grader recomputes each from the same dataset and accepts your answer if it lands within tolerance.

## The gate before the gate

On the deep path the capstone is the final step, and it stays locked until the coursework is done: every lesson read in order, every module quiz passed at 75 percent, and the final exam passed at 70 percent. The exam draws on all six modules, so treat the module quizzes as your rehearsal and the workflow map from module one as your revision skeleton. When the exam is passed the capstone unlocks, and passing it certifies you at Professional level on this application.

## What the Expert tier adds

The Professional tier validated $aR_w$ from the well's own water leg, but it never separated $a$ from $R_w$, and it trusted the water leg to exist. The Expert tier attacks $R_w$ itself from three independent directions: a laboratory water sample corrected to formation temperature with the Arps relation, a quicklook from the spontaneous potential log, and the Pickett fit you already know. Triangulating the three, and seeing what a wrong $R_w$ does to booked pay, is the heart of that course. If the Professional tier taught you to validate parameters, the Expert tier teaches you to hunt them down.

## Worked example

Rehearse the submission order once, step by step:

1. Read the SAND_A porosity means from the panel: 0.1762 and 0.2069, and confirm the neutron-density value is the lower of the two.
2. Set the Pickett window to 2072 to 2078 m, fit, and read $aR_w$ and $m$. Confirm the point count is 12, twice the water leg's 6, and that both values have moved well away from 0.0500 and 2.000.
3. Read the saturation means: 0.4335 and 0.4280, and confirm both sit below the Archie baseline of 0.4478.
4. Submit, and check the response reports all six within tolerance.

## Exercise

Before opening the app, write down from memory which module of this course each of the six graded quantities comes from, then check yourself against the table above. As a final self-check: state in one sentence why a fit over 2072 to 2078 m returns a much lower $m$ than the water leg does, and what that says about choosing a Pickett window without first checking it is fully water saturated.
