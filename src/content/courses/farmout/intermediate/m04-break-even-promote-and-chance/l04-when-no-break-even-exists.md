# When no break-even exists

{{panel:farmout-deal-calculator}}

A break-even is a crossing of 0, and some EMVs never cross. The engine then returns a status and a reason in place of a figure. That is a result, and no refusal: the call succeeds and says why there is no number. This lesson reads each status the engine reports.

## No break-even promote

The break-even promote is searched between the farminee's earned interest (no promote) and the farmor's whole interest. Two things can leave no crossing in that range.

| status | what it means |
| --- | --- |
| negative-without-promote | paying only its own share, the farminee's EMV is already below 0 |
| positive-at-farmor-share | paying the farmor's whole share, the farminee's EMV is still above 0 |

The engine's reasons on the two small cases the course states:

> break-even promote: none; paying only its 40% share (no promote) N's EMV is -320000, below 0

> break-even promote: none up to the farmor's whole 100% share; paying it, N's EMV is 1280000, above 0

A deal whose EMV is exactly 0 at the farmor's whole share is solved, with a break-even share of 100.000000 percent: the boundary belongs to "solved".

## No break-even chance

A break-even chance exists only when a position's success and dry-hole payoffs have opposite signs. A position whose dry hole is not a loss is "never-negative".

The course's deal on the Penn State EME 801, Lesson 6 figures shows one: the owner after the farm-out pays nothing on a dry hole. The engine's reason:

> YOU after the farm-out: EMV is at or above 0 at every chance of success (the dry hole is not a loss)

On the same figures the engine solves the other positions: the incoming party breaks even paying 98.000000 percent of the well for 93.333333 percent, and at a chance of 35.714286 percent. The page prints neither figure; the engine derives them from its payoffs.

## Reading a status in a report

A report never quotes a missing figure as 0. It quotes the status and the reason, with the terms that produced them. "negative-without-promote" tells the farmor that no promote will interest this farminee on these terms; only a change elsewhere, a bonus, a cap, a chance, can. "positive-at-farmor-share" tells the farminee that even carrying the farmor's whole share leaves it ahead.

## Exercise

Work in the course's own deal calculator.

1. Open the view "The value of the deal to each side" and start from "The Ekene Deep deal, cash flows stated". With the control "Chance of success, percent (stated)", set the chance to 10. Read the break-even status and FIN's break-even chance.
2. Set the chance to 50 and read the break-even status again.
3. Start from **The Penn State figures** and read the three rows of the break-even chance table.
