# Right to left

A tree is rolled back from its terminals toward its root, because no node has a value until every node to its right has one. OKRIKA's discovery is worth 87.0000 million USD, and that number can only be reached in one order.

{{panel:ec-tree-explorer}}

## The order on a small tree

The published twoStageSequential tree has a Test branch costing 5.0000 that leads to a chance node: Good at 0.400000, Bad at 0.600000. After Good sits a decision between Develop, paying 200.0000 at a cost of 50.0000, and Sell at 80.0000. Bad pays 20.0000.

Start at the far right. The decision after Good takes the larger branch value: 200.0000 less 50.0000 is 150.0000, against 80.0000, so the decision is worth 150.0000. Only now does the chance node have both of its children: 0.400000 x 150.0000 + 0.600000 x 20.0000 = 72.0000. The Test branch pays its cost on the way in, 72.0000 less 5.0000 = 67.0000, which is the engine's root and the golden's.

## OKRIKA, layer by layer

| layer | node | by hand | engine |
| --- | --- | --- | --- |
| 1 | development chance after a good appraisal | 0.750000 x 520.0000 + 0.250000 x -60.0000 | 375.0000 |
| 1 | development chance after a poor appraisal | 0.200000 x 520.0000 + 0.800000 x -60.0000 | 56.0000 |
| 1 | development chance if developed now | 0.420000 x 520.0000 + 0.580000 x -60.0000 | 183.6000 |
| 2 | after a good appraisal | develop 375.0000 less 150.0000 against sell 95.0000 | 225.0000 |
| 2 | after a poor appraisal | develop 56.0000 less 150.0000 against sell 25.0000 | 25.0000 |
| 3 | appraisal result | 0.400000 x 225.0000 + 0.600000 x 25.0000 | 105.0000 |
| 4 | root | appraise 105.0000 less 18.0000 | 87.0000 |

At the root the three branches are Appraise at 87.0000, Develop now at 183.6000 less 150.0000 = 33.6000, and Sell now at 48.0000. The root takes Appraise.

## What the order protects

Every weighting line uses the value of a node that has already made its own choice. The appraisal chance node weights 225.0000 and 25.0000, the values of the two later decisions, and never touches 520.0000 or -60.0000 directly. A poor appraisal is worth 25.0000 because the company would sell at that point, and the rollback can only know that once the development chance behind it has been valued at 56.0000 and found to be worth -94.0000 after its cost.

## The mistake

The careful mistake is reading left to right: standing at the root and looking forward to the best payoff. Read that way, OKRIKA is a 520.0000 prize and Develop now looks like the shortest road to it. Rolled back, Develop now is the worst of the three root branches at 33.6000.

The quieter error is weighting a sequence's terminals straight into the first chance node, as if no decision stood between them. That prices the development after a poor appraisal at -94.0000, a project the company would never undertake, and it throws away the sale at 25.0000 that the tree offers at exactly that point.

## What it refuses

The rollback has no clock. The appraisal cost of 18.0000 and the development cost of 150.0000 sit in one tree with no discounting between them, so both must arrive already discounted to the same date. It is risk neutral at every layer, and it takes the tree as drawn: a choice the tree does not contain is a choice the rollback cannot make.

## Exercise

Roll back twoStageSequential by hand and confirm 67.0000. Then roll back OKRIKA's three development chance nodes and its two later decisions, in that order, and state the value of each of the three root branches and which one the root takes.
