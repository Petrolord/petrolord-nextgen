# The capstone brief

{{panel:pr-contract-calculator}}

The Expert capstone grades 6 fields, and every one answers the Expert question: what does a contract cost the company under uncertainty, what should the job cost, and how does the award compare with that? Each field is a figure the engine returns, graded against the engine's own result on a synthetic tender and job of the capstone's own. None of its bids, prices or settings appear anywhere in this course; every figure in these lessons belongs to the Ekene tenders.

| graded field | where it comes from |
| --- | --- |
| the day rate's mean company cost | the contract comparison, on the stated seed and iterations |
| the reimbursable contract's P90 company cost, the LOW cost | the same run, read by exceedance |
| what the company pays of the overrun under the day rate | the same run, its overrun split |
| the should-cost estimate | the company's cost items on the programme, at the stated NPT fraction and contingency |
| the operator's share of the should-cost | the partner split, the operator carrying 100 less the partners |
| the awarded bid's ratio to the should-cost | the whole tender in one call, then its evaluated costs against the estimate |

## What you are given

A job with its activity programme, its uncertain NPT fraction and daily cost, its fixed cost and three contract offers; the company's cost items, contingency, partners and band; and a tender with criteria, a pass mark, bids and every award setting. The brief states every setting a field depends on, including the seed and the iteration count. The case file is offered on the capstone card only.

## How to work it

Work every field in the contract calculator. Paste the job into "Contract types on one job", set the stated seed and iteration count, and read the three contract fields from the table. Paste the tender into "The whole tender, any award basis" and read the award and the evaluated cost of each bid that reached the commercial stage. Then open "Should-cost and the screening band", paste the programme, the cost items, the contingency and the partners, replace the bids with those evaluated costs, and read the estimate, the operator's share and the awarded bid's ratio.

## What catches people

Leaving the calculator at its starting 2000 iterations when the brief states another count, or changing the seed. Reading the reimbursable P10 where the P90 is asked: for a cost the P90 is the LOW figure, a 90 percent probability of meeting or exceeding it. Reading the contractor's share of the overrun where the company's is asked. Running the should-cost at an NPT fraction other than the one stated. Taking the ratio of the lowest evaluated cost when the award went elsewhere, or dividing a quoted price by the estimate where the evaluated cost belongs.

## A rehearsal on the Ekene data

Every step can be rehearsed in the panel on seed 20270211 with 20000 iterations. The Ekene job gives a day rate mean company cost of 923862.832721, a reimbursable P90 cost of 809775.400015, the LOW cost, and a company payment of 71671.875955 of the overrun under the day rate. The Ekene should-cost is 895361.041667 with an operator's share of 402912.468750. The well services award, WS3 under the combined score, has a ratio of 1.069948 to the estimate. If your panel work reproduces those six figures, your method is the engine's.

## Exercise

Before you open the capstone, run all six rehearsal steps in the contract calculator and write each result beside the field it rehearses, with its seed, iterations and other settings. Then change the seed by one and mark which of the six figures moved and which did not, and say why the three that did not move are free of the Monte Carlo.
