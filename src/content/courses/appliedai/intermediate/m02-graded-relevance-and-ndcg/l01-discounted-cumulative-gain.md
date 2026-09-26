# Discounted cumulative gain

{{panel:ae-scoring-explorer}}

Average precision turns every grade into relevant or not relevant, so a passage that answers the query and one that is merely related count the same. The judges said more than that. Discounted cumulative gain, DCG, uses the grades themselves, and it discounts each one by how far down the list it sits.

## Gain and discount

The gain of a passage is what it is worth to the reader: with the engine's default linear gain, the gain is the grade, so a grade 3 passage is worth 3 and an unjudged one 0. The discount says how much less a passage is worth further down the list. The engine divides the gain at rank r by log2(r + 1), so rank 1 is divided by 1, rank 3 by 2, and each later rank by a little more. DCG at k is the sum of the discounted gains of the top k. The engine prints the rule in its basis:

> DCG / ideal DCG at 5; DCG = sum of gain / log2(rank + 1), gain the grade (linear); the ideal ranks every judged grade descending; the gain uses every grade.

The ideal DCG, the second half of that sentence, is the next lesson.

## The stated ranking, rank by rank

The list is c, a, x, b, d at k 5, with judgments a 3, b 2, c 0, d 1 and e 2, and x unjudged. Each rank's gain and discount:

| rank | passage | grade | discount log2(rank + 1) | linear gain / discount |
| --- | --- | --- | --- | --- |
| 1 | c | 0 | 1.000000 | 0.000000 |
| 2 | a | 3 | 1.584963 | 1.892789 |
| 3 | x | 0 | 2.000000 | 0.000000 |
| 4 | b | 2 | 2.321928 | 0.861353 |
| 5 | d | 1 | 2.584963 | 0.386853 |

The DCG at 5 is the sum of the last column, 3.140995. Most of it comes from a: its grade of 3 at rank 2 is worth 1.892789 after the discount. The same grade at rank 1 would have kept its full 3.

## What DCG rewards

Two things raise DCG: better grades in the list, and better grades higher up. Precision at 5 on this list is 0.600000 whatever the order of a, b and d. DCG is not: move a to rank 1 and its discounted gain grows from 1.892789 to 3.

The unjudged passage x adds 0, exactly as the grade 0 passage c does. A later lesson in this module shows why that matters.

## DCG alone is not comparable

DCG has no upper limit of its own: a query with many passages graded 3 can score far more than a query with one, however well both lists are ranked. So DCG is divided first by the best DCG the query allows, and that division is the next lesson.

## Exercise

Open the scoring explorer on the view for MAP and nDCG. Enter the stated list as runs, `{"S1": ["c", "a", "x", "b", "d"]}`, and the judgments `{"S1": {"a": 3, "b": 2, "c": 0, "d": 1, "e": 2}}`, with k 5, linear gain and relevant at grade 1. Read the DCG column and check it against the table. Then swap a and c, run it again, and say which rank's discounted gain changed and by how much the DCG rose.
