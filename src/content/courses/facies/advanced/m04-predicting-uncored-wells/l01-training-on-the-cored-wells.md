# Training on the cored wells

{{panel:ef-classify-explorer}}

Most of this tier so far held out a cored well so that a prediction could be scored. This module does what the methods are for: it predicts the two Ekene wells that have no core, EKENE-7 and EKENE-8. Every step is an engine call, and the module ends with the facies written back to the wells with everything a later reader needs.

## What is trained, and on what

For prediction, both methods are trained on all 180 cored rows of EKENE-1 to EKENE-6:

| method | settings | logs |
| --- | --- | --- |
| kNN | k 5, standard scaling fitted on the 180 training rows | GR, RHOB, NPHI, PEF |
| tree | default depth, the five-channel tree of the last two modules | GR, RHOB, NPHI, PEF, CALI |

The held-out scores from earlier in the tier are the evidence for how far each method carries to a well it has not seen. On EKENE-6, held out and trained on the other five cored wells, kNN at k 5 scored 0.833333, and the tree at the default depth, grown the same way without EKENE-6, scored 0.766667. Those are scores on one cored well, and they are the only accuracy these predictions will ever honestly carry.

## The predictions

Rows of each well predicted as each facies:

| well | method | limestone | sandstone | shale | shaly-sand |
| --- | --- | --- | --- | --- | --- |
| EKENE-7 | kNN, k 5 | 10 | 19 | 1 | 0 |
| EKENE-7 | tree | 10 | 17 | 1 | 2 |
| EKENE-8 | kNN, k 5 | 13 | 2 | 12 | 3 |
| EKENE-8 | tree | 13 | 3 | 12 | 2 |

Each row now carries a predicted facies. These are names learned from core, which is what separates them from the cluster numbers the Associate tier gave EKENE-7 when it placed its rows at the nearest k-means centre. A cluster number is a name with no rock behind it until it is matched against core; a predicted facies comes from core directly, through the training rows, and it is still a prediction.

## The uncored rows cannot train

An uncored well has no facies to learn from. Its FACIES entries are null, and passing such a row among the training rows is refused by name. With a null facies at position 1 of y:

> y[1] must be a string or a finite number

The engine does not guess a facies for a training row, and it does not drop the row for you. Keeping uncored rows out of the training set is the caller's step, and it is the first thing to check when this message appears.

## Two wells, two different stories

EKENE-7 is predicted mostly sandstone and limestone, with one shale row. EKENE-8 is predicted with twelve shale rows out of 30. Nothing in these counts says whether either is right. The next two lessons read EKENE-8's logs against the training range, which any real field allows, and then check both wells against the facies the generator kept, which only a synthetic field allows.

## Exercise

Open the view "An uncored well: predict and check the range". The default training rows are the cored wells and the uncored well is EKENE-8. Confirm the counts of each facies for kNN at k 5 and for the tree. Then replace the uncored well with EKENE-7 and confirm its counts. Finally set k to 1, read the counts for EKENE-7 again, and write down how many rows changed facies.
