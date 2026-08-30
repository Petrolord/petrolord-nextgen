# What this course will not certify

Three things the engine does not do, taught here and graded nowhere.

## Why state this at all

A course that teaches a topic implies the topic is worth learning. A course that CERTIFIES a topic implies the learner can produce the answer and that the answer is worth producing.

Those are different claims and this course separates them deliberately, as the simulation and fluids courses in this series did before it. What follows is taught, in enough depth to be useful, and contributes no capstone field. The go-live migration for this course asserts that: it refuses to run if any graded field key mentions deconvolution, interference or a non-Darcy or apparent skin.

## Deconvolution

The problem it solves: real tests have variable rates and short flow periods, and superposition handles that by ASSUMING a constant-rate response and adding shifted copies of it. Deconvolution instead extracts the constant-rate response directly from the variable-rate data, without assuming its shape.

What it buys is enormous. A well with two years of production history and several short shut-ins can yield a single deconvolved constant-rate response spanning the whole two years, which reaches boundaries that no individual buildup came close to. Deconvolution is the reason modern interpretation can see drainage volumes from routine production data.

Why it is not here: `engines/welltest` has no deconvolution. It has superposition, which assumes the response shape, and regression, which fits a named model.

Why it is hard: deconvolution is an ill-posed inverse problem. Small errors in the rate history produce large errors in the recovered response, and every practical algorithm regularises the solution, which means imposing smoothness that the data did not require. Two deconvolutions of the same data with different regularisation give different responses, and choosing between them is a judgement.

Given what module 2 showed about a fault distance moving 116 ft on a 4.5e-13 psi perturbation, an ill-posed inversion is exactly the place where this course would be least able to certify an answer.

## Interference and multi-well testing

The problem: produce one well and watch the pressure in another. The response at the observation well constrains the permeability and the storativity BETWEEN the two, which is a far more useful quantity for connectivity than anything a single-well test gives.

Pulse testing is the refined form: pulse the active well and detect the pulses at the observation well, which separates the signal from background trends.

Why it is not here: every model in the catalog evaluates the pressure at the ACTIVE well. There is no observation-point geometry, no well-to-well distance, and no facility for a second well's pressure history. The `lineSourcePd` function evaluates the dimensionless pressure at a dimensionless radius, which is the building block, and nothing is built on it for this purpose.

Interference testing is the most direct measurement of connectivity in the subsurface, and a course teaching well testing should say that it exists and that this engine does not do it.

## The apparent skin

Module 4 said it and it belongs on this list.

The skin from a gas well analysis is s' = s + D q. The rate-independent skin s is the completion's damage. The D q term is non-Darcy flow, turbulence near the wellbore, and it grows with rate.

A single-rate test returns their sum and cannot split them. Separating them needs the apparent skin at two or more rates, from an isochronal or multi-rate test, and then s is the intercept of s' against q and D is the slope.

`gasMdhAnalysis` and `gasHornerAnalysis` return the apparent skin and the file says so. There is no function that takes several tests and separates them, so the course teaches the separation and grades nothing about D.

The practical consequence is worth stating: a gas well's reported skin depends on the rate it was tested at, and comparing skins between gas wells tested at different rates compares different quantities.

## What this leaves you able to do

Everything the previous five modules covered, which is the classical straight-line analyses, the derivative diagnosis, the model catalog, regression with its failure modes, superposition, gas pseudo-pressure and deliverability, and rate transient analysis for oil, gas and linear flow.

That is a working competence in well test analysis. What it is not is the whole subject, and knowing where the edge is is part of the competence.

## Exercise

For each of the three topics above, write down one situation in your own field or a field you know where it would change a decision.

Then say, for each, what you would do given that this engine does not implement it.
