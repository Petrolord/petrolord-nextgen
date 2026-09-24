# Conventions that are choices

{{panel:ef-classify-explorer}}

Every number this engine returns rests on conventions, and every one of them is a choice. Each has a real alternative in common use, and a figure from this engine will differ from another tool's wherever the two chose differently. The engine states each choice in its basis. This lesson collects them, so that when a number is compared with one from elsewhere, the choice behind it can be named.

| convention | this engine | a common alternative | why the engine chose it |
| --- | --- | --- | --- |
| clustering scaler | standard, population SD (n), fitted on the rows clustered | no scaling, or min-max | logs in different units would otherwise be ruled by GR |
| PCA matrix | correlation, sample SD (n - 1) | covariance (scikit-learn PCA) | score variances equal the eigenvalues, and every log counts |
| PCA sign | largest absolute weight positive, with a band | whatever the solver returns | the same data give the same signs |
| k-means seeding | k-means++, one candidate per step, mulberry32(seed) | greedy k-means++ (scikit-learn tries several candidates) | one canonical generator across the platform; a learner can follow each draw |
| k-means starts | 10 by default | one (scikit-learn n_init auto) | one start can stop in a poor arrangement |
| k-means passes | counted as assignment passes, the confirming pass included | centre updates | matches scikit-learn n_iter_ when the stop is by labels |
| silhouette distance | Euclidean on the scaled logs | raw logs | scores the space the clusters were made in |
| agglomerative ids and heights | scipy linkage matrix; Ward height sqrt(2 x rise in sum of squares) | scikit-learn children_ with no heights | the whole tree can be re-cut and drawn |
| kNN tied vote | the tied facies whose nearest member comes first | the facies that sorts first (scikit-learn) | it falls back toward the single nearest row, which a learner can check by hand |
| CART split tie | lower feature index, then lower threshold, compared exactly | a random feature order (scikit-learn random_state) | the same data give the same tree |
| CART zero-decrease split | refused: the node stays a leaf | allowed (scikit-learn) | a split that separates nothing is not a split |
| one-to-one matching | maximum rows matched, first mapping on ties | greedy, cluster by cluster | the optimum is unique in count and stated in order |
| ARI of two labellings that each put every row in one cluster | 1 | no value (the formula divides zero by zero) | matches scikit-learn |

## Two standard deviations in one engine

The engine uses two divisors, and says which every time. Clustering scales each log by its population standard deviation, divisor n, the machine learning engine's scaler. The correlation PCA divides by the sample standard deviation, divisor n - 1, so that each score's variance equals its eigenvalue and the eigenvalues sum to the number of logs: 4.000000 on the Ekene cored rows. On those 180 rows the sample standard deviation is larger by the factor 1.002789 on every log. A distance or a score quoted without its divisor cannot be reproduced exactly.

## Choices that make a result repeatable

Several choices exist so that the same data always give the same answer: the sign rule, the split tie by column index, the tie bands, one seeded generator. The alternatives they replace are in common use. A random feature order grows a tree that depends on `random_state`. The engine's choice moves that dependence somewhere visible: the column order, which is written down with the model.

## Choices that change a figure

Others change what a figure means. The covariance PCA of the Ekene cored rows is almost a gamma ray PCA: its first component carries 0.998581 of the variance with a GR weight of 0.999905, while the correlation PCA's first component carries 0.682351. The silhouette of the teaching clusters is 0.545063 on the scaled logs and 0.443238 on the raw logs. Neither pair disagrees about the data. Each pair answers a different question, and the choice says which.

## Choices about effort

The k-means defaults trade time for reliability. k-means++ here takes one candidate per step, all drawn from one mulberry32(seed) stream, so a learner can follow each draw; scikit-learn's greedy variant tries several candidates per step. The engine runs 10 starts by default, and the reason is in the course's own table of seeds: at k 4, with one start, 8 of 10 seeds stop above 58.289042; with ten starts, 9 of 10 reach it. More starts make a poor stop less likely and do not rule it out, which is why a seeded result is quoted with its seed and its number of starts.

## How to use the table

When your figure and someone else's differ, find the row where the two tools chose differently before looking for an error. The engine names its choice in the basis block of every result, so the working can always be printed beside the number.

## Exercise

Open the view "k nearest neighbours on a held-out well" with EKENE-6 held out and k 5, and read the two basis blocks the panel prints. Match each to a row of the table above. Then change one setting that a convention governs, such as the scaling, and write down the figure before and after with the convention named in each.
