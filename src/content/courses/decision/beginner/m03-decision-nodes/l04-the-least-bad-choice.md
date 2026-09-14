# The least bad choice

A decision node takes its largest branch value even when every branch loses money. It returns a recommendation and a negative EMV, and it never says that no branch is worth taking.

{{panel:ec-tree-explorer}}

## Every branch negative

The published allNegative case:

| branch | branchValue |
| --- | --- |
| A | -55.0000 |
| B | -52.0000 |

The engine returns EMV -52.0000 with best branch index 1, B, and the golden agrees at -52.0000. B is on the optimal path because -52.0000 is larger than -55.0000. The Decision Tree Builder would name B as the recommended first move and show a decision advantage of 3.0000 over A, and nothing on either card says that both moves destroy value.

## Why the engine does not object

The rule at a decision node is the maximum over the branches drawn. The engine has no idea of a zero floor, no idea that the owner could decline both, and no warning for a negative root. A walk-away is a branch like any other, and a tree without one gives the engine no way to choose it. On allNegative the true alternatives may include doing nothing, worth 0.0000, but the tree does not contain that branch, so the answer is the least bad of two losses.

## One branch, no choice

The published singleBranchDecision case has one branch, "only", worth 7.0000. The engine returns EMV 7.0000 with best branch index 0, and the golden agrees. A decision with one branch is not a decision, and the engine rolls it back anyway. In the Builder the next best alternative and decision advantage cards read N/A. The recommendation is simply the only branch, and the tree gives no evidence that it is a good one.

## The mistake

The careful mistake is reading a recommendation as an endorsement. On allNegative, "Recommended first move: B" beside an optimal EMV of -52.0000 is an instruction to lose 52.0000 million USD on average, and it was produced by a tree that forgot to offer the option of not acting. The second mistake is reading the decision advantage as good news: B beats A by 3.0000, which is only the gap between the two losses, -55.0000 against -52.0000, and says nothing about whether either should be taken. Before trusting the maximum, check the list it was taken over.

## What it refuses

A node with no branches is refused. A node whose branches all lose money, or that has only one branch, is accepted and rolled back without comment. The engine never adds a walk-away and never flags a negative optimal EMV.

## Exercise

Roll back allNegative and state the EMV, the best branch and the decision advantage the Builder would show. Say what branch is missing from that tree and what the root would read if it were added at 0.0000. Then explain why singleBranchDecision's 7.0000 is not evidence the branch is worth taking.
