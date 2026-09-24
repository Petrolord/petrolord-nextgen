# A split needs a decrease above zero

{{panel:ef-classify-explorer}}

A tree splits a node when a split lowers the Gini impurity. The last clause of the engine's stopping rule says what happens when the best split available lowers it by nothing at all: the node stays a leaf. That clause is a boundary of its own, with a consequence worth seeing on four rows.

## A golden built so no split helps

The engine's golden `cart-xor-no-split` has four rows and two features, labelled so that neither feature alone says anything:

| row | first feature | second feature | label |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 2 | 1 | 0 | 1 |
| 3 | 1 | 1 | 0 |

The root holds two rows of each label, so its Gini is 0.500000. Split on the first feature and each side holds one 0 and one 1; split on the second and the same happens. Every single split leaves each side half one label and half the other, so no split lowers the Gini. With maxDepth 3 the engine still returns a single leaf, 1 node, predicting 0.

The labels are fully decided by the two features together: the label is 1 exactly when the two features differ. A tree of depth 2 could draw that rule, one split under another. CART never reaches it, because it judges one split at a time, and the first split on its own gains nothing.

## Where the boundary sits

The rule is drawn for this one comparison: a decrease above zero splits, and a decrease of exactly zero leaves a leaf. It is compared on the integer counts, exactly, the same way the root tie was, so "exactly zero" is an exact statement here. The engine prints the stopping rule in its basis, in its own words:

> a node is a leaf when pure, at depth maxDepth 5 (the root is depth 0), with fewer than minSamplesSplit 2 rows, when no split leaves minSamplesLeaf 1 rows each side, or when the best decrease is zero

## The engine's choice, and the alternative

scikit-learn allows a split whose decrease is zero. On these four rows it could take a first split that gains nothing and then, one level down, find splits that separate the labels completely. The engine refuses the zero-decrease split, and the node stays a leaf. The course states the engine's reason in one line: a split that separates nothing is not a split.

The two behaviours can give different trees on the same rows. The engine's choice means every split in its printed tree lowered the impurity. Its cost is a pattern like this one, where the information sits only in a combination of features.

The leaf predicts 0. Its counts are 2 and 2, a tie, and the next lesson gives the rule that settled it.

## Exercise

Open the view "A classification tree and its printed form". Replace the table with the four rows above, two columns named A and B and a FACIES column holding a, b, b, a in place of 0, 1, 1, 0, and set maxDepth to 3. Read the printed tree and the number of nodes. Then change the label of row 3 to b, grow the tree again, and write down the root split, its threshold and why a split is now allowed.
