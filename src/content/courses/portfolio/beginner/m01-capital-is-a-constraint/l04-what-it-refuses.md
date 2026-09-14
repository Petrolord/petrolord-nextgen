# What it refuses

The portfolio engine refuses exactly one kind of input: a project with a negative capex. Everything else it accepts, clamps, defaults or flags, and knowing which is which tells you how far to trust a clean run.

{{panel:ec-capital-explorer}}

## The one refusal

A capex below zero stops the optimizer with a `PortfolioInputError`. The two published cases, with the engine's messages verbatim:

| case | message |
| --- | --- |
| negativeCapexRefused | Project "B" has a negative capex (-150); capex must be 0 or more |
| negativeCapexUnnamed | Project "1" has a negative capex (-0.5); capex must be 0 or more |

The message names the project by its name, then its id if it has no name, then its position in the list counted from zero. In the unnamed case the refused project is the second in the list, so "1" is a position. A user reading row numbers from one would look at the wrong row. The check runs before any set is chosen, so no partial answer comes back.

Before EC5-0 a negative capex was accepted without a word. The repaired engine refuses it, because a project that pays you to fund it breaks the idea of a limit.

## What it accepts without a word

Several inputs outside their stated ranges come back as ordinary numbers. The published clamp cases start from a project with capex 10, `npv_p50` 80 and `fail_cost` 30:

| case | input changed | risked EMV |
| --- | --- | --- |
| posAboveOneClamps | pos 1.4 | 80.0000 |
| posBelowZeroClamps | pos -0.2 | -30.0000 |
| negativeFailCostIsZero | fail_cost -30, pos 0.5 | 40.0000 |
| nonNumericPosIsDefault | pos "n/a" | 80.0000 |

A `pos` of 1.4 is read as certain success and "n/a" as the default of 1. A negative `fail_cost` is read as 0, so the failure branch disappears. None of these returns an error, a warning or a note.

## What it does, without refusing

A limit under every project is not refused: `limitBelowEveryProject` at 30.0000 funds nothing, capex 0.0000 and EMV 0.0000. A project with a risked EMV of 0 or less is not refused either. It is simply never funded, and money may be left unspent. A set whose capex lands over the limit on a coarse grid is not refused, only flagged: the published `gridOvershoot` case reports overLimit true and overLimitBy 2.0000.

## The mistake

The mistake is reading a run that returned no error as a run whose inputs were right. The refusal catches a negative capex and nothing else. A `pos` typed as a percentage for a one-in-four well is a number far above 1, and it clamps to certain success. A fail cost typed with a minus sign to show it is a loss disappears. Both inventories optimise cleanly and fund the wrong projects with full confidence.

## What it never checks

There is no check that `npv_p10` sits above `npv_p90`, no check of units, and no check that a failure costs anything at all. An empty inventory, a limit of zero and a project with no NPV all return a number. The engine protects the arithmetic of the knapsack; the meaning of each input is left to the person who typed it.

## Exercise

Quote the negative capex message for the unnamed case and say which project in the list it refers to. Then give the risked EMV the engine returns for `pos` 1.4 and for a `fail_cost` of -30 at `pos` 0.5, and explain why neither result would alert a reviewer.
