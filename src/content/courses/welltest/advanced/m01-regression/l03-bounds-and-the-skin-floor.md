# Bounds and the skin floor

Every parameter is fitted inside a box, and one of the walls is a modelling decision rather than a physical one.

## The metadata

Every parameter in the catalog carries a label, a unit, a default, a minimum, a maximum, and a flag saying whether it is fitted on a logarithmic scale.

    P_K     = { k,      md,          default 50,   min 1e-3, max 1e5,  logScale }
    P_C     = { C,      bbl/psi,     default 0.01, min 1e-6, max 10,   logScale }
    P_SKIN  = { skin,   dimensionless, default 0,  min 0,    max 100 }
    P_XF    = { xf,     ft,          default 100,  min 1,    max 5000, logScale }
    P_OMEGA = { omega,  fraction,    default 0.1,  min 0.001, max 1,   logScale }

The bounds do real work. They keep the optimiser out of regions where the Laplace inversion misbehaves, they stop a runaway parameter absorbing another one's error, and they encode what is physically possible.

## Why some parameters are fitted in logarithms

Permeability, storage, fracture half-length and the dual-porosity parameters are all fitted as log10 of their values.

Two reasons. First, it enforces positivity for free: there is no value of the logarithm that gives a negative permeability. Second, and more useful, it makes the parameter's uncertainty MULTIPLICATIVE. A confidence interval on log10 k translates to an interval like "between 0.9 and 1.1 times the fitted value", which is the natural way to express uncertainty in a quantity that ranges over eight decades.

Skin is not fitted logarithmically, because it can legitimately be negative and because its natural scale is additive.

## The skin floor

Here is the one that is a modelling decision.

The homogeneous model allows skin down to minus 5. Every other model in the catalog bounds it at ZERO.

The reason is in the code comment: the additive Laplace skin term is only physical for non-negative skin, and the effective-radius mapping that handles negative skin does not commute with the fissure transfer function or with the image-well distances. A negative skin on a fault model would be arithmetic without a meaning.

So the catalog says: stimulated vertical wells belong to the homogeneous model, which handles them by the effective-radius route, or to a fracture model, which represents the stimulation explicitly.

## What that costs

A genuinely stimulated well in a fissured reservoir, or a genuinely stimulated well near a fault, cannot be fitted correctly by the corresponding catalog model. The fit will drive the skin to its floor of zero and absorb the remaining discrepancy into whichever other parameter can take it, usually the permeability.

That failure has a visible signature: a parameter sitting exactly on its bound. Any fit that returns a parameter at a bound should be read as the model saying it wants to go further and cannot.

The next module has an example where that behaviour produces the RIGHT answer and reports failure.

## Reading a fit for bound contact

Three things to check on every fit, in order.

**Is any parameter at or very near a bound?** If so, the model is constrained rather than fitted, and the value is a limit rather than a measurement.

**Is any confidence interval running to a bound?** Same problem, less obvious.

**Did it converge?** And if not, look at the bounds before concluding the data are bad.

The engine returns all three: `params`, `confidence95` and `converged`.

## The defaults

The catalog's defaults are deliberately generic: 50 mD, zero skin, 0.01 bbl/psi. They are not tuned to any fixture.

On a well-conditioned problem they are irrelevant. Starting the buildup fit from k = 5 and C = 0.5, which is two orders of magnitude off on one parameter, still lands on the same answer in ten iterations.

On an ill-conditioned problem they decide the answer, and the next module shows a case where the starting value alone determines which of two mirror-image answers you get.

## The misconception to avoid

"Bounds are just guard rails." Bounds are part of the model. A skin bounded below at zero says something about what the model can represent, and it is not always what the interpreter assumed. Read the catalog before reading the fit.

## Exercise

The fracture models bound the choked-fracture skin between 0 and 20, while the homogeneous model allows minus 5 to 100.

Explain why a fracture model does not need a negative skin, and say what physical quantity would be doing the work that a negative skin does on a homogeneous model.
