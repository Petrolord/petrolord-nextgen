# The characteristic wind speed

{{panel:cq-fire}}

The wind form of Thomas never reads the wind on its own. It reads the wind measured against a speed that belongs to the fire, the characteristic wind speed uc. This lesson explains what uc is, how the engine computes it, and why the same wind can be strong for one fire and weak for another.

## What uc measures

The characteristic wind speed is uc = (g m" D / rho_air)^(1/3). It combines gravity, the burning flux m", the pool diameter D and the air density into a single velocity. Physically it is the speed of the buoyant plume the fire drives upward. A wind well below uc barely disturbs that plume; a wind well above it bends the flame over and shortens it. The engine divides the wind at 10 m by uc to form the scaled wind speed, and the flame length responds to that ratio.

## ERHA's own wind speed

For ERHA, the stated heptane bund fire of 20 m burning at 0.101000 kg/(m2 s) in air of 1.2 kg/m3, the engine returns uc = 2.546226 m/s. A wind of 2 m/s at 10 m is therefore weak for ERHA, and a wind of 4 m/s is already more than one and a half times uc: the engine's scaled wind speed at 4 m/s is 1.570953.

## A bigger fire resists the wind

Every quantity under the cube root raises uc as it grows. A wider pool, a faster burning fuel or lighter air all give a stronger plume, and so a higher characteristic speed. Because of the cube root the response is gentle: doubling one input does not double uc. The practical reading is that a given wind matters less to a large, fiercely burning pool than to a small or slow one, and the correlation captures that through uc alone.

## The Yellow Book's value

The Yellow Book's worked pool fire, a benzene pool in a 5 m/s wind, prints a characteristic wind speed of 3.06866 m/s. The engine returns 3.068751, a relative difference of 2.97e-5. This is the first step of the published example, and every later step inherits it: the scaled wind speed follows as 1.629327 against the printed 1.62937.

## Where the units live

Every input to uc carries its unit in its argument name. The burning flux arrives as `burningFluxKgM2S`, the wind as `windSpeed10mMS`, and the result is in m/s. Because uc reads the burning flux, a pool whose burning flux you change by choosing Burgess over Babrauskas also changes its characteristic wind speed, and with it the flame length at every wind above uc. The method choice made in module one travels this far.

## Exercise

In the fire panel, load ERHA and read uc. Now keep every other input fixed and halve the diameter, then double it, recording uc each time. Say whether uc moved by the same factor as the diameter, and use the cube root in the formula to explain what you saw. Finally, state for each of the three diameters whether a 4 m/s wind lies above or below its uc.
