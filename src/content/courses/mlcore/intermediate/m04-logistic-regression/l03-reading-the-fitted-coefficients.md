# Reading the fitted coefficients

{{panel:ml-validate-explorer}}

A logistic coefficient is read on the log odds scale, in log odds per unit of its feature, holding the other features fixed.

## The fit

Logistic regression on the 210 training rows of the pay split (all ten wells, test fraction 0.3, seed 5), with RHOB, NPHI and RT, no penalty:

| term | coefficient (log odds per unit) | standard error | coefficient over standard error |
| --- | --- | --- | --- |
| intercept | 23.081681 | 14.601030 | 1.580826 |
| RHOB | -10.716404 | 5.414154 | -1.979331 |
| NPHI | -9.876360 | 15.424455 | -0.640305 |
| RT | 0.241141 | 0.038812 | 6.212972 |

## RT, as an odds ratio

The RT coefficient is 0.241141 log odds per ohm.m. Exponentiate it and one more ohm.m multiplies the odds of pay by exp(0.241141) = 1.272700, holding RHOB and NPHI fixed. Odds multiply; probabilities do not. The same extra ohm.m moves the probability a lot for a row near one half and hardly at all for a row already near 0 or 1, because the logistic curve is steep in the middle and flat at the ends. Quote the coefficient or the odds ratio, and say which.

## RHOB, and the size of a unit

The RHOB coefficient is -10.716404 per g/cm3. A whole g/cm3 is larger than the spread of bulk density on the nine sonic wells, 2.107000 to 2.734000 g/cm3, so the figure reads large. Per 0.01 g/cm3 it is -0.107164 log odds. The negative sign says that, holding NPHI and RT fixed, a denser sample has lower odds of pay, which fits a denser rock having less pore space.

## NPHI, and the standard error

The NPHI coefficient is -9.876360 per v/v with a standard error of 15.424455; the coefficient is -0.640305 standard errors from zero. On these training rows the fit cannot tell the NPHI coefficient's sign with any confidence, once RHOB and RT are in the model. The RT coefficient, at 6.212972 standard errors, is the clearest of the four.

The engine's basis gives the standard errors in its own words: "sqrt(diag((X'WX)^-1)) at the solution, W = p(1 - p)". They carry the same caveat the Associate tier attached to least squares: the formula assumes the rows are independent, and rows of one well are not. Treat the ratios as a rough guide to which coefficients are well pinned down.

## Holding the others fixed

Every reading above holds the other two features fixed. When two features tend to move together, a coefficient that holds one fixed while the other varies describes a direction the rows rarely take, and its standard error grows. How closely RHOB and NPHI move together on the pay rows is not measured in this course, so the standard error itself is the figure to read.

## Units in the logistic view

The coefficients above are in the features' own units because the model was fitted on the raw logs. Fit on standardised features and every coefficient becomes log odds per training standard deviation instead, as ridge coefficients did in the first module. The leakage module's scaler case used standardised features, which is why its RT coefficient, 3.129011 per scaled unit with a penalty of 1, sits on another scale.

## Exercise

Open the logistic view with the default pay table and features, penalty 0, fraction 0.3, seed 5. Read the RT coefficient and confirm 0.241141, and compute the odds ratio for one ohm.m. Then remove NPHI from the features and fit again. Write down the new RHOB and RT coefficients and say in one sentence why the RHOB coefficient moved.
