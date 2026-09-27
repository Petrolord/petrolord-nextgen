# A free project weighs nothing

A project with a capex of 0.0000 costs nothing, and on the exact solve it weighs nothing. If its risked EMV is positive it is funded at every limit, even a limit of 0.0000. Three published cases show it.

{{panel:ec-capital-explorer}}

## The three cases

| case | limit | projects | engine set | capex | EMV | unspent | solveMethod |
| --- | --- | --- | --- | --- | --- | --- | --- |
| freeProjectZeroLimit | 0.0000 | free | free | 0.0000 | 10.0000 | 0.0000 | exact |
| freeProjectTightLimit | 100.0000 | free, A | free + A | 100.0000 | 70.0000 | 0.0000 | exact |
| freeProjectSlack | 101.0000 | free, A | free + A | 100.0000 | 70.0000 | 1.0000 | exact |

The free project has capex 0.0000 and risked EMV 10.0000. A has capex 100.0000 and risked EMV 60.0000. Each result reports optimalityGap 0.0000 and resolution null, and each engine set is the golden exact optimum.

## Reading each case

At a limit of 0.0000 nothing with a cost can be funded, but the free project costs nothing, so the engine funds it and reports 10.0000.

At 100.0000 the limit is spent exactly on A. The free project rides along, 60.0000 plus 10.0000, which is 70.0000, and the total capex is still 100.0000.

At 101.0000 the answer is the same set, with 1.0000 of the limit left unspent because no other project exists to use it.

## Why it matters

Free projects are common in a real inventory: a study paid from another budget, a work-over already contracted, an option whose cost is sunk. Entered with capex 0.0000 and a positive EMV, each is funded automatically and adds its value to every budget. The efficient frontier starts where their value sits: at capex 0.0000, the frontier's first point carries the free projects' EMV.

## Only positive value is funded

The rule that keeps a project out still applies. A free project with a risked EMV of 0 or less is never funded, however little it costs. Zero capex makes a project weightless; it does not make it worth having.

## The mistake

The mistake is to hide a real cost behind a capex of 0.0000. A project whose money comes from the same budget but is typed as free is funded without competing for the limit, and every set looks better by its value. The engine cannot tell a truly free project from a mistyped one.

The second mistake is the reverse: expecting a positive-EMV free project to be left out when the budget is tight. On OKONO at 450.0000, where OK-1, OK-3 and OK-4 use the whole limit, a free project with positive EMV would still be funded beside them.

## What it refuses

The engine refuses a capex it cannot read, including a blank one, so a free project must carry an explicit 0. It does not question why the cost is zero.

## Exercise

For each of the three cases, give the engine's set, its capex, its EMV and the unspent limit. Then explain why the free project is funded at a limit of 0.0000, and what happens to a free project whose risked EMV is negative.
