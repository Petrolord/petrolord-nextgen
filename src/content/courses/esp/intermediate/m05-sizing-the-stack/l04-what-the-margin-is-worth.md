# What the margin is worth

One stage of slack is a fraction of a percent on a tall stack and whole percent on a short one.

{{panel:pd-lift-explorer}}

## The same slack, four sizes

The rounding buys under one stage every time, and what that is worth depends on how many stages share it. gassyOffshore spreads 0.07170260 of a stage over 192 stages, which is 0.037359 percent of its requirement. highWaterCut spreads 0.28982009 over 264, 0.109901 percent. QUA-IBOE-4 spreads 0.99257012 over 172, 0.580425 percent. IBENO-2 spreads 0.82611546 over 33, and that is 2.567658 percent.

IBENO-2 carries less slack in stages than QUA-IBOE-4 and more than four times the percentage.

## It is not monotone in the requirement

The requirement swept upward on the short teaching stack, everything else held:

| Requirement, ft | Stages | Head made, ft | Margin, ft | Margin |
| --- | --- | --- | --- | --- |
| 650 | 29 | 653.561604 | 3.561604 | 0.547939 percent |
| 680 | 31 | 698.634818 | 18.634818 | 2.740414 percent |
| 700 | 32 | 721.171425 | 21.171425 | 3.024489 percent |
| 720 | 32 | 721.171425 | 1.171425 | 0.162698 percent |
| 725 | 33 | 743.708032 | 18.708032 | 2.580418 percent |

Moving the requirement from 650 ft to 680 ft took the margin from 0.547939 percent to 2.740414 percent. Moving it from 700 ft to 720 ft took it from 3.024489 percent down to 0.162698 percent with no change in the stage count. The margin is a sawtooth, and no single reading of it characterises a design.

## What it costs in power

The published motor sizing method, PetroWiki's ESP system selection and performance calculations, sizes on total stages times brake power per stage times specific gravity: the power at the head the stack MAKES. Everything electrical in this package is built on the power at the head required instead.

gassyOffshore builds on 125.69771587 hp where the published method takes 125.74467535 hp, understating by 0.04695948 hp, 0.037345 percent. highWaterCut, 172.55965200 against 172.74929676 hp, 0.18964476 hp, 0.109780 percent. QUA-IBOE-4, 95.41621294 against 95.97003263 hp, 0.55381969 hp, 0.577076 percent. IBENO-2, 29.77428389 against 30.53878580 hp, 0.76450191 hp, 2.503380 percent.

That is the non conservative direction. It was recorded and not fixed, because every number in this engine is consumed by a live application and a numeric edit moves a number somebody is looking at today.

## The mistake

Quoting a rounding margin as a design property. Told a stack carries 2.567658 percent of spare head, a reader hears a decision somebody made. Nobody made it, and moving the requirement from 700 ft to 720 ft turns it into 0.162698 percent with the same pump on the string.

## What it refuses

The margin is not a safety factor and the engine never treats it as one. It is not carried into the warnings, not compared against anything, and no threshold in the package fires on it. It exists because stages come in ones.

## Exercise

Sweep the requirement on the short teaching stack in the panel, recording the stage count and the margin percentage at each step.

Then find two requirements that share a stage count and say what the margin did between them.
