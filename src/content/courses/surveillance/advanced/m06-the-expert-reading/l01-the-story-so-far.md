# The story so far

Five modules, one claim: a surveillance number is a reading of a period, and the reading was chosen by whoever wrote the call.

## What each module established

**Module 1.** `computeKpis` forms a period watercut and gas-oil ratio volumetrically, off means. `detectExceptions` forms the same two as the mean of the daily ratios. On the published series the gas-oil ratio rise is 70.033482142857 per cent one way and 42.737789203085 the other, an overstatement of 19.122961825433 per cent, which is a printed high against a printed medium. On the teaching well the same seam is 83.907484614181 per cent against 11.250129499613, a high against no exception at all. The golden commits the size of the gap rather than picking a winner.

**Module 2.** `detectExceptions` sets `rateKey` to `oil`, the calendar volume. The producing-day rate is computed on every point as `oilPd`, `waterPd`, `gasPd` and `liquidPd` and is read by one function in the file, the decline overlay. On the teaching well the calendar oil mean falls from 502.666666666667 stb to 307.504761904762 stb and is reported as a 38.825312618416 per cent drop, while the producing-day oil rate goes from 502.666666666667 stb/d to 512.000000000000 stb/d, a rise of 1.856763925729 per cent. The mean recent hours are 14.414285714286 h against a `downtimeHours` threshold of 12, so the exception that would have named the cause does not fire.

**Module 3.** A missing value has four spellings. A volume that arrived as text understates a row's watercut and overstates its liquid producing-day rate by a factor of 800.200000000, while the same row's gas-oil ratio and oil producing-day rate stay exactly right. Four identical rows of 800 stb make a field oil total of 800800800800.000000000 stb. An absent hours column is uptime unknown in surveillance and a full 24 h in allocation. And `!b` is true for NaN, so a hyperbolic fit with an unusable exponent returns 42.160601062199 per cent, the exponential answer at the same Di.

**Module 4.** `minOilRate` gates the rate check and the gas-oil ratio check and not the watercut check. The downtime branch reports 0.10 h and refuses 0.00 h. Setting `maxTestAgeDays` to zero turns the age check off: theoretical oil 65033.920833333 stb against 39172.000000000 stb at 60 days, with the last day oil factor at 0.909283141463, nearer to one than the default's 1.190463125091. And a guard that cannot read a rod loading prints "NaN % of Goodman" and passes.

**Module 5.** One rate reaches two modules that disagree about its phase. On the published seam 300.000000000 bbl/d of oil at a 70.000000 per cent water cut is 1000.000000000000 bbl/d of liquid, and the rod pump moves forty points. On the teaching well plunger lift loses 45 points at an oil rate of 200.000000 bbl/d.

## The one sentence

Every number here answers a question about a window, and the question is set by which column was read, over which days, by which of two functions that form the same quantity differently.
