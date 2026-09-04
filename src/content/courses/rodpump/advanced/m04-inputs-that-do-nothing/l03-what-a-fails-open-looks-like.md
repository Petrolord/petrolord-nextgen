# What a fails-open looks like

A wrong answer with an error beside it is a nuisance. A plausible answer with nothing beside it is the problem, and there are two of those stacked here.

{{panel:pd-balance-explorer}}

## The first level

A caller types a structural unbalance and a crank offset into the design function and reads back a gearbox rating. On ODUMA-4 that rating is 134.032962807 percent from a balance that did read those two numbers and 140.630030060 percent from one that did not. Both are numbers, both sit above 100 percent, and the design run is identical between the two calls: plunger stroke equal, peak polished rod load equal.

The caller's inputs were not wrong. They were absent, and absence has no field.

## The second level, one function down

`balanceUnit` does read them, but not evenly. It forwards `structuralUnbalanceLb` to `counterbalanceEffect` and does not forward `crankOffsetDeg`. That function reads the torque factor a quarter turn from the bottom of the stroke, which is where the counterweight moment peaks only when the offset is zero. With an offset the moment peaks a quarter turn less the offset, so the factor is read at the wrong crank angle. The engine's own docstring states the assumption the offset breaks: the factor is taken where the moment is at its maximum.

## What that costs

| Offset, deg | Reported effect, lb | Effect at the true peak, lb | Error |
| --- | --- | --- | --- |
| -30.0 | 19754.454642 | 25368.233655 | -22.129168 percent |
| -20.0 | 17078.567528 | 20021.408966 | -14.698473 percent |
| -10.0 | 14856.176770 | 16005.068050 | -7.178297 percent |
| 0.0 | 13508.771698 | 13508.771698 | 0.000000 percent |
| 10.0 | 12740.372690 | 12013.364233 | 6.051664 percent |
| 20.0 | 12393.212710 | 11287.785540 | 9.793127 percent |
| 30.0 | 16428.506359 | 14972.960158 | 9.721165 percent |

Every row reads the torque factor at crank sample 89, where it is 45.129341579 in. The moment actually peaks at sample 119 at an offset of -30.0 deg, where the factor is 35.142593819 in, and at sample 69 at 20.0 deg, where it is 49.548915300 in. At zero offset the two columns agree exactly, which is what says the offset is the cause.

## Why this one reaches the field

Inside one `balanceUnit` return the moment and the peak torque know about the offset and the counterbalance effect does not. That effect is how a counterbalance is quoted and how it is measured at the polished rod, so a wrong one is a wrong field target: a crew balances to a number the other two fields of the same object disagree with.

## Reading two levels together

One input ignored once is an omission. The same input ignored twice, by two functions, for two reasons, is a pattern: one is a missing read and the other a missing forward, and neither shows up as anything but a number that looks fine.

## Exercise

Write the reported counterbalance effect and the effect at the true moment peak at offsets of -20.0, 0.0 and 20.0 deg.

Then say why the zero offset row is the one that proves the cause.
