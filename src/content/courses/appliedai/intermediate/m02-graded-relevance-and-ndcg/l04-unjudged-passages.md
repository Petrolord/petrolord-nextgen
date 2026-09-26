# Unjudged passages in a ranking

{{panel:ae-scoring-explorer}}

Every metric in this tier compares a ranking with judgments. A ranking can hold a passage that nobody judged for that query, and the engine needs a rule for it. The rule is stated in its basis: unjudged documents count as grade 0.

## How the Ekene judgments were made

The fixture states how the judged set was built: every passage in the top 5 of either system, BM25 and TF-IDF at their default settings, was judged, plus passages the assessor added. Every other passage is unjudged for that query. 183 (query, passage) pairs are judged across the 24 queries.

Because the pool was taken from the same two systems at the same cutoff, both systems' top 5 lists are fully judged. At k 5 system A retrieves 0 unjudged passages and system B 0. For these two runs the rule never fires.

## The count beside the score

The engine counts, per query, how many retrieved passages in the top k were unjudged, and returns it as `unjudgedRetrieved`. On the stated ranking c, a, x, b, d, with judgments a 3, b 2, c 0, d 1 and e 2, the passage x is unjudged:

| rank | passage | grade used | unjudged |
| --- | --- | --- | --- |
| 1 | c | 0 | no |
| 2 | a | 3 | no |
| 3 | x | 0 | yes |
| 4 | b | 2 | no |
| 5 | d | 1 | no |

The count is 1. The engine treats x exactly as it treats c, which a judge graded 0. Precision at 5 is 0.600000 and nDCG at 5, linear gain, is 0.551774 either way, because the scores cannot see the difference. Only the count can.

## Unjudged and irrelevant are different

A passage graded 0 was read and found not relevant. A passage nobody judged may answer the query. Counting it as 0 is a default, and it is a safe one only when the runs being scored are the runs the pool came from. A new retriever, a new cutoff or a new setting will reach passages outside the pool, and every one of them will be scored as irrelevant whatever it says. A system that finds a good passage the pool never saw is then marked down for finding it.

The course's rule for a report follows. Quote `unjudgedRetrieved` beside every score of a system that was not in the pool, and have its unjudged passages judged before its scores are compared with the pooled systems'. A high nDCG says the judged passages were ranked well. It says nothing about passages nobody judged.

## An unjudged query is refused

The rule for a passage is a default. The rule for a whole query is a refusal. A query in the runs that has no judgments at all cannot be scored, and the engine says so by name:

> runs.Q99 has no judgments: every ranked query needs judgments

## Exercise

Open the view for MAP and nDCG with system A's runs, every judgment, k 5 and linear gain. Confirm the unjudged retrieved column reads 0 on every query. Look up the judged passages for Q02 in the judgments, pick a passage id that is not among them, and put it in place of the last passage in A's Q02 list. Run it and read Q02's unjudged retrieved count, AP and nDCG. Then add a run for a query id that has no judgments and read the refusal.
