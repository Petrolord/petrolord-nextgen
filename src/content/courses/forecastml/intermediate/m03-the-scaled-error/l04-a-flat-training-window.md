# A flat training window

{{panel:pf-backtest-explorer}}

MASE divides by Q, the naive forecast's in-sample error. If the training months never change, the naive forecast is perfect on them, Q is 0, and the division has no answer. EKENE-P3's plateau is built to show exactly that.

## The plateau

EKENE-P3 was held by its facility at exactly 1500.000000 bbl/d for months 0 to 8, counted from 0, and declines from that rate after. Its first nine months are identical. As a training series, every month-to-month difference is 0, so the lag-1 naive forecast has no error on them at all.

Scored with those nine months as the training series, MASE is returned as null with this reason in `notes`:

> MASE is undefined: insample has 9 values and the lag-1 naive forecast has zero in-sample error on them (every y[t] - y[t - 1] is 0), so the scale is 0

Every other metric of the call is still a number. MASE is returned as null, with the reason.

## Why null and nothing else

Dividing by 0 would give an infinite MASE, which says nothing about the forecast. The engine returns null, states the reason and swaps in no other scale. The analyst decides: take a longer training window, or report the other metrics and say why MASE is missing.

## Too few months, a different reason

A training series can also be too short for any difference. One training month with m 1 has no month before it, so there is nothing to average:

> MASE is undefined: insample has 1 value, so the lag-1 naive forecast has no in-sample error (it needs more than 1)

The first case had nine values and a scale of 0; this one has too few values to make a scale.

## The same rule at a backtest origin

A backtest fits at each origin on the months before it, and takes Q from that window. On EKENE-P3 with ses from first origin 6, the first window holds months 0 to 5, all inside the plateau:

> MASE is undefined: at origin 6 the training window has 6 values and the lag-1 naive forecast has zero in-sample error on them (every y[t] - y[t - 1] is 0), so the scale is 0

A backtest reason names the origin it comes from, where an `accuracy` reason names the input. The module on pooling backtest errors shows what one such origin does to the pooled MASE of the whole backtest.

## Where plateaus come from

A facility limit, a choke held for allocation, a well produced to a quota: each can hold a rate exactly flat for months. A training window wholly on such a plateau says nothing about how the rate moves. Recognising the plateau is a question for the data quality course; this engine reports it through the reason.

## Exercise

In the backtest explorer's scoring view, enter EKENE-P3 months 0 to 8 as the training series, with any actuals and forecasts, and read the reason for MASE. Then add month 9 to the training series and say what happens to MASE and why. Finally, run a backtest on EKENE-P3 with ses from first origin 6, read the reason, and then move the first origin past the plateau.
