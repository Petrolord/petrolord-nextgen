# Length normalisation and b

{{panel:ae-retrieval-explorer}}

A long passage has more chances to contain a query word, and more chances to repeat it. BM25 marks a long passage down for that, and the parameter b sets how hard. TF-IDF handled length by scaling every vector to unit length; BM25 does it inside the score, by comparing each passage's length with the average. This lesson reads b on the Ekene corpus.

## Where length enters

In the BM25 score the count tf is divided by tf + k1 (1 - b + b dl / avgdl). Here dl is the passage's length in tokens and avgdl the mean length over the corpus. A passage of exactly average length has dl / avgdl = 1, and the bracket is 1 whatever b is. A longer passage makes the bracket bigger and its contribution smaller; a shorter one does the opposite.

b runs from 0 to 1. At b = 0 the bracket is 1 for every passage, and length plays no part. At b = 1 the full ratio dl / avgdl applies. The default, and system A's setting, is b = 0.75.

On the hand set avgdl is 7.400000, and the empty passage d5 counts in the mean with length 0. On the Ekene corpus avgdl is 38.316667.

## b on Q13

Q13, "Ekene-6 water cut at the end of 2025", scored at three values of b, with each passage's length:

| rank | b 0: passage (length) | score | b 0.75: passage (length) | score | b 1: passage (length) | score |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | EKD-030 (43) | 10.217811 | EKD-029 (29) | 9.951737 | EKD-029 (29) | 10.305812 |
| 2 | EKD-029 (29) | 9.024140 | EKD-030 (43) | 9.798866 | EKD-030 (43) | 9.667097 |
| 3 | EKD-028 (44) | 8.427403 | EKD-028 (44) | 7.982142 | EKD-028 (44) | 7.844305 |
| 4 | EKD-006 (56) | 7.056713 | EKD-027 (24) | 6.818244 | EKD-027 (24) | 7.198868 |
| 5 | EKD-002 (58) | 6.105306 | EKD-037 (35) | 6.222042 | EKD-037 (35) | 6.290669 |

At b = 0 the longer EKD-030 (43 tokens) is first; at b = 1 the shorter EKD-029 (29 tokens) is. The long passages EKD-006 and EKD-002 hold places 4 and 5 at b = 0 and drop out of the top 5 once length counts. At b = 0 the fifth place is also a tie at the cutoff.

## A b the engine refuses

b must lie from 0 to 1. A value outside is refused, naming `b`:

> b must be a number from 0 to 1 (0 removes length normalisation)

## Choosing b

There is no single right b. Short, dense notes and long reports in one corpus pull in different directions, and the Ekene set mixes both, from 16 to 58 tokens a passage. Whatever you choose, report it with the figure: a BM25 score quoted without its k1 and b cannot be reproduced.

## Exercise

In the retrieval explorer choose "BM25, read term by term" with the hand set and the query "oil rate". Read the length and score of d1 and d3 at b 0.75. Set b to 0 and then to 1, and note which passage gains and which loses at each, given that d1 has 10 tokens and d3 has 12 against an average of 7.400000. Then type b 1.5 and read the refusal.
