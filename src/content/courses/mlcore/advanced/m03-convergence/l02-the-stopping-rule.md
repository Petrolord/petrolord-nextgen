# The stopping rule in coefficient units

{{panel:ml-diagnose-explorer}}

Every iterative fit needs a rule for when to stop, and the rule decides what converged means. This lesson teaches the engine's logistic rule exactly as its basis states it: the fit stops when the largest absolute component of the FULL Newton step is at most `tol`, default 1.00e-10, or after `maxIter` updates, default 100. The tolerance is in coefficient units.

| case | feature scale | tol | iterations | converged |
| --- | --- | --- | --- | --- |
| the Ekene pay fit | RHOB, NPHI and RT in their log units | 1.00e-10 | 10 | true |
| rock compressibility in 1/Pa, 40 rows | largest value 8.52e-10 | 0.1 | 6 | true |
| the same compressibility rows | largest value 8.52e-10 | 1.00e-10 | 100 | false |

## The rule, word by word

The largest absolute component: the rule reads the step's entry of largest size, one entry per coefficient. The FULL Newton step: the step as solved, before any halving. At most `tol`: inclusive, so a step exactly at tol stops the fit. In coefficient units: the step is compared with tol directly, in whatever units each coefficient carries.

On the Ekene pay fit the tenth step, 1.14e-13, is the first at or below 1.00e-10, and the fit stops there with converged true. The engine's basis says it in full:

> converged when the largest absolute component of the full Newton step is at most tol 1e-10 (in coefficient units: set tol to the scale of the coefficients when features are in very small or very large units); at most maxIter 100 updates

## Why the units matter

A coefficient carries the target's unit over the feature's unit; for logistic regression, log odds per unit of the feature. A feature in very small units has a very large coefficient. The engine's own case is rock compressibility in 1/Pa over 40 rows, a feature whose largest value is 8.52e-10.

With tol 0.1 that fit converges in 6 iterations, with a compressibility coefficient of 6.83e+9 log odds per 1/Pa. At the default tol of 1.00e-10 it runs all 100 updates and returns converged false, with the engine's warning:

> did not converge in 100 updates: the last full Newton step had a largest component of 0.0000014834152759636627, above tol 1e-10

The rule compares that last step with 1.00e-10 in absolute terms, whatever the size of the coefficient it belongs to, and the step is above it, so the fit does not stop. Read the other way, a tol of 0.1 on a coefficient near 6.83e+9 is a relative 1.46e-11.

## Two remedies

The basis names the first: set tol to the scale of the coefficients when features are in very small or very large units. The second is to rescale the feature, to 1/GPa for instance, which changes the units the coefficient and its steps are measured in. Either way, quote the tol with the fit.

## Why the engine chose an absolute rule

The common alternatives are a relative rule or a column-scaled one. The engine's reasons: the full step cannot be faked by halving, and the unit is stated in the basis, where anyone can check it. The cost is the case above: on a feature in extreme units, tol is set knowingly.

## Exercise

Open the panel on the convergence view. Build a table of your own with one feature in very small units, for example a column of your values multiplied by 1.00e-9, and a 0 or 1 target that is not separated. Run it at the default tol and copy whether it converged, and any warning. Then raise tol until it converges, and write down the tol and the coefficient beside each other.
