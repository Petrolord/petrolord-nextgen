# Where each ratio refuses

A watercut needs liquid and a gas-oil ratio needs oil, so the two refuse on different conditions and a row can easily have one of them and not the other.

{{panel:pd-ledger-explorer}}

## The two conditions

`watercut` is null when the row's liquid is not above zero. `gor` is null when the row's oil is not above zero. A constructed row of 0.0 stb of oil, 400.0 stb of water and 200.0 Mscf of gas has a `liquid` of 400.000000 stb, a `watercut` of 1.000000000000 and a `gor` of null, however much gas it booked.

A row that made neither oil nor water refuses both, and the published golden commits one. 2025-01-05 books 0.000000 stb of oil, 0.000000 stb of water, 120.000000 Mscf of gas and 24.000000 hours, and returns `watercut` = null and `gor` = null with a `gasPd` of 120.000000000 Mscf/d. The gas is measured, the rate it feeds is computed, and neither ratio exists.

## A correction row is arithmetic, not a refusal

A negative volume is how a ledger books a back-out, and nothing in `derivePoint` rejects one.

| oil, stb | water, stb | gas, Mscf | liquid, stb | watercut | gor, scf/stb |
| --- | --- | --- | --- | --- | --- |
| -500.0 | 200.0 | 400.0 | -300.000000 | null | null |
| 800.0 | -900.0 | 400.0 | -100.000000 | null | 500.000000000 |

Both constructed rows return a negative liquid and a null watercut, because the liquid is not above zero. The second returns a perfectly ordinary gas-oil ratio of 500.000000000 scf/stb, because that ratio never looks at the water. So a correction row is silently refused on one ratio and silently answered on the other, and that answer looks like a good day's.

## What a null does to a window mean

`detectExceptions` forms a window mean over the finite values in the window, so a null row is skipped rather than counted as a zero. The consequence is that a mean can rest on fewer rows than the window holds. On the teaching well OGUTA-2, invented for this course and neither real nor published, the recent watercut read as a mean of daily ratios is 0.451386451920 over 7 rows and the baseline read the same way is 0.236641221374 over 30 rows, and how many rows a mean was taken over is not printed beside it anywhere a studio user sees.

## The mistake

Filling a null ratio with a zero before plotting it. A null watercut means the row made no liquid. A zero watercut means the row made liquid and none of it was water. The published row of 2025-01-05 is the first and a constructed row of 400.0 stb of oil and 0.0 stb of water is the second, and a chart that draws them at the same height has stated something the engine refused to state.

## Exercise

Build a row of 0.0 stb of oil, 400.0 stb of water and 200.0 Mscf of gas in the panel and record the watercut and the gas-oil ratio.

Then say which of the two refused, and on what condition.
