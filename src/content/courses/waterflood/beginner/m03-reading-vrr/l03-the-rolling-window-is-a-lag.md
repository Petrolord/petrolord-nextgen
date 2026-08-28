# The rolling window is a lag

Rolling averages are so familiar that people stop thinking about what they do. A trailing window does not remove noise from a signal; it replaces the signal with a delayed and blunted copy of itself. On a waterflood dashboard that delay is measured in months, and it decides how long it takes you to notice that something changed.

## What the engine computes

For each period $i$, the trailing rolling VRR over a window of $n$ periods is

$$\text{VRR}_{\text{roll}}(i) = \frac{\sum_{j=i-n+1}^{i} V_i(j)}{\sum_{j=i-n+1}^{i} V_p(j)}$$

clipped at the start of the record: a window that would reach before period zero uses what exists. It is a ratio of sums, not a mean of ratios, so each month is weighted by the voidage it created.

Two limits are worth knowing because they are exact:

- $n = 1$ reproduces the instantaneous series exactly, element for element.
- $n$ at least as large as the record reproduces the cumulative series.

Everything else is between those two.

## The Ekene ramp under four windows

The Ekene ramp is the ideal test case, because the true signal is a known straight line rising from 0.85 to 1.05 over five months and then flat. Here are the first eight periods at four window lengths.

| period | $n=1$ | $n=3$ | $n=6$ | $n=12$ |
|---|---|---|---|---|
| 1 | 0.85 | 0.85 | 0.85 | 0.85 |
| 2 | 0.89 | 0.8689830508474574 | 0.8689830508474574 | 0.8689830508474574 |
| 3 | 0.93 | 0.8899999999999996 | 0.8899999999999996 | 0.8899999999999996 |
| 4 | 0.97 | 0.9308988764044942 | 0.9099999999999997 | 0.9099999999999997 |
| 5 | 1.01 | 0.9702189521281649 | 0.9307954050787237 | 0.9307954050787237 |
| 6 | 1.05 | 1.0104238697029304 | 0.9510323353126475 | 0.9510323353126475 |
| 7 | 1.05 | 1.0367774625804815 | 0.9856508910421498 | 0.9661201849997213 |
| 8 | 1.05 | 1.05 | 1.0112084619298995 | 0.9775428385647656 |

Read across row 8. The field has been injecting at exactly the 1.05 target for three consecutive months. The three-period window has caught up and reads 1.05. The six-period window reads 1.011. The twelve-period window reads 0.978, which is still telling you the field is under target.

Nothing is wrong with the twelve-period number. It is a correct statement about the last twelve months, four of which were genuinely below target. But if it is the number on your dashboard, you will not see the field reach target until the ramp has fallen out of the window, four months after it actually happened.

## The trade you are making

A short window reacts fast and is noisy. A long window is stable and slow. There is no setting that is fast and stable, and choosing one is a decision about what kind of error you would rather make.

The useful way to frame it: a trailing window of $n$ periods introduces an effective delay of roughly $(n-1)/2$ periods for a signal that is changing steadily. At $n = 3$ that is one month. At $n = 12$ it is five and a half months. If your field's failure mode develops over two months, a twelve-month window will not see it in time, no matter how carefully you watch the chart.

## Try it

{{panel:wf-ledger-explorer}}

Set the window to 1 and confirm the lime line lands exactly on the cyan. Now step it up one period at a time and watch two things happen together: the lime line gets smoother, and its arrival at 1.05 moves later. Those are the same effect, not two effects.

## Partial windows at the start

The engine's convention at the beginning of a record is to use what exists rather than to return null. Period 1 with a twelve-period window is a one-period average, period 2 is a two-period average, and so on. That keeps a chart from having a blank first year, and it means the early part of any long-window series is not really a long-window series. Notice in the table that the $n=6$ and $n=12$ columns are identical for the first six periods, for exactly this reason.

The alternative convention, returning null until the window is full, is also defensible and some tools use it. Know which one you are looking at before you read anything into the first year of a chart.

## The misconception to avoid

"A longer window is more accurate." A longer window is more STABLE. Accuracy is not the axis. The twelve-period reading of 0.978 in row 8 is a perfectly accurate statement about the last twelve months and a badly misleading answer to "how is the flood doing now". Match the window to the question, and put the question in the axis label.

## Exercise

First, using the table above, find the first period at which the six-period window first reads at or above 1.00, and compare it with the first period at which the instantaneous series reads at or above 1.00. Express the gap in months and compare it with the $(n-1)/2$ rule of thumb.

Second, an operator wants to detect an injector failure that halves the field injection rate, within two months, on a field whose month-to-month VRR normally scatters by plus or minus 0.05. Recommend a window length and justify it in two sentences.
