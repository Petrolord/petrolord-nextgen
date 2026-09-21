# The characteristic wind speed

{{panel:cq-fire}}

The wind form of Thomas never reads the wind on its own. It reads the wind measured against a speed that belongs to the fire, the characteristic wind speed uc. This lesson explains what uc is and why the same wind can be strong for one fire and weak for another.

## What uc measures

The characteristic wind speed is uc = (g m" D / rho_air)^(1/3). It combines gravity, the burning flux m", the pool diameter D and the air density into a velocity scale for the buoyant plume the fire drives upward. In the wind form a wind below uc leaves the flame length untouched, and a wind above it shortens the flame. The engine divides the wind at 10 m by uc to form the scaled wind speed, and the flame length responds to that ratio.

## ERHA's own wind speed

For ERHA, the stated heptane bund fire of 20 m burning at 0.101000 kg/(m2 s) in air of 1.2 kg/m3, the engine returns uc = 2.546226 m/s. A wind of 2 m/s at 10 m is therefore weak for ERHA, and a wind of 4 m/s is already more than one and a half times uc: the engine's scaled wind speed at 4 m/s is 1.570953.

## A bigger fire resists the wind

The burning flux and the diameter sit in the numerator under the cube root and raise uc as they grow; the air density sits in the denominator and lowers it. A wider pool, a faster burning fuel or lighter air all give a stronger plume, and so a higher characteristic speed. Because of the cube root the response is gentle: doubling one input does not double uc. A given wind therefore matters less to a large, fiercely burning pool than to a small or slow one.

## The Yellow Book's value

The Yellow Book's worked pool fire, a benzene pool in a 5 m/s wind, prints a characteristic wind speed of 3.06866 m/s. The engine returns 3.068751, a relative difference of 2.97e-5. This is the first step of the published example, and the flame length steps inherit it: the scaled wind speed follows as 1.629327 against the printed 1.62937.

## Where the units live

Every input to uc carries its unit in its argument name. The burning flux arrives as `burningFluxKgM2S`, the diameter as `poolDiameterM` and the air density as `airDensityKgM3`, and the engine returns uc in m/s as `characteristicWindSpeedMS`. The wind, `windSpeed10mMS`, is only divided by uc afterwards. Because uc reads the burning flux, a pool whose burning flux you change by choosing Burgess over Babrauskas also changes its characteristic wind speed, and with it the flame length at every wind above uc.

## Exercise

The fire panel shows the scaled wind speed u* and leaves uc to you. Load ERHA at a 4 m/s wind, read u*, and divide the wind by it to recover uc. Halve the diameter, then double it, recovering uc the same way each time (valid while u* is above one). Say whether uc moved by the same factor as the diameter, and explain why from the cube root, remembering that the burning flux moves with the diameter too. Finally, state for each of the three diameters whether a 4 m/s wind lies above or below its uc.
