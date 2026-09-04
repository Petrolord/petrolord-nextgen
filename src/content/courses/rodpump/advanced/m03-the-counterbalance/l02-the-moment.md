# The moment

Net gearbox torque is two terms. One is the rod load through the torque factor, the other is a counterweight sine, and the moment is the size of the second.

{{panel:pd-balance-explorer}}

## Two terms through one revolution

The rod term is the torque factor times the polished rod load. The counterweight term is a sine anchored to the bottom of the stroke. On ODUMA-4, balanced, at every fifteen degrees of crank:

| Crank, deg | Torque factor, in | Rod torque, in-lb | Counterweight, in-lb | Net, in-lb |
| --- | --- | --- | --- | --- |
| 0.0 | -0.727786321 | -9705.898810 | 10639.719481 | 933.820672 |
| 15.0 | -18.627647824 | -214901.846526 | 168040.101235 | -46861.745291 |
| 30.0 | -34.558953004 | -539554.447952 | 313988.827788 | -225565.620164 |
| 45.0 | -45.311100991 | -804027.881773 | 438539.734619 | -365488.147154 |
| 60.0 | -49.617592869 | -884506.686716 | 533204.883257 | -351301.803460 |
| 75.0 | -48.696603752 | -699739.942889 | 591533.000263 | -108206.942626 |
| 90.0 | -44.821028030 | -600005.000534 | 609549.120856 | 9544.120322 |

At 90.0 deg the counterweight term reads 609549.120856 in-lb, all but the moment of 609641.972281 in-lb, because a quarter turn from the anchor is where the sine peaks. At 270.0 deg the same term reads -609549.120856 in-lb.

## Why the net is not the difference of two smooth curves

The rod torque is not smooth. Between 240.0 and 255.0 deg the polished rod load falls from 11077.067719 lb to 2835.207157 lb, so the rod torque collapses from 552620.335836 in-lb to 157029.287601 in-lb while the counterweight term moves far less, and the net swings to -434503.712662 in-lb. The valve transfers on the card are what put that step into the torque.

## Sweeping the moment past balance

Moving the counterweight moment away from the balance point moves the two peaks in opposite directions, and the crossing is the balance.

| Moment, fraction of balanced | Upstroke peak, in-lb | Downstroke peak, in-lb |
| --- | --- | --- |
| 0.0000 | 950041.862527 | 646133.044285 |
| 0.2500 | 824558.197101 | 498249.794219 |
| 0.5000 | 699710.830131 | 354021.785924 |
| 0.7500 | 574863.463162 | 300936.138069 |
| 0.9000 | 499955.042980 | 390384.112943 |
| 1.0000 | 450016.096192 | 450016.096192 |
| 1.1000 | 400077.149404 | 509648.079442 |
| 1.2500 | 325168.729223 | 599096.054316 |
| 1.5000 | 317353.287725 | 748176.012439 |
| 2.0000 | 622174.273866 | 1046335.928686 |

The larger of the two is what the gearbox sees, so overweighting costs as surely as underweighting.

## What it refuses

The condition looks only at two peaks. It does not care what the net torque does between them, so a balanced unit still carries a -434503.712662 in-lb swing through the valve transfer and the balance never sees it.

## Exercise

Read the net torque at 60.0, 90.0 and 270.0 deg for balanced ODUMA-4.

Then find the moment at which the upstroke and downstroke peaks cross, and say what the gearbox sees on either side of it.
