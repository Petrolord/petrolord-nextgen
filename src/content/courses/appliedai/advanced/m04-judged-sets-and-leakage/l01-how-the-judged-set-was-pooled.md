# How the judged set was pooled

{{panel:ae-trust-explorer}}

{{panel:ae-scoring-explorer}}

Nobody grades every passage against every query. With 60 passages and 24 queries that would be 1440 judgments, and a real document store holds far more than 60 passages. A judged set is therefore always partial, and how it was chosen decides what every metric computed on it can and cannot say.

## The pooling rule

The fixture states how the Ekene judgments were built:

> every passage in the top 5 of either system (BM25 and TF-IDF, default settings) is judged, plus passages the assessor added; unjudged passages count as grade 0

A judged set built this way is a POOL. The passages the pooled systems retrieved are judged, and every other passage is unjudged and counts as grade 0. The two systems in the pool are the course's systems A and B: A retrieves by BM25 at k 5, k1 1.2 and b 0.75, and B by TF-IDF at k 5, both with the stop list off.

## What the pool holds

The pool came to 183 judged (query, passage) pairs. The count differs by query:

| query | judged | grade 3 | grade 2 | grade 1 | grade 0 |
| --- | --- | --- | --- | --- | --- |
| Q02 | 12 | 1 | 0 | 4 | 7 |
| Q10 | 3 | 2 | 0 | 0 | 1 |
| Q14 | 10 | 1 | 2 | 0 | 7 |
| Q24 | 8 | 0 | 0 | 0 | 8 |

Q10, "diesel spill during bunkering", has only 3 judged passages: only 2 passages contain a query word at all, so neither system could rank more than 2, and the third came from the assessor. Q02, "initial oil rate of Ekene-3", has 12, the most of any query. Q24 has 8 judged passages and not one above grade 0: nothing in the corpus answers it.

## What the pool guarantees, and for whom

The engine counts, for every ranked list, how many retrieved passages nobody judged: `unjudgedRetrieved`. Because the pool was built from the two systems' own top 5 lists, at k 5 system A retrieves 0 unjudged passages and system B 0. Every passage either system shows at the cutoff carries a judged grade.

That guarantee holds for the pooled systems at the pooled cutoff and for nothing else. Change the cutoff, change a setting, or bring a third system, and passages the pool never saw start to appear in the ranked lists. Each one scores as grade 0, whether or not it answers the query. The next two lessons measure that.

## Why a pool at all

Pooling spends judging effort where it matters: on the passages some system actually shows. The cost is that the judged set carries the fingerprints of the systems that built it. It is a key that fits the locks it was cut from.

## Exercise

Open the scoring explorer on "MAP and nDCG over a set of queries". It loads system A's runs and the Ekene judgments at k 5, grade 1, linear gain. Read the unjudged retrieved column and confirm it is 0 on every query. Then, in the runs box, replace the fifth passage of Q01's run with a passage id that the judgments box does not list under Q01. Read the unjudged retrieved count, the AP and the nDCG for Q01 again, and write one sentence on what the engine assumed about the passage you added.
