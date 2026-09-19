# Temperatures do not average

A distillation curve can be read in two directions, and only one of them blends.

{{panel:crude-valuation-explorer}}

## Two ways to read a curve

A TBP curve pairs a temperature with a volume percent. Kwale Light's curve says 50 at 530: by 530 F, half of the crude by volume has boiled off. Ughelli Medium's says 50 at 650.

You can read that pair as "at 530 F, the volume percent is 50", holding the temperature and reading an amount. Or you can read it as "the temperature at which 50 percent is gone is 530 F", holding the amount and reading a temperature. The curve is the same. The two readings behave differently when two crudes are mixed.

## Amounts add

A volume percent is an amount: a share of the barrels. When 55 barrels of Kwale Light and 45 of Ughelli Medium are heated to one temperature, the barrels each crude gives up are added in the receiver. So at a fixed temperature, the blend's amount is the volume-weighted sum of the crudes' amounts. The digest states it as the engine's rule: yields are additive on volume.

## Temperatures do not add

A temperature is not an amount of anything. There is no receiver in which the 530 F of one crude and the 650 F of the other are poured together. Averaging the temperatures at which each crude reaches 50 percent is an operation on the curve's other axis, and nothing physical sits behind it.

So blendDistillationCurves never averages temperatures. It forms the blend's curve at every temperature any component measured, weights the volume percents at each one, and leaves the temperatures exactly as the crudes reported them.

## What the two rows say

Read the blend's curve at the two temperatures where each crude reaches 50 percent.

| temperature F | Kwale Light volume percent | Ughelli Medium volume percent | blend volume percent (blendDistillationCurves) |
| --- | --- | --- | --- |
| 530 | 50.0000 | 35.8824 | 43.6471 |
| 650 | 62.6316 | 50.0000 | 56.9474 |

At 530 F, Kwale Light has reached 50.0000 percent and the blend has distilled 43.6471 percent. At 650 F, Ughelli Medium has reached 50.0000 percent and the blend has distilled 56.9474 percent. Neither crude's own 50 percent temperature is a temperature at which the blend stands at 50 percent. The blend has a 50 percent temperature of its own, and it has to be read off the blend's own curve.

## Where this goes next

Module 2 reads that temperature. It prints the engine's reading off the blend's curve beside the volume-weighted mean and the mass-weighted mean of the two crudes' own 50 percent temperatures, so the averaged temperature can be read as a figure and set against the engine's. This lesson only establishes why the engine will not form the blend's curve by averaging along the temperature axis: the thing that adds is the amount.

## Why it matters to a buyer

A refinery sells cuts, and a cut is a band of temperature. What it needs to know is how many barrels of the blend fall inside each band. That is a question about amounts at fixed temperatures, which is exactly the form in which the blend's curve is built. A curve assembled by averaging temperatures would place each band's barrels by an operation with no physical meaning, and every cut yield taken from it would inherit that.

## Exercise

Read the two rows above. At 530 F and at 650 F, name which crude has reached 50.0000 percent and what the blend has distilled at that temperature. Then say what those four figures show about taking either crude's own 50 percent temperature as the temperature at which the blend stands at 50 percent.
