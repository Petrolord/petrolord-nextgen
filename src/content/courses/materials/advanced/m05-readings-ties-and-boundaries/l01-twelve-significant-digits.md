# Twelve significant digits

{{panel:materials-stock-calculator}}

{{panel:materials-spares-calculator}}

A computer holds a decimal number in binary, and many decimals it cannot hold exactly. A sum that ought to be 70 can come back a hair below it. The engine settles every comparison of a score, share, cost, level or service the same way: two figures that agree to 12 significant digits tie. This module gathers the readings the engine states, and this lesson starts with that one.

## Reading one, in the engine's words

The criticality basis carries it at the end, verbatim:

> weighted score = sum of weight x score / 5 over 4 criteria; classes V at or above 70, E at or above 44, D at or above 0; compared at 12 significant digits

The same rule is written into the ABC, slow-moving and Poisson bases, and it governs the ties of the discount and spares searches. The alternative the engine names is exact comparison of the stored doubles.

## Where it decides a class

Three weights of 33.3, 33.3 and 33.4 with a score of 7 out of 10 on each should give a weighted score of 70. The computer holds the sum a hair below 70. Compared at 12 significant digits it meets the V minimum, and the item is class V, verbatim:

> T: weighted score 70 is at or above 70, the minimum for class V

Under exact comparison the same item would fall below the V minimum on a rounding error the user never wrote. The reading keeps a class from turning on the last binary digit of a sum.

## Where it decides a Poisson level

A Poisson target stated as the exact cumulative probability at level 1 is met at level 1, verbatim:

> level 1: P(X <= 1) = 0.735759 is at or above 0.7357588823428847; at 0 it is 0.367879 (Poisson mean 1)

Raise the target to 0.7358, just above it, and the level moves to 2, verbatim:

> level 2: P(X <= 2) = 0.919699 is at or above 0.7358; at 1 it is 0.735759 (Poisson mean 1)

## What the reading does to a grade

No graded figure in this course moves under the reading or its alternative. Every capstone field is the same number under each, and the course proves it field by field. The reading is taught so that a learner who reproduces an edge case by hand knows which comparison the engine made. It is a stated choice of the engine, one of several this module reads.

## Exercise

Open the stock calculator on the view "Stock for Poisson demand" and start from "A target met exactly". Read the level and compare the reason with the first Poisson quotation above. Set "Service level (stated)" to 0.7358, predict the level, and compare the reason with the second. Then open the spares calculator on the view "Insurance spares" and start from "Two stocks tied on cost". Read the totals for 0 and 1 spares, each 365000.000000, and the cheapest number the tile reports. Write one sentence on what exact comparison could have done to that answer.
