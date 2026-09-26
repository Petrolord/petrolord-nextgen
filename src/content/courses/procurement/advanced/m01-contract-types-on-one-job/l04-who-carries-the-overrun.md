# Who carries the overrun

{{panel:pr-contract-calculator}}

Every job has a planned cost, and most jobs miss it. The question a contract answers is who pays when they do. The engine measures that directly: it counts the iterations in which the job overruns its plan, and splits each overrun between the company and the contractor under each contract type. The answer is the clearest way to see what the choice of contract really buys.

## What counts as an overrun

The engine's convention is stated in its basis, verbatim:

> an iteration overruns when its contractor cost exceeds the planned cost; companyPays + contractorAbsorbs = expectedOverrun, each a mean over all iterations with 0 where there is no overrun

The planned cost is the contractor cost at the modes, 722350.416667. A contractor cost equal to the plan is no overrun; only a cost above it counts. On seed 20270211 with 20000 iterations, 0.902400 of the iterations overrun, and the expected overrun, the mean over all iterations with 0 where there is none, is 107001.253374.

## The split, contract by contract

For each iteration that overruns, the engine sets what the company pays above its planned payment against what the contractor absorbs out of its planned margin. Averaged over every iteration, on the same seed and iteration count:

| contract type | company pays | contractor absorbs | company share |
| --- | --- | --- | --- |
| lump sum | 0.000000 | 107001.253374 | 0.000000 |
| day rate | 71671.875955 | 35329.377418 | 0.669823 |
| reimbursable, cost plus 12 percent | 119841.403778 | -12840.150405 | 1.120000 |

Each row adds to the same expected overrun, 107001.253374. The contract does not change how much the job overruns. It changes who pays for it.

## Reading each row

**The lump sum.** The company pays its 900000.000000 in every outcome, so it pays nothing above plan and the contractor absorbs the whole overrun. The company has bought certainty, and the price of it sits inside the lump sum.

**The day rate.** The company pays for every extra day at the agreed rate, so it carries the duration risk. The contractor carries the rest: a daily cost above its planned 42000.000000, and the gap between its own daily cost and the day rate on the extra days. The company's share, 0.669823, sits between none and all.

**Cost plus 12 percent.** The company pays the whole overrun and the fee on top of it, so its share is 1.120000. The contractor's part is negative, -12840.150405: when the job overruns, the contractor earns more. That is the known weakness of a percentage fee: it rewards cost, so a company that uses one needs other controls on cost.

## Why the plan matters here

Every figure in this lesson is measured against the plan, and the plan is the modes unless the call states another. A company that plans on a longer job sees fewer overruns and a different split. That is a choice, and the evaluation report names it.

## Exercise

Open the contract calculator on the view "Contract types on one job", set `iterations` to 20000 on seed 20270211, and read the tiles "Probability of an overrun" and "Expected overrun" and the columns "company pays" and "contractor absorbs". Add each row's two figures and check that every row gives the expected overrun. Then replace `feeFraction` in `reimbursable` with a `fixedFee` of 86682.050000, the planned margin of the percentage fee, and read the reimbursable row again. Compare what the company pays with the expected overrun, and say in one sentence why the contractor's part is no longer negative.
