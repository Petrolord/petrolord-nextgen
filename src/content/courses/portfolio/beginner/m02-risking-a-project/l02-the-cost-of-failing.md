# The cost of failing

A project that fails does not merely return nothing: a dry hole or an abandoned tie-back loses money. The engine carries that loss as `fail_cost`, a positive amount in million USD weighted by the chance of failure.

{{panel:ec-capital-explorer}}

## OKONO's failure branch

| project | name | capex | pos | fail_cost | risked EMV |
| --- | --- | --- | --- | --- | --- |
| OK-1 | Infill drilling | 120.0000 | 0.950000 | 10.0000 | 89.7500 |
| OK-2 | Gas compression | 180.0000 | 0.900000 | 20.0000 | 115.0000 |
| OK-3 | Exploration well | 90.0000 | 0.250000 | 85.0000 | 41.2500 |
| OK-4 | Waterflood | 240.0000 | 0.800000 | 40.0000 | 160.0000 |
| OK-5 | Workovers | 60.0000 | 1.000000 | 0.0000 | 38.0000 |
| OK-6 | Satellite tie-back | 310.0000 | 0.550000 | 120.0000 | 144.0000 |

The fail cost enters the risked EMV with a minus sign, multiplied by 1 - pos. For OK-6, 0.550000 x 360.0000 - (1 - 0.550000) x 120.0000 = 144.0000. For OK-3, 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500. OK-5 cannot fail, so its fail cost of 0.0000 is weighted by nothing and its risked EMV is its `npv_p50` of 38.0000.

## A fail cost is typed, never inferred

The engine does not link `fail_cost` to capex. OK-3 costs 90.0000 to fund and loses 85.0000 if it fails; those are two separate entries, and the second is a judgement about what is lost once the well is dry. A missing `fail_cost` defaults to 0. The published case `missingNpvIsZero` enters no `npv_p50`, a `fail_cost` of 8 and a `pos` of 0.25, so the risked EMV is 0.25 x 0 - (1 - 0.25) x 8 = -6.0000. Every unit of that value is the failure branch.

## A loss is entered as a positive number

`fail_cost` must be 0 or more, and the engine reads anything below zero as 0. The published case `negativeFailCostIsZero` sets `pos` 0.5, `npv_p50` 80 and `fail_cost` -30, and the risked EMV is 40.0000, exactly the success branch alone, 0.5 x 80. There is no refusal and no warning.

## What failure does to the spread

Failure widens a project's range far more than its success spread suggests. OK-3's success spread, from its entered percentiles, is 191.1747; its mixture standard deviation, which counts the drop from a success to a loss of 85.0000, is 238.6507. OK-5, which cannot fail, reads 12.8750 on both. In the Monte Carlo risk summary a failed project contributes exactly minus its fail cost to the portfolio total, so the fail costs set the floor of every simulated outcome.

## The mistake

The natural mistake is typing OK-3's loss of 85.0000 with a minus sign in front, because a loss feels negative. The engine reads it as 0, the failure branch vanishes, and the well is valued as if a dry hole were free. Its risked EMV would then be the success branch alone, and a project worth 41.2500 would compete for budget as something far larger. The second mistake is leaving the field blank, which does the same thing through the default. Neither raises an error, and the engine keeps no record of the value that was typed before the clamp, so a review of its output alone cannot find either.

## Exercise

Write OK-4's risked EMV by hand and name the part that comes from failure. Then give the engine's risked EMV for the `negativeFailCostIsZero` case and for `missingNpvIsZero`, and explain why OK-3's mixture standard deviation of 238.6507 is larger than its success spread of 191.1747.
