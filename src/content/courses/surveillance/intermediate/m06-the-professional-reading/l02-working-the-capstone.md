# Working the capstone

Six steps in one order. A graded answer that is wrong is wrong at a step you can name.

{{panel:pd-exception-explorer}}

## Step one: sort what you were given into three inputs

A ledger of rows, a list of well tests, and a metered stream. The ledger feeds `derivePoint` and `detectExceptions`. The tests feed `groupTests` and `testInForce`. The meter feeds `computeAllocation` and `imbalanceSeries`. Sorting first is how you notice that a rate in stb/d has been handed to a function expecting a volume in stb over a row.

## Step two: find the anchor before building a window

asOf is the field's latest ledger date, never today. At the defaults the recent window is 7 days and the baseline is 30, half open and not overlapping, and the boundary day belongs to the earlier window. On the teaching field OGUTA, invented for this course and neither real nor published, asOf 2024-11-20 gives a recent window of 2024-11-14 to 2024-11-20 and a baseline of 2024-10-15 to 2024-11-13.

## Step three: read the window means, not the verdict

Every exception row carries a value and a baseline, and both are means over a window. Write the column beside them. OGUTA-2 oil is a recent mean of 618.142857142857 stb over 7 rows against 1038.900000000000 stb over 30 rows, and both are calendar volumes.

## Step four: name the threshold a severity crossed

`rateDropPct` is 20 per cent and the doubling to high is at 40. `watercutRisePts` is 10 points, `gorRisePct` is 30 per cent, `downtimeHours` is 12 h, `staleDays` is 7 days, `minOilRate` is 5. A severity without its threshold is not an answer.

## Step five: run the allocation in the engine's order

Test in force, then uptime, then theoretical, then factor, then allocated share. Skip a step and the arithmetic still works and means something else.

## Step six: say which number you are quoting

Theoretical, allocated, or the well's own ledger row. On 2024-11-20 OGUTA-2 reads 1036.000000000 stb, 1233.319797595 stb and 1014.000000000 stb, all three calendar volumes over one date.

## The checks

**A day with a basis closes exactly.** The published golden prints a closure residual of 0.000000000000 on every such day, and the teaching field closes at 58426.784897363 stb of measured oil against 58426.784897363 stb allocated.

**Allocated equals the factor times the theoretical.** OGUTA-2 on 2024-11-20 sits on an oil factor of 1.190463125091.

**A well with no test in force has no share.** Not a zero share: no entry, and a `no_test_in_force` diagnostic. The teaching run records 57 of them.

**An imbalance percentage is against what the wells booked.** On 2024-11-20 that is 437.869938006 stb at 19.806426169154 per cent.

## The failures to expect

Quoting an allocated volume as production. Quoting the theoretical instead because it looks closer to the ledger, when it is a test rate scaled by an uptime and no meter ever saw it. Reading a factor near one as validation. Reading an empty `validateWellTests` return as all clean. Putting a calendar volume and a producing-day rate in one sentence without naming which is which.

## Exercise

Work one well through all six steps and write the number each step produced.

Then say which step you would have to redo if one ledger row were added after the current last date.
