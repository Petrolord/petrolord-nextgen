# The story so far

This tier makes one argument: a probabilistic number becomes a decision only when its label means one thing, its sampler is understood, and the numbers it cannot be trusted with are known by name.

## One meaning of a P-label

An NPV takes exceedance labels, shown low to high. ISIALA through the Scenario Builder's Monte Carlo at seed 20260829:

| case | P-label | engine key | NPV |
| --- | --- | --- | --- |
| Low case | P90 | `p10` | 15.6063 |
| Best case | P50 | `p50` | 78.5315 |
| High case | P10 | `p90` | 152.0653 |

The panel that shipped before EC3-0 printed the `p90` key under "P90 (Conservative)". A breakeven price takes no P-label at all: ISIALA's 10th percentile of breakeven price is 62.1713 USD per bbl, its median 73.3297 and its 90th percentile of breakeven price 85.5912. Every input takes percentile words too.

## The sampler

The Scenario Builder draws one factor for each variable in each iteration, uniform around the base, and applies it to every year. Its ranges scale price, capex and reserves, and the reserves factor carries the variable opex with it; fixed opex, royalty and tax are never sampled. The seed repeats every value and guarantees nothing more: seed 43 gives a Best case of 80.2233 against 78.5315, and neither is the more accurate.

## Two rules and a wobble

On the same 1000 NPVs, the Low case P90 (engine key `p10`) is 15.6063 under the screening rule and 15.6619 under the breakeven rule. At 5000 iterations the median breakeven prices of seeds 1 to 10 span 72.6338 to 73.1287, and the default seed sits outside them at 73.3297.

## Edges that used to break

Every range at zero used to throw (S4) and now returns 81.0464 in all three cases. Forty iterations used to give an empty S-curve (S5) and now give 51 points, the last equal to the highest of the forty. A tornado side with no breakeven inside the bracket used to be drawn at 0.0000 and sorted last; it is now null, its bar is marked unreachable and it sorts first (B1). A belief outside the shape ratio band of 0.381966 to 0.618034 is clamped and flagged, and the base case and the tornado then run at the fitted percentiles.

## Numbers to distrust

NTEJE loses 123.9923 million USD and its IRR is null with the status no-root, where it used to report the 1000 percent Newton clamp (S1). OKPOMA reports a payback of 0.0000 with the status recrossed and paybackLast 2.0385, because its cumulative falls to -2.2287 in 2028 (EC3-1). Mid-year NPV is 1.058301 times year-end NPV on the same rows at 12 percent. A base breakeven of 71.6277 and a screening NPV of 81.0464 at 70 USD per bbl come from two different cases.

## Exercise

Write ISIALA's three NPV cases with their P-labels and engine keys, and its breakeven price at three percentiles in percentile words. Then name the finding behind each of these: a zero-range run that threw, an empty S-curve, a tornado side drawn at zero and sorted last, an IRR of 1000 percent on a losing project, and a payback of 0.0000 on a cumulative that later falls below zero.
