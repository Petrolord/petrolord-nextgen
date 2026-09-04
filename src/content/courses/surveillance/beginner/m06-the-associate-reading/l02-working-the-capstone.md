# Working the capstone

A graded field asks for numbers, and every number it asks for is the return of a named function on stated rows. The work is identifying the function and the column before doing any arithmetic.

{{panel:pd-ledger-explorer}}

## Find the function that owns the field

Two functions cover everything in reach here. `derivePoint` sees one ledger row and nothing else, and returns rates and ratios off it. `computeKpis` sees a trailing window of field days and returns means, the two ratios of those means, an uptime and two counts. Neither takes a baseline, so a question about one row is the first and a question about a period on the whole field is the second.

## Check the hours before writing any rate

The published row of 2025-01-04, carrying 450.000000 stb of oil, 90.000000 stb of water, 225.000000 Mscf of gas and a null `hours_on`, returns a liquid of 540.000000000 stb, a watercut of 0.166666666667, a gas-oil ratio of 500.000000000 scf/stb and an oil producing-day rate of 450.000000000 stb/d. The rate equals the calendar volume there because a null hours column is read as uptime unknown and the volume is left unscaled. The two are the same number and they are not the same claim.

Zero hours behaves differently from a missing hours column. The published row of 2025-01-03, all volumes zero at 0.000000 hours, returns a null oil producing-day rate. The published row of 2025-01-05, no oil and no water but 120.000000 Mscf of gas at 24.000000 hours, returns an oil producing-day rate of 0.000000000 stb/d and a gas producing-day rate of 120.000000000 Mscf/d. Zero and null are two different answers and only one of them is a refusal.

## Name the reading before writing any ratio

A period watercut or gas-oil ratio has two defensible readings off identical rows. `computeKpis` and `buildFieldSeries` form theirs volumetrically, off sums or off means. `detectExceptions` forms an unweighted mean of the daily ratios. On the published well P-1 the gas-oil ratio rise is 70.033482142857 per cent one way and 42.737789203085 per cent the other. A ratio written without its reading is not an answer to anything.

## Units, and no rounding on the way

Oil and water volumes in stb over a row, gas in Mscf, producing-day rates in stb/d and Mscf/d, a gas-oil ratio in scf/stb, a surveillance watercut as a fraction between zero and one, an uptime as a per cent, hours in h and a window in days.

Grading compares the absolute difference between the answer and the expected value against a tolerance in that field's own units. It is not a percentage of anything, so a watercut carried as a fraction and a watercut carried as a per cent are not near misses of each other.

## The mistake

Answering a field question with a well figure. `buildFieldSeries` sums every row on a date and carries no well identity, while `buildWellSeries` keys on the well and drops any row carrying none, so the two can differ by exactly the rows nobody attached a well to.

## Exercise

Take the published rows of 2025-01-03, 2025-01-04 and 2025-01-05 in the panel and write out all five computed members for each.

Then say which member is null on which row, and give the condition that nulled it.
