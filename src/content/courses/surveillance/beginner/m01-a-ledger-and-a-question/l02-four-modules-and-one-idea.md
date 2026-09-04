# Four modules and one idea

Four files answer four different questions off one ledger, and the only thing they share is the row. Naming which function owns a number is most of the work.

{{panel:pd-ledger-explorer}}

## What each file is for

`surveillance.js` reads a ledger and says which wells to go and look at. `derivePoint` turns one row into rates and ratios, `buildWellSeries` and `buildFieldSeries` group them, `seriesCadenceDays`, `movingAverage` and `decimate` shape them, `detectExceptions` compares a recent window against a baseline window on the same well, `summarizeDeferments` rolls up lost production, `computeKpis` rolls up the field, and `rateSeriesForFit`, `fitWellDecline` and `annualEffectiveDecline` are the decline overlay.

`allocation.js` splits one metered stream across the wells. `groupTests` and `testInForce` choose what carries a well, `computeAllocation` splits, `monthlyFactors` and `allocatedLedgerRows` reshape, `imbalanceSeries` measures the meter against the wells' own books, and `validateWellTests` and `crossCheckTestsAgainstNodal` QC a test.

`liftScreening.js` is a rules matrix. Six methods, each starting at 100 and deducting with a stated reason. Nothing in it is derived from anything, so it is a checklist with a number attached and never a calculation. `LIFT_METHODS` names gas lift, ESP, rod pump, plunger lift, progressing cavity pump and jet pump, of which the first four carry `hasEngine` = true and the last two `hasEngine` = false.

`liftAdvisor.js` is the design pass. It runs each method's real design chain on one shared well record and reconciles the answer against the matrix, and when the two disagree the design wins.

## The four published case sets

| Golden | What it publishes |
| --- | --- |
| surveillance | a 7-well field, 268 ledger rows, 51 field days, asOf 2025-06-30 |
| allocation | 24 allocated days, 36 test-in-force probes, 7 tests through QC, 6 nodal cross-checks |
| lift screening | 7 archetype wells, 144 sweep points, 7 monotonicity cases |
| lift advisor | 22 reference-stage probes, 15 motor probes, 7 rod-ladder scenarios, 12 truth-table rows |

## The idea all four turn on

Surveillance is a comparison of one well against itself over two windows. The output is always that this well changed and never that this well is bad, and every quantity in it is a reading of a period rather than a measurement of a thing. That is why the answer to what a well's watercut is stays incomplete until you say which rows and which reading. Even the two windows are arguments: `DEFAULT_SURVEILLANCE_SETTINGS` carries `recentDays` = 7 and `baselineDays` = 30.

## The mistake

Carrying one unit convention across the four files. A watercut is a 0 to 1 fraction everywhere in `surveillance.js` and `allocation.js` and a per cent in `liftScreening.js` and `liftAdvisor.js`. The same quantity, the same field, two spellings, and nothing at the boundary converts between them.

## Exercise

Open the published ledger in the panel and write down the field day count and the asOf date.

Then name which of the four files would answer each of these: which wells changed this week, how many barrels a named well is booked for, and whether a rod pump suits it.
