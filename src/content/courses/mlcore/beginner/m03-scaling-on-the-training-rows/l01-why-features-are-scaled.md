# Why features are scaled

{{panel:ml-fit-explorer}}

The three Ekene logs live on very different scales. Over the 180 training rows of the teaching split, gamma ray spreads over tens of gAPI, bulk density over tenths of a g/cm3 and neutron porosity over hundredths of a v/v, as the table shows. A standard scaler puts every feature on one footing: it subtracts a centre and divides by a scale, z = (x - centre) / scale, so each feature has centre 0 and scale 1 on the rows it was fitted on.

| feature | centre, training rows | scale, training rows (population SD) |
| --- | --- | --- |
| GR | 59.844500 | 22.375203 |
| RHOB | 2.391150 | 0.142322 |
| NPHI | 0.255072 | 0.033503 |

## What a scaled value says

After scaling, a value reads in training standard deviations from the training centre. The first test row of the teaching split, sonic row 90, is EKENE-4 at 7966 ft, with GR 48.200000, RHOB 2.348000 and NPHI 0.243000. The training scaler turns it into z = -0.520420, -0.303186 and -0.360332. All three logs of that row sit a little below their training centres, and the three numbers can now be compared directly, which the raw values could not be.

## Scaling does not move a least squares prediction

Take the one-well workflow of module six: EKENE-8 held out, eight wells trained, 240 rows. Fit least squares on the raw logs, then again on standardised logs. The coefficients change completely, because they change units: on standardised features they are in us/ft per training standard deviation, 105.119167, 6.898926, 2.402069 and 4.610720 for the intercept, GR, RHOB and NPHI. The predictions for the held-out well differ between the two fits by at most 1.42e-14 us/ft, which is rounding. Least squares with an intercept gives the same fitted plane under any rescaling of a feature.

So for this tier's model, scaling changes how the coefficients read and leaves the predictions alone.

## Then why scale at all

Three reasons, all of them real.

First, a coefficient on standardised features says how far the target moves for one training standard deviation of the feature, so the sizes of the coefficients can be set side by side. A coefficient in raw units cannot be compared that way: its size says nothing until the feature's own spread is known.

Second, other fits are not indifferent to scale. The Professional tier adds fits whose answers depend on it, and the scaling habits built here carry straight over.

Third, a scaler is a small fitted model in its own right. It has parameters, a centre and a scale per feature, fitted on some rows and applied to others. That makes it subject to the same rule as any model: fit it on the training rows only. The rest of this module is about that rule and what it catches.

## The scaler's two numbers

The centre is the mean of the training rows. The scale is their standard deviation, and this engine divides by n, the population standard deviation. The next lesson explains that choice and its alternative.

## Exercise

Open the fit explorer and choose the view for scaling fitted on the training rows. It opens on the sonic rows, the features GR, RHOB and NPHI, the test fraction 0.3 and the seed 5. Check each centre and scale against the table above. Change the seed to 2 and write down the new centres and scales. Say in one sentence why they moved, naming the rows the scaler was fitted on each time.
