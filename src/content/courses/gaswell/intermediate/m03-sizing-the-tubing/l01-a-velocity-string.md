# A velocity string

The only place tubing diameter enters a loading calculation is the flow area, and that is the whole reason a velocity string works.

{{panel:pd-profile-explorer}}

## The critical velocity does not know the tubing size

`sizeTubingForRate` on EBOCHA-5 is run at the controlling station: 7500.0 ft, 1500.0 psia, 653.67 degR, z 0.9142643742, at a gas rate of 3100.0 Mscf/d. Under Coleman the critical velocity there is 6.1224977520 ft/s, and it is 6.1224977520 ft/s for the 3.958 in candidate, for the 1.610 in candidate and for every candidate between them.

Critical velocity belongs to the station and the fluids. It is built from the gas density of 4.2000760651 lbm/ft3, the brine at 62.0 dyne/cm and 66.2 lbm/ft3, and nothing else. Change the string and it does not move.

## What does move is area

The 3.958 in candidate has a flow area of 0.0854434880 ft2 and the 1.610 in candidate has 0.0141377124 ft2. Feed the same 3100.0 Mscf/d through each and the actual velocity is 4.7325778044 ft/s in the first and 28.6020782357 ft/s in the second.

The critical rate follows the area in the same direction, 4010.445008120 Mscf/d against 663.579159341 Mscf/d, because a rate is a velocity times an area converted to standard conditions. So the ratio of the two, which is what decides, is the actual velocity over the critical velocity and the well's rate over the critical rate at once.

Smaller string, same gas, higher velocity. That is the entire mechanism.

## What it buys on this well

EBOCHA-5's current 3.548 in string reads 0.9619521855 at the controlling station, a loading well. The four largest candidates, 3.958, 3.826, 3.740 and 3.548 in, all fail to unload it. The five smaller ones, 3.476, 3.068, 2.441, 2.041 and 1.610 in, all clear.

The line between those two groups is where the workover argument sits, and it is a line, not a preference. Note where it falls: the current string is the smallest candidate that still fails, so this well is not far wrong. It is one size wrong.

## The mistake

Reading a velocity string as something that helps the well. It does not add gas, does not lower the shoe pressure and does not change the fluids. It moves the same 3100.0 Mscf/d through less area so the gas travels faster past a droplet that was always going to need 6.1224977520 ft/s.

Everything a smaller string costs, in friction and in future deliverability, is invisible here, because there is no pressure drop anywhere in these modules.

## What it refuses

The area is the only place the string enters. Wall thickness, roughness, restrictions, nipples and the transition at the top of a tapered string are not modelled. Neither is the film that flows on the tubing wall, which is the other way a gas well carries liquid.

## Exercise

Read the critical velocity at the EBOCHA-5 controlling station for the 3.958 in and the 1.610 in candidates and confirm the two agree.

Then read the two actual velocities and say which quantity carried the whole difference.
