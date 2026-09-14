# A cost on a branch

A cost is charged on the branch that carries it, before the chance node weights that branch. A cost on a stormy outcome is paid only in the storm, and the arithmetic has to say so.

{{panel:ec-tree-explorer}}

## The published tree

The published chanceRootWithBranchCosts tree has a chance node at its root with two branches, each carrying its own cost:

| branch | probability | cost | child | branchValue |
| --- | --- | --- | --- | --- |
| calm | 0.600000 | 2.0000 | 19.0000 | 17.0000 |
| storm | 0.400000 | 8.0000 | -25.0000 | -33.0000 |

Each branch value is the child less the cost on that branch: 19.0000 less 2.0000 is 17.0000, and -25.0000 less 8.0000 is -33.0000. Only then does the chance node weight:

0.600000 x 17.0000 + 0.400000 x -33.0000 = -3.0000

The root EMV is -3.0000 million USD.

## The wrong order

Weighting the children first and subtracting every cost once afterwards gives -8.6000. That treats the calm cost and the storm cost as if both were paid whatever happens. They are not: in the calm the storm cost is never incurred, and in the storm the calm cost is never incurred. The difference between -3.0000 and -8.6000 is money the wrong order charges for events that did not occur. No engine flags it: -8.6000 is a hand calculation, and a hand calculation is never refused.

## The same rule on the EKPAN tree

The drill cost of 55.0000 sits on the Drill branch at the root, above the drill chance node. The chance node weights its outcomes to 160.0000 and the branch subtracts 55.0000 once, giving 105.0000. Inside the marginal find the develop cost of 90.0000 sits on the Develop branch, so Develop is worth 260.0000 less 90.0000, which is 170.0000, and that is the value the chance node weights. A cost is charged when its branch is taken, wherever that branch sits.

## What the Builder shows for a chance root

The Decision Tree Builder's four cards assume a decision at the root. For a tree like chanceRootWithBranchCosts, whose root is a chance node, the first-move card reads "Chance root" and the next best alternative and decision advantage cards read N/A. There is no move to recommend: -3.0000 is the value of facing that chance.

## The mistake

The careful mistake is to collect every cost on a tree into one total and subtract it from the weighted payoffs, the way a budget would. That gives -8.6000 here. The other half of the mistake is reading the node label instead of the branch value. The Builder's drawing labels each node with its value before the cost on the branch leading into it, so the EKPAN tree's drill node reads EMV 160 while the drill branch is worth 105.0000.

## What it refuses

A branch cost is not checked for sense. The engine refuses probabilities that do not sum to 1 within 1e-6, and it subtracts whatever cost is attached, large or small, on any branch. It never asks whether a cost belongs on one branch or on all of them.

## Exercise

Roll back the chanceRootWithBranchCosts tree by hand: each branch value, then the weighting line, then the root EMV. Show the calculation that gives -8.6000, and explain in one sentence which costs it charges that are never paid. Then say what the Builder's first-move card shows for this tree and why.
