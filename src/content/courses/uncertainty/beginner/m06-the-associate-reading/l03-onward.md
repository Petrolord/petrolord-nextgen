# Onward

The Associate reading ends with ISIALA's value and a range of -72.1531 to 237.8860 million USD that carries no probability. The other two tiers exist to put honest odds on a range.

## Beliefs are percentiles

The Professional tier starts from what an engineer believes, stated as three percentiles. ISIALA's capex belief is a 10th percentile of 150, a median of 180 and a 90th percentile of 220. Fitted properly, it becomes a triangular with minimum 127.2260, mode 168.6738 and maximum 252.3607, which passes back through 150, 180 and 220 exactly. Read the same belief as a minimum, mode and maximum instead and the 10th percentile, median and 90th percentile come out at 164.4914, 182.5834 and 203.2668: the tails vanish, and the range looks narrower than anyone believed.

## A price with three percentiles

That tier then asks what oil price ISIALA needs. At the stated medians the breakeven price is 71.6277 USD per bbl. Sampled over 5000 iterations at seed 20260829, the 10th percentile of breakeven price is 62.1713, the median 73.3297 and the 90th percentile 85.5912. A breakeven price takes percentile words and never a P-label, because a higher breakeven is worse.

## What this tier cannot tell you

How likely any of its numbers is. The sweep says ISIALA is worth -17.3893 if price falls to 0.7 of 70.0000 USD per bbl, and the Low scenario says -72.1531 if four inputs fail together, but neither says how often that happens. Nor can this tier say whether a belief can be honoured at all: ISIALA's narrow opex belief, a 10th percentile of 16, a median of 17 and a 90th percentile of 26, has a shape ratio of 0.100000 that no triangular reaches, and the engine clamps the fit and says so.

## One meaning of a P-label

The Expert tier fixes the words. An NPV takes P-labels under the exceedance meaning, low to high. Through the Scenario Builder's Monte Carlo on ISIALA:

| case | P-label | engine key | NPV |
| --- | --- | --- | --- |
| Low case | P90 | p10 | 48.7439 |
| Best case | P50 | p50 | 81.1835 |
| High case | P10 | p90 | 109.8980 |

The panel that shipped before the fix printed 109.8980 under "P90 (Conservative)".
## What to carry forward

Three habits survive. Prove a row by hand before trusting a column. Read every metric against its flag: a payback equal to the life, an IRR of 0 or 1000. And name the basis beside every number, because 81.0464 is a mid-year NPV at 12 percent and 76.5817 is the same rows at year end.

## Exercise

Write ISIALA's capex belief in percentile words and the triangle it fits. Then give the median breakeven price, and the NPV that takes the label P90 with its case name.
