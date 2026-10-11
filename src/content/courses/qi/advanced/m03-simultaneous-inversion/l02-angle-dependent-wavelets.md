# Angle-dependent wavelets

A far-angle stack carries less high frequency than a near one, and a different amplitude scale. The simultaneous inversion therefore takes one wavelet per angle stack. On the Ekene pack the course keeps one stated shape and measures one scale per stack: 1860.598608 at the near stack, 1305.654435 at the far.

## Why each angle needs its own

The forward model of each stack is the Fatti reflection at that stack's angle, convolved with that stack's wavelet. A far-stack wavelet with the wrong scale or shape lands its error on the parameters the far angles carry most, SI (shear impedance) and density, whose coefficients the last lesson showed are already the smallest.

## The Ekene setting

The same 25 Hz Ricker shape for every stack, scaled per stack by least squares of the Fatti synthetic of the logs, with a unit wavelet amplitude at the stack's angle, against that stack at the four wells (the course's `fattiScale`):

| stack | angle degrees | scale | samples |
| --- | --- | --- | --- |
| near | 10 | 1860.598608 | 19 |
| mid | 20 | 1679.662569 | 19 |
| far | 30 | 1305.654435 | 19 |

The scale falls from near to far, so the far stack's amplitudes are weaker per unit of modelled reflection. Each rests on 19 samples, the count of the full-stack scale, by the same pooled rule, and the scales are the course's own arithmetic outside the gated engines.

What the setting does not do is change the shape. The far stack's loss of high frequency, the first reason for a wavelet per angle, is not modelled on the pack: every stack gets a 25 Hz Ricker.

## What QI Studio does, and why the pack cannot

QI Studio extracts a wavelet per angle at every well by least squares against that well's reflectivity, then aligns and averages them across the wells (`angleWavelets`, app code). On the pack's short logs that extraction refuses.

Seismolord's well-wavelet extraction (src/pages/apps/Seismolord/lib/wellWavelet.js, petrolord-suite 5df9d9410), run at Ekene-1 on the half differences of the log of AI (acoustic impedance) in time, shows why. With its own half length of 15 samples, a 31-sample wavelet longer than the 27 logged samples, no row of the fit is complete:

> The well reflectivity is flat over the seismic at the well, so there is nothing to extract a wavelet from.

With a half length of 5:

> The log covers 16 usable samples at the well; a 11-sample wavelet needs at least 22. Shorten the wavelet or use the statistical one.

The course therefore states the shape and scales it per stack.

## What a study states

The shape and its source, the angle of each stack, each stack's scale and its sample count, and whether the shape changes with angle. On the pack that is one stated shape with three measured scales.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Simultaneous inversion by stacks" and Data to "Ekene teaching pack", with "Ricker wavelet, Hz" 25 and "Wavelet half length, ms" 40. Read each stack's angle, wavelet scale and samples. Change the Ricker to 20 Hz and read the three scales again. Write one sentence on whether a lower-frequency shape changes the near and far scales by the same amount, and what that says about using one shape for every stack.
