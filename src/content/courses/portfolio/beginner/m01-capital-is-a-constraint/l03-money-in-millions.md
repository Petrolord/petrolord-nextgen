# Money in millions

The portfolio engine works in million USD and prints money to four decimals. It carries no unit of its own, so the unit is a convention the person typing the inventory has to keep.

{{panel:ec-capital-explorer}}

## One unit for every amount

Capex, `npv_p50`, `npv_p10`, `npv_p90`, `fail_cost`, the capex limit, risked EMV, `stdDev` and the simulated P90 and P10 are all million USD. OKONO's workovers read like this:

| project | capex | npv_p50 | npv_p10 | npv_p90 | fail_cost | risked EMV |
| --- | --- | --- | --- | --- | --- | --- |
| OK-5 | 60.0000 | 38.0000 | 55.0000 | 22.0000 | 0.0000 | 38.0000 |

A capex of 60.0000 is sixty million USD. The four decimals are a print format and make no claim of precision.

## Probabilities and ratios are not money

The chance of success and every ratio print to six decimals and carry no currency. OK-5's `pos` is 1.000000. Risked EMV per million USD of capex is a ratio of two amounts in the same unit, so the unit cancels: OK-1 returns 89.7500 on 120.0000, which is 0.747917. The same ratio would come out of an inventory typed in USD, which is exactly why the ratio cannot catch a unit mistake.

## Where the unit changes the answer

The unit does not change which set is funded. The knapsack is solved exactly on the capex figures as typed, read at their decimal precision, so OKONO at 450.0000 reports solveMethod "exact" and optimalityGap 0.0000. A grid of 2000 cells, with every capex rounded up to whole cells, appears only as a stated fallback when the exact solve would hold more than exactStateLimit partial portfolios, 200000 by default, which a sixteen-project inventory never reaches.

The published rawDollars case types a classic four-project inventory in USD, with a limit of 450000000.0000. The engine funds A + B + D for 250.0000, solveMethod "exact", the same set the million USD version funds. Consistent scaling is harmless; the danger lies elsewhere.

## The mistake

The quiet mistake is a mixed inventory. The engine adds whatever it is given, so a capex typed in USD beside an NPV typed in million USD produces a risked EMV and a funded set with no error at all. A project whose capex looks a million times too large simply never fits, and a project whose NPV looks a million times too large wins every budget.

The second mistake is a P-label in the wrong place. The engine's P90 is a portfolio NPV outcome under the exceedance convention: for OKONO's 450.0000 set it is -18.3574, the low case. A capex of 120.0000 or a limit of 450.0000 is an amount you choose or estimate, and never takes a P-label.

## What the engine refuses to check

It holds no currency field, no unit field and no scale check. The Suite labels its columns in million USD, and that label is the only guard.

## Exercise

For OK-5, list every field that is money and every field that is a probability, with the precision each prints to. Then give the solveMethod and optimalityGap OKONO reports at a limit of 450.0000, and say what typing every amount in USD would change in the funded set, using the rawDollars case.
