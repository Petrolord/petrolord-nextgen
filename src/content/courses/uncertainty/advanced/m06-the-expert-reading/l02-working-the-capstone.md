# Working the capstone

A graded probabilistic case is worked in a fixed order: the deterministic case, the Monte Carlo outcomes with their labels, the breakeven price in percentile words, and then every edge and every number this tier has shown can mislead. The order is worked here on ISIALA.

{{panel:ec-risk-explorer}}

## The deterministic case first

Write the inputs before running anything. ISIALA is 4400 bopd declining 12 percent a year, oil at 70 USD per bbl, capex of 180 million USD in two halves, fixed opex of 2.5 million USD a year, variable opex of 13 USD per bbl, royalty 15 percent, tax 35 percent, a discount rate of 12 percent and a first year of 2027. The case returns an NPV of 81.0464 million USD, an IRR of 53.7148 percent, a payback of 3.2746 years and a peak exposure of -44.6035.

Then read each with its status word. The IRR carries irrStatus ok, so it is a rate the engine solved and not a null with a reason attached. The cumulative crosses zero once, from -8.6381 in 2029 to 22.8165 in 2030, and stays positive, so paybackStatus is ok rather than the recrossed that finding EC3-1 records.

## The outcomes with their labels

Record the settings with the answer: 1000 iterations, price, capex and reserves each plus or minus 20 percent, seed 20260829.

| case | P-label | engine key | NPV |
| --- | --- | --- | --- |
| Low case | P90 | `p10` | 15.6063 |
| Best case | P50 | `p50` | 78.5315 |
| High case | P10 | `p90` | 152.0653 |

The emv is 80.9836. The Low case comes first and holds the smallest NPV. A result that shows the largest NPV under P90 has swapped its labels. Name the rule too: on the same sample the breakeven rule puts the Low case at 15.6619, so 15.6063 is quoted with the screening engine that produced it.

## The breakeven price in percentile words

State the target NPV, the iteration count, the seed and the exclusions: NPV 0, 5000 iterations, seed 20260829, 0 excluded. The base at the beliefs' medians is 71.6277 USD per bbl, the 10th percentile of breakeven price 62.1713, the median 73.3297 and the 90th percentile of breakeven price 85.5912. No P-label touches any of them. Keep the base beside the percentiles and say which is which: 71.6277 is one solve at the beliefs' medians, which for ISIALA are the stated ones, and 73.3297 is the middle of the sample, sitting higher.

## The edges

Read `exact` on every fit: ISIALA's capex, opex and efficiency fits are all true. Read both sides of every tornado bar: Total CAPEX -7.0202 and 9.4067, Annual OPEX -5.8578 and 8.8730, Prod. Efficiency -3.7306 and 5.0561, and no side null. Had a fit been inexact or a side unreachable, the answer would say so in words.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Deterministic | NPV, IRR, payback and exposure, each read with its status word |
| Outcomes | Low, Best and High in that order, with P-labels and engine keys |
| Breakeven | Base and three percentiles, in percentile words |
| Settings | Iterations, ranges, target and seed written beside every sampled number |
| Edges | Every fit's `exact` flag and both sides of every tornado bar read |
| Conventions | Mid-year discounting named, one percentile rule per engine |

Then the units: USD, bbl, bopd, percent as a word, money in million USD, and calendar years.

## The mistake

The careful mistake is reporting the right numbers under the wrong words. Every ISIALA value can be correct and the answer still lose its marks by writing a breakeven price with a P-label, by showing the High case first, or by quoting a median without its seed.

## Exercise

Work ISIALA in this order: the deterministic case and its checks, the three NPV cases with labels and keys, the breakeven price at three percentiles, then the fits and the tornado sides. Say which results would change under a different seed and which would not.
