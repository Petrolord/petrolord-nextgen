# The wavelet scale

A wavelet chosen for its shape carries an arbitrary amplitude, and the forward model produces half differences of ln(AI). One number has to join them before any inversion can read a contrast: on the Ekene pack it is 769.984107, measured over 19 samples at the four wells.

## Why one number matters

The inversion reads impedance contrast from the ratio of the trace to the synthetic, in ln(AI), the log of AI (acoustic impedance), so the scale enters every contrast it returns.

## How it is measured

The scale is the one number s that makes s times the forward model of the logs match the seismic best, by least squares pooled over every well sample whose wavelet span the log covers. Pooled means one fit over the four wells together, giving one scale for the field.

A synthetic sample counts only when the log covers the whole wavelet around it; beyond the log's ends the synthetic carries no earth. On the pack's short logs that leaves few samples per well.

| quantity | value |
| --- | --- |
| wavelet | 25 Hz Ricker, half length 40 ms (21 samples) |
| peak amplitude of the unit wavelet | 1.000000 |
| scale | 769.984107 |
| samples in the fit | 19 |
| peak of the scaled wavelet | 769.984107 |

The unit Ricker's peak is 1.000000, so the scaled peak equals the scale. This is the wavelet whose synthetic tied Ekene-1 at 0.966050.

## The engine behind the figure

The scale comes from `waveletScale` in engines/qi/inversionQc.js, the same rule QI Studio runs, and it carries a golden and an independent oracle like the inversions it feeds. The inversion explorer calls that engine on the four pack wells, so the scale the panel prints and the 769.984107 above are one computation, made once.

## When the scale refuses

The engine refuses to scale when the wells overlap fewer than ten usable samples of seismic, with the message:

> The wells overlap too little seismic to scale the wavelet.

The Ekene pack clears that rule with 19 samples.

## What the scale assumes

It assumes the shape is right. The 25 Hz Ricker is a stated choice, and the scale only absorbs amplitude, so a misfit in shape stays in the residual. It assumes one scale serves the whole window and every well, and it rests on 19 samples from four wells, a number every inversion multiplies through. The third module sets one scale per angle stack by the same rule.

A study states the wavelet, its length, the wells in the fit, the sample count and the scale, and it quotes the count beside the scale every time.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "The wavelet scale" and Data to "Ekene teaching pack", with "Ricker wavelet, Hz" 25 and "Wavelet half length, ms" 40. Read the scale, the samples pooled and the two peaks. Lengthen the half length to 60 ms and read what the panel prints against QI Studio's rule of ten. Restore 40 ms, change the Ricker to 30 Hz, and write one sentence on how the scale responds to a change of shape.
