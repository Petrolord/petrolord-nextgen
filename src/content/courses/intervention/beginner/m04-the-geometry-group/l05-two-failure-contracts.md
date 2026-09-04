# Two failure contracts

One function in this group tells you it failed. Three of them hand back a number that is not a number and say nothing.

{{panel:pd-diagnostic-explorer}}

## Who returns what

`skinPiMultiplier` returns an object: ok = false and an error string. `pssDenominator`, `minimumSkin` and `skinFromPiRatio` return a bare NaN for the same bad geometry, a wellbore radius larger than the drainage radius, with `Number.isFinite` false in every case. `pssDenominator` does the same on a wellbore radius of zero.

Two contracts in one module means a call site written for one is wrong at the other. A caller who tests `result.ok` and moves on does the right thing on the multiplier, then carries a NaN through every later step on the group, where it stays a NaN, prints as NaN and gets read as a display bug.

## The inverse checks nothing at all

`skinFromPiRatio` takes a claimed uplift and returns the post-job skin that claim implies. It is the natural way to audit a vendor's number. On the published geometry, whose floor is -7.900724584:

| Claimed uplift, times | Implied post-job skin |
| --- | --- |
| 4.000 | -5.925543438 |
| 5.000 | -6.320579667 |
| 6.000 | -6.583937153 |
| 8.000 | -6.913134011 |
| 10.000 | -7.110652126 |
| 12.000 | -7.242330869 |

Those are derived points on the published geometry. The round trip holds where it can be checked: published case 2 has a multiplier of 2.186294988, and inverting it returns a skin of -2.000000000 against a stated -2.000, a difference of 8.8818e-16.

## What it returns without comment

A claimed uplift of 15.000 times implies a skin of -7.374009612, which is 0.526714972 above the floor and past everything the module's own refusal text calls achievable. It comes back as a bare number with no flag, no warning and no note. There is no plausibility check on this function of any kind, and the floor it could compare against is one call away.

## The mistake

Auditing a claim by reading the sign. Every row here is negative and every row looks like a stimulated well. The question is not whether the implied skin is negative but whether it is reachable, and nothing answers that unless you call `minimumSkin` yourself and compare.

## What it refuses

`skinFromPiRatio` returns a bare NaN on a negative claimed ratio and on a claimed ratio of zero, as well as on bad radii. All three read identically at the call site, and all three read identically to an answer, unless the caller runs `Number.isFinite` on the result.

## Exercise

Invert a claimed uplift of 6.000 times and of 12.000 times on the published geometry.

Then say what the module told you about the second one, and what you would have had to call to find out.
