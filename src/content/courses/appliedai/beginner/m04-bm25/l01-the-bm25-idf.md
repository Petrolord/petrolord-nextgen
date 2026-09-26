# The BM25 inverse document frequency

{{panel:ae-retrieval-explorer}}

BM25 is the second retrieval method in this engine, and the one system A uses. Like TF-IDF it weights a matched word by how rare it is, but it writes that weight with a different formula and treats the count and the passage length in its own way. This module takes BM25 apart one piece at a time, starting with its idf.

## The formula, in the engine's words

    idf: ln(1 + (N - df + 0.5) / (df + 0.5)) (Lucene), N = 5

N is the number of passages and df the number that contain the word. The 0.5 terms smooth the counts. This is the form the Lucene search library uses, and the engine names it so.

## Worked on the hand set

For the query "oil rate" on the five hand-set passages, both words are in 2 passages:

| query term | df | BM25 idf |
| --- | --- | --- |
| oil | 2 | 0.875469 |
| rate | 2 | 0.875469 |

Work it: (5 - 2 + 0.5) / (2 + 0.5) is 3.5 over 2.5, add 1, take the natural logarithm, and the result is 0.875469. The same word under TF-IDF's smoothed idf was 1.693147. The two methods weight the same word differently, so a TF-IDF weight and a BM25 weight are never compared as if they were one quantity.

## Never negative

The older Robertson form of the BM25 idf leaves out the 1 inside the logarithm. Its argument drops below 1 exactly when the word is in more than half the passages, df > N / 2, so for such a word that form goes negative, and a match on a common word would lower a passage's score. On the corpus, ekene is in 44 of the 60 passages: the Robertson form would give it -0.992129, where the engine's idf is 0.315385. The Lucene form adds 1 inside the logarithm, so a word in every passage still scores a small positive idf. The engine chose it for that reason: never negative. A word in no passage has no posting and contributes nothing.

## On the corpus

Q02, "initial oil rate of Ekene-3", on the 60 Ekene passages:

| query term | df | BM25 idf |
| --- | --- | --- |
| rate | 6 | 2.239072 |
| initial | 7 | 2.095971 |
| of | 19 | 1.140459 |
| 3 | 19 | 1.140459 |
| oil | 24 | 0.912201 |
| ekene | 44 | 0.315385 |

ekene is in 44 of the 60 passages and earns the smallest idf, 0.315385, which is still above 0. rate is in only 6 and earns the most. The word of and the well number 3 each appear in 19 passages and share an idf.

## A corpus with no token

BM25 divides each passage length by the average length. If no passage holds a token, that average is 0 and the formula cannot run, so the engine refuses naming `documents`:

> documents has no token in any text: BM25 needs an average document length above 0

## Exercise

In the retrieval explorer choose "BM25, read term by term" with the hand set. Type the single word "oil" as the query and read its df and BM25 idf. Then type "injection" and work its idf by hand before you read it. Next add the word "field" to every hand set line, including d5, and type the query "field": check that its idf is small and above 0. Last, replace the passage box with the one line `d1: ...` and read the refusal and the field it names.
