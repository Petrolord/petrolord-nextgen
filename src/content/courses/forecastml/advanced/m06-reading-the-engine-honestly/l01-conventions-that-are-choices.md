# Conventions that are choices

{{panel:pf-uncertainty-explorer}}

Every number this engine returns rests on conventions, and every convention is a choice. Each one has a real alternative in common use, and another tool may have taken it. When a figure from this engine is compared with one from anywhere else, the first question is which conventions differ.

## The table

| convention | this engine | a common alternative | why the engine chose it |
| --- | --- | --- | --- |
| form of the recursions | component form (FPP3), beta the trend weight on the level change | error-correction form, or beta multiplied by alpha (some texts) | beta is statsmodels' smoothing_trend, so a parameter compares directly |
| the start | l_1 = y_1, b_1 = y_2 - y_1, y_2 not scored | estimated initial states (statsmodels), or a mean of early differences (NIST double smoothing) | a learner can start the recursion by hand |
| the fit | least one-step SSE; grid then compass search in a stated box | maximum likelihood with a gradient optimiser | deterministic: the same series gives the same parameters |
| phi range when fitted | 0.8 to 0.98 | any value in (0, 1] | FPP3 8.2 restricts an estimated phi to this range |
| MAPE with a zero actual | null with the reason | drop the month, or divide by a tiny number | a shut-in month is real and dropping it changes the metric |
| MASE scale | in-sample lag-m naive MAE of the training series, m = 1 | the out-of-sample naive error, or a seasonal m | the scale is fixed before the forecast is scored |
| backtest window | expanding, from month 0 | a sliding window of fixed length | every month before the origin is information a forecaster would have |
| intervals | residual bootstrap, residuals as fitted without centring, parameters held | analytic intervals, a centred bootstrap (residual mean subtracted), or a bootstrap that also resamples parameters | no distribution is assumed; the method's own errors are replayed |
| quantile | lib/stats quantile (the simple-statistics rule) | linear interpolation (numpy default) | the platform's one quantile |
| percentile labels | P90 the low case (exceedance) | P90 the 90th percentile | the platform convention for outcomes |
| Arps time base | month k passed as day k, Di per month | calendar days | fitArpsModel reads days and a step is a month |
| ranking | lowest metric first, ties within 1.00e-12 keep the listed order, MASE by default | ranking by RMSE or by MAPE | MASE compares wells of any size and stays defined through a shut-in |

## Reading the choices

Some choices trade one good for another. The start at the first observation lets a learner run the recursion by hand, and it spends the second month: holt and damped score one error fewer than ses on the same series. statsmodels estimates the initial states instead, so its fitted parameters on the same series can differ from these even where both minimise one-step errors.

Some choices protect a figure from being quietly changed. MAPE through a shut-in month is returned as null with its reason: a shut-in month is real, and dropping it changes the metric. The MASE scale is fixed from the training months, so it is set before the forecast is scored and cannot be tuned by the months being forecast.

Some choices buy reproducibility. The fit minimises the one-step SSE by a grid and a compass search in a stated box, with stated tie rules, so the same series gives the same parameters on every machine. Maximum likelihood with a gradient optimiser is the alternative in common use. The backtest's expanding window uses every month before the origin, because a forecaster standing at that origin would have them all; a sliding window of fixed length forgets the early months on purpose.

Some choices are platform conventions that travel across every course. The quantile is the one the platform uses everywhere, and the P labels read by exceedance, so P90 is the low case in this course exactly as it is in every other outcome the platform reports.

The interval choice is the one this tier has examined most closely. The engine replays the residuals as fitted, without centring, and holds the parameters. On a method whose residuals lean one way, the paths drift with them, and ses on EKENE-P1 puts its flat point forecast above even its own P10 (high) by step 12. A centred bootstrap would take the residual mean out first; a bootstrap that resampled parameters would add their uncertainty. The engine states its choice in its basis so that a reader knows which one was made.

## Naming the choice in practice

When you set a figure from this engine beside one from another tool, list the conventions each used before you compare any number. Two figures that disagree may both be right under their own conventions, and a comparison that does not name them compares the conventions without saying so.

## Exercise

Choose three rows of the table among the intervals, the quantile, the labels, the Arps time base and the ranking. For each, open the view of the uncertainty explorer where it shows ("Bootstrap intervals", "The Arps baseline" or "Methods ranked against Arps"), find the declared block that states it in the engine's words, and copy it. Then write one sentence per row on how a figure from a tool that took the alternative could differ, without quoting any number the course has not given you.
