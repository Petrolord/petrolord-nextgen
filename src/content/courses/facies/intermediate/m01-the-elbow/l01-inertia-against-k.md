# Inertia against k

{{panel:ef-judge-explorer}}

The Associate tier fitted one k-means clustering with k stated in advance: k 4, seed 3, 10 starts, standard scaling, on the 180 cored rows of the Ekene field. That k was a choice. This tier asks how a choice of k is judged, starting with the simplest tool: k-means at every k in a range.

## What the elbow call does

The engine's `elbow` runs k-means for each k from kMin to kMax on the same rows, with the same scaling, seed and number of starts, and prints the inertia of the winning start at each k. Inertia is the sum over the rows of the squared distance to their own centre, measured on the standardised logs. On the 180 cored rows, GR, RHOB, NPHI and PEF, standard scaling with the population standard deviation (divisor n), seed 3 and 10 starts at every k:

| k | inertia | passes (winning start) |
| --- | --- | --- |
| 1 | 720.000000 | 2 |
| 2 | 245.390847 | 2 |
| 3 | 81.231125 | 2 |
| 4 | 58.289042 | 6 |
| 5 | 51.743024 | 11 |
| 6 | 47.642067 | 6 |
| 7 | 44.956011 | 7 |
| 8 | 41.863457 | 9 |

The k 4 row is the teaching clustering itself: inertia 58.289042, 6 passes in the winning start.

## Why k 1 reads 720.000000

At k 1 every row sits in one cluster, and its centre is the mean of every row. On standardised logs each log has mean 0 and population variance 1 over the rows it was fitted on, so each log contributes n to the sum of squares. Four logs on 180 rows give 720.000000, the number of rows times the number of logs. If the first row of your elbow does not equal rows times logs under standard scaling, the rows or the logs are not the ones you think.

## Inertia falls as k grows

More centres can only sit closer to the rows, so when every k is fitted well the inertia falls as k grows. In the table it falls at every step, from 720.000000 at k 1 to 41.863457 at k 8. Carried on to one cluster for every distinct row, it would reach 0, with every row its own centre.

So the smallest inertia is never the answer: across different k it mostly records that more centres were allowed. What the elbow offers instead is the shape of the fall: large at first, while each new centre takes a real group of rows, and small later, while new centres split groups that were already compact. The next two lessons read that shape in numbers.

## Units, and what the inertia is measured in

The inertia is in squared standard units. Raw logs or min-max scaling give other units, so an elbow is quoted with its scaling, seed and starts.

A range needs a lower end at least 1. The engine refuses a kMin of 0 in its own words:

> kMin must be a whole number, 1 or more

## Exercise

Open the judge explorer on the elbow view with the Ekene cored rows, the logs GR, RHOB, NPHI and PEF, largest k 8, seed 3 and the default starts. Check that the first row reads the number of rows times the number of logs. Then remove one log from the list, predict the new k 1 inertia before you run it, and run it to check your prediction. Finally, read the k 4 row and confirm it matches the teaching clustering you fitted in the Associate tier.
