# Yields add on volume

A modular refinery in Delta State is offered two crudes and has to decide what the mixture will turn into. This tier answers that question, and it starts from one rule about barrels.

{{panel:crude-valuation-explorer}}

## The Kwale offer

KWALE is an invented topping refinery. It is offered Kwale Light and Ughelli Medium, 55 and 45 by volume. Every figure in this tier is illustrative: the streams are invented, the prices are invented, and neither crude is a real grade.

| crude | API | SG (computed) | sulfur wt% | TBP points (volume percent at F) |
| --- | --- | --- | --- | --- |
| Kwale Light | 38.4 | 0.8328 | 0.11 | 0 at 75; 10 at 190; 30 at 370; 50 at 530; 70 at 720; 90 at 1030; 100 at 1350 |
| Ughelli Medium | 27.1 | 0.8922 | 0.36 | 0 at 90; 10 at 265; 30 at 480; 50 at 650; 70 at 860; 90 at 1200; 100 at 1470 |

The Associate tier already blended the properties of a pair like this. The engine reports blend API 33.1219, SG 0.8595 and sulfur 0.2268 wt% on a mass basis. Those are single numbers. What a refinery buys is a curve: how much of each barrel boils off by each temperature.

## One rule

Yields are additive on volume. At any temperature, the blend has distilled the volume-weighted sum of what each crude has distilled.

The reason is physical. Take 55 barrels of one crude and 45 of the other and heat them to some temperature. Each crude gives up the fraction of its own volume that its own curve says it gives up at that temperature, and the barrels that come over are simply added together in the receiver. At the level of a screening assay, mixing does not change how many barrels of each crude boil below a given temperature. So the blend's volume percent at a temperature is each crude's volume percent at that temperature, weighted by its volume share.

That rule is what blendDistillationCurves applies. It holds the temperature fixed and weights the volume percents.

## Read it at one temperature

At 530 F the digest prints three figures on one row: Kwale Light has distilled 50.0000 percent, Ughelli Medium has distilled 35.8824 percent, and the blend has distilled 43.6471 percent. The last figure is the engine's volume-weighted sum of the first two at 55 and 45.

Notice what is held fixed on that row. It is the temperature. The engine asks each crude the same question, "how much of you is gone by 530 F", and weights the answers by volume.

## Why the weights are volume shares

The Associate tier taught that sulfur blends on mass because sulfur is a mass fraction. A TBP yield is a volume fraction: percent of the barrels. A volume fraction of a volume blend is weighted by volume shares, for the same reason a mass fraction of a blend is weighted by mass shares. Each property is weighted by the basis it is expressed on. The course's one sentence says it for yields directly: yields blend on volume off the curve.

Module 3 of this tier prints the cut yields weighted on mass beside the engine's, so the difference can be read in figures. For now the rule is enough.

## What the panel shows

The valuation explorer draws the Kwale blend's own curve beside its two crudes' curves. Move the share slider and watch the blend's curve move at every temperature. The temperatures on the axis do not move. Only the volume percents are weighted.

## Exercise

On the row at 720 F, the digest prints Kwale Light at 70.0000 percent, Ughelli Medium at 56.6667 percent and the blend at 64.0000 percent. Say which quantity blendDistillationCurves held fixed on that row, which it weighted, and on what basis it weighted it. Then say why that basis follows from what a TBP volume percent measures.
