# Surface tension and density

Two of the three inputs to a terminal velocity are properties of a liquid nobody sampled, and the balance survives that because of the exponent they carry.

{{panel:pd-droplet-explorer}}

## Tension across everything a well could produce

A sweep at one published station, 1000.0 psia and 620.0 degR at z 0.9 and gas gravity 0.65, on a liquid density of 67.0 lbm/ft3.

| Interfacial tension, dyne/cm | Terminal, ft/s | Turner, ft/s |
| --- | --- | --- |
| 5.0 | 3.7989369177 | 4.5587243012 |
| 10.0 | 4.5177228119 | 5.4212673743 |
| 20.0 | 5.3725081116 | 6.4470097339 |
| 30.0 | 5.9456575905 | 7.1347891086 |
| 40.0 | 6.3890248717 | 7.6668298460 |
| 50.0 | 6.7555713007 | 8.1066855609 |
| 60.0 | 7.0706183100 | 8.4847419720 |
| 70.0 | 7.3484220382 | 8.8181064458 |
| 80.0 | 7.5978738354 | 9.1174486024 |

The two ends are there deliberately. Neither 5.0 nor 80.0 dyne/cm is a liquid a gas well produces, and the whole run between them, sixteen times the tension, moves the terminal velocity from 3.7989369177 to 7.5978738354 ft/s. Everything a real well makes sits inside that, so a tension taken from a table costs a fraction of it.

## Liquid density does less still

Holding the tension at 60.0 dyne/cm at the same station, the liquid density span from 40.0 to 75.0 lbm/ft3 moves the terminal velocity from 6.1628840484 to 7.2823697925 ft/s, passing 6.5440748684 at 50.0, 6.8683281812 at 60.0 and 7.0706183100 at 67.0 lbm/ft3. That range covers everything from a light condensate to a heavy brine, and it is worth about a foot per second.

## What the density term really is

The balance uses the difference between the liquid and the gas density, not the liquid density alone. At 40.0 lbm/ft3 against a gas at a few pounds per cubic foot the difference is close to the liquid density, and at high pressure it is not. That is why the same liquid gets harder to lift as a well depletes: the gas gets lighter, the difference gets larger, and the drag available gets smaller.

## The mistake

Reporting a critical velocity to four decimal places on the back of a tension read off a chart. The arithmetic is exact and it is exact about an assumption. Neither the tension nor the liquid density is a function of anything these modules know, and the Turner values are offered as labelled starting points rather than as correlations.

## What it refuses

The module will not derive either number. It publishes two fluids, water and condensate, and stops. There is no pressure dependence of tension, no temperature dependence, and no composition anywhere.

## Exercise

Record the terminal velocity at 20.0 and 80.0 dyne/cm and say what factor separates the two tensions and what factor separates the two velocities.

Then say which is the larger error on a real well: a tension taken from a table, or a liquid density guessed at 60.0 rather than 67.0 lbm/ft3.
