# Lloyd passes until the labels stop changing

{{panel:ef-cluster-explorer}}

Once the starting centres are placed, k-means runs Lloyd passes. Each pass does two things: it assigns every row to its nearest centre, then moves each centre to the mean of the rows assigned to it. Moving the centres can change which centre is nearest to some rows, so the next pass may move rows between clusters. The passes repeat until nothing moves.

| pass | inertia after the assignment | rows that changed cluster |
| --- | --- | --- |
| 1 | 105.839909 | 180 |
| 2 | 61.215752 | 15 |
| 3 | 58.432713 | 1 |
| 4 | 58.384442 | 1 |
| 5 | 58.330411 | 0 |

## Reading the trace

The table is one start, k 4, seed 3, from the starting rows 129, 5, 79 and 11, on the 180 cored rows with standard scaling. The first pass counts all 180 rows as changed, because before it no row had a cluster. The second pass moves 15 rows. The third and fourth move one row each. The fifth moves none, and the run stops.

The inertia column is the sum of squared distances from each row to its own centre, in standard units, measured after each assignment. It falls from 105.839909 to 58.330411, quickly at first and then by small steps. It never rose from one pass to the next here.

## When the run stops

The engine stops when an assignment pass returns the same labels as the pass before. Its basis reads:

> converged when an assignment pass returns the labels of the pass before; iterations counts assignment passes (scikit-learn n_iter_); at most maxIter 300

So `iterations` counts assignment passes, and the confirming pass, the one that changed nothing, is included. This run took 5 passes. Counting centre moves instead would give a different number for the same run; the engine states its count so the figure can be compared with another tool's.

## A limit on passes

`maxIter` caps the passes of one start, 300 by default. `converged` is false when none of the first maxIter passes returns the labels of the pass before; the first pass never can, so a cap of 1 never converges. The engine then assigns the labels once more against the last centres and adds a warning. The same start stopped at maxIter 2 returns `converged` false and inertia 58.432713, the third-pass figure above, with this warning:

> did not converge in 2 assignment passes: the labels printed come from one more pass against the last centres

That is a result with a warning, never a refusal. A cap of 0 is refused:

> maxIter must be a whole number, 1 or more

## Why the passes settle

An assignment never raises the sum of squared distances, because every row moves to a nearer centre or stays. A centre move never raises it either, because the mean is the point with the smallest sum of squared distances to its rows. There are finitely many ways to split 180 rows, so the passes cannot fall forever. They stop, but where they stop depends on where they started.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Keep the cored rows and the four logs, set k to 4, the seed to 3 and the starts to 1. Read the pass trace of the winning start and check it against the table above. Then set the most passes to 2 and find the warning. Restore 300, set the starts to 10, and write down how many passes the winning start took.
