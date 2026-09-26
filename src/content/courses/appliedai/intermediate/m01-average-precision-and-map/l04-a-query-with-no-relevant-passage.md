# A query with no relevant passage

{{panel:ae-scoring-explorer}}

Q24, "subsea tree replacement on Ekene-5", was planted in the Ekene set on purpose. Its 8 judged passages are all graded 0 and its reference answer is empty: nothing in the corpus answers it. A good system should say it found nothing, and several scores cannot be computed on it at all.

## A result with its reason

Recall divides by the relevant judged passages, and Q24 has none. Average precision divides by the same count. It returns each metric as null, with the reason beside it, in `notes`:

> recall is undefined: no judged document has grade 1 or more

> average precision is undefined: no judged document has grade 1 or more

This is a result, and the call succeeded. Precision at 5 is still defined on Q24, because it divides by k, and system A's precision there is 0.000000.

## nDCG names its case

nDCG divides by the ideal DCG, and the ideal DCG is 0 in exactly two cases: the query has no judged documents, or every judged document has grade 0. The engine's note says which case it met. On Q24 as judged:

> nDCG is undefined: the 8 judged documents all have grade 0, so the ideal DCG is 0

With the judgments for Q24 removed entirely:

> nDCG is undefined: the query has no judged documents, so the ideal DCG is 0

With one judgment only, EKD-019 at grade 0:

> nDCG is undefined: the 1 judged document has grade 0, so the ideal DCG is 0

Quote the note for the case at hand.

## The no-relevant rule

A mean over queries has to decide what to do with a query that cannot be scored. The engine states its rule in the basis:

> a query with no judged document at grade 1 or more is excluded from every mean and listed in excluded

Excluded is the default, and the listing carries the reason: "no judged document has grade 1 or more". The other rule the engine offers is zero, which keeps the query and scores every metric it cannot give as 0. At k 5 and grade 1 or more:

| noRelevant | queries in the means | A MAP | B MAP | A MRR | B MRR |
| --- | --- | --- | --- | --- | --- |
| exclude (default) | 23 | 0.600278 | 0.593007 | 0.880435 | 0.923913 |
| zero | 24 | 0.575266 | 0.568299 | 0.843750 | 0.885417 |

Zero lowers every mean, because a query nothing answers can only add a 0. Both systems fall, whatever each returned for Q24. The default follows trec_eval. Whichever rule you use, say so: a MAP of 0.600278 and a MAP of 0.575266 are the same runs.

The engine accepts only these two words for the rule:

> noRelevant must be 'exclude' or 'zero'

## When nothing is left

Scored on Q24 alone, every query is excluded and there is nothing to average. The engine returns the means as null and says why:

> no query has a judged document at grade 1 or more, so every mean is null

## Exercise

Open the view for MAP and nDCG with system A's runs, k 5 and relevant at grade 1. Read the queries-in-the-means tile and the line that lists Q24 with its reason. Switch the rule for a query with no relevant passage to kept, scored 0, and read MAP and MRR again against the table above. Then cut the runs and the judgments down to Q24 alone and describe what the tiles show and why.
