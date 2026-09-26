# A score read term by term

{{panel:ae-retrieval-explorer}}

A BM25 score is a sum, and every part of it can be printed. The engine returns, for each ranked passage, each matched query word with its count and its contribution. Reading a score that way shows exactly why a passage ranked where it did. This lesson reads one query on the Ekene corpus and finds a passage that ranked for the wrong reason.

## One contribution, worked by hand

On the hand set, "oil rate", d1 has length 10 and the average is 7.400000. Its oil term:

    idf 0.875469 x 2 x (1.2 + 1) / (2 + 1.2 x (1 - 0.75 + 0.75 x 10 / 7.400000)) = 1.095514

rate contributes the same, so d1 scores 2.191027. d3 has oil twice and rate once in 12 tokens:

| rank | passage | length | score | term: tf, contribution |
| --- | --- | --- | --- | --- |
| 1 | d1 | 10 | 2.191027 | oil: 2, 1.095514; rate: 2, 1.095514 |
| 2 | d3 | 12 | 1.722606 | oil: 2, 1.024632; rate: 1, 0.697974 |

d3's oil count equals d1's, yet it contributes less, because d3 is longer.

## Q02 on the corpus

Q02 asks "initial oil rate of Ekene-3". The query terms are initial (idf 2.095971), oil (0.912201), rate (2.239072), of (1.140459), ekene (0.315385) and 3 (1.140459). BM25 at k1 1.2 and b 0.75 ranks:

| rank | passage | length | score | judged grade (fixture) | term: tf, contribution |
| --- | --- | --- | --- | --- | --- |
| 1 | EKD-043 | 41 | 5.129851 | 0 | rate: 1, 2.176711; of: 2, 1.537842; ekene: 1, 0.306601; 3: 1, 1.108697 |
| 2 | EKD-010 | 47 | 4.617541 | 0 | initial: 1, 1.918143; oil: 3, 1.367071; of: 1, 1.043700; ekene: 1, 0.288627 |
| 3 | EKD-013 | 34 | 4.349067 | 0 | initial: 1, 2.197235; oil: 1, 0.956273; 3: 1, 1.195559 |
| 4 | EKD-003 | 56 | 4.084216 | 3 | oil: 2, 1.110177; of: 3, 1.630868; ekene: 2, 0.383833; 3: 1, 0.959339 |
| 5 | EKD-008 | 51 | 3.931617 | 0 | initial: 1, 1.845996; oil: 1, 0.803408; of: 1, 1.004443; ekene: 1, 0.277770 |

## Reading the rows

EKD-043 is a drilling report. It ranks first on the words rate and of, which it uses in "rate of penetration". Its largest contribution, 2.176711, comes from rate, the rarest query word. It never mentions oil.

EKD-003, the passage that answers the query, ranks fourth. It matches oil, of, ekene and 3, and it does not contain the word rate or initial at all, so the two heaviest query words add nothing to it. It is also the longest of the five at 56 tokens, which marks every contribution down.

BM25 matches words and knows nothing of meaning. A word such as of, which says nothing about the question, earns a real share of the score because it is in only 19 of the 60 passages, which gives it a sizeable idf. When a ranking looks wrong, read its rows term by term before you change any setting: the rows show which word caused it.

## Exercise

In the retrieval explorer choose "Run queries and score them at a cutoff", select all the text in its passage box and copy it. Choose "BM25, read term by term", replace the hand set with the copied Ekene passages, and type Q02, "initial oil rate of Ekene-3". Confirm the five rows above. Then remove the word "of" from the query and read where EKD-003 moves. Then try rewordings a person might type, and look for one that brings EKD-003 to rank 1.
