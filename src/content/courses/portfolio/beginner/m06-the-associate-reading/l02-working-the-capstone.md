# Working the capstone

A graded portfolio question hands you an inventory and a limit and asks what to fund and what it is worth. The method is to risk every row by hand, check the grid, solve and prove the set, beat the obvious alternatives, re-solve each budget from scratch, and only then read the risk.

{{panel:ec-capital-explorer}}

## Step one: risk every row before solving

Write capex, pos, npv_p50 and fail_cost for each project, and compute risked EMV yourself. On OKONO, OK-3 is 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500. Then compare each hand value with the explorer's risked EMV column. A mismatch means an input was typed wrong, or a clamp fired: a pos over 1 is read as 1, a pos under 0 as 0, and a negative fail_cost as 0. Strike out any project at 0.0000 or less, because it can never be funded. On OKONO all six are positive.

## Step two: read the grid first

Before trusting any set, read the resolution. OKONO's capexes and limits are all whole numbers under 5000, so the resolution is 1.0000 and nothing is rounded. If the resolution is anything else, three checks follow: sum the funded capex in money against the limit, whatever overLimit says; look for a left-out project that would still fit; and look for a positive-EMV project with capex 0.0000 that was not funded.

## Step three: solve and prove the set

| limit | funded set | total capex | total risked EMV | unspent |
| --- | --- | --- | --- | --- |
| 450.0000 | OK-1 + OK-3 + OK-4 | 450.0000 | 291.0000 | 0.0000 |
| 600.0000 | OK-1 + OK-2 + OK-4 + OK-5 | 600.0000 | 402.7500 | 0.0000 |

Prove the 450.0000 row from the inventory: 120.0000 plus 90.0000 plus 240.0000 is 450.0000, and 89.7500 plus 41.2500 plus 160.0000 is 291.0000. Confirm the frontier's last point reads the same capex and value.

## Step four: beat the obvious answers

Write the greedy set and show why it loses. Ranked by EMV per million USD it funds OK-1, OK-4 and OK-5 at 420.0000 for 287.7500. Swapping OK-5 for OK-3 adds 3.2500 for 30.0000 of capex and reaches 291.0000. That comparison is the evidence the set was solved and not ranked.

## Step five: a second budget is a new problem

Solve every budget afresh. Adding OK-5 to the 450.0000 set gives 329.0000 at 510.0000, and nothing else fits the 600.0000 limit, while the solved set reaches 402.7500. Cutting OK-2 from the 600.0000 set gives 287.7500, short of 291.0000.

## Step six: risk with its seed

Quote the risk summary with its method. On OKONO, by the seeded Monte Carlo at seed 20260829 and 10000 iterations, the 450.0000 set shows P(loss) 0.123600 and P90 -18.3574, the low case of portfolio NPV. The P-label belongs to that NPV outcome alone; a capex, a limit or a probability never carries one.

## The mistake

The costly mistake is quoting success-case NPV. The 450.0000 set sums to 725.0000 of it and is worth 291.0000 risked. The second is quoting the steepest frontier step as the answer.

## What the method refuses

It funds projects whole, uses one average correlation and assumes a normal success spread. It proves the arithmetic and cannot prove that a pos or a fail_cost was right.

## Exercise

Work OKONO at 450.0000 through all six steps: risk OK-3 by hand, state the resolution, prove the funded capex and EMV, show the greedy set and the swap that beats it, and quote P(loss) and P90 with the seed and iterations.
