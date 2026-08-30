# The world magnetic model

A spherical harmonic expansion of the earth's field, and its own test values.

{{panel:wd-clearance-explorer}}

## What it is

A model of the earth's main magnetic field as a spherical harmonic expansion, with coefficients fitted to satellite and observatory data, plus a linear secular variation term so it can be evaluated at any date within its five-year validity.

It is produced jointly by the American and British geological agencies and released every five years. The current release is WMM2025, valid from 2025 to 2030.

## What it gives

At a latitude, longitude, height and date: the three field components, the total field strength, the horizontal component, the declination and the inclination, and the rate of change of each.

Three of those are what the survey system needs: declination for the azimuth correction, total field and dip for the error model.

## Its accuracy

The model's own stated uncertainty is around half a degree in declination at mid latitudes, larger near the poles, and it degrades through the five-year period as the secular variation term drifts from reality.

That is not small. Half a degree at 3000 m of displacement is 26 m, which is why the error model carries declination sources at all and why in-field referencing, which measures the field locally instead, reduces them substantially.

## The test values

The publishers issue a table of test points: twelve locations and dates, with the model's output to more digits than any user needs.

That table exists so that an implementation can be checked. It is the same idea as the ISCWSA validation well and the ADE survey example: a published case with a published answer.

## What this implementation gets

Every one of the twelve, to a worst declination error of under five thousandths of a degree, a worst inclination error of about five thousandths, and a worst total field error of under a twentieth of a nanotesla.

Those residuals are the printing precision of the published table, which gives declination and inclination to two decimals and the field to a tenth of a nanotesla. The implementation agrees to the last digit the publisher printed.

The panel's magnetics view lists all twelve with the published and computed declinations side by side.

## Where the model is worst

**Near the poles**, where the horizontal component vanishes and declination becomes ill conditioned. The model itself carries a warning region.

**In local anomalies.** The expansion is truncated, so it captures the main field and not crustal anomalies, which can reach degrees over ore bodies and volcanic provinces.

**Late in its validity period**, as the secular variation extrapolation drifts.

All three are reasons to use an in-field reference where the well matters.

## Why it is in a drilling course

Because every magnetic survey azimuth in the world is corrected using it or a higher-resolution equivalent, and because the error model will not run without two of its outputs.

It is the least visible input to a well's position and one of the largest contributors to the uncertainty of that position.

## The misconception to avoid

"The magnetic model is a lookup table for declination." It is a physical model of the field with a validity period, a stated uncertainty, a warning region near the poles and no knowledge of local anomalies. Its declination output is an estimate with an error bar, and that error bar is a first-order term in the position uncertainty of every magnetically surveyed well.

## Exercise

Open the panel's magnetics view and evaluate the field at a location you know.

Record the declination, the dip and the total field. Then say which of the three the error model needs, and which one the azimuth correction needs, and what each would be used for.
