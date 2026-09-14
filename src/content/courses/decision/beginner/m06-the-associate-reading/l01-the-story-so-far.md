# The story so far

Two teaching fields and one engine carry every number this tier owns: EKPAN rolls back to 105.0000 million USD and chooses to drill, and OKRIKA rolls back to 87.0000 and chooses to appraise.

## What the engine is

Three node types do all the work. A decision takes the maximum of its branch values, a chance node their probability-weighted sum, a terminal its payoff. A branch value is the child's value less the branch cost. The engine is risk neutral, applies no discounting to payoffs that arrive already discounted, keeps the first branch listed on a tie, and refuses a chance node whose probabilities do not sum to 1 within 1e-6.

## EKPAN, one tree

| branch | cost | node value | branch value |
| --- | --- | --- | --- |
| Drill | 55.0000 | 160.0000 | 105.0000 |
| Farm out | none | 37.7500 | 37.7500 |
| Walk away | none | 0.0000 | 0.0000 |

The drill chance node is 0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000, with the marginal find developed at 260.0000 less 90.0000. Less the drill cost, the branch is 105.0000. A cost on a branch is paid before weighting: the published chanceRootWithBranchCosts tree is -3.0000, and subtracting its costs after weighting gives -8.6000.

A payoff linked to a Monte Carlo NPV summary enters at its mean, so EKPAN reads 105.0000 with a summary of mean 420. Read at that summary's P90 of 185 the root falls to 37.7500 and flips to the farm-out. The drill branch delivers 365.0000, 115.0000 or -80.0000 and loses money with probability 0.500000; its value of 105.0000 is none of them.

## OKRIKA, a sequence

Rolled back right to left, the development chance nodes are 375.0000 after a good appraisal and 56.0000 after a poor one. The later decisions take 225.0000 and the sale at 25.0000. The appraisal node is 0.400000 x 225.0000 + 0.600000 x 25.0000 = 105.0000, less 18.0000 = 87.0000, against Develop now at 33.6000 and Sell now at 48.0000. Without the option to sell after a poor result the appraisal branch is 15.6000 and the root sells now, so that later choice is worth 71.4000 inside the branch.

## Where the decision turns

On the EKPAN lottery, with two outcomes, Drill is 445 p - 80 and Farm out is 95 p. They cross at 80 / 350 = 0.228571; at the stated 0.350000 the drill is worth 75.7500 against 33.2500. A tie goes to the first branch listed: the published drillFarmOut tree ties at 0.200000 and names Drill.

## What the tier cannot tell you

Whether the probabilities are right, what a loss of 80.0000 means to the company holding the licence, or what it would be worth to learn the outcome before committing 55.0000.

## Exercise

Roll back EKPAN's tree and OKRIKA's sequence by hand and confirm 105.0000 and 87.0000. Then give EKPAN's drill against farm-out switch point, and name one number in this tier that looks like a recommendation and is only the tie rule.
