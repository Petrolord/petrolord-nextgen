# Vectors scaled to unit length

{{panel:ae-retrieval-explorer}}

A TF-IDF passage is a list of weights, one for each word it contains. Each raw weight is the word's count times its idf. A long passage has more words and larger counts, so its raw weights add up to more, whatever it is about. To compare passages fairly the engine scales each list so that its length is exactly 1. This lesson follows that scaling on the hand set.

## The rule, in the engine's words

    norm: each vector scaled to unit Euclidean length (l2)

Think of a passage's weights as the sides of an arrow in a space with one direction per word. The arrow's length, its norm, is the square root of the sum of the squared weights. Dividing every weight by the norm keeps the arrow pointing the same way and makes it length 1. After scaling, what is left is the passage's mix of words, and the size of the passage drops out.

## Worked on d1

d1 is "Oil rate 120 bopd at Ekene-1. Oil rate fell." It has 10 tokens. Its raw weights are each count times the idf from the previous lesson: oil has count 2 and idf 1.693147, rate the same, and each of the other words has count 1. The norm of those raw weights is 6.689301. Dividing gives the unit vector:

| passage | tokens | norm before scaling | weights after scaling |
| --- | --- | --- | --- |
| d1 | 10 | 6.689301 | 1 0.313727, 120 0.313727, at 0.253113, bopd 0.253113, ekene 0.253113, fell 0.313727, oil 0.506225, rate 0.506225 |

Check one weight yourself: twice 1.693147, divided by 6.689301, gives 0.506225 for oil. The words 1, 120 and fell appear once and have the higher idf 2.098612, so each ends at 0.313727. The words at, bopd and ekene appear once with idf 1.693147 and end at 0.253113. oil and rate are the heaviest, because each appears twice.

## The other passages

| passage | tokens | norm before scaling |
| --- | --- | --- |
| d2 | 10 | 6.833767 |
| d3 | 12 | 7.134175 |
| d4 | 5 | 4.525864 |
| d5 | 0 | 0.000000 |

d4, "Pressure survey: 2,096 psia.", is the shortest passage with words and has the smallest norm, 4.525864. Its words are few, so after scaling each carries a large share: pressure, survey, psia and 096 each end at 0.463693. A short passage whose few words match a query can therefore score high.

## The empty passage

d5 has no tokens, so every weight is 0 and its norm is 0. A vector of zeros cannot be scaled to length 1, and the engine leaves it as it is. The empty passage d5 is a zero vector with norm 0, and it can never rank.

## Why unit length

With every passage at length 1, a score built from the product of two vectors depends only on which words they share and in what proportion. A long report that mentions oil once among many other words is not rewarded for its length. That is the point of the cosine, which the next lesson computes. BM25 handles length differently, with its own parameter, and the BM25 module takes that up.

## Exercise

In the retrieval explorer choose "TF-IDF, ranked by cosine" with the hand set and the query "oil rate". In the ranking table, read the passage weight of oil in d1 and in d3. Work out d3's oil weight by hand from its count, the idf and its norm 7.134175, and compare. Then double d3 by pasting its sentence twice on the same line and read its oil weight again. Explain why it did or did not change.
