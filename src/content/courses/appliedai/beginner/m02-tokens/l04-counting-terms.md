# Counting terms in a passage

{{panel:ae-retrieval-explorer}}

Once a passage is a list of tokens, the engine counts. Two counts matter for everything that follows: how many times each token appears in a passage, and how many tokens the passage holds in all. The first drives how strongly a passage matches a query word. The second is the passage's length, which BM25 uses to mark long passages down. This lesson counts both on real Ekene passages.

## Counting one passage

Each passage below was tokenised by the engine with the stop list off and then with it on. The last column gives the three most frequent tokens with the list off.

| passage | tokens | with the stop list on | the three most frequent tokens (count) |
| --- | --- | --- | --- |
| EKD-001 | 56 | 33 | m (4), the (4), at (3) |
| EKD-018 | 44 | 31 | the (5), pressure (3), 01 (2) |
| EKD-030 | 43 | 39 | 0 (4), bopd (4), ekene (4) |

Read the rows. In EKD-001 the most frequent tokens are a unit, m, and two small words. In EKD-018 pressure appears 3 times, and 01 twice because dates split into pieces. EKD-030 repeats 0, bopd and ekene. Counting does not know which tokens matter; the scoring methods decide how much a count is worth.

## The length of a passage

A passage's length, for BM25, is its token count after the stop list. With the list off, as in the course's teaching settings, that is every token. EKD-001 has length 56. With the list on it would have length 33, and every length-based adjustment would change with it.

Across the corpus the 60 passages carry 2299 tokens, from 16 to 58 tokens a passage. Their mean, 38.316667, is the average length BM25 compares each passage against. It has a name in the formula, avgdl. With the stop list on the mean falls to 27.483333.

## The hand set

The course also uses five short stated passages, d1 to d5, small enough to count with a pencil:

| passage | text | tokens |
| --- | --- | --- |
| d1 | "Oil rate 120 bopd at Ekene-1. Oil rate fell." | 10 |
| d2 | "Water injection at Ekene-2 started on 2023-01-01." | 10 |
| d3 | "Oil and water rates were tested; the oil rate was 150 bopd." | 12 |
| d4 | "Pressure survey: 2,096 psia." | 5 |
| d5 | "" | 0 |

In d1, oil appears 2 times and rate 2 times. In d3, oil appears 2 times and rate once; rates is a different token. The empty d5 has length 0. The mean length of the five is 7.400000, and the empty passage counts in that mean with length 0.

## Why counts come first

Everything the next two modules compute is built from these counts. TF-IDF multiplies a count by a weight for how rare the token is. BM25 lets a count grow with diminishing returns and adjusts it for length. If your count of a passage disagrees with the engine's, every later figure will too, so the first check on any hand calculation is the token count.

## Exercise

In the retrieval explorer choose "Run queries and score them at a cutoff" and copy the text of EKD-018 from its passage box. Choose "Tokens of a text", paste it, and confirm 44 tokens with the stop list off and 31 with it on. Count by hand how many times pressure appears and check it against the table. Then paste the hand set line for d3 and count its tokens yourself before reading the engine's count.
