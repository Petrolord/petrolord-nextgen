# Temperatures do not average

A distillation curve can be read in two directions, and only one of them blends.

{{panel:crude-valuation-explorer}}

## Two ways to read a curve

A TBP curve pairs a temperature with a volume percent. Kwale Light's curve says 50 at 530: by 530 F, half of the crude by volume has boiled off. Ughelli Medium's says 50 at 650.

You can read that pair as "at 530 F, the volume percent is 50", holding the temperature and reading an amount. Or you can read it as "the temperature at which 50 percent is gone is 530 F", holding the amount and reading a temperature. The curve is the same. The two readings behave differently when two crudes are mixed.

## Amounts add

A volume percent on the curve is a share of the barrels distilled. The digest states the engine's rule for it: "Yields are additive on volume: at any temperature the blend has distilled the volume-weighted sum of what each crude has distilled." So at a fixed temperature, the blend's volume percent is the volume-weighted sum of the crudes' volume percents.

## Temperatures do not add

The rule the digest gives is a rule for volume percents at a fixed temperature. It gives no rule that weights temperatures, and the engine applies none. In the digest's words, blendDistillationCurves forms the blend's curve "at every temperature any component measured". It does not average temperatures.

So blendDistillationCurves forms the blend's curve at every temperature any component measured, weights the volume percents at each one, and leaves the temperatures exactly as the crudes reported them.

## What the two rows say

Read the blend's curve at the two temperatures where each crude reaches 50 percent.

| temperature F | Kwale Light volume percent | Ughelli Medium volume percent | blend volume percent (blendDistillationCurves) |
| --- | --- | --- | --- |
| 530 | 50.0000 | 35.8824 | 43.6471 |
| 650 | 62.6316 | 50.0000 | 56.9474 |

At 530 F, Kwale Light has reached 50.0000 percent and the blend has distilled 43.6471 percent. At 650 F, Ughelli Medium has reached 50.0000 percent and the blend has distilled 56.9474 percent. Neither crude's own 50 percent temperature is a temperature at which the blend stands at 50 percent. The blend has a 50 percent temperature of its own, and it has to be read off the blend's own curve.

## Where this goes next

Module 2 reads that temperature. It prints the engine's reading off the blend's curve beside the volume-weighted mean and the mass-weighted mean of the two crudes' own 50 percent temperatures, so the averaged temperature can be read as a figure and set against the engine's. This lesson only establishes what the engine does: it weights volume percents at fixed temperatures, and it leaves the temperature axis as the crudes reported it.

## Where the cuts come from

A cut's yield is read off a curve at two temperatures: in the Associate tier's words, the curve at the cut's upper bound minus the curve at its lower bound. Both readings are volume percents at fixed temperatures, which is the form in which the blend's curve is built. Module 3 of this tier takes the Kwale blend's cut yields off that curve, and the digest prints them beside the same yields weighted on volume from the two crudes.

## Exercise

Read the two rows above. At 530 F and at 650 F, name which crude has reached 50.0000 percent and what the blend has distilled at that temperature. Then say what those four figures show about taking either crude's own 50 percent temperature as the temperature at which the blend stands at 50 percent.
