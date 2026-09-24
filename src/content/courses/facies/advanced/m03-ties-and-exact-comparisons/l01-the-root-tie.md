# The root tie between two logs

{{panel:ef-classify-explorer}}

The Ekene field was built with a tie in it. The generator held limestone NPHI at or below 0.12 and every other facies' NPHI at or above 0.13; it held limestone PEF at or above 4.2 and every other facies' PEF at or below 3.9. So each of the two logs, on its own, separates exactly the 54 limestone rows from the other 126. A tree looking for its best root split finds two that are equally good, and it must choose one.

## Two trees, two column orders

Two trees of depth 1, grown on the 180 cored rows with the four logs, differ only in the order the logs are passed:

| column order | root split | weighted impurity decrease | rows sent left |
| --- | --- | --- | --- |
| GR, RHOB, NPHI, PEF | NPHI <= 0.123000 | 0.283413 | 54 |
| GR, RHOB, PEF, NPHI | PEF <= 4.090000 | 0.283413 | 126 |

The two splits make the same two groups of rows. The engine returns the two decreases exactly equal, and the tie goes to the log with the lower column index: NPHI in the first order, PEF in the second. The basis states the rule, in the engine's words:

> equal decreases (compared exactly on the integer counts) go to the lower feature index, then the lower threshold (scikit-learn breaks feature ties at random)

## Exact, with no band

Distance ties in kNN, k-means and agglomerative clustering are judged inside a relative band, because distances carry rounding. A split is different. Its Gini decrease is compared exactly on the integer facies counts of the two children, so two splits that send the same rows each way produce the same counts and compare as equal, with no rounding to hide behind. A tie here is a tie, and "equal" means equal.

## The printed tree follows the column order

Because the tie goes to the lower index, the order you pass the logs in decides which log the printed tree shows at its root, and which side the limestone goes to. In the first order the limestone rows go left, NPHI at or below 0.123000, and the right child holds the other 126 rows with Gini 0.650416. In the second order the rows with PEF at or below 4.090000 go left, which are the 126 non-limestone rows, and the 54 limestone rows go right, a pure node with Gini 0.

The rows are grouped the same way in both trees. The log at the root, the threshold and the side each group takes all change, so anyone reading the Gini of a particular child has to know the column order first.

## Why the engine chose this rule

scikit-learn draws the order in which it tries features at random, so on a tie like this one its root depends on `random_state`. The engine's rule gives the same tree for the same data and the same column order, every time, and states the order as the tie-break. The cost is that the column order becomes part of the model, and it has to be written down with it.

## Exercise

Open the view "Ties: a tied vote, equidistant rows, a tied root". With the logs in the order GR, RHOB, NPHI, PEF, read the root split and its weighted impurity decrease. Swap NPHI and PEF and read them again. Then move PEF to the first column, read the root split once more, and write down the rule that decided each of the three roots.
