# A distance in standard deviations

{{panel:dq-outliers-explorer}}

The Associate tier asked whether the data are fit to use. This tier asks a different question: which values stand apart from the rest, and by which measure. The first measure is the oldest one. Take each value, subtract the mean of the series, and divide by its standard deviation. The result is a distance counted in standard deviations, and it is called the z-score.

EKENE-3's ten bottom-hole gauge temperature readings, in degF, run through `zScores` at its defaults:

| what | value |
| --- | --- |
| mean | 215.250000 |
| sample standard deviation | 8.732220 |
| entry 7, the reading | 240.100000 |
| z of entry 7 | 2.845783 |
| flags at the threshold 3 | 0 |

## The formula and its source

The engine computes z = (x - mean) / s, where s is the SAMPLE standard deviation, the one that divides by n - 1. That is how NIST/SEMATECH 1.3.5.17 defines the score. A value is flagged when its absolute z is strictly beyond the threshold, and the threshold is 3 unless the caller states another.

Read the formula as a question asked of every entry: how far from the centre is this value, in the series' own spread? A large distance in either direction counts, which is why the test is on the absolute value.

## Naming the spread

This course never writes a bare spread without its source. The spread here is the sample standard deviation of the ten readings, 8.732220 degF, and every z in the table was measured against it. Later modules build spreads from the median absolute deviation and from a window of neighbours, and name those sources too.

## What the flag says

A flag from this rule means one thing: the value sat more than three sample standard deviations from the sample mean. It does not say the reading is wrong. In this course an outlier is a value a stated rule flags, and the rule has to be named. The engine attaches the rule and a reason sentence to every flag it returns.

## The gauge reading that was not flagged

Entry 7 on the gauge is a planted glitch. The other nine readings sit between 212.300000 and 212.700000, and entry 7 reads 240.100000. Its z-score is 2.845783, and the table shows 0 flags at the threshold 3.

That result is the subject of this module: correct arithmetic, and a rule that misses a glitch anyone would circle by eye. The next three lessons explain why. One reason is the size of the sample, which sets a hard ceiling on how large any z can be. The other is that the glitch itself helped set the mean and the standard deviation it is being measured against.

## Exercise

Open the explorer on the z view with the EKENE-3 gauge readings. Confirm the mean of 215.250000 and the sample standard deviation of 8.732220. Then take entry 7, subtract the mean and divide by the standard deviation by hand, and check that you reach the 2.845783 the explorer reports. Say in one sentence which rule you would name if you reported entry 7 as flagged, and what result that rule actually gave.
