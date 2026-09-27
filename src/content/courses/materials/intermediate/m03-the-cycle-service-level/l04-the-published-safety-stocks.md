# The published safety stocks

{{panel:materials-stock-calculator}}

This lesson checks the engine against a published worked example: Caplice, MIT ESD.260J Logistics Systems, Fall 2006, lecture 11 slides 18 to 24 (MIT OpenCourseWare, CC BY-NC-SA 4.0, read 2026-09-27). The licence is non-commercial and this course is sold, so the course cites the figures by lecture and slide, works them in its own panel, and reproduces none of the slide text.

## The stated data

The slides state a demand of 13,000 units a year, normally distributed, a lead time of two weeks, a forecast error of 1,316 units a year, and an order quantity of 228. The engine's inputs read them in weeks, the one period chosen for the whole call:

* a demand of 250.000000 a week;
* a standard deviation of 182.496365 a week, the annual forecast error over the square root of 52;
* a lead time of 2 weeks with no spread;
* an order quantity of 228.

Over the two weeks the demand is 500.000000 and sigma is 258.088834. Slide 24 prints a safety stock for four cycle service levels. To match the slide, the inputs read k from a table to two decimals and hold the reorder point to the nearest whole unit, as the slide does.

## Four printed figures, reproduced

| cycle service level | k read to two decimals | held level (engine) | safety stock, table reading | printed | safety stock, exact k (engine) |
| --- | --- | --- | --- | --- | --- |
| 0.99 | 2.33 | 1101.000000 | 601.000000 | 601 | 600.404410 |
| 0.95 | 1.64 | 923.000000 | 423.000000 | 423 | 424.518354 |
| 0.90 | 1.28 | 830.000000 | 330.000000 | 330 | 330.754149 |
| 0.80 | 0.84 | 717.000000 | 217.000000 | 217 | 217.213043 |

The table-reading column is the held level less the demand over the lead time, and it reproduces all four printed figures. The exact column does not: rounded to the unit, three of its four figures miss the print, though every row is within two units.

## What the check proves

The check proves that the engine's rule, with the reading the source used, gives the source's numbers. It says nothing against the exact reading: each is the same rule asked a differently stated question, and a quoted safety stock names its reading.

The same slide carries a second column, for the fill rate. That column, and one printed figure in it that does not follow from its own rule, belong to the next module.

## Why weeks

The engine knows no calendar. The slide's data comes in years and weeks, and a call works in one period, so the annual forecast error is scaled to a week before it is typed.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "Lecture 11 slide 24, fill rate 0.95". The case is stated for a fill rate; this exercise turns it into the cycle service check. Set the control "Service measure (stated)" to cycle service and leave the level at 0.95. Set "Safety factor reading (stated)" to a table, with "Safety factor decimals (stated)" 2. Set "Rounding rule (stated)" to the nearest multiple with a multiple of 1.

Read the held level, 923.000000, and subtract the demand over the protection period to reach the printed 423. Step the level to 0.99, 0.90 and 0.80 and reproduce the other three rows. Finally set the safety factor reading to none and the rounding rule to none, and read the exact safety stock at each level against the last column.
