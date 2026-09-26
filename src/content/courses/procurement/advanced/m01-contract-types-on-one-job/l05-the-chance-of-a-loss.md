# The contractor margin and the chance of a loss

{{panel:pr-contract-calculator}}

A contract that moves risk onto the contractor has to pay the contractor to carry it, or the contractor will not sign it or will not survive it. The engine shows that trade from the contractor's side: its margin under each contract type, and the chance the margin turns into a loss.

## The margin, planned and expected

The contractor margin in an iteration is what the company pays less what the job costs the contractor. On the plan, and as a mean over 20000 iterations on seed 20270211, the engine returns:

| contract type | planned margin | mean margin | probability of a loss |
| --- | --- | --- | --- |
| lump sum | 177649.583333 | 72829.417364 | 0.199500 |
| day rate | 130923.888889 | 96692.250085 | 0.059900 |
| reimbursable, cost plus 12 percent | 86682.050000 | 99260.469916 | 0.000000 |

Read the columns together. The lump sum carries the largest planned margin and the smallest mean margin, because the contractor absorbs every overrun, and in 0.199500 of the iterations the margin goes below zero. The day rate sits in between: the company pays for extra days, so a loss needs a daily cost well above plan. The reimbursable contract carries the smallest planned margin and the largest mean, and it never loses, because a percentage fee grows with the cost.

## What a lump sum price contains

The planned margin of the lump sum is more than profit. Part of it is the contractor's price for carrying the overrun, which this job makes likely: 0.902400 of the iterations overrun the plan. A bidder who prices a lump sum at the plan's cost plus a normal fee risks a loss in many outcomes. A company that compares a lump sum bid with a day rate bid only on their planned payments compares a price that includes the risk with one that does not.

## A margin of exactly zero

The engine's rule for a loss is a margin below zero. A margin of exactly zero is no loss. The course shows it on a stated job with nothing uncertain: 10 days, 40000 a day, a fixed cost of 100000, a lump sum of 500000, a day rate of 50000 with no mobilisation fee, and a reimbursable contract at cost plus a fixed fee of 0, run for 10 iterations on seed 1. Nothing is drawn, no iteration overruns, and the reimbursable margin is exactly 0.000000 with a probability of a loss of 0.000000. The engine's sampling basis says so in its own words:

> 10 iterations, one mulberry32(1) stream; per iteration a uniform for the duration (constant: no draw) then one for the daily cost (constant: no draw); triangular inverse CDF (lib/stats triInvCDF)

## Exercise

Open the contract calculator on the view "Contract types on one job" at 20000 iterations on seed 20270211 and read the column "probability of a loss" for each contract type. Then replace the whole box with the stated job above: `duration` 10, `dailyCost` 40000, `fixedCost` 100000, `lumpSum` with a price of 500000, `dayRate` with a rate of 50000 and a mobilisation fee of 0, `reimbursable` with a `fixedFee` of 0, 10 iterations and seed 1. Confirm that the reimbursable probability of a loss reads 0.000000 and that the probability of an overrun is zero. Read the sampling basis the panel prints and check it against the quotation.
