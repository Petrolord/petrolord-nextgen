# Acquisition footprint and where to measure it

The third data question is whether the acquisition left its pattern in the amplitudes. A footprint is a periodic stripe on a slice of RMS amplitude, called one only by a stated rule. On the Ekene RMS slice the strongest stripe along the crosslines has a share of 0.015148, and by the rule there is no footprint.

## The method

The engine is footprint in seismicQc.js. On a time slice of inlines by crosslines it averages the slice along one axis to a profile, removes the profile's straight-line trend, and finds the strongest periodic stripe in a stated band of periods. It returns the period in lines, the stripe's share of the profile's variance (with its harmonics), and its prominence over the median power of the band.

Measure it on RMS amplitude. On signed seismic a stripe of gain averages away when the slice is averaged to a profile; on RMS or absolute amplitude it survives.

## The rule

QI Studio calls a stripe a footprint when three conditions hold together: a share above 0.3, a prominence of 10 or more, and at least five repeats of the period across the slice. The repeats are the cycles, the lines in the slice over the period.

## The Ekene slice, and a designed stripe

The slice is the RMS amplitude of the full stack, 1250 to 1350 ms, 128 inlines by 128 crosslines, with periods searched from 2 to 16 lines. To show what a footprint looks like, the course adds a designed teaching case: the same slice with every sixth crossline multiplied by 1.2. It is not in the Ekene data.

| slice and axis | period, lines | share | prominence | cycles | a footprint by the rule |
| --- | --- | --- | --- | --- | --- |
| Ekene, along the crosslines | 15.058824 | 0.015148 | 27.724874 | 8.500000 | no |
| Ekene, along the inlines | 13.473684 | 0.014838 | 27.074395 | 9.500000 | no |
| designed stripe, along the crosslines | 5.953488 | 0.490123 | 467.977933 | 21.500000 | yes |
| designed stripe, along the inlines | 13.473684 | 0.014803 | 26.664709 | 9.500000 | no |

The Ekene slice carries no footprint. Its prominence is in the tens, above the rule's 10, but its share is a few hundredths, far below 0.3: that is the random variation of a slice. The designed stripe is found at its period, 5.953488 lines against the six it was built with, with about half the variance, a share of 0.490123, and it passes all three conditions. The inline axis, which the stripe was not added to, keeps its period of 13.473684 lines and its share of a few hundredths.

## Where to measure it

Three choices set the answer, and a verdict names each: the slice (which time window, and RMS amplitude), the axis, and the band of periods searched. A band that stops short of a stripe's period cannot find it, and a slice of signed amplitude can hide one. The Ekene slice sits around the top of the sand, which is at TWT 1288.796378 ms at Ekene-1.

The engine refuses a slice too small to search:

> A footprint needs a slice of at least 4 by 4.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set Data to "Ekene pack: Ekene-1" and View to Seismic QC. Under the footprint controls, with "Shortest period, lines (stated)" at 2 and "Longest period, lines (stated)" at 16, read the period, share, prominence and cycles on both axes, and test each row against the three conditions of the rule. Then turn "Designed stripe every sixth crossline, gain 1.2" on and test again. Finally set the longest period to 5 with the stripe on, and explain what the search returns once the band stops short of the stripe.
