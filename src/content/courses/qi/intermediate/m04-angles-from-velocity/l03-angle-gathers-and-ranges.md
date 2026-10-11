# Angle gathers and ranges

An offset gather turns into an angle gather sample by sample, because the velocity table gives the same offset a different angle at each time. `angleGather` does the mapping, and the bins it fills are the ranges every later AVO step reads.

## What the engine does

Every live sample of every offset goes to the bin of its Walden angle at that sample's time, with the velocity table read on the trace clock as in the RMS lesson. A bin at a sample is the mean of whatever falls in it, and it is empty where nothing does. Two kinds of sample are treated differently:

- a sample that is not finite, or is a seismic null, is skipped;
- the mute's exact zeros are live samples, and they enter the mean like any other value.

A mute zero inside a bin pulls its mean towards zero, so a study reads the mute angle and the bin edges together: a bin whose far edge passes the mute angle at the target averages reflection with zeros. On the pack's gathers the mute is at 40 degrees, and at the top of the Ekene Sand Walden's angle passes it between the 1500 m and 2000 m offsets.

## The ranges

The bins are stated as edges in degrees. The course uses edges at 5, 15, 25 and 35 degrees, which make three bins: near 5 to 15, mid 15 to 25 and far 25 to 35. The kit built its near, mid and far angle stacks over the same ranges.

## Gather 5 at the top

At 1292.000000 ms, the top picked on gather 5, the trace of Ekene-1:

| bin, degrees | fold | mean amplitude |
| --- | --- | --- |
| 5 to 15 | 2 | 483.072830 |
| 15 to 25 | 3 | 410.433207 |
| 25 to 35 | 2 | 320.449005 |

The amplitude is positive in every bin: the top is a peak, since SEG normal polarity makes an increase in impedance downwards a peak. It falls from near to far, the dimming with angle that the Associate model predicted for the oil leg under the cap rock.

Each bin is the mean of two or three traces, so one noisy trace moves it a long way. Between them the three bins hold fewer traces than the gather's 13 offsets: the rest fall at angles outside 5 to 35 degrees at this time. The usable angle in the next lesson is read from these folds.

## What changes the bins

The velocity table moves the angle each offset is given, the bin edges move which traces share a mean, and the time moves the angle of a fixed offset. A study states all three. The amplitudes are in the kit's trace units, with no physical scale: they compare across angle, and become reflection coefficients only through the one scale of the AVO at the wells module.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, open the Angles from velocity view on the Ekene pack's gather 5 with the published RMS velocity table. Set the angle bin edges to 5, 15, 25 and 35 degrees and the time to 1292 ms, and check the fold and mean amplitude of each bin against the table above. Then add a fourth bin whose far edge lies beyond the 40 degree mute and read its fold and mean: say whether it holds reflection, mute zeros or both.
