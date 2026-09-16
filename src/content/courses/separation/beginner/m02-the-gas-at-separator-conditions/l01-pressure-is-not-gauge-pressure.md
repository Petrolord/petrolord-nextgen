# Pressure is not gauge pressure

The gauge on the vessel reads 600.000000 psig. Every correlation downstream of it works at 614.700000 psia, and the 14.7 between them is the difference between a gas the engine can describe and one it cannot.

{{panel:fc-separator-explorer}}

## The three streams as the studio reads them

| stream | gauge psig | absolute psia | degF | gas gravity |
| --- | --- | --- | --- | --- |
| ABANA-1 test separator | 600.000000 | 614.700000 | 95.000000 | 0.680000 |
| ABANA-2 production separator | 600.000000 | 614.700000 | 95.000000 | 0.680000 |
| AGBAMI three-phase | 350.000000 | 364.700000 | 110.000000 | 0.700000 |

The absolute column is the gauge column plus 14.7. The engine states that on the row rather than hiding it, because the two pressures both belong to the same vessel and a reader has to be able to see which is which.

## Why the gas law will not take a gauge pressure

Density is proportional to absolute pressure. A gas at 0.000000 psig is not a gas with no density, it is a gas at 14.7 psia. Feed a gauge pressure into the gas law and the density falls to zero at atmospheric conditions.

At separator pressures the error is quieter. Using 600.000000 in place of 614.700000 moves Ppr, z, the density, the settling velocity and the diameter, all by amounts too small to look wrong on a report.

## Which pressure each step wants

The absolute pressure feeds the reduced pressure and the gas law. Ppr on the ABANA streams is 0.922896 and on AGBAMI 0.549797, and both were built from the absolute figure.

The gauge pressure feeds the K lookup, because the derating rule is written against gauge pressure above 100 psig. Both are live inside one sizing run, and neither substitutes for the other.

## The refusals on a pressure

A pressure that is missing or out of domain is refused by name and by role. A gas density with no absolute pressure gives "pPsia must be a finite, positive absolute pressure (got undefined)". A K lookup with no gauge pressure gives "pPsig must be a finite, non-negative gauge pressure (got undefined)", and at a negative gauge pressure it gives "pPsig must be a finite, non-negative gauge pressure (got -20)".

Read the two messages side by side and the naming does the teaching: pPsia must be positive, because a gas at zero absolute pressure is not a gas, while pPsig only has to be non-negative, because zero gauge is ordinary atmospheric pressure.

## The mistake

Taking the pressure off a drawing without reading its label. A diagram carrying a bare pressure is almost always saying psig, and a correlation that wants psia will accept it without complaint. The check is cheap: at these conditions the absolute figure is 614.700000 psia against a gauge 600.000000 psig, and a number that has not been moved by the atmosphere has skipped a step.

## Exercise

Give the absolute pressure for each of the three streams from its gauge pressure. Then say which pressure feeds the reduced pressure, which feeds the K lookup, and why one of the two engine messages demands a positive value while the other accepts zero.
