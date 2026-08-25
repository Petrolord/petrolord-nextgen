# The Ekene-6 residual

One number came back from six runs. This lesson works out why it is as large as it is, which turns out to say something specific about the field rather than about the method.

{{panel:mp-validation-explorer}}

## The number again

The five-well map, built without Ekene-6, predicts **1555.8438720703125 m** at (1900, 1800). The well found TOP_SAND at **1546 m**.

$$\text{residual} = +9.8438720703125\ \mathrm{m}$$

The map put the horizon almost ten metres too deep.

## Where the prediction came from

With Ekene-6 removed, the five remaining wells and their distances from (1900, 1800) are:

| Well | Distance | TOP_SAND |
| --- | --- | --- |
| Ekene-3 | 707.1 m | 1541 |
| Ekene-2 | 715.9 m | 1565 |
| Ekene-1 | 1204.2 m | 1548 |
| Ekene-4 | 989.9 m | 1590 |
| Ekene-5 | 1303.8 m | 1552 |

The two nearest are Ekene-3 at 1541 m and Ekene-2 at 1565 m, almost equidistant at about 710 m, and their average is 1553 m. The prediction of 1555.84 m sits close to that, pulled a little deeper by Ekene-4 at 1590 m about a kilometre away.

So the five-well map did something entirely reasonable. It put the horizon at roughly the average of its two nearest controls, adjusted for the deeper ground to the northeast.

## Why it is wrong

Because Ekene-6 is a **local high** that none of the five can see.

Its pick of 1546 m makes it the second shallowest well on the field, and it sits in the middle of a pattern whose nearest members are at 1541 m and 1565 m and whose average is 1553 m. There is a 7 m culmination at Ekene-6 relative to the level its neighbours imply, and 707 m is far enough that a minimum-bending surface has no reason to invent it.

That is the honest reading of the residual: **the field has structure at a scale shorter than the well spacing, and the map cannot resolve it.**

## What the residual is measuring

Not an error in the gridding. The spline did the right thing with the information it had.

Not an error in the picks. Ekene-6's 1546 m is a measurement.

It is measuring the **mismatch between the well spacing and the scale of the structure**. Wells about 700 to 1000 m apart cannot resolve a 7 m culmination 700 m across, and every location in the interior of this pattern is subject to the same limitation.

That reframing matters, because the natural response to a 10 m residual is to look for a better interpolator. There is no interpolator that recovers a feature no control point sampled. The response that would help is more control, which is why module 4's appraisal well is the interesting experiment.

## What it implies for the prospect

P-1 sits at (1600, 1600), about 361 m from Ekene-6 and 728 m from Ekene-3, in the same interior region where the one measured residual is nearly 10 m.

So the mapped 1542.62 m at P-1 is a prediction of the same kind that missed by 9.84 m at the only place it could be checked. That does not mean P-1 is 9.84 m wrong. It means the honest uncertainty on it is of that order, and module 5 makes the statement precise.

## Worked example

A colleague suggests smoothing the five-well map with a tension parameter to reduce the residual. Would it help?

No, and it would probably make it worse. Tension flattens a surface toward its trend, and the residual arose because the true surface has a culmination the trend does not contain. Flattening moves the prediction further from 1546 m, not closer.

The general point is that a residual caused by unresolved short-wavelength structure cannot be reduced by any change to how the long wavelengths are interpolated. Only new control at the right scale reduces it.

## Exercise

Give the two nearest wells to Ekene-6 with their picks, state their average, and explain in two sentences why the five-well prediction of 1555.84 m was reasonable and still wrong by nearly ten metres.

As a self-check: the two nearest are Ekene-3 at 707.1 m with a pick of 1541 m and Ekene-2 at 715.9 m with a pick of 1565 m, averaging 1553 m. The prediction was reasonable because a minimum-bending surface through five wells naturally places the horizon near the level its nearest controls imply, pulled slightly deeper here by Ekene-4 at 1590 m. It was wrong because Ekene-6 is a local culmination about 7 m shallower than that level and roughly 700 m across, which is shorter than the well spacing, so no interpolation from those five points could have contained it.
