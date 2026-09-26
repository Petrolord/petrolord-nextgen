# The Ekene document set

{{panel:ae-retrieval-explorer}}

Every document, query, judgment and answer in this course comes from one set of fixture files about the Ekene field. The Ekene field is synthetic. It was written for this platform by a stated script that reproduces the files byte for byte, and no real company, person or incident appears in it. Where a passage shares a figure with the platform's other Ekene data, such as a rate, a pressure or a well top, the figure is read from that data.

## The passages

The corpus holds 60 passages, EKD-001 to EKD-060. Each has an id, a type, a title and a text, and the engine indexes the text alone.

| passage type (fixture) | passages |
| --- | --- |
| production_note | 14 |
| hse_note | 8 |
| pressure_survey | 7 |
| well_report | 6 |
| drilling_report | 6 |
| facilities_note | 5 |
| injection_note | 4 |
| geology_note | 3 |
| pvt_report | 3 |
| core_report | 2 |
| dca_note | 2 |

Across the corpus the passages carry 2299 tokens, a mean of 38.316667 a passage, from 16 to 58 tokens each, and a vocabulary of 574 distinct tokens. EKD-058 is an exact copy of EKD-046, a spill note filed twice, so every method scores the two alike and a tie rule decides their order.

## The queries and their judgments

There are 24 queries, Q01 to Q24, each with a short reference answer. A person judged passages for each query on a four-grade scale:

| grade | meaning (fixture) |
| --- | --- |
| 3 | answers the query |
| 2 | relevant |
| 1 | related |
| 0 | judged not relevant |

In all, 183 (query, passage) pairs are judged. This course calls a passage relevant when its grade is at or above a stated threshold, grade 1 by default, and it states the threshold with every figure that depends on it. Q24, "subsea tree replacement on Ekene-5", has no passage judged above 0: nothing in the corpus answers it.

Not every passage was judged for every query. The judged set was pooled: every passage in the top 5 of either system was judged, plus passages the assessor added. A passage nobody judged counts as grade 0.

## The two systems

Two fixed systems answered every query. Each retrieved its top 5 passages, wrote an answer text citing passage ids, and gave a short answer.

| system | retriever (fixture) | answers |
| --- | --- | --- |
| A | bm25 k 5 k1 1.2 b 0.75, stop list off | 24 |
| B | tfidf k 5, stop list off | 24 |

The answer texts are hand-written fixture text. No model produced them, at build time or at run time. Each system's retrieved lists are exactly what the engine returns on the corpus with that method.

## What was planted

The fixture plants 22 defects on purpose, each found by a named engine behaviour. Three meet you in this tier: the duplicated spill note, found by the tie rule; the Q14 lexical trap, where BM25 misses every relevant passage; and system A's Q06 oil column taken from a passage it never retrieved. Later tiers use the rest, together with an extraction set and a calibration set that this tier leaves alone.

## Exercise

In the retrieval explorer choose "Run queries and score them at a cutoff". The passage box holds all the Ekene passages. Find EKD-046 and EKD-058 in it and confirm the two texts are the same. Then read the ranked lists for Q01 to Q04 by BM25 at k 5, switch to TF-IDF, and write down every passage that appears in either list for Q01. Compare your list with the Q01 judgments in the judgments box: every passage you wrote down should carry a grade, because the pool was built from exactly these lists.
