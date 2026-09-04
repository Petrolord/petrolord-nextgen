# Computed on every row

`derivePoint` computes four producing-day rates on every single ledger row it touches. Exactly one function in `surveillance.js` ever reads them.

{{panel:pd-reading-explorer}}

## What the four keys are

A ledger row carries fourteen keys after `derivePoint` has run. Nine are copied through unchanged and five are computed, and four of the five computed ones are rates: `oilPd` and `waterPd` and `liquidPd` in stb/d, `gasPd` in Mscf/d. Each is the volume over the row scaled to twenty-four hours by the `hours_on` column.

The golden publishes the arithmetic on five rows. Row 1 books 800.000000 stb of oil at 24.000000 hours and returns `oilPd` of 800.000000000 stb/d and `liquidPd` of 1000.000000000 stb/d. Row 2 books 500.000000 stb at 12.000000 hours and returns `oilPd` of 1000.000000000 stb/d and `liquidPd` of 1200.000000000 stb/d. The volume halved and the rate went up.

## The scaling, swept

A derived sweep on one constructed row of 600 stb of oil, moving nothing but the hours.

| hours_on, h | oilPd, stb/d | Uplift over the calendar volume |
| --- | --- | --- |
| 24.0 | 600.000000000 | 1.000000000 |
| 20.0 | 720.000000000 | 1.200000000 |
| 16.0 | 900.000000000 | 1.500000000 |
| 12.0 | 1200.000000000 | 2.000000000 |
| 6.0 | 2400.000000000 | 4.000000000 |
| 1.0 | 14400.000000000 | 24.000000000 |

At a full twenty-four hours the calendar volume and the producing-day rate are the same number, which is the only place they are.

## What it refuses, and it is the right refusal

At `hours_on` of 0.000000 the golden returns `oilPd` null, `waterPd` null, `gasPd` null and `liquidPd` null. A division by zero here would put an Infinity into every window mean downstream and turn a shut-in day into a fabricated record rate, so the function declines to answer instead.

An absent hours column is a different refusal. The test is `Number.isFinite(row.hours_on)`, so null, undefined, NaN and the string "12" are all read as uptime unknown and the rate falls back to the calendar volume: 600.000000000 stb/d on that same row. Nothing clamps the column either, so 26.0 hours returns 553.846153846 stb/d, which is below the calendar volume and is a thing a producing-day rate cannot be.

## The one reader

`FIT_STREAMS` names the pairing directly: oil carries a producing-day key `oilPd` and a calendar key `oil`, gas carries `gasPd` and `gas`, liquid carries `liquidPd` and `liquid`. `rateSeriesForFit` and the decline overlay are what consume the producing-day side. `detectExceptions`, `computeKpis` and `buildFieldSeries` all read the calendar side.

## The mistake

Assuming that a quantity present on every point is a quantity the module uses. Four rates are computed 473 times over on the teaching ledger and consulted by one overlay. A column existing is not a column being read.

## Exercise

Take the published row of 500.000000 stb at 12.000000 hours and record both its calendar oil and its `oilPd`.

Then say which of the two you would compare against a baseline to ask whether the well has changed, and which of the two you would add up to say what it made.
