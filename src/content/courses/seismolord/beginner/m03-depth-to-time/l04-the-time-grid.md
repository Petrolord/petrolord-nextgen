# The time grid

Converting a depth to a two-way time gives one number. Building a synthetic needs a fixed ladder of time values that every stage of the calculation shares. That ladder is the time grid, and in this course it is 900 samples spaced 2 ms apart.

## The grid, precisely

The grid holds 900 samples, numbered 0 to 899. Sample $i$ sits at a two-way time of $2i$ ms. Sample 0 is at 0 ms, sample 1 is at 2 ms, and the last sample, number 899, is at $2 \times 899 = 1798$ ms. The grid spans 0 to 1798 ms.

Note the last time is 1798 and not 1800. A grid of $n$ samples with spacing $\Delta t$ starting at zero ends at $(n-1)\Delta t$, because the first sample uses up a slot at time zero. Off-by-one errors at the end of a trace are common, so do that multiplication deliberately rather than assuming.

Going the other way, the sample index of a time is that time divided by 2. A reflection at 1582 ms is sample 791, and one at 1642 ms is sample 821.

## Why the spacing has to be regular

There are two reasons, one mathematical and one practical.

The mathematical reason is convolution. The synthetic is made by convolving a reflection coefficient series with a wavelet, the operation you meet later in this course. Discrete convolution slides one evenly spaced series past another and sums products at each offset, and it is only defined if both series share the same constant spacing. Hand it irregularly sampled data and there is no consistent offset to slide by, so the reflectivity has to be placed onto a regular grid before any wavelet is applied.

The practical reason is that real seismic data is recorded this way, with a fixed sample interval, typically 2 ms or 4 ms, and a fixed number of samples per trace. A synthetic meant to sit beside a real trace has to live on a compatible grid, otherwise the comparison needs an interpolation step nobody wants inside a quality check.

## What the log actually occupies

Here is the consequence you will see on screen. The teaching well is logged from 1500 m to 1650 m, which under the teaching time-depth function is 1500 ms to 1650 ms. On the grid that is samples 750 through 825, so 76 samples out of 900, a little over eight percent. Everything earlier than 1500 ms is above the top of the log, and everything later than 1650 ms out to 1798 ms is below its base. Most of the grid has no well data behind it.

The 301 log samples, spaced 0.5 m and therefore 0.5 ms apart, are resampled onto those 76 grid slots, roughly four log samples per grid sample. Depth sampling is finer than the time grid here, the comfortable direction to be in.

## Undefined is not zero

The empty part of the grid is where a careless implementation goes wrong.

The tempting move is to fill the samples outside the log with zeros. It is tidy, it plots cleanly, and it is wrong. A zero on a reflectivity series is a statement, and the statement is that there is rock there with no impedance contrast in it. That is not what you know. What you know is that you have no measurement, which is a different thing.

Filling with zeros does real damage. It manufactures a hard edge at the top and base of the log, where a genuine value sits next to a fabricated zero, and convolving a wavelet across that edge produces a reflection no rock created. It also corrupts every statistic: the strongest amplitude, the mean and the standard deviation would all be computed over 900 samples of which 824 are invented.

The engine marks those samples as gaps rather than numbers, and carries a validity flag alongside the trace. Statistics are computed only where the flag is set, so the panel's strongest synthetic amplitude, 1642 ms at 25 Hz, is the strongest among valid samples rather than all 900. On a plot the gap samples are drawn as breaks in the line rather than a flat run at zero, so the display tells the truth about where data exists.

## Quantisation, and why times are even

A time on this grid can only land on a multiple of 2 ms. There is no sample at 1583 ms, so no picked event can be reported there. Every graded time in this course is an even number of milliseconds for that reason: 1500, 1582 and 1642 are all even, and they have to be.

This is also why the capstone allows 2 ms of tolerance on the two peak times. One sample either way is the smallest distinguishable difference on the grid, so demanding better would be demanding a precision the data does not carry. The two-way time of the log top is held to a tighter 0.5 ms because it is not a grid search result; it comes straight out of the time-depth function applied to a depth, so it is exact arithmetic rather than a sample index.

Keep the distinction. Quantities read off the grid inherit the grid's resolution. Quantities computed from a formula do not.

Try it yourself: the panel below builds the synthetic from the teaching well at a frequency you choose.

{{panel:sl-synthetic-explorer}}

## Exercise

Give the grid sample index for 1500 ms, 1650 ms and 1798 ms, and the two-way time of samples 0, 750 and 899. As a self-check: the indices are 750, 825 and 899, and the times are 0 ms, 1500 ms and 1798 ms. Then state how many of the 900 samples carry log data, and explain why filling the rest with zeros would be worse than marking them as gaps.
