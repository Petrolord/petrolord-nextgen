# Lump sum, day rate and reimbursable

{{panel:pr-contract-calculator}}

The earlier tiers decided who wins a tender. The Expert tier asks a question that comes before the invitation is written: how should the contract pay for the work? The same scope can be let as a lump sum, at a day rate or on a reimbursable basis, and each form moves a different share of the uncertainty onto the company. This module prices all three on one job, the Ekene-3 and Ekene-5 coiled tubing cleanout and acid stimulation.

This is an engine course, so every practical here runs in the course's own contract calculator, which calls the same vendored tender engine these lessons quote. The job and its prices are synthetic.

## One job, one contractor cost

The engine starts from what the work costs the contractor: contractor cost = fixed cost + days x daily cost, with a fixed cost of 140000.000000. The days and the daily cost are uncertain, and the next two lessons show where each comes from. The three contracts differ only in how the company pays for that same work.

## Three ways to pay

The engine's payments basis, in its own words:

> lump sum 900000; day rate 160000 + 50000 x days; reimbursable cost x 1.12

Read each rule as a promise about what the company pays in one outcome of the job:

- **Lump sum.** The company pays 900000.000000 whatever happens. A long job and a short job cost it the same.
- **Day rate.** The company pays a mobilisation fee of 160000.000000 plus 50000.000000 for every day. A longer job costs it more, at the rate it agreed.
- **Reimbursable, cost plus 12 percent.** The company pays the contractor's own cost and a fee of 0.12 of it. Every dollar the contractor spends reaches the company with the fee on top.

## The plan, priced three ways

The engine builds a plan from the most likely values: 13.865486 days at 42000.000000 a day, a planned contractor cost of 722350.416667. Each contract then gives a planned payment:

| contract type | planned payment |
| --- | --- |
| lump sum | 900000.000000 |
| day rate | 853274.305556 |
| reimbursable, cost plus 12 percent | 809032.466667 |

On the plan the reimbursable contract is the smallest payment and the lump sum the largest. The plan is one outcome among many, and the rest of this module shows how that ranking changes once the uncertainty is sampled.

## The fee is one thing or the other

A reimbursable contract pays either a percentage of cost or a fixed fee. The engine takes exactly one and refuses a call that states both, naming the field:

> reimbursable must state exactly one of feeFraction (cost plus a percentage) or fixedFee (cost plus a fixed fee)

Under a fixed fee the fee stays put when the cost rises, which matters for who carries an overrun.

## Exercise

Open the contract calculator on the view "Contract types on one job". It loads the Ekene job at 2000 iterations. Change `iterations` to 20000 and confirm that the seed reads 20270211, then read the planned payment of each contract type from the table and check it against the three figures above. Next, inside `reimbursable`, add a `fixedFee` of 0 beside the `feeFraction` and read the refusal the engine returns with the field it names. Remove `feeFraction`, keep the fixed fee, and note which planned payment moved and which two did not.
