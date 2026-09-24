# Boundaries, rule by rule

{{panel:ef-classify-explorer}}

Every setting the engine checks has an edge: a value it accepts, and a value next to it that it refuses. No single rule, such as "limits are inclusive", holds for all of them. Each rule draws its own boundary, and the only safe way to know where one sits is to read that rule. Every row below is a real call, and the refused side of each is also in the course's table of refusals.

| function | rule | at the boundary | across it |
| --- | --- | --- | --- |
| `pca` | rows | n = 2 is fitted | n = 1 refused |
| `pca` | maxSweeps | 1 accepted | 0 refused |
| `kmeans` | k | 1 and n accepted (6 rows, k 6) | 0 and n + 1 refused |
| `kmeans` | distinct rows against k | distinct rows equal to k accepted | fewer distinct rows than k refused (counted after scaling) |
| `silhouette` | distinct clusters | 2 and n - 1 accepted | 1 and n refused |
| `knnClassify` | k | 1 and the number of training rows accepted | one more refused |
| `cartFit` | maxDepth | 0 accepted (a single leaf) | -1 refused |
| `cartFit` | a split | a decrease above zero splits | a decrease of exactly zero leaves a leaf (golden `cart-xor-no-split`) |
| `matchClusters` | one-to-one | clusters equal to facies accepted | more clusters than facies refused; majority mode accepts them |
| `cutTree` | an id merged twice | each row id and cluster id merged once accepted | a second merge of any id refused |

## Reading the table

Some boundaries are counts that stop at the data: k-means takes any k from 1 to the number of rows, and kNN any k from 1 to the number of training rows. Some count something the engine derives first: k-means counts distinct rows after scaling. Two cored rows passed twice each, with k 3, are refused in the engine's words:

> X has 2 distinct rows after scaling, fewer than k = 3: k-means++ cannot place 3 distinct centres

Some are exact comparisons: a tree splits on any decrease above zero, and a decrease of exactly zero leaves a leaf. The silhouette's boundary sits at both ends, 2 clusters and n - 1, because it compares each row with the next nearest cluster.

## A linkage matrix that merges an id twice

`cutTree` re-cuts a linkage matrix the caller passes, so it checks that the matrix describes a real tree. Each row id and each cluster id may be merged once only. A matrix in which row 0 is merged a second time is refused:

> linkageMatrix[1] merges id 0, which linkageMatrix[0] already merged: each row id (0 to 3) and each cluster id (4 to 5) may be merged once only

The message counts the ids of that small matrix: rows 0 to 3 and the clusters it made, 4 and 5.

## A limit on the Jacobi sweeps

`pca` finds its eigenvalues by sweeps of Jacobi rotations, 50 at most by default. The setting is `maxSweeps`, and its boundary is 1:

> maxSweeps must be a whole number, 1 or more

A run that uses every sweep it was allowed and still needed a rotation is a result with a warning, and a later lesson in this module reads that warning.

## A warning returns the result

A refusal returns no result. A warning returns the result and adds a sentence. With one start per k and seed 265, the elbow over k 1 to 8 reads an inertia of 45.270437 at k 8 against 45.153181 at k 7: a larger k fitted worse. The engine returns every row of the elbow, and warns, in its own words:

> inertia rises at k = 8: those runs stopped in a local minimum; raise nInit

With the default 10 starts the same seed shows no rise. The figures are all returned, and the warning says which of them to distrust.

## Exercise

Open the view "Boundaries and caps, read from the engine". Read each cap from the engine's DEFAULTS. Then set k for the two training rows to 2 and read the result, and set it to 3 and read the refusal. Write down, for this one rule, which side of the boundary the value 2 sits on and why.
