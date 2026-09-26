# Retrieval before the answer is written

{{panel:ae-retrieval-explorer}}

A copilot that answers from documents is built in two stages. The retrieval stage picks a handful of passages out of the whole collection. The writing stage sees only those passages and writes an answer from them. Whatever the retrieval stage leaves out, the writing stage never reads. This lesson shows why the order matters and what goes wrong at each stage.

## Retrieval works on words

The engine in this course offers two retrieval methods, TF-IDF and BM25. Both break a text into tokens and score a passage by the tokens it shares with the query. Neither knows what a word means. There is no dense (embedding) retrieval, no synonym list and no stemming, so "producing" and "produced" are different tokens. That is a deliberate limit: every score can be worked by hand, and every failure can be traced to a word.

## A question the words miss

Q14 asks "Is Ekene-5 producing water?". Three passages are relevant to it at grade 1 or more. The passages that answer it say "no water" and "water free", and the query says "producing water". This lexical trap was planted in the fixture on purpose. BM25 retrieves none of the three in its top 5:

| query | relevant judged | relevant in the top 5 | hit at 5 |
| --- | --- | --- | --- |
| Q14 | 3 | 0 | 0 |

With nothing useful retrieved, system A's answer to Q14 says so and states no figure:

> The retrieved passages do not say whether Ekene-5 produces water.

That answer is honest about what it saw. It is still no help to the person who asked, and the cause sits in the retrieval stage.

## A figure from outside the retrieved passages

The opposite failure happens in the writing stage. System A's answer to Q06, about the depth of the oil-water contact, states a maximum oil column of 20.3 m. That figure is in EKD-007, which was neither retrieved nor cited. The check reports it in the engine's words:

> the number 20.3 is not in the cited passage EKD-001; it appears only in passage EKD-007, neither cited nor retrieved

This course calls such a figure an unsupported claim, and it is what the course means by a hallucination: a figure the answer states that the check could not find in a passage it cites and retrieved, named with the reason. This one was planted too.

## Two stages, two kinds of score

Because the stages fail differently, they are scored differently. The retrieval stage is scored by where the relevant passages land in a ranked list cut at k, with precision, recall, hit and reciprocal rank. The writing stage is scored claim by claim against the passages the answer cites. A copilot can do well on one and badly on the other, so a report names both.

| stage | what it sees | how this tier scores it |
| --- | --- | --- |
| retrieval | every passage in the collection | metrics at a cutoff k |
| writing | the retrieved passages only | claims found in cited, retrieved passages |

## Exercise

In the retrieval explorer choose "BM25, read term by term". Replace the passages with two of your own, for example one line `a: Ekene-5 is water free.` and one line `b: Ekene-5 is producing oil.`, and type the query "Is Ekene-5 producing water?". Read which passage ranks first and which query terms each one matched. Then rewrite passage a so that it would rank first, and note which word you had to add.
