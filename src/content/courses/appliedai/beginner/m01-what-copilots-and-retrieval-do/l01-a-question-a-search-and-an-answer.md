# A question, a search and an answer

{{panel:ae-retrieval-explorer}}

A copilot for oilfield documents does three things in a row. It takes a question, it searches a set of passages for the ones that look most useful, and it writes an answer from the passages it found, citing the ones it used. This course measures the first two steps and checks the third, and it does all of it without running a language model. This lesson walks one question through the chain.

## The question

Take Q02 from the Ekene document set, "initial oil rate of Ekene-3". The reference answer written into the fixture is 150 bopd. A person would open the well report for Ekene-3 and read the rate. A copilot has to find that report first.

## The search

The search step scores every passage against the question and keeps the best few. System A, one of the two fixed systems in this course, searches with BM25 and keeps its top 5. On Q02 it ranks the passages like this:

| rank | passage | BM25 score | judged grade (fixture) |
| --- | --- | --- | --- |
| 1 | EKD-043 | 5.129851 | 0 |
| 2 | EKD-010 | 4.617541 | 0 |
| 3 | EKD-013 | 4.349067 | 0 |
| 4 | EKD-003 | 4.084216 | 3 |
| 5 | EKD-008 | 3.931617 | 0 |

The passage that answers the question, EKD-003, is fourth. EKD-043 is a drilling report about the rate of penetration, and it ranks first because it shares the words rate and of with the question. BM25 matches words and knows nothing of meaning. The score is a BM25 score, a sum over matched words, and it is never a probability.

## The answer

System A's answer to Q02 cites EKD-003. Its text holds 2 claims, and the check finds both of them in EKD-003, so its supported fraction is 1.000000. The answer is checkable because it names its source. A figure with no citation behind it could have come from anywhere.

## What this course measures at each step

| step | what is measured | where in this tier |
| --- | --- | --- |
| words | how a text becomes tokens | the tokens module |
| search | how TF-IDF and BM25 score a passage | the TF-IDF and BM25 modules |
| ranking | where the relevant passages land in the top k | the ranking and metrics module |
| answer | whether each number, date and quote is in a cited passage | the answers module |

Every number in this tier is a return value of one engine, run on documents, queries, judgments and answers written down in advance. The engine runs no model. The two systems' answers are fixture text, written once by hand to stand in for what a copilot returns.

## Why start here

A copilot can only be as good as the passages it retrieves. If the search misses the right passage, the best writer in the world cannot cite it. If the answer states a figure that no cited passage holds, a reader cannot trace it. Both failures are measurable, and the rest of this tier shows how.

## Exercise

Open the retrieval explorer and choose "Claims in cited answers". The answers box starts with system A's first six answers. Find the Q02 row, read its claims and the passage each was found in, and confirm both are marked supported. Then choose "Run queries and score them at a cutoff", keep BM25 and k 5, and find where EKD-003 sits in the Q02 ranked list. Switch the method to TF-IDF and note whether EKD-003 moves up or down.
