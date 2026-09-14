# The story so far

This tier makes one argument: a value of information is only as good as the numbers under it, and the engines say when those numbers cannot all be true, when they are not chances at all, and, much more quietly, when a blank became a zero.

## Inputs that contradict each other

Typed indicator chances and posteriors imply outcome chances of their own. IRRI, with both indicators typed as 20 / 80 percent, implies 0.200000 / 0.800000 against a stated 0.300000 / 0.700000. The repaired Analyzer reports EMV without information 15.00 and EVPI 63.00 and withholds the value of information. Before the EC4-0 repair it printed a gross voi of -15.00, below the floor Bayes guarantees, and the published certainPosteriorsWithheld case printed 245.00, above its EVPI of 63.00.

The check passes a delta of up to 0.005. Rounding the posteriors of the EKPAN lottery's survey to 65 and 10 percent implies 0.353000 and still passes, with a gross voi of 20.51 against 19.84 at full precision. Rounding to 65 and 8 percent implies 0.342200 and is withheld.

## Bigger lotteries

On the published three outcome, four action lottery, Drill alone is worth 109.0000, Drill with partner 54.5000, Farm out 31.0000 and Relinquish 0.0000, with an EVPI of 24.0000. Drill with partner is exactly half of Drill alone at every probability, so it is never best. A three-reading survey on it has an EVII of 1.2000 and, at a cost of 12.0000, a net value of -10.8000.

## The decision brief

Decision Studio adds a next best alternative and an advantage to the tree's result: for the EKPAN tree, 105.0000 against 37.7500, an advantage of 67.2500; for OKRIKA, 87.0000 against 48.0000, an advantage of 39.0000. A linked Monte Carlo payoff enters at its mean. Read at its P90 of 185.0000, the low case, the EKPAN tree would fall to 37.7500 and the choice would flip to the farm-out.

## Refusals and silent defaults

The rollback refuses probabilities that miss 1 by more than 1e-6, so thirds typed as 0.333 are refused while 0.3333333 rolls back to 60.0000. It charges a cost typed as "abc" as zero, lifting a branch from 15.0000 to 20.0000 without a message. The half percent boundary holds only because the repaired check adds 1e-12 to absorb 0.0050000000000000044.

## Numbers to distrust

The EKPAN lottery's drill wins at 75.7500 while losing money with probability 0.650000. An exact tie names "Drill Exploration Well" beside an EMV without information of 0.00. A net card of 0.00 at a survey cost of 32.996 sits beside a verdict that says positive. A survey at accuracy 0.600000 moves the posterior and is worth 0.0000.

## Exercise

For IRRI, write what the Analyzer reports and what it withholds, and the gross voi it printed before the repair. Then name the result behind each of these: a branch worth half of another at every probability, a cost typed as text, a net card of 0.00 beside a positive verdict, and a survey worth 0.0000 that still moves a posterior.
