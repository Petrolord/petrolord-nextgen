# The AVO panel map

The AVO explorer is the instrument for this tier. It draws four curves and prints twelve readings, and the most important thing on it is the gap between two of the curves.

{{panel:rp-avo-explorer}}

## The two controls

**Wavelet frequency** affects only the wedge tuning tile at the bottom right. It does not change any reflection coefficient, because reflectivity is a property of the interface and not of the wavelet. Module five is about what it does change.

**Class II band on |A|** sets the threshold that decides whether a case is called class I, II or III. It is a convention rather than a measurement, and exposing it as a control is deliberate: module three is about what happens when you widen it.

## The chart

The horizontal axis is incidence angle from 0 to 40 degrees. The vertical axis is the reflection coefficient, with a dashed line at zero.

Blue is the brine case and amber the gas case.

Each case is drawn twice. The solid line is the exact Zoeppritz solution and the dashed line is the Shuey approximation. Where the two coincide, the approximation is good; where they part, it is not. Module four is that gap.

The red vertical line marks the angle at which the brine case changes polarity.

## What the curves show

The brine case starts just above zero, falls steadily, and crosses into negative territory around 30 degrees. That is class I behaviour: a positive intercept with a negative gradient large enough to change the sign within the recorded offset range.

The gas case starts well below zero and gets more negative. That is class III: negative at all offsets, brightening with offset.

Those two shapes are what an interpreter looks at on a gather, and they are visibly different, which is the practical content of the phrase the class flips.

## The tiles

The first row is the brine case: intercept, gradient, class, and the angle at which its polarity flips.

The second row is the gas case: intercept, gradient, class, and the exact Zoeppritz value at 30 degrees, which is one of the seven capstone fields.

The third row holds the comparison readings: Shuey at 30 degrees for the gas case, printed beside the exact value so the gap is a subtraction; the largest error between approximation and exact over the whole angle range for each case; and the wedge tuning thickness.

## What to notice first

Set the frequency to 25 Hz and the threshold to 0.02, which is the capstone configuration, and read across.

The brine intercept is 0.034344 and the gas intercept -0.062825. Both are close to the exact normal incidence values from the last lesson, 0.034457 and -0.062991, and neither is equal to them.

The gradients are -0.167662 and -0.256563. Both negative, and the gas case steeper.

The classes read I and III.

The two error tiles read 0.005972 for the brine case and 0.002192 for the gas case. The approximation is nearly three times worse on the brine case, which is the opposite of what most people would guess.

## Worked example

Use the threshold control to find out how firm the class call is.

Leave everything else and step the threshold from 0.01 to 0.02 to 0.04 to 0.05.

The gas case reads class III at every setting. Its intercept of -0.062825 is more than three times the widest band, so no reasonable convention would call it anything else.

The brine case reads class I at 0.01 and 0.02, and class II at 0.04 and 0.05. Its intercept of 0.034344 is only 1.72 times the default band.

So one of the two class calls is robust and the other is a convention away from changing. That asymmetry is worth carrying into any report that uses the word class.

## Exercise

Set the frequency to 40 Hz and record what changes on the panel. Explain the result.

Self check: only the tuning tile changes, from 16 ms to 10 ms. Every reflection coefficient, intercept, gradient and class is identical, because reflectivity depends on the elastic contrast across the interface and not at all on the wavelet used to illuminate it. The wavelet decides what thickness of bed can be resolved, which is a different question and the subject of module five.
