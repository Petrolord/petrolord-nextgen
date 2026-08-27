# Confidence intervals

A fitted number without a width is a guess wearing a lab coat. The Levenberg-Marquardt kernel under `fitCoreyToKrTable` returns, alongside each parameter, a 95 percent confidence interval estimated from the curvature of the objective at the solution, and this lesson is about how to read those intervals, what they collapse to on perfect data, and what their width buys you on real data.

## Where the interval comes from

At the minimum, the kernel examines how quickly the sum of squared residuals grows as each parameter is pushed off its best value. A parameter that can move a long way before the residuals notice is poorly determined; one that spikes the residuals immediately is locked down. Formally the kernel builds the covariance of the parameters from the Jacobian at the solution and scales it by the residual variance, then quotes plus and minus roughly two standard errors. Two ingredients therefore set the width: how much residual misfit exists to spread around, and how strongly each parameter leverages the curve where the data actually sits.

That second ingredient is worth pausing on. The water exponent $n_w$ expresses itself most strongly in the low-saturation decades of the water curve, exactly the region lesson 1's logarithm rescued from irrelevance. Fitting in log space does not only balance the residuals; it sharpens the curvature that the confidence interval is built from, which is why the log-space fit reports tighter, more honest widths for exponents than a plain fit would.

## The collapse on noise-free data

Run the fit on the Ekene plant from lesson 2 and look at the intervals:

| parameter | estimate | 95 percent interval |
|---|---|---|
| $n_w$ | 2.4999999999999996 | [2.4999999999999996, 2.4999999999999996] |
| $n_o$ | 2 | [1.9999999999999998, 2] |

The intervals have collapsed onto the point estimates. The width is zero to machine precision because the residual variance is $10^{-16}$-scale: there is no misfit to spread, so there is no uncertainty to quote. The $n_o$ interval's lower edge of 1.9999999999999998 is one representable double below 2, the same last-bit story as the estimate itself.

A collapsed interval on synthetic data is the correct answer, and it is also a warning label for reading real reports: an interval is only as meaningful as the residuals it was scaled by. If someone's core-flood fit quotes $n_w = 2.5 \pm 0.0000001$ on noisy lab points, the machinery has been fed something dishonest, most often duplicated rows or a fit to smoothed rather than raw data.

## What a wide interval tells you on real core

On genuine measurements the interval does real work. Suppose a five-point drainage set returns $n_w = 2.7$ with a 95 percent interval of [1.9, 3.5]. That is not a failed fit; it is a truthful statement that this table cannot distinguish a 2.0 rock from a 3.5 rock. Every downstream number you met in the lower tiers, the front saturation, the breakthrough time, the displacement efficiency at breakthrough, moves materially across that range, so the interval is telling you the LAB WORK is the bottleneck, not the analysis. The economic response is more points in the low-permeability decades, which is where $n_w$'s curvature lives, rather than more sophisticated fitting.

The interval also disciplines comparisons between plugs. Two samples reporting 2.3 and 2.6 are different rocks if their intervals are [2.25, 2.35] and [2.55, 2.65], and indistinguishable if both intervals span [1.8, 3.1]. Without the widths, the second case gets written up as heterogeneity; with them, it is correctly written up as measurement resolution.

## The capstone connection

The capstone grades your fitted water exponent at a tolerance of 0.001 around 2.4999999999999996. Notice what that tolerance is calibrated to: it is enormously wider than the machine-precision recovery, so any correct execution passes, and far narrower than the gap to plausible wrong answers such as a fit run with the curves accidentally swapped or the floor disabled. Grading tolerances are confidence intervals chosen by the examiner, and reading them that way tells you what distinctions an assessment is actually testing.

## The misconception to avoid

The misconception is treating the confidence interval as a property of the rock. It is a property of the rock, the sampling, and the noise, jointly. The same sand measured with more points in the informative decades returns a narrower interval around the same estimate. Quoting an exponent without its width, or comparing exponents across reports that used different fitting spaces, discards precisely the information that says whether the comparison means anything.

## Exercise

First, the noise-free fit reports the $n_o$ interval as [1.9999999999999998, 2]. Explain in two sentences why a zero-width interval is correct here rather than suspicious, and what single change to the input table would make a zero-width interval suspicious.

Second, a report quotes plug A at $n_w = 2.4$ with interval [2.3, 2.5] and plug B at $n_w = 2.9$ with interval [2.0, 3.8]. State whether the data supports calling B a different rock from A, and name the specific laboratory action that would most efficiently shrink B's interval, justifying the choice by where the exponent's information lives on the curve.
