# Term frequency and document frequency

{{panel:ae-retrieval-explorer}}

TF-IDF scores a passage with two counts for each word. The term frequency, tf, is how many times the word appears in that passage. The document frequency, df, is how many passages in the collection contain the word at least once. A word that appears often in one passage and in few others marks that passage out. This lesson reads both counts on the hand set.

## Term frequency

Term frequency is a raw count, the one the tokens module taught you to make. In d1, "Oil rate 120 bopd at Ekene-1. Oil rate fell.", oil has tf 2 and rate has tf 2. In d3, "Oil and water rates were tested; the oil rate was 150 bopd.", oil has tf 2 and rate has tf 1. The engine's basis states the choice in two words:

    tf: raw count

An option called sublinear tf replaces a count by a smaller figure so that repeats count for less. It is off by default and the course comes back to it when it ranks by cosine.

## Document frequency

Document frequency looks across the whole collection and ignores repeats inside a passage. On the hand set of five passages:

| term | df |
| --- | --- |
| oil | 2 |
| rate | 2 |
| water | 2 |
| ekene | 2 |
| at | 2 |
| bopd | 2 |
| 2 | 2 |
| rates | 1 |
| pressure | 1 |
| 150 | 1 |

oil is in d1 and d3, so its df is 2, although it appears 4 times in all. water is in d2 and d3. The token 2 is in d2, from Ekene-2, and in d4, from the 2 of "2,096". Two quite different pieces of text share a token, which is a reminder that the engine counts strings and knows nothing of what they stand for. rates is in d3 alone, and it is a different token from rate.

## Why both counts

tf says how much a passage talks about a word. df says how common the word is across the collection. A word in almost every passage, such as ekene in the Ekene reports, tells you little about which passage to pick however often it appears. A rare word, such as bubble or injection, points at the few passages that use it. TF-IDF multiplies a tf by a weight that falls as df rises, and the next lesson gives that weight exactly.

On the corpus the same idea holds at scale. On Q02, "initial oil rate of Ekene-3", ekene appears in 44 of the 60 passages and initial in 7. A match on initial therefore counts for much more than a match on ekene.

## The empty passage

d5 is empty. It has no tokens, every tf is 0, and it adds nothing to any df. It still counts as one of the five passages when N, the number of passages, is used.

## Exercise

In the retrieval explorer choose "TF-IDF, ranked by cosine" with the hand set. Type the single-word query "water" and read its df in the query term table. Then type "rates", then "2". For each, name by hand the passages that contain it before you read the df. Finally add a sixth line `d6: Water rate fell, bopd unknown.` and read how the df of water, rate and bopd change.
