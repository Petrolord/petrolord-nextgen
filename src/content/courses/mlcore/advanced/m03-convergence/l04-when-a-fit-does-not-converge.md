# When a fit does not converge

{{panel:ml-diagnose-explorer}}

A logistic fit that reaches maxIter before its full Newton step falls to tol has not converged. The engine returns the result it has, with `converged` false and a `warning`. This lesson reads such a result on the Ekene pay fit.

| pay fit, RHOB, NPHI and RT on the training wells | maxIter 3 | maxIter 100, the default |
| --- | --- | --- |
| converged | false | true |
| iterations | 3 | 10 |
| RT coefficient (log odds per ohm.m) | 0.196989 | 0.241141 |
| largest component of the last full Newton step | 5.791631 | 1.14e-13 |

## A warning is not a refusal

A refusal returns `error` and `field` and no coefficients. A fit that stops early is different in kind: the inputs were fine, and the engine was allowed three Newton updates and no fourth. So it returns every field a fitted model carries, coefficients, standard errors and the trace, and adds `converged` false and a warning:

> did not converge in 3 updates: the last full Newton step had a largest component of 5.791630774699914, above tol 1e-10

The figure to reason with is the trace field for the third iteration, 5.791631 at six decimals, the same full step the converged fit took at its third iteration: same data, same start, same steps.

## What the numbers are

After 3 updates the RT coefficient is 0.196989 log odds per ohm.m. At convergence it is 0.241141. The early value is an iterate, a point on the way: its last full step, 5.791631 at its largest component, is far above tol, and the steps after it were never taken. It estimates nothing. The log likelihood at that point, -25.899408, is below the -24.507027 the converged fit reaches.

The standard errors are computed at the iterate too, and they carry no more meaning than the coefficients.

## What to do with a warning

Read the warning first, before any coefficient. Then find out why the fit stopped. This course has shown two reasons, each with its own remedy, and a place to look when neither fits:

* maxIter was set too low for the problem, as here: raise it and refit.
* The features are in extreme units, so the default tol in coefficient units cannot be met: set tol to the scale of the coefficients, or rescale the feature, as the second lesson of this module showed on the compressibility case, which ran all 100 updates at the default tol.
* When neither fits, look at the halvings in the trace, at the conditioning of the features, and at the separation the engine reports.

Never report a coefficient from a fit with `converged` false as if it were fitted. If you must report one, report it as the iterate after a stated number of updates, with the warning beside it.

## Why the engine warns and returns

A refusal is for a question with no answer from these inputs: a separated label, a design beyond the refusal limit, a missing value. A fit that stops early has an answer the engine did not reach. The iterate, the warning and the trace show how far it got, which is what you need to choose a remedy.

## Exercise

Open the panel on the convergence view with the pay rows of the training wells, the 210 rows left after deleting EKENE-3, EKENE-5 and EKENE-7. Set maxIter to 3 and run it. Confirm converged false, the RT coefficient 0.196989, and copy the warning. Then set maxIter to 4, run it again, and write down the RT coefficient and the largest component of the last full step.
