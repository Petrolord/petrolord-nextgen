# Two methods on the same rows

{{panel:ef-judge-explorer}}

The tier has now built four labellings of the 180 cored rows at k 4: k-means and three agglomerative cuts. The adjusted Rand index puts them on one scale against the core facies, and against each other, without any mapping.

## Every k 4 labelling against core

On the 180 cored rows, GR, RHOB, NPHI and PEF, standard scaling:

| labelling | ARI against the core facies |
| --- | --- |
| k-means, seed 3 | 0.872413 |
| Ward, cut at 4 | 0.873388 |
| complete, cut at 4 | 0.897678 |
| average, cut at 4 | 0.676404 |
| the well each row came from (6 groups) | 0.157021 |

Of the four methods, complete linkage agrees best with the core here, at 0.897678. Ward and k-means are close to each other, at 0.873388 and 0.872413. Average linkage falls well behind at 0.676404: its cut at k 4 put 96 rows into one cluster and left one row alone, so many pairs the core splits, it joins. The well grouping, 0.157021, is the floor: a grouping that knows nothing about the rock.

## Two methods against each other

The index needs no core. k-means against Ward, neither of them the core, scores 0.863179. They agree closely with each other and about equally with the core, and yet they are not the same grouping. Two methods can reach similar agreement with the rock by getting different rows wrong. The contingency tables of the matching view show which.

## What the ranking is worth

These figures rank the methods on this field, with these logs, this scaling and, for k-means, this seed and number of starts. On another field the order can change. A statement such as "complete linkage agrees best with the core here, 0.897678" is honest; "complete linkage is the best method for facies" is a claim these rows cannot support.

The differences are also small at the top. Ward and k-means differ by less than a thousandth; a different seed, a different k-means start, or a few more cored rows could reorder them. Where two figures are that close, report both and draw no winner.

## The silhouette beside the index

The mean silhouettes of the same cuts at k 4, on the same scaled logs, read: k-means 0.545063, Ward 0.531627, complete 0.530601, average 0.514177. The silhouette puts k-means first and complete third; the index against core puts complete first. The silhouette measures compact, separated groups, and the index measures agreement with the rock. Where core exists, the second is the question being asked.

## Writing the comparison down

A comparison of methods names everything that fixed the figures: the rows, the logs, the scaling, the k, the seed and starts of k-means, and the linkage of each tree. It gives the index against core for every method, the well grouping as the floor, and the index between the two closest methods, so a reader can see whether they found the same grouping or merely scored alike.

## Exercise

In the matching view, run the Ekene cored rows at k 4 with each of k-means, Ward, complete and average linkage and one-to-one matching, and record the index and the accuracy for each. Rank the four by each figure and see whether the two rankings agree. Then, in the adjusted Rand index view, compare two of the labellings directly with each other and write one sentence on what that figure adds.
