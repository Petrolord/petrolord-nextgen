# Chan diagnostics

Water arrives at a producer. The volume tells you how much; the ledger records it and the produced voidage rises. What the volume cannot tell you is whether the water arrived because the flood swept the rock between injector and producer, or because it found a shortcut. Chan's diagnostic reads that from the SHAPE of the water oil ratio over time.

## The plot

Plot the water oil ratio against time on log-log axes, and plot its time derivative on the same axes.

$$\text{WOR} = \frac{q_w}{q_o}, \qquad \text{WOR}' = \frac{d(\text{WOR})}{dt}$$

Time is measured from the first water-bearing production, with one added so that the logarithm is defined at onset.

## What the shapes mean

Chan's 1995 observation, from many simulated and field cases, is that the derivative separates the mechanisms even when the WOR curves themselves look similar.

**Channelling.** Water is moving through a high permeability path: a thief layer, a fracture, or communication behind casing. WOR rises and keeps rising, and so does its derivative. On log-log the derivative has a clear positive slope.

**Coning, or normal displacement.** Water is arriving through the matrix as the front sweeps past, or coning up from below. WOR climbs and then flattens as the mechanism saturates, and the derivative goes flat or declines. On log-log the derivative slope is near zero or negative.

The physical intuition is that a channel has no self-limiting mechanism. Once water is in it, the path gets more water-saturated and less resistant, and the ratio accelerates. Matrix displacement is self-limiting: the fractional flow curve flattens as the saturation approaches its residual, so the WOR rise decelerates.

## The engine's classification

The engine takes the late-time portion, the last forty percent of the points, keeps those where the derivative is positive, and fits a log-log slope. Then:

| late slope | classification |
|---|---|
| at or above 0.4 | channelling-like |
| above 0.0 and below 0.4 | transitional |
| at or below 0.0 | coning or normal displacement |
| not computable | indeterminate |

The labels all carry a hedge in their text: "channeling-like", "coning / normal-displacement-like". That is deliberate. The plot is exact mathematics; the mechanism label is an indicative heuristic on a fitted slope, and it must be confirmed with engineering judgement. The engine always returns the computed slope alongside the label so a reader can see how close to a boundary it sat.

## The smoothing

The derivative is computed on a smoothed WOR series, with a centred difference and a default three-point moving average. That is necessary: differentiating a noisy ratio produces a series in which the noise dominates completely.

It is also a choice that affects the answer. A heavier smooth flattens the derivative and pushes classifications toward coning; a lighter one leaves noise that can steepen the fitted slope. When a classification sits near a boundary, re-run it at a different smoothing window before believing it.

## The minimum data requirement

At least ten points with positive oil, non-negative water and a positive WOR. Below that, no series is built and the producer simply does not appear in the results.

That is not a formality. A three-point log-log slope is not a measurement, and a classification derived from one would carry the same label and the same confident wording as a well-supported one. Excluding the well is the honest output, and the next lessons show it happening to two of Ekene's four producers.

## Chan is about mechanism, not severity

A well can be strongly channelling at a water cut of ten percent and normally displacing at a water cut of ninety. The diagnostic says which process is producing the water, not how much water there is. Both facts matter and they are separate: the volume tells you the cost, and the mechanism tells you whether anything can be done about it.

That distinction drives the response. Channelling has candidate treatments: conformance control, polymer gels, reperforation, shutting off a zone. Normal displacement at high water cut has no treatment, because it is the flood working as designed and eventually reaching its economic limit.

## The misconception to avoid

"A high water cut means channelling." Water cut is a level and Chan is about a shape. A mature waterflood on a perfectly swept pattern reaches 90 percent water cut and its Chan derivative is flat. Reading level as mechanism will send you looking for a conformance problem that does not exist.

## Exercise

First, sketch WOR and its derivative on log-log axes for a producer whose water cut rises from 1 percent to 50 percent over two years and then holds steady, and state what the engine would classify it as.

Second, explain why the derivative is more diagnostic than the WOR curve itself, using the fact that both mechanisms produce a rising WOR.
