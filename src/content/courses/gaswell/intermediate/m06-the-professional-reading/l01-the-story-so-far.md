# The story so far

Five modules, one well, and a number that changes all the way down it.

## The claim

A loading verdict belongs to a station, and the station that decides is never the one with the gauge on it. Everything this tier did was carry that consequence into the three functions a point check cannot reach: the profile, the sizing and the plunger.

## What each module established

**Module one.** A traverse is a list of stations, each with its own pressure, temperature, z and diameter, and it is handed in rather than solved. On EBOCHA-5 the gas density climbs from 2.8547437868 lbm/ft3 at 0.0 ft to 4.2000760651 lbm/ft3 at 7500.0 ft, the critical rate climbs with it, and the ratio falls at every step: 1.1605604334, 1.1184659554, 1.0761623743, 1.0340528848, 0.9979085215, 0.9619521855. The crossing sits between 4500.0 ft and 6000.0 ft, inside the deepest 40.0000 percent of the string.

**Module two.** A verdict is the worst station, not the average and not the first. EBOCHA-5 reads `loaded = true` with a margin of -3.80478145 percent at a controlling station of 7500.0 ft, while a point check at the wellhead reads `loaded = false` at 1.1605604334 and a margin of 16.05604334 percent. Same well, same day, opposite answers.

**Module three.** A velocity string is a search for the largest bore whose ratio clears one. At the controlling station the answer is 3.476 in at 1.0022156322. At the wellhead, on the same list and the same well, it is 3.740 in, which is larger than the string already in the hole, so the sizing reports that no workover is needed while the bottom 40.0000 percent of the tubing loads.

**Module four.** A plunger is a static balance and a stopwatch. OGUTA-2 needs 248.1897322873 psia to lift and has 720.0 psia of casing, but the cycle asks 9561.17363265 scf/bbl and the well makes 5900.0 scf/bbl, so `feasible` is false on the gas and not on the pressure.

**Module five.** Four remedies exist, the engine scores all of them and chooses none. It returns ratios and requirements to ten digits and not one cost, duration or date.

## The one sentence

A gas well is a column of stations, the deepest one decides, and every remedy has to be argued there.

## What this tier did not settle

The correlation. It was chosen once, from 880.0 psia at the top of the well, and then used at every station including the one that controlled. This tier used that choice and never audited it, and the same is true of the station the sizing was handed and of the flags the plunger screen does not compute.

## Exercise

Write the five claims in one sentence each, and beside each the number you would use to defend it.

Then say which of the five you could not have made from a wellhead reading alone.
