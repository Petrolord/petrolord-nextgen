# The Froude and Reynolds numbers

{{panel:cq-fire}}

The tilt correlation reads two dimensionless groups and multiplies them into a single tilt parameter. This lesson takes each group in turn, shows why one of them matters far more than the other, and explains the refusal the engine returns when the air viscosity is missing.

## The Froude number

The engine computes Fr10 = u10^2 / (g D), the square of the wind at 10 m divided by gravity times the pool diameter. It compares the push of the wind with the pull of gravity across the pool. The Froude number enters the tilt parameter to the power 0.333, so it carries most of the tilt's response to the wind. Because the wind is squared, doubling the wind multiplies the Froude number by four.

The same published example prints a Froude number of 0.0545. The wind and diameter it states give u10^2 / (g D) = 0.060060, and the printed tilt parameter and tilt follow only from that value. The printed figure is a misprint in the published source; module six sets out this erratum beside the others.

## The Reynolds number

The engine computes Re = u10 D / nu, the wind times the diameter divided by the kinematic viscosity of air. It compares the wind's inertia with the air's resistance to shear. For a pool fire outdoors it is large: millions. It enters the tilt parameter only to the power 0.117. The kinematic viscosity nu is the only property of the air the tilt reads, and the engine takes it as an input named `airKinematicViscosityM2S`, in m2/s, with the unit in the name as for every other argument.

## ERHA's two groups

With the stated viscosity of 0.000015 m2/s, ERHA's 20 m pool gives:

| wind m/s, stated | Froude number | Reynolds number | tilt parameter c | tilt degrees |
| --- | --- | --- | --- | --- |
| 2 | 0.020394 | 2666666.666667 | 1.028914 | 38.746229 |
| 4 | 0.081577 | 5333333.333333 | 1.770458 | 49.174202 |
| 8 | 0.326309 | 10666666.666667 | 3.046437 | 58.130517 |
| 12 | 0.734196 | 16000000.000000 | 4.184770 | 62.577136 |

The Froude number grows fourfold with each doubling of the wind; the Reynolds number only doubles. Both are zero with no wind, which is why the tilt is zero there too.

## The viscosity matters weakly

Because the Reynolds number is raised to 0.117, even a large error in the viscosity moves the tilt only a little. The Yellow Book's own worked pool fire illustrates the point. It prints an air viscosity of 0.0000075133 m2/s "for air at 15 C", about half the physical value for air at that temperature. The engine reproduces the printed tilt to its printed digits only with the printed viscosity, because the printed tilt depends on it, and the golden uses that value for that reason.

## No viscosity, no tilt

The viscosity is an input with no default. Leave it blank and the engine refuses, naming `airKinematicViscosityM2S`:

> airKinematicViscosityM2S: must be above 0 m2/s (air at 15 C is about 1.5e-5; the YB example prints 7.5133e-6)

The message gives you both the physical value and the published one, and leaves the choice to you. A consequence note states which viscosity it used.

## Exercise

In the fire panel, load ERHA at a 4 m/s wind with the viscosity at 0.000015 m2/s and record the tilt. Change the viscosity to the Yellow Book's 0.0000075133 m2/s and record the tilt again. Then clear the viscosity and copy the refusal. Write one sentence on how much the halved viscosity moved the tilt, and connect it to the exponent 0.117.
