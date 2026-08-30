# Omega and lambda

Two parameters, and why the dip does not hand you either of them.

## What they are

**Omega**, the storativity ratio, is the fraction of the total storage capacity that lives in the fissures:

    omega = (phi ct)_fissure / [ (phi ct)_fissure + (phi ct)_matrix ]

It runs from 0 to 1. Values in real fissured reservoirs are typically between 0.01 and 0.1: the fissures hold a few percent of the fluid.

**Lambda**, the interporosity flow coefficient, measures how easily the matrix gives fluid to the fissures. It combines the matrix permeability, the fissure permeability, the matrix block size and a shape factor into one dimensionless group, and it is typically between 1e-4 and 1e-9. Small lambda means slow transfer.

The fixture has omega 0.08 and lambda 5e-7.

## The classical readings

The textbook says the dip DEPTH gives omega and the dip POSITION in time gives lambda.

Both are true of the idealised Warren-Root solution with no wellbore storage and no skin. Neither survives contact with a real test, and the fixture shows why.

## Why the dip depth is not omega

The dip on this fixture reaches a bit over a quarter of the late plateau.

Omega is 0.08.

The ratio is more than three times omega, and the two are not the same quantity. Three things fill the dip in.

**Wellbore storage.** Storage smooths the early response and eats into the top of the dip.

**The Bourdet window.** The derivative is estimated over neighbours at least L cycles away, which averages across the dip and raises its minimum. The previous module's sweep showed this directly: increasing L makes the dip shallower.

**The transition shape itself.** The Warren-Root pseudo-steady-state transfer function gives a particular dip shape; the transient-slab version gives a different, shallower one. Which one is right depends on the matrix geometry, and the engine carries both as separate models.

So a dip ratio is a diagnostic that dual porosity is present, and it is a poor estimator of omega. The capstone in this tier grades the dip ratio, deliberately, as a measured property of the derivative rather than as a value of omega.

## Why the dip position is not lambda either

The time at which the dip is deepest depends on lambda, and also on the storage coefficient, the skin, and the fissure permeability. Reading lambda off the dip time alone requires assuming the other three.

## What actually recovers them

The model fit. The Expert tier fits the dual-porosity model to this fixture and recovers omega to seven digits and lambda to six, because the fit uses the whole curve rather than two features of it.

That is the general pattern of this course. The features on a derivative plot are for DIAGNOSIS: they tell you which model. Getting the parameters of that model out is a fitting problem, and the features are a starting guess for it rather than the answer.

## What to do when the fit is not available

Read the diagnosis off the derivative, state the parameters as ranges from the classical readings, and say they are estimates from features.

That is an honest and useful report. The failure mode to avoid is quoting an omega to three decimal places because a dip ratio was measured to three decimal places.

## The misconception to avoid

"Omega is the fracture porosity." Omega is a ratio of STORAGE capacities, which is porosity times compressibility, and the two systems usually have different compressibilities. In a fissured reservoir the fissure system is often much more compressible than the matrix, so omega can be several times the porosity ratio. Substituting one for the other in a volumetric calculation overstates the fissure pore volume.

## Exercise

The fixture has omega 0.08 and a dip ratio a little over a quarter.

Suppose you were handed only the dip ratio and applied the classical reading directly, taking the ratio as omega. State the factor by which you would overestimate the fissure storage, and say what that error would do to a forecast of how quickly the fissure system depletes before the matrix takes over.
