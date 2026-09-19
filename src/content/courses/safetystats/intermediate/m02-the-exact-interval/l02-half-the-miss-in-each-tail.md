# Half the miss in each tail

{{panel:ss-intervals-explorer}}

The same count of 7, on a base of 1 over 1 hour, at four confidence levels:

| confidence | count lower | count upper |
| --- | --- | --- |
| 0.800000 | 3.894766804876 | 11.770914461548 |
| 0.900000 | 3.285315691895 | 13.148113802432 |
| 0.950000 | 2.814363051520 | 14.422675361702 |
| 0.990000 | 2.037337478700 | 17.133593268913 |

As the confidence climbs, the lower limit falls and the upper limit rises. Nothing about the count changed. Only the share of the truth you are willing to miss did.

## What alpha is

The miss is alpha, one minus the confidence. At 0.950000 the interval is allowed to miss the true rate five times in a hundred. The engine's interval is central: it splits that miss evenly and leaves alpha/2 in each tail. At 95 percent that is 2.5 percent below the lower limit and 2.5 percent above the upper one. Every lower limit in the table is the Poisson mean at which 7 or more events has probability alpha/2, and every upper limit is the mean at which 7 or fewer has that same probability.

## Reading the table

From 0.800000 to 0.990000 the upper limit climbs from 11.770914461548 to 17.133593268913 and the lower falls from 3.894766804876 to 2.037337478700. The upper side moves further than the lower side does. A count cannot go below zero and has no ceiling above, so the Poisson distribution is skewed to the right, and the upper tail has further to stretch as the miss is squeezed.

That is also why the interval is lopsided around the count. At 95 percent the count is 7, and the lower limit of 2.814363051520 sits much closer to it than the upper limit of 14.422675361702 does. An interval written as the rate plus or minus a single figure could never show this, which is one reason the engine returns two limits.

## At zero events

The split looks different at a count of 0. No mean makes zero or more events improbable, because zero or more always happens, so the lower limit is 0 at every confidence. Only the upper tail is left to work with, and the count upper limit is the mean at which zero events has probability alpha/2. The engine reports that limit, and a derived column confirms it is minus the natural log of half the miss: 2.302585092994 at 0.800000, 2.995732273554 at 0.900000, 3.688879454114 at 0.950000 and 5.298317366548 at 0.990000. Module three builds on those four figures.

## Why split evenly

An even split treats a true rate that is higher than the count suggests and one that is lower as equally worth guarding against. A safety manager may care more about the high side. The engine still returns the central interval, and the zero events module shows how a one-sided figure can be read out of it: the central 90 percent interval leaves 5 percent in the upper tail, which is a one-sided 95 percent upper limit.

## Exercise

For N = 7 at 0.900000, subtract the count lower limit from 7 and subtract 7 from the count upper limit, using the figures in the table. State which side of the count is longer and by roughly how much, and say what the skew of the Poisson distribution has to do with it.
