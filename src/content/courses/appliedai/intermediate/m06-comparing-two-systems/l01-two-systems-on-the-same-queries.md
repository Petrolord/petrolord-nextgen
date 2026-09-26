# Two systems on the same queries

{{panel:ae-scoring-explorer}}

Every module of this tier has put system A beside system B. The means have been close, and they have not always agreed on the winner. At k 5, grade 1 or more and linear gain, the mean nDCG is A 0.762753 and B 0.764137, a difference the course derives as 1.38e-3. This module asks whether a difference like that is a finding, and it starts with the structure that makes the question answerable: both systems answered the same queries.

## Pairs of scores

Because both systems were scored on the same 23 included queries, each query gives a pair of nDCG figures and a difference, A minus B:

| query | A nDCG | B nDCG | A minus B |
| --- | --- | --- | --- |
| Q02 | 0.261097 | 0.733750 | -0.472652 |
| Q03 | 0.803656 | 0.793325 | 0.010331 |
| Q05 | 0.565087 | 0.528456 | 0.036632 |
| Q11 | 0.660886 | 0.575716 | 0.085170 |
| Q14 | 0.000000 | 0.310738 | -0.310738 |
| Q15 | 0.515847 | 0.152733 | 0.363114 |
| Q18 | 0.894999 | 0.817494 | 0.077505 |
| Q19 | 1.000000 | 0.963940 | 0.036060 |
| Q20 | 0.924133 | 0.726229 | 0.197904 |
| Q23 | 0.944848 | 1.000000 | -0.055152 |

These are the ten queries where the two differ. A is higher on 7, B on 3, and they are equal on the other 13. The two score alike on more than half the queries.

## What the pairs show that the means hide

The mean difference is -0.001384, B a hair ahead. Yet A wins more queries than B, seven against three. B's three wins add up to 0.838542 against 0.806717 for A's seven, and that is where B's lead comes from. The two largest, Q02 and Q14, add up to 0.783390, less than A's seven, so B's third win, Q23, is needed as well. Q02 and Q14 are the two queries where BM25's word matching failed: EKD-043's "rate of penetration" outranking the answer on Q02, and the lexical trap on Q14, where the passages say "no water" and "water free". A wins several smaller contests and two larger ones, Q15 and Q20.

Neither the mean nor the count of wins is the whole story. The per-query differences are, and every comparison in this module starts from them.

## Why pairing matters

The per-query scores vary a great deal from query to query: from 0.000000 to 1.000000 for system A alone. Much of that variation belongs to the queries. Some questions are easy for any word-matching retriever and some are hard for both. When the same query is scored for both systems, that shared difficulty cancels in the difference. A comparison that uses the pairs measures the systems. A comparison that ignores them measures the systems and the queries mixed together.

The next lesson makes that concrete with a seeded bootstrap, paired and unpaired, on these same 23 differences.

## The same queries, in the same order

The engine's comparison takes two lists of per-query scores and pairs them by position. The lists must be the same length, and it says why:

> b must have 3 values, one per value of a (the same queries in the same order)

A list in a different order would pair the wrong queries, and the engine cannot see that; keep both lists in query order.

## Exercise

Open the scoring explorer on the view for two systems and the paired bootstrap. It starts with system A's and system B's per-query nDCG at 5, linear gain, in query order, Q24 left out. Read the mean A, mean B and difference tiles. Then find Q02, Q14 and Q15 in the two lists by position, and say which system each favours. Finally delete the last value from B's list and read the refusal.
