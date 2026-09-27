# Expected units down

{{panel:materials-spares-calculator}}

The downtime cost of an insurance stock rests on one column of the table: the expected units down. This lesson reads what that column measures, how the engine computes it, and why a figure multiplied by hand from the printed column differs a little from the engine's cost.

## What the column measures

With n spares, the units down at a random moment are the orders outstanding beyond n: none while n or fewer are on order, one for each order beyond. The expected units down are the average of that count. In the engine's rule, verbatim: expected units down E[(X - n)+].

With no spares every order outstanding is a unit down, so the expected units down are the mean, 0.821918 on the ESP motor. Each spare lowers the column:

| spares | expected units down |
| --- | --- |
| 0 | 0.821918 |
| 1 | 0.261506 |
| 2 | 0.062398 |
| 3 | 0.011773 |
| 4 | 0.001827 |
| 5 | 0.000240 |
| 6 | 0.000027 |

## The loss, row by row

This is the Poisson loss the Professional tier met for slow movers. Its recursion starts at the mean and, at each step, subtracts one less the cumulative probability at the level before. For the spares table that cumulative probability is the probability of no shortage. From the printed columns the recursion reproduces each row to within one unit in the sixth decimal; the engine runs it on the unrounded figures, so its column is exact to the precision printed.

## From units down to money

The downtime cost a year is the expected units down times the days a year times the downtime cost a day. With no spares on the ESP motor that is 5400000.000000 a year. Multiply the printed 0.821918 by hand and the product misses by a few units, because the printed figure is rounded at the sixth decimal and the engine multiplies the full one. A planner who checks a cost by hand checks it to the precision of the figures used, and quotes the engine's field.

The same caution applies at the cheapest stock: 0.001827 units down on average, which the engine prices at 12003.732064 a year. Small units down still cost money when a day of waiting costs 18000.

## Why the loss matters more than the probability

Two items can share a probability of no shortage and differ in units down, because a shortage can be one unit short or several. The cost follows the units down. That is why the engine prices the loss and prints the probabilities beside it.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". Using only the printed columns, run the recursion for rows 1, 2 and 3: take the row above's expected units down and subtract one less that row's probability of no shortage. Record how far each result sits from the printed figure. Then double the downtime cost a day, predict how the downtime column moves and whether the expected units down move at all, and read the table. Restore 18000.
