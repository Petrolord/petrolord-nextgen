# Two annotators, one judged set

{{panel:ae-trust-explorer}}

Every retrieval metric in this course rests on a judged set: a person read a passage against a query and gave it a grade. Every metric is computed against those grades, so a doubt about the grades is a doubt about every figure built on them. The Expert tier asks how far the judgments themselves can be trusted.

## The Ekene judged set, graded twice

The Ekene document set carries 183 judged (query, passage) pairs across its 24 queries, each on the four-grade scale: 3 answers the query, 2 relevant, 1 related, 0 judged not relevant. A second annotator graded every one of those pairs again. The fixture states how, because it is synthetic: the primary grade was moved one grade with probability 0.25 and two grades with probability 0.05, drawn with random.Random(20260925). No person or language model graded anything here.

Lay the two sets of grades side by side, rows for rater a (the primary grades) and columns for rater b (the second annotator), with the pairs in query order and the passages by id within a query:

| a \ b | 0 | 1 | 2 | 3 | row total |
| --- | --- | --- | --- | --- | --- |
| 0 | 72 | 24 | 5 | 0 | 101 |
| 1 | 3 | 37 | 2 | 2 | 44 |
| 2 | 2 | 0 | 11 | 0 | 13 |
| 3 | 0 | 2 | 11 | 12 | 25 |
| column total | 77 | 63 | 29 | 14 | 183 |

## Reading the table

The diagonal holds the pairs the two annotators graded alike: 72, 37, 11 and 12, which is 132 of the 183. Everything off the diagonal is a disagreement, 51 pairs in all. Two cells stand out. The 24 pairs in row 0, column 1 are passages the primary annotator judged not relevant and the second called related. The 11 pairs in row 3, column 2 are passages the primary annotator said answer the query and the second called relevant. Both are one-grade moves, and at the relevance threshold of grade 1 the first of them decides whether a passage counts at all.

A metric that counts grade 1 or more as relevant inherits every doubt about the line between grade 0 and grade 1. The threshold a metric uses is also a threshold the annotators have to agree on.

## What the engine asks of the ratings

The `cohenKappa` function takes two lists, a and b, one rating per item, in the same order. It refuses an empty list with the field `a` named:

> a must be a non-empty array of ratings

and a second list of the wrong length with the field `b` named, here three ratings against two:

> b must be an array of 3 ratings, one per item of a

The lessons that follow turn the confusion table into an observed agreement, an expected agreement and Cohen's kappa.

## Exercise

Open the trust explorer on the view "Cohen's kappa". It loads the Ekene annotators: rater a is the primary grades and rater b the second annotator's, all 183 pairs. Confirm that the confusion table matches the one above and count the diagonal yourself. Then delete the last rating from rater b's box and read the refusal the engine returns, with the field it names. Put the rating back and check that the table returns.
