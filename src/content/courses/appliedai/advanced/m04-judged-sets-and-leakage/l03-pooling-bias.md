# Pooling bias

{{panel:ae-trust-explorer}}

A pool is judged from the lists of the systems that built it. A new system that finds good passages those systems never ranked is marked down for finding them, because every passage it shows that the pool never saw counts as grade 0. That is POOLING BIAS, and it favours the systems the pool was built from.

## A run the pool did not come from

The course ran BM25 with b 0.4 and the stop list on, at k 5, against the Ekene judgments. It is a close cousin of system A's retriever, with two settings changed. Scored at grade 1 or more with linear gain:

| run | unjudged passages retrieved, all queries | queries with an unjudged passage | mean precision | MAP | mean nDCG |
| --- | --- | --- | --- | --- | --- |
| system A's retriever at k 5 (in the pool) | 0 | 0 | 0.443478 | 0.600278 | 0.762753 |
| BM25 b 0.4, stop list on, k 5 | 16 | 11 | 0.443478 | 0.656854 | 0.799171 |

The new run brings 16 unjudged passages into its top 5 lists, on 11 of the 24 queries. Each of the 16 is scored as grade 0. Even so, its MAP is 0.656854 against system A's 0.600278 and its mean nDCG 0.799171 against 0.762753, and its mean precision at 5 is the same, 0.443478.

## What the table can and cannot say

It can say that, on the passages the pool judged, the new run places the relevant ones higher on average than system A does. It cannot say how the new run would score if its 16 unjudged passages were judged. Some of them may answer their queries. If they do, the new run's precision at 5 is understated by exactly those passages, and the comparison with system A is tilted toward A by the way the pool was built.

The bias runs one way. A pooled system never meets an unjudged passage at its pooled cutoff, so it is never penalised for one. The tilt always runs toward the systems that built the pool.

## What to do about it

The course's rule, applied to any new system: report unjudgedRetrieved beside every score, and judge the new system's unjudged passages before comparing it with the pooled ones. On the Ekene set that means 16 new judgments, a small cost against the question it settles. Once judged, those passages join the key for every system, so the pooled systems are rescored on the enlarged set too: recall, average precision and the ideal DCG all read every relevant judged passage, and a newly relevant passage raises the bar for every system that missed it.

## The pool as a rater

A pooled key can be read as a rater whose verdict on every unjudged passage is 0. Compare it with an assessor who has judged every passage, and every disagreement between the two lands in one place: the pooled key says 0 and the assessor says 1 or more. Disagreement of that one-sided kind is what bias looks like in a confusion table.

## Exercise

Open the trust explorer on "Cohen's kappa". Make up ratings for ten passages from a new system's lists. In rater a, the pooled key, give the six judged passages their grades from 0 to 3 and the four unjudged passages 0. In rater b, the full judging, keep the six judged grades and give two of the four unjudged passages grade 2. Read the confusion table and the kappa. Note which row holds every disagreement, then explain in two sentences why a one-sided confusion table is the signature of pooling bias.
