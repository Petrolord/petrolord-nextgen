# The vote, and a tied vote

{{panel:ef-classify-explorer}}

Each of the k nearest training rows casts one vote for its core facies, and the new row takes the facies with the most votes. The first row of EKENE-6 had five shaly-sand neighbours, so the vote was shaly-sand 5 and nothing needed deciding. The rule matters when the votes are level, and the engine states it in its basis, in its own words:

> majority of the k labels; a tied vote goes to the tied label whose nearest member comes first in the neighbour order (scikit-learn takes the label that sorts first)

## A tie on the Ekene wells

Train on all 180 cored rows, set k 2, and predict the uncored well EKENE-8. Row 27 of that well, counted from 0 within the well, has these two neighbours, nearest first:

| neighbour | core facies | distance, standard units |
| --- | --- | --- |
| 1 | shaly-sand | 0.372564 |
| 2 | sandstone | 0.379644 |

One vote each. The engine gives the row the facies of the nearer neighbour, shaly-sand. scikit-learn would give it the facies that sorts first, and sandstone sorts before shaly-sand, so the same rows and the same k would print sandstone there. The result counts such rows in `tiedVotes`: 1 in this well.

With k 2, any row whose two neighbours carry different facies is a tie, whatever the distances. An odd k does not rule ties out either, because the course has four facies: votes of 2, 2 and 1 at k 5 are a tie between two facies. On EKENE-6 held out at k 5, 0 votes were tied, so the rule changed no prediction there. Read the count before the accuracy.

## A tie built on purpose

The engine's golden `knn-vote-tie-nearest-b` makes the rule visible on one log with no scaling. Five training rows sit at 0, 1, 3, 4 and 10, labelled b, a, a, b, c. A new row sits at 0.2, and k is 4.

| neighbour order | training row, counted from 0 | the row sits at | label |
| --- | --- | --- | --- |
| 1 | 0 | 0 | b |
| 2 | 1 | 1 | a |
| 3 | 2 | 3 | a |
| 4 | 3 | 4 | b |

The neighbours are the rows at 0, 1, 3 and 4, which are rows 0, 1, 2 and 3 of the training set; the panel lists them by row number. The votes are a 2 and b 2. The engine predicts b, because the nearest of all the neighbours, row 0 at position 0, is a b. A rule that took the label sorting first would predict a.

## Why the engine chose this rule

Both rules are deterministic. The engine's rule falls back toward the single nearest row, and a learner can check it by hand from the neighbour list. The label that sorts first has nothing to do with the rock: a tie between sandstone and shaly-sand would always go to sandstone for the spelling of its name. The cost is that predictions on tied rows can differ from scikit-learn's, so a comparison with another tool names the tie rule beside the tied-vote count.

## Exercise

Open the view "Ties: a tied vote, equidistant rows, a tied root" and read the tied-vote row: its neighbours, votes and prediction. Then open "k nearest neighbours on a held-out well", set k 2 with EKENE-6 held out, and read the tied-vote count and the accuracy on EKENE-6. Set k 4 and read them again. For one tied row, write down which facies the engine chose and which one a sort-first rule would have chosen.
