# A truncated crude in the blend

Some assays stop before the crude does. When one of them goes into a blend, the blend's curve stops too.

{{panel:crude-valuation-explorer}}

## The Ebocha partial assay

The Associate library carries one partial assay, invented like everything else in this course. Its TBP curve reads 4 at 110; 25 at 370; 50 at 590; 70 at 760; 88 at 920. The first measured point is 4 percent, and the last is 88 percent. Nothing is recorded below 110 F or above 920 F.

That shape matters because of the rule the Associate tier set for reading outside a curve. Below a first point at 0 percent, nothing has distilled, so the answer is known. Above a last point at 100 percent, everything has, so that answer is known too. The Ebocha curve does neither. Its first point is at 4 percent, so how much of it boiled below 110 F, and at what temperatures, is unknown. Its last point is at 88 percent, so the curve says nothing about the heaviest part of the crude above 920 F. There, volumePercentAt returns unknown.

## Blending it with Kwale Light

Take Kwale Light and the Ebocha partial assay, 50 and 50. Between them the two crudes measured 11 temperatures. At some of those temperatures Kwale Light is known and Ebocha is unknown.

The blend's value at a temperature is the volume-weighted sum of what each crude has distilled there. If one of the two terms is unknown, the sum is unknown. So blendDistillationCurves leaves that temperature out, because the blend's value there is not known either. It keeps only the temperatures where both crudes are known.

| temperature F | blend volume percent |
| --- | --- |
| 110 | 3.5217 |
| 190 | 10.2308 |
| 370 | 27.5000 |
| 530 | 46.5909 |
| 590 | 53.1579 |
| 720 | 67.6471 |
| 760 | 71.2903 |
| 920 | 85.4516 |

The lab prints the count: of 11 temperatures the two crudes measured between them, the blend's curve keeps 8. The three Kwale Light temperatures missing from the table are 75, 1030 and 1350 F, each outside the stretch from 110 F to 920 F where Ebocha says anything.

## The reason the course gives

The course gives the reason in one sentence: "A temperature at which some crude's curve says nothing is left out, because the blend's value there is not known either." Ebocha's curve says nothing at 75, 1030 or 1350 F. Its first point is 4 at 110, which is not 0 percent, and its last is 88 at 920, which is not 100 percent, so the Associate tier's rule gives it no reading outside that stretch: the value is unknown. The engine does not read Ebocha as 0 percent below 110 F or as 100 percent above 920 F.

Leaving the temperature out keeps the blend's curve to what is known. The blend's curve here starts at 110 F with 3.5217 percent and stops at 920 F with 85.4516 percent.

## What follows downstream

A shorter curve has consequences for every question asked of it. Module 3 of this tier draws Kwale's cuts on this blend and shows which ones the curve cannot answer, and how the engine names them. For now, notice only that the blend inherits the truncation of its least complete crude: the blend is known only where every component is known.

## Exercise

Read the Ebocha partial assay's first and last TBP points, 4 at 110 and 88 at 920, and the blend's first and last points in the table. Say why the blend's curve starts and stops at those two temperatures, and quote this lesson's reason for leaving out the rows at 75, 1030 and 1350 F.
