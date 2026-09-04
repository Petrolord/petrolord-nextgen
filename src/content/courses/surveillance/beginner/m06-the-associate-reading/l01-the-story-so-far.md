# The story so far

One row in, rates and ratios out. Many rows in, a field day out. A window of field days in, a handful of KPIs out. Not one of those steps compares anything to anything.

## The row

`derivePoint` returns fourteen keys, nine copied through unchanged and five computed, and every one of the five can be null. Liquid is oil plus water, a volume in stb over the row. The watercut is water over liquid, a fraction. The gas-oil ratio is gas times 1000 over oil, in scf/stb, and that 1000 is the only unit conversion in the file. The four producing-day rates scale the row's volume to twenty-four hours.

The published row of 500.000000 stb of oil, 100.000000 stb of water and 250.000000 Mscf of gas over 12.000000 hours makes the split plain: a liquid of 600.000000000 stb, a watercut of 0.166666666667 and a gas-oil ratio of 500.000000000 scf/stb, alongside an oil producing-day rate of 1000.000000000 stb/d and a liquid producing-day rate of 1200.000000000 stb/d. The volumes and the rates are different quantities off one row.

The refusals differ per member. The published row with every volume zero and zero hours returns a liquid of 0.000000000 stb, a null watercut, a null gas-oil ratio and a null oil producing-day rate. A derived row of 0.0 stb of oil, 400.0 stb of water and 200.0 Mscf of gas returns a watercut of 1.000000000000 and a gas-oil ratio of null.

## The field

`buildFieldSeries` sums by date, then divides. Both field ratios are volumetric, formed off the sums. Aggregation is a choice, and the choice shows when it goes wrong. In a derived demonstration, four ledger rows of 800 stb typed as text give a field oil of 800800800800.000000000 stb where the same rows as numbers give 3200.000000000 stb, because the accumulator concatenated instead of adding.

## The KPIs

`computeKpis` averages a trailing date window and forms ratios off the means. On the published field at 7 days that is an oil of 1941.428571429 stb/d, an uptime of 44.444444444 per cent, a `wellCount` of 7 and a `producerCount` of 6.

Read the convention rather than the number. `detectExceptions` forms the same watercut and gas-oil ratio as an unweighted mean of daily ratios, and on well P-1 the two readings differ by 19.122961825433 per cent on the gas-oil ratio rise.

## The mistake this whole tier is aimed at

Treating a returned number as a fact about a well. Every number so far is a reading of a period made by a named function under a stated convention, and the number alone does not carry which function, which window or which convention produced it.

## Exercise

Write down, from memory, which five members of a derived point can be null and the condition that nulls each one.

Then say which of `buildFieldSeries` and `detectExceptions` reads a period watercut volumetrically.
