# A well that did not change

OGUTA-6 held its producing-day oil rate at exactly 512.000000000 stb/d on every one of its seven recent days. `detectExceptions` reported it for a rate drop of 38.825312618416 per cent.

{{panel:pd-reading-explorer}}

## The seven days

OGUTA-6 is a well this course invented to carry this one result. Its baseline cycles the oil through 503, 488 and 517 stb at a full twenty-four hours, a design condition of an invented ledger and not a result, and its recent window varies nothing but the hours.

| Date | hours_on, h | Calendar oil, stb | Producing-day oil, stb/d |
| --- | --- | --- | --- |
| 2024-11-14 | 16.5 | 352.000000000 | 512.000000000 |
| 2024-11-15 | 7.8 | 166.400000000 | 512.000000000 |
| 2024-11-16 | 19.2 | 409.600000000 | 512.000000000 |
| 2024-11-17 | 14.1 | 300.800000000 | 512.000000000 |
| 2024-11-18 | 9.4 | 200.533333333 | 512.000000000 |
| 2024-11-19 | 21.6 | 460.800000000 | 512.000000000 |
| 2024-11-20 | 12.3 | 262.400000000 | 512.000000000 |

Seven different calendar volumes, seven different hours, one rate. The watercut is 0.180327868852 as a fraction and the gas-oil ratio 470.000000000 scf/stb on all seven, so no ratio check has anything to say either.

## The same window read twice

Recent window: the mean calendar oil is 307.504761904762 stb and the mean producing-day oil is 512.000000000000 stb/d, at a mean `hours_on` of 14.414285714286 h. Baseline window: the mean calendar oil is 502.666666666667 stb and the mean producing-day oil is 502.666666666667 stb/d, at a mean `hours_on` of 24.000000000000 h. The baseline pair agree because the baseline ran at a full twenty-four hours.

The change on the calendar volume is 38.825312618416 per cent read as a drop, and that is the one `detectExceptions` reports. The change on the producing-day rate is -1.856763925729 per cent on the same convention, and a negative change there is a rise: 1.856763925729 per cent up. The well was producing very slightly better per hour on stream than it had been.

## What the list shows

Type `rate_drop`, severity medium, value 307.504761904762 against a baseline of 502.666666666667, message `Oil down 39%: 308 vs 503 stb/d baseline.` The `rateDropPct` trigger is 20 per cent with the doubling to high at 40, so the calendar reading clears the trigger and the producing-day reading is nowhere near it.

## The mistake

Opening the well file to look for a reservoir cause. There is none. Every barrel of the difference is uptime, the column that explains it is on all seven points, and the two readings move in opposite directions, so no amount of care applied to the reported number recovers the real one.

## What the row cannot tell you

The exception carries a value, a baseline, a type and a severity. It does not carry the mean hours, the producing-day mean, or any note that the two readings disagree. Reading the calendar figure as a well performance change is not a misreading of the row. The row supports no other reading.

## Exercise

Read the OGUTA-6 recent window in the panel and record the mean calendar oil and the mean producing-day oil.

Then say which of the two moved against the baseline and in which direction, and what the exception row would have said if the comparison had used the other one.
