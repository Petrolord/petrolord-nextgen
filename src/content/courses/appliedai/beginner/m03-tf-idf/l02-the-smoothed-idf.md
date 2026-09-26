# The smoothed inverse document frequency

{{panel:ae-retrieval-explorer}}

The inverse document frequency, idf, turns a df into a weight. The rarer a word, the larger its idf, so a match on a rare word counts for more. There are several ways to write the idf. The engine uses scikit-learn's default, the smoothed form, so a figure from this engine compares directly with one from that library. This lesson works the formula on the hand set.

## The formula, in the engine's words

    idf: ln((1 + N) / (1 + df)) + 1, N = 5 (scikit-learn smooth_idf)

N is the number of passages, 5 on the hand set, and ln is the natural logarithm. Read the formula from the inside. Adding 1 to both N and df behaves as if one extra passage contained every word, so no df can make the fraction divide by 0. The logarithm then shrinks the ratio. The final + 1 lifts every idf by 1.

## Worked on the hand set

oil is in 2 of the 5 passages, so its idf is ln((1 + 5) / (1 + 2)) + 1 = 1.693147. A word in only 1 passage scores higher:

| term | df | idf |
| --- | --- | --- |
| 096 | 1 | 2.098612 |
| injection | 1 | 2.098612 |
| rates | 1 | 2.098612 |
| the | 1 | 2.098612 |
| oil | 2 | 1.693147 |
| rate | 2 | 1.693147 |
| water | 2 | 1.693147 |
| ekene | 2 | 1.693147 |

Every word with the same df shares the same idf. The idf knows nothing about the word itself: on this tiny hand set "the" is in one passage only, so it earns the high weight of a rare word. On the corpus, where the is common, its weight falls: in the query vector of Q04, "bubble point pressure of the Ekene oil", the carries the smallest weight, 0.188200.

## Why the final + 1

A word in every passage would have df equal to N, the fraction would be 1, and its logarithm 0. The final + 1 keeps that word's idf at 1, never 0, so it still adds a little to a match. The engine's reasons for this form are about comparison: it is scikit-learn's default, so a learner can check any figure against that library. An unsmoothed idf is a common alternative, and it gives different weights.

## Refusals you can meet here

A TF-IDF vocabulary needs at least one token somewhere. A collection whose only passage is empty is refused, naming `documents`:

> documents has no token in any text: the vocabulary is empty

The sublinear switch takes true or false, like the stop list, and anything else is refused:

> sublinearTf must be true or false

## How the idf is used

The idf is one factor of a weight. Each word in a passage gets its count times its idf, and the next lesson scales those weights so each passage's list has length 1. The query gets the same treatment. Keep the idf table beside you; every hand calculation in this module starts from it.

## Exercise

In the retrieval explorer choose "TF-IDF, ranked by cosine" with the hand set. Type the single-word query "oil" and confirm the idf 1.693147. Then type "injection" and confirm 2.098612. Work out by hand what idf a word in all five passages would have, then test it: add the word "field" to the end of every hand set line, including d5, and type the query "field". Finally replace the whole passage box with one line `d1: .` and read the refusal.
