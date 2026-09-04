# The three ratio flags

Four bands sit in this function and three of them print the ratio they fired on. Every one is a strict inequality, which decides more than it looks like it decides.

{{panel:pd-power-explorer}}

## The four bands

`underCurve` fires at a head ratio below 0.85. `overCurve` fires above 1.15. `ampsHigh` fires at amps over nameplate above 1.05. `ampsLow` fires below 0.40.

Three of the four put a number in their message. `overCurve` does not, and the reason is worth noticing: more head than the curve allows is not a degree of anything, it is evidence that an input is wrong, and its message says so by listing the rate, the pressures, the fluid gradient and the stage count.

## The head ratio, swept

Reference stage ref-540-2500, 200 stages, 2500 bbl/d at 60 Hz, against an expected 5600.000000 ft.

| Head measured, ft | Head ratio | Flag |
| --- | --- | --- |
| 6720.000000 | 1.2000 | overCurve |
| 6440.000000 | 1.1500 | none |
| 5600.000000 | 1.0000 | none |
| 4872.000000 | 0.8700 | none |
| 4760.000000 | 0.8500 | none |
| 4759.440000 | 0.8499 | underCurve |
| 3920.000000 | 0.7000 | underCurve |
| 3080.000000 | 0.5500 | underCurve |

Nothing happens at the threshold itself. A stack making 4760.000000 ft where its curve says 5600.000000 ft raises no flag at all, and 4759.440000 ft raises one. Those two head readings differ in their fourth digit, and that is the whole of the distance between a silent result and a warning.

## The amps bands behave the same way

At amps over nameplate of exactly 1.0500 the flag is false; at 1.0505 it is true. At exactly 0.4000, which is 24.0000 A, the low flag is false; at 0.3999, which is 23.9940 A, it is true. Strict inequalities put the boundary value on the quiet side of every band, in both directions.

The low band carries the only message in the set that names a mechanism: 23.4000 A, an amps ratio of 0.3900, prints that the motor is at 39.0 percent of nameplate, which is where a gas-locked or pumped-off well sits.

## What the flags refuse

They refuse to rank themselves. A record can raise `underCurve` and a region flag together and the function offers no opinion about which matters more. `underCurve` refuses to choose among its own three causes, because wear, free gas through the stages and a wrong stage count produce the same ratio. And no band is adjustable: the four numbers are constants in the source, so a well that runs healthily at a different ratio will be flagged every time it is read.

## Exercise

In the panel walk the head ratio from 1.2000 down to 0.5500 and record every value at which a flag appears or disappears.

Then set the amps ratio to 1.0500 and to 0.4000 exactly, and write what each returns and why.
