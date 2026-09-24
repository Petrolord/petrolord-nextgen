# Writing up a clustering

{{panel:ef-cluster-explorer}}

A clustering that cannot be reproduced cannot be checked, and one that claims more than it showed misleads whoever reads it. The write-up is where both are settled. It gives a reader everything needed to rerun the calls and get the same numbers, and it says plainly what the clustering has not yet earned.

| item | what is written |
| --- | --- |
| rows | 180 rows of the 6 cored wells, EKENE-1, EKENE-2, EKENE-3, EKENE-4, EKENE-5, EKENE-6 |
| logs and scaling | GR, RHOB, NPHI, PEF, standard scaling (population SD) fitted on those rows |
| method | k-means, k 4, k-means++ seeding, seed 3, 10 starts |
| result | inertia 58.289042 in standard units; cluster sizes 29, 59, 54, 38; centres in log units |
| what is not claimed | no cluster is named as a facies until it is matched against core; k was stated, and the choice of k is judged in the Professional tier |

## The rows

Name the wells and the number of rows. Here that is the 180 rows of the six cored wells. If rows were dropped for missing values, say how many and why, because the scaler, the components and the clusters all depend on exactly which rows went in.

## The logs and the scaling

Name every log and say which were left out. Name the scaling and its divisor: standard scaling with the population standard deviation (n), fitted on the rows clustered. A reader who scales with the sample standard deviation (n - 1) gets every distance shrunk by the same factor, identical clusters and an inertia of 57.965214; one who uses min-max gets different clusters.

## The method

Name the method by what it is: k-means, with k-means++ seeding, k 4, seed 3 and 10 starts. A seeded result without its seed cannot be reproduced. A result without its number of starts hides how hard the engine looked: with one start seed 3 stops at 58.330411, and with ten it reaches 58.289042.

## The result

Give the inertia with its units, 58.289042 in standard units, the cluster sizes, 29, 59, 54 and 38 rows, and the centres in log units. Say which cluster numbers these are, from this run, and that another seed may number the same clusters differently. If a new well was assigned, give its counts per cluster and the largest distance to a centre.

## What is not claimed

This line is as important as the numbers. No cluster is named as a facies until it has been matched against core. The number of clusters was stated without a test, and judging it is the Professional tier's work. The inertia measures how tight the clusters are and says nothing about rock types. A reader who sees "cluster 2" in your write-up should never be able to mistake it for a rock name.

## Words to avoid

Give k-means no grander name than its own, and do not say the logs were "classified". Say "grouped into clusters by k-means". Do not write "cluster 0 is shale". Do not quote a distance without its scaling, or a standard deviation without its divisor. The vocabulary of this course exists so that a write-up claims exactly what the calls returned.

## Exercise

Run the teaching clustering in the cluster explorer, on the view "k-means, start by start", and write it up in five lines under the headings of the table above. Then run it again with seed 5 and ten starts, and write a second write-up for that run. Compare the two, and write one sentence on what a reader would get wrong if your seed 5 write-up left out its seed.
