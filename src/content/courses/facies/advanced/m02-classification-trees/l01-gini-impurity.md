# Gini impurity

{{panel:ef-classify-explorer}}

kNN keeps every training row and searches them for each prediction. A classification tree does the opposite: it reads the training rows once, grows a set of questions of the form "is this log at or below this threshold?", and afterwards predicts a new row by answering them. `cartFit` grows one such tree with the CART method. Every question it asks is chosen by one measure, the Gini impurity.

## The impurity of a node

A node is a set of rows. Its Gini impurity is 1 less the sum, over the facies, of the square of each facies' share of the node. A node holding one facies has impurity 0. A node evenly mixed across several facies has a high one. The engine states the rule in its basis:

> Gini impurity 1 - sum p_c^2; a split is scored by the weighted child impurity, the best has the largest decrease

The root holds all 180 cored rows, in the counts the engine lists in its own order:

| facies | rows at the root |
| --- | --- |
| limestone | 54 |
| sandstone | 50 |
| shale | 29 |
| shaly-sand | 47 |

The shares are 54/180, 50/180, 29/180 and 47/180, and 1 less the sum of their squares is 0.738704. The engine returns 0.738704 for the root.

## A split, scored

A split sends every row of a node to one of two children, left when the log is at or below the threshold. Each child has its own impurity, and the split is scored by the impurities of the two children weighted by their rows. The best split is the one whose weighted child impurity falls furthest below the parent's: the largest decrease.

On the cored rows the engine's root split is NPHI at 0.123000. It sends the 54 limestone rows left, and nothing else, so the left child is pure and its impurity is 0. The right child holds the other 126 rows, with impurity 0.650416. The root's weighted impurity decrease is 0.283413.

| node | rows | Gini | split on | threshold | weighted impurity decrease |
| --- | --- | --- | --- | --- | --- |
| 0 | 180 | 0.738704 | NPHI | 0.123000 | 0.283413 |
| 2 | 126 | 0.650416 | GR | 95.600000 | 0.186104 |

The decrease is measured on the scale of the whole tree: a node's impurity is weighted by its share of all the rows, so a split near the root, which moves many rows, can show a larger decrease than a cleaner split deep down. The right child, node 2, splits next on GR and sends the 29 shale rows right.

## One node, no split

With no split allowed, the tree is a single leaf. It predicts the most common facies of its rows, limestone, and its accuracy on the 180 cored rows it was grown on is 0.300000, the limestone share. That is the floor every deeper tree starts from.

## Exercise

Open the view "A classification tree and its printed form". Set maxDepth to 0 and read the single leaf and the accuracy on the rows it was grown on. Set maxDepth to 1 and read the root split and its threshold. Then type your own table of six rows with a FACIES column, three rows of one facies and three of another, with one log that separates them. Compute the root Gini by hand, predict the root split, and check the split and the leaf counts the panel prints.
