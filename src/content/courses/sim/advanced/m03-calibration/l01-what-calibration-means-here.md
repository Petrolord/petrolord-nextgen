# What calibration means here

The Professional tier said the structure was tuned. This module does the tuning, and it starts by being precise about what is being adjusted and against what.

## The distinction that matters

**Validation** is a test the model could fail. You predict something, you compare it against an observation the model has never seen, and the model is either right or it is not.

**Calibration** is an adjustment. You have a quantity you trust and a parameter you do not, and you set the parameter so the model reproduces the quantity. The model cannot fail; it can only be adjusted until it agrees.

Both are legitimate. Confusing them is not, because a study that calls a calibration a validation believes it has an independent check when it has none.

## What is being calibrated here

One parameter: the regional mean of the kriging that produced the structure. It is the depth the top surface reverts to far from any well.

Against one quantity: the NG5 volumetric booking of 12139208.107496763 stock tank barrels.

## Why that parameter

Because it is the least constrained thing in the static model.

The six well tops are measurements. The contact is mapped. The porosity, the saturation and the formation volume factor came from the earlier courses. The variogram range and sill affect the shape between wells, which the wells themselves partly constrain.

The regional mean affects the surface where there is no data at all, and nothing anywhere in the field's dataset says what it should be. It is a free parameter in the strict sense.

## Why that target

Because the booked volume is the better-constrained of the two numbers.

It came from a workflow built for volumetrics: a mapped structure, a mapped isochore, a contact, and a volumetric engine, on a frame chosen for the purpose. The simulation model's structure exists so a simulator can flow fluid through it, and its far-field shape serves no purpose at all.

So the calibration puts the adjustment where the ignorance is and leaves the measurements alone. That is the test of whether a calibration is defensible.

## What would not be defensible

Adjusting porosity to match the volume. Porosity is measured, it appears in the booking, and moving it to fix a volume overrides a measurement with a preference. The model would then be wrong in every calculation that uses porosity, which is most of them.

The rule: calibrate the unconstrained parameter against the constrained quantity, never the reverse.

## What the calibration does NOT establish

That the structure is right. The surface now reproduces one integral of the field. It could still be the wrong shape, put the crest in the wrong place, or close in the wrong direction, and the volume would still match.

That is the cost of having no spare data. Ekene has six wells and all six were used in the interpolation, so there is no seventh well to predict and check against. The static model is calibrated and unvalidated, and saying so is part of reporting it.

## The misconception to avoid

"A calibrated model has been checked against the data." It has been ADJUSTED to agree with one number derived from the data. Checking requires something the model was not adjusted to reproduce, and if no such thing exists, the honest statement is that the model is calibrated and has no independent structural check.

## Exercise

First, state the difference between calibration and validation in two sentences, and say which one this model's structure has had.

Second, name the parameter being calibrated and the quantity it is calibrated against, and explain in one sentence why calibrating porosity instead would be wrong.
