# Reading a printed tree

{{panel:ef-classify-explorer}}

A tree is small enough to read whole. `cartFit` returns a printed form, one line per node, with x <= threshold going left. The tree grown on all 180 cored rows with five channels at the default depth, exactly as the engine prints it:

    |--- NPHI <= 0.123
    |   |--- class: limestone (n = 54, counts 54/0/0/0)
    |--- NPHI >  0.123
    |   |--- GR <= 95.6
    |   |   |--- RHOB <= 2.357
    |   |   |   |--- NPHI <= 0.259
    |   |   |   |   |--- PEF <= 2.49
    |   |   |   |   |   |--- class: sandstone (n = 45, counts 0/44/0/1)
    |   |   |   |   |--- PEF >  2.49
    |   |   |   |   |   |--- class: shaly-sand (n = 2, counts 0/0/0/2)
    |   |   |   |--- NPHI >  0.259
    |   |   |   |   |--- class: shaly-sand (n = 4, counts 0/0/0/4)
    |   |   |--- RHOB >  2.357
    |   |   |   |--- GR <= 55.95
    |   |   |   |   |--- RHOB <= 2.3810000000000002
    |   |   |   |   |   |--- class: sandstone (n = 5, counts 0/5/0/0)
    |   |   |   |   |--- RHOB >  2.3810000000000002
    |   |   |   |   |   |--- class: shaly-sand (n = 11, counts 0/1/0/10)
    |   |   |   |--- GR >  55.95
    |   |   |   |   |--- class: shaly-sand (n = 30, counts 0/0/0/30)
    |   |--- GR >  95.6
    |   |   |--- class: shale (n = 29, counts 0/0/29/0)

## How to read it

Each indentation is one level of depth. A leaf line names its facies, its rows and the count of each facies in the order limestone, sandstone, shale, shaly-sand. The tree has 15 nodes, 8 leaves and depth 5.

NPHI at or below 0.123000 is limestone, all 54 rows. Above it, GR above 95.600000 is shale, all 29 rows. The tree spends its remaining levels on sandstone and shaly-sand, the pair the Professional tier found hardest to separate.

## Counting the misses

Two leaves are mixed: the sandstone leaf of 45 rows holds 1 shaly-sand row, and the shaly-sand leaf of 11 rows holds 1 sandstone row. Every other row is predicted as its core facies, which gives the training accuracy the engine returns, 0.988889, on the rows it was grown on.

## The node numbers

The engine numbers nodes depth first, left before right. Its basis says so:

> numbered depth first, left before right (scikit-learn tree_ order)

So the limestone leaf is node 1, the GR split is node 2, and the shale leaf, reached last, is node 14. CALI appears on no line.

## Exercise

Open the view "A classification tree and its printed form" with the five channels and the default depth. Take row 6 of the cored rows, counted from 0: GR 59.800000, RHOB 2.415000, NPHI 0.221000, PEF 1.990000. Trace it down the printed tree and write down the leaf it reaches and the node numbers on its path. Then remove CALI from the channels and say whether the printed tree changes.
