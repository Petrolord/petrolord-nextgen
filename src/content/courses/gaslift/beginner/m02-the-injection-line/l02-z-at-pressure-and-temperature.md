# z at pressure and temperature

The compressibility factor is what stops a gas column being an exponential you can do in your head, and it does not move the way a first guess expects.

{{panel:pd-column-explorer}}

## z is not a function of pressure alone

The engine takes Sutton pseudo-criticals and Dranchuk and Abou-Kassem. The published cases show what comes back.

| Gas gravity | Pressure, psia | Temperature, degF | z |
| --- | --- | --- | --- |
| 0.6 | 100.0 | 80.0 | 0.986397962 |
| 0.65 | 500.0 | 100.0 | 0.932572676 |
| 0.65 | 1500.0 | 180.0 | 0.896752731 |
| 0.7 | 2500.0 | 220.0 | 0.894419892 |
| 0.8 | 3500.0 | 250.0 | 0.916168222 |

z falls to 0.894419892 at 2500.0 psia and 220.0 degF and then climbs again to 0.916168222 at 3500.0 psia and 250.0 degF. Pressure alone would have kept it falling. Both arguments matter and they pull opposite ways.

## Down a well, z rises

| Column | z at surface | z at the packer | Temperature range, degF |
| --- | --- | --- | --- |
| 1 | 0.869373540 | 0.915763920 | 100.0 to 190.0 |
| 2 | 0.817110097 | 0.910514014 | 110.0 to 240.0 |
| 3 | 0.923538745 | 0.939743419 | 90.0 to 140.0 |

Density goes as pressure over z and temperature, so a rising z is a second effect pushing the gas lighter as it goes down, on top of the geotherm. Column 2 starts the deepest into non-ideal behaviour, at 0.817110097, and recovers the most.

## Sour gas changes the criticals, not the correlation

The published acid case, 0.75 gravity at 2000.0 psia and 160.0 degF with a CO2 mole fraction of 0.08 and an H2S mole fraction of 0.04, returns z of 0.849475579. The same gas with the acid correction omitted returns 0.821584635. Wichert and Aziz shift the pseudo-criticals by an epsilon of 16.765703 degR, taking the pseudo-critical temperature from 389.700000 to 372.934297 degR and the pseudo-critical pressure from 656.525000 to 627.243695 psia.

## The mistake

Skipping the acid correction because the mole fractions look small. Mole fractions of 0.08 and 0.04 move z from 0.821584635 to 0.849475579, and density carries that straight into the gradient at every step of the march, so the error is not a one-off offset. It compounds down the whole column, and it compounds in the direction of a heavier gas than the well has.

## What it refuses

The correlation asserts no agreement with data this repository has not verified. On the nitrogen basis used for dome charges the header goes further and pins the window it is defensible in, Tpr 2.3 to 3.1 and Ppr 1 to 5, because that use is an extrapolation off the natural gas data it was fitted to.

## Exercise

Read z at the surface and at the packer for each of the three published columns.

Then say which column moves furthest, and whether its pressure or its temperature range is doing the moving.
