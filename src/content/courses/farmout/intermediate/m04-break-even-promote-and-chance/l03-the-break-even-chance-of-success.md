# The break-even chance of success

{{panel:farmout-deal-calculator}}

The break-even promote holds the chance fixed and solves for a share. The break-even chance of success holds every deal term fixed and solves for the chance at which a named position's EMV is 0. The engine returns one for each of three positions: the farmor drilling alone, the farmor after the farm-out, and the farminee. A break-even is always of a named term and a named position, and this lesson reads all three on the Ekene Deep deal.

## The rule

The engine states it in its basis:

> EMV is linear in the chance of success: p* = -dry / (success - dry) when success and dry hole have opposite signs; with both at or above 0 the EMV is never negative, with both at or below 0 never positive

Each position has one success payoff and one dry-hole payoff. When one is a gain and the other a loss, there is exactly one chance at which they balance, and the formula gives it without a search.

## The Ekene Deep break-even chances

| position | break-even chance of success |
| --- | --- |
| EKO drills alone | 15.080094 |
| EKO after the farm-out | 6.377457 |
| FIN farms in | 27.281304 |

The engine's reasons:

> EKO alone: EMV is 0 at a chance of success of 15.080094%

> EKO after the farm-out: EMV is 0 at a chance of success of 6.377457%

> FIN: EMV is 0 at a chance of success of 27.281304%

The stated chance is 25.000000 percent. The farm-out lowers the chance EKO needs, from 15.080094 to 6.377457 percent, because FIN pays part of EKO's share of the well and the cash arrives in both outcomes. The deal asks FIN for a chance of 27.281304 percent, above the one stated, which is another way of saying FIN declines.

## The same prospect without the cash

The course states the Ekene Deep deal with no cash bonus and no reimbursement:

| position | break-even chance of success |
| --- | --- |
| EKO drills alone | 15.080094 |
| EKO after the farm-out | 7.887314 |
| FIN farms in | 24.755257 |

EKO drilling alone is untouched: no deal term enters that position. EKO after the farm-out needs more chance without the cash, and FIN needs less. FIN's break-even chance of 24.755257 percent now sits below the stated 25.000000, so FIN farms in, the same answer the break-even promote gave on these terms.

## What each break-even tells a side

A break-even chance is a figure of the payoffs it was solved on: the deal terms, the well costs, the success-case value and its rate and base year. A report quotes it with its position and those terms. It is no forecast of the chance itself: it says how far the stated chance could fall before that position's EMV drops below 0.

## Exercise

Work in the course's own deal calculator.

1. Open the view "The value of the deal to each side" and start from "The Ekene Deep deal, cash flows stated". Read the three rows of the break-even chance table and their reasons.
2. With the control "Chance of success, percent (stated)", set the chance to 27 and then to 28. Read FIN's best action each time. Read the farmor's best action too, and compare it with EKO's best action at 25.
3. Start from "No bonus and no reimbursement" and check the three break-even chances against the second table.
