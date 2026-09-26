# Reading a cost range

{{panel:pr-contract-calculator}}

A single cost figure hides the question a contract choice turns on: how wide is the range the company might pay, and where in that range does each contract sit? This lesson reads the Ekene contract types as ranges, from the LOW cost to the HIGH cost, and shows what each range says about the risk the company keeps.

## The ranges on the Ekene job

Every figure below is the company's cost, on 20000 iterations with seed 20270211. P90 is the LOW cost, a 90 percent probability that the cost meets or exceeds it; P10 is the HIGH cost.

| contract type | mean | P90 (low) | P50 | P10 (high) |
| --- | --- | --- | --- | --- |
| lump sum | 900000.000000 | 900000.000000 | 900000.000000 | 900000.000000 |
| day rate | 923862.832721 | 837897.131515 | 912667.421771 | 1029964.481686 |
| reimbursable, cost plus 12 percent | 926431.052553 | 809775.400015 | 916146.832457 | 1058436.038354 |

## Three readings of one table

**The width.** The lump sum has no range at all. The day rate runs from 837897.131515 at P90 to 1029964.481686 at P10. The reimbursable contract runs from 809775.400015 to 1058436.038354, the widest of the three: it has the lowest LOW cost and the highest HIGH cost. A percentage fee passes every change in the contractor's cost straight to the company, with the fee on top, so it widens the range at both ends.

**The mean.** On this job the lump sum has the lowest mean, 900000.000000, then the day rate at 923862.832721, then the reimbursable contract at 926431.052553. The plan ranked them the other way round. The sampling reverses that ranking because the job's long upper tail lifts the mean cost of the two contracts that pass the overrun to the company.

**Where the fixed price sits.** The lump sum's single figure lies above the day rate's LOW cost and below its P50, 912667.421771. At least half the day rate's outcomes cost the company more than the lump sum would.

## The range is the company's retained risk

Under the lump sum the contractor carries the whole range, and the company pays a fixed price for that service. Under the day rate the company keeps the duration part of the range. Under cost plus 12 percent it keeps all of it and pays the fee on top. Reading a contract comparison means reading these ranges beside the means: a company with a firm budget weighs the HIGH cost, a company that tenders many similar jobs may weigh the mean, and the table serves both.

## The contractor's cost is the root of every range

The company's ranges come from one range of the contractor's own cost: P90 723013.750014, P50 817988.243265 and P10 945032.177102 on the same seed and iterations. The day rate and the reimbursable contract are two ways of passing that range to the company.

## Exercise

Open the contract calculator on the view "Contract types on one job" at 20000 iterations on seed 20270211 and copy the P90, P50 and P10 of each contract type. Then raise the `max` of `dailyCost` in the box and read the table again. Two of the three ranges do not move at all. Name them, and explain from the payments basis why a higher daily cost reaches the company under one contract only.
