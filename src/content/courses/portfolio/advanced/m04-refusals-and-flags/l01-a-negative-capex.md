# A negative capex

The portfolio engine refuses a project whose capex is below zero, and it names the project in the message. Almost every other odd input is clamped or defaulted instead, and comes back as a number with no warning.

{{panel:ec-governance-explorer}}

## The refusal, verbatim

Two published cases carry the refusal. The engine throws a `PortfolioInputError` and returns no set, no frontier and no risk summary.

| published case | engine message |
| --- | --- |
| negativeCapexRefused | Project "B" has a negative capex (-150); capex must be 0 or more |
| negativeCapexUnnamed | Project "1" has a negative capex (-0.5); capex must be 0 or more |

The second project carries no name, and the message still identifies it, as "1". The size of the error does not matter: -0.5 is refused as firmly as -150. The refusal arrived in EC5-0.

## Why capex is refused

The optimizer is a 0/1 knapsack. It funds each project whole and keeps total capex within the limit. A negative capex would add budget when funded, and the limit would stop meaning a limit.

There is no safe clamp either. Clamping to 0 makes the entry a free project, and a free project is still charged one cell on the grid (finding D2). In the published freeProjectTightLimit case, a free project with EMV 10.0000 sits beside project A at capex 100.0000 under a limit of 100.0000. The engine funds A alone for 60.0000, where the exact optimum is 70.0000.

## What is clamped instead

| published case | input | risked EMV |
| --- | --- | --- |
| posAboveOneClamps | pos 1.4 | 80.0000 |
| posBelowZeroClamps | pos -0.2 | -30.0000 |
| negativeFailCostIsZero | fail_cost -30 at pos 0.5 | 40.0000 |
| nonNumericPosIsDefault | pos "n/a" | 80.0000 |
| missingNpvIsZero | no npv_p50 | -6.0000 |

The first four projects carry an npv_p50 of 80 and a fail_cost of 30. A pos of 1.4 is read as 1, so the EMV is the whole 80.0000. A pos of -0.2 is read as 0, and the project is worth minus its failure cost, -30.0000. A fail_cost of -30 is read as 0, so at pos 0.5 the EMV is 0.5 x 80 = 40.0000. A pos of "n/a" takes the default of 1. The last project has pos 0.25, fail_cost 8 and no NPV, so it is worth only its risked failure cost, -6.0000. None of the five raises an error.

## The mistake

The mistake is reading silence as validation. A pos typed as 1.4 returns 80.0000 and funds the project as a certainty, and nothing on the result says the input was changed. The clamps have to be caught by reading the inventory.

The second mistake is the repair. A reader who changes -150 to 0 to get past the error has made a free project that the grid charges a cell. Whatever the negative number was meant to carry, such as a receipt, has also vanished, and it belongs in the project's NPV.

## Exercise

Quote both refusal messages exactly and say what the engine returns when either fires. Then give the risked EMV of the pos 1.4 case and the pos -0.2 case, say why neither is refused, and explain why typing 0 in place of a negative capex is not a safe repair.
