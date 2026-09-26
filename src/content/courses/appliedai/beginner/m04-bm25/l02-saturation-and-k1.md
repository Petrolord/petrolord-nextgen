# Term saturation and k1

{{panel:ae-retrieval-explorer}}

In TF-IDF a word's weight grows in step with its count: twice the count, twice the weight. BM25 lets the count help with diminishing returns. The first mention of a word matters most, the second a little less, and after many repeats one more adds almost nothing. The parameter k1 sets how fast the count saturates. This lesson reads the saturation off stated passages and the Ekene corpus.

## The score, in the engine's words

    score: sum over the distinct query terms found in the document of idf x tf (k1 + 1) / (tf + k1 (1 - b + b dl / avgdl)), k1 = 1.2, b = 0.75; a repeated query word counts once

For each query word the passage contains, the idf is multiplied by a fraction built from the count tf. The part in brackets, with b, dl and avgdl, is about length and has the next lesson to itself. Here it is switched off by setting b to 0, and the fraction becomes tf (k1 + 1) / (tf + k1).

## Saturation, read off six stated passages

Six stated passages repeat "oil" 1, 2, 3, 5 and 9 times, and one says "gas". Scored for "oil" with b = 0 so length plays no part (k1 = 1.2, idf 0.241162):

| passage | tf | contribution | contribution / idf (derived) |
| --- | --- | --- | --- |
| s1 | 1 | 0.241162 | 1.000000 |
| s2 | 2 | 0.331598 | 1.375000 |
| s3 | 3 | 0.378969 | 1.571429 |
| s5 | 5 | 0.427868 | 1.774194 |
| s9 | 9 | 0.468138 | 1.941176 |

The last column divides out the idf. It climbs toward k1 + 1 = 2.2 and never reaches it: each extra repeat adds less. Going from 1 mention to 2 lifts the ratio from 1.000000 to 1.375000; going from 5 mentions to 9 lifts it only from 1.774194 to 1.941176. A passage that repeats a word nine times is not rewarded nine times over.

## What k1 does

A small k1 makes the count saturate fast. At k1 = 0 the fraction is 1 for any count, so every matched word scores its idf alone. On the hand set, "oil rate" at k1 0 gives d1 1.750937 and d3 1.750937, each the sum of its matched terms' idf, although d1 says rate twice and d3 once. A large k1 lets repeats keep counting for longer. On Q13, "Ekene-6 water cut at the end of 2025":

| rank | k1 1.2: passage | score | k1 2: passage | score |
| --- | --- | --- | --- | --- |
| 1 | EKD-029 | 9.951737 | EKD-029 | 10.388779 |
| 2 | EKD-030 | 9.798866 | EKD-030 | 10.116345 |
| 3 | EKD-028 | 7.982142 | EKD-028 | 8.074363 |
| 4 | EKD-027 | 6.818244 | EKD-027 | 7.327155 |
| 5 | EKD-037 | 6.222042 | EKD-037 | 6.469637 |

Each of the five top scores rises at k1 2, and on this query the order holds. Below the top five some fall, EKD-008 from 2.323039 to 2.306499: a term met once in a longer than average passage loses as k1 grows. The default is k1 = 1.2, and system A used it.

## A k1 the engine refuses

k1 must be 0 or more. A negative value is refused, naming `k1`:

> k1 must be a finite number, 0 or more (0 scores each matched term at its idf)

The message itself restates what k1 = 0 means.

## Exercise

In the retrieval explorer choose "BM25, read term by term". Replace the passages with the six stated lines `s1: oil`, `s2: oil oil`, `s3: oil oil oil`, `s5:` followed by oil five times, `s9:` followed by oil nine times, and `g: gas`. Set b to 0, type the query "oil", and confirm each contribution in the table. Then set k1 to 0 and read the contributions again, and set k1 to 3 and see how the gap between s1 and s9 changes. Finally type k1 -0.5 and read the refusal.
