# The intercept

{{panel:ml-fit-explorer}}

The intercept is the fitted target where every feature is zero. For the teaching fit of DT on GR, RHOB and NPHI over the 180 training rows it is -0.552686 us/ft, with a standard error of 30.261214. Read literally, it says a rock with no gamma ray, no bulk density and no porosity would have a slightly negative sonic slowness. No such rock exists.

| term | coefficient | standard error | t value |
| --- | --- | --- | --- |
| intercept | -0.552686 | 30.261214 | -0.018264 |

## Why it is there anyway

No rock has a bulk density of zero, so the intercept is a point far outside the data, where the fitted plane happens to cross the zero of every feature. It is there so the plane need not pass through the origin. Without it, the plane would be forced through zero DT at zero logs, and every other coefficient would bend to make up for that forced point. With it, the plane can sit wherever the data put it.

So the intercept is a construction number: fitted, needed, and without a physical reading here. Its large standard error, 30.261214 us/ft against a coefficient of -0.552686, says the data pin it down poorly, which is what you expect of a point this far from every row.

## The intercept counts as a coefficient

The engine counts the intercept in p. Three features and an intercept are four coefficients, which is why the teaching fit has 176 residual degrees of freedom from 180 rows. The refusal for too few rows says the same thing in its own words, "the intercept included", as lesson five shows.

## Residuals that sum to zero

With an intercept, the residuals of the fitted rows sum to zero, up to rounding. On a least squares fit of all 270 sonic rows with the same three logs, they sum to -1.99e-12 us/ft. That is rounding in the arithmetic, and it means the plane is centred on the training data: it misses high as much as it misses low, in total.

It does not mean each well is centred. The same fit leaves whole wells above or below the plane, as module five shows. The intercept balances the rows it was fitted on as a whole; it knows nothing of wells.

## Scaled features, the same plane

Fitted on standardised features, the intercept changes meaning along with the coefficients: it becomes the fitted target where every feature sits at its training centre. On the one-well workflow of module six, with EKENE-8 held out, the standardised fit reads 105.119167 us/ft for the intercept. The predictions are the same as the raw fit's up to rounding, 1.42e-14 us/ft at most. Only the reading of the numbers changed.

## Reading an intercept in a report

Quote it with its unit and its standard error, and read it as a property of the rock only where zero is a value every feature can really take. For well logs that is almost never.

## Exercise

Open the fit explorer on the least squares view with its defaults and read the intercept row: coefficient, standard error and t value. Check them against the table above. Then change the features to GR alone and read the new intercept. Write one sentence saying what that intercept means, and one saying why it is not a property of any rock in the Ekene field.
