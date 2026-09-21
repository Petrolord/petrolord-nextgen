# The flame tilt

{{panel:cq-fire}}

Wind does two things to a pool fire. It shortens the flame, which the last module measured, and it bends the flame downwind. The solid flame model carries the bend as a tilt, the angle between the flame's axis and the vertical, and the engine computes it from a Yellow Book correlation. This lesson reads that correlation and runs it on ERHA.

## The correlation as the engine prints it

The model string reads "tan(t)/cos(t) = 0.666 Fr10^0.333 Re^0.117; t = asin((sqrt(4c^2 + 1) - 1) / (2c))". The right side of the first equation is the tilt parameter c, built from two dimensionless groups: a Froude number Fr10, which compares the wind's inertia with gravity across the pool, and a Reynolds number Re, which compares the wind's inertia with the viscosity of air. The second equation solves tan(t)/cos(t) = c for the angle t in closed form. The next lesson takes the two groups apart.

## ERHA in a rising wind

ERHA is the stated heptane bund fire of 20 m. With a stated air kinematic viscosity of 0.000015 m2/s the engine returns:

| wind m/s, stated | tilt parameter c | tilt degrees from the vertical |
| --- | --- | --- |
| 0 | 0.000000 | 0.000000 |
| 2 | 1.028914 | 38.746229 |
| 4 | 1.770458 | 49.174202 |
| 8 | 3.046437 | 58.130517 |
| 12 | 4.184770 | 62.577136 |

## No wind, no tilt

With no wind both groups are zero, c is zero and the flame stands upright. Unlike the flame length, the tilt has no floor held at one: even 2 m/s, below ERHA's characteristic wind speed, tilts the flame by 38.746229 degrees. So at 2 m/s ERHA keeps its no wind length of 35.746382 m and yet leans well over. The two correlations respond to the wind in different ways, and the engine computes each one separately.

## The tilt grows quickly, then slowly

The first 4 m/s of wind take the flame from upright to 49.174202 degrees. The next 8 m/s, to 12 m/s, carry it on only to 62.577136 degrees. A flame can approach the horizontal only slowly, and the closed form for t never reaches it. For a target downwind, the steep early rise matters most: a moderate breeze already leans the flame well toward it.

## The published check

The Yellow Book's worked benzene pool fire, in a 5 m/s wind, prints a tilt parameter of 1.94315 and a tilt of 50.8286 degrees. The engine returns 1.943154 and 50.828697, relative differences of 1.95e-6 and 1.92e-6. That published pair is why the tilt can carry a graded answer in this course. The example reaches those figures with a printed viscosity that is itself an erratum, which module six sets out.

## Exercise

In the fire panel, load ERHA with the stated viscosity and step the wind through 0, 2, 4, 8 and 12 m/s. Record the tilt and the flame length side by side for each. Then write two sentences describing how the two quantities move in opposite directions, and name the wind at which the length is still at its no wind value while the tilt is already far from the vertical.
