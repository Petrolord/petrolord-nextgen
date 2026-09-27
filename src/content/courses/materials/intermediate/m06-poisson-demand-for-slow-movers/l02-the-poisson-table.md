# The Poisson table

{{panel:materials-stock-calculator}}

The Poisson view prints a table, one row a level, with three columns: the probability that demand over the protection period is exactly that many units, the cumulative probability that it is that many or fewer, and the expected units short beyond the level. Every choice the engine makes is read off this table.

## Building the table

The engine builds each probability from the one before, verbatim:

    p(x) = p(x - 1) m / x from p(0) = exp(-m); F(s) = P(X <= s)

Here m is the Poisson mean. The chance of no demand at all is e to the minus m; each next level multiplies by m over the level. The cumulative F adds the probabilities up to the level.

## The PSV kits

At a mean of 2.000000 kits:

| level | probability | cumulative | expected units short beyond the level |
| --- | --- | --- | --- |
| 0 | 0.135335 | 0.135335 | 2.000000 |
| 1 | 0.270671 | 0.406006 | 1.135335 |
| 2 | 0.270671 | 0.676676 | 0.541341 |
| 3 | 0.180447 | 0.857123 | 0.218018 |
| 4 | 0.090224 | 0.947347 | 0.075141 |
| 5 | 0.036089 | 0.983436 | 0.022488 |

The probabilities of one and two kits are equal at a mean of 2, as the recursion predicts: the step from level 1 to level 2 multiplies by 2 over 2. The cumulative column rises toward 1 without reaching it. The last column starts at the mean, 2.000000, because with no stock every unit demanded is short. A later lesson builds that column.

## A published table

Caplice, MIT ESD.260J Logistics Systems, Fall 2006, lecture 13 slides 11 and 12 (MIT OpenCourseWare, CC BY-NC-SA 4.0, read 2026-09-27) print a Poisson table for a slow mover with a mean of 0.8 a week, reviewed weekly with no lead time. The course cites the figures and reproduces none of the text:

| level | probability (engine) | printed | cumulative (engine) | printed |
| --- | --- | --- | --- | --- |
| 0 | 0.449329 | 44.9% | 0.449329 | 44.9% |
| 1 | 0.359463 | 35.9% | 0.808792 | 80.9% |
| 2 | 0.143785 | 14.4% | 0.952577 | 95.3% |
| 3 | 0.038343 | not cited | 0.990920 | 99.1% |
| 4 | 0.007669 | not cited | 0.998589 | 99.9% |

Every printed probability and cumulative figure agrees with the engine at the precision the slide prints. The slide's third column, the expected units short, carries one figure that does not, and the last lesson of this module takes it up.

## Reading a table as stock

A row of the cumulative column is a stocking decision in waiting. On the PSV kits, holding a level of 4 means demand over the lead time is covered with probability 0.947347; holding 5 raises that to 0.983436. One more kit on the shelf buys the difference. Whether that kit is worth its cost is the stock policy's decision, stated as a target that the engine then meets.

## Exercise

Open the stock calculator, choose the view "Stock for Poisson demand" and start from "The PSV kits on the Ekene register". Confirm the six rows of the first table. With a calculator of your own, work p(0) as e to the minus 2 and each next probability by the recursion, and check them against the table.

Then start from "Lecture 13 slides 11 and 12, fill rate". The table stops at the level the engine chose, so to see it run to level 4, set the control "Service measure (stated)" to cycle service and type into "Service level (stated)" any level above the level 3 cumulative figure, 0.990920, and below the level 4 one, 0.998589. Confirm the probability and cumulative columns against the second table, level by level. Note the expected units short column; you will need it later in this module.
