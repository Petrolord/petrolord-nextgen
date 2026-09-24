# Feature importances

{{panel:ef-classify-explorer}}

A tree reports how much each log contributed to it. The figure is easy to read as a statement about the rock, and this lesson shows why it is a statement about one tree. The basis defines it, in the engine's words:

> sum over the feature's splits of n_t gini_t - n_L gini_L - n_R gini_R, normalised to sum 1 (scikit-learn feature_importances_); all 0 for a single leaf

For every split, the engine takes the rows of the node times its Gini, less the same for each child: the impurity that split removed, counted in rows. It adds those up for each log, then divides by the total so the importances sum to 1.

## The five-channel tree

The tree grown on all 180 cored rows with GR, RHOB, NPHI, PEF and CALI at the default depth:

| log | importance |
| --- | --- |
| GR | 0.282009 |
| RHOB | 0.244767 |
| NPHI | 0.444883 |
| PEF | 0.028341 |
| CALI | 0.000000 |

NPHI leads because it takes the root, the split that removes the most impurity, and splits again lower down. GR takes the shale split at node 2 and a later one; RHOB takes two splits among sandstone and shaly-sand. CALI is never split on, and its importance is 0.000000. That matches what the generator planted: the caliper was drawn independently of the facies and of every other log.

## PEF, the log that tied for the root

PEF carries 0.028341, the smallest share of any log the tree split on. Yet PEF separates the limestone rows exactly, just as NPHI does. It lost the root to NPHI on the tie-break by column index, and once the limestone rows had gone left, the split it would have made was already made. Its only split is deep in the tree, at node 5, among 47 sandstone and shaly-sand rows.

The depth-1 trees of the root tie make the point sharper. With the logs in the order GR, RHOB, NPHI, PEF, NPHI takes the root and all the importance, 1.000000. With PEF before NPHI, PEF takes the root and all the importance, 1.000000. The two logs split the rows the same way, and each in turn is reported as the whole story.

## What an importance says

An importance describes this tree: which logs it happened to use, given the rows, the column order, the tie-breaks and the depth. It says nothing about a log the tree never needed because another log did the same job first. A single leaf reports every importance as 0.

Read an importance with the tree it came from, and with the column order written beside it. To ask whether a log matters to the prediction, grow the tree without it and score it on a held-out well. That is a different question, and the importance does not answer it.

## Exercise

Open the view "A classification tree and its printed form" with the five channels and the default depth, and confirm the five importances. Then reorder the channels so PEF comes before NPHI, grow the tree again, and write down the new importances of NPHI and PEF. Finally remove NPHI altogether and read the accuracy on EKENE-6, held out, beside the accuracy with NPHI in.
