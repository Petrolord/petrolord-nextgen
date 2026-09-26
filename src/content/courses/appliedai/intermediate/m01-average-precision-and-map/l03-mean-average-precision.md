# Mean average precision

{{panel:ae-scoring-explorer}}

One query's average precision says how well one ranked list served one question. A retriever answers many questions, so the engine averages. MAP, the mean average precision, is the arithmetic mean of the per-query average precision over the included queries.

## The two systems

System A retrieves by BM25 at k 5, k1 1.2 and b 0.75 with the stop list off. System B retrieves by TF-IDF at k 5 with the stop list off. Both are fixed fixture systems, and no model produced anything in them.

At k 5 and relevant at grade 1 or more, over the 23 included queries:

| mean at 5, grade 1 or more | system A (BM25) | system B (TF-IDF) |
| --- | --- | --- |
| MAP | 0.600278 | 0.593007 |
| MRR | 0.880435 | 0.923913 |

System A has the higher MAP. System B has the higher MRR. Both are true at once because the two scores read different things: MRR reads only the first relevant passage, and AP reads every relevant passage and divides by all of them. B tends to put a relevant passage first; A tends to find more of them in its top 5.

## Where the difference comes from

The mean is a sum of queries. Many of them are level: on Q01, Q04 to Q10, Q12, Q13, Q16 to Q18, Q21 and Q22 the two systems score the same AP at k 5. The difference comes from the queries where they part, and those pull in opposite directions. Five of them:

| query | relevant judged | system A AP | system B AP |
| --- | --- | --- | --- |
| Q02 | 5 | 0.050000 | 0.400000 |
| Q11 | 5 | 0.520000 | 0.333333 |
| Q14 | 3 | 0.000000 | 0.216667 |
| Q15 | 3 | 0.388889 | 0.166667 |
| Q20 | 3 | 0.700000 | 0.333333 |

B wins Q02 and Q14 by wide margins. Q14, "Is Ekene-5 producing water?", is the planted lexical trap: the passages say "no water" and "water free", BM25 retrieves none of the 3 relevant passages in its top 5, and A's AP is 0.000000. A wins Q11, Q15 and Q20. The means end close because the wins cancel.

Read a MAP with its per-query table beside it. Whether a gap this size means anything is the question of the last module, which compares the two systems query by query with a seeded bootstrap.

## Every judged query needs a ranking

MAP is a mean over the judged queries, so the engine insists that every judged query was answered. A system that returned nothing for a query has an empty ranking, and that is scored. A query missing from the runs is refused:

> runs has no ranking for query Q01 (every judged query needs one; an empty array is a ranking that retrieved nothing)

The distinction matters. An empty array says the system tried and retrieved nothing, and its AP is 0. A missing key says nobody knows what the system did, and a mean that silently skipped it would score the system on the questions it chose to answer.

## Exercise

Open the view for MAP and nDCG. It starts with system A's runs and every judgment, at k 5 and grade 1. Read the MAP tile and find Q02, Q11, Q14, Q15 and Q20 in the table. Then load system B: switch the panel to the groundedness view, copy its retrieved lists (they are system B's), switch back and paste them over the runs. Read B's MAP and the same five rows. Finally delete Q01 from the runs, read the refusal, and then put Q01 back as an empty array and see what its AP becomes.
