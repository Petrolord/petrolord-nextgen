# Four levels deep

A deep tree is rolled back by the same two operations taken one level at a time: a maximum at a decision, a weighted sum at a chance node, and each branch cost paid once on its own branch. The published deepAlternation tree alternates four levels and rolls back to 6.0000.

{{panel:ec-tree-explorer}}

## The tree as the engine returns it

| branch | probability and cost | child | branchValue | onOptimalPath |
| --- | --- | --- | --- | --- |
| go | cost 4.0000 | chance "L1" emv 10.0000 | 6.0000 | true |
| . up | probability 0.500000 | decision "L2" emv 23.0000 | 23.0000 | true |
| . . push | cost 6.0000 | chance "L3" emv 29.0000 | 23.0000 | true |
| . . . win | probability 0.700000 | terminal payoff 50.0000 | 50.0000 | true |
| . . . lose | probability 0.300000 | terminal payoff -20.0000 | -20.0000 | true |
| . . hold | none | terminal payoff 12.0000 | 12.0000 | false |
| . down | probability 0.500000 | terminal payoff -3.0000 | -3.0000 | true |
| stop | none | terminal payoff 1.0000 | 1.0000 | false |

The root L0 is a decision, L1 a chance node, L2 a decision and L3 a chance node.

## Four lines, deepest first

Level four, the chance node L3: 0.700000 x 50.0000 + 0.300000 x -20.0000 = 29.0000.

Level three, the decision L2: push is 29.0000 less its cost 6.0000 = 23.0000, against hold at 12.0000, so L2 is 23.0000.

Level two, the chance node L1: 0.500000 x 23.0000 + 0.500000 x -3.0000 = 10.0000.

Level one, the root L0: go is 10.0000 less its cost 4.0000 = 6.0000, against stop at 1.0000, so the root is 6.0000 and the engine and golden agree.

OKRIKA has the same shape: a decision to appraise, a chance node for the result, a decision to develop or sell, and a chance node for the size of the field. Its four lines give 375.0000 and 56.0000, then 225.0000 and 25.0000, then 105.0000, then 87.0000 at the root.

## Two costs, two levels

The cost of push, 6.0000, is paid only on the up branch, which happens with probability 0.500000. The cost of go, 4.0000, is paid on every path through the root's best branch. Each is subtracted where its branch sits, before the chance node above it weights. Had hold beaten push at L2, the 6.0000 would never have been paid at all, because a cost is charged only when its branch is taken.

## The mistake

The careful mistake is gathering every cost in the tree and subtracting the lot at the root. That charges the push cost on the down branch too, where nobody pushes. The published chanceRootWithBranchCosts tree shows the size of the error: the correct root is -3.0000, and subtracting every cost once after weighting gives -8.6000.

The other mistake is reading the optimal path as a forecast. The path runs go, then both up and down, then push, then both win and lose. It says what to do at each decision, whatever the chance nodes deliver; it never says which outcome arrives, and 6.0000 is the average of paths that pay quite different amounts.

## What it refuses

Depth hides nothing from the engine's checks. A published refusal puts a bad distribution two levels down and the whole tree is refused: "Chance branch probabilities sum to 0.200000, expected 1 (at node "cc")". There is no partial rollback of the parts that are valid. Depth also adds no discounting, however many stages the tree describes, and no risk attitude.

## Exercise

Roll back deepAlternation level by level and confirm 29.0000, 23.0000, 10.0000 and 6.0000. Then name every branch that reads onOptimalPath false, and say why the cost of push must be subtracted before L1 weights its branches.
