# One scale over every well

The seismic gives intercept and gradient in trace units; the logs give them as reflection coefficients. Before the two can be compared they need one tie, and QI Studio's comparison at the wells fits a single least-squares scale over every well, A and B together. The prestack explorer runs the same comparison on the four Ekene wells.

{{video:qi-e14}}

## The two sides of the comparison

**Modelled.** At each well, the cap rock over the oil leg, as the Associate tier built it, with Shuey's intercept and gradient of that interface. Where a well has no oil leg the cap rock sits over its net sand. Ekene-2 and Ekene-4 have no oil leg: their top of the Ekene Sand lies below the oil-water contact at 5118.110236 ft, so all their net sand is water leg.

**Seismic.** The top picked on the near stack trace within 8 ms of the well's checkshot time, the near, mid and far stack traces read at that sample, and two Shuey terms fitted at 10, 20 and 30 degrees, as in the intercept and gradient volumes lesson.

| well | modelled from | modelled A | modelled B | seismic A | seismic B |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | oil leg | 0.170742 | -0.563558 | 486.838592 | -1072.562182 |
| Ekene-2 | net sand | 0.210627 | -0.501240 | 499.174430 | -772.839743 |
| Ekene-3 | oil leg | 0.194681 | -0.641524 | 470.308887 | -1249.098330 |
| Ekene-4 | net sand | 0.216991 | -0.520090 | 527.903525 | -894.546352 |

## The scale

scale = sum(observed x modelled) / sum(modelled^2)

The sums run over every well and over A and B together. It is the least-squares factor that carries the modelled column onto the seismic one. Over the four Ekene wells:

| quantity | value |
| --- | --- |
| wells | 4 |
| one scale, trace units per unit reflection coefficient | 1882.216944 |

The scale is positive, so the seismic and the model agree in sign: a peak on the seismic is a positive reflection coefficient, as SEG normal polarity says it should be. QI Studio raises a high issue for a negative scale, because a negative scale means the seismic is reversed against the model, a polarity or wavelet problem.

## Why one scale

A scale fitted per well would fit each well's seismic to its own model alone, and hide much of the difference the comparison is for. One scale over every well ties the trace units to reflectivity once, for the survey, and leaves each well free to disagree. The gradients weigh heavily in the sums because they are the larger numbers in both columns, so the scale leans on how well the seismic gradients match the modelled ones.

The scale is also what turns any seismic A and B into reflection coefficients elsewhere in the course: the fluid factor lesson divided the top of gather 5 by this figure before computing the contrasts.

## What the scale rests on

Every choice on both sides moves it: the cut-off, the cap rock thickness and the contact that built the modelled layers, and the pick window, the stacks, the angles and the number of terms on the seismic side. A study states them all, and quotes the scale with the wells it was fitted over.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, open the AVO view, choose AVO at the wells and the Ekene pack's four wells, with two terms at 10, 20 and 30 degrees and the pick window at 8 ms. Check the modelled and seismic A and B at each well and the one scale. Then leave one well out of the fit at a time and record how the scale moves. Finally flip the sign of the seismic amplitudes at every well and read the scale and the issue the view raises.
