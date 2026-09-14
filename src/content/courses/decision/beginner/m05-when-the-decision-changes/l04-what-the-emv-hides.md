# What the EMV hides

An EMV is a probability-weighted average, and the number it prints is usually one no outcome delivers. On the EKPAN lottery the drill is worth 75.7500 million USD, and a well drilled at that prospect makes either 365.0000 or loses 80.0000.

{{panel:ec-tree-explorer}}

## Two branches, four outcomes

At the stated success probability of 0.350000:

| action | emv | money on success | money on a dry hole | chance of losing money |
| --- | --- | --- | --- | --- |
| Drill | 75.7500 | 365.0000 | -80.0000 | 0.650000 |
| Farm out | 33.2500 | 95.0000 | 0.0000 | never |

The drill's money after its cost is 420.0000 less 55.0000 = 365.0000 on success and -25.0000 less 55.0000 = -80.0000 on a dry hole. Weighted, 0.350000 x 365.0000 + 0.650000 x -80.0000 = 75.7500. Neither outcome is near it.

## The tree hides the same way

On the EKPAN tree, where a marginal find is developed, the drill branch is worth 105.0000 and delivers one of three amounts after the drill cost: 365.0000 with probability 0.350000, 115.0000 with probability 0.150000, and -80.0000 with probability 0.500000. The chance of losing money on the drill branch is 0.500000, and 105.0000 is not among the three outcomes.

## What the engine cannot see

The rollback is risk neutral. It maximises expected money, and there is no utility function and no risk aversion setting in either module. Drill at 75.7500 beats Farm out at 33.2500 because its mean is larger, and the engine has no way to prefer an action that never loses. A company that cannot absorb a loss of 80.0000 on one well may rationally take the farm-out, and the tree will still recommend the drill.

## The mistake

The careful mistake is quoting the EMV as what the well will make. A board told "the well is worth 75.7500" hears a forecast, and in 0.650000 of cases the result is a loss of 80.0000.

The opposite mistake is treating the loss chance as a verdict on the EMV. A drill that loses money with probability 0.650000 is still the better choice on expected money here, by a wide margin.

A third error concerns linked payoffs. When a terminal is linked to a Monte Carlo NPV summary, only its mean enters the rollback, so the summary's spread is hidden as well: EKPAN's tree reads 105.0000 whether the success payoff is 420.0000 flat or a summary with mean 420, P90 185 and P10 710.

## What it refuses

The engine returns an EMV, the best branch and the optimal path, and nothing about the distribution of outcomes along that path. Nothing in the rollback reports a chance of loss, a worst case or a range.

## Exercise

For the EKPAN lottery at 0.350000, write each outcome of Drill and Farm out after costs with its probability, and recompute both EMVs. Then give the chance of losing money on the drill branch of the EKPAN tree, and explain why the engine recommends Drill whatever a company's appetite for a loss of 80.0000.
