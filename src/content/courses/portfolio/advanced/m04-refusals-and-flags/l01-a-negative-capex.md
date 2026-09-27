# A negative capex

The portfolio engine refuses a project whose capex is below zero, and it names the project in the message. The same door stops a capex that is missing, blank, non-numeric or infinite, and a chance of success that is blank, non-numeric or outside 0 to 1. Only a few inputs are still read quietly.

{{panel:ec-governance-explorer}}

## The refusal, verbatim

Two published cases carry the negative capex refusal. The engine throws a `PortfolioInputError` and returns no set, no frontier and no risk summary.

| published case | engine message |
| --- | --- |
| negativeCapexRefused | Project "B" has a negative capex (-150); capex must be 0 or more |
| negativeCapexUnnamed | Project "1" has a negative capex (-0.5); capex must be 0 or more |

The second project carries no name, and the message still identifies it by its position counted from 0, as "1", the second project in the list. The size of the error does not matter: -0.5 is refused as firmly as -150. The optimizer checks every project in list order, capex before pos, before it computes anything, and reports the first failure.

## Why capex is refused

The optimizer is a 0/1 knapsack. It funds each project whole and keeps total capex within the limit. A negative capex would add budget when funded, and the limit would stop meaning a limit.

There is no safe substitute either. Typing 0 makes the entry a free project, and a free project with a positive EMV weighs nothing and is always funded: in the published freeProjectTightLimit case a free project with EMV 10.0000 rides beside project A at capex 100.0000, and the engine funds free + A at 100.0000 for 70.0000. Whatever the negative number was meant to carry, such as a receipt, has vanished from the inventory.

## The chance of success, refused the same way

| published case | pos typed | engine message |
| --- | --- | --- |
| posAboveOneRefused | 1.4 | Project "a" has a pos outside 0 to 1 (1.4); pos must be a number from 0 to 1 |
| posBelowZeroRefused | -0.2 | Project "a" has a pos outside 0 to 1 (-0.2); pos must be a number from 0 to 1 |
| nonNumericPosRefused | "n/a" | Project "a" has a pos that is not a number ("n/a"); pos must be a number from 0 to 1 |

## What is still read quietly

| published case | input | risked EMV |
| --- | --- | --- |
| nullPosIsDefault | pos null | 80.0000 |
| negativeFailCostIsZero | fail_cost -30 at pos 0.5 | 40.0000 |
| missingNpvIsZero | no npv_p50 | -6.0000 |

A missing or null pos is the documented default of 1, so a project with npv_p50 80 and fail_cost 30 is worth the whole 80.0000. A fail_cost of -30 is read as 0, so at pos 0.5 the EMV is 0.5 x 80 = 40.0000. A project with pos 0.25, fail_cost 8 and no NPV is worth only its risked failure cost, -6.0000. None of the three raises an error.

## The mistake

The mistake is reading silence as validation. A pos left out returns the full success value and funds the project as a certainty, and nothing on the result says a default was used. The defaults have to be caught by reading the inventory.

The second mistake is the workaround. A reader who changes -150 to 0 to get past the error has made a free project, funded whenever its EMV is positive, and whatever the negative number was meant to carry has vanished. It belongs in the project's NPV.

## Exercise

Quote both negative capex messages exactly and say what the engine returns when either fires. Then quote the messages for a pos of 1.4 and of -0.2, give the risked EMV of the accepted fail_cost -30 case, and explain why typing 0 in place of a negative capex is not a safe workaround.
