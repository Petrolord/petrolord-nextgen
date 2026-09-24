# Row caps and a seeded sample

{{panel:ef-classify-explorer}}

{{panel:ef-judge-explorer}}

Three functions compare every row with every other row, or every new row with every training row, so their memory and time grow with the product of the rows they compare. Each has a stated cap, and each refuses above it with a message that names the way round.

| function | what it holds | cap |
| --- | --- | --- |
| silhouette | every pair of rows | 10000 rows scored in full |
| agglomerative | every pairwise distance, n(n - 1)/2 of them | 3000 rows |
| knnClassify | every training row against every new row | 100000000 pairs |

## The silhouette

Passed 10001 rows, the cored rows repeated, with no sample asked for:

> X has 10001 rows, above the 10000 the silhouette computes in full (every pair of rows): give sampleSize and seed to score a seeded sample

The boundary is drawn for this rule: 10000 rows are scored in full, and 10001 are refused without a sample.

## Agglomerative clustering

Passed 3001 rows:

> X has 3001 rows, above the 3000 agglomerative clustering accepts (it holds every pairwise distance, n(n - 1)/2 of them): cluster a sample or use kmeans

3000 rows are clustered and 3001 are refused. k-means compares each row with its k centres only, and the engine sets it no row cap.

## A seeded sample

The silhouette's way round is a sample: `sampleSize` rows drawn with a stated `seed` and scored among themselves. The basis states how, in the engine's words:

> the first 60 rows of a mulberry32(3) Fisher-Yates shuffle, scored among themselves (scikit-learn sample_size)

On the teaching clusters, k 4, seed 3 and 10 starts, the mean silhouette of all 180 rows is 0.545063. Samples of 60 rows give:

| sample | mean silhouette |
| --- | --- |
| 60 rows, seed 3 | 0.521590 |
| 60 rows, seed 4 | 0.525011 |
| all 180 rows | 0.545063 |

Each sample gives its own figure, and neither reproduces the full one. The rows come from a Fisher-Yates shuffle driven by mulberry32 from the seed, so the same seed draws the same rows every time. A sample asked for with no seed is refused by name:

> seed must be a whole number from 0 to 4294967295

A sampled silhouette is an estimate, and it is quoted with its size and its seed, so that anyone can draw the same rows again. `sampleSize` has its own boundary: from 2 up to the rows passed, or 10000, whichever is smaller.

## When a field outgrows a cap

The caps are there because these methods hold every pair. A larger dataset is sampled with a stated seed, clustered by k-means, or classified in batches, and the write-up says which. None of these is a silent fallback: the engine refuses, names the cap, and leaves the choice to you.

## Exercise

Open the judge explorer on "The silhouette, row by row and cluster by cluster" with the cored rows. Read the mean silhouette with the sample size blank. Then set the sample size to 60 and read it again, and set it to 181 and read the refusal. Write down the sampled figure with its size and seed, the way a report would quote it.
