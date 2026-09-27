# Fill rate and the loss recursion

{{panel:materials-stock-calculator}}

A fill rate on a Poisson item needs the expected units short at each level, the last column of the table. The engine builds it with a short recursion.

## The loss recursion

Beyond level 0 the expected units short is the mean: with no stock, every unit demanded is short. Each next level subtracts the chance that demand exceeds the level before. The engine's rule, verbatim:

    L(0) = m, L(x + 1) = L(x) - (1 - F(x)) = E[(X - x - 1)+]

On the PSV kits: L(0) is 2.000000; subtracting one less F(0), 0.135335, gives L(1), 1.135335; subtracting one less F(1), 0.406006, gives L(2), 0.541341.

## A fill-rate target on the PSV kits

A fill rate of p with an order quantity Q allows at most Q times one less p units short a cycle, and the engine picks the smallest level whose loss meets that. On the PSV kits at a fill rate of 0.95 with an order quantity of 6, verbatim:

> level 3: expected units short 0.218018 is at or below 6 x (1 - 0.95) = 0.3; at 2 it is 0.541341 (Poisson mean 2)

The level is 3, with an achieved fill rate of 0.963664, against level 5 at a cycle service level of 0.95. The comparison is a reading the engine states: the target is met at or below the units short it allows, and the alternative it names is a target met only strictly below.

## A published check, and a slip

Caplice, MIT ESD.260J Logistics Systems, Fall 2006, lecture 13 slides 11 and 12 (MIT OpenCourseWare, CC BY-NC-SA 4.0, read 2026-09-27) work a fill rate of 0.9 on a mean of 0.8 a week with an order quantity of 0.8. The slide's level is 2, and so is the engine's:

> level 2: expected units short 0.058121 is at or below 0.8 x (1 - 0.9) = 0.08; at 1 it is 0.249329 (Poisson mean 0.8)

| level | expected units short (engine) | printed |
| --- | --- | --- |
| 0 | 0.800000 | 0.80 |
| 1 | 0.249329 | 0.25 |
| 2 | 0.058121 | 0.06 |
| 3 | 0.010699 | 0.01 |
| 4 | 0.001619 | 0.009 |

The first four rows agree at the precision the slide prints; level 4 does not. The recursion the same slide states gives it from the row above: the loss at level 3 is 0.010699, the cumulative probability there is 0.990920, and 0.010699 less one less 0.990920 is 0.001619. The printed 0.009 is not that figure at any precision the slide uses. The course keeps the print beside the rule's figure and teaches it as a slip.

## Periodic review on a Poisson

A review period adds to the protection period here too. A demand of 1.5 a period, a lead time of 2 and a review period of 1, at a fill rate of 0.95 with an order quantity of 1.5:

> level 8: expected units short 0.067581 is at or below 1.5 x (1 - 0.95) = 0.075; at 7 it is 0.154167 (Poisson mean 4.5)

## Exercise

In the stock calculator's view "Stock for Poisson demand", start from "The PSV kits on the Ekene register". Set the measure to fill rate and the order quantity to 6, and confirm level 3 and the reason. Clear the order quantity and read the refusal.

Then start from "Lecture 13 slides 11 and 12, fill rate", extend the table to level 4 as in the Poisson table lesson, and work its loss by hand.
