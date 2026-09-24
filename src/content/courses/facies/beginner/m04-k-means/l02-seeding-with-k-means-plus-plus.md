# Seeding with k-means++

{{panel:ef-cluster-explorer}}

k-means needs starting centres before its first pass, and where they start shapes where they end. k-means++ is a way of choosing starting rows that are spread out. The engine draws them at random, from one seeded generator, so that anyone with the same rows and the same seed draws the same starting rows.

| starting row, in the order drawn | core facies | GR | RHOB | NPHI | PEF |
| --- | --- | --- | --- | --- | --- |
| 129 | limestone | 21.500000 | 2.629000 | 0.068000 | 5.080000 |
| 5 | sandstone | 60.200000 | 2.271000 | 0.197000 | 1.870000 |
| 79 | shale | 141.200000 | 2.517000 | 0.330000 | 2.900000 |
| 11 | shaly-sand | 49.700000 | 2.416000 | 0.257000 | 2.490000 |

## The first centre

The generator is the platform's canonical mulberry32, started from the seed. Its first draw is a number u between 0 and 1, and the first centre is row floor(u x n). For seed 3 on the 180 cored rows the first draw is u = 0.720227, so the first centre is row 129, which is floor(0.720227 x 180).

## Each later centre

Every later centre is drawn with probability proportional to D squared, the squared distance from a row to the nearest centre already chosen. A row far from every chosen centre is likely to be drawn. The engine takes the next draw u, multiplies it by the sum of D squared over all rows, and walks down the rows adding up their D squared until the running sum passes that value. That row is the next centre. Its basis reads:

> k-means++ (one candidate per step) from one mulberry32(seed) stream: first centre row floor(u n), then u x sum D^2 picks the first row whose running sum of D^2 is above it; nInit runs draw in turn from the same stream

For seed 3 the four starting rows, in the order drawn, are 129, 5, 79 and 11. Here the draws landed on one row of each facies. Core played no part in the draw, and another seed need not do the same.

## One candidate per step

Some tools draw several candidate rows at each step and keep the best. This engine draws one candidate per step, from one stream, so a learner can follow every draw by hand. It is a stated choice, and it means the starting rows here can differ from another tool's at the same nominal seed.

## When distinct rows run short

k-means++ needs k distinct rows to place k distinct centres. Pass two cored rows twice each and ask for three clusters, and the engine refuses:

> X has 2 distinct rows after scaling, fewer than k = 3: k-means++ cannot place 3 distinct centres

The count is taken after scaling, on the rows as the engine will cluster them.

## What a seed promises

A seed makes the draw repeatable, and the engine refuses a call without one. It says nothing about whether the draw was a good one; the next lessons show that some seeds start better than others.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Keep the cored rows and the four logs, set k to 4, the seed to 3 and the starts to 1, and read the starting rows in the starts table. Find rows 129, 5, 79 and 11 in the table and check their logs against the table above. Then try seeds 1, 2 and 4 with one start each, and write down the starting rows of each and whether they land on rows with a high, low or middling gamma ray.
