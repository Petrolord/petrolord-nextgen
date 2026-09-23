# A standard or the data

{{panel:dq-monitor-explorer}}

The engine's individuals chart takes its centre and MRbar from the data it is given, unless the caller supplies either one as a standard. Chart EKENE-3's forty monitored days with phase one's centre and MRbar as the standard and the limits are 600.057812 and 622.702188 psig, and signals fall on days 8, 9, 22, 23 and 25. Chart the same forty days on their own averages and the centre moves to 609.960000, the limits widen to 595.080022 and 624.839978, and only days 8 and 9 signal.

| chart | centre | upper limit | lower limit | days signalling |
| --- | --- | --- | --- | --- |
| phase one as the standard | 611.380000 | 622.702188 | 600.057812 | 8, 9, 22, 23, 25 |
| phase two on its own averages | 609.960000 | 624.839978 | 595.080022 | 8, 9 |

## The trap this tier is built on

From day 16 the monitored pressure was shifted down by 1.2 process standard deviations, a planted and stated event. A chart that computes its centre from the monitored days computes it from data that include the shift, so the centre itself moves down and the shifted days sit closer to it. Its limits, 595.080022 and 624.839978 psig, also lie outside phase one's pair on both sides, so a day has to fall further before it signals. The chart absorbs the event it was drawn to look for. On EKENE-3 the only signals left are the glitch and its return.

## Why the engine allows both

NIST/SEMATECH 6.3.2.2 computes the centre and MRbar from the data being charted, and that is the engine's default, because it is how a chart is drawn in phase one, when the question is whether a stretch of history is itself in control. Phase two is a different question. It asks whether new days behave like the history, and the history is the standard. The engine takes a `centre` and an `mrBar` from the caller for that reason, and a monitoring note says which source each figure came from. The choice is the caller's, and it has to be stated.

## Choosing the history

A standard is only as good as the days it came from. Phase one on EKENE-3 is 50 days stated as in control, and it raises 0 flags on its own chart. A monitoring plan records which days formed the standard, why they were judged in control, and the centre and MRbar they gave, 611.380000 psig and 4.257143 psi. When the process is deliberately changed, a new phase one is chosen and the change is written down, so that nobody compares new days with a standard that no longer describes the process.

## What this does to the other charts

EWMA and the tabular CUSUM in the next two modules take the same view further. Neither of them estimates its target or its sigma from the data it monitors: both are required inputs, taken from history. The individuals chart is the one chart here where the data's own averages are the default, and this lesson is the reason to override that default in phase two.

## Exercise

In the panel's individuals view, paste the forty monitored days into the phase one box as well as the phase two box, so the chart draws its limits from the monitored data. Confirm the centre of 609.960000 and the limits of 595.080022 and 624.839978. Then list which days lost their signal compared with the phase one standard, and say in one sentence, for each, why it lost it.
