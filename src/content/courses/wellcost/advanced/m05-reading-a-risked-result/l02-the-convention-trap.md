# The convention trap

P90 means the low case in one half of this industry and the high case in the other half. Both halves are in the room when an AFE is approved.

{{panel:wc-risk-explorer}}

## Two conventions, running opposite ways

The petroleum convention comes from reserves. P90 is the quantity you will exceed with ninety per cent probability, so it is the small, conservative, proved number. P10 is the one you will exceed only one time in ten, so it is the large, optimistic number. In reserves, higher confidence points downward.

The cost convention comes from project controls. P90 is the number the cost will come in at or below with ninety per cent probability, so it is the big, conservative, well covered number. P10 is the cheap, optimistic one. In cost, higher confidence points upward.

Both are internally consistent. Both are in daily use. They label the same tail with opposite names.

| Label | Reserves reading | Cost reading |
| --- | --- | --- |
| P10 | High volume, optimistic | Low cost, optimistic |
| P50 | Median, same either way | Median, same either way |
| P90 | Low volume, conservative | High cost, conservative |

The one thing they agree on is P50, which is why P50 is the only percentile you can say out loud without a qualifier.

## What the canonical sampler returns

The Suite has one Monte Carlo module, and it was written for reserves. It sorts the realisations ascending, then deliberately crosses the labels over: the field it calls p10 is read from the index nine tenths of the way up the sorted list, and the field it calls p90 is read from the index one tenth of the way up.

That is correct for a volume. It means that when you push cost totals through it, the field named p10 holds the expensive outcome and the field named p90 holds the cheap one.

So the sampler returns the petroleum convention. If you print its p90 next to a caption that says conservative cost case, you have printed the cheapest tenth of your run and called it your worst case. The estimate is not slightly wrong. It is backwards by the whole width of the distribution.

## The working rule

Never print a percentile without the convention attached to it. Write it as the cost that will not be exceeded nine times in ten, or as the cost exceeded nine times in ten, in words, next to the figure.

Ask the same question of every percentile that arrives from somebody else, including from a tool. A quoted P90 with no stated convention is not a number you can use, and the polite version of that sentence is still the correct one.

## Exercise

Take a risked run in the panel and write its two tail figures down with the sampler's own field names beside them.

Then relabel both in the cost convention, in full words, and state which of the four labels you have now written would mislead a reader if it appeared alone on a slide.
