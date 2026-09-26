# Precision and recall at a cutoff

{{panel:ae-retrieval-explorer}}

A ranking is judged by where the relevant passages land in it. A copilot reads only the top few passages, so the course cuts every list at k and asks two questions of the top k. Of the passages retrieved, how many are relevant? That is precision. Of the relevant passages, how many were retrieved? That is recall. This lesson computes both, by hand and on system A.

## The definitions, in the engine's words

At the teaching settings, k 5 and relevant at grade 1 or more:

    relevant: grade >= 1; unjudged documents count as grade 0
    precision: relevant in the top 5 / 5 (5 even when fewer are ranked)
    recall: relevant in the top 5 / relevant judged

"Relevant" here always names its threshold. A grade 1 passage is related to the query; with the threshold at grade 1 it counts as relevant, and with the threshold at grade 2 it would not.

## A stated ranking, by hand

The list c, a, x, b, d against the judgments a 3, b 2, c 0, d 1, e 2. x was never judged; e was judged and not retrieved.

| rank | passage | grade | relevant |
| --- | --- | --- | --- |
| 1 | c | 0 | no |
| 2 | a | 3 | yes |
| 3 | x | unjudged, counts as 0 | no |
| 4 | b | 2 | yes |
| 5 | d | 1 | yes |

| metric | value |
| --- | --- |
| relevant judged | 4 |
| relevant in the top 5 | 3 |
| precision at 5 | 0.600000 |
| recall at 5 | 0.750000 |

Precision is 3 / 5. Recall is 3 / 4, because e is relevant and was not retrieved. x counts as grade 0 because nobody judged it, which may be unfair to x; the rule is stated so the figure can be read honestly.

## System A on four queries

System A retrieves by BM25 at k 5. At grade 1 or more:

| query | relevant judged | relevant in top 5 | precision | recall |
| --- | --- | --- | --- | --- |
| Q01 | 8 | 3 | 0.600000 | 0.375000 |
| Q04 | 4 | 4 | 0.800000 | 1.000000 |
| Q10 | 2 | 2 | 0.400000 | 1.000000 |
| Q14 | 3 | 0 | 0.000000 | 0.000000 |

Q01 has 8 relevant passages, more than a list of 5 can hold, so its recall at 5 can never pass 5 / 8. Q10 has precision 0.400000 with only 2 passages ranked: precision at 5 divides by 5 even when fewer are ranked. That is a stated choice, the one trec_eval makes; the alternative divides by the passages ranked, and would give Q10 2 / 2 = 1.000000 for a list of two, a figure the engine does not compute. Q14 is the lexical trap, and BM25 finds none of its 3 relevant passages.

## Why both

Precision rewards a clean top k. Recall rewards finding everything. A copilot that cites only its first passage needs precision near the top; an assessor collecting evidence needs recall. A single figure hides one or the other, so report both, each with its k and its threshold, and read them together. Q24, where no passage is relevant, has recall returned as null with a reason; the lesson on means over queries reads it.

## Exercise

In the retrieval explorer choose "Run queries and score them at a cutoff" with the Ekene passages, the four starting queries Q01 to Q04 and their judgments, BM25 and k 5. For Q01 and Q04, count by hand the relevant passages in each ranked list using the judgments box, and check the precision and recall columns. Then set "relevant at grade" to 2 and work out which of the four rows must change before you read them.
