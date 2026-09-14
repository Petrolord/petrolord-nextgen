# Budget or spend plus commitment

When a line has no positive entered forecast, the engine forecasts it at the larger of its budget and its actual + commitment. Four of OFON-1's five lines are forecast that way.

{{panel:ec-cost-explorer}}

## The fallback on OFON-1

| code | budget | actual + commitment | itemForecast | rule used | line variance |
| --- | --- | --- | --- | --- | --- |
| DRL-01 | 14200000 | 12400000 (derived) | 14200000 | budget | 0 (derived) |
| CSG-02 | 3900000 | 4300000 (derived) | 4300000 | actual + commitment | -400000 (derived) |
| LOG-04 | 2100000 | 1250000 (derived) | 2100000 | budget | 0 (derived) |
| CMP-05 | 5600000 | 1200000 (derived) | 5600000 | budget | 0 (derived) |

DRL-01 has 9800000 spent and 2600000 committed. 12400000 is smaller than 14200000, so the line forecasts its budget. CSG-02 has 4300000 spent and nothing committed. 4300000 is larger than 3900000, so the line forecasts what it has already cost, and its variance is 3900000 - 4300000 = -400000. LOG-04 and CMP-05 have spent and committed far less than their budgets and forecast the budget.

## Two published cases

"suite test: under budget forecasts the budget" has a budget of 100, a commitment of 10 and an actual of 20. The engine returns EAC 100.0000 and variance 0.0000. "suite test: committed past the budget" has a budget of 100, a commitment of 60 and an actual of 70, and returns EAC 130.0000 and variance -30.0000: the 70 spent and 60 committed together pass the budget, and the forecast follows them.

## What the fallback can never say

The larger of two numbers is never smaller than either. Without an entered forecast, a line's forecast never falls under its budget, so its variance is never positive. The fallback can report an overrun and it cannot report an underrun. If DRL-01 is heading for a saving, only an entered forecast can show it.

The fallback also ignores progress. DRL-01 reports 72.0000 percent complete with 9800000 spent; LOG-04 reports 20.0000 percent with 350000 spent. Neither figure enters its forecast. The rule does not extrapolate from how much work has been done, and it does not use CPI. It looks at money already out and money already promised, and at nothing else.

## What it refuses

It refuses to forecast what has not been committed. CSG-02 stopped at 4300000 because its actual plus commitment of 4300000 passes its budget and nothing more is committed; the rule never reads progress. A line that is half done and already past its budget on spend and commitment would forecast only what is spent and committed, with nothing for the half that remains, until someone enters a forecast.

## The mistake

The mistake is reading a zero line variance as "on budget". DRL-01, LOG-04 and CMP-05 all show 0, and on each the 0 means only that spend and commitment have not yet passed the budget. It is the rule's floor. The other mistake is reading the EAC of 27600000 as a performance forecast. It is 14200000 + 4300000 + 1400000 + 2100000 + 5600000: three budgets, one spend and one entered figure, added.

## Exercise

For DRL-01 and CSG-02, compare budget with actual + commitment, name the rule used and give the itemForecast and line variance. Then explain why, without an entered forecast, no OFON-1 line can report a positive variance.
