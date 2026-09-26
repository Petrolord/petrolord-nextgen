# Hit and reciprocal rank

{{panel:ae-retrieval-explorer}}

Precision and recall count relevant passages in the top k. Two more metrics care only about the first relevant passage, because a copilot that reads the top of the list may stop at the first useful one. Hit asks whether there is any relevant passage in the top k at all. Reciprocal rank asks how high the first one sits. This lesson computes both and reads them on system A.

## The definitions, in the engine's words

At k 5 and relevant at grade 1 or more:

    hit: 1 when a relevant document is in the top 5, else 0
    reciprocalRank: 1 / rank of the first relevant document in the top 5, 0 when there is none

Hit is either 0 or 1 for one query. Reciprocal rank is 1 when the first passage is relevant, 1 / 2 when the first relevant passage is second, 1 / 4 when it is fourth, and 0 when none of the top k is relevant. A relevant passage at rank 6 earns nothing at k 5.

## The stated ranking again

The list c, a, x, b, d against the judgments a 3, b 2, c 0, d 1, e 2:

| metric | value |
| --- | --- |
| hit at 5 | 1 |
| first relevant rank | 2 |
| reciprocal rank | 0.500000 |

c at rank 1 is grade 0, so the first relevant passage is a at rank 2, and the reciprocal rank is 1 / 2.

## System A on selected queries

BM25 at k 5, relevant at grade 1 or more:

| query | hit | first relevant rank | reciprocal rank |
| --- | --- | --- | --- |
| Q01 | 1 | 1 | 1.000000 |
| Q02 | 1 | 4 | 0.250000 |
| Q05 | 1 | 2 | 0.500000 |
| Q14 | 0 | null | 0.000000 |
| Q15 | 1 | 2 | 0.500000 |

Q02 is the query from the BM25 module: the drilling report EKD-043 ranks first on the words rate and of, and the answering passage EKD-003 is fourth, so the reciprocal rank is 0.250000. Q14 is the lexical trap: no relevant passage in the top 5, hit 0, no first relevant rank, reciprocal rank 0.

## What each one hides

Hit is generous. Q02 scores hit 1 although the useful passage sits below three passages judged grade 0. Reciprocal rank sees that, and marks Q02 down to a quarter. Neither looks past the first relevant passage: a list with one relevant passage at rank 1 and a list with five relevant passages starting at rank 1 score the same on both. That is why precision and recall are reported beside them.

Reciprocal rank also falls fast. Moving the first relevant passage from rank 1 to rank 2 halves it, while moving it from 4 to 5 changes it far less. That suits a reader who looks mainly at the top of a list.

## Beyond the first relevant passage

These four metrics are the first of several. A score that rewards every relevant passage by its rank, average precision, and a score that uses the grades themselves are the Professional tier's question. This tier keeps to what can be read from the top k by counting.

## Exercise

In the retrieval explorer choose "Run queries and score them at a cutoff" with the four starting queries, BM25 and k 5. Read the reciprocal rank for Q02 and find, in the ranked list and the judgments box, the passage that sets it. Switch the method to TF-IDF and read Q02's reciprocal rank again. Then return to BM25, set "relevant at grade" to 3, and before you read the table, work out by hand which queries will lose their hit.
