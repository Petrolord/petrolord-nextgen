# The story so far

Five modules, one droplet, one station. Everything the tier can decide is decided by a single unitless number, and everything before it is bookkeeping.

## A station is four numbers

Pressure, temperature, z and gas gravity, and from them a gas density: rho equals p M over z R T, with R at 10.7316 psia ft3 per lbmol degR and the air molecular weight at 28.9647 lbm/lbmol. At 1000.0 psia, 600.0 degR, z 0.88 and gas gravity 0.65 the published density is 3.3226524714 lbm/ft3 and the engine returns 3.3226453778 lbm/ft3.

Nothing else about the well enters. No depth, no rate, no history.

## The balance is three groups and a constant

Drag against weight less buoyancy, with the largest droplet that survives set by a critical Weber number of 30.0000 and a drag coefficient of 0.4400. Eliminate the diameter and the terminal velocity depends on the quarter power of the interfacial tension, the quarter power of the density difference, and one over the square root of the gas density. Nothing else.

The three power laws, checked rather than asserted: sixteen times the tension takes the terminal velocity from 2.5605819862 to 5.1211639724 ft/s, a ratio of 2.0000000000. Sixteen times the density difference does the same. Four times the gas density takes it from 12.3434660205 to 6.1717330102 ft/s, a ratio of 0.5000000000.

The constant that collapses all of it is 1.5935357894 as the oracle publishes it and 1.5935346111 as the engine derives it, a relative difference of 7.3947e-7.

## The fluid is typed in, and it matters

Water at 60.0 dyne/cm and 67.0 lbm/ft3 gives 7.0706235386 ft/s at 1000.0 psia and 620.0 degR. Condensate at 20.0 dyne/cm and 45.0 lbm/ft3 gives 4.8341084620 ft/s at the same station, a ratio of 1.4626530609. Condensate loads a well at the lower rate, and getting the sign of that backwards flags healthy wells as loaded.

## Velocity becomes rate, and rate becomes a verdict

Multiply by the flow area and by 3054.38693878 Mscf/d per (ft/s x ft2 x psia / degR) times p over z T. Divide the production rate by the same three things to get the actual velocity. The ratio between them is the verdict, and it is strict: 0.9997870547 is loaded.

The correlation sets the last multiplication, 1.200000 for Turner and 1.000000 for Coleman, chosen against a limit of 1000.0 psia.

## What this tier does not answer

Where in the well the liquid is losing. Every number here belongs to one station, at a rate somebody supplied, through an area somebody typed. A well has more than one station.

## Exercise

Write the four station numbers, the two fluid numbers and the one geometry number from memory, then say which single output of the whole chain you would put in front of a decision, and why the other five are supporting work.
