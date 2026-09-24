# Scores, and a new well projected

{{panel:ef-cluster-explorer}}

A score places one row along one component. Take the row's logs, standardise them with the centre and sample standard deviation (n - 1) of the correlation form, multiply by the component's weights and add. Each row gets one score per component, and the scores on PC1 and PC2 are the coordinates of the row on the plane that carries most of the spread.

| row of the cored rows | core facies | PC1 score | PC2 score | PC3 score | PC4 score |
| --- | --- | --- | --- | --- | --- |
| 0 | sandstone | 1.334633 | -1.203214 | 0.049295 | 0.066007 |
| 1 | sandstone | 0.761765 | -0.812918 | -0.320589 | -0.286006 |
| 2 | sandstone | 1.150625 | -0.681537 | 0.007768 | 0.170947 |

## The engine's words

The basis of the scores reads:

> centred (and for correlation, standardised) rows times the unit components

The table gives the first three cored rows, all sandstone from EKENE-1. Row 0 scores 1.334633 on PC1 and -1.203214 on PC2. Its PC3 and PC4 scores are small, 0.049295 and 0.066007, as the small eigenvalues of those components lead you to expect.

## Scores and eigenvalues

The sample variance of each column of scores equals that component's eigenvalue: the PC1 scores of the 180 cored rows vary with variance 2.729404. That is the meaning of the eigenvalue. It is how far the rows spread along the direction, measured in the scores. A component with a small eigenvalue gives most rows a score near zero.

## A new well, never refitted

`pcaTransform` scores new rows with the model already fitted: the same centre, the same scale and the same components, with nothing recomputed from the new rows. Its basis reads:

> rows centred and standardised with the fitted parameters, times the 2 unit components

This is the two-component model fitted on the 180 cored rows. The first three rows of EKENE-7, the uncored well:

| row of EKENE-7 | depth (ft) | PC1 score | PC2 score |
| --- | --- | --- | --- |
| 0 | 6565 | -2.713199 | 0.073309 |
| 1 | 6566 | -2.491550 | -0.155559 |
| 2 | 6567 | -2.226124 | 0.393772 |

EKENE-7's top three rows score low on PC1, from -2.713199 to -2.226124. By the loadings of the last lesson, a low PC1 means low gamma ray and neutron with high density and photoelectric factor. That describes the logs of those rows; which rock it is stays unsaid until something is checked against core.

Refitting on the new well would give it its own centre and components, and its scores could no longer be set beside the cored rows' on the same axes. Projecting keeps one frame for every well.

## When the model and the rows disagree

`pcaTransform` checks what it is given. Pass new rows with two logs to a PCA fitted on four:

> X must have 4 columns, as the PCA was fitted on

Pass a k-means result where a PCA was expected:

> model must be the result of pca

## Exercise

Open the cluster explorer on the view "Principal components". Keep the cored rows and the four logs, set "Components kept" to 2, and leave the EKENE-7 rows in the new-rows box. Check the first three EKENE-7 scores against the table above. Then replace the new rows with the first three cored rows, all sandstone, and write down whether their scores match the scores in the first table. Finally clear "Components kept" so that all four are kept, and write down the PC3 and PC4 scores of the same three rows.
