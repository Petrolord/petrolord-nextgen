# Uncertainty and defensibility

An Expert evaluation is not distinguished by fancier equations. Every equation in this ladder fits on an index card. What distinguishes it is the standard of evidence behind each number: where it came from, how uncertain it is, and what happens to the answer if it is wrong. This lesson makes that standard explicit, because the capstone and every real study after it will hold you to it.

## The provenance ladder

Every parameter in your evaluation sits on one of three rungs:

* **Given.** Someone handed it to you: a regional default, a report from an offset well, a value baked into the software. The Associate tier ran entirely on givens, and that was appropriate for learning the loop.
* **Fitted.** The data in front of you produced it: the Pickett fit returning $a R_w = 0.0500$ ohm.m and $m = 2.000$ from the water leg. A fitted parameter is stronger than a given because it carries its own consistency check.
* **Triangulated.** Independent measurements converge on it: the Arps-corrected lab sample at 0.049910 ohm.m, the SP quicklook at 0.049831 ohm.m, and the Pickett fit at 0.0500 ohm.m. Triangulation is the strongest rung, because the routes share no common failure mode.

A report earns the word Expert when its critical parameters sit on the highest rung the data allows, and when the rung is stated. Writing "$R_w$ = 0.05 ohm.m (triangulated: Arps, SP, Pickett)" is a different scientific claim from writing "$R_w$ = 0.05 ohm.m", even though the number is identical.

## Stating uncertainty

Uncertainty is not an apology attached to a result; it is part of the result. On the typewell the three $R_w$ routes span 0.049831 to 0.0500 ohm.m, a spread of about 0.4 percent. That spread is your uncertainty statement, and it is small because the dataset was built to converge. In field data a spread of 10 to 20 percent between routes is common, and reporting it honestly is what lets the next user decide whether it matters for their question.

Notice that the capstone itself works this way. It does not demand exact values; it grades each of its six numbers within a tolerance band: 0.0005 ohm.m on the two $R_w$ routes, 0.005 on the saturations, 0.01 m on the net pays. Tolerances are uncertainty made operational. A grader, like a partner or a regulator, needs to know not just your answer but the band within which your answer is the same answer.

## Sensitivity as evidence

The third leg of defensibility is demonstrated consequence. You showed in the previous module that booking SAND_A with the triangulated $R_w$ gives 18.0 m of net pay at $S_w$ 0.3609, while booking with the raw uncorrected sample gives 16.5 m. That single comparison does more work than any paragraph of assurance: it proves the parameter matters, it quantifies how much, and it shows the direction of the error. A sensitivity table is the difference between saying a parameter is important and showing what it does.

## The reproduction test

Here is the operational definition of defensible: another expert, given your report and the same data, reproduces your numbers and cannot find an unexamined assumption doing load-bearing work. Every choice they might question is already documented with its provenance and its sensitivity. They may still disagree with a choice, experts do, but the disagreement happens in the open, about stated evidence, and its consequence is already quantified.

This is why the reporting discipline from the Professional tier matters even more here. Parameter provenance, method justifications, zone tables, and sensitivities are not bureaucracy. They are the reproduction test, pre-run by you, before anyone else runs it.

## False precision

The opposite failure deserves a name. Quoting $S_w = 0.3609$ to four decimal places while your $R_w$ is a single uncorrected lab measurement is false precision: the display precision claims a certainty the provenance cannot support. You proved on the typewell exactly what that failure costs, because the uncorrected sample shifts every saturation by a factor of 1.51 and moves the booking by 1.5 m of pay. Precision belongs to the arithmetic; certainty belongs to the evidence. An Expert never lets the first impersonate the second.

## Exercise

Take the six numbers your capstone will report and assign each a provenance rung and an uncertainty statement. Self-check: the two $R_w$ routes are measurements you computed (Arps from the lab sample, quicklook from SSP), each graded within 0.0005 ohm.m; the water-leg mean of 0.9991 is a validation, not an input; the two 18.0 and 16.5 m bookings are a sensitivity pair whose difference, 1.5 m, is itself the evidence; and the pay-average $S_w$ of 0.3609 inherits its trustworthiness entirely from the triangulated $R_w$. Then write one sentence on why 0.3609 quoted without that triangulation would be false precision.
