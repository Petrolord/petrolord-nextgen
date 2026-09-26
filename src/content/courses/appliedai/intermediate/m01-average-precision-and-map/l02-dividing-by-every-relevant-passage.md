# Dividing by every relevant passage

{{panel:ae-scoring-explorer}}

Average precision adds the precisions at the relevant ranks and divides the sum by a count. Which count is a choice, and the engine states the one it made: every relevant judged passage for the query, retrieved or not.

## The division on the stated ranking

On the list c, a, x, b, d with judgments a 3, b 2, c 0, d 1, e 2, at k 5 and grade 1 or more, the precisions at the relevant ranks were 0.500000, 0.500000 and 0.600000. Four judged passages are relevant: a, b, d and e.

| quantity | value |
| --- | --- |
| sum of the precisions at relevant ranks | 0.500000 + 0.500000 + 0.600000 |
| relevant judged passages | 4 |
| average precision | 0.400000 |
| dividing by the 3 retrieved instead | 0.533333 |

The engine returns 0.400000. The passage e is relevant and no system retrieved it, and dividing by 4 lets that miss lower the score. Dividing by the 3 relevant passages the list did retrieve would give 0.533333, which is what the engine does not compute.

## Why the engine divides this way

The alternative in common use divides by min(k, relevant), the most relevant passages a list of length k could hold. The engine follows trec_eval and divides by every relevant judged passage. The course states the reason in one line: a missed passage lowers average precision.

The same choice explains why average precision cannot reach 1 on a query with more relevant passages than the cutoff. System A's Q01, "What was the reservoir pressure when the waterflood started?", has 8 relevant judged passages at grade 1 or more, and a top 5 can hold at most five of them. Its AP at 5 is 0.262500.

## A late first hit

System A's Q02, "initial oil rate of Ekene-3", shows the division at its harshest. The query has 5 relevant judged passages. BM25 retrieves one of them in its top 5, at rank 4, so the reciprocal rank is 0.250000 and the only precision in the sum is the precision at rank 4, one relevant passage in four. Divided by 5, the AP at 5 is 0.050000.

System B's TF-IDF list for the same query scores an AP of 0.400000 at k 5 and grade 1 or more. The divisor is the same 5 for both systems, because it is a count taken from the judgments, so the two figures compare directly.

## A passage ranked twice is refused

The precision at a rank counts each passage once. A list that holds the same passage twice would count it twice, so the engine refuses it and names the position:

> ranking[2] repeats EKD-018 (ranking[0]): a document is ranked once

The refusal names the field, the repeated id and where it first appeared.

## Exercise

In the view for MAP and nDCG, load the stated list and judgments from the last lesson and confirm an AP of 0.400000. Now add a sixth judgment, `"f": 1`, a relevant passage no list retrieved, and run it again. Say whether the AP rose or fell and which count in the division changed. Then remove f, change the run so that "a" appears at rank 1 and again at rank 3, and read the refusal and the field it names.
