# A process that makes data

{{panel:dq-monitor-explorer}}

EKENE-3's flowing wellhead pressure runs for 90 days, in psig. The first 50 are in-control days, and the other 40 are the days being monitored. Two events were planted in the monitored days and stated by the generator: a gauge glitch on day 8, and from day 16 a shift of 1.2 process standard deviations down. The Associate tier asked whether each reading is there and valid. The Professional tier asked which readings stand apart. This tier asks a third question: has the process that makes the readings changed?

| EKENE-3 pressure | days | what the days are for |
| --- | --- | --- |
| phase one | 50 | in-control history, from which the centre and sigma are estimated |
| phase two | 40 | the days being monitored, charted against phase one |
| the whole stream | 90 | both phases, one reading a day |

## A value question and a process question

An outlier test asks how far one value sits from the others. A control chart reads a sequence and asks whether the process behind it still behaves as it did when it was known to be in control. The day 8 glitch reads 633.800000 psig, and every chart in this tier sees it. The shift from day 16 is a different kind of event: no single day of it need look unusual, and it only shows as a run of days sitting low together. The individuals chart, EWMA and the tabular CUSUM differ in how much of that run they gather before they signal.

## A control limit, in this course

A control limit is a limit computed from in-control data. It is never a specification and never a plausibility range. Both of those are the caller's statements about the world. A control limit says only what this process produced while it was known to be stable. The same rule of vocabulary applies to sigma: every sigma in this tier names where it came from, and here it is MRbar / 1.128 from phase one, or a historical in-control figure a caller supplies.

## The chart needs every day

A control chart reads a sequence, and a hole in a sequence breaks the moving range and the running sums. The engine therefore refuses a series with a missing value and names the entry. Its own words:

> values[1] is missing: a control chart needs a complete series, so fill or drop the gap first

This is why the Associate checks come first: completeness is a condition of charting, and the chart cannot run without it. Filling or dropping the gap is the caller's decision, and the engine makes neither.

## Phase one, then phase two

Phase one estimates the centre and the spread from days known to be in control, and on EKENE-3 its centre is 611.380000 psig with 0 flags. Phase two charts the monitored days against those figures without re-estimating them. The next three lessons build the individuals chart that way, and lesson five charts phase two on its own averages to show what that costs.

## Exercise

Open the panel on the individuals view with EKENE-3's two phases loaded. Read the phase one centre and confirm it is 611.380000 with 0 flags. Then replace the second monitored day with the word null and run it again. Write down the field the refusal names, and say in one sentence what you would do with that day before charting.
