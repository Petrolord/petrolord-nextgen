# An entered forecast

A line's forecast is what it will cost when the work is done. The engine takes a positive forecast typed on the line ahead of anything it could work out for itself, so an entered forecast is the strongest statement a cost engineer can make about a line.

{{panel:ec-cost-explorer}}

## The rule, first half

The engine's itemForecast is the entered forecast when it is positive, and otherwise the larger of the budget and actual + commitment. On OFON-1 only one line has an entered forecast:

| code | budget | actual + commitment | entered forecast | itemForecast | rule used |
| --- | --- | --- | --- | --- | --- |
| CMT-03 | 1250000 | 940000 (derived) | 1400000 | 1400000 | entered |
| CSG-02 | 3900000 | 4300000 (derived) | none | 4300000 | actual + commitment |

CMT-03 has spent 640000 and committed 300000, 940000 in all, against a budget of 1250000. Left to the fallback, the rule would forecast the budget, 1250000, because it is the larger. The cementing engineer has entered 1400000, so the line forecasts 1400000 and its variance is 1250000 - 1400000 = -150000. That overrun exists only because someone typed it. Nothing in the spend to date shows it.

## A published case

The engine's test "suite test: entered forecast" holds one line with a budget of 100, no commitment, no actual and an entered forecast of 140. The engine returns EAC 140.0000 and variance -40.0000. Nothing has been spent, and the line still forecasts past its budget, because an entered forecast needs no spend behind it.

## What the entered forecast carries

It carries knowledge the other columns cannot hold: a cement job redesigned, a price rise quoted, an extra plug planned. Actual + commitment only knows money already spent or promised. The budget only knows what was authorised. On CMT-03 the entered 1400000 is the one figure that says the scope has grown.

## What it refuses

A positive entered forecast wins unconditionally. The engine does not compare it with actual + commitment, does not ask when it was entered, and does not ask who entered it. By the wording of the rule, an entered forecast smaller than the money already spent and committed on a line would still be taken as that line's forecast. The rule trusts the typist. An entered forecast that is not positive is not taken at all, and the rule falls back to its second half.

## The mistake

The mistake is a forecast copied from the budget. Before the EC5-0 repair of the Suite, editing a line copied its budget into its forecast field. Under the rule as it stands, a copied budget is a positive entered forecast and wins. Had CSG-02's budget of 3900000 been copied into its forecast, the line would forecast 3900000 against the 4300000 already spent, its variance would read 0, and an overrun of 400000 would vanish from the EAC. The repaired Suite no longer copies the budget when a line is edited, but a figure copied by hand does the same damage. An entered forecast that equals its budget to the dollar deserves a question before it is believed.

## Exercise

State CMT-03's budget, actual + commitment, entered forecast and itemForecast, and give the line variance. Then explain what CSG-02 would forecast if its budget had been copied into its forecast field, and what that copy would hide.
