# A forecast that is not positive

The entered forecast counts only when it is positive. A blank, a zero or a negative figure in the forecast field is passed over without a word, and the line is forecast at the larger of its budget and actual + commitment.

{{panel:ec-cost-explorer}}

## The published case

"negative entered forecast is ignored (the S-curve ignores it too)" holds one line:

| budget | actual | commitment | entered forecast | progress | engine EAC | engine variance |
| --- | --- | --- | --- | --- | --- | --- |
| 100 | 20 | 0 | -50 | 10 | 100.0000 | 0.0000 |

The entered -50 is not positive, so the rule falls back. Actual + commitment is 20, the budget is 100, the larger is 100, and the EAC is 100.0000 with a variance of 0.0000. The S-curve's forecast series ignores the -50 as well, so the tiles and the curve agree.

## Blank, zero and negative look the same

On OFON-1, CMP-05 has no entered forecast. Its budget is 5600000 and its actual + commitment is 1200000, so it forecasts 5600000. By the wording of the rule, the same line with a zero or a negative entered forecast forecasts exactly the same 5600000, because neither is positive. Three different things a person might have meant, "not yet estimated", "cancel this work" and a typing slip, produce one forecast, and the report cannot tell them apart.

## Ignored is not refused

The engine refuses some bad inputs out loud. A negative progress figure stops the calculation with a message that names the cost item, such as "Cost item "Completion" has negative progress (-0.5 percent). Progress runs from 0 to 100 percent." A negative forecast gets no such message. It is dropped and the line carries on. Nothing on the screen says the typed figure was never used.

## What it refuses

The rule refuses to read a non-positive forecast as information. It will not treat zero as a descope, and it will not remove a line's budget from the EAC because someone typed zero against it. A line that really is cancelled keeps forecasting its budget, or its actual + commitment if that is larger, until its budget itself is changed.

## The mistake

The mistake is typing zero into the forecast to cancel work. Suppose CMP-05's completion were dropped and its forecast set to 0. The line would still forecast 5600000, the EAC would stay at 27600000, and the variance at completion would stay at -550000. The descope saves nothing on the report. The opposite mistake is trusting a negative forecast to lower the EAC: the published line entered -50 and still forecast 100.0000.

## Exercise

Work the published case by hand: say why the entered -50 is not used, which two figures the rule compares, and what EAC and variance result. Then explain what OFON-1's EAC would be if CMP-05's forecast were set to zero, and why.
