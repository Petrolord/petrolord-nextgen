# The best set is not the best projects

Ranking projects by value per million USD of capex and funding down the list feels like optimisation. On a budget of whole projects it is a heuristic, and on OKONO at 450.0000 it leaves value behind.

{{panel:ec-capital-explorer}}

## The ranking

Risked EMV per million USD of capex, derived from each project's row:

| project | capex | risked EMV | risked EMV per million USD (derived) |
| --- | --- | --- | --- |
| OK-1 | 120.0000 | 89.7500 | 0.747917 |
| OK-4 | 240.0000 | 160.0000 | 0.666667 |
| OK-2 | 180.0000 | 115.0000 | 0.638889 |
| OK-5 | 60.0000 | 38.0000 | 0.633333 |
| OK-6 | 310.0000 | 144.0000 | 0.464516 |
| OK-3 | 90.0000 | 41.2500 | 0.458333 |

OK-1 returns 89.7500 on 120.0000, which is 0.747917 per million. The exploration well sits last at 0.458333.

## Filling 450.0000 down the list

Walk the ranking and fund each project that still fits. OK-1 takes 120.0000. OK-4 brings the total to 360.0000. OK-2 would take it to 540.0000, over the limit, so it is skipped. OK-5 brings it to 420.0000. That leaves 30.0000, and neither OK-6 at 310.0000 nor OK-3 at 90.0000 fits. The greedy set is OK-1 + OK-4 + OK-5, capex 420.0000, risked EMV 287.7500.

## What the optimizer funds

The optimizer funds OK-1 + OK-3 + OK-4, capex 450.0000, risked EMV 291.0000. It keeps OK-1 and OK-4 and swaps the workovers for the exploration well. OK-5 brings 38.0000 on 60.0000; OK-3 brings 41.2500 on 90.0000. The well has the worse ratio, but it uses the 30.0000 the list left idle, and the set gains 3.2500.

The greedy set is not a bad set. It is the best set for 420.0000: OKONO's efficient frontier has a point at capex 420.0000 and risked EMV 287.7500. It is simply not the best set for 450.0000.

## Sometimes the list is right

At 600.0000 the same walk funds OK-1, then OK-4 for 360.0000, then OK-2 for 540.0000, then OK-5 for 600.0000. That is OK-1 + OK-2 + OK-4 + OK-5, the optimizer's own set, worth 402.7500. The ranking happens to fill this budget exactly, and nothing in the ranking tells you in advance which budgets it will fill and which it will not. Only solving the set does.

## Why ratios mislead

A ratio assumes money is divisible, so that the best return per million is the best use of every million. Whole projects break that. The last few million of a budget can only be spent on a project that fits, and a low-ratio project that fits the gap can beat a high-ratio project that leaves the gap empty. The knapsack compares whole combinations, which is why it finds 291.0000 where the list stops at 287.7500. Ranking by plain risked EMV fails for the same reason: it favours large projects that may crowd out a pair of smaller ones worth more together. No single ordering of projects can stand in for comparing the sets themselves.

## The mistake

The mistake is presenting a ranked table as the portfolio decision. The table is honest arithmetic, the list at 450.0000 still loses 3.2500 of risked EMV, and a reviewer shown only the ratios would cut the exploration well first. The engine reports the funded set and never the ranking, so a ranked list in a board pack was built by hand beside it.

## Exercise

Walk OKONO's ranking at a limit of 450.0000, writing the running capex after each project that fits and naming each project skipped. Then state the greedy set's capex and risked EMV beside the optimizer's, and explain how a project with the lowest ratio in the inventory ends up in the best set.
