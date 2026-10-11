# The convolutional model and its adjoint

Every inversion in this tier runs one operator that turns an impedance log into a seismic trace, and then runs it backwards. The operator and its transpose both have to be exact. On the Ekene pack its output at Ekene-1 correlates with the recorded full stack at 0.966050 over 27 logged samples.

## The model

The unknown is m = ln(AI), the natural log of AI (acoustic impedance), on the trace clock. The engine's `forwardPoststack`, the operator of pylops' PoststackLinearModelling with kind centred, applies two steps:

1. D, the centred first difference: (D m)_i = (m_(i+1) - m_(i-1)) / 2, zero at the first and last sample.
2. C, the centred convolution with the wavelet, offset by the floor of half its length.

The trace is d = C D m. Half the difference of ln(AI) is close to the reflection coefficient for small contrasts, which is why the model is written in ln(AI). The Seismic Interpretation course builds the synthetic seismogram in full; here the same idea is a linear operator a solver can invert.

## Why the adjoint matters

A least squares solver applies the operator forwards and its transpose, the adjoint, backwards at every step; a wrong transpose solves a different problem. The test is the dot product: for any x and y, (A x) . y equals x . (A^T y). The course runs it on two seeded vectors of 101 samples, mulberry32 seed 42:

| operator | (A x) . y | x . (A^T y) | difference |
| --- | --- | --- | --- |
| centred difference D | -0.753789 | -0.753789 | 0.000000 |
| centred convolution C with the scaled wavelet | 38.991017 | 38.991017 | 0.000000 |

Both pairs agree to the six decimals printed, so both operators pass.

## At Ekene-1

The ln(AI) log at Ekene-1 in time, held at its first and last values beyond the logged samples, through the scaled wavelet of the last lesson of this module, round the top of the Ekene Sand at 1288.796378 ms:

| time ms | ln(AI) log | synthetic | full-stack trace |
| --- | --- | --- | --- |
| 1272.000000 | 15.353633 | -116.583585 | -126.054001 |
| 1280.000000 | 15.368369 | 13.435099 | -8.919362 |
| 1288.000000 | 15.359233 | 344.213395 | 341.516846 |
| 1296.000000 | 15.810831 | 137.874591 | 258.968262 |
| 1304.000000 | 15.512999 | -267.168500 | -268.438965 |
| 1312.000000 | 15.380870 | -223.202416 | -352.980957 |

The rise in ln(AI) between 1288 and 1296 ms is the top of the sand, harder than the shale above it, and the trace peaks at 1288 ms as SEG normal polarity predicts. The synthetic matches the trace closely at 1288 and 1304 ms. At 1296 and 1312 ms the trace is larger in size than the synthetic: there the operator, the stated Ricker and the one scale do not explain the seismic.

## What the correlation says

Over the logged samples the synthetic and the trace correlate at 0.966050 (27 samples). It is the evidence that d = C D m with this stated wavelet describes the full stack at Ekene-1, with one wavelet, one scale and one angle for the whole window; the third module adds the angles. A correlation is blind to a misfit in amplitude, and 27 samples is a short base. Beyond the logged samples the log is held flat, so the synthetic there says nothing about the earth.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to the forward model, Data to the Ekene pack, Well to Ekene-1, the window to 1100 to 1500 ms and the wavelet to the 25 Hz Ricker with its scale. Run the dot-product test and check both differences. Read the log, the synthetic and the trace round 1288 ms, and the correlation over the logged samples. Repeat at Ekene-3 and write one sentence on whether its tie is better or worse than Ekene-1's, and at which samples they differ.
