# The symmetric percentage error

{{panel:pf-backtest-explorer}}

MAPE has no number when an actual is 0. The symmetric mean absolute percentage error, sMAPE, puts the forecast into the denominator beside the actual, so it stays defined through a shut-in month. That change buys a number and costs a symmetry, and this lesson shows both.

## The definition

The basis reads: "100 x mean 2|e| / (|actual| + |forecast|), percent on 0 to 200; a term with actual = forecast = 0 scores 0". Each term divides twice the size of the error by the sum of the sizes of the actual and the forecast. A perfect forecast scores 0. A term where one of the two is 0 and the other is not scores 200, the top of the scale.

On the teaching hold-out, each method fitted on EKENE-P1 months 0 to 35 and scored on months 36 to 47:

| method | MAPE (percent) | sMAPE (percent) |
| --- | --- | --- |
| ses | 22.550260 | 19.852301 |
| holt | 2.781120 | 2.735957 |
| damped | 6.462737 | 6.221199 |

Each sMAPE here sits a little below its MAPE, and every method forecast high on average. The next section shows how a high forecast pulls a term down.

## The same miss, high and low

With an actual of 100 (stated), a forecast of 150 misses high by 50 and scores an sMAPE of 40.000000. A forecast of 50 misses low by 50 and scores 66.666667. MAPE is 50.000000 for both, because MAPE divides by the actual alone. In sMAPE the forecast is in the denominator: a high forecast makes the denominator bigger and the term smaller, and a low forecast does the reverse.

So the name is misleading. sMAPE is symmetric in the actual and the forecast, which may be swapped without changing a term. It is not symmetric in the error: the same size of miss costs more when the forecast is low.

## The zero terms

Two rules close off the zero cases. A term with actual 0 and a non-zero forecast scores 200, whatever the forecast. A term with actual 0 and forecast 0 would be 0 divided by 0, and the engine scores it 0, a perfect forecast of a shut-in month.

Two stated cases show them, actuals 0 and 100:

| forecasts | sMAPE (percent) | MAPE |
| --- | --- | --- |
| 0, 90 | 5.263158 | null |
| 5, 90 | 105.263158 | null |

The only change is the first forecast, from 0 to 5 bbl/d, and sMAPE jumps from 5.263158 to 105.263158 because that term goes from 0 to the top of the scale. MAPE is null in both, because the first actual is 0.

## A declared choice

The engine uses absolute values in the denominator and the scale 0 to 200, after Hyndman and Koehler 2006. Other tools drop the absolute values, or halve the scale to 0 to 100. So an sMAPE from another tool may be on a different scale, and a comparison needs the definition beside the number.

## Exercise

In the backtest explorer's scoring view, enter an actual of 100 and a forecast of 150, then a forecast of 50, and compare sMAPE with MAPE each time. Then enter the actuals 0 and 100 with the forecasts 0 and 90, and change the first forecast to 5. Say which term moved and by how much, and why MAPE gave no number in either run.
