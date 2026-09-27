# The risked mean

{{panel:prms-aggregation-calculator}}

A risked figure multiplies a quantity by a named chance. The engine computes one risked figure for a risked class: the risked mean, the sum of each project's chance of commerciality times its mean. Because means add without a portfolio effect, the risked mean is exact, and it moves with no seed, no draw count and no correlation.

## The Ekene Contingent Resources

Three discovered projects are held back from Reserves, each with its stated distribution and its stated chance of commerciality, in MMboe:

| project | distribution (stated) | chance of commerciality, percent (stated) | low | best | high | mean (engine) |
| --- | --- | --- | --- | --- | --- | --- |
| EKN-3 | lognormal | 50.000000 | 8.450961 | 12.425127 | 18.268192 | 13.000000 |
| EKN-4 | triangular | 65.000000 | 3.000000 | 4.500000 | 6.500000 | 4.637674 |
| EKN-5 | triangular | 20.000000 | 1.707107 | 2.837722 | 4.585786 | 3.000000 |

The chances are the chances of development the Associate tier read off the classification of each project. EKN-3 is on hold, EKN-4 pending and EKN-5 unclarified, with technology under development.

## The figure and its line

The risked mean is 10.114488 MMboe, against an unrisked sum of means of 20.637674 (engine). The engine's line, verbatim:

> risked mean: the sum of chance of commerciality x mean, 10.114488 MMboe; state the classes separately and whether each figure is risked (PRMS 4.2.6; FAQ 6.9; AG 2011 6.4)

Section 6.4 of the 2011 Application Guidelines (November 2011) is the source of the risked sum; the course cites it by number. The rule is simple in words: weight each project's mean by its chance of commerciality and add the weighted means.

## What the risked mean describes

The risked mean is an expected quantity across the projects' chances. It is the figure a portfolio planner might carry to compare Contingent Resources with other uses of money. It is not a 2C, and no project will ever produce it: each project either goes ahead, bringing its whole range, or does not. The unrisked figures describe the quantities if the projects go ahead; the risked mean describes the average over the chances. A report prints both, each labelled.

## Prospective Resources, the same way

The Ekene Prospective Resources are risked the same way: a risked mean of 8.980000 against a sum of means of 49.333333 (engine). Their chances of commerciality are the product of two chances, which is why the risked figure falls so far below the unrisked one.

## Not added across classes

The engine's line says it plainly: state the classes separately. The risked mean of the Contingent Resources is never added to a Reserves total or to a risked Prospective figure in this engine. Each is reported on its own line with its chances.

## The Monte Carlo beside it

The same call samples the Contingent projects on seed 20271113 and 20000 draws, with a uniform correlation of 0.300000. Those sampled figures are unrisked estimates and are never graded. The risked mean does not read them.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Contingent Resources, risked". Read the project table. For each project multiply its mean by its chance of commerciality over 100, add the three products, and compare with the "Risked mean" tile. Change the chance control of EKN-5 to 50 and read the tile again. Then switch to "Ekene Prospective Resources, risked" and write the risked mean and the sum of the means, each labelled as risked or unrisked.
