# Variance at completion

Variance at completion is the budget minus the forecast at completion. On OFON-1 it is 27050000 - 27600000 = -550000, and a negative variance means an overrun.

{{panel:ec-cost-explorer}}

## Line by line

| code | budget | itemForecast | rule used | line variance (budget - itemForecast) |
| --- | --- | --- | --- | --- |
| DRL-01 | 14200000 | 14200000 | budget | 0 (derived) |
| CSG-02 | 3900000 | 4300000 | actual + commitment | -400000 (derived) |
| CMT-03 | 1250000 | 1400000 | entered | -150000 (derived) |
| LOG-04 | 2100000 | 2100000 | budget | 0 (derived) |
| CMP-05 | 5600000 | 5600000 | budget | 0 (derived) |

The engine's AFE totals are EAC 27600000 and variance at completion -550000. The line variances add to the same figure: -400000 + -150000 = -550000, with three lines at 0. Two lines carry the whole overrun, and they carry it for different reasons. CSG-02 has already spent 4300000 against 3900000. CMT-03 has spent 640000 of a 1250000 budget and is over only because its engineer entered 1400000.

## The sign

Budget minus forecast makes an overrun negative and a saving positive. Some reports print forecast minus budget, where an overrun is positive. Before comparing an OFON-1 variance with any other report, check which way round it was taken. On OFON-1, -550000 means the AFE expects to spend more than the 27050000 it was authorised, and a report that flips the sign would print the same overrun as a positive figure.

## Three published cases

| case | budget | commitment | actual | entered forecast | engine EAC | engine variance |
| --- | --- | --- | --- | --- | --- | --- |
| suite test: entered forecast | 100 | 0 | 0 | 140 | 140.0000 | -40.0000 |
| suite test: under budget forecasts the budget | 100 | 10 | 20 | none | 100.0000 | 0.0000 |
| suite test: committed past the budget | 100 | 60 | 70 | none | 130.0000 | -30.0000 |

The first is over on an entered figure with nothing spent at all, so its overrun is a judgment. The second has spent 20 and committed 10 against a budget of 100 and reports 0.0000, which is the rule's floor and says nothing about whether the line will finish under. The third is over on money spent and promised: 70 and 60 together pass the budget, the forecast follows them to 130.0000, and the variance is 100 - 130.0000 = -30.0000.

## What it refuses

Variance at completion is one number with no range and no likelihood attached. It does not say how sure the forecast is, and the engine does not attach one. It does not know how much work remains on a line either: CMP-05 has spent nothing and reports 0, the same as DRL-01 at 72.0000 percent complete. And because the fallback never forecasts under a budget, no line reaches a positive variance without an entered forecast, so the AFE total can never net a saving against CSG-02's overrun unless someone enters one.

## The mistake

The mistake is reading three zeros as three lines on budget. On DRL-01, LOG-04 and CMP-05 a variance of 0 is the rule's floor: spend and commitment have not yet passed the budget, and no one has entered a forecast. The -550000 is the overrun the AFE has already declared, and any overrun still to come on the drilling, logging and completion work is not in it. The second mistake is reading -550000 as small beside 27050000 and moving on; CSG-02's -400000 is a line that has finished over its authorisation, and its money is gone.

## Exercise

Write the line variance of each OFON-1 line and show that they add to the AFE's variance at completion. Then say which overrun is backed by spend and which by an entered forecast, and explain why a line variance of 0 does not prove a line is on budget.
