# What one spike does

A single bad reading, and a derivative that moves by a factor of ten.

{{panel:wt-diagnostic-explorer}}

## The experiment

Take the drawdown fixture, which is noise-free, and multiply ONE pressure change by 1.6. One point out of 45, at 0.6579332246575679 hours.

Recompute the Bourdet derivative with the default smoothing and compare it against the clean one, point by point.

The largest change is 988.1603135426369 percent.

## Why the amplification is so large

A derivative is a difference divided by a small denominator, and the Bourdet rule uses two of them.

The corrupted point enters as the CENTRE of its own derivative estimate, and as the left or right NEIGHBOUR of the estimates for several nearby points. So one bad value contaminates a neighbourhood, and in each contaminated estimate the error is divided by a log-time gap that is a fraction of a cycle.

Meanwhile the pressure plot itself barely moves. A 60 percent change in one pressure CHANGE at a time when the total change is small is a point slightly off the trend, which on a log-log plot of a curve spanning two decades of pressure is nearly invisible.

That asymmetry is the whole reason data preparation matters. The plot you would look at to check the data quality is the one that hides the problem, and the plot you are going to interpret is the one that amplifies it.

## The despiking filter

`trimSpikes` uses a rolling-median filter with a median absolute deviation threshold.

For each point it takes a window of neighbours, computes their median, computes the median of the absolute deviations from that median, and drops the point if it lies more than `threshold` times 1.4826 times that deviation away.

The 1.4826 converts a median absolute deviation into an equivalent standard deviation for normally distributed data, so a threshold of 6 is approximately a six-sigma rule.

On the fixture with one planted spike, it removes exactly one point, and that point is the one that was corrupted.

## Why a median filter and not a mean

A mean and a standard deviation are both dragged around by the outlier they are supposed to detect. One large spike inflates the standard deviation enough that it no longer looks like an outlier against its own contribution.

Medians are not. A single bad value in a window of five moves the median hardly at all, so the outlier is measured against a statistic it did not corrupt. That is why every robust outlier detector is built on medians.

## What it will not catch

**A drift.** A gauge slowly wandering upward is not an outlier at any point. It looks like reservoir behaviour and it is one of the hardest problems in real test analysis.

**A step.** A gauge that jumps and stays jumped is an outlier only at the jump. The points after it are perfectly consistent with each other.

**A rate change.** If the well's rate changed and nobody recorded it, the pressure response is real and self-consistent. No data filter finds it. Only the rate record does.

So despiking handles one specific and common failure, and leaves the harder ones to the interpreter.

## The habit

Plot the derivative before you interpret anything, and look at it as a data-quality check rather than as a result.

Scatter that grows towards late time is normal, because the derivative's denominator grows and the pressure changes get smaller. Isolated excursions are spikes. A derivative that is smooth over most of the record and wild over one stretch is usually a data problem in that stretch, not reservoir behaviour.

## The misconception to avoid

"The data looked fine on the pressure plot." The pressure plot cannot show you what the derivative will do, because the derivative amplifies exactly the high-frequency component the pressure plot integrates away. Judging data quality from a pressure plot and then interpreting a derivative is judging the wrong thing.

## Exercise

Take the number 988.1603135426369 percent and work out what it means in absolute terms: the clean derivative near that time is around 9 psi, so state the corrupted value.

Then say what a reader looking at the log-log derivative plot would see, and what they would conclude if they did not know a spike had been planted.
