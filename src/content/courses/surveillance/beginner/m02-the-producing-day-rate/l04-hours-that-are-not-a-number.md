# Hours that are not a number

`derivePoint` tests the hours column with `Number.isFinite(row.hours_on)`. Anything that fails that test is read as uptime unknown, and the producing-day rate falls back to the calendar volume.

{{panel:pd-ledger-explorer}}

## Five spellings that all mean unknown

A derived sweep on one constructed row of 600 stb of oil, changing only how the hours column is written.

| hours_on | hoursOn returned | oilPd, stb/d |
| --- | --- | --- |
| null | null | 600.000000000 |
| undefined | null | 600.000000000 |
| NaN | null | 600.000000000 |
| the string "12" | null | 600.000000000 |
| the string "" | null | 600.000000000 |

The fourth row is the one to look at. A ledger that arrived from a spreadsheet with the hours column typed as text carries a perfectly readable twelve, and the module reads it as no information at all and returns 600.000000000 stb/d where a numeric 12.0 on the same row gives 1200.000000000 stb/d. Nothing anywhere reports that the column was text.

The published golden shows the fallback on a committed row: 2025-01-04 books 450.000000 stb of oil with `hours_on` = null, and returns `oilPd` = 450.000000000 stb/d, `liquid` = 540.000000000 stb and `liquidPd` = 540.000000000 stb/d. The volume and the rate are the same number and they are not the same claim.

## Numbers that pass the test and are still wrong

Nothing clamps the hours to twenty-four. A meter reporting cumulative hours instead of hours in the day scales the rate downwards.

| hours_on, h | oilPd, stb/d | ratio to the calendar volume |
| --- | --- | --- |
| 26.0 | 553.846153846 | 0.923076923 |
| 30.0 | 480.000000000 | 0.800000000 |
| 36.0 | 400.000000000 | 0.666666667 |
| 48.0 | 300.000000000 | 0.500000000 |
| 168.0 | 85.714285714 | 0.142857143 |

Every ratio in that column is below one, and a producing-day rate below the calendar volume of its own row is a thing a producing-day rate cannot be. That is the cheapest available check on an hours column and no function in the module makes it.

## The mistake

Treating unknown hours and a full day as the same input because they give the same number. On that constructed row `oilPd` is 600.000000000 stb/d for a null and 600.000000000 stb/d for a stated 24.0, and one of those is a measurement while the other is an absence. `computeAllocation` tests the identical column with the identical `Number.isFinite` and falls back to 24 rather than to null, so the two files carry the same silence into two different claims. On a constructed row put through both, a null hours column gives an allocation uptime of 1.000000000, which is a full day on.

## Exercise

Write the hours column on the constructed row as the string "12", then as the number 12.0, and record `oilPd` for each.

Then say which of the two answers a reader would be shown with no warning, and by what factor it differs from the other.
