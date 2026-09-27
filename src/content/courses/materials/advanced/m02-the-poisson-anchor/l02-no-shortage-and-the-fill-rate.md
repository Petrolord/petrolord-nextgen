# No shortage and the fill rate

{{panel:materials-spares-calculator}}

The insurance table prints two probabilities side by side, and they answer different questions. The probability of no shortage asks whether the shelf is ever caught empty. The fill rate asks whether a failure, when it comes, finds a spare waiting. This lesson separates them and shows the one-row shift that links them.

## The probability of no shortage

With n spares, the shelf is short when more than n orders are outstanding. The probability of no shortage is the chance that n or fewer are outstanding, the Poisson cumulative probability at n. It is the handbook's probability of r or fewer failures, read with orders outstanding in place of failures.

## The fill rate for a spare

A failure takes a spare only if one is on the shelf at that moment. If n spares are held and fewer than n orders are outstanding when the failure comes, a spare is waiting. So the fill rate is the chance that n less one or fewer orders are outstanding: the probability of no shortage one row up. The engine's rule says it in a phrase, verbatim: fill rate P(X <= n - 1), the chance a failure finds a spare.

| spares | probability of no shortage | fill rate |
| --- | --- | --- |
| 0 | 0.439588 | 0.000000 |
| 1 | 0.800893 | 0.439588 |
| 2 | 0.949374 | 0.800893 |
| 3 | 0.990054 | 0.949374 |
| 4 | 0.998413 | 0.990054 |

On the ESP motor with 4 spares the probability of no shortage is 0.998413 and the fill rate is 0.990054. With no spares the fill rate is 0.000000: every failure waits.

## Two measures, named

The Professional tier drew the same line for normal and Poisson stock: a cycle service level counts the cycles with any shortage, a fill rate counts the demand met from stock. Here the fill rate of a spare is a chance per failure, and the probability of no shortage is a chance per moment of time. A figure quoted from this table names which of the two it is, as every service measure in this course does.

## Neither is the target

The engine chooses the cheapest stock; it does not aim at either probability. A planner who wants a stated fill rate reads down the column to the first row that meets it and compares that row's total cost with the cheapest. The difference is the price of the target, and it is a decision for the stock policy.

## Searching nothing

A search limit of 0 is accepted. The table then has one row, and the engine prices only the empty shelf, verbatim:

> 0 spares: holding 0 a year against expected downtime 5400000, total 5400000, the lowest for 0 to 0

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". For each row from 1 to 6, check that the fill rate equals the probability of no shortage in the row above. Find the first row whose fill rate reaches 0.99 and name its total cost. Then set "Search limit, the most spares (stated)" to 0, predict the reason before you read it, and compare it with the quotation above. Restore 6.
