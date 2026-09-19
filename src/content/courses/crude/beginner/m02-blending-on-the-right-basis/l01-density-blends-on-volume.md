# Density blends on volume

Every property of a blend has its own rule. The first rule, and the one every other rule leans on, is the rule for density. blendCrudes blends specific gravity on volume.

{{panel:crude-assay-explorer}}

## Why volume is the right basis for density

Specific gravity is the density of a crude relative to water. Density is mass divided by volume. Pour two crudes together and the mass of the mixture is the sum of the two masses: mass is conserved. The engine takes volume as conserved as well, so the volume of the mixture is the sum of the two volumes. Under those two statements, the density of the mixture is the total mass over the total volume, and that is the volume-weighted average of the two densities.

So specific gravity is the one gravity number that mixes on a straight line, and the weights on that line are volume fractions. A crude that makes up 65 percent of the barrels counts for 65 percent of the specific gravity average.

## The blends in this module

The engine returns these blend specific gravities.

| blend (by volume) | blend SG |
| --- | --- |
| A 20 API crude and a 40 API crude, 50 and 50 | 0.8795 |
| Obigbo Light and Egbema Medium, 65 and 35 | 0.8611 |
| Asarama Heavy and Ubie Condensate, 50 and 50 | 0.8560 |
| Obigbo Light, Egbema Medium and Asarama Heavy, 50, 30 and 20 | 0.8804 |

The second row is the one this tier returns to again and again. Obigbo Light and Egbema Medium at 65 and 35 by volume is the Obigbo export blend. Obigbo Light has a specific gravity of 0.8408 and Egbema Medium one of 0.8990, and the engine gives the blend 0.8611.

## Where this rule stops

"Volume is taken as conserved" is an assumption, and the engine states it as one. Real crudes of very different gravity can shrink a little when they mix, because the light molecules fit between the heavy ones. The engine does not model that shrinkage. Every blend in this course is computed under the stated assumption, and every figure you read is the engine's answer under it.

## Why density comes first

Everything else in the blend depends on this step. The next lesson turns the blended specific gravity into API. The lesson after it uses each crude's specific gravity to turn volume shares into mass shares, and the per-mass properties are weighted by those mass shares. Get density wrong and every property downstream of it moves.

That dependence is why blendCrudes refuses a crude with no gravity. A crude with neither an API nor a specific gravity cannot be weighted at all, and the engine says so in its own words: "No API or specific gravity for Egbema Medium. Every property here is weighted by density."

## Reading the result

In the assay explorer, build the export blend at 65 and 35. The specific gravity row carries the basis the engine names for it: volume. Move the slider and watch the specific gravity move. Then move it back to 65 and 35 and confirm the figure matches the table.

## Exercise

Quote the specific gravity of Obigbo Light, the specific gravity of Egbema Medium and the specific gravity the engine gives their blend at 65 and 35. Explain which two conservation statements make specific gravity blend on volume, and say which of the two is an assumption the engine states rather than a law.
