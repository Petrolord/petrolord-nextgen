# Ranking by cosine

{{panel:ae-retrieval-explorer}}

With every passage a unit vector, TF-IDF scores a passage against a query in one step. The query is turned into a unit vector the same way, and the score is the dot product of the two: for each word they share, multiply the query's weight by the passage's weight, and add. Because both vectors have length 1, this dot product is the cosine of the angle between them. This lesson ranks the hand set and one Ekene query by it.

## The rule, in the engine's words

    score: cosine: the dot product of the unit query and document vectors; query terms outside the corpus vocabulary are dropped

## "oil rate" on the hand set

The query has two words, each once, with the same idf, so its unit vector is oil 0.707107, rate 0.707107.

| rank | passage | cosine | term: query weight x passage weight |
| --- | --- | --- | --- |
| 1 | d1 | 0.715911 | oil: 0.707107 x 0.506225; rate: 0.707107 x 0.506225 |
| 2 | d3 | 0.503451 | oil: 0.707107 x 0.474658; rate: 0.707107 x 0.237329 |

d1 wins because it uses both words twice in a short passage. d3 uses oil twice and rate once among more words. 2 of the 5 passages rank: d2 and d4 share no term with the query, and d5 is empty. Only a score above 0 ranks, so the list can be shorter than the cutoff k.

## A query on the corpus

Q04, "bubble point pressure of the Ekene oil", has the query vector bubble 0.549668, ekene 0.204740, of 0.332042, oil 0.297012, point 0.521046, pressure 0.388034, the 0.188200. The rare words bubble and point carry the most weight.

| rank | passage | cosine | judged grade (fixture) |
| --- | --- | --- | --- |
| 1 | EKD-018 | 0.553949 | 2 |
| 2 | EKD-010 | 0.328560 | 3 |
| 3 | EKD-011 | 0.314808 | 2 |
| 4 | EKD-020 | 0.258215 | 1 |
| 5 | EKD-057 | 0.251461 | 0 |

The passage judged to answer the query, EKD-010, is second. A cosine measures shared words, and a passage can share more words with a query than the one that answers it.

## Words outside the vocabulary

Q24, "subsea tree replacement on Ekene-5", drops subsea and tree, which appear in no passage; the cosine is computed on 5, ekene, on and replacement. If every query word is outside the vocabulary, the result comes back with a note and no ranking:

> no query term is in the corpus vocabulary, so no document is ranked

## Sublinear tf

Sublinear tf replaces a count c by 1 + ln c before the idf, so a word repeated in a passage counts for less. On Q13, "Ekene-6 water cut at the end of 2025", it moves the scores and, here, keeps the order:

| rank | raw counts: passage | cosine | sublinear: passage | cosine |
| --- | --- | --- | --- | --- |
| 1 | EKD-029 | 0.404014 | EKD-029 | 0.395996 |
| 2 | EKD-030 | 0.355212 | EKD-030 | 0.382844 |
| 3 | EKD-027 | 0.328842 | EKD-027 | 0.316864 |

A cosine is a score for ranking. It is never a probability that a passage is relevant, and a cosine of 0.553949 says nothing about how likely EKD-018 is to answer Q04.

## Exercise

In the retrieval explorer choose "TF-IDF, ranked by cosine" with the hand set and the query "oil rate". Multiply the two products in d1's row yourself and add them; compare with 0.715911. Then type "oil oil rate" and read the query weights: the query is weighted the same way as a passage, so a repeated word changes its vector. Note how d1 and d3 move. Finally set sublinear tf on, type "oil rate" again, and compare d1's cosine with the raw-count figure.
