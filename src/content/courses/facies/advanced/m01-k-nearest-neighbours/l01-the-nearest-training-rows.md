# The nearest training rows

{{panel:ef-classify-explorer}}

The earlier tiers grouped the logs without core and then scored the groups against core. This tier asks what facies a well without core would carry, and how far that prediction can be trusted. The first method is k nearest neighbours. `knnClassify` gives a new row the facies most common among its k nearest training rows. Every prediction is a search through the training rows by the Euclidean distance on the scaled logs.

## A cored well held out

A prediction can be scored only where the rock is known, so one cored well is held out: EKENE-6, 30 rows. The model trains on the 150 rows of EKENE-1, EKENE-2, EKENE-3, EKENE-4 and EKENE-5. Choosing which wells to hold out is the machine learning course's subject; here the held-out well is stated.

## The first row of EKENE-6

The first row of EKENE-6 sits at 6507 ft and its core facies is shaly-sand. With k 5, its five nearest training rows, nearest first:

| neighbour | training row | well | core facies | distance, standard units |
| --- | --- | --- | --- | --- |
| 1 | 58 | EKENE-2 | shaly-sand | 0.309960 |
| 2 | 45 | EKENE-2 | shaly-sand | 0.436690 |
| 3 | 132 | EKENE-5 | shaly-sand | 0.556726 |
| 4 | 8 | EKENE-1 | shaly-sand | 0.592572 |
| 5 | 133 | EKENE-5 | shaly-sand | 0.600367 |

Training rows are counted from 0 over the 150 training rows. Every distance uses the four logs GR, RHOB, NPHI and PEF, each standardised with the centre and the population standard deviation (divisor n) fitted on those 150 rows; the next lesson is about that fit. The five neighbours come from three wells and all are shaly-sand, so the vote is shaly-sand 5 and the row is predicted shaly-sand, its core facies.

The engine states how it takes the neighbours, in its own words:

> the k nearest training rows, taken one at a time: the lowest row among those whose squared distance is within 1e-12 (relative) of the smallest remaining

Read it as one step repeated k times: find the smallest squared distance among the rows not yet taken, and take the lowest-numbered row inside a narrow band of it. The band matters only when two rows are equally far, which a later lesson builds on purpose.

## Every training row against every new row

For each new row kNN measures the distance to every training row, so its work grows with the training rows times the new rows. The engine caps that product at 100000000 pairs, where 10000 new rows against 10000 training rows are computed, and refuses above it. Passed the cored rows repeated to 10001 training rows, with 10000 new rows, it says:

> Xnew has 10000 rows against 10001 training rows, 100010000 distance pairs, above the 100000000 kNN computes: classify fewer rows at a time or thin the training rows

The refusal names its remedy: classify a long uncored section a batch at a time, or thin the training rows.

A new row must also carry the logs the training rows carry, in the same number:

> Xnew must have 4 columns, like X

## Exercise

Open the panel on the view "k nearest neighbours on a held-out well". The default table holds the cored rows, with EKENE-6 held out, k 5 and standard scaling. Confirm the five neighbours of held-out row 0 and their distances. Then remove PEF from the logs and write down which training rows stay among the five and whether the prediction changes.
