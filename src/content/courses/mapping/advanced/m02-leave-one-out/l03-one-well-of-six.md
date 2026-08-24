# One well of six

One of the six capstone fields is the count of wells that can honestly be cross validated. It is 1, and it is graded with no tolerance. This lesson is about why that number is the answer and why reporting 6 would be worse than reporting nothing.

## The field

The capstone asks how many wells can be cross validated, and the answer is **1**.

A tolerance of zero is right for it, because it is a count. Either a well's location survives inside the hull of the others or it does not, and there is no partial credit for a location that nearly survives.

## The temptation

Every validation script ever written wants to produce a table with one row per well. Six wells, six residuals, a mean, a root mean square, done.

To get that table from this dataset you would have to disable the hull mask, because five of the six locations fall outside the reduced hulls. The software would then happily return a number at each of them, the spline being defined everywhere, and the table would look like this:

| Removed | Status |
| --- | --- |
| Ekene-1 | extrapolated, outside the five-well hull |
| Ekene-2 | extrapolated |
| Ekene-3 | extrapolated |
| Ekene-4 | extrapolated |
| Ekene-5 | extrapolated |
| Ekene-6 | interpolated, inside the hull |

Five of the six rows would be measurements of what a thin-plate spline does **beyond** its control, which is a question about the interpolator's extrapolation behaviour and not about the map's predictive skill inside the field.

Worse, those five residuals would almost certainly be large, because spline extrapolation diverges quickly, and they would be averaged in with the one honest number to produce a headline error that is mostly an artefact.

## Why a small honest count beats a large dishonest one

**A count of one is auditable.** A reader can check the hull, confirm that Ekene-6 is the only interior well, and reproduce the residual. There is nothing hidden.

**A count of six invites a false statistic.** Six residuals suggest a distribution, a mean and a spread, and a reader will treat them as a sample. Five of the six would not be samples of anything the map is used for.

**The limitation is itself a finding.** That only one well of six can be cross validated is a statement about the well pattern, and it is worth reporting on its own. It says the control is thin, the wells are arranged around a perimeter, and the map's interior is constrained mostly by geometry rather than by data. That is information a decision-maker can use.

## What to write

> Cross validation is available at one of the six wells. The other five are vertices of the control hull, so removing any of them places its own location outside the area the remaining wells constrain and no prediction exists there to compare. The single available residual is $+9.84$ m at Ekene-6.

Three sentences, no hedging, and everything checkable.

## Improving the count

The count rises with **interior** wells, and there are only two ways to get one.

**Drill inside the pattern.** Adding Ekene-7 at (1500, 1500) does exactly that, and the seven-well control set has two interior wells, Ekene-6 and Ekene-7, so the cross-validatable count becomes 2. Module 4 confirms it on the panel.

**Add non-well control.** Seismic picks, converted to depth, are control points like any other. A grid of seismic control turns most wells into interior points and makes cross validation genuinely statistical. That is how the technique is used on real projects, and it is why a six-well exercise is a teaching case rather than a template.

## Worked example

A validation report for a ten-well field quotes a root mean square residual of 4.2 m over ten wells. What single question should be asked first?

How many of the ten were interior to the hull of the other nine. If the field is a ring of ten wells around a structure, the answer may be zero, and the 4.2 m is a measurement of extrapolation. If the wells are scattered with several in the middle, the number may be five or six and the statistic is meaningful.

The root mean square value cannot be interpreted at all until that count is known, which is why the count belongs beside it in every report.

## Exercise

State the cross-validatable count on the Ekene six-well set and its tolerance, then give two reasons why reporting six residuals instead would be worse than reporting one.

As a self-check: the count is 1, graded exactly, because a well either lies inside the hull of the others or it does not. Reporting six would be worse because five of them would be extrapolations outside the reduced control hulls, so they would measure the spline's behaviour beyond its data rather than the map's predictive skill inside the field, and because six numbers invite a reader to treat them as a sample with a mean and a spread when only one of them is a sample of anything relevant.
