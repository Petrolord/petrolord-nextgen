# What a disagreement means

A well whose seismic AVO disagrees with its model is the most useful result the comparison gives, and the easiest to misread. QI Studio flags two kinds: a class that differs, raised as an issue, and a negative scale, raised as a high issue because it points to a polarity or wavelet problem. A large residual with matching classes is a third kind a study reads for itself.

## Every link in the chain can disagree

Each point at a well ends a chain of stated steps, and a disagreement can enter at any link. The course has measured most of them:

| link | what the course measured | figure |
| --- | --- | --- |
| the pick | Ekene-1 top, checkshot against picked on the near stack (ms) | 1288.796378 against 1292.000000 |
| the tie | bulk shift at Ekene-2 and at Ekene-4 (ms) | -4.000000 |
| the wavelet | Ekene-3 wavelet reversed: correlation with the average | 0.693702 |
| the angle | Walden less ray trace at 2500 m, teaching earth (degrees) | 1.207256 |
| the gather | far-offset residual moveout on gather 5 (ms) | 2.795940 |
| the scale | one scale over the four wells | 1882.216944 |

Each row is a way for the seismic point to move with no change in the rock:

- **The pick.** The top is the largest near-stack amplitude within 8 ms of the checkshot time. A pick on the wrong sample reads all three stacks off their peak.
- **The tie.** A well whose bulk shift is non-zero has its seismic event at a different time from its checkshot time, and the pick window has to reach it.
- **The wavelet.** A reversed wavelet falls below QI Studio's 0.8 rule for a wavelet unlike the others; seismic of reversed polarity at every well turns the scale negative.
- **The angle and the gather.** A straight-ray angle that reads high at far offsets, or a far trace that sits off level, changes the far stack and so the gradient.
- **Conditioning.** Trim statics, matching and balancing each change the amplitudes the fit reads.

On the model side, the cut-off, the cap rock thickness and the contact set the layers. A well modelled over net sand because it has no oil leg compares a brine interface with whatever the seismic shows there.

## Reading the Ekene pattern

At Ekene every class agrees and the scale is positive, so neither of QI Studio's flags is raised. The residuals still differ, from 0.059452 at Ekene-3 to 0.105803 at Ekene-2, and the gradients split between the oil-leg wells and the net sand wells. The course's figures do not say which link causes that. A study tests the links in turn: re-pick, check the tie and the wavelet, check the stacks and their conditioning, and restate the model. A misfit that survives every test is about the rock or the model, and that is the case worth writing down.

## What a study writes

A disagreement is reported with the link the study suspects, the test it ran and what moved. A study that leaves a well out of the comparison states why, because the scale changes with the wells it is fitted over. The Expert tier takes the seismic and the wells on into inversion.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, open the AVO view, choose AVO at the wells and the Ekene pack's four wells, two terms at 10, 20 and 30 degrees, pick window 8 ms. Record each well's residual and class. Then break one link at a time at Ekene-2: narrow the pick window, move the pick a sample, reverse the polarity of its traces alone. After each, record the residual, the class, the scale and any issue the view raises, and restore the link before the next.
