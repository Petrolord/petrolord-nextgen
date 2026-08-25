# Impedance and Vp over Vs

Velocities and densities are what the substitution computes. Impedance and the velocity ratio are what an interpreter works with, because they are what seismic data can be inverted for.

## Acoustic impedance

$$I = \rho v_p$$

For the two Ekene cases:

$$I_{brine} = 2250 \times 3200 = 7{,}200{,}000, \qquad I_{gas} = 2038.7104517793223 \times 2905.6972280296195 = 5{,}923{,}875.31$$

A fall of 17.72 percent.

That number is the one a seismic amplitude responds to at normal incidence, because a reflection coefficient is a contrast in impedance. The Expert tier picks it up directly.

Notice that the impedance falls further than either factor alone. The velocity fell 9.2 percent and the density fell 9.4 percent, and because impedance is their product the two drops compound to 17.7 percent. Gas is doubly visible: it softens the rock and it lightens it, and impedance sees both.

## The velocity ratio

$$\frac{v_p}{v_s}: \qquad \frac{3200}{1800} = 1.7777777777777777 \qquad \to \qquad \frac{2905.6972280296195}{1890.9758806113214} = 1.5366125278606173$$

The brine value is exactly 16/9, an artefact of a fixture built on round numbers.

The ratio falls by 13.6 percent, and it falls because the two velocities moved in opposite directions. That is the compounding again, in the other direction, and it is why the ratio is a more sensitive fluid indicator than either velocity.

## Why the ratio is the better discriminator

Every mechanism that softens a rock lowers the compressional velocity. Only a few lower the ratio.

A porosity increase lowers both velocities by similar proportions, so the ratio barely moves. More clay raises the ratio, because clays have low shear stiffness. Gas lowers it sharply, because it lowers the compressional velocity while raising the shear one.

So a crossplot of impedance against velocity ratio separates fluid effects from porosity and lithology effects, which neither axis does alone. That crossplot is the standard working display of quantitative interpretation, and this tier has just computed one point on it for each fluid.

## Poisson's ratio

The same information appears as Poisson's ratio, which is a one to one function of the velocity ratio:

$$\nu = \frac{(v_p/v_s)^2 - 2}{2\left[(v_p/v_s)^2 - 1\right]}$$

At 1.7778 that gives 0.268571, and at 1.5366 it gives 0.132671, a factor of 2.02.

Poisson's ratio appears in this course because the Expert tier's AVO gradient is essentially a contrast in it. Nothing in it is new information; it is the velocity ratio wearing different clothes, and it is worth being able to move between them.

## Reading it off the panel

Two tiles carry these directly.

{{panel:rp-substitution-explorer}}

Step the saturation from 1.00 to 0.00 and watch the impedance tile fall from 7.2000 to 5.9239 and the ratio tile from 1.7778 to 1.5366.

Then step the porosity from 0.20 to 0.30 with the saturation held at 0.00, and watch what happens to the ratio. It moves far less than the impedance does. That is the discrimination working: porosity moves impedance and leaves the ratio comparatively alone, while fluid moves both.

## Worked example

Work out how much of the impedance drop each factor contributes, since the answer is not intuitive.

Velocity alone: if only the velocity changed, the impedance would be $2250 \times 2905.6972 = 6{,}537{,}819$, a fall of 9.2 percent.

Density alone: if only the density changed, it would be $2038.7105 \times 3200 = 6{,}523{,}873$, a fall of 9.4 percent.

Together they give 5,923,875, a fall of 17.7 percent, which is slightly less than the sum of the two individual falls because the drops multiply rather than add.

The striking part is that the density contributes marginally more than the velocity does. Half of a gas anomaly's impedance signature is bookkeeping about what the pores weigh, and half is the rock physics of what the frame does without a stiff fluid in it.

## Exercise

A sand shows a 10 percent impedance drop and no change in its velocity ratio between two wells. State the most likely cause and say why it is unlikely to be gas.

Self check: a porosity increase is the most likely cause, since it lowers both velocities in similar proportion and lowers the density, dropping the impedance while leaving the ratio nearly fixed. Gas is unlikely because gas lowers the compressional velocity and raises the shear velocity, which would have moved the ratio substantially, and at Ekene a full brine to gas substitution moved it by 13.6 percent.
