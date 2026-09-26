# Unjudged and irrelevant are different

{{panel:ae-trust-explorer}}

{{panel:ae-scoring-explorer}}

Every metric in this course follows one rule for a passage nobody graded, stated in the engine's basis:

> relevant: grade >= 1; unjudged documents count as grade 0

A metric must give an unjudged passage some value, and 0 is the value that credits nothing. The rule has a cost. An unjudged passage scored as grade 0 is treated exactly as a passage an assessor read and rejected, although nobody has read it. The two are different kinds of zero, and the engine keeps count of the first kind so a reader can tell them apart.

## Outside the pool

The pool was built from the top 5 of systems A and B. Run anything else and unjudged passages appear. The course ran two runs the pool did not come from, at stated settings, scored at grade 1 or more with linear gain:

| run | unjudged passages retrieved, all queries | queries with an unjudged passage | mean precision | MAP | mean nDCG |
| --- | --- | --- | --- | --- | --- |
| system A's retriever at k 5 (in the pool) | 0 | 0 | 0.443478 | 0.600278 | 0.762753 |
| BM25 at k 10 | 80 | 22 | 0.291304 | 0.670893 | 0.816045 |
| BM25 b 0.4, stop list on, k 5 | 16 | 11 | 0.443478 | 0.656854 | 0.799171 |

## Reading the k 10 row

Doubling the cutoff for system A's own retriever brings 80 unjudged passages into the lists, on 22 of the 24 queries. Every one of them is scored as grade 0. Mean precision at 10 falls to 0.291304: it divides by 10, and 80 of the new places hold unjudged passages. Some of that fall may be real. Some may be an artefact: a few of the 80 may answer their query and count as misses only because nobody looked.

MAP and nDCG rise at k 10, to 0.670893 and 0.816045, because relevant judged passages below rank 5 can now count. The same unjudged passages leave these two figures open in a way the table alone cannot show. No figure on the k 10 row can be read without the count beside it.

## What the engine reports

For every ranked list the engine returns `unjudgedRetrieved`, the number of retrieved passages with no judgment. It is a count, and it carries no guess about their grades. The rule the course follows is plain: report unjudgedRetrieved beside every score of a new system, and judge its unjudged passages before comparing it with the pooled ones.

A system scored on a pool it did not help build, with dozens of unjudged passages in its lists, has been graded against an incomplete key. Its figures bound nothing in either direction: judging an unjudged passage can raise a metric or lower it, because recall, AP and the ideal DCG all change when a new relevant passage enters the judged set.

## Exercise

Open the scoring explorer on "MAP and nDCG over a set of queries" with system A's runs loaded. In the runs box, add two passage ids to the end of Q02's run that the judgments box does not list under Q02, and set k to 7. Read Q02's unjudged retrieved count, AP and nDCG. Then add the same two ids to Q02's judgments with grade 2 and read the three figures again. Write down how far each moved, and explain why a figure changed although no ranking did.
