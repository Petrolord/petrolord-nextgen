# The synthetic in one lesson

A tie sets a trace built from the well beside the trace recorded at it. The Seismic Interpretation course teaches the synthetic seismogram in full; here it is recapped in the form the QI engines run it, with the Ekene-1 figures every later tie starts from.

## Five steps

1. Acoustic impedance (AI), Vp x density, from the sonic and the density (`computeImpedance`). The engine works in (m/s)(g/cc), the AI / 1000 form the Associate tier listed beside kg/(m2 s).
2. Each log sample placed in two-way time by the checkshots, linear between levels.
3. The impedance resampled to the seismic sample interval (`resampleToDt`), 4.000000 ms on the pack's traces.
4. Reflection coefficients between neighbouring samples (`reflectivity`), rc = (Z2 - Z1) / (Z2 + Z1). SEG normal polarity: an increase in impedance downwards is positive.
5. The coefficients convolved with a wavelet (`convolveSame`).

## Gaps stay gaps

A sample is a gap when it is not finite or is a seismic or LAS null. The convolution zero-fills gaps, and a convolved value whose own coefficient is a gap is not used. The synthetic is therefore live only where the logs are, and a tie compares it with the trace only on the samples both carry.

## Ekene-1 on its trace clock

| quantity | value |
| --- | --- |
| trace sample interval, ms | 4.000000 |
| first sample, ms | 900 |
| first log sample, ft | 4931.500000 |
| last log sample, ft | 5331.000000 |
| live synthetic samples | 26 |
| largest reflection coefficient | -0.190340 |
| its time, ms | 1312.000000 |
| normalised correlation with the trace at zero shift | 0.983438 |

The wavelet is the statistical wavelet of the next lesson, extracted from the same trace.

## Reading the figures

The pack's logs cover the Ekene Sand and the shale above it and little else, so the synthetic is short: 26 live samples on a 4.000000 ms clock. Every correlation this module reports is measured over those samples, so it describes the reservoir interval and says nothing about the trace above or below it.

The largest coefficient is negative. At 1312.000000 ms it sits just below the Ekene-1 checkshot at 5183.989501 ft (two-way time 1311.086000 ms), next to the base of the Ekene Sand at 5183.727034 ft, where impedance falls downwards. The top of the sand is a peak, as the Associate tier showed from the logs; the base is a trough, and on these logs it is the stronger of the two.

A correlation of 0.983438 with no shift and no rotation says the checkshots already place the synthetic close to the recorded event, and that the zero-phase wavelet already resembles the recorded one. The next three lessons test each of those in turn: the wavelet, its phase, and the shift.

## What the synthetic depends on

Three stated inputs: the logs, the checkshots and the wavelet. The reflection coefficients depend on the first two alone; they are the earth's part of the trace, and the wavelet is the seismic's part.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set View to "Wavelets and the tie" and Data to "Ekene pack: Ekene-1", with the statistical wavelet over the window 1100 to 1500 ms. Read the live synthetic samples, the largest reflection coefficient and its time, and the correlation at zero shift, and check them against the table. Then switch the wavelet to a 25 Hz Ricker and note which of those figures move and which stay put. Repeat on Ekene-2, Ekene-3 and Ekene-4 with the statistical wavelet, and write down each well's live sample count beside the span of its logs.
