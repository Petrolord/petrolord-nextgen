# One scale over every well

The seismic gives intercept and gradient in trace units; the logs give them as reflection coefficients. Before the two can be compared they need one tie, and QI Studio's comparison at the wells fits a single least-squares scale over every well, A and B together. The prestack explorer runs the same comparison on the four Ekene wells and prints the scale with its inputs.

{{video:qi-e14}}

## The two sides of the comparison

**Modelled.** At each well, the cap rock over the oil leg, as the Associate tier built it, with Shuey's intercept and gradient of that interface. Where a well has no oil leg the cap rock sits over its net sand. Ekene-2 and Ekene-4 have no oil leg: their top of the Ekene Sand lies below the oil-water contact at 5118.110236 ft, so all their net sand is water leg.

**Seismic.** The top picked on the near stack trace within 8 ms of the well's checkshot time, the near, mid and far stack traces read at that sample, and two Shuey terms fitted at 10, 20 and 30 degrees.

| well | modelled from | modelled A | modelled B | seismic A | seismic B |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | oil leg | 0.170742 | -0.563558 | 486.838592 | -1072.562182 |
| Ekene-2 | net sand | 0.210627 | -0.501240 | 499.174430 | -772.839743 |
| Ekene-3 | oil leg | 0.194681 | -0.641524 | 470.308887 | -1249.098330 |
| Ekene-4 | net sand | 0.216991 | -0.520090 | 527.903525 | -894.546352 |

## The scale

scale = sum(observed x modelled) / sum(modelled^2)

The sums run over every well, A and B together: the least-squares factor that carries the modelled column onto the seismic one.

| quantity | value |
| --- | --- |
| wells | 4 |
| one scale, trace units per unit reflection coefficient | 1882.216944 |

The scale is positive, on seismic of SEG normal polarity, where a peak is a positive number. QI Studio raises a high issue for a negative scale: a polarity or wavelet problem.

## Why one scale

One scale over every well ties the trace units to reflectivity once, for the survey, and leaves each well free to disagree. The gradients weigh heavily in the sums because they are the larger numbers in both columns, so the scale leans on how well the seismic gradients match the modelled ones.

The fluid factor lesson divided the top of gather 5 by this same figure.

## What the scale rests on

Every choice on both sides moves it: the cut-off, the cap rock thickness and the contact that built the modelled layers, and the pick window, the stacks, the angles and the number of terms on the seismic side. A study states them all, and quotes the scale with the wells it was fitted over.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "AVO at the wells", with Mean angle of near, mid and far at 10, 20, 30 and Pick half window at 8 ms. Check the modelled and seismic A and B at each well against the table. Read One scale over every well and check it against 1882.216944, then work it once by hand from the eight pairs with the equation above. Then leave one well out at a time, recompute, and record how the scale moves. Finally flip the sign of every seismic A and B, recompute, and name the issue QI Studio would raise.
