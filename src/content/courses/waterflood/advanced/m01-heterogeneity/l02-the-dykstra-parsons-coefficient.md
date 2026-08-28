# The Dykstra-Parsons coefficient

Before you can predict what a layered column does, you need one number describing how layered it is. The Dykstra-Parsons permeability variation coefficient $V$ is that number, and it is the standard currency for reservoir heterogeneity.

## The definition

Order the permeabilities from largest to smallest and plot them on log-probability paper against the fraction of samples with a LARGER permeability. If the distribution is log-normal, the points fall on a straight line. Then

$$V = \frac{k_{50} - k_{84.1}}{k_{50}}$$

where $k_{50}$ is the median and $k_{84.1}$ is the permeability at one standard deviation below it on the fitted line.

$V = 0$ means every layer has the same permeability. $V$ approaching 1 means extreme heterogeneity. Typical reservoir sands run 0.5 to 0.8, and above 0.8 a waterflood is in serious trouble.

## The form the engine uses

For a log-normal distribution the definition reduces to a clean expression. If $\ln k$ has standard deviation $\sigma$, then $k_{84.1} = k_{50} e^{-\sigma}$ and

$$\boxed{V = 1 - e^{-\sigma}}$$

so computing $V$ reduces to fitting $\sigma$.

The engine does that by least squares. It sorts the permeabilities descending, assigns each the plotting position $(i + 0.5)/n$, converts that to a standard normal quantile $z_i$, and regresses $\ln k_i$ against $z_i$. Because $\ln k$ decreases as the probability increases, the fitted slope is $-\sigma$, and the intercept is $\ln k_{50}$.

## Why $(i + 0.5)/n$

The plotting position is a convention and there are several in use: $i/n$, $(i - 0.5)/n$, $i/(n+1)$. They differ at the ends of the distribution, which is exactly where a small sample has its extreme values, so on five layers the choice matters.

The engine uses $(i + 0.5)/n$ with a zero-based index, which puts the first point at $0.5/n$ and the last at $(n - 0.5)/n$, symmetric about the median and never at 0 or 1 where the normal quantile is infinite. That is a reasonable choice and it is a choice: a $V$ computed with a different plotting position on the same five layers will differ in the second decimal.

Quote the plotting position with a $V$ from a small sample, or expect to be unable to reproduce someone else's.

## The normal quantile

Converting a probability to a standard normal quantile requires the inverse normal cumulative distribution, which has no closed form. The engine uses Acklam's rational approximation, with a stated absolute error below $1.15 \times 10^{-9}$.

You can see that error. The exact quantile of 0.841344746068543 is 1 by construction, and the approximation returns

$$1.000000000927422$$

The discrepancy is in the ninth decimal, exactly as advertised. It is far below anything that matters for a permeability fit, and it is worth having looked at once, because it tells you the precision floor of every $V$ this engine computes.

Useful anchors: the quantile of 0.1 is $-1.2815515641401563$, of 0.5 is 0, and of 0.9 is $+1.2815515641401563$. The function is antisymmetric about 0.5 and returns NaN outside the open interval.

## What the fit needs

At least three positive permeabilities. With two, a straight line through two points fits perfectly and $\sigma$ is meaningless, so the engine returns an error: "Need at least 3 positive permeabilities."

Three is a floor, not a recommendation. A $V$ from three layers is a two-parameter fit to three points and its uncertainty is enormous. Real Dykstra-Parsons analyses use core plug data, often hundreds of points, and the layer model is then built from the fitted distribution rather than the other way round.

## A homogeneous set

Feed the engine five identical permeabilities and it returns

$$V = 2.220446049250313 \times 10^{-16}, \qquad \sigma = 2.3161368858287795 \times 10^{-16}$$

not a hard zero. That is machine epsilon from the least squares arithmetic, and the engine explicitly clamps small negative $\sigma$ values to zero so that floating point noise cannot produce a negative variation.

Report that as $V = 0$. Record the raw value. Do not chase the last digit.

## The misconception to avoid

"$V$ measures the reservoir's heterogeneity." It measures the spread of whatever permeability sample you fed it, on an assumption of log-normality, with a chosen plotting position. Feed it core plugs and you get plug-scale heterogeneity; feed it layer averages and you get layer-scale heterogeneity, and the two are different numbers for the same rock. Say which scale your $V$ is at.

## Exercise

First, a formation has $\sigma = 1.0$ for its log permeability. Compute $V$, then compute the ratio $k_{50}/k_{84.1}$, and state in one sentence what that ratio means physically.

Second, using the engine's plotting position, write out the five probabilities and the five normal quantiles for a five-layer set, and confirm they are symmetric about zero.
