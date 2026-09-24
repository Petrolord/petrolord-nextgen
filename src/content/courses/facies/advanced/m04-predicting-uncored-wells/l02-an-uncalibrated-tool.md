# An uncalibrated gamma ray tool

{{panel:ef-classify-explorer}}

The generator planted a fault in EKENE-8, and states it: the well was logged with a gamma ray tool that reads 30 gAPI above what the rock gives, on every sample. A real field does not announce such a fault. This lesson looks for it the way a real field allows, from the logs alone, before any facies is trusted.

## Every prediction assumes the training range

kNN still finds the nearest training rows for a new row, however far away they are, and a tree still sends it down one side of each threshold. Both return a facies for every row, and nothing in the prediction itself says the row was out of range.

So the question comes first: do the new well's logs sit inside the range of the cored rows?

## A range check with the min-max scaler

Min-max scaling, fitted on the 180 cored rows, maps each log's cored minimum to 0 and its cored maximum to 1, and it clips nothing, so a new row outside the cored range maps outside [0, 1]. The cored GR runs from 10.100000 to 141.200000 gAPI. Applied to the two uncored wells:

| well | highest GR, min-max scaled on the cored rows | rows above 1 on GR |
| --- | --- | --- |
| EKENE-7 | 0.656751 | none |
| EKENE-8 | 1.241800 | 10 of 30 |

EKENE-7's highest GR maps to 0.656751, well inside the cored range. EKENE-8 maps 10 of its 30 rows above 1 on GR, the highest to 1.241800: those rows read more gamma ray than any cored row did.

## What the check can see

The check found a well whose gamma ray runs hot, and flagged the rows that left the range. But the offset is on every row of EKENE-8, flagged or not. A row whose true GR was low reads 30 gAPI higher and can still sit inside the cored range, where the check passes it. The check sees only the rows that leave the range. The next lesson measures what that costs.

## What to do about it

A gamma ray that reads high on a whole well calls for a gamma ray normalisation between wells, and that belongs to the data quality course, done before any facies is predicted. This course does not build it. What this course does is flag the well: the rows outside the range one by one, and the whole well for a gamma ray to be normalised, so no reader takes its predicted facies at the same weight as EKENE-7's.

The planted structure says which method finds this item: kNN trained on the cored wells scores EKENE-8 below the other uncored well, and min-max scaling fitted on the cored wells maps its highest GR above 1. The first half needs the withheld facies, which the next lesson reads. The second half is the check you just made, and it needs no core at all.

## Exercise

Open the view "An uncored well: predict and check the range" with EKENE-8 as the uncored well. Read the lowest and highest scaled value of each log and the rows above 1 and below 0. Confirm the GR figures above, and write down whether any other log leaves the range. Then switch the uncored well to EKENE-7 and repeat.
