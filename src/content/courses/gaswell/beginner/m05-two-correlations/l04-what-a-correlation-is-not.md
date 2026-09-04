# What a correlation is not

A correlation is a fit to somebody else's wells at somebody else's conditions. Both of these were fitted long ago, on data that does not include this well.

{{panel:pd-droplet-explorer}}

## What was actually fitted

One multiplier. Turner and his co-authors found their field data sat about twenty percent above the theoretical velocity and set the adjustment to 1.200000. Coleman and his co-authors, on low-pressure wells, found the unadjusted equation fitted better and left it at 1.000000.

That is the entire empirical content of the choice, and it is a stored constant that nothing derives, tunes or checks.

## The shape underneath was assumed, not fitted

The droplet constant of 1.5935346111 comes from two numbers nobody measured on this well: a drag coefficient of 0.4400, a rigid sphere in the Newton regime, and a critical Weber number of 30.0000.

| Drag coefficient | Droplet constant | Ratio to the shipped 0.44 |
| --- | --- | --- |
| 0.22 | 1.8950426975 | 1.1892062356 |
| 0.33 | 1.7123643784 | 1.0745691372 |
| 0.44 | 1.5935346111 | 0.9999992605 |
| 0.55 | 1.5070719871 | 0.9457409097 |
| 0.88 | 1.3399975420 | 0.8408957934 |
| 1.10 | 1.2672914315 | 0.7952701407 |

The Weber number does the same: 10.0 returns 1.2108244638 and 120.0 returns 2.2535982591 against the shipped 1.5935346111.

A real droplet deforms, and nothing here knows that. The spread those two assumptions open is wider than the 1.200000 that separates Turner from Coleman, and nobody argues about it, because it does not have a name on it.

## The fluid properties are typed in

Interfacial tension and liquid density are inputs, and neither is a function of anything these modules know. The Turner properties are labelled starting points rather than correlations: water at 60.0 dyne/cm and 67.0 lbm/ft3, condensate at 20.0 dyne/cm and 45.0 lbm/ft3.

At 1000.0 psia and 620.0 degR those two give terminal velocities of 7.0706235386 ft/s and 4.8341084620 ft/s, a ratio of 1.4626530609. An unrecognised fluid id falls back to water rather than refusing, so a mistyped fluid returns the larger number and no warning.

## One droplet, and no film

The balance models one droplet at its terminal velocity. Not a droplet population, not coalescence, not break-up in transit, and not liquid running as a film on the tubing wall, which is the other way a gas well carries liquid.

## The mistake

Defending a critical rate as though it were a measurement. Behind the last multiplication sit an assumed sphere, an assumed break-up number, two typed fluid properties and a station somebody chose. The correlation named on the report is the smallest of those choices and the only one anybody writes down.

## Exercise

Record the droplet constant at drag coefficients of 0.22 and 1.10. Then say what that spread covers, and what it tells you about arguing over the name on the correlation.
