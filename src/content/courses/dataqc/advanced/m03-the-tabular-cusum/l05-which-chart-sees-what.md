# Which chart sees what

{{panel:dq-monitor-explorer}}
{{panel:dq-outliers-explorer}}

EKENE-3's forty monitored days carry two planted events, stated by the generator: a gauge glitch on day 8 and a downward shift from day 16. Each chart ran with its own module's settings and the target and sigma from phase one. From day 16 to day 40, the individuals chart signals low on 1 day, EWMA on 11 and CUSUM on 20.

| chart | first signal at or after day 16, low side | signals on day 8 | days with any signal |
| --- | --- | --- | --- |
| individuals, phase one standard | 22 | true | 5 |
| EWMA, lambda 0.2, asymptotic | 22 | true | 15 |
| CUSUM, k 0.5 and h 4 sigma | 21 | true | 28 |

| chart | low signals from day 16 to day 40 |
| --- | --- |
| individuals | 1 |
| EWMA | 11 |
| CUSUM | 20 |

## The glitch

Every chart sees the glitch. It is a single reading of 633.800000 psig against an individuals upper limit of 622.702188, and its moving range chart flags day 8 and day 9 as well. EWMA signals high on days 8, 9, 13 and 14. CUSUM holds it in S_hi from day 8 to day 16. The same event is one reading on the individuals chart and a run of days on the charts that remember, which is why a monitoring note names the event and the first day and does not simply count days.

## The shift

From day 16 the pressure sits lower, and the individuals chart signals low on 1 day from day 16 to day 40: it signals where a single day falls past three sigma. EWMA and CUSUM accumulate the shift and hold it, and signal low on 11 and 20 of those days. The first low signal is day 22 on the individuals chart and on EWMA, and day 21 on CUSUM.

## What the counts do and do not say

The counts are what the three charts returned on this series with these settings, and they do not rank the charts in general. A different lambda moves the EWMA row, as the lambda table in the second module showed, and a different k, h or unit moves the CUSUM row, as the second lesson of this module showed. Every signal is a question someone has to answer, and a chart that signals on 28 days asks more of its readers.

## Where the outlier tests sit

The Professional tier's tests, in the second panel, ask which single values stand apart. The z-score, the modified z-score, the fences and Grubbs read the forty readings as a set with no order, so the fact that the days from 16 on sit together on one side of the phase one centre is invisible to them. Whether they find the glitch is a question for the exercise. A monitoring plan uses each test for the question it answers.

## Choosing for a plan

A plan that must catch a single wild reading has the individuals chart; one that must catch a small persistent change has EWMA or CUSUM, with settings written down before the data arrive. A plan can run the individuals chart beside one of the two, so that each event is seen by the chart suited to it, and the note says which chart saw what.

## Exercise

In the monitor panel, run EKENE-3's forty days through all three charts with the settings in the first table and confirm each row. Then paste the same forty days into the outliers panel's modified z-score view and list the days it flags. Write two sentences: one on which planted event the outlier test found, and one on why the other event is a question for a chart.
