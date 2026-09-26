# Means over queries

{{panel:ae-retrieval-explorer}}

One query tells you little about a system. A retrieval evaluation runs a set of queries, scores each at the cutoff, and averages. This lesson takes the four metrics of this module over all 24 Ekene queries for both systems, and reads what the means say and what they leave out.

## The rule, in the engine's words

    mean: arithmetic mean over the included queries: mrr is the mean reciprocal rank, map the mean average precision, hitRate the mean hit

Each query counts once, whatever the number of its relevant passages. The mean of the hits has its own name, the hit rate, and the mean of the reciprocal ranks is the MRR.

## Which queries are included

A query with no relevant passage cannot have a recall: there is nothing to find. Q24, "subsea tree replacement on Ekene-5", is such a query. Its recall is returned as null, with the reason:

> recall is undefined: no judged document has grade 1 or more

The engine leaves Q24 out of every mean and lists it with its reason, so 23 of the 24 queries are included:

> no judged document has grade 1 or more

A query left out silently would make a system look better or worse without anyone knowing why; listed, it is visible. The rule itself, and its alternative, are the Professional tier's to examine.

## The two systems

At k 5, relevant at grade 1 or more, over the 23 included queries:

| mean over the included queries | system A (BM25) | system B (TF-IDF) |
| --- | --- | --- |
| precision at 5 | 0.443478 | 0.434783 |
| recall at 5 | 0.673188 | 0.658696 |
| hit rate at 5 | 0.956522 | 1.000000 |
| MRR at 5 | 0.880435 | 0.923913 |

System B's MRR of 0.923913 puts its first relevant passage higher on average than system A's 0.880435. System B also has a hit on every included query, while system A misses on Q14, the lexical trap. System A's recall at 5 is the higher of the two, and so is its precision.

## What the means do not say

Neither system wins on every metric. Which one is better depends on what the copilot does with the list: a copilot that reads only the first relevant passage would favour B, and one that collects every relevant passage in the top 5 might favour A. The differences are also small, and 23 queries is a small set. Whether a difference that size would survive a new set of queries is a question for a later tier, which compares two systems with a stated method.

A mean also hides its spread. System A's mean recall of 0.673188 averages queries at 1.000000 with Q01 at 0.375000 and Q14 at 0.000000. Read the per-query table before you trust a mean.

## Reporting a mean

Every mean in this tier is quoted with its cutoff, its threshold and the queries left out: "MRR at 5, relevant at grade 1 or more, 23 of 24 queries, Q24 excluded". Without those, a figure cannot be reproduced.

## Exercise

In the retrieval explorer choose "Run queries and score them at a cutoff" with the four starting queries Q01 to Q04, BM25 and k 5. Average the four reciprocal ranks by hand and compare with the MRR tile; do the same for recall. Switch to TF-IDF and compare the two sets of tiles. Then change k to 3 and see which means fall, and explain each change from the ranked lists.
