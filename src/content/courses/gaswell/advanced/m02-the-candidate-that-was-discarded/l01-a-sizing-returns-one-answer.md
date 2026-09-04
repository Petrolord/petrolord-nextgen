# A sizing returns one answer

`sizeTubingForRate` returns three things: `rows`, `largestUnloaded` and `ok`. The second is one line out of the first, and it is the only line most people read.

{{panel:pd-remedy-explorer}}

## The list and the pick

The teaching well EBOCHA-5 is not a published case and no oracle has checked it. Sized at its controlling station, 7500.0 ft, 1500.0 psia, 653.67 degR and z 0.9142643742, at 3100.0 Mscf/d, under Coleman.

| Candidate, in | Flow area, ft2 | Critical rate, Mscf/d | Ratio | Unloads |
| --- | --- | --- | --- | --- |
| 3.958 | 0.0854434880 | 4010.445008120 | 0.7729815504 | false |
| 3.826 | 0.0798394103 | 3747.407462010 | 0.8272385726 | false |
| 3.740 | 0.0762905233 | 3580.834014580 | 0.8657201053 | false |
| 3.548 | 0.0686585475 | 3222.613396799 | 0.9619521855 | false |
| 3.476 | 0.0659002292 | 3093.146724566 | 1.0022156322 | true |
| 3.068 | 0.0513379000 | 2409.637406392 | 1.2865006128 | true |
| 2.441 | 0.0324984725 | 1525.374720469 | 2.0322875149 | true |
| 2.041 | 0.0227202653 | 1066.416841966 | 2.9069308342 | true |
| 1.610 | 0.0141377124 | 663.579159341 | 4.6716355635 | true |

`largestUnloaded` is 3.476 in at a ratio of 1.0022156322. The rows come back largest diameter first, and the pick is the first row in the list whose ratio reaches one.

## One velocity, nine areas

The critical velocity is 6.1224977520 ft/s on every row. It belongs to the station and not to the string, and the tubing enters only through the area. That is the mechanism of a velocity string: the actual velocity climbs from 4.7325778044 ft/s on 3.958 in to 28.6020782357 ft/s on 1.610 in while the number it must beat never moves.

## What a row carries

Each row carries idIn, ok, correlation, adjustment, rhoGasLbFt3, terminalFtS, velocityFtS, constant, areaFt2, criticalVelocityFtS, criticalRateMscfd, actualVelocityFtS, ratio and loaded. The correlation is on every row, as "coleman" or "turner", with the adjustment beside it as 1.0000 or 1.2000. The station is on no row at all. A row records the pressure and temperature it was given only through the density and the velocity they produced.

## The mistake

Reading `largestUnloaded` and stopping. The pick here clears the threshold in its fourth decimal, at 1.0022156322, while the next candidate down reads 1.2865006128. Those are very different engineering positions and `largestUnloaded` is the same field in both cases. A pick that barely reaches one is a workover recommendation with no margin in it, and only the row says so.

## What it refuses

It refuses to invent a winner. At 40.0 Mscf/d, `largestUnloaded` comes back null and the best ratio anywhere on the list is 0.0502326405, so nothing on the shelf carries that rate and the function says so rather than returning the least bad candidate. It also has no opinion about which station its pressure, temperature and z came from.

## Exercise

Size the list at the controlling station in the panel and write down the pick and the four rejections in order of ratio.

Then drop the rate to 40.0 Mscf/d and record what `largestUnloaded` returns and what the best ratio on the list is.
