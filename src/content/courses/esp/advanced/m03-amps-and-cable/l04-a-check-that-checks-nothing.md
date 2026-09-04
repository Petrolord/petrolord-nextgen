# A check that checks nothing

`selectCable` applies two tests and reports both. One of them cannot fail on the shipped table, and saying that precisely is more useful than saying the cable is wrong.

{{panel:pd-power-explorer}}

## True by construction

A candidate is acceptable when the drop check passes AND the ampacity check passes. A candidate that declares no ampacity passes the ampacity test, and the shipped table declares none: the column is absent on 6 AWG, 4 AWG, 2 AWG, 1 AWG and 1/0 AWG alike.

So on every run over the shipped table, every candidate passes the ampacity check and the acceptable flag equals the drop flag on every candidate. The AND has one live operand, on both golden electrical cases and both teaching wells.

## The gate that names it

The published gate puts 192 hp of shaft on a 200 hp, 200 A, 4160 V motor, which is 192.000000 A down the hole, over 1000 ft.

| Candidate | Drop, percent | Drop check | Ampacity check | Acceptable |
| --- | --- | --- | --- | --- |
| 6 AWG | 3.733233 | true | true | true |
| 4 AWG | 2.347636 | true | true | true |
| 2 AWG | 1.476425 | true | true | true |
| 1 AWG | 1.171501 | true | true | true |
| 1/0 AWG | 0.928674 | true | true | true |

The string is short, so even the smallest conductor drops only 155.302473 V, inside 5 percent of 4160 V. The first candidate passes, and 6 AWG is selected at 192 A.

## The same run with a column supplied

Given a manufacturer ampacity column the check bites at once: 6 AWG declares 105, 4 AWG declares 140, 2 AWG declares 190, and all three fail at 192.000000 A. 1 AWG declares 220 and is taken, at 1.171501 percent of drop, and the cable loss falls from 51.646421 kW to 16.206821 kW.

No arithmetic changed between those two runs. The data changed.

## What it refuses, and why

The package refuses to ship an ampacity column, on purpose. Ampacity belongs to the insulation system and the well temperature, so it is an input and not a property of the copper. The same refusal runs through the package: no manufacturer part numbers with invented curves behind them either.

That is defensible. Leaving the check in place with nothing to check against is what makes the report misleading.

## Say it the right way round

The honest statement is that the check does not currently check anything. It is not that the cable is wrong.

That is the difference between a useful report and a false alarm. The teaching well IBENO-2 draws 18.857046 A and picks 6 AWG, which no ampacity table would object to, so calling that pick unsafe is simply false. Saying the ampacity half of the method did not run is true on IBENO-2, true on the 192 A gate and true everywhere else.

## Exercise

Run the 192 A gate on the shipped table, record the ampacity flag on all five candidates, and state which single flag decided the pick.

Then run it again with the ampacity column supplied and write down the new cable and the change in cable loss.
