# A probit and a probability

{{panel:cq-harm}}

An overpressure, a heat flux held for a time or a concentration breathed for a time is a physical exposure. What a consequence study usually needs is a fraction: of the people exposed to that, how many would be killed. A probit is the bridge. This module teaches how the engine crosses it, and this lesson starts with the bridge itself.

## A shifted normal deviate

The engine's model string, verbatim: "P = Phi(Y - 5), standard normal CDF (lib/stats normalCDF, Abramowitz and Stegun 7.1.26, |error| <= 1.5e-7)". A probit Y is a standard normal deviate shifted up by five. Y of 5 is the middle of the distribution, a probability of one half. The ladder (stated):

| probit, stated | probability |
| --- | --- |
| 2 | 0.001350 |
| 3 | 0.022750 |
| 4 | 0.158655 |
| 5 | 0.500000 |
| 6 | 0.841345 |
| 7 | 0.977250 |
| 8 | 0.998650 |

The ladder is symmetric about five: a probit of 4 and a probit of 6 sit the same distance either side of one half. Each whole unit near the middle moves the probability a long way, and each unit out in the tails moves it very little.

## The general form

Every probit in this engine is a straight line in the logarithm of an exposure measure. The general function `probit` computes, verbatim, "Y = a + b ln(V); P = Phi(Y - 5)", for any coefficients a and b and any thermal dose or toxic load V. The logarithm is NATURAL. A coefficient pair published for base ten logarithms would give a wrong probit if typed here, and the presets in the next lessons are all natural log forms.

The measure V is where the physics lives. For heat it is a thermal dose built from the heat flux and the exposure time; for a toxic gas it is a toxic load built from the concentration and the minutes; for a blast it is the overpressure itself. The probit then says nothing about the physics. It maps a number to a fraction.

## Four refusals this tier meets

The Expert calls draw four refusals worth knowing by sight. The TNT energy typed in kJ/kg:

> tntBlastEnergyJKg: must be the TNT blast energy in J/kg, between 4.0e6 and 5.0e6 (the YB cites 4.19e6 to 4.65e6)

A scaled distance beyond the range of the blast fit:

> scaledDistanceMKg13: Z lies outside 0.05 to 40 m/kg^(1/3), the range this fit is used over

A probability of one passed to the inverse, which has no finite probit:

> probability: must lie strictly between 0 and 1

And a concentration in ppm on a preset whose coefficients expect mg/m3, with no molar mass to convert it:

> molarMassGMol: must be a molar mass above 0 g/mol

Each names its field and carries no number. Each tells you which input to fix.

## Exercise

On the harm panel's probit view, enter each probit on the ladder and confirm the probability. Then use the inverse to find the probit for a probability of 0.5, and confirm it returns 5.000000. Enter a probability of 1 and record the field the refusal names. Finally, write one sentence explaining why a probit of 7 and a probit of 8 differ far less in probability than a probit of 5 and a probit of 6.
