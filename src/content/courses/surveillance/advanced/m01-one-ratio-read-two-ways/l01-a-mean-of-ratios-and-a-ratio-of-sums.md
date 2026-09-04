# A mean of ratios and a ratio of sums

Two functions in `surveillance.js` form the same period watercut and the same period gas-oil ratio out of the same rows, and they form them differently. On the published series the two answers for one week are 19.122961825433 per cent apart.

{{panel:pd-reading-explorer}}

## Which function holds which formula

`detectExceptions` calls `windowMean(points, "gor", ...)` and `windowMean(points, "watercut", ...)`. Every point ratio was formed in `derivePoint` out of one row and nothing else, and the window mean is an unweighted arithmetic mean of those daily ratios. Nothing in that mean is weighted by volume, so a day on which the well barely produced counts exactly as much as the full day beside it, and a collapsed day speaks for a seventh of the window.

`computeKpis` takes the mean of the field oil, the mean of the field water and the mean of the field gas over its window, and only then forms water over liquid and gas times 1000 over oil off those means. It is volume weighted by construction. `buildFieldSeries` is volumetric too, per day, across the whole field at once.

## The published seam, well P-1

Golden values, recent window 2025-06-24 to 2025-06-30 against a baseline window 2025-05-25 to 2025-06-23.

| Reading | Mean of daily ratios | Volumetric |
| --- | --- | --- |
| Baseline gas-oil ratio, scf/stb | 800.000000000000 | 800.000000000000 |
| Recent gas-oil ratio, scf/stb | 1360.267857142857 | 1141.902313624679 |
| Rise, per cent | 70.033482142857 | 42.737789203085 |
| Baseline watercut, fraction | 0.352517985612 | 0.352517985612 |
| Recent watercut, fraction | 0.561904761905 | 0.538552787663 |
| Rise, points | 20.938677629325 | 18.603480205160 |

The golden records the gas-oil ratio overstatement as 19.122961825433 per cent. Derived on the same case, the rise read one way is 1.638678168636 times the rise read the other.

## A disagreement committed rather than resolved

`surveillance_cases.ratioSeam` is the unusual kind of golden: it does not commit one reading as the expected answer and the other as an error. It commits the size of the gap. Both readings are in the shipped studio, so picking one would move numbers a running application already prints, and the gate holds the measurement while the choice waits on an owner.

## The mistake

Quoting 1360.267857142857 scf/stb as the week's gas-oil ratio and 1141.902313624679 scf/stb as a rounding of it. They are two quantities. The first answers what a typical day of this well looked like. The second answers what this period actually produced, and only the second can be multiplied by the days to get a volume of gas.

## What neither return says

No field in an exception row and no field in a KPI return names the reading it used. `detectExceptions` returns a type, a severity, a value and a baseline; `computeKpis` returns `watercut` and `gor` with no note that they were formed off means. The engine's own header states the seam, and the header is not on the screen.

## Exercise

Read P-1 in the panel and write down the recent gas-oil ratio both ways.

Then say which of the two you would multiply by the number of days in the window to book the gas, and why the other one cannot be used for that.
