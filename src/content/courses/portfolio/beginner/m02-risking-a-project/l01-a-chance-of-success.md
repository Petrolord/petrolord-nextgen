# A chance of success

A chance of success, `pos`, is the probability that a project delivers its success case. It runs from 0 to 1, defaults to 1, and decides how much of the success-case NPV the engine is willing to count.

{{panel:ec-capital-explorer}}

## OKONO from sure to speculative

OKONO's six projects span the whole range:

| project | name | pos | npv_p50 | fail_cost | risked EMV |
| --- | --- | --- | --- | --- | --- |
| OK-5 | Workovers | 1.000000 | 38.0000 | 0.0000 | 38.0000 |
| OK-1 | Infill drilling | 0.950000 | 95.0000 | 10.0000 | 89.7500 |
| OK-2 | Gas compression | 0.900000 | 130.0000 | 20.0000 | 115.0000 |
| OK-4 | Waterflood | 0.800000 | 210.0000 | 40.0000 | 160.0000 |
| OK-6 | Satellite tie-back | 0.550000 | 360.0000 | 120.0000 | 144.0000 |
| OK-3 | Exploration well | 0.250000 | 420.0000 | 85.0000 | 41.2500 |

The workovers are certain, so their risked EMV equals their success-case NPV of 38.0000. Moving down the table, the success case gets larger and the chance of reaching it gets smaller. The exploration well has the largest `npv_p50` in the inventory and the second smallest risked EMV.

## Two branches, one weight each

`pos` weights the success branch and 1 - pos weights the failure branch:

Risked EMV = pos x npv_p50 - (1 - pos) x fail_cost.

For OK-4, 0.800000 x 210.0000 - (1 - 0.800000) x 40.0000 = 160.0000. For OK-3, 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500. The published case `risked` shows the same line on round inputs: 0.3 x 300 - (1 - 0.3) x 50 = 55.0000.

At the ends the formula collapses to one branch. The published case `unrisked` enters no `pos` and no `fail_cost`, so `pos` defaults to 1 and the risked EMV is the `npv_p50` of 250, printed 250.0000. The case `posZero` sets `pos` to 0 on a project with `npv_p50` 80 and `fail_cost` 30, and the risked EMV is -30.0000: a certain failure is worth minus its fail cost.

## Inside the simulation

The same `pos` drives the risk summary. In each Monte Carlo iteration a project succeeds when a drawn normal driver, passed through the normal CDF, falls under its `pos`. A project at 0.250000 succeeds in roughly one iteration in four and, in the rest, contributes minus its fail cost to the portfolio total.

## The mistake

The expensive mistake is risking twice. If the `npv_p50` typed in is already a risked value, a chance of success typed beside it discounts it again. OK-3's 420.0000 is a success case; entering 41.2500 there with `pos` 0.250000 would shrink the well to a fraction of its real risked value and keep it out of every budget.

The opposite mistake is leaving `pos` blank on a risky project. The default is 1, so a blank exploration well is counted as if it cannot fail.

## What the engine will not tell you

It does not ask where `pos` came from, whether it is a geological chance, a commercial chance or both, or whether two projects share it. It holds one number per project and never checks it against the size of the success case.

## Exercise

Write the risked EMV of OK-2 and OK-6 by hand from their rows. Then give the risked EMV the engine returns when `pos` is 0 on the `posZero` project, and explain what happens to OK-3 in the optimizer if its `npv_p50` is typed as an already risked value.
