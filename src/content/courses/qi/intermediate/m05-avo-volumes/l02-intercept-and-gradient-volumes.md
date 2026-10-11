# Intercept and gradient volumes

An intercept volume and a gradient volume are the Shuey fit of the last lesson run at every sample of every trace of the angle stacks. Each sample of the near, mid and far stacks gives one A and one B, and the two volumes hold them on the same grid as the stacks. QI Studio runs the fit on its seismic worker over the whole survey; the prestack explorer runs the same `fitShuey` on the pack's traces and gather.

{{video:qi-e13}}

## What a sample of each volume is

At a sample, the fit reads the three stack amplitudes at their stated angles and returns A and B. Where a stack has no finite amplitude, that angle drops out of the fit, so a gap in a stack changes what the volumes at that sample rest on.

The volumes are in trace units, like the stacks. An A becomes a reflection coefficient only through the one scale over every well.

## The volumes at the four wells

At each well the top is picked on the near stack trace within 8 ms of its checkshot time, and the near, mid and far traces at that sample are fitted with two terms at 10, 20 and 30 degrees:

| well | checkshot top ms | picked ms | seismic A | seismic B |
| --- | --- | --- | --- | --- |
| Ekene-1 | 1288.796378 | 1292.000000 | 486.838592 | -1072.562182 |
| Ekene-2 | 1305.746335 | 1304.000000 | 499.174430 | -772.839743 |
| Ekene-3 | 1282.159191 | 1284.000000 | 470.308887 | -1249.098330 |
| Ekene-4 | 1329.290304 | 1328.000000 | 527.903525 | -894.546352 |

Every well has a positive A and a negative B: a peak that dims with angle. The intercepts run from 470.308887 at Ekene-3 to 527.903525 at Ekene-4, and the gradients from -772.839743 at Ekene-2, the least negative, to -1249.098330 at Ekene-3, the most.

At Ekene-1 the volume reads A 486.838592 from the kit's stack traces, where the gather's own partial stacks gave 501.873676 at the same time. The two come from different stacks of the same rock, and the angle stacks module showed the kit's far trace falling further than the gather's. A volume is only as good as the stacks under it.

## The pairs a volume makes

Over a window, the A and B of every sample are pairs on a crossplot. On gather 5, the two-term fit at every sample of the gather window where all three bins carry data gives 176 (A, B) pairs. Together they define the background the next lesson fits.

## What the volumes state

A pair of volumes inherits every choice under the fit: the stacks, their ranges and angles, the number of terms, the velocity table and any conditioning applied to the stacks. A study states them once for the volumes.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "AVO at the wells". Set Mean angle of near, mid and far to 10, 20, 30 and Pick half window to 8 ms, and read the seismic A and B at each well against the table. Then set View to "Shuey fit and the background trend", on gather 5 with bin edges 5, 15, 25, 35, mean angles 10, 20, 30, two terms and Sample time 1292 ms. Read the (A, B) pairs tile, and find the top's point, drawn in red, in the cloud on the chart.
