# All or nothing funding

The portfolio optimizer funds each project in full or leaves it out entirely. That single rule, a 0/1 knapsack, is why a budget is filled by combinations and why money can be left over that no project can use.

{{panel:ec-capital-explorer}}

## Whole projects under a limit

OKONO's optimizer runs at five limits, every amount in million USD:

| capex limit | funded set | total capex | total risked EMV | unspent |
| --- | --- | --- | --- | --- |
| 300.0000 | OK-1 + OK-2 | 300.0000 | 204.7500 | 0.0000 (derived) |
| 450.0000 | OK-1 + OK-3 + OK-4 | 450.0000 | 291.0000 | 0.0000 (derived) |
| 600.0000 | OK-1 + OK-2 + OK-4 + OK-5 | 600.0000 | 402.7500 | 0.0000 (derived) |
| 750.0000 | OK-1 + OK-2 + OK-3 + OK-4 + OK-5 | 690.0000 | 444.0000 | 60.0000 (derived) |
| 1000.0000 | OK-1 + OK-2 + OK-3 + OK-4 + OK-5 + OK-6 | 1000.0000 | 588.0000 | 0.0000 (derived) |

Each funded capex is a sum of whole capex figures. At 450.0000 the set is 120.0000 + 90.0000 + 240.0000 = 450.0000, an exact fit. The published `exactFit` case does the same at a limit of 500.0000, funding B + C for capex 500.0000 and a risked EMV of 300.0000.

## What whole funding costs

At 750.0000 the optimizer funds five projects for 690.0000 and leaves 60.0000 unspent. OK-6 alone costs 310.0000, so it cannot come in, and the engine has no way to fund part of it. A model that allowed fractions would pour the remaining money into a slice of the tie-back and report a higher total. A slice of a tie-back delivers no share of its NPV, which is exactly the reason for funding whole.

The published case `limitBelowEveryProject` shows the extreme: a limit of 30.0000 sits under every project, so the engine funds nothing and reports capex 0.0000 and a risked EMV of 0.0000.

## Why the set changes shape

Because projects come whole, a larger limit can reorganise the set instead of adding to it. At 450.0000 OK-3 is in and OK-2 is out; at 600.0000 OK-2 is in and OK-3 is out. Raising the limit from 450.0000 to 600.0000 did not buy one more project on top of the smaller set. It bought a different combination, OK-1 + OK-2 + OK-4 + OK-5, worth 402.7500.

## What all or nothing refuses

The optimizer funds no fraction, phases no capex over years and holds no minimum or maximum count of projects. It cannot be told that two projects must go together or that one excludes another. It has one constraint, the capex limit, applied on its grid, and one objective, the summed risked EMV. Anything else a real capital committee weighs, from rig availability to a partner's approval, has to be settled before the inventory is typed in.

## The mistake

The mistake is solving the problem as if projects were divisible: sort them, fund the best ones and spend the leftover on part of the next. That answer spends every million and looks efficient on a chart, and it describes a portfolio that cannot be built. The opposite slip is expecting the optimizer's set at a larger budget to contain its set at a smaller one, then approving OK-3 at 450.0000 and assuming it survives the move to 600.0000.

## Exercise

State OKONO's funded set and total capex at 750.0000, the amount left unspent, and why OK-6 cannot absorb it. Then write the capex sum that makes the 450.0000 set an exact fit, and name the project that leaves the set when the limit rises to 600.0000.
