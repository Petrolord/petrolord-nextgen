# Yields add on volume

A modular refinery in Delta State is offered two crudes and has to decide what the mixture will turn into. This tier answers that question, and it starts from one rule about barrels.

{{panel:crude-valuation-explorer}}

## The Kwale offer

KWALE is an invented topping refinery. It is offered Kwale Light and Ughelli Medium, 55 and 45 by volume. Every figure in this tier is illustrative: the streams are invented, the prices are invented, and neither crude is a real grade.

| crude | API | SG (computed) | sulfur wt% | TBP points (volume percent at F) |
| --- | --- | --- | --- | --- |
| Kwale Light | 38.4 | 0.8328 | 0.11 | 0 at 75; 10 at 190; 30 at 370; 50 at 530; 70 at 720; 90 at 1030; 100 at 1350 |
| Ughelli Medium | 27.1 | 0.8922 | 0.36 | 0 at 90; 10 at 265; 30 at 480; 50 at 650; 70 at 860; 90 at 1200; 100 at 1470 |

The Associate tier already blended the properties of a pair like this. The engine reports blend API 33.1219, SG 0.8595 and sulfur 0.2268 wt% on a mass basis. Those are single numbers. The first question the course sets for the studio is a different one, "what does this barrel turn into", and its answer is read off a curve.

## One rule

Yields are additive on volume. At any temperature, the blend has distilled the volume-weighted sum of what each crude has distilled. This course states the rule in those words, and it is the only reason given. So the blend's volume percent at a temperature is each crude's volume percent at that temperature, weighted by its volume share.

That rule is what blendDistillationCurves applies. It holds the temperature fixed and weights the volume percents.

## Read it at one temperature

At 530 F the lab prints three figures on one row: Kwale Light has distilled 50.0000 percent, Ughelli Medium has distilled 35.8824 percent, and the blend has distilled 43.6471 percent. The last figure is the engine's volume-weighted sum of the first two at 55 and 45.

Notice what is held fixed on that row. It is the temperature. The engine asks each crude the same question, "how much of you is gone by 530 F", and weights the answers by volume.

## The weights are volume shares

The Associate tier read sulfur and the other per-mass properties blended on mass, with the basis cell reading "mass". The course puts yields on the other basis in its first sentence for this tier: "Yields are additive on volume." The curve's own heading says what each point is, the volume percent distilled at each temperature, and the weights the engine applies to those points are the volume shares, 55 and 45.

Module 3 of this tier prints the cut yields weighted on mass beside the engine's, so the difference can be read in figures. For now the rule is enough.

## What the panel shows

The valuation explorer draws the Kwale blend's own curve beside its two crudes' curves. Move the share slider and watch the blend's curve move at every temperature. The temperatures on the axis do not move. Only the volume percents are weighted.

## Exercise

On the row at 720 F, the lab prints Kwale Light at 70.0000 percent, Ughelli Medium at 56.6667 percent and the blend at 64.0000 percent. Say which quantity blendDistillationCurves held fixed on that row, which it weighted, and on what basis it weighted it. Then quote this lesson's sentence that names that basis.
