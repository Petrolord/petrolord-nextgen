# Choosing k for neighbours

{{panel:ef-classify-explorer}}

k is the one setting kNN asks for, and the engine does not choose it. A small k follows the nearest rows closely; a large k averages over more rows and reaches further from the new row. The held-out well gives one way to see what each k does, and this lesson reads it and marks where that reading stops.

## The same well at several k

Trained on the 150 rows of EKENE-1 to EKENE-5, standard scaling fitted on those rows, scored on the 30 rows of EKENE-6:

| k | accuracy on EKENE-6 | tied votes |
| --- | --- | --- |
| 1 | 0.833333 | 0 |
| 3 | 0.866667 | 0 |
| 5 | 0.833333 | 0 |
| 7 | 0.800000 | 0 |
| 9 | 0.800000 | 0 |
| 15 | 0.766667 | 0 |

The highest accuracy on this one well is 0.866667, at k 3. k 1 copies the facies of the single nearest training row. Past k 3 the accuracy on EKENE-6 does not rise again, and reads 0.766667 at k 15, where each vote reaches furthest from the new row. No k in the table met a tied vote, so the tie rule changed nothing here.

## One well is one draw

It is tempting to write "k 3 is best" and move on. What the table shows is narrower: on EKENE-6, held out from the other five cored wells, k 3 scored 0.866667. Another held-out well could rank the k differently, and 30 rows is a small sample; a single row moved from wrong to right shifts the accuracy by a thirtieth. A k chosen on one held-out well is quoted with the well it was chosen on.

Scoring every cored well in turn, and averaging the scores, is cross-validation by whole wells, and it belongs to the machine learning course. This course states its held-out well and leaves that procedure there. What it adds is the discipline of the sentence: the k, the scaling, the training wells, the held-out well and its rows, every time an accuracy is quoted.

## The largest k the engine accepts

k counts training rows, so it cannot exceed them. Trained on all 180 cored rows and asked for more neighbours than that, the engine refuses:

> k must be a whole number from 1 to 180 (the training rows)

The boundary is drawn for this rule alone: k 1 and k equal to the number of training rows are accepted, and one more is refused. At k equal to the training rows, every new row votes with every training row, so the votes are the facies counts of the training rows and are the same for every new row; only a tie in those counts would bring the new row's own logs back in. The engine accepts that k, and the held-out score says whether it is useful.

## Exercise

Open the view "k nearest neighbours on a held-out well" with EKENE-6 held out and standard scaling. Step k through 1, 3, 5, 7, 9 and 15 and confirm the table. Then hold out EKENE-2 instead, repeat the same k, and write down which k scores highest on that well. Finally set k to 150 with EKENE-6 held out, read the votes for held-out row 0 and the accuracy on EKENE-6, and say in one sentence why those votes no longer depend on that row's logs.
