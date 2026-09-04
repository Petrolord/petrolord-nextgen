# The profile down the hole

The same well, the same day, the same 3100.0 Mscf/d, read at six depths in order. The verdict changes on the way down.

{{panel:pd-profile-explorer}}

## The sequence

`recommendCorrelation` at the EBOCHA-5 wellhead returns coleman: "At 880.0 psia wellhead this well sits inside the low-pressure range Coleman's data covered, where the unadjusted equation fitted better." That is how the function is called in practice, so that is the correlation every station is scored under.

| Depth, ft | Critical rate, Mscf/d | Actual velocity, ft/s | Ratio | Loaded |
| --- | --- | --- | --- | --- |
| 0.0 | 2671.123287413 | 8.6650712734 | 1.1605604334 | false |
| 1500.0 | 2771.653428599 | 8.0336259272 | 1.1184659554 | false |
| 3000.0 | 2880.606192973 | 7.4224572621 | 1.0761623743 | false |
| 4500.0 | 2997.912433154 | 6.8373900941 | 1.0340528848 | false |
| 6000.0 | 3106.497172008 | 6.3537282146 | 0.9979085215 | true |
| 7500.0 | 3222.613396799 | 5.8895500931 | 0.9619521855 | true |

Four healthy stations, then two loading. Nothing about the well changed between rows. The tubing is 3.548 in throughout and the fluids are one brine at 62.0 dyne/cm and 66.2 lbm/ft3. Only the station moved.

## Both sides move, and they move against each other

The critical velocity falls with depth as the gas gets denser: 7.4662818275 ft/s at the gauge, 6.1224977520 ft/s at the shoe. That alone would help. But the rate that velocity corresponds to rises, because a standard rate occupies less volume at 1500.0 psia than at 880.0 psia, so the critical rate climbs from 2671.123287413 to 3222.613396799 Mscf/d while the actual velocity falls from 8.6650712734 to 5.8895500931 ft/s.

Numerator down, denominator up. The ratio falls monotonically.

## The increments, so the shape is visible

From 0.0 ft to 1500.0 ft the critical rate rises 100.530141186 Mscf/d and the ratio falls 0.0420944780. The next two intervals give 108.952764374 Mscf/d and 0.0423035811, then 117.306240181 Mscf/d and 0.0421094894, then 108.584738855 Mscf/d and 0.0361443633, then 116.116224791 Mscf/d and 0.0359563360 into the shoe.

The decrement holds near 0.0421094894 over the top three intervals, then steps down and holds near 0.0359563360 over the bottom two. That step sits between 3000.0 ft and 4500.0 ft, above the crossing, and it tracks the traverse's own pressure steps rather than anything happening to the liquid. There is no kink at the crossing itself: it is where a steady slope happens to pass one.

## The mistake

Sampling the profile and quoting whichever station comes to hand. The wellhead ratio is 1.1605604334 and the shoe ratio is 0.9619521855, and the wellhead reads 1.2064637420 times better than the station that decides. That factor is not noise. It is the profile.

## What it refuses

There is no inflow performance anywhere in these modules. The 3100.0 Mscf/d is an input, so this is a verdict at a rate somebody supplied, not a prediction of what the well will do next. It also places the crossing only between two stations you gave it, so a profile cut at 1500.0 ft spacing locates it to 1500.0 ft and no better.

## Exercise

Read the six ratios in order and write the depth of the last station above one and the first below it.

Then state what the profile can say about the 1500.0 ft between them.
