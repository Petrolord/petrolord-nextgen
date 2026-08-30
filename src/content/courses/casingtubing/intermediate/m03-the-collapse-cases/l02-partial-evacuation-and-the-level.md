# Partial evacuation, and the level

The case with a kink in it, and where the kink happens to land.

{{panel:ct-loadcase-explorer}}

## The story

More realistic than full evacuation. The fluid level inside the casing has dropped to some depth, and below that depth there is still packer fluid or completion brine.

## The columns

    level = (1 - evacuationFraction) x shoe depth

    inside(z) = 0                                   for z at or above the level
    inside(z) = packer fluid gradient x (z - level)  below it

    outside(z) = mud gradient x z

The published run uses an evacuation fraction of 0.4 and a packer fluid of 1150 kg/m3, so the level is at 1504.7518195805999 m and the fluid below it delivers 11277.6475 Pa per metre.

## Where the level lands

At 1504.7518195805999 m, which is BELOW the section break at 1473.759701091 m.

That has a consequence worth reading twice: section 1 lies entirely above the level, so section 1 is fully evacuated in this case, exactly as it is in the full evacuation case.

## The two sections, side by side

| section | full evacuation | partial evacuation |
|---|---|---|
| 1 | 1.7576249995635107 | 1.7576249995635107 |
| 2 | 1.2882443095792595 | 1.8929304140756467 |

Section 1 is identical to the last bit of the double. Section 2 gains 47 percent.

## Why identical and not merely similar

Because it is not an approximation. Above the level the inside pressure is exactly zero in both cases, and the outside pressure is the same mud column, so the two profiles are the same numbers and the check runs on identical arrays.

Two cases that describe different physical situations produce byte-identical results over part of the string, and the reason is that the difference between them happens somewhere else.

## The trap this sets

If you evaluate only section 1, partial and full evacuation look like the same case and you might drop one of them from the suite.

Drop full evacuation and section 2 loses its governing case entirely: its collapse safety factor goes from 1.2882443095792595 to 1.8929304140756467 and the string looks 47 percent safer than it is.

## And the level is a choice

The evacuation fraction is an input, not a measurement. Choosing 0.4 rather than 1.0 is an engineering judgement about how far the level can fall, and it should be defended in the design basis rather than inherited from a template.

## Exercise

Move the evacuation fraction in your head to 0.7, which puts the level at 752.3759097902999 m and inside section 1.

Say qualitatively what happens to each of the two sections' collapse safety factors, and which of them changes more.
