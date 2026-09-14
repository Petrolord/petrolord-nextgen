# The optimal path

The optimal path is every branch the owner would take or could face under the best strategy. It runs through one branch at each decision node reached, and through every branch of each chance node on it.

{{panel:ec-tree-explorer}}

## The EKPAN tree, marked

| path | branch | branchValue | onOptimalPath |
| --- | --- | --- | --- |
| 0 | Drill | 105.0000 | true |
| 0.0 | . Success | 420.0000 | true |
| 0.1 | . Marginal | 170.0000 | true |
| 0.1.0 | . . Develop | 170.0000 | true |
| 0.1.1 | . . Sell | 140.0000 | false |
| 0.2 | . Dry hole | -25.0000 | true |
| 1 | Farm out | 37.7500 | false |
| 1.0 | . Success | 95.0000 | false |
| 1.1 | . Marginal | 30.0000 | false |
| 1.2 | . Dry hole | 0.0000 | false |
| 2 | Walk away | 0.0000 | false |

## Reading the flags

At the root, a decision, only Drill is on the path. Below it the drill chance node picks nothing, so all three of its outcomes are on the path: Success, Marginal and Dry hole, including the dry hole worth -25.0000. Under Marginal sits another decision, and there only Develop is on the path, at 170.0000 against Sell's 140.0000. Farm out and Walk away are off the path, and so is everything beneath them.

## A strategy for every outcome

The path reads as a plan for every contingency: drill; if the well succeeds, take 420.0000; if it finds a marginal accumulation, develop; if it is dry, accept -25.0000. It does not say which outcome will happen. It says what the owner does in each one. That is why the dry hole is on the optimal path. The path includes the bad outcomes of the chosen move, because choosing to drill means facing them.

## Branches below a branch not taken

A branch below a branch that is not taken is never on the optimal path. The farm-out's three outcomes read false, false and false, even though the farm-out's success at 95.0000 is a perfectly good outcome. They are off the path because the owner never reaches them, not because they are poor. The same holds for Sell under the marginal find: it is off the path because Develop is better there, and it would be off the path anyway if the owner had not drilled.

## The mistake

The careful mistake is reading the optimal path as the single line from the root to the best payoff, Drill then Success. That line leaves out the dry hole, which carries probability 0.500000, and the marginal find's develop decision, which the owner must be ready to make. A plan that has only the success written down has no answer for half the outcomes. The opposite mistake is reading a false flag as a verdict on a branch's value. The farm-out's outcomes are false because Farm out lost at the root, 37.7500 against 105.0000, and their payoffs are unchanged by that.

## What it refuses

The path is a label on the tree the engine was given. It never adds a branch, never marks a branch the owner would reach only by changing a decision, and never distinguishes a likely outcome from an unlikely one: a true flag on Success and a true flag on Dry hole mean the same thing, reachable under the best strategy.

## Exercise

Mark every EKPAN tree branch true or false by hand, starting at the root and applying the decision and chance rules on the way down. Then write the optimal strategy as a plan covering every outcome, and explain why the dry hole is on the path while the farm-out's success is not.
