# Working the capstone

Three questions settle every graded number in this domain: which column was read, over which window, and by which of the functions that form the same quantity differently.

{{panel:pd-reading-explorer}}

## Name the function before you compute anything

A quantity in this course does not have one value. It has a value per function.

A period watercut off `computeKpis` is volumetric, formed from means. The same period watercut inside `detectExceptions` is the mean of the daily ratios. On the teaching well those two readings give a rise of 21.474523054592 points and 7.555079897248 points, and a high exception against none.

A well's oil is `oil`, the calendar volume over the row, or `oilPd`, the producing-day rate. On the same seven days one of them falls 38.825312618416 per cent and the other rises 1.856763925729 per cent.

A duty handed to the lift half is liquid to `screenLift` and oil to `runDesignPass`. Write the function name beside every field before you compute it.

## The order to work in

Row quantities first, since `derivePoint` sees one row and nothing else and everything downstream is built from it. Then the window means, which need a window definition and a cadence. Then the allocation, which needs a test in force and an uptime. Then the lift half, which consumes a rate the earlier stages produced. An error in a row quantity reaches every later stage silently, and no return anywhere names the stage it came from.

## The traps, each of them a unit

A calendar volume and a producing-day rate are different quantities and the exception message prints stb/d on both.

A watercut is a fraction in surveillance and in allocation and a per cent in the two lift modules.

A gas-oil ratio is scf/stb. An allocation factor is dimensionless, the metered total over the theoretical total. A nominal decline is per day and an effective decline is a per cent over a year, which is why the fit at a Di of 0.0015 per day reports 42.160601062199 per cent.

A screening score has no unit and ranks methods against each other on one well.

A severity is not a measurement. high, medium and info name two threshold crossings, and `downtime` is medium whatever the hours while `shut_in` is high whatever the size.

## The settings decide as much as the data

The defaults are `recentDays` 7, `baselineDays` 30, `rateDropPct` 20, `watercutRisePts` 10, `gorRisePct` 30, `downtimeHours` 12, `staleDays` 7 and `minOilRate` 5 in surveillance, and `maxTestAgeDays` 180 with `defaultHours` 24 in allocation. Read the settings you are asked to use off the question in front of you and enter them. Do not carry a default in from a worked example, and do not assume a stated setting matches one.

## The precision

Grading is an absolute tolerance in each field's own units rather than a fraction of anything, so a rounded intermediate can fail a field whose method was right. Carry full precision through every step and round only what you finally type.

## Exercise

Pick any three quantities in the panel and write, for each, the function that formed it, the window it covers and its unit.

Then change one setting and record which of the three moved, and say whether that movement was a fact about the well.
