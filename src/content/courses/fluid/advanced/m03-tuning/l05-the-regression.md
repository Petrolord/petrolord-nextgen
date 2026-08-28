# The regression

Four knobs, four targets, one least-squares problem, and one gotcha that took real work to find.

{{panel:fluid-tuning-explorer}}

## The problem

Minimise the sum of squared relative errors between the model's predictions and the laboratory's measurements, over the four bounded knobs, with a weak pull toward the untuned values.

Relative errors, so that a saturation pressure in thousands of psia and a gravity in tens of API contribute comparably. Every residual is of order 0.01 per percent of mismatch.

Stock tank gravity enters as a specific gravity rather than as API, for the same reason: API is a compressed scale and a residual in API would weight the gravity target far more heavily than the others.

## The solver

Levenberg-Marquardt, the same kernel the well test course uses for pressure-transient fitting. It interpolates between gradient descent when far from a solution and Gauss-Newton when close, which makes it robust on the way in and fast at the end.

Reusing one solver across domains is deliberate. A numerical kernel used in several places gets tested by all of them.

## The gotcha

The Jacobian is computed by finite differences: nudge a knob, see how the residuals move.

The default nudge is a small RELATIVE step, of order one part in a million. That is right for most problems and it is wrong for this one.

The saturation pressure target is computed by a bisection with a tolerance of 0.05 psia. So the model's saturation pressure is QUANTIZED to 0.05 psia. A knob perturbation that moves it by less than that moves it by exactly nothing, and the finite difference returns a derivative of zero.

A zero derivative tells the solver the knob does nothing, so it does not move it. Three of the four knobs affect the saturation pressure, and the fit would have stalled with them untouched.

## The fix

An explicit absolute Jacobian step for the tuning problem, of one part in a thousand rather than one in a million. Large enough to move the saturation pressure across several bisection quanta, small enough to remain a local derivative.

That required a change to the shared solver: a per-parameter step option, added in a backward-compatible way so that every existing caller keeps the default.

## Why this is worth a lesson

Because the failure was silent.

The regression converged. It reported success. The residual fell, because the one knob whose target was not quantized still worked. Nothing errored and nothing warned.

The only way to notice was to look at the knobs and see that three of them had barely moved, and then to ask why.

A quantized objective is a general trap. Any target computed by a search with a tolerance, any counted quantity, any value that has been rounded, will do the same thing to a finite-difference derivative. The symptom is always the same: a parameter the solver decides has no effect.

## The check to run

After any finite-difference regression, look at how far each parameter moved. A parameter that did not move is either well determined, unconstrained by the data, or invisible to the derivative, and those three need different responses.

Distinguishing them takes one experiment: perturb the parameter by hand and see whether the objective changes. If it does and the solver did not move it, the step size is wrong.

## The misconception to avoid

"The solver converged, so the fit is the best available." The solver converged to a point where it could see no improvement, which depends on what it could see. A derivative computed through a quantized objective is blind, and a blind solver reports success in exactly the same way a sighted one does.

## Exercise

First, explain in three sentences why a bisection tolerance of 0.05 psia can make a finite-difference derivative return zero.

Second, describe the one experiment that distinguishes a well-determined parameter from one the solver cannot see.
