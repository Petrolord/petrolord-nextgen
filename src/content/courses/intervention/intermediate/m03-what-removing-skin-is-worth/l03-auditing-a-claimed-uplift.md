# Auditing a claimed uplift

A vendor quotes a fold increase. `skinFromPiRatio` turns that claim into the post-job skin it implies, which is the number worth arguing about, and it says nothing at all about whether that skin is reachable.

{{panel:pd-channel-explorer}}

## Five claims on one geometry

Teaching well ELELENWO-4, built for this course rather than published, has a drainage radius of 1180 ft and a wellbore radius of 0.354 ft. That geometry allows a minimum skin of -7.361728083, the value at which the denominator reaches zero:

| Claimed uplift, times | Implied post-job skin |
| --- | --- |
| 2.000 | -3.680864042 |
| 4.000 | -5.521296062 |
| 6.000 | -6.134773403 |
| 8.500 | -6.495642426 |
| 12.000 | -6.748250743 |

The claimed uplift runs from 2.000 to 12.000 times while the implied skin moves only from -3.680864042 to -6.748250743, because the multiplier is a ratio of two denominators and the second one is running out of room. Large claims are cheap in fold terms and expensive in skin terms.

## Where a claim stops being reachable

The module's own refusal text names the range: real treatments reach about -3 to -5 on acid and -5 to -6 on a fracture. Read the table against that sentence. A claimed doubling implies -3.680864042 and sits inside the acid range. A claimed 6.000 times already implies -6.134773403, past the deepest figure the module calls real for a fracture, and it is returned as a bare number with nothing said. A claimed 12.000 times implies -6.748250743, against a floor of -7.361728083.

## The only check this function has

Take a published skin pair, compute its multiplier and invert it. Published case 2 runs skin 5.000 down to -2.000 for a multiplier of 2.186294988, and the inverse returns -2.000000000, a difference of 8.8818e-16. Cases 1 and 3 both return 0.000000000 with a difference of 0.0000e+0.

That round trip is a check the teaching digest ran, not one the oracle wrote. The published cases assert `skinPiMultiplier` and nothing asserts `skinFromPiRatio` at all.

## What it refuses

Three inputs come back as a bare NaN: a wellbore radius larger than the drainage radius, a negative claimed ratio, and a claimed ratio of zero. There is no ok flag and no error text on any of them, so a caller that does not run a finite check cannot tell a refusal from an answer.

## What it does not refuse

Implausibility. On the published geometry, whose floor is -7.900724584, a claimed uplift of 15.000 times implies a skin of -7.374009612, which sits 0.526714972 above the floor and past everything the module calls achievable. It is returned with no flag, no warning and no note. The plausibility limit exists only in a sentence in a different function's error message.

## The mistake

Auditing the fold increase instead of the skin. A claim of 6.000 times sounds like a large but ordinary result. Stated as a post-job skin of -6.134773403 it is a claim to have beaten the best fracture the module will admit to, on a well that was acidised.

## Exercise

Convert a claimed uplift of 4.000 times and one of 12.000 times on the teaching geometry into implied skins.

Then say which of the two you would send back, and quote the limit you are sending it back against.
