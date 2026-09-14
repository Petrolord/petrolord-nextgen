# Taking the best branch

A decision node is worth its best branch value, and it records which branch that was. On the EKPAN tree the root takes 105.0000 million USD from Drill, and the marginal find inside the drill takes 170.0000 from Develop.

{{panel:ec-tree-explorer}}

## The root of the EKPAN tree

| branch | cost | child value | branchValue |
| --- | --- | --- | --- |
| Drill | 55.0000 | 160.0000 | 105.0000 |
| Farm out | none | 37.7500 | 37.7500 |
| Walk away | none | 0.0000 | 0.0000 |

The root takes the maximum of 105.0000, 37.7500 and 0.0000. Its EMV is 105.0000 and its best branch index is 0, Drill. The comparison is made on branch values, each child already less its cost, so the drill cost of 55.0000 is counted before Drill is set against anything.

## The decision inside the drill

The marginal find is a decision node reached only through the drill's chance node. Develop leads to a payoff of 260.0000 at a cost of 90.0000, a branch value of 170.0000. Sell pays 140.0000 at no cost. The node takes 170.0000 and marks Develop. That value, not either payoff, is what the drill chance node weights at probability 0.150000. A decision node deep in a tree is solved exactly like the root, and its answer feeds the node above it.

## A published check

The published drillFarmOut tree has branch values Drill 43.0000, Farm out 18.0000 and Do nothing 0.0000. The engine returns EMV 43.0000 with best branch index 0, and the golden agrees at 43.0000. The pattern is the same: a risky branch whose weighted value, after its cost, beats a safer one.

## What the Builder's cards say

The Decision Tree Builder reads four cards off the root. Optimal EMV is the root EMV, 105.0000 on the EKPAN tree. Recommended first move is the root's best branch label, Drill. Next best alternative is the largest other root branch value, the farm-out's 37.7500. Decision advantage is the difference, 67.2500. The advantage is how much EMV the owner gives up by taking the next best move instead. It is a difference of averages, and says nothing about how often the drill does worse than the farm-out.

## The mistake

The careful mistake is comparing the wrong numbers. Setting the drill node's 160.0000 against the farm-out gives the right move on the EKPAN tree and a margin inflated by the full drill cost, because 160.0000 is the value before 55.0000 is paid. On the marginal find, comparing payoffs gives Develop at 260.0000 against Sell at 140.0000, the right branch at a value 90.0000 too high, and that inflated value would then be weighted into the drill node. A decision node only ever compares branch values.

## What it refuses

A decision node needs at least one branch, and one with none is refused with `Decision and chance nodes need at least one branch (at node "empty")`. Beyond that it takes no view. It does not add a walk-away branch that was never drawn, does not refuse a node where every branch loses money, and does not weigh how risky a branch is. It picks the largest branch value, and a later branch displaces an earlier one only by being strictly greater.

## Exercise

Write the EKPAN tree's three root branch values from their children and costs, and take the maximum. Solve the marginal find the same way. Then work the Builder's four cards for the EKPAN tree and say what the decision advantage of 67.2500 measures and what it does not.
