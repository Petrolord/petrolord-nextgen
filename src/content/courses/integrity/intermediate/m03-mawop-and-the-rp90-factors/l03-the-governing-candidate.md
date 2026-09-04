# The governing candidate

Three candidates, three different limits, three different depths. The one that governs is not the weakest pipe and not the most heavily derated one.

{{panel:wi-annulus-explorer}}

## The published well

The annulus holds 1200 kg/m3. Three candidates are offered to `mawop`:

| Candidate | Role | Factor | Limit, Pa | TVD, m | Backup, kg/m3 | Allowable, Pa |
| --- | --- | --- | --- | --- | --- | --- |
| 9-5/8 production casing burst | outer-casing-burst | 0.5 | 40000000 | 1435.457478934607 | 1030 | 17606905.05541501 |
| 7 in production liner burst | inner-casing-burst | 0.8 | 35000000 | 1167.3419238429642 | 1100 | 26855228.63225454 |
| 4-1/2 tubing collapse | inner-tubing-collapse | 0.75 | 25000000 | 997.0400302755012 | 500 | 11905664.170969129 |

The governing candidate is the 4-1/2 tubing collapse and the MAWOP is 11905664.170969129 Pa.

## Why that one wins

`maaspRows` scans the rows and keeps the smallest allowable. It does not rank ratings and it does not rank factors.

The 9-5/8 carries the harshest factor of the three at 0.5, and a reader who stops at the factor column will call it the governing string. It is not. Its 40000000 Pa limit is large enough that even half of it clears the tubing.

The tubing wins on three counts at once. It has the smallest limit at 25000000 Pa, a factor of 0.75 that removes a quarter of it, and the thinnest backup column at 500 kg/m3, which makes its hydrostatic deduction the heaviest of the three despite it being the shallowest candidate.

The 7 in liner is the least constraining at 26855228.63225454 Pa, helped by a backup density of 1100 kg/m3 that is denser than the annulus fluid itself.

## The margin to the runner up

The runner up is the 9-5/8 at 17606905.05541501 Pa, so the governing margin is 5701240.88444588 Pa.

That number matters as much as the MAWOP does. A margin this wide says the answer is stable. You could raise the tubing collapse limit substantially before the 9-5/8 took over, so a small revision to the tubing data will not change which string you are managing the well around.

A narrow margin would say the opposite, that two strings are effectively co-governing and both sets of input data need to be right.

## Exercise

Reproduce the three rows in the panel and confirm the governing name and the MAWOP.

Then raise the tubing collapse limit step by step until the 9-5/8 takes over, and note the limit at which the swap happens.
