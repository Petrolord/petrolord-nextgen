# z at pressure and temperature

The published velocity table holds z at 0.90 for all twelve rows, and it holds it there because somebody typed it.

{{panel:pd-droplet-explorer}}

## What z is doing in the density

Density is `p M / (z R T)`, so z sits in the denominator and the density is inversely proportional to it. A gas whose real z is below the number you supplied is denser than you calculated, and a gas whose real z is above it is lighter. That error propagates into every velocity and every rate that follows, and it does so silently, because a compressibility factor is a dimensionless number the module divides by without checking.

## The goldens never test it

All twelve published velocity rows carry z 0.90 as an input, alongside 300.0, 1000.0 or 2500.0 psia and 540.0 or 620.0 degR. That is a clean way to publish a droplet table, because it isolates the droplet balance from the equation of state. It also means the compressibility route is not exercised by these goldens at all. The route exists, in `gasProperties`, and it runs Sutton pseudo-criticals followed by Dranchuk and Abou-Kassem.

## What that route actually returns

Sutton at gas gravity 0.65 gives a pseudo-critical temperature of 365.110000 degR and a pseudo-critical pressure of 670.129000 psia. Dranchuk and Abou-Kassem then give:

| Pressure, psia | Temperature, degF | z |
| --- | --- | --- |
| 300.0 | 80.33 | 0.9538831487 |
| 1000.0 | 80.33 | 0.8522484090 |
| 1000.0 | 140.33 | 0.9010583689 |
| 2500.0 | 160.33 | 0.8616840918 |

Against the 0.90 the golden table pins, every one of these is a different gas. At 300.0 psia and 80.33 degF the real gas is closer to ideal than 0.90 suggests. At 1000.0 psia and the same temperature it is well below, at 0.8522484090, and only warming the same pressure to 140.33 degF brings it back to 0.9010583689.

## The mistake

Carrying 0.90 down a well. It is a reasonable habit at one station and it fails at the next, because z moves with pressure and temperature together and a wellbore changes both at once. The two values at 1000.0 psia, 0.8522484090 and 0.9010583689, are separated by nothing but the step from 80.33 degF to 140.33 degF, and that is a smaller change than a producing string sees between its shoe and its wellhead.

## What it refuses

The loading module takes z as an input and never asks where it came from. It will accept 0.90 at any pressure, return `ok = true`, and print the answer to ten places. Nothing in these goldens would catch a wrong compressibility factor, so that check belongs to whoever supplies the number.

## Exercise

Record z at 1000.0 psia for both 80.33 degF and 140.33 degF, and say which of the two is nearer the 0.90 the table pins.

Then say, without computing it, which way the density moves when the true z is 0.8522484090 and you supplied 0.90.
