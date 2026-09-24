# The capstone brief

{{panel:ef-judge-explorer}}

The capstone for this tier grades six figures, and every one answers the Professional question: how well do these groups stand up, judged by their own geometry and against core?

| graded quantity | the module it rests on |
| --- | --- |
| the drop fraction of an elbow at a stated k | choosing k with the elbow |
| the mean silhouette of a Ward cut | the silhouette, and agglomerative clustering |
| the height of the next merge above a Ward cut | agglomerative clustering |
| the adjusted Rand index of a complete-linkage cut against core | the adjusted Rand index |
| the macro F1 of a one-to-one matching | matching clusters to core facies |
| the accuracy of a majority matching at a stated k | matching clusters to core facies |

## What it grades and why

It grades judging quantities only. It grades no scaler, component or k-means inertia on its own, because those are the Associate question and the Associate capstone asks them. It grades no neighbour rule and no tree, because those are the Expert question.

## The data are new

The capstone runs its own field, its own wells and its own stated settings. None of its values appears in any lesson, and none of the figures in this tier's lessons is a capstone answer. The Ekene cored wells and the small stated cases are worked examples. Use them to check your driving of the explorer.

## How to work it

Take each field in turn, decide which view it needs, and set that view exactly as the brief states before reading anything: the logs, the scaling, the k, and for k-means the seed and the starts.

For the drop fraction, read the fraction column at the k the brief names. It divides the drop by the inertia of the k before, so check the row above it too.

For the Ward silhouette, cut the Ward tree at the stated k and score those labels in the silhouette's default space, the standardised logs.

For the height, read the next merge above the cut, the first merge undone, and leave the last merge made alone.

For the index, cut the complete-linkage tree at the stated k and compare it with the FACIES column. No mapping is involved.

For the macro F1, use one-to-one matching on the clustering the brief states and read the macro figure of the report, never a single facies's F1.

For the majority accuracy, set majority mode and the stated k. The accuracy is over every cored row of the table, so check that the table holds the rows the brief names.

## Before you submit

Keep every figure at full precision until the end, and quote the numeric field the engine returns, never a figure lifted from a message. If a view refuses, read the refusal: it names the field it could not work with, and the fix is in the input.

## Exercise

Before you open the capstone, rerun the worked examples on the Ekene cored rows. Confirm the drop fraction of 0.282430 at k 4, seed 3; the Ward silhouette of 0.531627 at k 4; the next merge above the Ward cut at k 4, 6.612020; the complete-linkage index of 0.897678; the one-to-one macro F1 of 0.952887 for k-means at k 4; and the majority accuracy of 0.983333 at k 5. For each of the six graded fields, write down which view and which setting you will check first.
