# The capstone brief

{{panel:ef-classify-explorer}}

The Expert capstone grades 6 fields, and every one answers the Expert question: how does the engine predict a facies in a well it has not seen, and which of its own rules decide the answer? Each field is a figure the engine returns, graded against the engine's own result on a field of wells you have not seen in this course.

| graded field | where it comes from |
| --- | --- |
| a held-out kNN accuracy | kNN at a stated k, trained on the cored wells the brief names, scored on the held-out cored well |
| a nearest distance | the distance, in standard units, from a stated row of the held-out well to its nearest training row |
| the Gini impurity of a node | the node the root tie sends right, with the logs in the column order the brief states |
| an importance | one log's importance in a stated tree |
| a held-out tree accuracy | a tree of a stated depth, grown without the held-out well and scored on it |
| a range check | the highest GR of the uncored well, min-max scaled on the cored rows |

## What you are given

A field of wells in the same layout as the Ekene field: a well column, the logs GR, RHOB, NPHI, PEF and CALI, and a FACIES column that is filled on the cored wells and empty on one uncored well. The uncored well is checked against the cored range before its facies is trusted, as EKENE-8 was. The brief states every setting a field depends on: the k, the held-out well, the row, the column order, the logs and the depth. None of the capstone's values appear anywhere in this course, and every figure in these lessons belongs to the Ekene wells.

## How to work it

Work each field in the panel view that teaches it. For kNN, scale on the training rows only, with the held-out well out of the training set. For the nearest distance, read the first neighbour of the row the brief names, counting rows from 0 within the held-out well. For the tied root, pass the logs in exactly the stated order, and read the node the root sends right. For the importance and the held-out tree, set the stated depth and channels. For the range check, fit min-max on the cored rows and apply it, unchanged, to the uncored well.

## What catches people

Scaling the held-out well on its own statistics. Counting the neighbour row from the start of the table instead of within the well. Passing the logs in a different order, which moves the tied root and every node below it. Reading the training accuracy of the tree where the brief asks for the held-out one. Fitting the range check on the uncored well itself, which maps its own maximum to 1.

## A rehearsal on the Ekene wells

Every step can be rehearsed in the panel. kNN at k 5 with EKENE-6 held out scores 0.833333. Its first row's nearest training row sits 0.309960 away. With the logs in the order GR, RHOB, NPHI, PEF, the node the root sends right has Gini 0.650416. NPHI's importance in the five-channel tree is 0.444883. A tree of maxDepth 4 grown without EKENE-6 scores 0.900000 on it. EKENE-8's highest GR maps to 1.241800. If your panel work reproduces those, your method is the engine's.

## Exercise

Before you open the capstone, run all six steps on the Ekene wells in the panel and write each result beside the field it rehearses. Then mark which of the six would change if the column order of the logs changed.
