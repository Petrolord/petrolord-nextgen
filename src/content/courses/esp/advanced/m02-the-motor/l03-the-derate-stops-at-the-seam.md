# The derate stops at the seam

Two modules read the same shaft power and the same nameplate. One applies the thrust derate and one does not. That is not an oversight, and the reason it is correct is worth more than the fact.

{{panel:pd-power-explorer}}

## Where the derate is applied and where it stops

`espDesign.sizePump` returns utilisation against the motor's usable rating: shaft power over nameplate power times the derating factor. `espMotorCable.motorCurrent` returns the electrical load fraction, shaft power over the plate, with no derate anywhere in it.

On the published gassyOffshore design, 125.69771587 hp on a 250 hp plate, the electrical fraction is 0.5027908635 and stays there at every derate.

| Derate, percent | Factor | Selection fraction | Gap, points |
| --- | --- | --- | --- |
| 0 | 1.0000 | 0.5027908635 | 0.000000 |
| 5 | 0.9500 | 0.5292535405 | 2.646268 |
| 10 | 0.9000 | 0.5586565150 | 5.586565 |
| 12 | 0.8800 | 0.5713532540 | 6.856239 |
| 15 | 0.8500 | 0.5915186629 | 8.872780 |
| 20 | 0.8000 | 0.6284885794 | 12.569772 |

## Both are right, for different reasons

The published selection rule divides required horsepower by the derating factor, so utilisation is measured against what the motor may be asked to do. That is what a selection decision needs.

The current is a different physical claim. PetroWiki, ESP motors, gives motor current as nearly linear with horsepower loading, and cutting a permissible load does not change the work the shaft is doing. A motor turning 125.69771587 hp draws the same amps whether its derating factor is 1.0000 or 0.8000. If the derate reached the current, the amps would rise while the mechanical duty stood still, and no meter would read that.

The derate stopping at the module boundary is the arithmetic doing the right thing twice, not a value leaking out of a function.

## The size of the gap, in closed form

The gap between the two fractions is the electrical load fraction times the quantity one over the derating factor less one. Evaluated at a load fraction of 0.89714 with a 12 percent derate, that comes to 12.2337 points. The gap grows with both the loading and the derate, and it is zero only when the derate is zero.

## What it refuses

Neither module tells you which fraction it is holding. The two values are returned from two functions under the same field name, with no unit, no qualifier and no warning when they disagree by 12.569772 points.

The engine also refuses to push the derate downstream. The amps, the voltage drop, the cable pick and the weak estimate flag are all built on the underated fraction, so a design that changes only its thrust derate produces an identical electrical result.

## The mistake

Deciding one of the two is wrong because they disagree. The disagreement is the correct output of two different questions. Concluding otherwise leads to fixing the one that is right and losing either a selection rule or a current.

## Exercise

Read the electrical load fraction and the selection load fraction for the published gassyOffshore design at 0, 12 and 20 percent derate.

Then state which of the two the motor current is built on, and give the physical reason.
