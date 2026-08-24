# The workflow end to end

Five modules have each handled one part of the Professional workflow. This one puts the parts back in order, so that you can run the whole thing from a well and a trace without going back through the course to remember what comes next. It also draws the two boundaries that define this tier: what the Associate tier handed you, and what you hand to the Expert tier.

## What the Associate tier built

You did not start this course with nothing. The Associate tier delivered a working synthetic and the discipline to distrust it.

It converted the sonic curve into velocity and read the density curve alongside it. It multiplied the two into an acoustic impedance log. It built a time-depth function and moved the well from depth onto a two-way time axis. It formed the reflection coefficient series from consecutive impedance samples and placed each coefficient on that time axis. It convolved that series with a Ricker wavelet to produce the synthetic trace. And it masked everything outside the logged interval as a gap rather than filling it with zeros, so that no statistic could be computed over rock nobody logged.

It also left you two fixed numbers for the teaching well that this tier keeps using. The strongest reflection coefficient is 0.017688043415546417 in absolute value at 1582 ms TWT. At 25 Hz the strongest synthetic amplitude is 0.07300488650798798 at 1642 ms TWT.

Everything above assumes those steps were done correctly, which is why the Associate tier spent a whole module on quality control. An alignment of a wrong synthetic is a wrong answer arrived at carefully.

## Step one: place the synthetic beside the observed trace

The Professional workflow begins where the Associate tier stopped. You have a synthetic and you have an observed seismic trace at the well, and the first honest statement you can make about them is that you do not yet know how they relate.

In this course the observed trace is controlled on purpose. It is the 25 Hz synthetic arriving 8 ms late. The lag is known to the engine and hidden from you, so the scan has a right answer to recover and you can check the method rather than take it on faith.

## Step two: scan for the shift

You do not slide the synthetic by eye. The scan walks every lag from minus 40 ms to plus 40 ms in one-sample steps at the 2 ms sample rate, which is 41 lags in all. At each lag it computes a normalised cross-correlation over the samples that overlap and are not gaps, and it requires at least 8 overlapping live samples before it will score a lag at all. It returns the lag with the highest correlation.

On the teaching exercise the answer is a suggested bulk shift of 8 ms, and the correlation at that shift is 1.

## Step three: read the scan curve, not only its peak

The single best number is not the whole result. The curve around the answer is symmetric, because correlating a trace with a shifted copy of itself is an autocorrelation, and that symmetry is why the correlation at the answer is exactly 1.

The curve also carries the trap this tier keeps returning to. At lag 0, meaning you never shifted at all, the correlation is 0.621742. That is not a number that looks broken. Somebody looking at a single figure and no scan would accept it, while sitting a full 8 ms wrong. Across the whole 41-lag scan the worst correlation anywhere is -0.409277, so the range the peak stands out from is wide, and it is the shape of the curve that tells you the peak is real.

## Step four: read amplitude and time with the wavelet stated

With the traces aligned you can start reading values off the synthetic, and this is where module 4 and module 5 apply.

The peak of the trace depends on the wavelet in both of its coordinates. At 15 Hz the strongest amplitude is 0.1573149710893631 at 1580 ms TWT. At 40 Hz it is 0.0362229160964489 at 1646 ms TWT. The amplitude fell as the frequency rose, which is the opposite of the usual expectation, and the time moved by 66 ms. The reflectivity behind both readings did not move at all.

So every amplitude and every peak time leaves this workflow with its frequency attached, and every pick is anchored to a coefficient you can name rather than to whatever was brightest.

## Step five: record the tie

The output of this tier is not a picture. It is four things written down together: the shift, the correlation that shift achieved, the wavelet frequency in use, and the feature you tied to described in terms of the well. The next lesson is the checklist that tests whether a record has all four.

## What this tier hands upward

The Expert tier takes two things from here. It takes a measured shift rather than an eyeballed one, because a resolution study built on a tie that is out by a wavelet cycle measures nothing. And it takes the habit of treating amplitude as a joint statement about rock and bandwidth, which is the premise its wedge and AVO work depends on.

## Exercise

Write the Professional workflow as an ordered list of steps, starting from the synthetic the Associate tier delivered and ending with the recorded tie, and name the single number that comes out of each step on the teaching exercise. As a self-check: place the synthetic against the observed trace, scan 41 lags from minus 40 ms to plus 40 ms and get a suggested shift of 8 ms, read the curve and note the correlation of 1 at that shift against 0.621742 at zero lag, then read amplitude and time at a stated frequency, and record the shift, the correlation, the wavelet and the feature tied to. Then state in one sentence what the Expert tier needs from this tier before it can begin.
