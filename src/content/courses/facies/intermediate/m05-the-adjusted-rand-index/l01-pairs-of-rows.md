# Agreement counted in pairs of rows

{{panel:ef-judge-explorer}}

Matching clusters to facies needs a mapping, and the mapping is a choice: one-to-one or majority, with its own tie rules. The adjusted Rand index, or ARI (Hubert and Arabie, 1985), scores the agreement of two labellings of the same rows without mapping one onto the other at all. It does that by counting pairs of rows.

## Why pairs

A labelling's names are arbitrary, so comparing name with name needs a mapping. What does not depend on the names is whether two rows share a group. For any pair of rows, each labelling either puts them together or puts them apart, whatever it calls the groups. A pair AGREES when both labellings put it together, or both put it apart. A pair DISAGREES when one labelling joins it and the other splits it.

## Six rows by hand

Two stated labellings of six rows:

a = 0, 0, 0, 1, 1, 1

b = p, p, q, q, r, r

The engine's contingency table, rows for a and columns for b:

| a \ b | p | q | r |
| --- | --- | --- | --- |
| 0 | 2 | 1 | 0 |
| 1 | 0 | 1 | 2 |

Every count of pairs comes from this table. A cell holding n rows holds C(n, 2) pairs that both labellings put together.

* Pairs together in both: each cell of 2 gives one pair, so the sum of C(n_ij, 2) is 2.
* Pairs together in a: each group of a holds 3 rows, and each gives C(3, 2) = 3 pairs, so 6 in all.
* Pairs together in b: each group of b holds 2 rows and gives one pair, so 3 in all.
* All pairs of six rows: C(6, 2) = 15.

The first count is the heart of the index, and on its own it cannot be read: it depends on how many pairs each labelling joins in the first place. The next lesson adjusts for that.

## What the index reads

The ARI is 1 when the two labellings are the same grouping, near 0 for labellings no more alike than chance, and it can fall below 0 when they disagree more than chance would. It is symmetric: swapping a and b gives the same figure.

Against core, one side is special: the core facies. The ARI still treats both sides alike and needs no mapping, which makes it a useful partner to one-to-one matching. The matching tells you which cluster is which facies and scores the rows; the ARI tells you how alike the two groupings are, whatever the names.

## Refusals

The index needs at least one pair, so at least two rows, and one label per row on both sides:

> a must be an array of at least 2 labels

> b must be an array of 180 labels, one per row

## Exercise

In the judge explorer, open the adjusted Rand index view and type the six-row labellings a and b above. Build the contingency table by hand first, then check it against the engine's. Count the pairs together in both, in a and in b. Then swap the two labellings and confirm the index does not change.
