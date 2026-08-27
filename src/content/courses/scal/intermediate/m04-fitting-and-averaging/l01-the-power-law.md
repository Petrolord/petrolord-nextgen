# The power law

Module 2 gave you the collapse: three plugs from three labs reduced to one dimensionless curve. Module 3 carried a published table through the same machinery. Both times the J curve arrived as a table of points, and a table is an awkward thing to hand to the next calculation. It cannot be evaluated between its rows without a rule, it cannot be summarised in a report without printing every entry, and it cannot be compared against another well's curve at a glance.

What you want is a functional form with a small number of parameters. The engine's choice is the power law:

$$J(S_w) = a \, {S_w^*}^{-b}, \qquad S_w^* = \frac{S_w - S_{wirr}}{1 - S_{wirr}}$$

Two parameters carry the whole curve: $a$ sets the level and $b$ sets how hard the curve turns up as saturation falls toward the irreducible value. The normalized saturation $S_w^*$ runs from 0 at $S_{wirr}$ to 1 at full water saturation, so $a$ has a clean reading: it is the value of $J$ at $S_w = 1$, the entry point of the curve.

## Why the fit runs in log space

Take logarithms of both sides:

$$\ln J = \ln a - b \, \ln S_w^*$$

A power law is a straight line in log coordinates, with intercept $\ln a$ and slope $-b$. The engine's `fitJPowerLaw` exploits exactly this: it forms the residuals in $\ln J$ and runs them through the same Levenberg-Marquardt kernel the rest of the platform uses, with bounds on $b$ and a confidence interval on both parameters.

Fitting in log space is not a convenience, it is a fairness rule. A J curve spans a wide range: on the Ekene plugs it rises from 0.25 at full saturation to 3.75 at $S_w = 0.30$, a factor of fifteen. Fit in linear space and the high-J points near the irreducible end dominate the sum of squares while the plateau, where most of the reservoir actually sits, contributes almost nothing. Log residuals weight a 10 percent miss the same everywhere on the curve.

Two bookkeeping rules follow from the logarithm. Rows with $J \le 0$ are excluded, because their logarithm does not exist. And the fit needs at least 3 positive points, because two parameters fitted to fewer leave nothing to test.

## Swirr is an input, not an output

Look again at the definition of $S_w^*$. Before the fit can form a single residual it must know $S_{wirr}$, because $S_{wirr}$ is inside the coordinate. The fit does not discover the irreducible saturation; it is told it.

If you supply it, the engine checks that it sits below the lowest $S_w$ in the data, since otherwise some $S_w^*$ values would be zero or negative and their logarithms undefined. If you do not supply it, the engine defaults to a value just below the lowest data point. That default has consequences, and lesson 4 of this module is entirely about them. For now, hold the principle: the power law has three numbers in it, and only two of them are fitted.

## The fit recovers the plant

The Ekene plugs were generated from a designed curve with $a = 0.25$, $b = 1.0$, $S_{wirr} = 0.25$, so they are the cleanest possible test of the machinery: hand the fit one plug's J table together with the true $S_{wirr}$ of 0.25, and ask what comes back.

It returns $a = 0.25$ and $b = 1$ with an $r^2$ in log space of exactly 1. The plant is recovered, not approximately but to the precision of the arithmetic. This is the same discipline the decline-curve course used with its planted declines: when the data contain a known truth, the fit must return it, and any daylight between the plant and the recovery is a defect in the method, not a property of the rock.

Check one point by hand to see how readable the recovered curve is. At $S_w = 0.30$,

$$S_w^* = \frac{0.30 - 0.25}{1 - 0.25} = \frac{1}{15}, \qquad J = 0.25 \times 15 = 3.75$$

which is exactly the value the collapse produced in module 2. With $b = 1$ the curve is a pure reciprocal, and every point on it is mental arithmetic.

## When the data will not power-law

Not every rock family obeys a power law, and the engine does not pretend otherwise. Its design is deliberately thin: if your J points refuse to straighten in log coordinates, you do not reach for a heavier parametric model. There is no Thomeer machinery here, no Brooks-Corey lambda apparatus. You keep the curve as a table and hand the table itself to the downstream calculations through the tabulated spec, which interpolates between rows linearly in $\ln J$.

That is a real engineering position, not a limitation to apologise for. A tabulated curve reproduces the lab exactly and admits it has no theory; a fitted curve compresses the lab into two numbers and claims a shape. The fit's log-space $r^2$ tells you which claim your data support.

## See it in the panel

{{panel:sc-jfunction-explorer}}

Pick a single plug and leave the Swirr override at 0.25, the design value. Read the fitted a and fitted b tiles: 0.25 and 1, the plant recovered. Now try each of the other plugs in turn. The fitted parameters do not move, because all three plugs collapse to the same curve and the fit sees the same points. The lab system changed three times; the rock's dimensionless curve did not change once.

## The misconception to avoid

The tempting error is to treat a high $r^2$ as proof that the power law is the right model. It is not. A high $r^2$ in log space says the points sit near a straight line over the range you measured, nothing more. Extrapolate below the lowest measured saturation and the power law will confidently head to infinity at your assumed $S_{wirr}$, whether or not the rock agrees. The fit certifies the interpolation, never the extrapolation.

## Exercise

First, the recovered Ekene curve has $a = 0.25$, $b = 1$, $S_{wirr} = 0.25$. Compute $J$ at $S_w = 0.475$ by hand, using the fact that with $b = 1$ the curve is a pure reciprocal of $S_w^*$. Express $S_w^*$ as a fraction first.

Second, a colleague fits the same plug but supplies $S_{wirr} = 0.10$ instead of 0.25, and the fit converges with a lower $r^2$. Explain, without computing anything, why changing a number that is not fitted still changed the quality of the fit. Where in the formula did the change land?
