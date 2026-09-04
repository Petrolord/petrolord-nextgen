# What this engine models

Four inputs describe the gas, two describe the liquid, one describes the pipe, and everything the module returns is built from those seven.

## The gas, the liquid and the pipe

The gas at a station is a pressure in psia, a temperature in degR, a compressibility factor z and a specific gravity. Those four give a density through `rho = p M / (z R T)`, with `R = 10.7316 psia ft3 / (lbmol degR)` in both production modules and `M` the molecular weight of air scaled by the gravity. The liquid is an interfacial tension in dyne/cm and a density in lbm/ft3, nothing more. The pipe is an inside diameter in inches, and it enters at exactly one place, the flow area, which is why a velocity string works at all.

## The constants it carries

| Constant | Value |
| --- | --- |
| Drag coefficient | 0.4400, rigid sphere in the Newton regime |
| Critical Weber number | 30.0000, droplet break-up |
| Turner droplet constant | 1.5935357894 published, 1.5935346111 derived by the engine |
| gc | 32.1740 lbm ft / (lbf s2) |
| dyne/cm to lbf/ft | 6.852177e-5 |
| Turner adjustment | 1.2000 |
| Coleman adjustment | 1.0000 |
| Coleman pressure limit | 1000.0 psia |

The droplet constant is produced rather than stored. The engine derives 1.5935346111 against the independent oracle's 1.5935357894, a difference of -1.1784e-6 and a relative difference of 7.3947e-7.

## The rate constant is a unit conversion

Standard conditions are 14.70 psia and 519.67 degR, and turning a velocity through an area into Mscf/d costs one number, 3054.38693878 Mscf/d per (ft/s x ft2 x psia / degR). The engine matches the published value to 4.5475e-13. Rebuilt by hand as 86400 x 519.67 / (14.70 x 1000) it reproduces 3054.38693878 exactly, and divided by 1000 it is 3.054387, which is the 3.06 the textbooks print for MMscf/d. A constant you can rebuild from standard conditions is a constant you can audit.

## The mistake

Assuming the module works out z. It does not. In all twelve published velocity rows z is pinned at 0.90 as an input, supplied alongside the pressure and the temperature. The compressibility route lives in a different module, and handing this one a habitual 0.90 at a pressure where the gas is nothing like that is a mistake the module cannot see, because a compressibility factor is just a number it divides by.

## What it refuses

Nothing here computes what the well produces. The rate is supplied. The flowing traverse is passed in as a list of stations carrying their own pressure, temperature, z and diameter, and the module neither solves multiphase flow nor invents a gradient.

## Exercise

List the seven inputs behind a critical rate and mark which of them the module computes for itself.

Then rebuild 3054.38693878 from 86400, 519.67 degR and 14.70 psia and say what each factor is doing.
