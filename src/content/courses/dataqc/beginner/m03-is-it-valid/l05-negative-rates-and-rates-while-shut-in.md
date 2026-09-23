# Negative rates and rates while shut in

{{panel:dq-checks-explorer}}

A daily production sheet can hold two kinds of impossible rate. One is a negative rate: a produced volume cannot be below zero. The other is a positive rate on a day the well was shut in: a well that did not flow produced nothing. `rateCheck` looks for both. EKENE-3's oil column has one of each, both stated planted defects.

| day | oil, bbl/d | hours on | status | rule | the engine reason |
| --- | --- | --- | --- | --- | --- |
| 47 | -18.500000 | 24.000000 | producing | negative-rate | rate -18.5 is negative |
| 61 | 1271.700000 | 0.000000 | shut-in | rate-while-shut-in | rate 1271.7 is reported while the well is shut in (status is 'shut-in') |

87 days checked, 2 failed; the three missing days are not checked.

## The two rules

A negative rate is flagged. The day 47 value is an allocation back-out, a correction booked as -18.5 bbl/d on the oil line. Whatever its accounting purpose, the well did not produce it.

A positive rate while shut in is flagged. Shut in, for this check, means `status` is 'shut-in' or `hoursOn` is 0. The day 61 value is a rate carried forward onto a day the well was shut in.

## A zero while shut in is correct

Day 60 is shut in with an oil rate of 0.000000, and it is not flagged. That is the right record of a shut-in day, and it is why module one insisted that zero is a present value. A check that treated zero as missing would lose this day, and a check that flagged every zero would flag the one correct answer.

## Hours on a partial day

Day 59 ran 18.500000 hours, a stated input, and it is not shut in. The engine's rule is sharp: only a status of 'shut-in' or zero hours makes a day shut in. A well that flowed for part of the day produced something, and a positive rate on that day is allowed. Whether the rate is plausible for 18.500000 hours of flow is a different question, and the engine carries no rule for it.

## What the check needs to see

The rule can only fire on information it is given. Run the same oil column through the check with different inputs and the count changes.

| what the check is given | failed |
| --- | --- |
| rates alone | 1 |
| rates and status | 2 |
| rates and hours on | 2 |
| rates, status and hours on | 2 |

With rates alone, the check can see the negative rate and nothing else: it has no way to know day 61 was shut in. Either the status column or the hours column is enough to reveal the carried-forward rate. A check is only as good as the context you hand it.

## Missing days are not judged

The oil column has three missing days, days 31 to 33, the meter outage from module two. The rate check does not judge them, so 87 of the 90 days are checked. A missing rate is a completeness question, and the completeness check already flagged it. Each check keeps to its own dimension.

## Exercise

Open the checks explorer on the view for range limits and rate rules. The daily rates box holds a stretch of EKENE-3's oil with its hours on, running across days 47 and 61. Read the flags and match each to a row of the first table. Now change the hours on for the day that shows the rate 1271.700000 from 0 to 24.000000 and read the flags again. Explain which flag disappeared and what the engine now believes about that day.
