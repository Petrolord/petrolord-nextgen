# The Apapa pool end to end

This lesson reads the Apapa PMS result once, in one fixed order of eight steps, and then reads the optimizer's own default pool the same way. The order is this lesson's device: the engine prints the lines, and the lesson puts them in sequence.

## 1. The status

Optimal. A recipe exists that meets every specification inside every tank limit, and this is the cheapest. Had the status been infeasible, as it is on the 10 ppm template, there would be nothing further to read but the refusal.

## 2. What was skipped

Nothing. Every specification was applied. Had the sulfur row been skipped, as it is when Isomerate carries no sulfur figure, the recipe would meet the other specifications only, and the lab prints its total cost as 695245.0644 $.

## 3. The recipe and its bounds

Reformate 3284.6899 bbl, FCC gasoline 3531.1221 bbl, Isomerate 784.1881 bbl and Butane 400.0000 bbl, total 8000.0000 bbl, at a total cost of 698701.5605 $ and a unit cost of 87.3377 $/bbl. Components at their availability: Butane.

## 4. What binds

Sulfur at 50.0000 and RVP at 9.0000, each with a giveaway of 0.0000. With the batch row and Butane's bound, those are the constraints that pin the vertex.

## 5. What is given away

RON gives away 3.5010, MON 3.4928 and Density 0.0203. At the typed values of 0.6 and 0.4 $ per unit per barrel, the octane giveaway is worth 16804.7174 $ on RON and 11176.9355 $ on MON over the batch. Density carries no typed value and is not priced.

## 6. What relief is worth

Sulfur relief is worth 551.8026 $ per ppm, from a rowPrice of -0.0914 scaled by sum(SG x volume), 6037.3872. RVP relief is worth 4448.9659 $ per psi, from a rowPrice of -0.2569, the batch of 8000.0000 bbl and the index slope of 2.1651 index points per psi. RON, MON and both density rows price at 0.0000.

## 7. The marginal barrel

The Total volume row prices at 87.5108 $/bbl. Marginal minus average is 0.1731, because Butane at its availability cannot supply the next barrel.

## 8. The check by re-solving

At a sulfur limit of 51 ppm the saving is 551.6796 $; at an RVP limit of 10 psi it is 3651.3942 $. Each is a whole unit of relief, read beside a shadow price that is a rate.

## The default pool, the same way

The Product Blending Optimizer opens on its own gasoline pool, 1000 bbl on the 50 ppm template, with components the course calls "its own, with the same names as Apapa's and different figures". Read in the same order:

| component | volume bbl |
| --- | --- |
| Reformate | 516.0028 |
| FCC gasoline | 414.8506 |
| Isomerate | 0.0000 |
| Butane | 69.1466 |

Total cost 86122.7710 $, unit cost 86.1228 $/bbl, binding Sulfur and RVP. Isomerate enters at 0.0000 bbl. The price table reads 86.1228 $/bbl on Total volume, 55.0114 $ per ppm on the Sulfur maximum with rowPrice -0.0720, and 578.9052 $ per psi on the RVP maximum with rowPrice -0.2674. RON, MON and both density rows price at 0.0000.

The same two specifications bind in both pools. In the default pool the marginal and average barrels print the same figure, 86.1228.

{{panel:crude-recipe-explorer}}

In the panel, open the default pool and read it top to bottom in the order above. Then load Apapa and read it again.

## Exercise

Read the default pool's sulfur relief, 55.0114 $ per ppm on a 1000 bbl batch, and Apapa's, 551.8026 $ per ppm on an 8000 bbl batch. Say what unit each figure is per, over what batch it is measured, and what the pairing shows about comparing a price of relief between two cargoes of different sizes and recipes.
