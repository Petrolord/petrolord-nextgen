# Three kinds of node

Every tree this engine rolls back is built from three node types with one rule each: a decision node takes the maximum of its branch values, a chance node takes their probability weighted sum, and a terminal node is its payoff.

{{panel:ec-tree-explorer}}

## The EKPAN tree, node by node

| path | branch | probability and cost | child | branchValue |
| --- | --- | --- | --- | --- |
| 0 | Drill | cost 55.0000 | chance "Drill outcome" emv 160.0000 | 105.0000 |
| 0.0 | . Success | probability 0.350000 | terminal payoff 420.0000 | 420.0000 |
| 0.1 | . Marginal | probability 0.150000 | decision "Marginal find" emv 170.0000 | 170.0000 |
| 0.1.0 | . . Develop | cost 90.0000 | terminal payoff 260.0000 | 170.0000 |
| 0.1.1 | . . Sell | none | terminal payoff 140.0000 | 140.0000 |
| 0.2 | . Dry hole | probability 0.500000 | terminal payoff -25.0000 | -25.0000 |
| 1 | Farm out | none | chance "Farm-out outcome" emv 37.7500 | 37.7500 |
| 2 | Walk away | none | terminal payoff 0.0000 | 0.0000 |

The root, "EKPAN prospect", is a decision node. "Drill outcome" and "Farm-out outcome" are chance nodes. "Marginal find" is a decision node sitting inside a chance node, a choice the owner makes only if that outcome occurs. Every leaf is a terminal.

## Branch value: the child less the cost

A branch carries a value of its own: the EMV of the node it leads to, less any cost on that branch. Drill leads to a chance node worth 160.0000 and costs 55.0000, so the branch is worth 105.0000. Develop leads to a terminal of 260.0000 and costs 90.0000, so it is worth 170.0000. A branch with no cost is worth exactly its child. Nodes combine branch values, never raw child values.

## The rules, from the leaves up

Marginal find, a decision, takes the larger of 170.0000 and 140.0000. Drill outcome, a chance node: 0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000. Farm-out outcome: 0.350000 x 95.0000 + 0.150000 x 30.0000 + 0.500000 x 0.0000 = 37.7500. The root takes the largest of 105.0000, 37.7500 and 0.0000: EMV 105.0000, best branch index 0, Drill. A decision node picks one branch. A chance node picks none and uses them all.

## What the drawing labels

The Decision Tree Builder's drawing prints "EMV" beside every decision and chance node, followed by that node's own value, which is the value before the cost on the branch leading into it. On the EKPAN tree it labels the drill chance node EMV 160 while the drill branch, and the root, are worth 105.0000. The drawing also rounds its labels, while the engine's values are unrounded.

## The mistake

Reading 160 off the drill node and setting it against the farm-out's 37.7500 finds the right move on the EKPAN tree by luck and overstates the margin. The drill cost belongs to the branch, and the number to compare is 105.0000. On a tree where the cost is larger than the gap between the nodes, the same misreading picks the wrong branch. A second mistake is treating the marginal find as an outcome paying 260.0000. It is a decision made later, and it enters its chance node at its best branch value, 170.0000.

## What it refuses

The engine knows these three types and no others. A node typed "lottery" is refused with `Unknown node type "lottery" (at node "x")`. A decision node with no branches is refused with `Decision and chance nodes need at least one branch (at node "empty")`, and a branch with no child with `Missing node`. It never guesses what a malformed node meant.

## Exercise

Name the type of every node on the EKPAN tree. Work each branch value from its child and its cost, apply each node's rule from the leaves to the root, and say why the Builder's drawing labels the drill node 160 when the drill branch is worth 105.0000.
