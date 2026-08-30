# The smoothing window

Sweeping L on clean data, and what that tells you about what L is for.

{{panel:wt-diagnostic-explorer}}

## The sweep

Take the drawdown fixture, which is noise-free, and compute the Bourdet derivative at five smoothing windows. Read the derivative at the last point:

| L (cycles) | derivative at the last point (psi) |
|---|---|
| 0 | 9.380040795750565 |
| 0.1 | 9.384088896980504 |
| 0.2 | 9.388753188238173 |
| 0.3 | 9.394136703508291 |
| 0.5 | 9.407586754419164 |

The whole sweep, from no smoothing to heavy smoothing, moves the answer by less than three tenths of a percent.

## What that means

On clean data the smoothing window does almost nothing, and what little it does is a slight upward bias as L grows, because a wider window reaches further back into the transition and averages a little of it in.

So L is not an accuracy parameter. It is a noise parameter. Its whole purpose is to suppress the amplification of gauge noise, and on data with no noise there is nothing for it to do.

That is worth knowing for two reasons. It means the derivative plots in this course are not sensitive to a choice you might worry about, and it means that on REAL data, where L matters a great deal, any sensitivity of the answer to L is telling you about the noise rather than about the reservoir.

## Choosing L on real data

The practical procedure is to start at 0.1 and increase until the derivative is readable, and no further.

The failure modes at each end are distinct.

**Too little smoothing** gives a scattered derivative in which the plateau cannot be located. It is obvious and it is not dangerous, because nobody reads a result off a hedge.

**Too much smoothing** gives a clean derivative that has had its features rounded off. A short radial plateau can be smoothed into the transitions on either side of it and disappear. A dual-porosity dip can be filled in. A fault's doubling can be turned into a ramp.

The second is the dangerous one, because the result looks better. A derivative plot that has been smoothed until it is pretty has been smoothed too far.

## The signature of over-smoothing

Two checks.

Compare the derivative plateau against the semilog slope from the same window. They should be in the ratio of 70.6 to 162.6, that is, the plateau should be about 0.434 of the slope in psi per cycle. If the plateau is lower than that, features have been flattened.

Sweep L and look at the FEATURES rather than the plateau. A real feature moves very little as L changes. A feature that appears at L = 0.3 and is absent at L = 0.1 is smoothing, and a feature that is present at 0.1 and gone at 0.3 has been destroyed.

## The panel

The panel above lets you change L on any of the seven fixtures. Do the sweep on the dual-porosity test rather than on this one: the dip is a real feature with a limited extent in time, and it is the shape most vulnerable to over-smoothing.

Note what happens to the dip's DEPTH as L grows, and then look at the dip ratio the panel reports. That number is a graded capstone field at the default L, and its sensitivity to L is a good reason for the capstone to state the setting.

## The misconception to avoid

"A smoother derivative is a better derivative." A derivative is an estimate of a physical quantity, and smoothing trades variance for bias. On noisy data that trade is worth making; on clean data it costs bias for nothing. The right L is the smallest one that makes the plot readable, and the honest report states which one was used.

## Exercise

Open the panel on the dual-porosity test and record the derivative minimum at L = 0, 0.1, 0.3 and 0.5.

State the direction the dip moves as L increases, explain the mechanism in one sentence, and say what that implies about reporting a storativity ratio estimated from a dip depth.
