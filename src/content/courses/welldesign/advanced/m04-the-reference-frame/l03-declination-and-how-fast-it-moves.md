# Declination, and how fast it moves

A correction with a date on it.

{{panel:wd-clearance-explorer}}

## The secular variation

The earth's field changes. Declination drifts by a fraction of a degree per year in most places, faster in some, and the direction of drift is not constant over decades.

The model carries a rate of change for every output, so it can be evaluated at any date in its validity period rather than only at the epoch.

The panel reports the declination drift rate alongside the declination. Read it: at typical rates, waiting five years changes the declination by enough to matter.

## Why the date is part of the input

Two wells drilled ten years apart at the same location have different declinations, and their surveys were corrected with different values.

If the older well's survey is recomputed today with today's declination, it is rotated by the drift, which for a well 3000 m out can be tens of metres. If it is left with its original correction, it is consistent with the field as it was when drilled.

Neither is obviously right. What matters is knowing which was done, and the survey header's declination and date are the record of it.

## The diurnal variation

On top of the slow drift, the field varies through the day by tens of nanotesla and a few hundredths of a degree of declination, driven by ionospheric currents.

Magnetic storms are much larger: a severe storm can move declination by degrees for hours, and surveys taken during one are simply unusable.

The model captures none of this. An in-field reference station, recording continuously, does, which is its main advantage.

## Crustal anomalies

The model is a truncated expansion of the main field. Local geology, particularly volcanic and mineralised provinces, adds a crustal field the model does not have.

Anomalies of a degree are common in some basins and several degrees occur. Where they are known, operators use a high-resolution model that includes a crustal component, or an in-field reference.

## What all this means for the error model

The declination error sources in the Professional tier's budget are exactly the residual after correction.

A well corrected with a global model at mid latitude carries roughly the model's stated uncertainty. A well corrected with in-field referencing carries much less, which is why the parameter sets differ and why the largest sources in the budget move.

So the choice of magnetic reference is not a survey detail: it selects the parameter set, and the parameter set is most of the answer.

## The check worth making

For any survey being used in a clearance calculation, ask what declination was applied, from what source, and for what date.

If the answer is a global model at an epoch several years before the well was drilled, the correction carries the drift as a systematic error, and the appropriate parameter set is a poorer one than the default.

## The misconception to avoid

"Declination is a property of the location." It is a property of the location AND the date, it drifts measurably year to year, it varies through the day, and it can be locally wrong by degrees where the crust is magnetic. A declination quoted without a date and a source is an incomplete number.

## Exercise

The panel reports a declination and a drift rate at a location.

Compute how much the declination will have changed in five years at that rate, and convert that angle into a lateral position error at 4000 m of horizontal displacement. State whether that error is larger or smaller than a typical drilling target radius.
