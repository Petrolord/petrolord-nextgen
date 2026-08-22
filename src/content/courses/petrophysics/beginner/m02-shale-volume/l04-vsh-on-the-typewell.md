# Vsh on the typewell

Time to run the full chain, GR to IGR to $V_{sh}$, on the course dataset and to see what the resulting curve looks like over the interval you will interpret in the capstone.

## The recipe on one line

For every sample from 2000 to 2100 m (201 samples at 0.5 m spacing) the engine computes:

$$V_{sh} = 0.083\,\left(2^{3.7\,IGR} - 1\right), \qquad IGR = \text{clamp}_{[0,1]}\!\left(\frac{GR - 20}{120 - 20}\right)$$

with the typewell anchors $GR_{clean} = 20$ API and $GR_{clay} = 120$ API and the Larionov tertiary transform. This is exactly what the Petrophysics app does when you open the typewell in Learning Mode with default parameters.

## Worked example at the two reference depths

The shale at 2000 m reads GR = 120 API:

1. $IGR = (120 - 20) / 100 = 1.0$
2. $2^{3.7 \times 1.0} = 2^{3.7} = 13.00$
3. $V_{sh} = 0.083 \times (13.00 - 1) = 0.083 \times 12.00 = 0.996$

The transform calls the reference shale 99.6 percent clay, which is 1 within the precision of the Larionov constant. Any value above the 0.5 cutoff would exclude it from pay anyway, so the missing 0.4 percent has no practical effect.

The clean sand at 2020 m, inside SAND_A, reads GR = 20 API:

1. $IGR = (20 - 20) / 100 = 0$
2. $2^{0} = 1$
3. $V_{sh} = 0.083 \times (1 - 1) = 0$

A textbook end-member pair: the two calibration anchors reproduce 1 and 0, confirming the normalisation is set up correctly for this well.

## The Vsh curve over the reservoir zones

Scanning the computed curve over the two named zones:

* SAND_A (2010 to 2030 m) is remarkably clean. Averaged over its pay, $V_{sh}$ is about 0.003, essentially zero. The gamma ray sits on or near the clean line through the whole sand body.
* SAND_B (2050 to 2080 m) is similarly clean in the sand itself. Where SAND_B loses net pay (as you will see in Module 5) the cause is porosity and water saturation rather than shale.
* The bounding shales at the top of the log and between the sands ride at $V_{sh}$ near 1, as they should.

The typewell is deliberately a clean-sand teaching case. Its sands pass the $V_{sh} \le 0.5$ cutoff everywhere, so shale volume will not be the discriminating factor in this well's net pay. That is a feature: it lets Modules 3 to 5 isolate the effects of porosity, saturation and cutoffs one at a time. Do not carry away the idea that Vsh rarely matters; in most real wells it is a primary control on both net pay and the saturation calculation.

## What Vsh is used for downstream

The $V_{sh}$ curve you just built is consumed in two places in this course, and a third beyond it:

1. The net pay cutoff. In Module 5 a sample only counts as pay if $V_{sh} \le 0.5$ (together with the porosity and saturation cutoffs). The cutoff needs a curve to act on, and this is that curve.
2. Interpretation QC. A Vsh curve that disagrees with the mud log or with obvious log character is the fastest way to catch a bad clean or clay line before it poisons everything downstream.
3. Shaly-sand corrections (beyond this tier). The Intermediate course replaces Archie with the Simandoux and Indonesia equations, which take $V_{sh}$ as a direct input to correct water saturation for clay conductivity. The quality of that correction is only as good as the Vsh curve feeding it.

## A note on precision

You computed 0.996 for the shale and the app reports the same to three decimals. Carry at least three decimals through hand calculations in this course so your capstone answers land inside the grading tolerance. Rounding IGR to one decimal before applying the exponent can shift $V_{sh}$ by several points.

## Exercise

Open the Petrophysics app in Learning Mode (typewell loads by default) and change the Vsh method from Larionov tertiary to linear. Watch the Vsh track: predict first, then check, what happens in the shales, and what happens in the sands. As a self-check: the shales barely move (both transforms end near 1) and the clean sands barely move (both start at 0), but every intermediate, slightly silty sample jumps upward, since linear removes the sag of the Larionov curve. On this exceptionally clean well the net pay does not change; write one sentence on why that is expected here.
