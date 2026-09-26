# The screening band

{{panel:pr-contract-calculator}}

With a should-cost in hand, each bid can be set against it as a ratio: the bid's evaluated cost divided by the estimate. A ratio near one says the bid and the company agree on what the job costs. A ratio far from one says one of them has misread the job, and the committee should find out which before it awards. The screening band is the company's stated rule for "far".

## The band is always stated

The fixture states the band as a lower limit of 0.8 and an upper limit of 1.25. The engine's band basis, verbatim:

> flag when ratio < 0.8 or ratio > 1.25; both limits are inside the band

No published threshold exists for a band like this, in any text the course reads. So the engine holds no default and refuses a call without a band:

> band must be { low, high } with 0 < low <= high (ratios of bid to estimate); there is no default

## The Ekene bids against the estimate

Each passing bid's evaluated cost (omission rule average; schedule minWeeks 6, maxWeeks 10, ratePerWeek 0.005) against the should-cost of 895361.041667:

| bid | evaluated cost | ratio to the estimate | flag |
| --- | --- | --- | --- |
| WS5 | 862141.000000 | 0.962898 | null |
| WS2 | 885574.000000 | 0.989069 | null |
| WS1 | 928200.000000 | 1.036677 | null |
| WS3 | 957990.000000 | 1.069948 | null |

All four sit inside the band. The bid the combined score awards, WS3, carries the highest ratio, 1.069948; the lowest evaluated cost, WS5, carries the lowest.

## The edges belong to the band

Both limits are inside the band. The course probed them on a stated estimate of 100000.000000:

| bid | evaluated cost | ratio | flag |
| --- | --- | --- | --- |
| AT-LOW | 80000.000000 | 0.800000 | null |
| BELOW | 79999.000000 | 0.799990 | below |
| AT-HIGH | 125000.000000 | 1.250000 | null |
| ABOVE | 125001.000000 | 1.250010 | above |

The two flagged bids carry a reason each, in the engine's words:

> bid-to-estimate ratio 0.79999 is below the band's lower limit 0.8: examine it as a possibly abnormally low bid

> bid-to-estimate ratio 1.25001 is above the band's upper limit 1.25

A flag is a result returned with its reason. The band rejects nothing: a flag asks the committee to look, and the next lesson sets it beside the World Bank's own test for a low price.

## Choosing a band

A narrow band flags more bids and asks more questions; a wide one trusts the bids more. The choice depends on how good the estimate is, and an estimate built from a well-defined programme earns a narrower band than a rough one. Whatever the company chooses, the report states the band beside every ratio.

## Exercise

Open the contract calculator on the view "Should-cost and the screening band" and read the four ratios. Raise the band's `low` until it sits just above WS5's ratio and read WS5's flag and reason. Then set `low` to 0.962898, WS5's ratio exactly as the table prints it, and explain the flag you get: two figures printed alike at six decimals need not be the same double. Finally delete the `band` and read the refusal.
