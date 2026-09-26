# Precision at every relevant rank

{{panel:ae-scoring-explorer}}

The Associate tier scored a ranked list at a cutoff with precision, recall, hit and reciprocal rank. None of them reads the order of the relevant passages after the first. This tier starts with the score that does, average precision, and this lesson builds its working part: precision read again at every rank where a relevant passage appears.

## The stated ranking again

The course uses one small ranking for the hand calculations in this tier: c, a, x, b, d at a cutoff k of 5. The judgments are a 3, b 2, c 0, d 1 and e 2. The passage x was never judged, so it counts as grade 0, and e was judged and never retrieved. A passage is relevant at grade 1 or more, the engine's default threshold.

| rank | passage | grade | relevant at grade 1 or more |
| --- | --- | --- | --- |
| 1 | c | 0 | no |
| 2 | a | 3 | yes |
| 3 | x | unjudged, counts as 0 | no |
| 4 | b | 2 | yes |
| 5 | d | 1 | yes |

The Associate figures on this list, at k 5 and grade 1 or more, are precision 0.600000, recall 0.750000 and reciprocal rank 0.500000.

## Precision, stopped at each relevant rank

Average precision asks the precision question again at every rank that holds a relevant passage, as if the list stopped there. At rank 2 one of the first two passages is relevant. At rank 4 two of the first four are. At rank 5 three of the first five are.

| rank of a relevant passage | passage | relevant so far | precision at that rank |
| --- | --- | --- | --- |
| 2 | a | 1 | 0.500000 |
| 4 | b | 2 | 0.500000 |
| 5 | d | 3 | 0.600000 |

Ranks 1 and 3 hold no relevant passage, so nothing is read there. The grade plays no further part: a, graded 3, and d, graded 1, each add one to the count. The graded score of this tier, nDCG, comes in the next module.

## Why order now matters

Precision at 5 is 0.600000 whether the three relevant passages sit at ranks 1, 2 and 3 or at ranks 3, 4 and 5. The three precisions above do change with the order. Move a relevant passage up and every precision from its new rank onward rises, because the relevant count reaches each rank sooner. Move it down and they fall.

## What the engine states

The engine prints its definition in the basis of every result, so the working can be checked:

> (1 / relevant judged) x sum of precision at each relevant rank up to 5

The sum runs over the ranks up to the cutoff. A relevant passage at rank 6 of a longer list adds nothing at k 5. The divisor, relevant judged, is the subject of the next lesson.

## Exercise

Open the scoring explorer on the view for MAP and nDCG over a set of queries. Replace the runs with one query holding the stated list, `{"S1": ["c", "a", "x", "b", "d"]}`, and the judgments with `{"S1": {"a": 3, "b": 2, "c": 0, "d": 1, "e": 2}}`. Keep k at 5 and relevant at grade 1. Read the AP column and check it against the three precisions above. Then move a to rank 1, run it again, and say in a sentence which of the three precisions changed and why the AP rose.
