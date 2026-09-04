# A severity that changes with the reading

A severity is the name of a threshold crossing, and a threshold crossing needs a number. Change which of two defensible readings supplies that number and the printed word changes with it.

{{panel:pd-reading-explorer}}

## The two ladders that decide it

`DEFAULT_SURVEILLANCE_SETTINGS` sets `gorRisePct` to 30 and `watercutRisePts` to 10. A rise past the trigger is medium and a rise past twice the trigger is high, so the gas-oil ratio ladder is 30 per cent then 60 per cent, and the watercut ladder is 10 points then 20 points.

## The published case, well P-1

Golden values on the recent window 2025-06-24 to 2025-06-30 against the baseline 2025-05-25 to 2025-06-23.

| Quantity | Mean of daily ratios | Volumetric |
| --- | --- | --- |
| Gas-oil ratio rise, per cent | 70.033482142857 | 42.737789203085 |
| Severity | high | medium |
| Watercut rise, points | 20.938677629325 | 18.603480205160 |
| Severity | high | medium |

Both ratios cross the doubling under one reading and sit below it on the other, and the golden commits both severity columns.

## The teaching case, where it is not a near miss

On OGUTA-2, a well this course invented, the gas-oil ratio rise is 83.907484614181 per cent read as a mean of daily ratios and 11.250129499613 per cent read volumetrically. The first is high. The second is under the 30 per cent trigger, so it is not an exception at all. The watercut rise is 21.474523054592 points against 7.555079897248 points, high against nothing, on the same seven rows.

`detectExceptions` reads a mean of daily ratios and is the only function that prints a severity, so the volumetric reading `computeKpis` holds never reaches the list.

## What the list actually prints

The exception row reads type `gor_rise`, severity high, value 1066.663410762250 and baseline 580.000000000000, with the message `GOR up 84%: 1,067 vs 580 scf/stb baseline.` Beside it sits type `watercut_rise`, severity high, value 0.451386451920 and baseline 0.236641221374, message `Watercut up 21 points: 45% vs 24% baseline.`

Neither row names the reading. A reader gets a rounded value, a baseline and a word.

## The mistake

Treating high as a measurement of size. It is a comparison against 60 per cent or 20 points, made on one of two numbers that the same rows support. A well moved from medium to high by the choice of formula has not deteriorated between the two prints, and a well that raises nothing under one reading is not a well that did nothing.

## What the severity refuses to carry

An exception row carries no range and no second opinion. Three types do not use the ladder at all: `shut_in` is always high whatever its size, `downtime` is always medium whatever the hours, and `stale_data` doubling moves it only from info to medium.

## Exercise

Read OGUTA-2 in the panel and record the gas-oil ratio rise under both readings.

Then say which of the two crosses 60 per cent, and what the other one would have put on the list.
