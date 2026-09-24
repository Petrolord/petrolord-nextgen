# Target and sigma from history

{{panel:dq-monitor-explorer}}

The engine's EWMA chart requires a target and a sigma, and it does not estimate either from the data it monitors. Both come from historical in-control data or a stated target. On EKENE-3 the target is phase one's centre, 611.380000 psig, and sigma is phase one's MRbar / 1.128, 3.774063 psi. With lambda 0.2 and L 3 the asymptotic limits are 607.605937 and 615.154063 psig, and the forty monitored days signal high on days 8, 9, 13 and 14 and first signal low on day 22.

| input | EKENE-3 | source |
| --- | --- | --- |
| target | 611.380000 psig | phase one centre |
| sigma | 3.774063 psi | phase one MRbar / 1.128 |
| lambda | 0.2 | stated |
| L | 3 | the engine default, NIST 6.3.2.4 |
| lower limit, asymptotic | 607.605937 psig | computed |
| upper limit, asymptotic | 615.154063 psig | computed |

## The refusal

Call the chart without a target and the engine refuses, naming the field. Its own words:

> target is required: EWMA_0, the historical in-control mean or target

The message says what the target is for as well as that it is missing. It is EWMA_0, the starting value of the recursion, and it is the centre of the chart. The engine asks for it by name because the alternative, a default taken from the monitored data, would decide the chart's answer for the caller.

## Why history and never the monitored data

The first module showed what happens to an individuals chart drawn on its own averages. Charted on the forty monitored days themselves, its centre moved to 609.960000 psig, taken from data that included the shift it was meant to find, and its limits moved out to 595.080022 and 624.839978. Only days 8 and 9 still signalled. An EWMA whose target was the monitored mean would take its centre from data that include the shift in the same way. The engine does not offer that default. It is the declared choice of this chart: target and sigma from history.

## The choice has an alternative

A caller may have a target from outside the data, such as a design operating point, and the engine accepts it. What it will not do is invent one. A sigma is the same: it may be MRbar / 1.128 from phase one, as here, or a historical standard deviation a caller trusts, and whichever is passed, the monitoring note names its source. NIST/SEMATECH 6.3.2.4 works its example with a target of 50 and s 2.0539 supplied as inputs, and the engine's limits on that example are 52.588432 and 47.411568.

## Reading the result on EKENE-3

With the target and sigma from phase one, the EWMA reads above 615.154063 on days 8, 9, 13 and 14, which is the glitch and the days its memory reaches. It first falls below 607.605937 on day 22, at 606.394191; the planted shift began on day 16. From day 27 to day 34 it signals every day, and in all it signals on 15 days. Every one of those signals is measured against a target that the shift had no part in making.

## Exercise

In the panel's EWMA view, confirm the limits 607.605937 and 615.154063 and the first low signal on day 22. Then replace the target with 609.960000, phase two's own centre from the first module, and run it again. Count the days that still signal low, and write two sentences on what the change of target did and why a monitoring plan fixes the target before phase two begins.
