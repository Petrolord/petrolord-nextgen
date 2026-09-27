# What it refuses

The portfolio engine refuses two kinds of input by name: a capex it cannot read as a finite amount of 0 or more, and a chance of success that is present but is not a number from 0 to 1. Everything else it accepts, defaults or reads as zero, and knowing which is which tells you how far to trust a clean run.

{{panel:ec-capital-explorer}}

## Refusals

A capex that is missing, null, blank, non-numeric, infinite or negative stops the optimizer with a `PortfolioInputError`. So does a `pos` that is typed but blank, non-numeric or outside 0 to 1. Four of the eleven published cases, with the engine's messages verbatim:

| case | message |
| --- | --- |
| negativeCapexRefused | Project "B" has a negative capex (-150); capex must be 0 or more |
| negativeCapexUnnamed | Project "1" has a negative capex (-0.5); capex must be 0 or more |
| blankCapexRefused | Project "Blank" has a blank capex; capex must be 0 or more |
| posOutOfRangeInOptimize | Project "Over" has a pos outside 0 to 1 (1.2); pos must be a number from 0 to 1 |

The message names the project by its name, then its id if it has no name, then its position in the list counted from zero. In the unnamed case the refused project is the second in the list, so "1" is a position. A user reading row numbers from one would look at the wrong row.

Every project is checked in list order, capex before pos, before anything is computed, and the first failure is reported. A project carrying both a bad capex and a bad pos is named for its capex. No partial answer comes back: a project with capex "abc" beside a sound one at a limit of 100 refuses the whole call, and nothing is funded.

## What it reads without a word

A few inputs come back as ordinary numbers. The published cases start from a project with capex 10, `npv_p50` 80 and `fail_cost` 30:

| case | input | risked EMV |
| --- | --- | --- |
| nullPosIsDefault | pos null | 80.0000 |
| negativeFailCostIsZero | fail_cost -30, pos 0.5 | 40.0000 |

A `pos` left out or null is the documented default of 1, certain success. A negative `fail_cost` is read as 0, so the failure branch costs nothing. Neither returns an error or a note.

## What it does, without refusing

A limit under every project is accepted, `limitBelowEveryProject` at 30.0000 funds nothing, capex 0.0000 and EMV 0.0000. A project with a risked EMV of 0 or less is simply never funded, and money may be left unspent. The exact solve never lands over the limit: on the published `gridOvershoot` case it funds A + C for capex 5995.0000 against 6000.0000, with overLimit false and overLimitBy 0.0000.

## The mistake

The mistake is reading a run that returned no error as a run whose inputs were right. A `pos` typed as a percentage is caught: percentTypedAsPosRefused gives Project "Appraisal" has a pos outside 0 to 1 (30); pos must be a number from 0 to 1. A fail cost typed with a minus sign to show it is a loss is not caught. It disappears, and the inventory optimises cleanly around a failure that costs nothing.

## What it never checks

There is no check that `npv_p10` sits above `npv_p90`, no check of units, and no check that a failure costs anything at all. The engine protects the arithmetic of the knapsack; the meaning of each input is left to the person who typed it.

## Exercise

Quote the negative capex message for the unnamed case and say which project in the list it refers to. Then quote the message for a `pos` of 1.4 on a project named "a", give the risked EMV for a `fail_cost` of -30 at `pos` 0.5, and explain which of the two would alert a reviewer.
