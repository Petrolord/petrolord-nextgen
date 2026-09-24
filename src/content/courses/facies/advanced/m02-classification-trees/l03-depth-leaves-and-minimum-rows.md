# Depth, leaves and minimum rows

{{panel:ef-classify-explorer}}

Left alone, a tree keeps splitting until every leaf is pure or no split lowers the impurity, and a tree with a leaf for every awkward row fits its own rows and little else. The engine stops a branch by stated rules, and three of them are settings you choose: the depth, the fewest rows a leaf may hold, and the fewest rows a node needs before it may split. The basis names every rule, in the engine's words:

> a node is a leaf when pure, at depth maxDepth 5 (the root is depth 0), with fewer than minSamplesSplit 2 rows, when no split leaves minSamplesLeaf 1 rows each side, or when the best decrease is zero

The defaults are in that sentence: depth 5, counted with the root at depth 0; a split needs 2 rows; a leaf needs 1. The last clause, a decrease of zero, has a lesson of its own in the next module.

## Depth, measured twice

Each tree below is grown on all 180 cored rows and scored on those same rows. A second tree at the same depth is grown on the 150 rows of EKENE-1 to EKENE-5 and scored on EKENE-6, held out:

| maxDepth | nodes | leaves | training accuracy, all cored rows | accuracy on EKENE-6, grown without it |
| --- | --- | --- | --- | --- |
| 0 | 1 | 1 | 0.300000 | 0.000000 |
| 1 | 3 | 2 | 0.577778 | 0.000000 |
| 2 | 5 | 3 | 0.738889 | 0.100000 |
| 3 | 7 | 4 | 0.927778 | 0.633333 |
| 4 | 11 | 6 | 0.950000 | 0.900000 |
| 5 | 15 | 8 | 0.988889 | 0.766667 |
| 6 | 19 | 10 | 0.988889 | 0.900000 |

Read the two accuracy columns as two different questions. Training accuracy never falls as the tree deepens, because splitting a leaf never lowers the count of its own rows predicted right. The held-out accuracy moves up and down: it prints 0.900000 at maxDepth 4 and again at 6, with 0.766667 between them at the default depth 5. At maxDepth 0 and 1 the tree grown without EKENE-6 gets none of its 30 rows right. A deep tree fits its own rows; only the held-out well says how far that carries, and that well is one draw.

## The fewest rows in a leaf

`minSamplesLeaf` forbids any split that would leave fewer rows than it on either side. At the default of 1, the smallest leaf of the five-channel tree holds 2 rows. With `minSamplesLeaf` 5, stated, the tree still has 8 leaves, the smallest holds 5 rows, and its training accuracy is 0.972222 against 0.988889. A leaf of 2 rows is a rule learned from 2 rows; the setting trades a little training accuracy for leaves that stand on more rock.

## The settings the engine refuses

Each setting has its own boundary, and each refusal names its field. A negative depth:

> maxDepth must be a whole number, 0 or more (0 is a single leaf)

A leaf of no rows, and a split of one row:

> minSamplesLeaf must be a whole number, 1 or more

> minSamplesSplit must be a whole number, 2 or more

So maxDepth 0 is accepted and gives a single leaf, and -1 is refused; minSamplesLeaf 1 and minSamplesSplit 2 are accepted, and 0 and 1 are refused.

## Exercise

Open the view "A classification tree and its printed form" with EKENE-6 held out for the score. Step maxDepth from 0 to 6 and confirm both accuracy columns. Then set maxDepth blank, set minSamplesLeaf to 5, and read the leaves and the training accuracy. Try minSamplesLeaf 10 and write down the leaves, the training accuracy and the accuracy on EKENE-6. Finally set maxDepth to -1 and read the refusal.
