# The ceiling

Every displacement has a hard ceiling, and it is set before the first barrel of water is injected. No amount of patience, no clever rate schedule, no extra pore volumes can push displacement efficiency past it, because the ceiling is written into the rock's endpoints. This lesson is about knowing exactly where that ceiling sits, what moves it, and what merely changes how fast you approach it.

## The closed form

Ultimate displacement efficiency is what you get when the entire swept volume has been taken all the way to residual oil, so the average saturation equals $1 - S_{or}$:

$$E_{D,max} = \frac{(1 - S_{or}) - S_{wc}}{1 - S_{wc}}$$

On the Ekene sand, with connate water at 0.35 and residual oil at 0.25, that is 0.4 divided by 0.65:

$$E_{D,max} = \frac{1 - 0.25 - 0.35}{1 - 0.35} = 0.6153846153846154$$

The numerator, 0.4, is the movable saturation window you met in module one, and on the 22410845.5314109 barrel pore volume it corresponds to 8964338.21256436 barrels of movable oil. The denominator, 0.65, is the oil share of the pore space at the start. The ceiling is their ratio, an exact fraction, and nothing about viscosity, exponents, or injection rate appears anywhere in it.

## What moves the ceiling, and what does not

Run the one factor sensitivities from the course fixture and sort them into two piles. Raising the oil viscosity to 5 or 10 cp collapses the breakthrough efficiency badly, but the ceiling stays at 0.6153846153846154 in every viscosity case. Changing the Corey exponents moves the front and the breakthrough numbers; the ceiling does not move. Doubling the water endpoint to 0.6 doubles the mobility ratio; the ceiling does not move.

Now cut residual oil from 0.25 to 0.15, the kind of change a wettability shift or a lab remeasurement might deliver. Everything shifts at once: the front saturation moves from 0.6372 to 0.709, breakthrough injection rises from 0.33077027444818546 to 0.4134628430602318 pore volumes, breakthrough efficiency rises from 0.5088773453049006 to 0.6360966816311258, and the ceiling itself lifts to

$$E_{D,max} = \frac{1 - 0.15 - 0.35}{1 - 0.35} = 0.7692307692307692$$

One pile changes the road, the other moves the destination. Endpoints alone move the destination.

There is a curious detail in that residual oil case worth a second look: the fractional flow at the front is 0.8682763300877854 in both the base case and the $S_{or}$ 0.15 case, unchanged to the last digit. That is not a coincidence. The Corey curves depend on saturation only through the normalized variable $S_{wn}$, so stretching the mobile window rescales the saturation axis without changing the curve's shape against $S_{wn}$. The tangent construction picks the same normalized front, 0.718, in both cases; the front saturation is just $S_{wc}$ plus 0.718 times the window width, which gives 0.35 + 0.718 x 0.4 = 0.6372 in the base case and 0.35 + 0.718 x 0.5 = 0.709 in the wider window. The fractional flow at that normalized point, and everything expressed in normalized terms, rides along untouched.

## The price of approaching it

The ceiling is approachable but never cheap. Look at the last row of the engine's recovery profile: the outlet saturation is 0.75, exactly residual oil, and the pore volumes injected read 3837.600651170649. Not three point eight; three thousand eight hundred.

The mechanism is in the derivative. The Welge relation says $Q_i = 1/f_w'(S_{w2})$, and as the outlet approaches residual oil the fractional flow curve flattens onto its ceiling of one, so $f_w'$ heads to zero and its reciprocal blows up. The engine's central difference derivative reports the slope of an almost flat curve, and the reciprocal turns a tiny slope into an enormous injection requirement. The exact figure in that last row is an artifact of evaluating right at the edge, but the message it carries is physical and true: each step closer to residual oil costs more water than the step before, without bound. Fields do not stop flooding because the oil runs out. They stop because the water bill for the next increment exceeds what the increment is worth.

## The misconception to avoid

Do not read 0.6153846153846154 as what the Ekene flood will recover. It is the ceiling on displacement efficiency in the swept, one dimensional system, under the model's assumptions, after unbounded injection. Real recovery sits below it for two separate reasons: the flood is finite, so the outlet never actually reaches residual, and the flood is three dimensional, so parts of the reservoir are never swept at all. The last lesson of this module takes that second reason apart properly.

## Worked example

Compute both ceilings by hand and confirm the shift. Base case: numerator 1 - 0.25 - 0.35 = 0.4, denominator 1 - 0.35 = 0.65, ratio 0.6153846153846154. Improved case: numerator 1 - 0.15 - 0.35 = 0.5, same denominator, ratio 0.7692307692307692. The ten point improvement in residual saturation lifted the ceiling by fifteen point four percentage points of the oil in place, because the saved saturation is divided by the same 0.65 either way. A lab result that moves $S_{or}$ is worth more than almost any other number the lab can move.

## Exercise

Part one: using only the closed form, compute the ceiling for a rock with connate water lowered to 0.20 but residual oil still at 0.25. You should get 0.55 divided by 0.8, which is 0.6875. Compare it with the 0.7692307692307692 that a residual oil of 0.15 achieved at the original connate water, and write one sentence on the asymmetry: a fifteen point cut in connate water bought less ceiling than a ten point cut in residual oil, and the closed form shows why.

Part two: a colleague proposes doubling the injection rate to reach the ceiling sooner and argues this improves ultimate displacement efficiency. Using the two piles from this lesson, write two sentences separating what their proposal changes from what it cannot change.
