# From velocity to rate

A velocity belongs to a station. A rate is the same statement carried to standard conditions, and the carriage costs three station numbers.

{{panel:pd-droplet-explorer}}

## One constant, and it is only standard conditions

The rate constant is 3054.38693878 Mscf/d per (ft/s x ft2 x psia / degR). It multiplies a velocity in ft/s by a flow area in ft2 and by p over z times T, with p in psia and T in degR.

Nothing in that constant is about gas. Standard pressure is 14.70 psia and standard temperature is 519.67 degR, and the constant rebuilds by hand as 86400 x 519.67 / (14.70 x 1000) = 3054.38693878 Mscf/d. Divided by 1000 it reads 3.054387, which is the 3.06 the texts print for MMscf/d.

## The two readings are exact inverses

Take 12.0 ft/s through a 2.441 in string at 900.0 psia, 580.0 degR and z 0.9. The rate is 2053.715375332 Mscf/d. Convert that rate back to a velocity at the same station and it returns 12.000000000000 ft/s, a round trip closure of -1.7764e-15 ft/s.

A rate quoted at surface and a velocity quoted downhole are therefore one statement in two currencies, on the strict condition that both conversions use the same p, z and T.

## A higher critical velocity can be a lower critical rate

Two published rows, same water at 60.0 dyne/cm and 67.0 lbm/ft3, same 1000.0 psia, same 2.441 in string, differing only in temperature.

| Station | Turner critical velocity, ft/s | Turner critical rate, Mscf/d |
| --- | --- | --- |
| 1000.0 psia, 540.0 degR, z 0.90 | 7.9039672631 | 1614.343188395 |
| 1000.0 psia, 620.0 degR, z 0.90 | 8.4847482463 | 1509.356272243 |

The hotter station needs the faster gas and loads at the lower rate. The velocity rose because the gas thinned. The rate fell because the same standard volume occupies more space at 620.0 degR than at 540.0 degR.

## The mistake

Carrying a critical rate from one station to another because the fluid and the tubing did not change. They did not, and the answer still moved from 1614.343188395 to 1509.356272243 Mscf/d on temperature alone. A critical rate is meaningless without the pressure, temperature and z it was converted at, and those three are what nobody writes on the report.

## What it refuses

Converting a rate to a velocity through zero area returns nothing rather than infinity, and a gas density at zero temperature returns nothing rather than a division by zero. Neither is guessed.

More important, there is no inflow performance anywhere in these modules. The gas rate is an input. A rate that follows from a velocity is what the string would need, not what the reservoir will send.

## Exercise

Convert 12.0 ft/s through 2.441 in at 900.0 psia, 580.0 degR, z 0.9 by hand and confirm 2053.715375332 Mscf/d. Then read the two published 1000.0 psia rows in the panel and write one sentence saying why the faster velocity carries the smaller rate.
