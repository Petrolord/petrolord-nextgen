# Why a wedge and not a well

The teaching well has served two tiers well. It has real logs, real noise, real gaps and a genuinely surprising result in the 60 ms gap between its strongest reflection coefficient and its strongest amplitude. Handing it back now looks like a step away from reality. It is the opposite, and this lesson explains why.

## The well cannot answer the question

Ask the well a simple question: how thin does a bed have to be before its top and base reflections stop being separate events?

To answer it from the well you would need beds of many different thicknesses, all with the same reflection strength at top and base, all in the same part of the log so that the same wavelet applies, and all free of neighbouring reflections that would contribute their own wavelet copies to the sum. The teaching well contains none of that. Its logged interval runs from 1500 ms to 1650 ms, its reflection coefficients vary in size and in sign, and the Associate tier already showed that a cluster of moderate coefficients near 1642 ms outproduces the largest single coefficient in the well by a factor of about four.

Every one of those features is realism, and every one of them is an uncontrolled variable. On real data you cannot separate the contribution of thickness from the contribution of reflection strength, from the contribution of a neighbour 20 ms away, because they arrive already added together. The trace shows you the sum. There is no operation on the sum that recovers which part came from where.

## What a controlled model gives up and what it buys

The wedge gives up realism completely and on purpose. Its reflection pair is equal and opposite, which no real bed is. Its thickness changes in exact 2 ms steps, which no real bed does. Nothing else reflects anywhere on the trace, which is true of no real earth. There is no noise, no multiple, no dip and no offset.

What it buys is that a single variable moves. Between the trace at 14 ms and the trace at 16 ms, exactly one thing differs: the base reflection has moved one sample later. The wavelet is the same wavelet, the coefficients are the same coefficients, and the sample grid is the same grid. If the amplitude changes, thickness changed it, and the size of the change is a measurement of the effect rather than an anecdote about it.

That is what allows this tier to produce a number that transfers. A tuning thickness of 16 ms at 25 Hz is not a fact about the wedge. It is a fact about a 25 Hz Ricker wavelet acting on an opposite signed pair, and the wedge is simply the cleanest way to expose it.

## The classic use of the same idea

Wedge modelling is not a teaching device invented for this course. It is one of the standard tools of quantitative interpretation, and it is used in three ways that all rest on the same controlled property.

**Before a survey**, to decide what bandwidth is needed. If the target sand is expected to be 12 m thick and the processing is expected to deliver about 25 Hz, a wedge answers whether the top and base will appear as two events or one, before any money is spent.

**During interpretation**, to decide whether a bright spot is a thick good reservoir or a thin one at tuning. Those two possibilities produce similar amplitudes, and the wedge is where the ambiguity is quantified rather than argued about.

**After a well result**, to reconcile a measured net thickness against the amplitude that was mapped over it. When the two disagree, the wedge tells you whether the disagreement is within what tuning can explain.

In all three the wedge is being used as a ruler. The reason a ruler is useful is that its markings do not depend on the object being measured.

## A worked comparison

Take the teaching well's strongest reflection coefficient, 0.017688 in absolute value at 1582 ms, and ask what amplitude it should produce. On an isolated interface under a Ricker wavelet the answer is the coefficient itself, so about 0.0177. The Associate tier measured the strongest amplitude in the 25 Hz synthetic as 0.073005, four times larger, at a different time entirely.

Now ask the same question of the wedge. Its top coefficient is 0.08 and at the thick end the measured amplitude is 0.07999999821186066, which is 0.08 as closely as a 32 bit float can hold it. The prediction and the measurement agree to seven decimal places, because in the wedge the interface really is isolated.

The well is not wrong and the wedge is not better. They answer different questions. The well tells you what your data does. The wedge tells you what one effect inside it is worth.

## Exercise

List three variables that differ between two adjacent traces of the teaching well's synthetic and one variable that differs between two adjacent traces of the wedge panel. Then explain, in two sentences, why the wedge can produce a transferable number and the well cannot.

As a self-check: adjacent samples of the well synthetic differ in reflection coefficient size, in coefficient sign, in the spacing to the nearest neighbouring coefficient and in how many coefficients fall inside one wavelet length, while adjacent wedge traces differ only in the position of the base reflection by one 2 ms sample. The wedge transfers because the single moving variable makes the measured change attributable to thickness alone, whereas any number read from the well is the joint result of several variables that arrive already summed and cannot be separated afterwards.
