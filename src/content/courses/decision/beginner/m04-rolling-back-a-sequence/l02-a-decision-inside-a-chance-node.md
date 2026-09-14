# A decision inside a chance node

When a chance branch leads to a decision, the chance node weights the value of that decision's best branch. On OKRIKA the same development, at the same cost and the same payoffs, is chosen after a good appraisal and refused after a poor one.

{{panel:ec-tree-explorer}}

## The appraisal branch as the engine returns it

| branch | probability and cost | child | branchValue | onOptimalPath |
| --- | --- | --- | --- | --- |
| Appraise | cost 18.0000 | chance "Appraisal result" emv 105.0000 | 87.0000 | true |
| . Good | probability 0.400000 | decision "After a good appraisal" emv 225.0000 | 225.0000 | true |
| . . Develop | cost 150.0000 | chance "Development outcome" emv 375.0000 | 225.0000 | true |
| . . Sell | none | terminal payoff 95.0000 | 95.0000 | false |
| . Poor | probability 0.600000 | decision "After a poor appraisal" emv 25.0000 | 25.0000 | true |
| . . Develop | cost 150.0000 | chance "Development outcome" emv 56.0000 | -94.0000 | false |
| . . Sell | none | terminal payoff 25.0000 | 25.0000 | true |

## One action, two answers

Both Develop branches cost 150.0000 and lead to a large field paying 520.0000 or a small one paying -60.0000. What differs is the chance of a large field. After a good appraisal it is 0.750000: 0.750000 x 520.0000 + 0.250000 x -60.0000 = 375.0000, less 150.0000 is 225.0000, which beats the sale at 95.0000. After a poor appraisal it is 0.200000: 0.200000 x 520.0000 + 0.800000 x -60.0000 = 56.0000, less 150.0000 is -94.0000, which loses to the sale at 25.0000.

The decision node hands its chance parent one number, its maximum. The appraisal node then weights those two maxima: 0.400000 x 225.0000 + 0.600000 x 25.0000 = 105.0000, and the appraisal cost makes the branch 87.0000.

## Reading the path flags

Both Good and Poor read true, because a chance node does not choose: every outcome under a branch that is taken stays on the optimal path. Inside each decision only the best branch reads true, so Develop is on the path after Good and Sell is on the path after Poor. The rows below the refused development, its large and small outcomes, read false. The optimal path is a plan with a contingency in it: appraise, then develop if the result is good and sell if it is poor.

## The mistake

The careful mistake is weighting a node value where a branch value belongs. The development chance node after a good appraisal is 375.0000, and the Decision Tree Builder's drawing labels a node with its own value, before the cost on the branch into it. Weighted into the appraisal node, that figure overstates the good branch by the whole 150.0000, a cost the company pays on every development it undertakes. The number the appraisal node takes is the decision's value, 225.0000, and for a poor result it takes the sale at 25.0000, never the development chance node's 56.0000.

The second mistake is to average the two later decisions' branches instead of taking their best. A decision node never weights; the company gets to choose, and the rollback gives it that choice once the result is known.

## What it refuses

The rollback does not check that the probabilities after an appraisal agree with the ones before it. On OKRIKA they happen to: 0.400000 x 0.750000 + 0.600000 x 0.200000 = 0.420000, the chance of a large field if developed now. A tree whose later probabilities disagreed with its earlier ones would roll back just the same, with no warning, because the engine has no link between chance nodes beyond the tree as drawn.

## Exercise

For each appraisal result, write the development chance node, the development branch value and the sale, and name the branch the decision takes. Then weight the two decisions into the appraisal node, subtract its cost, and list every branch in the appraisal subtree that reads onOptimalPath false.
