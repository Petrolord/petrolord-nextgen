# Normalising to IGR

Raw gamma ray values are in API units, and API values mean different things in different wells: one basin's shale may read 100 API, another's 150. Before GR can say anything quantitative about clay content, it has to be normalised against the local end members, the cleanest rock and the purest shale in the well itself. The result is the gamma ray index, IGR.

## The formula

$$IGR = \frac{GR - GR_{clean}}{GR_{clay} - GR_{clean}}$$

where

* $GR$ is the log reading at the depth of interest,
* $GR_{clean}$ is the clean line, the GR value of a shale-free rock in this well,
* $GR_{clay}$ is the clay line, the GR value of pure shale in this well.

IGR is a linear rescaling of the log between those two anchors. At the clean line IGR is 0, at the clay line it is 1, and a reading halfway between them gives 0.5.

## Picking the clean and clay lines

The two anchors are interpretation choices, and they matter more than any formula in this module. Two standard ways to pick them:

1. From obvious intervals. Find a thick, clearly clean reservoir sand and read its GR; find a thick, featureless shale and read its GR. Take care that the "clean" interval really is clean on other evidence (low density, good porosity, mud log shows).
2. From the histogram. Plot the distribution of GR values over the zone of interest. A clastic well typically shows two clusters, a low-GR sand population and a high-GR shale population. The clean line sits at the low edge of the sand cluster, the clay line near the peak of the shale cluster. Using the extreme minimum and maximum single samples is bad practice, since a single noisy sample would then control the whole calibration; pick values representative of the populations instead.

On the typewell both approaches land in the same place. The dataset provides the anchors as givens:

* $GR_{clean} = 20$ API (the SAND_A reading),
* $GR_{clay} = 120$ API (the shale at the top of the log).

## Clamping to the physical range

Real logs are noisy, so occasional samples read below the clean line or above the clay line. Plugged into the formula those give IGR values below 0 or above 1, which are not physically meaningful as a fraction. The convention, and what the course engine does, is to clamp:

* if $IGR < 0$, set it to 0,
* if $IGR > 1$, set it to 1.

## Worked example

Take three readings from the typewell interval and normalise them with $GR_{clean} = 20$ and $GR_{clay} = 120$:

1. $GR = 70$ API:

$$IGR = \frac{70 - 20}{120 - 20} = \frac{50}{100} = 0.50$$

2. $GR = 20$ API (clean sand at 2020 m):

$$IGR = \frac{20 - 20}{100} = 0$$

3. $GR = 120$ API (shale at 2000 m):

$$IGR = \frac{120 - 20}{100} = 1$$

The arithmetic is deliberately clean: with anchors of 20 and 120 the denominator is 100, so IGR is just "API above the clean line, divided by 100". A reading of 45 API gives IGR 0.25, a reading of 95 API gives 0.75, and so on. Being able to do this in your head is genuinely useful at the wellsite.

## Why we do not stop here

It is tempting to call IGR the shale volume and move on, and the simplest interpretation model does exactly that. But IGR is a radioactivity index. It says "this sample sits half way between my clean and clay anchors in gamma response". Whether half-way radioactivity means half clay by volume depends on the rocks, and in young sediments it systematically does not. The next lesson introduces the transforms that map IGR to an actual volume fraction, including the one used for the typewell interpretation.

## Sensitivity to the anchors

Before moving on, notice how the anchors propagate. If you set the clean line too high, every clean sand acquires a phantom clay fraction; too low, and genuinely silty sands look cleaner than they are. A quick check: with the correct anchors, IGR should be near 0 in your best sand and near 1 in your reference shale, by construction. If it is not, the anchors are wrong for this well.

## Exercise

Using the typewell anchors (clean 20 API, clay 120 API), compute IGR for readings of 30, 60 and 110 API, then state what happens for a noisy sample reading 15 API. As a self-check: 0.10, 0.40, 0.90, and the 15 API sample gives a negative raw value that is clamped to 0.
