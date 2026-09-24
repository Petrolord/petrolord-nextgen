# Checking against the withheld core

{{panel:ef-classify-explorer}}

This lesson does something no real field allows. A real uncored well has no facies to check a prediction against. The Ekene field is synthetic, and when the generator drew the uncored wells it kept the facies it drew for them, apart from the rows, as `withheld`. The course reads that record once, here, to see what the last two lessons caught. Every accuracy below is on the withheld facies of an uncored well, and only this field has one.

## The scores

| well | method | rows predicted as the withheld facies | accuracy |
| --- | --- | --- | --- |
| EKENE-7 | kNN, k 5 | 30 | 1.000000 |
| EKENE-7 | tree | 28 | 0.933333 |
| EKENE-8 | kNN, k 5 | 27 | 0.900000 |
| EKENE-8 | tree | 28 | 0.933333 |

kNN predicts every row of EKENE-7 as its withheld facies and scores lower on EKENE-8, which is what the planted structure said it would find. The tree gets 28 rows right on each well.

## What kNN missed on EKENE-8

kNN misses 3 rows of EKENE-8, and all 3 are sandstone predicted as shaly-sand. The generator states the facies means: sandstone GR has a mean of 45 gAPI and shaly-sand 66 gAPI. Add the tool's 30 gAPI to a sandstone and its mean GR sits above the shaly-sand mean. On the gamma ray, a sandstone read by this tool looks like a shaly-sand, and its nearest cored rows can be shaly-sand rows.

With the stated 30 gAPI taken off every EKENE-8 GR value, kNN scores 1.000000 on the same well. That correction is possible here only because the offset was planted and stated. In a real field the offset is unknown, and the repair is a gamma ray normalisation between wells, which the data quality course teaches.

## A range check sees only the rows that leave the range

The range check of the last lesson flagged 10 rows of EKENE-8 above the cored GR maximum. kNN missed 3 rows, and all 3 of the misses sit inside the GR range. So every flagged row was predicted as its withheld facies, and the misses are sandstones whose raised GR still sits inside the cored range.

Every row of EKENE-8 carries the same offset, flagged or not. That is why the flag belongs on the whole well as well as on the rows that left the range: a flag on 10 rows would have let a reader trust the other 20, and the 3 misses are among those 20.

## What this lesson licenses you to say

Only in this synthetic field can you say that kNN predicted EKENE-7 perfectly. In a real field the honest statement stops at the evidence you have: a held-out cored well scored 0.833333, a range check flagged 10 rows of one well, and the well was flagged for its gamma ray. The withheld facies shows that the whole-well flag was the right call. A real field gives you the flag without the proof.

## Exercise

Open the view "An uncored well: predict and check the range" with EKENE-8 as the uncored well, and read the kNN counts of each facies. Then edit the uncored well's table: take 30 off every GR value, and read the counts and the range check again. Write down how many rows changed facies, which facies they moved to, and how many rows still sit above 1 on GR.
