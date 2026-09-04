# What surveillance is for

Nothing in `surveillance.js` measures a well. Every number it returns is a comparison of a well against a reading of itself over an earlier window, so the strongest thing the module can say is that something changed.

## Two windows, one well, no verdict

`detectExceptions` anchors every window on the field's latest ledger date and never on the wall clock, so an old dataset surveils honestly instead of declaring every well stale. The published case is a seven-well field of 268 ledger rows over 51 field days with an asOf of 2025-06-30. At the default settings the derived window arithmetic puts the recent window at 2025-06-24 to 2025-06-30, which is 7 days, and the baseline window at 2025-05-25 to 2025-06-23, which is 30 days. The two are half open and do not overlap, so a boundary day belongs to the earlier of the two.

Both lengths are settings. `DEFAULT_SURVEILLANCE_SETTINGS` carries `recentDays` = 7 and `baselineDays` = 30, and each well widens them on its own ledger cadence, so two wells on one field can be compared over different windows and nothing in the return says which window a row used.

## What a returned exception is

The golden commits nine exceptions on those seven wells. One is well P-5, type `rate_drop`, severity high, value 100.000000000000 against a baseline of 300.000000000000, and the shipped engine prints "Oil down 67%: 100 vs 300 stb/d baseline."

Read the two numbers before the severity. They are window means of the calendar oil volume booked on each ledger row. A severity is not a measurement: high, medium and info are the names of two threshold crossings, and `rateDropPct` is 20 per cent with the doubling to high at 40.

## The quantity a rate flag is not about

The teaching field OGUTA was invented for this course and is neither real nor published. Its well OGUTA-6 holds the producing-day oil rate at 512.000000000000 stb/d on every one of its seven recent days, because only the hours move. Over those same rows the mean calendar oil volume falls from 502.666666666667 stb in the baseline window to 307.504761904762 stb in the recent window, a fall of 38.825312618416 per cent, and the engine raises `rate_drop` at medium with the message "Oil down 39%: 308 vs 503 stb/d baseline." Read as a producing-day rate the same seven rows give -1.856763925729 per cent.

## The mistake

Reading the returned list as a ranking of how bad the wells are. The sort key is severity, high 0, medium 1 and info 2, then `String(wellName).localeCompare`, and nothing else, so position carries no information about size.

## Exercise

Write down the recent and the baseline window dates for the published field at the default settings, and say which of the two owns the boundary day.

Then say what quantity the 502.666666666667 and 307.504761904762 figures on OGUTA-6 are means of, and what that well's producing-day oil rate did across the same rows.
