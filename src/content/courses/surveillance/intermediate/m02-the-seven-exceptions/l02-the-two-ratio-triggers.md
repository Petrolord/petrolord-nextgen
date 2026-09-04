# The two ratio triggers

`watercut_rise` and `gor_rise` compare two ratios rather than two volumes, and a ratio has to be READ before it can be compared. The reading is chosen inside `detectExceptions` and never printed beside the answer.

{{panel:pd-exception-explorer}}

## Two triggers, two units

`watercutRisePts` defaults to 10 POINTS of watercut, doubling to high at 20. `gorRisePct` defaults to 30 PER CENT, doubling to high at 60. A watercut in surveillance is a 0 to 1 fraction and its rise is in points; a gas-oil ratio is in scf/stb and its rise is a percentage.

Both quantities come out of `windowMean` on the per-row `watercut` and `gor` keys, each formed in `derivePoint` from one row alone, so both are MEANS OF DAILY RATIOS. `computeKpis`, in the same file, forms the same two ratios volumetrically off the mean oil, water and gas. The published golden records that disagreement as a measured seam rather than resolving it, which is the right thing to have done and worth crediting.

On the published well P-1 the seam moves the printed severity on both ratios at once.

| Reading | GOR rise | Severity | Watercut rise | Severity |
| --- | --- | --- | --- | --- |
| Mean of daily ratios | 70.033482142857 per cent | high | 20.938677629325 points | high |
| Volumetric | 42.737789203085 per cent | medium | 18.603480205160 points | medium |

Neither row is wrong. One answers what a typical day of this well looked like, the other what the period produced, and the engine prints the first. The P-1 exceptions read `gor_rise` high, value = 1360.267857142857 scf/stb against a baseline of 800.000000000000, "GOR up 70%: 1,360 vs 800 scf/stb baseline.", and `watercut_rise` high, value = 0.561904761905 against 0.352517985612, "Watercut up 21 points: 56% vs 35% baseline."

## The gate is not the same on both

`minOilRate`, a default of 5, gates the gas-oil ratio check and does not gate the watercut check. The teaching well OGUTA-5, invented for this course and neither published nor real, sits under that gate with a baseline oil mean of 3.600000000000 stb, and still raises `watercut_rise` at high: value = 0.867469879518 against a baseline of 0.280000000000, "Watercut up 59 points: 87% vs 28% baseline."

## The mistake

Reading a ratio rise as evidence about volumes. On the teaching well OGUTA-2 the gas-oil ratio rise is 83.907484614181 per cent read as a mean of daily ratios and 11.250129499613 per cent read volumetrically, which is a HIGH exception against no exception at all on identical rows.

## What it refuses

`derivePoint` sets `watercut` to null on a row with no liquid and `gor` to null on a row with no OIL, however much gas the row made, so the two refuse on different conditions. `windowMean` skips the nulls, and a window of such rows yields a count of zero and no comparison at all rather than a zero ratio.

## Exercise

Read P-1 in the panel and write down its recent gas-oil ratio and its baseline.

Then say which of the two readings produced the printed severity, and what the other reading would have printed.
