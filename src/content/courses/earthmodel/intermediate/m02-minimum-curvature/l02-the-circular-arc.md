# The circular arc

Between two stations the hole could have taken any path that matches the measured attitudes at both ends. Minimum curvature commits to the smoothest candidate: a single circular arc that leaves the upper station at its measured attitude and arrives at the lower station at its measured attitude. This lesson computes W2's build segment through that arc, because every digit of the capstone flows through it.

## The dogleg

First the method needs the total angle turned between the stations, called the dogleg. It comes from the spherical cosine rule:

$$\cos\beta = \cos(I_2 - I_1) - \sin I_1 \sin I_2 \,(1 - \cos(A_2 - A_1))$$

For the build segment, inclination goes 0 to 45 degrees and azimuth 0 to 90. Because $\sin I_1 = 0$, the azimuth term vanishes entirely and the dogleg is just the inclination change: $\beta = 45$ degrees, or $\pi/4$. This is a general and useful fact: from a vertical start, azimuth change costs nothing, because a vertical hole has no direction to change.

## The ratio factor

A chord is shorter than its arc. The stations are connected by 300 m of hole along the arc, but the straight line between them is shorter, and the correction is the ratio factor:

$$RF = \frac{2}{\beta}\tan\frac{\beta}{2}$$

With $\beta = \pi/4$: $RF = (8/\pi)\tan(\pi/8) = 1.054786175158099$. The engine treats any dogleg below $10^{-4}$ radians as straight, with RF exactly 1, which is what makes vertical and hold segments exact rather than approximately straight.

## The increments

The position increments average the direction vectors at the two ends and scale by half the measured length times RF:

$$\Delta E = \frac{\Delta MD}{2}(\sin I_1 \sin A_1 + \sin I_2 \sin A_2)\,RF$$

and likewise for north (cosines of azimuth) and vertical (cosines of inclination). For the build, with $\Delta MD = 300$:

East: $150 \times (0 + \sin 45^\circ) \times 1.054786175158099 = 111.87696857341697$ m.

North: $150 \times (0 + \sin 45^\circ \cos 90^\circ) \times RF = 0$: the hole heads due east, so nothing moves north.

Vertical: $150 \times (\cos 0 + \cos 45^\circ) \times RF = 150 \times 1.7071067811865475 \times 1.054786175158099 = 270.09489484713185$ m.

So station 1500 lands at x $= 1400 + 111.87696857341697 = 1511.876968573417$, y unchanged at 2200, TVD $= 1200 + 270.09489484713185 = 1470.0948948471319$, and with KB 30, TVDSS 1440.0948948471319. These are the engine's stored values to the last digit.

## What the arc buys

Compare against the two naive methods. Treating the segment as still vertical gives 300 m down, 0 east: it misses the true endpoint by over 111 m horizontally. Treating it as already at 45 degrees east gives 212.13 m east and 212.13 m down: wrong by about 100 m east and 58 m short vertically. The arc says 111.88 east and 270.09 down. Three hundred metres of hole, three answers spread across more than 100 m of position; the arc is the one that honours both measurements.

Notice also that 270.09 is less than 300: even the vertical progress of an arcing hole is slower than its measured length, and the difference, 29.9 m here, is not rounding. It is the geometric price of turning.

## Worked example

Verify the RF arithmetic to full precision. $\tan(\pi/8) = 0.41421356237309503$, which is $\sqrt{2} - 1$. Then $RF = (2/(\pi/4)) \times 0.41421356237309503 = (8/\pi) \times 0.41421356237309503 = 1.054786175158099$. The east increment is $150 \times 0.7071067811865476 \times 1.054786175158099 = 111.87696857341697$. Hand and engine agree because there is nothing else in the formula: no iteration, no fitting, one closed form.

## Exercise

Compute the dogleg for a segment from inclination 30, azimuth 0 to inclination 30, azimuth 60, using the formula above, and note that it is NOT the 60 degrees of azimuth change. Then explain in one sentence why azimuth change is cheaper at low inclination.
