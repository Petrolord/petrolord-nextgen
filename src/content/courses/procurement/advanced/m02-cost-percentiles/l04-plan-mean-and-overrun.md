# The plan, the mean and the overrun

{{panel:pr-contract-calculator}}

Three figures describe the "expected" cost of a contract, and on the Ekene job they are three different numbers. A report that calls one of them the expected cost without saying which has told the reader very little. This lesson separates them on the day rate.

## Three figures on one contract

On the day rate, with 20000 iterations on seed 20270211:

| figure | value | what it is |
| --- | --- | --- |
| planned payment | 853274.305556 | the payment at the plan, built from the modes |
| P50 | 912667.421771 | the middle of the sampled costs |
| mean company cost | 923862.832721 | the average over every iteration |

The plan is one outcome: 13.865486 days at the most likely daily cost of 42000.000000. The P50 is the outcome in the middle of the sorted costs. The mean is the average of all of them, and it sits above the P50 because the high outcomes lie further from the middle than the low ones.

## Why the plan sits so low

The plan uses the most likely value of each triangle. The NPT fraction has its mode at 0.15 and its maximum at 0.6, so there is far more room above the mode than below it. Most iterations draw an NPT fraction above the mode, and most run longer than the plan. That is why 0.902400 of the iterations overrun, with an expected overrun of 107001.253374 in the contractor's cost. A plan built from the modes of skewed inputs is optimistic by construction.

## An overrun is a stated rule

The engine's convention is that an iteration overruns when its contractor cost is above the planned cost. A cost equal to the planned cost is no overrun. The plan is the modes unless the call states another as `plan`, with its days and its daily cost, and the engine refuses a plan that lacks either:

> plan must be { days, dailyCost }, both at or above 0, when given

A stated plan changes nothing about the samples or the percentiles. It moves only the reference the overrun and the planned payments are measured against, so the probability of an overrun, the split of the overrun and the planned margins all move with it.

## Which figure to report

Each answers a different question. The plan is what the job costs if everything goes as most likely. The P50 is a figure the cost is as likely to exceed as to fall below. The mean is what the company pays on average over many such jobs. A report quotes the one its question needs, with the seed and the iteration count, and never lets the plan stand in for the mean.

## Exercise

Open the contract calculator on the view "Contract types on one job" at 20000 iterations on seed 20270211, and read the day rate's planned payment, P50 and mean. Then add a `plan` with `days` set to the mean days of 15.277257 and a `dailyCost` of 42000. Read the probability of an overrun and the planned payments again, and confirm that the P50 and the mean did not move. Finally remove `dailyCost` from the plan and read the refusal.
