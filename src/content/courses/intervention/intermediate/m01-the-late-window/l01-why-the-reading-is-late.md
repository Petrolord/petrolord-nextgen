# Why the reading is late

A Chan reading is not a reading of a history. It is a reading of the part of the history somebody decided was late enough to count.

{{panel:pd-channel-explorer}}

## The classifier keeps the last samples and drops the rest

`chanDiagnosis` sorts the history by time and keeps a trailing fraction of the sample count, `lateFraction`, whose default is 0.5. The four published histories in the golden are 40 samples each, running from 10.000000 to 3000.000000 days over a span of 2.477121255 log cycles. The default window on all four is the last 20 samples and it starts at t = 186.345364 days, which is exactly the window the independent oracle reads them on.

The rule is arithmetic on the sample count. It does not look for a straight portion of the plot, does not test for a rate change, and reports nothing about which samples it used beyond that one start time.

## What the early samples do to the answer

Teaching well ELELENWO-4 is 38 samples from 15.000 to 3600.000 days, a case this wave built and not a published one. Fit its derivative over everything and fit it over the default late half, and the same 38 samples give two answers.

| Window | Starts at, days | Points fitted | Derivative slope | Fit quality, fraction | Mechanism |
| --- | --- | --- | --- | --- | --- |
| the whole history, lateFraction 1.00 | 15.000000 | 34 | 1.229355999 | 0.994988494 | displacement |
| the default late half, lateFraction 0.50 | 250.242976 | 15 | 1.442132492 | 0.998513658 | channelling |

Not one datum changed between those rows. The threshold that separates the two mechanisms is a `channellingSlope` of 1.3, and the two windows land on opposite sides of it.

## Why lateness is the point at all

Early production carries cleanup, rate changes and the approach to boundary-dominated flow, and none of that is the mechanism. The engine encodes that intention as a fraction and stops there, so lateness is asserted by the caller rather than found in the data.

## The mistake

Writing down "the Chan slope" and not the window it came off. Two careful analysts hand in 1.229355999 and 1.442132492 from one series and the module returns displacement for one and channelling for the other. A slope without its window is not a measurement of the well.

## What it refuses

A history shorter than six samples is refused outright. On a five sample history the return is ok = false, mechanism indeterminate, every slope n/a, and the error reads: "A Chan reading needs a history, not a handful of points. Six producing samples is the bare minimum and a useful reading wants far more."

Nothing refuses a window. Any fraction is accepted and the reading proceeds.

## Exercise

Read the teaching well in the panel at the default and again at lateFraction 1.00. Record both derivative slopes and both mechanisms.

Then say, in one sentence, which samples the wider window adds and why adding older data pulled the slope down rather than up.
