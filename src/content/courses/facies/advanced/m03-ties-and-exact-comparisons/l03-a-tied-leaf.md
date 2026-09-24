# A tied leaf and the class that sorts first

{{panel:ef-classify-explorer}}

A leaf predicts the most common facies among the rows that reached it. When two facies are equally common there, the leaf still has to name one. The engine's rule for that is short, and it differs from the rule kNN uses for a tied vote. The basis states it, in the engine's words:

> the majority class of the leaf; a tie goes to the class that sorts first

## A golden with a three-way tie

The engine's golden `cart-iris-depth0` grows a tree of maxDepth 0 on Fisher's iris, the published dataset the Associate tier used as a check on the engine's arithmetic. A tree of depth 0 is one leaf holding every row:

| class | rows in the leaf |
| --- | --- |
| setosa | 50 |
| versicolor | 50 |
| virginica | 50 |

Three classes tie. setosa sorts first, so the leaf predicts setosa, and the training accuracy is 0.333333, on the rows it was grown on: every setosa row right and every other row wrong. The four rows of the last lesson end the same way. Their single leaf holds two rows of each label, and it predicts 0, the label that sorts first.

## Names sort by character

"Sorts first" means the order of the characters in the names. That is why the engine lists the Ekene facies as limestone, sandstone, shale, shaly-sand, and why shale sorts before shaly-sand. A leaf that held equal counts of sandstone and shaly-sand would predict sandstone, whatever the logs of its rows looked like. On the Ekene cored rows the depth 0 tree has no tie: it predicts limestone because limestone has the most rows, 54 of 180.

## Two ties, two rules

The same engine settles a tied kNN vote differently: the tied facies whose nearest member comes first in the neighbour order wins. A leaf keeps no neighbour order, and the tree uses the sort order of the names. Each rule is stated where it applies; neither is global. Majority matching, from the Professional tier, uses the sort-first rule too, and states it in its own basis.

## What a tied leaf means for a reader

A prediction from a tied leaf rests on the spelling of a name, and a reader who sees only the predicted facies cannot tell. Read the counts on the leaf line of the printed tree, and write them beside any facies predicted from such a leaf.

## Exercise

Open the view "A classification tree and its printed form". Type a table of four rows with one log reading 1, 2, 3 and 4 and a FACIES column reading shaly-sand, sandstone, shaly-sand, sandstone. Set maxDepth to 0 and read the predicted class of the single leaf. Then rename sandstone to tight-sand in both rows, grow the tree again, and write down which class the leaf predicts and why.
