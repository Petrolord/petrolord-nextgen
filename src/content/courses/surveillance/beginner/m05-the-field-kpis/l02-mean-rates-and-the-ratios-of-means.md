# Mean rates and the ratios of means

A KPI is not a measurement. It is a reading, and the reading was chosen by whoever wrote the function. `computeKpis` and `detectExceptions` sit in one file, form the same two ratios out of the same rows, and get different numbers.

{{panel:pd-ledger-explorer}}

## What computeKpis does, in order

Mean of the field oil, mean of the field water, mean of the field gas, over the days in the window. Then liquid is the oil mean plus the water mean, the watercut is water over oil plus water as a fraction, and the gas-oil ratio is gas times 1000 over oil in scf/stb. The ratios are formed off means, which makes them volume weighted by construction. Published on the surveillance case at `windowDays` of 7: liquid 2931.428571429 stb/d, watercut 0.337719298246, gas-oil ratio 749.963208241 scf/stb. At 30 days: liquid 2615.666666667 stb/d, watercut 0.294125143367, gas-oil ratio 675.248239754 scf/stb.

`detectExceptions` does something else. It calls `windowMean` on the `gor` and `watercut` members of each point, and each of those was formed in `derivePoint` from one row alone. The result is an unweighted arithmetic mean of daily ratios, in which a day that made almost nothing speaks as loudly as a day that made everything.

## The size of the disagreement, published

`surveillance_cases.json` publishes the seam as a measured disagreement rather than as an expected value, on well P-1, recent window 2025-06-24 to 2025-06-30 against a baseline of 2025-05-25 to 2025-06-23.

| Reading | Baseline GOR | Recent GOR | Rise | Severity |
| --- | --- | --- | --- | --- |
| Mean of daily ratios | 800.000000000000 | 1360.267857142857 | 70.033482142857 per cent | high |
| Volumetric | 800.000000000000 | 1141.902313624679 | 42.737789203085 per cent | medium |

All four gas-oil ratios are scf/stb. The overstatement of one reading over the other is 19.122961825433 per cent, measured against a `gorRisePct` trigger of 30 with the doubling to high at 60.

The watercut on the same well does the same thing. Both readings put the baseline at 0.352517985612; the recent window is 0.561904761905 read as a mean of daily ratios and 0.538552787663 read volumetrically, a rise of 20.938677629325 points against 18.603480205160 points, and again high against medium.

## Neither reading is wrong

A mean of daily ratios answers what a typical day of this field looked like. A ratio of sums answers what the period produced. A surveillance tool needs the first to notice a well that has changed and the second to book a barrel, and both are shipped. They agree exactly over a window whose daily ratios do not move, which is why the P-1 baseline reads 800.000000000000 scf/stb both ways, and they diverge in proportion to how much of a window a low-rate day speaks for.

## The mistake

Quoting a field gas-oil ratio or watercut without naming which of the two it is. The number is not enough to identify it, and on P-1 the choice between them is the whole difference between a printed high and a printed medium.

## Exercise

Write down the two recent gas-oil ratio readings on P-1 and the per cent rise each one gives.

Then say which of the two functions produced which, and what a low-rate day does to a mean of daily ratios.
