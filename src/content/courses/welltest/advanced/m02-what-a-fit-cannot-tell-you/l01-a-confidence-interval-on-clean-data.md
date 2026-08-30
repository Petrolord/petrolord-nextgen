# A confidence interval on clean data

The number that looks like uncertainty and is not.

{{panel:wt-regression-explorer}}

## What the fit reports

Fit the homogeneous model to the buildup and the engine returns, alongside the parameters, a 95 percent confidence interval for each:

| parameter | fitted | 95 percent interval |
|---|---|---|
| permeability | 85.00000370982579 | 85.00000099863554 to 85.00000642101614 |
| skin | 6.500000554344087 | 6.500000074161036 to 6.500001034527138 |
| storage | 0.015000000255902136 | 0.01499999980108331 to 0.015000000710720976 |

The permeability interval is about five parts in a billion wide.

## Where it comes from

The standard construction. Near the minimum, the objective function is approximately quadratic in the parameters, and the curvature is estimated from the Jacobian. Invert that, scale by the residual variance, take the square root, multiply by the appropriate t value, and you have a parameter standard error.

Every step of that is correct. The result is a correct answer to the question it is asking.

## The question it is asking

"Given that this model is right, and given that the scatter of these data about the fitted model is representative of the measurement error, how precisely is each parameter determined?"

On this fixture, the scatter of the data about the fitted model is machine precision, because the data ARE the model evaluated at those parameters. So the answer is: extremely precisely.

That is not a statement about the reservoir. It is a statement about how well the optimiser converged.

## The three assumptions, and how each fails on real data

**The model is correct.** On a real test it is an idealisation. The reservoir is not exactly homogeneous, the storage is not exactly constant, and the boundary conditions are approximations. The confidence interval has no term for this and it is usually the dominant uncertainty.

**The residuals represent the measurement error.** On real data with a slightly wrong model, the residuals are dominated by model error rather than gauge noise, so the variance used to scale the interval is measuring the wrong thing.

**The inputs are exact.** Porosity, viscosity, compressibility, net pay, rate and wellbore radius all enter the answer and none of them is exact. The rate alone is often 5 percent uncertain, and permeability is proportional to it. The confidence interval says nothing about any of them.

## What to report instead

A permeability from a real well test is known to about two significant figures. That statement comes from comparing independent analyses of the same well, comparing drawdowns against buildups, and propagating the input uncertainties, not from the fit's own interval.

The useful practice is to report the fitted value, the fit's interval, and separately a range from the inputs. The two ranges are usually orders of magnitude apart, and the larger one is the one that matters.

## When the fit's interval IS informative

Two cases.

**Comparing parameters within one fit.** If the permeability's interval is a hundredth of a percent and the fault distance's is five percent, the data constrain one far better than the other, and that RELATIVE statement is meaningful even when the absolute widths are not.

**Detecting a parameter that is not determined at all.** An interval that runs to a bound, or is wider than the parameter's plausible range, says the data do not constrain that parameter. That is a genuine and useful warning.

The next lesson is a case where neither of those warnings fires and the parameter is meaningless anyway.

## The misconception to avoid

"The software reported a confidence interval, so the uncertainty has been quantified." The interval quantifies one contribution to the uncertainty, conditional on assumptions that are false on real data, and it is normally the smallest contribution by a wide margin. Reporting it as the uncertainty of a well test result overstates the precision by orders of magnitude.

## Exercise

The permeability interval above is about five parts in a billion.

Now suppose the flow rate used in the analysis was 450 stb/d but the true average rate over the test was 470. Compute the permeability that would result, and state how many of the fit's confidence intervals fit inside that difference.
