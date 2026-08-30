# The sweep against mud weight

Two curves with completely different shapes.

{{panel:wc-tolerance-explorer}}

## The two wells

At a 1750 kg/m3 fracture equivalent and a 60 kg/m3 kick intensity:

| mud density | slant | horizontal |
|---|---|---|
| 1200 kg/m3 | 7.8144842668708145 m3 | 1.0776682353801654 m3 |
| 1260 kg/m3 | 6.334836096834492 m3 | 1.077996958796999 m3 |
| 1320 kg/m3 | 5.019593279024423 m3 | 1.0782970975688906 m3 |
| 1380 kg/m3 | 3.8427970736154116 m3 | 1.0785722247764575 m3 |
| 1440 kg/m3 | 2.783680488747303 m3 | 1.0788253418074196 m3 |
| 1500 kg/m3 | 1.825432150057105 m3 | 1.0790589882975379 m3 |
| 1560 kg/m3 | 0.9542972967023874 m3 | 1.0792753276402405 m3 |
| 1620 kg/m3 | 0.1589133001611273 m3 | 0.7791567725033481 m3 |
| 1680 kg/m3 | 0 m3 | 0.08613710397051996 m3 |

## The slant well: a straight fall to zero

From 7.81 to zero over 480 kg/m3, almost linearly. Every extra kilogram per cubic metre of mud costs about 0.016 m3 of tolerance.

That is the shape everybody expects, and it is the one the casing point argument is built on.

## The horizontal well: almost flat, then a cliff

From 1.0777 to 1.0793 over 360 kg/m3, which is a RISE of two parts in a thousand. Then it falls off between 1560 and 1680.

Raising the mud weight from 1200 to 1560 does not reduce this well's kick tolerance at all.

## Why

Because the horizontal well's tolerance is bound by the CIRCULATED case, and that case is limited by geometry rather than by pressure.

The influx can only rise 42.515647195 m before its top is at the shoe. That distance does not depend on the mud weight. So the volume at the shoe is fixed, and the only mud-weight dependence left is in the Boyle compression back to the initial pressure, which is a small correction.

The headroom does fall with mud weight, exactly as it does on the slant well. It just does not bind until it falls below what the geometric limit needs, which happens somewhere above 1560.

## What that means

**On the slant well**, mud weight is the lever: every increase costs tolerance and the casing point is set by where the two cross.

**On the horizontal well**, mud weight is almost irrelevant to kick tolerance until it is nearly at the fracture gradient. The tolerance is set by the shoe's position, and no amount of mud weight management changes it.

That is an uncomfortable finding: the usual well design lever does not work on the well that needs it most.

## The design response

Set the shoe deeper before landing, or design for a smaller kick, or manage the pressure precisely enough not to take one.

None of those is a mud weight decision, and that is the point.

## Exercise

Compute the slope of the slant well's curve between 1320 and 1560 kg/m3, in cubic metres per kilogram per cubic metre.

Then do the same for the horizontal well over the same range, and say what the two slopes tell you about which lever works on which well.
