# Increments of reserves

{{panel:prms-reserves-calculator}}

At Associate you read a category table in two forms. This module works the arithmetic between them. A set of Reserves estimates can be stated cumulatively, as 1P, 2P and 3P, each including the one before; or incrementally, as the slices Proved (P1), Probable (P2) and Possible (P3). PRMS 2.2.1.4 and 2.2.2.1 treat the two as the same information, and the engine takes either and returns both.

## The words first

The course's vocabulary is strict here. "Proved" alone means the cumulative 1P, the low estimate of Reserves. The increment is always written "Proved (P1)". The same pattern holds for probable (2P, and the increment Probable (P2)) and possible (3P, and Possible (P3)). A sentence that says "the probable reserves" without saying which form is ambiguous, and a report should never leave a reader to guess.

## From cumulative to increments

The rule is subtraction, category by category: P1 is 1P, P2 is 2P less 1P, and P3 is 3P less 2P. On the Ekene Main Reserves, stated cumulatively in MMbbl (golden input cat-reserves-cumulative):

| label | probability label | value (engine) |
| --- | --- | --- |
| 1P | P90 | 8.890000 |
| 2P | P50 | 16.650000 |
| 3P | P10 | 24.990000 |

| increment | value (engine) |
| --- | --- |
| Proved (P1) | 8.890000 |
| Probable (P2) | 7.760000 |
| Possible (P3) | 8.340000 |

The engine's incremental line, verbatim:

> incremental: Proved (P1) 8.89, Probable (P2) 7.76, Possible (P3) 8.34 MMbbl; 1P = P1, 2P = P1 + P2, 3P = P1 + P2 + P3

The reason prints the figures short; the fields carry them in full, and the course quotes the fields: a Probable (P2) of 7.760000 and a Possible (P3) of 8.340000.

## What an increment carries

An increment is a difference of two estimates. It carries no probability label of its own: the P90 label belongs to the low estimate, 1P, and there is no sense in which the Probable (P2) slice has a 50 percent chance. The engine prints the probability labels only beside the cumulative rows.

Increments are useful because they add up. A company that books a Possible (P3) this year and moves part of it into Probable (P2) next year can show the move slice by slice, and the cumulative categories follow.

## Contingent Resources have increments too

Contingent Resources carry the increments C1, C2 and C3 beside 1C, 2C and 3C, and the same subtraction applies. Prospective Resources carry none (PRMS 2.2.2.4), and a later lesson in this module shows the refusal.

## Exercise

Work in the reserves calculator, in the view "Incremental and cumulative categories".

1. Start from "Ekene Main Reserves, stated cumulatively". Read the cumulative table with its probability labels and the increment table.
2. Check each increment by subtraction from the cumulative rows, and write the three subtractions down.
3. Raise "high estimate (stated)" to a figure of your own above 24.99, and read which increment moves and which stay.
4. Start from "Ekene North, stated incrementally". Read C1, C2 and C3, and write the 2C as a sum of increments.
