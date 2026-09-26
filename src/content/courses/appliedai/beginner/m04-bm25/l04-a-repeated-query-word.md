# A repeated query word counts once

{{panel:ae-retrieval-explorer}}

The BM25 module so far has been about passages: how rare a word is across them, how often it appears in one, and how long that one is. This lesson turns to the query. People type queries with repeats in them, sometimes by accident and sometimes to stress a word. The engine's BM25 treats a query as a set of words, so a repeat changes nothing.

## The rule, in the engine's words

The last clause of the BM25 basis says it:

    score: sum over the distinct query terms found in the document of idf x tf (k1 + 1) / (tf + k1 (1 - b + b dl / avgdl)), k1 = 1.2, b = 0.75; a repeated query word counts once

The sum runs over the distinct query terms. Each word the query holds is scored once for each passage, however many times the query says it.

## Checked on the hand set

"oil oil rate" on the hand set returns exactly the scores of "oil rate", checked to the last bit:

| query | d1 | d3 |
| --- | --- | --- |
| oil rate | 2.191027 | 1.722606 |
| oil oil rate | 2.191027 | 1.722606 |

The ranking, the scores and each term's contribution are the same. Only the query box changed.

## The name for this choice

The original Okapi BM25 family has a third parameter, k3, which weights a query word by how often the query repeats it. The engine keeps the distinct query terms, which is Okapi's query-frequency factor with k3 = 0, and it states this in its basis. The reason is short: a query is a set of words. Weighting repeats would give two people asking one question different lists.

## TF-IDF treats the query differently

TF-IDF in this engine weights the query the same way it weights a passage: raw counts, times the idf, scaled to unit length. So in TF-IDF a repeated query word does change the query vector, and with it the cosines. The difference between the two methods is a stated convention of each, and it is one more reason to name the method beside every score.

## The (k1 + 1) in the numerator

One more choice sits in the same formula. The engine keeps (k1 + 1) in the numerator, as Robertson and Zaragoza write it. Lucene 8 and later drop it. Dropping it scales every score by the same factor and leaves the order unchanged, so a ranking from either form is the same list. The scores themselves differ, and a BM25 score from this engine should be compared only with one computed by the same form.

## What this means for your own queries

When you test a retrieval system, write each query once, in the words a user would type. Repeating a word to force a passage up has no effect in BM25 and a hidden one in TF-IDF.

## Exercise

In the retrieval explorer choose "BM25, read term by term" with the hand set. Type "oil rate", note d1 and d3, then type "oil oil rate" and "oil rate rate rate" and confirm nothing moves. Now choose "TF-IDF, ranked by cosine" with the hand set and type the same three queries. Read the query weights and the cosines for each, and write down which of the two passages gains when oil is repeated and which gains when rate is repeated.
