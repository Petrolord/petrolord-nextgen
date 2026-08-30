# Speed, and what it costs

The one lever, and its exponent.

{{panel:hy-surge-explorer}}

## The sweep

Slant well, kcl_polymer, closed:

| trip speed | pressure |
|---|---|
| 0.2 m/s | 681695.8775991246 Pa |
| 0.5 m/s | 981472.927055977 Pa |
| 1.0 m/s | 1485039.00940065 Pa |
| 1.5 m/s | 2291032.362776896 Pa |

## The exponent

From 0.5 to 1.0 m/s the pressure goes up by a factor of 1.5130718010278368. Doubling the speed does NOT double the pressure.

The exponent is the log of that ratio over the log of 2, which is 0.5974804505612286.

## Why below one

Because the annular flow at these velocities is largely laminar and the mud is shear thinning. In laminar flow of a power-law fluid the pressure loss goes as velocity to the power n, and n for this mud is around 0.75 to 0.84.

The measured exponent is lower still, because the effective velocity includes the clinging term, which shifts where on the curve each case sits.

## What that means for the driller

Slowing down helps, and it helps less than proportionally.

Halving the trip speed from 1.0 to 0.5 m/s takes 33.9093 percent off the pressure. Halving it again would take rather less.

So there is a point beyond which slowing down is buying very little and costing a great deal of rig time.

## Where the real limit is

Not usually the average speed but the PEAK. A string is not run at a constant speed: it accelerates out of the slips, runs, and decelerates into them.

The peak velocity during a stand can be double the average, and the surge pressure follows the peak rather than the average. This model takes one speed and computes one pressure, so it has to be given the peak to be useful.

Giving it the average understates the surge, and that is the commonest error in using a surge calculation.

## The acceleration term

There is also a pressure from ACCELERATING the mud column, which is proportional to the acceleration rather than the velocity.

This model does not have it. On a long string starting from rest it is real and it is the first thing a transient surge model adds.

## Exercise

Compute the exponent relating pressure to speed between each adjacent pair of rows in the table.

They are not all the same. Say which pair has the highest exponent and what that says about the flow regime there.
