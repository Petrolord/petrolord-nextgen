# Angle-dependent wavelets

A far-angle stack carries less high frequency than a near one, and a different amplitude scale. The simultaneous inversion therefore takes one wavelet per angle stack. On the Ekene pack the course keeps one stated shape and measures one scale per stack: 1860.598608 at the near stack, 1305.654435 at the far.

## Why each angle needs its own

The forward model of each stack is the Fatti reflection at that stack's angle, convolved with that stack's wavelet. Each stack's wavelet is a stated input of the solve, so its scale and shape are stated beside the result. SI (shear impedance) and density have the smallest coefficients of the three, as the last lesson showed.

## The Ekene setting

The same 25 Hz Ricker shape for every stack, scaled per stack by least squares of the Fatti synthetic of the logs, with a unit wavelet amplitude at the stack's angle, against that stack at the four wells (the course's `fattiScale`):

| stack | angle degrees | scale | samples |
| --- | --- | --- | --- |
| near | 10 | 1860.598608 | 19 |
| mid | 20 | 1679.662569 | 19 |
| far | 30 | 1305.654435 | 19 |

The scale falls from near to far, so the far stack's amplitudes are weaker per unit of modelled reflection. Each rests on 19 samples, the count of the full-stack scale, by the same pooled rule, and the scales are the course's own arithmetic outside the gated engines.

What the setting does not do is change the shape. The far stack's loss of high frequency, the first reason for a wavelet per angle, is not modelled on the pack: every stack gets a 25 Hz Ricker.

## The engine QI Studio runs, on short logs

`extractAngleWavelets` (engines/qi/angleWavelets.js) extracts a wavelet per angle at every well by least squares against that well's Fatti reflectivity, then aligns and averages them across the wells. On the pack its reach is set by the wavelet length. Run at Ekene-1 on the half differences of the log of AI (acoustic impedance) in time, the well-wavelet fit underneath, with its own half length of 15 samples, wants a 31-sample wavelet longer than the 27 logged samples, so no row of the fit is complete:

> The well reflectivity is flat over the seismic at the well, so there is nothing to extract a wavelet from.

With a half length of 5:

> The log covers 16 usable samples at the well; a 11-sample wavelet needs at least 22. Shorten the wavelet or use the statistical one.

At a half length of 3 the engine returns a 7-sample wavelet for each stack. At the far stack:

| well | fit correlation | synthetic against the stack |
| --- | --- | --- |
| Ekene-1 | 0.940659 | 0.927864 |
| Ekene-2 | 0.942311 | 0.613638 |
| Ekene-3 | 0.947310 | 0.910855 |
| Ekene-4 | 0.967385 | 0.603319 |

A 7-sample wavelet spans 24.000000 ms, shorter than the stated Ricker, so the course states the Ricker shape and scales it per stack for the inversions.

## What a study states

The shape and its source, the angle of each stack, each stack's scale and its sample count, and whether the shape changes with angle. On the pack that is one stated shape with three measured scales.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Simultaneous inversion by stacks" and Data to "Ekene teaching pack", with "Ricker wavelet, Hz" 25 and "Wavelet half length, ms" 40. Read each stack's angle, wavelet scale and samples. Change the Ricker to 20 Hz and read the three scales again. Write one sentence on whether a lower-frequency shape changes the near and far scales by the same amount, and what that says about using one shape for every stack.
