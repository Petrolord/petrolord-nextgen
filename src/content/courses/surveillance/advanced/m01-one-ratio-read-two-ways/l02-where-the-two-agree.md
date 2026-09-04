# Where the two agree

The two readings are not always two numbers. Over the baseline window of the published seam well the mean of the daily gas-oil ratios and the volumetric gas-oil ratio are both 800.000000000000 scf/stb, and the difference is not small, it is nothing.

{{panel:pd-reading-explorer}}

## The published baseline, well P-1

`surveillance_cases.ratioSeam` publishes the baseline window 2025-05-25 to 2025-06-23 beside the recent one, and the baseline is where the golden is quiet. The gas-oil ratio read as a mean of daily ratios is 800.000000000000 scf/stb and read volumetrically is 800.000000000000 scf/stb. The watercut is 0.352517985612 as a fraction under both readings.

A reader who checks that column alone concludes that `detectExceptions` and `computeKpis` hold the same formula.

## What the agreement is made of

OGUTA is a field this course invented and is not a published case. Its seam well OGUTA-2 carries a baseline of 30 rows holding 31167.000000000 stb of oil, 9661.770000000 stb of water and 18076.860000000 Mscf of gas. Read as a mean of daily ratios the baseline gas-oil ratio is 580.000000000000 scf/stb, read volumetrically 580.000000000000 scf/stb, and the printed difference is -0.000000000000. The watercut is 0.236641221374 both ways, difference 0.000000000000.

The oil is not constant across those rows. Four consecutive baseline days, 2024-09-12 through 2024-09-15, book 1042.000000, 1019.000000, 1063.000000 and 1031.000000 stb of oil, and every one of them carries a watercut of 0.236641221374 and a gas-oil ratio of 580.000000000 scf/stb, because the construction holds the water at 0.31 of the oil and the gas at 0.58 Mscf per stb.

Weighting by volume can only move an average of numbers that differ.

## Both ends of a sweep, and only the ends

A teaching sweep builds a seven-day window from two day shapes and collapses k of them. At 0 of 7 collapsed the gas-oil ratio is 580.357142857143 scf/stb under both readings, a ratio of 1.000000000000, and the watercut is 0.236363636364 both ways at a difference of 0.000000000000. At 7 of 7 collapsed it is 1719.512195121951 scf/stb under both readings, again a ratio of 1.000000000000, and the watercut is 0.738019169329 both ways at a difference of 0.000000000000.

Uniformity buys the agreement, not smallness and not a steady rate. Seven collapsed days are a wrecked well and the two readings still match exactly.

## The mistake

Validating the two functions against each other on a clean stretch of ledger and recording that they agree. Both of those agreements are genuine and neither is evidence. A window sampling only days of one shape can never separate a mean of daily ratios from a ratio of sums.

## What neither return says

`detectExceptions` returns a type, a severity, a value and a baseline. `computeKpis` returns `watercut` and `gor`. Neither carries a field naming the reading that formed the number, so 800.000000000000 scf/stb arrives with no way to tell whether the choice mattered on those rows.

## Exercise

Read the OGUTA-2 baseline in the panel and record the gas-oil ratio under both readings.

Then move one baseline day's gas without touching its oil, and say which reading shifts further and why.
