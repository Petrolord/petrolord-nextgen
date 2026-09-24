# The judging workflow in order

{{panel:ef-judge-explorer}}

This tier has built its tools one at a time. This lesson runs them in order on the Ekene cored wells, as one piece of work, with every step an engine call and every figure the engine's.

## The five steps

On the 180 cored rows of EKENE-1 to EKENE-6, the logs GR, RHOB, NPHI and PEF, standard scaling with the population standard deviation fitted on those rows:

| step | call | what it returns here |
| --- | --- | --- |
| 1 | `elbow` k 1 to 8, seed 3, with the silhouette | drop fractions 0.668972, 0.282430, 0.112303 at k 3, 4, 5; best silhouette at k 3 |
| 2 | `kmeans` and `agglomerative` (Ward, complete, average) at k 4 | four labellings of the 180 rows |
| 3 | `silhouette` of each | k-means 0.545063, average 0.514177 |
| 4 | `matchClusters` one-to-one | k-means: 171 rows matched, accuracy 0.950000 |
| 5 | `adjustedRandIndex` against the core | k-means 0.872413, Ward 0.873388, complete 0.897678, average 0.676404 |

The silhouettes of the Ward and complete cuts at k 4 are 0.531627 and 0.530601.

## Step 1: evidence on k, with no pick

The elbow prints the inertia, the drops and the drop fractions at every k, and the mean silhouette beside them. The largest drop fraction and the highest mean silhouette are both at k 3. The core describes 4 facies. The workflow takes k 4 because the purpose is to compare with the four core facies, and it writes the elbow and silhouette figures beside that choice so a reader sees the evidence that pointed elsewhere.

## Step 2: several methods at the chosen k

k-means runs with its seed and starts stated: seed 3, 10 starts. The three agglomerative cuts need no seed. Four labellings of the same rows at the same k can be compared fairly with each other.

## Step 3: the geometry of each

The silhouette scores each labelling's own compactness and separation, in the same scaled space. It flags average linkage's weakness only mildly, at 0.514177, and the cluster sizes, 96, 54, 29 and 1, show it plainly. So the sizes are read beside every mean.

## Step 4: names from core

One-to-one matching names each k-means cluster with a facies, choosing the mapping that matches the most rows. 171 of the 180 cored rows land on their own facies. The classification report then gives the precision, recall and F1 of each facies, read with the machine learning course's definitions.

## Step 5: agreement without a mapping

The adjusted Rand index scores each labelling against the core by pairs of rows. Complete linkage agrees best here, 0.897678; average linkage worst, 0.676404. The ranking belongs to this field with these logs and this scaling.

## The order matters

Each step uses what the one before produced, and the order keeps the core out of the clustering. The clusters are made from logs alone in steps 1 to 3; the core enters only at step 4. A workflow that chose k or the method by looking at the core scores first would be using the answer to set the question, and the scores at the end would flatter it.

## Exercise

Run the five steps yourself in the judge explorer on the Ekene cored rows. At each step, write down the figure from the table above that the step produces, and check it against the view. Then change one choice, the linkage, and rerun steps 3 to 5 only. Note which figures moved. The silhouette and matching views run k-means at seed 3; the elbow view is where a seed can be changed.
