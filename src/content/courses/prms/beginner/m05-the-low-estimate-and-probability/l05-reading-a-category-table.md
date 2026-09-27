# Reading a category table

{{panel:prms-classification-calculator}}

A category table is where most readers meet a resources estimate: a class, three figures and their labels. Read carelessly, it invites the mistakes of this module, such as a P90 put at the top, a slice read as a total, or a 2C added to a 2P. This lesson gives a fixed order for reading any category table, and checks it against the tables the calculator prints.

## What a complete table names

| item | where the calculator shows it | Ekene Main Reserves |
| --- | --- | --- |
| the class | the Class tile | reserves |
| the unit | the Unit tile | MMbbl |
| the method | the Method tile | cumulative |
| the three labels | the label column | 1P, 2P, 3P |
| the probability label beside each | the probability label column | P90, P50, P10 |
| the increments, where the class has them | the increments table | 8.890000, 7.760000, 8.340000 |
| a single value, if the range is closed | the tile "One value for the range" | false |

The engine's cumulative rows carry exactly four fields: the case, the label, the probability label and the value. The increments table carries the slice label and its value.

## A reading order

**First, the class.** It tells you which labels to expect: P for Reserves, C for Contingent Resources, U for Prospective Resources. A class you did not expect means the table is about a different project.

**Second, the unit.** MMbbl, MMboe and trillion cubic feet cannot be compared without a conversion, and the unit is always a stated input. The engine refuses an empty unit.

**Third, the method.** It tells you which figures were stated and which the engine derived. With the cumulative method, the 1P, 2P and 3P are yours and the slices are the engine's; with the incremental method, the other way round.

**Fourth, the labels and probabilities.** Check that the smallest figure carries P90 and the largest P10. If not, something is wrong with the table.

**Fifth, the increments.** Check that each slice is the difference of two cumulative figures. For Prospective Resources expect none.

**Last, the reasons.** They say the same thing in words, with the PRMS section beside each line. If a reason and a table cell ever seem to disagree, remember the reason drops trailing zeros, and take the figure from the table at six decimals.

## The same order on another class

On the case "Prospective Resources" the class reads prospective, the method cumulative, the labels 1U, 2U and 3U with the figures 12.000000, 30.000000 and 70.000000, and there is no increments table. In its place the engine gives a reason line:

> incremental: no terms are defined for Prospective Resources (PRMS 2.2.2.4)

## What a table does not say

A category table does not tell you how likely the project is to go ahead. That is the class and the chance of commerciality, which live in the other view of the calculator. A 2U of 30.000000 is the best estimate if the prospect succeeds. A complete report prints the category table next to the classification of the same project, so both questions of the first lesson are answered side by side.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The categories of a set of estimates". Start from "Ekene North, stated incrementally" and read the result in the order above, writing one line for each step. Then do the same for "Prospective Resources". For each case, name the figures you stated and the ones the engine derived.
