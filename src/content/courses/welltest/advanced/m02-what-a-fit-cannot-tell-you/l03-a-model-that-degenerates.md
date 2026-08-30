# A model that degenerates

The right answer, at a bound, reported as a failure.

{{panel:wt-regression-explorer}}

## The experiment

Fit the dual-porosity model to the buildup, which is a single-porosity homogeneous test.

The dual-porosity model has five parameters: permeability, skin, storage, the storativity ratio omega, and the interporosity coefficient lambda. Omega is bounded between 0.001 and 1.

## What comes back

Omega drives to 0.9997801437192637, which is its upper bound to within a fifth of a thousandth.

The permeability comes back at 84.99985912600424 and the skin at 6.499975125924863, both correct.

And the fit reports `converged: false`.

## Why omega going to 1 is the right answer

Omega is the fraction of the total storage held in the fissures. At omega = 1, all the storage is in the fissures and there is no matrix contribution at all.

A dual-porosity reservoir with omega = 1 IS a single-porosity reservoir. The model has been asked to describe a reservoir with no second porosity, and it has correctly concluded that the second porosity holds nothing.

So the fit found the right answer. It expressed it as a parameter at a bound, which is the only way this model can say "the feature I represent is absent".

## Why it says it failed

Levenberg-Marquardt decides it has converged when the parameters stop moving and the residual stops improving by more than a tolerance.

A parameter pinned against a bound cannot move in the direction the gradient is pushing it. Every iteration the optimiser tries, the bound clips the step, the parameter does not change, and the convergence test that looks for a small parameter change is satisfied for the wrong reason while the gradient test is not.

Different implementations handle this differently. This one reports non-convergence, which is honest and unhelpful.

## The reading rule

When a fit reports failure, look at the bounds BEFORE concluding the data are bad.

Three cases, distinguishable at a glance:

**A parameter at a bound with the other parameters sensible.** The model is over-specified for these data. The feature that parameter represents is absent, and a simpler model will fit and converge.

**A parameter at a bound with the other parameters distorted.** The bound is preventing the fit from reaching the answer, and the other parameters are absorbing the difference. This is the skin floor case from the previous module.

**No parameter at a bound, and a large residual.** The model is wrong in a way the parameters cannot fix. Go back to the diagnosis.

The first case is a success wearing a failure's clothes. The second is a genuine failure of the model catalog. The third is a genuine failure of the interpretation.

## The lesson for model selection

This is the good news that balances the phantom fault.

An over-specified model does not always invent structure. Sometimes it degenerates gracefully to the simpler model and tells you so, by putting a parameter on the bound that removes it.

The difference between the two cases is whether the extra parameter has a value that makes it VANISH. Omega has one: omega = 1 removes dual porosity. A fault distance does not: no finite distance removes the fault, and the model's only way to say "no fault" is to push it to infinity, which is not in the bounds either.

So a model whose extra parameters have a null value degrades safely, and a model whose extra parameters do not, does not. That is worth knowing when choosing what to fit.

## The misconception to avoid

"The fit failed, so this model does not describe the data." Read the parameters. A converged flag is a statement about the optimiser's stopping criteria, not about the quality of the answer, and the most informative fits in this module are one that converged on nonsense and one that failed on the truth.

## Exercise

The dual-porosity model degenerated to homogeneous by putting omega on its bound.

For each of the other catalog models, say whether it has a parameter value that reduces it to the homogeneous case, and whether that value is inside its bounds. Then say which models are safe to try speculatively and which are not.
