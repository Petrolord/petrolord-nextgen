# Score order and the tie rule

{{panel:ae-retrieval-explorer}}

A ranking is a list of passages, best first, cut at k. Sorting by score leaves two questions. What happens when two passages score the same, and when exactly do two scores count as the same? The engine answers both with a stated rule, so the same inputs always give the same list.

## The rule, in the engine's words

    ranking: documents with a score above 0 ranked by score descending; scores that agree to 12 significant digits tie, and ties go to the document id ascending

Only a passage with a score above 0 is ranked, so a list can be shorter than k. Higher scores come first. Two scores that agree to 12 significant digits tie, and a tie is broken by the passage id in ascending order.

## A tie in the Ekene set

EKD-058 is an exact copy of EKD-046, a spill note filed twice. On Q10, "diesel spill during bunkering", only 2 passages contain a query word, so the list holds 2 passages although k is 5. The twins score the same, and the id puts EKD-046 first:

| method | rank 1 | score | rank 2 | score | tieAtCutoff |
| --- | --- | --- | --- | --- | --- |
| bm25 | EKD-046 | 13.884966 | EKD-058 | 13.884966 | false |
| tfidf | EKD-046 | 0.464024 | EKD-058 | 0.464024 | false |

## A tie at the cutoff

Run the same query at k = 1 and the list keeps EKD-046 and drops its twin. The engine then reports tieAtCutoff true, because the first and second passages tie and the cut falls between them. The id alone decided which one was kept. The flag warns that a metric on that list rests on the id. Across the 24 queries at k 5, BM25 reports a tie at the cutoff on Q01, Q06, Q17 and Q22, and TF-IDF on Q22. Q06 by BM25 ties four passages at once: EKD-001, EKD-003, EKD-005 and EKD-006.

## What counts as a tie

Two scores tie when they agree to 12 significant digits. Three stated passages, n2 "oil water", n1 "oil water gas" and n3 "gas", scored for "oil" with b = 1e-7 so that length barely matters:

| rank | passage | length | tie key, 12 significant digits |
| --- | --- | --- | --- |
| 1 | n2 | 2 | 0.470003629246 |
| 2 | n1 | 3 | 0.470003616427 |

At six decimals the two scores print alike (0.470004). They differ by 1.28e-8, which the 12-digit key sees, so there is no tie and n2 ranks above n1 on its score. With ids alone n1 would come first. Two figures that print alike are not thereby equal.

## Why a key

A key is transitive: two scores with the same key tie, and that is the end of it. A relative tolerance is not: a can be near b and b near c while a is not near c, which breaks a sort.

## A cutoff the engine refuses

k must be a whole number from 1 to 1000. A k of 0, of 2.5 or of 1001 is refused, naming `k`:

> k must be a whole number from 1 to 1000

## Exercise

In the retrieval explorer choose "BM25, read term by term" with the hand set and the query "oil rate". Add a line `d6: Oil rate 120 bopd at Ekene-1. Oil rate fell.` and read the tied group the panel reports. Set k to 1 and read "Tie at the cutoff". Then replace the passages with the three stated lines n2, n1 and n3, type the query "oil", set b to 1e-7, and confirm n2 ranks first although both scores print alike. Last, set k to 0 and read the refusal.
