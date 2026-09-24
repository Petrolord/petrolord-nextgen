# What is not built

{{panel:ef-classify-explorer}}

Knowing what an engine does not do is as useful as knowing what it does, because the gap is where a reader's assumptions creep in. This engine names its methods and its limits, and this lesson lists the limits, each with where the missing piece lives or what it would take.

## Methods this engine does not have

Clustering is k-means and agglomerative clustering; classification is k nearest neighbours and one CART tree. The engine's exported names, in full, are: DEFAULTS, adjustedRandIndex, agglomerative, assignClusters, cartFit, cartPredict, cutTree, elbow, kmeans, knnClassify, matchClusters, pca, pcaTransform, silhouette. Nothing else is built:

| not built | what that means for a facies study |
| --- | --- |
| a self-organising map | it needs its own seeded engine before a course can teach it |
| a Gaussian mixture | no cluster comes with a membership probability |
| density clustering (DBSCAN) or spectral clustering | every row is placed in a cluster; none is set aside as noise |
| a random forest or boosting | one tree is grown, and its importances describe that one tree |
| a neural network | the methods are the four named above |

These are methods in wide use, and a study may well want one. What this course can say is that none of them runs here, so a figure from any of them was not produced by this engine and cannot be checked against it. The machine learning in this course is named by method every time: k-means, agglomerative clustering, k nearest neighbours, a CART tree.

## Numbers this engine does not return

**No probability for a predicted facies.** kNN returns its votes as counts, and a tree returns the counts on each leaf. Neither is turned into a probability, and a report that presents 4 of 5 votes as a confidence figure is adding a claim the engine did not make.

**No cross-validation.** The engine does not split wells or score every well in turn. This course states its held-out well; splitting by whole wells and cross-validating are the machine learning course's.

**No choice of k, logs or linkage.** The elbow and the silhouette print what a choice rests on. No elbow is picked automatically, and the best silhouette, at k 3 on the Ekene cored rows, is printed beside a core that describes 4 facies.

## Repairs this engine does not make

**No filling of a missing log.** A null or non-finite value is refused by name, at the first row and column it meets, counting from 0:

> X[40][1] must be a finite number: fill or drop missing values first

Filling or dropping it is the caller's decision, and conditioning logs belongs to the data quality course.

**No gamma ray normalisation between wells.** EKENE-8's gamma ray reads 30 gAPI high, and the engine predicts it as given. The range check flags the rows that leave the training range; the normalisation that would fix the whole well is the data quality course's, done before any facies is predicted.

## Why the list matters

A missing piece is invisible in a result. A kNN prediction without a probability looks complete, and a clustering with every row assigned looks as if no row was doubtful. The list is what lets you write, in a report, what was not done, before a reader assumes it was.

## Exercise

Open the view "k nearest neighbours on a held-out well" with EKENE-6 held out and k 5. Read the votes for held-out row 0. Then replace the table with your own copy in which one GR value is a dash, and read the refusal. For each, write one sentence a report would need so that a reader does not assume the engine did more than it did.
