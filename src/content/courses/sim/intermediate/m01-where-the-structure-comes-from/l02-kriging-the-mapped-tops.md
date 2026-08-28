# Kriging the mapped tops

Four parameters turn six well tops into 900 column depths. This lesson says what each one does.

## The model

Simple kriging estimates a value at a target point as the regional mean plus a weighted sum of the residuals at the data points:

$$z(x) = \mu + \sum_i w_i \, (z_i - \mu)$$

The weights come from a covariance model that says how similar two points are as a function of the distance between them. Close points are similar; far points are not.

## The four numbers

**Range, 1200 m.** The distance beyond which two points are treated as unrelated. A well 1200 m from a cell contributes essentially nothing to it. Ekene's wells are between about 700 m and 2200 m apart, so the range is comparable with the well spacing, which is the usual choice.

**Sill, 400.** The variance the surface reaches at large separation. It scales the covariance and, on its own, it does not change the estimate at all, because it appears in both the weights and the system they solve. It matters for the uncertainty, which this deck does not carry.

**Nugget, 0.** Variance at zero separation. A zero nugget means the surface passes exactly through the data, which is the subject of the next lesson. A non-zero nugget lets the surface smooth through the wells, which is what you want when the measurements have error.

**Regional mean.** The value the surface reverts to far from any well. This is the parameter with the most leverage and the least data behind it. Module 2 shows why it was set where it was; the Expert tier does the setting, so this tier names the parameter rather than quoting it.

{{panel:sim-structure-explorer}}

The map shows the resulting surface, shaded by depth, with the wells posted. The shallow region in the middle is the structure; the deeper apron around it is the surface relaxing toward the regional mean.

## What the range does to the map

Short range: the surface hugs each well and drops to the regional mean between them, giving a bullseye around every control point.

Long range: wells influence each other, the surface is smooth and broad, and the structure looks like a single feature rather than six bumps.

At 1200 m on this well spacing the result is in between, which is what makes the map look like a plausible dome rather than either extreme.

## What the regional mean does

Everything outside the wells' reach. Set it shallow and the whole map floats up, more of the field is above the contact, and the model contains more oil. Set it deep and the structure closes tightly around the wells and the model contains less.

That is a lot of leverage for a number nobody measured, and it is exactly why module 2 exists.

## Simple against ordinary kriging

Simple kriging requires the mean as an input. Ordinary kriging estimates it from the data instead, which removes the free parameter and replaces it with an assumption that the mean is constant and knowable from six points.

Neither is more honest. Simple kriging puts the assumption in the open as a number you must supply; ordinary kriging hides it in the algorithm. This deck uses simple kriging, which means the assumption is visible and can be argued about, and module 2 argues about it.

## The misconception to avoid

"Kriging is the statistically optimal interpolator, so it needs no justification." It is optimal GIVEN the covariance model, and the covariance model is a choice with three or four free parameters that you supplied. Calling the result optimal without naming those parameters is claiming a guarantee that the maths never gave.

## Exercise

First, state which of the four parameters would change the deck's oil volume most if it were wrong by ten percent, and say why.

Second, explain in two sentences the difference between simple and ordinary kriging, and which one makes its assumption easier to audit.
