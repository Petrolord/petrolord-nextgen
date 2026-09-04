# Brine against condensate

Condensate loads a well at a lower rate than water, and getting that backwards flags healthy wells as loaded.

{{panel:pd-droplet-explorer}}

## Two fluids, four numbers

The module publishes water as 60.0 dyne/cm and 67.0 lbm/ft3, and condensate as 20.0 dyne/cm and 45.0 lbm/ft3. Condensate has about a third the tension and a lower density, so it forms smaller droplets that are lighter for their size, and both differences push the same way.

| Pressure, psia | Temperature, degR | Water terminal, ft/s | Condensate terminal, ft/s |
| --- | --- | --- | --- |
| 300.0 | 540.0 | 12.1435923634 | 8.3363458777 |
| 300.0 | 620.0 | 13.0189530541 | 8.9396311083 |
| 1000.0 | 540.0 | 6.5866393859 | 4.4988594774 |
| 1000.0 | 620.0 | 7.0706235386 | 4.8341084620 |
| 2500.0 | 540.0 | 4.0737980096 | 2.7473233382 |
| 2500.0 | 620.0 | 4.3868983237 | 2.9673403246 |

## The ratio belongs to the station

The two columns stay near a fixed proportion without being exactly proportional, because the balance uses the difference between the liquid and gas densities, and the gas density is a different fraction of 67.0 lbm/ft3 than it is of 45.0 lbm/ft3. So the ratio has to be quoted with its station. A sweep at 1000.0 psia and 620.0 degR puts the water terminal velocity over the condensate terminal velocity at 1.4626530609, and the water Turner rate over the condensate Turner rate at the same 1.4626530609. Those two being one number is not a station property: the flow area and the standard conditions cancel between a velocity ratio and a rate ratio anywhere.

## What that costs on a rate

Published water at 1000.0 psia and 620.0 degR needs 1509.356272243 Mscf/d through 2.441 in tubing. Published condensate at the same station needs 1031.930477998 Mscf/d. A condensate well producing between those two figures is unloaded, and is reported as loading by anyone who reached for the water properties out of habit. The recommendation that follows is a velocity string or a plunger on a well that does not need one.

## The mistake

Assuming the heavier liquid is the easier case because a well makes less of it. Volume is not what the balance is about. The balance sizes one droplet and asks whether the gas can hold it, and 67.0 lbm/ft3 at 60.0 dyne/cm makes a bigger, heavier droplet than 45.0 lbm/ft3 at 20.0 dyne/cm at every pressure and temperature published.

## What it refuses

The module refuses to check the fluid name. An unknown fluid id falls back to water rather than refusing, so a misspelled label silently selects 60.0 dyne/cm and 67.0 lbm/ft3 and returns a valid brine answer under whatever name was asked for. That failure runs in the conservative direction, which is exactly why it survives review.

## Exercise

Record both terminal velocities at 1000.0 psia and 620.0 degR and check that their ratio is 1.4626530609.

Then say what a condensate well between 1031.930477998 and 1509.356272243 Mscf/d gets called under water properties, and what work order follows.
