# What these engines refuse

A refusal is a returned null with a reason behind it. `derivePoint` has three of them on a single row, and the more interesting list is what it declines to refuse.

{{panel:pd-ledger-explorer}}

## The three refusals on one row

`watercut` is null when the row made no liquid. `gor` is null when the row made no oil, however much gas the row booked. The four producing-day rates are null when `hours_on` is zero, and that is the single most important refusal in the module: an Infinity there would propagate into every window mean downstream and turn a shut-in day into a fabricated record rate.

The published row of 2025-01-03 books 0.000000 stb of oil, 0.000000 stb of water, 0.000000 Mscf of gas and 0.000000 hours, and the golden commits `liquid` = 0.000000000 stb, `watercut` = null, `gor` = null and `oilPd` = null. The published row of 2025-01-05 books zero oil, zero water, 120.000000 Mscf of gas and a full 24.000000 hours, and returns `watercut` = null, `gor` = null, `oilPd` = 0.000000000 stb/d and `gasPd` = 120.000000000 Mscf/d. A null and a zero say different things and those two rows show both.

## What is not refused: the hours column

Nothing clamps `hours_on` to twenty-four. A derived sweep on one constructed row of 600 stb of oil sets the hours to 26.0 and gets back `hoursOn` = 26 with an `oilPd` of 553.846153846 stb/d, a ratio to the calendar volume of 0.923076923. At 168.0 hours it returns 85.714285714 stb/d. A producing-day rate below the calendar volume of the same row is a thing a producing-day rate cannot be, and the module prints it without comment.

## What is not refused: a correction row

A negative volume is how a ledger books a back-out, and it is arithmetic here rather than an error. A constructed row of -500.0 stb of oil, 200.0 stb of water and 400.0 Mscf of gas returns `liquid` = -300.000000 stb, `watercut` = null and `gor` = null. A constructed row of 800.0 stb of oil, -900.0 stb of water and 400.0 Mscf returns `liquid` = -100.000000 stb, `watercut` = null and a perfectly ordinary `gor` of 500.000000000 scf/stb, because that ratio never looks at the water at all.

## The refusal nobody is told about

`buildWellSeries` keys on `r.well.id` and silently drops every row that carries no well. Hand it two rows of which one has no well and it returns 1 series with 1 point on it. `buildFieldSeries` on the identical two rows returns 1 field day carrying 1800.000000 stb of oil. Nothing in either return says a row went missing.

## Exercise

Put a row of zero oil, zero water and 120.000000 Mscf of gas through the panel and record `watercut`, `gor` and `gasPd`.

Then say which of those three is a refusal and which is an answer.
