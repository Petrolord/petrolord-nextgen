# It changes with the mud

The limit that shrinks as you make the well safer.

{{panel:wc-tolerance-explorer}}

## The relationship

    MAASP = (fracture EMW - mud density) x g x TVD at the shoe

The mud density is subtracted. So a heavier mud gives a SMALLER MAASP.

## The numbers on the slant well

At a 1750 kg/m3 fracture equivalent and a shoe at 1282.248590311 m:

| mud density | MAASP |
|---|---|
| 1200 kg/m3 | 6916009.725994333 Pa |
| 1320 kg/m3 | 5407062.149413751 Pa |
| 1440 kg/m3 | 3898114.5728331697 Pa |
| 1560 kg/m3 | 2389166.9962525875 Pa |
| 1680 kg/m3 | 880219.4196720059 Pa |

A linear fall, and it reaches zero when the mud weight reaches the fracture gradient.

## Why that is uncomfortable

Because the mud weight is raised to make the well safer against a kick, and raising it makes the well less able to tolerate one.

Every kilogram per cubic metre of extra mud weight is a kilogram per cubic metre less of margin at the shoe.

## The trade in one sentence

A heavier mud reduces the CHANCE of a kick and reduces the ability to handle one.

That is genuinely a trade rather than an optimisation, and where the balance sits is a well design judgement.

## What it means during a kill

The kill mud is heavier than the original, so the MAASP falls during the operation as the kill mud fills the annulus.

The limit the choke operator is working against is therefore moving, and it is moving in the wrong direction.

In practice the ORIGINAL mud's MAASP is used throughout, which is the more permissive of the two early on and the more permissive of the two throughout, because the annulus is not full of kill mud until the end.

That is a simplification and it is the standard one.

## The planning consequence

The mud weight at which MAASP reaches zero is the mud weight at which the section cannot be circulated at all.

That is a harder limit than kick tolerance, and it is always reached later: kick tolerance goes to zero first, because it requires room for an influx as well as for the mud.

## Exercise

Compute the mud weight at which the slant well's MAASP reaches zero.

Then use the tolerance explorer's sweep to find the mud weight at which its kick tolerance reaches zero, and confirm that the second is smaller.
