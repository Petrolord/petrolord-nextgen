# The summary panel

When the app finishes building the synthetic it prints a short summary above the traces: a handful of numbers, no commentary. The purpose of this tour is not to memorise the values but to make sure that when you read a number you know which stage of the pipeline produced it, because that is what lets you tell a real result from a bad one.

The pipeline you built across the last five modules runs in a fixed order: sonic to velocity, velocity and density to impedance, depth to two-way time, impedance to reflection coefficients, reflection coefficients convolved with a wavelet. Every panel number belongs to exactly one of those stages, and the stage tells you what could have gone wrong.

| Panel entry | Stage it comes from | Value on the teaching well |
| --- | --- | --- |
| Mean sonic velocity | DT curve only | 3145.29 m/s |
| TWT at top of log | Time-depth function | 1500 ms |
| Maximum impedance | Impedance log | 10624.96 |
| Strongest reflection coefficient | Reflectivity series | 0.017688 at 1582 ms |
| Strongest synthetic amplitude | Convolved trace | 0.073005 at 1642 ms |

## Mean sonic velocity: the earliest number

The mean sonic velocity of 3145.29 m/s comes from the DT curve alone. Nothing else has happened yet: density has not been read, no impedance has been formed, and no depth has been converted into time. The app inverts each finite DT sample into a velocity and averages those velocities over the logged interval.

Because it sits first in the chain, this number is the cleanest diagnostic on the panel. If it is wrong, everything below it is wrong too, and the fault is in the sonic curve or its units rather than anywhere later.

## TWT at the top of the log: the axis number

The panel reports 1500 ms as the two-way time of the top of the log. That value comes from the time-depth function applied to the shallowest log sample, which sits at 1500 m. It is not read off the seismic and it is not the result of any convolution. It is arithmetic on a depth.

The teaching time-depth function from module 3 makes the coincidence deliberate: a single 2000 m/s overburden gives a two-way time in milliseconds equal to the depth in metres, so 1500 m becomes 1500 ms and the base of the log at 1650 m becomes 1650 ms. That is a property of this teaching setup rather than a general rule, but it lets you hand-check every time on the panel without a calculator.

## Maximum impedance: the rock number

The maximum impedance of 10624.96 comes from the impedance log, the sample by sample product of velocity and density. The minimum over the same log is 5436.47, so the section spans roughly a factor of two from its softest sample to its hardest.

Two curves feed it, so a wrong value has two possible parents. A bad density corrupts it while leaving the mean sonic velocity untouched, which is why reading those two entries together isolates the culprit.

## The strongest reflection coefficient: the interface number

The largest reflection coefficient in absolute value is 0.017688, and it occurs at 1582 ms. This comes from the reflectivity series, formed from consecutive impedance pairs and then placed on the time axis. The app scans for the largest magnitude so that a strong negative coefficient competes on equal terms with a strong positive one; the panel reports the magnitude, and the sign is a separate question that module 4 settled.

Note where this number lives. It belongs to an interface rather than to a layer, and there is no wavelet anywhere in it. It is geology stripped of the seismic experiment.

## The strongest synthetic amplitude: the seismic number

The largest amplitude on the convolved trace is 0.073005, and it occurs at 1642 ms with the wavelet set to 25 Hz. This is the only panel entry that depends on the wavelet, which is why the frequency must always be quoted with it. Change the frequency and both the amplitude and its position change.

Two things here deserve care. The amplitude is larger than the largest reflection coefficient that produced it, because the trace at any instant is a sum of contributions from every nearby coefficient rather than a copy of one. And its time of 1642 ms is 60 ms away from the strongest coefficient at 1582 ms, which the next lessons return to.

## Why the valid window matters

The time grid the synthetic is computed on is much larger than the well. It runs from 0 to 1798 ms in 2 ms steps, 900 samples in all, while the log occupies only 1500 to 1650 ms. Everything outside that band is unknown, because no log data exists there.

The engine marks those samples as gaps rather than filling them with zeros, and the panel statistics are computed only over the live window. A zero claims that the amplitude there is zero, which is a statement about rock nobody logged. A gap claims nothing, which is the truth. Because the search for the strongest amplitude skips gaps, the reported peak must come from a part of the trace the well actually supports.

Try it yourself: the panel below builds the synthetic from the teaching well at a frequency you choose.

{{panel:sl-synthetic-explorer}}

## Exercise

For each panel entry in the table, name the stage that produced it, then say which entries would move if the density curve alone were replaced by a constant. As a self-check: the mean sonic velocity would not move, because it comes from DT alone, and neither would the TWT at the top of the log, which reads a depth; the other three would all move. Then state in one sentence why the engine masks samples outside 1500 to 1650 ms as gaps instead of zeros.
