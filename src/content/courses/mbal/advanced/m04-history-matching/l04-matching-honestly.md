# Matching honestly

A match is not a measurement. Nothing was measured when the optimiser stopped. A hypothesis about the tank, expressed as a model plus a set of free parameters plus a box for them to move in, was given the chance to fail against the observed pressures and did not. That is worth something, and much less than the resulting number usually gets treated as being. So the discipline is not about getting a better match. It is about reporting one in a form that lets a reader see what survived and what was never tested.

## What has to be in the report

Five things. A match missing any of them is not reproducible.

**What was fitted.** The parameter set, by name. If you accepted the default set, say so and say what it was for your aquifer model, because that default is three parameters on a Fetkovich case and one where there is no aquifer.

**What was fixed, at what value, on what evidence.** This is the half that gets left out. A parameter held at 200 md is a claim about the aquifer, exactly as much as one fitted to 219.569835483711 md is. The fitted one carries an error bar and the fixed one carries your judgment, and only one of those is visible in the output.

**The bounds and their justification.** Print the box you searched in and the sentence that justifies it. If you used the defaults, say so, and understand that you are reporting a search over four to six orders of magnitude.

**The fit, in full.** The root mean square error, the maximum absolute error, and the residual series. Lesson 1's Dake match ran one sign then the other, which the summary statistic conceals.

**The alternative.** The answer under a different but equally defensible choice. If freeing the aquifer permeability instead of the reservoir radius moves your oil in place by 24839380.3184400 stb, that number belongs in your report whichever one you headline. A reader who finds it later finds it as something you concealed.

## The warnings are part of the answer

*Simulated pressure was capped at initial pressure* means that at one or more steps the trial parameters supplied so much influx and expansion that the tank never drew down at all, and the simulator clamped it. At a clamped step the residual measures the distance to a wall, not misfit. *Simulated pressure was floored* is the same at the other end: the parameters could not supply the observed voidage even at the bracket floor.

*The aquifer pressure coupling loop did not fully settle within 25 sweeps* means the fixed point between the pressure solve and the marching influx never reached its 0.2 psi tolerance, so the simulated history carries a small aquifer lag error.

*Per-row lab PVT was converted to an interpolation table for the pressure simulation* is not a defect and is worth understanding. Simulated pressures land between your observed rows, and per row PVT exists only at the rows, so the engine interpolates through your lab points. Your PVT is being used at pressures it was never tabulated at, which is fine when the table is dense and a source of quiet error when it is not.

*Match quality is poor* fires when the root mean square error exceeds two percent of the initial pressure. A match that trips it is not a match. *A parameter finished at its search bound* invalidates that parameter's value and its interval together.

One behaviour carries no warning. When a trial parameter set makes the simulation fail outright, the matcher returns a large flat penalty for those residuals rather than an error, steering the search away. That is sensible numerics, and it means a match can converge without telling you that part of the parameter space was fenced off as unrunnable.

## What the validation tier does not say

The result carries a validation tier and a reference string, both inherited from the forward run at the matched parameters, with one clause appended saying the parameters came from a Levenberg-Marquardt minimisation of pressure residuals.

The tier is a statement about the METHOD the forward engine implements, benchmarked against published cases. It says nothing about whether your match is good, your fit set sensible, or your parameters physical. A `benchmark_verified` tier on a match that parked a parameter on its bound is still `benchmark_verified`. The tier was never a claim about your run. The warnings are.

## Worked example: the statement

The Dake match of lessons 1 and 3, written the way it should leave your desk.

> Oil in place is reported as 310198605.412900 stb, from a pressure history match of eleven annual observations on Dake Exercise 9.2, Carter-Tracy aquifer at a dimensionless radius of 5.
>
> Fitted: oil in place only. Fixed: aquifer radius at the contact 9200 ft from the mapped outline, permeability 200 md, thickness 100 ft, porosity 0.25, water viscosity 0.55 cp, encroachment angle 140 degrees, all as published with the exercise. Bounds on oil in place were the engine defaults, 3072214.09553720 to 30722140955.3720 stb, and the parameter finished far from both.
>
> Fit: root mean square pressure error 4.31298999061806 psi, maximum absolute error 7.16187806899097 psi over a 1280 psi decline, converged in 4 iterations. The residual series changes sign once, positive over years 1 to 7 and negative over years 8 to 10, indicating a small systematic error in the timing of late influx rather than scatter. One warning: per row PVT was converted to an interpolation table for the simulation.
>
> Alternative: freeing the reservoir radius as well returns 330212861.271306 stb with the radius at 8660.04101731403 ft, at a root mean square error of 0.533912409817980 psi. That match fits better and is not preferred here, because the mapped outline constrains the radius more tightly than the pressure history does, and because the published truth of 312 MMSTB is approached by the one parameter match and overshot by 5.83745553567499 percent by the two parameter match.
>
> The straight line regression on the same data returns 307221409.553720 stb. That is the number the reserves case uses, and the match is quoted as support for it rather than as a replacement.

Nothing in that is clever. It is a match, its freedoms, its fixings, its fit, its warning and its alternative, in an order a reviewer can follow. It also states the answer under the choice that was not made, which is the thing most match reports refuse to do.

## The sentence to carry out of this module

A match that reproduces the history is a hypothesis that has not yet been killed. It is not evidence that the tank is what you said, because a model with enough freedom reproduces any history at all, and the more freedom you gave it the less its survival means. What makes a match worth reporting is the count of things it could have failed against and did not.

## Exercise

Take any match from this module and write its statement in the form above, all five headings filled.

Then write the last paragraph properly. Name the one piece of evidence that, brought to you tomorrow, would change your reported number. Say what it would have to say and by roughly how much your answer would move. If you cannot name one, your match is not falsifiable and your report should say so instead.
