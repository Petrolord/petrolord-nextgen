# The capstone brief

{{panel:ae-retrieval-explorer}}

The Associate capstone hands you a set of passages, a few worded queries with their judgments, and a set of cited answers, and it asks for six numbers. Every one answers this tier's question, retrieval and cited answers by hand, and every one is a value the engine returns. Each has a worked twin in this tier, computed on the Ekene documents with the same rule.

| the kind of field | the rule it tests | a worked twin in this tier |
| --- | --- | --- |
| the BM25 idf of one word | the Lucene idf over the stated passages | oil on the hand set, 0.875469 |
| the top BM25 score for a named query | BM25 at the stated k1 and b | Q02 on the corpus, EKD-043, 5.129851 |
| the top TF-IDF cosine for a named query | raw counts, smoothed idf, unit vectors | Q04 on the corpus, EKD-018, 0.553949 |
| a mean recall at a stated cutoff | relevant in the top k over relevant judged, averaged over queries | system A at 5, 0.673188 |
| an MRR at a stated cutoff | the mean of 1 / rank of the first relevant passage | system A at 5, 0.880435 |
| a pooled supported fraction | supported claims over claims, cited and retrieved | system A, 0.959184 |

## What each field asks of you

The idf field asks for one word's BM25 idf over the capstone's own passages. Type that word alone as the query and read its df and idf; N and df come from the passages you were given, and the Ekene corpus plays no part.

The two top-score fields each ask for the first row of one ranking. Check the method: a BM25 score and a TF-IDF cosine for the same query are different quantities, and neither is a probability.

The recall and MRR fields ask for means over the capstone's queries at the cutoff the brief states, with relevant at the threshold it states. Read the per-query table first and confirm no query was excluded.

The supported fraction pools every claim in every answer, and a claim counts as supported only in a passage the answer cites and retrieved. Give each answer its retrieved list.

## How to work it

Read the brief for every setting it states, method, k, k1, b, stop list and threshold, and use exactly those. Where the brief is silent, the engine's defaults apply: the stop list off and TF-IDF on raw counts. Before you open it, reproduce the twins in the retrieval explorer and check each to the last printed digit.

## What the capstone will not ask

It asks for no average precision, no nDCG, no short-answer score and no extraction outcome; those are the Professional tier's. It asks for no agreement between annotators and no calibration figure, which are the Expert tier's. An answer that brings any of them in has answered a question nobody asked.

## Exercise

Reproduce the first three twins in the retrieval explorer. Use "BM25, read term by term" with the hand set and the single-word query "oil" for the idf. For Q02, copy the Ekene passages from the Run view into the BM25 view and read the top score. Use "TF-IDF, ranked by cosine" the same way for Q04. The recall, MRR and supported-fraction twins are computed over the whole Ekene query set, and the panel starts from a smaller set, so practise the same means by hand. In "Run queries and score them at a cutoff", run the four starting queries by BM25 at k 5, check each row against system A's figures in this tier, and average the recall and reciprocal rank columns yourself before you read the tiles. In "Claims in cited answers", add up the claims and the supported claims of the six starting answers and divide, then compare with the pooled tile. For each, write down the view, the settings and the figure.
