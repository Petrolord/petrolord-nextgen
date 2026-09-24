# Standardised and original units

{{panel:ml-validate-explorer}}

A least squares coefficient carries the target's unit over the feature's unit. On the teaching split the Associate fit moved DT by 0.288005 us/ft per gAPI of gamma ray and by 138.783590 us/ft per whole v/v of neutron porosity. Those two numbers cannot be compared by size: a gAPI and a whole v/v are different quantities, and a penalty that charged both coefficients the same price per unit of size would charge each feature according to the unit someone chose to record it in.

## Why ridge standardises first

Ridge charges lambda x sum b_j^2, a single price for every coefficient. To make that price fair, the engine standardises every feature before it fits: it subtracts the training mean and divides by the population standard deviation (dividing by n) of the rows passed. After that step every feature has the same spread, and a coefficient reads as the change in DT for one training standard deviation of its feature. Now the penalty treats every feature alike, whatever unit the log was recorded in.

The Associate tier found that least squares with an intercept gives the same fitted plane under any rescaling of a feature. The penalty is where that stops being true. Scale a feature by a thousand and its coefficient shrinks by a thousand, so its share of the penalty changes. That is why the scaling is part of the model.

## The standardised coefficients

On the 180 training rows of the teaching split (test fraction 0.3, seed 5), with the three logs and the four attributes, the engine returns these coefficients per training standard deviation of each feature:

| term | lambda 0 | lambda 10 | lambda 100 |
| --- | --- | --- | --- |
| intercept | 105.883333 | 105.883333 | 105.883333 |
| GR | 7.109316 | 6.235322 | 3.972291 |
| RHOB | 2.794047 | 2.976936 | 2.453848 |
| NPHI | 4.748874 | 4.404522 | 2.257166 |
| easting | 8.680036 | 3.454502 | 0.098385 |
| northing | 4.173548 | 1.510277 | -0.274348 |
| kb | -5.095543 | -3.502338 | -1.782262 |
| mudWeight | 8.884278 | 4.243369 | 1.045997 |

Every coefficient here is in us/ft, because every feature is now in standard deviations. The first row is the intercept in standardised space, and the next lesson reads it.

## Back to original units

The engine also reports every coefficient in the feature's own unit, and its basis states the conversion in its own words: "b_j / sd_j, intercept mean y - sum b_j mean_j / sd_j". Divide a standardised coefficient by the training standard deviation of its feature and you have DT per gAPI, per g/cm3 or per v/v again. The intercept is rebuilt from the training mean of y and the training means of the features.

At lambda 0 the penalty is gone and ridge is least squares. The engine's ridge coefficients in original units at lambda 0 agree with `ols` on the same rows to a largest relative difference of 3.44e-16, which is rounding.

## Which unit to quote

Quote the standardised coefficient when you compare features inside one fit, or when you watch the penalty shrink them. Quote the original-unit coefficient when someone will apply it to a log, and name the unit every time. A ridge coefficient quoted without saying which of the two it is cannot be checked.

## Exercise

Open the ridge view on the teaching split with the seven default features and lambda 10. Read the GR row, which shows both the original-unit and the standardised coefficient. Then open the fit explorer's scaling view on the same training rows and read the population standard deviation of GR. Divide the standardised coefficient by it and confirm that you reach the original-unit figure the ridge view prints.
