import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Professional m02, percentage errors.
# Figures are the course's: the teaching hold-out on EKENE-P1 (fit months 0 to
# 35, score 36 to 47), the EKENE-P2 shut-in hold-out (holt fitted on months 0 to
# 19, scored on 20 to 25), EKENE-P5's low tail and the stated 0/0 and asymmetry
# cases. No capstone field, well, stated input or graded answer appears.

q(3, "Holt on EKENE-P2 is fitted on months 0 to 19 and scored on months 20 to 25, which include the shut-in months 22 to 24 at rate 0. What does the engine return for MAPE?",
 "No number: MAPE comes back as null, and the reason goes in `notes`",
 ["A refusal naming `actual`, since a zero rate cannot be scored by any of the metrics at all",
  "MAPE over the three producing months only, 20, 21 and 25, with the shut-in months dropped",
  "200.000000 percent, the top of the scale"],
 "MAPE divides by each actual, and a shut-in month has none to divide by, so the engine returns MAPE as null with the reason \"MAPE is undefined: actual[2] is 0 and MAPE divides by each actual\" in `notes`, in its own words. It is a result with every other metric a number, and no refusal. The engine keeps the month and reports no number for MAPE. The 200.000000 figure is the sMAPE term of a shut-in month, and MAPE has no such top.")

q(0, "In that shut-in reason, \"MAPE is undefined: actual[2] is 0 and MAPE divides by each actual\", which month is actual[2]?",
 "Month 22, the first shut-in month, being index 2 of the actuals for months 20 to 25",
 ["The third month on production, month 2, counted from month 0 of the series",
  "Index 2 read from 1: month 21, the second actual passed",
  "Month 24, the last of the three shut-in months, where the zero run ends"],
 "An `accuracy` reason names the input, and the actuals passed are months 20 to 25, so index 2, counted from 0, is month 22, the first month at rate 0. Month 2 is outside the actuals scored. Every index in this course counts from 0, so index 2 is never the second actual, and the reason names the first zero it meets.")

q(0, "On the same EKENE-P2 hold-out MAPE is null. Which metrics does the engine still return as numbers?",
 "MAE 209.968065, RMSE 258.102385, MASE 5.427746 and sMAPE 108.172490",
 ["None: once one metric is null the engine withholds the other metrics of the call as well",
  "Only sMAPE, 108.172490, because the shut-in months void every metric scaled in bbl/d",
  "MAE and RMSE alone, as MASE and sMAPE divide by rates and so fail at a zero actual"],
 "A null metric is reported with its reason while the other metrics are still numbers: MAE 209.968065, RMSE 258.102385, MASE 5.427746 and sMAPE 108.172490. MAE and RMSE are in bbl/d and need no division by a rate. sMAPE divides by the sum of the actual and the forecast, and MASE by the training series' naive error, so neither fails at a zero actual.")

q(3, "On that EKENE-P2 hold-out holt forecasts month 23 at 355.679339 and the well made 0.000000. What does month 23 add to sMAPE?",
 "A term of 200.000000, the top of the scale",
 ["A term of 0, since a month with actual 0 is left out of the sum as a zero",
  "A term of 100 percent, the full size of the error against the forecast alone",
  "Nothing yet: sMAPE is null for the call, as MAPE is, and so no term is printed"],
 "The term is 200 |e| / (|y| + |f|), and with an actual of 0 the error equals the forecast in size, so the term is 200.000000 whatever non-zero forecast is made. Only a term with actual and forecast both 0 scores 0. sMAPE stays a number, 108.172490, while MAPE is null.")

q(1, "The stated actuals 0 and 100 are scored twice: with forecasts 0 and 90 sMAPE is 5.263158, and with forecasts 5 and 90 it is 105.263158. What explains the jump?",
 "A term whose actual and forecast are both 0 scores 0, while forecast 5 on actual 0 scores 200",
 ["The first run drops the zero month from the mean, while the second run keeps that month and counts it",
  "Forecast 5 is a larger error in percent than 90 on 100, so the scale doubles for both",
  "sMAPE switches to MAPE when a forecast of 0 appears, and MAPE reads lower here than sMAPE"],
 "The engine's rule is that a term with actual = forecast = 0 scores 0, so the first run averages 0 and the 90-on-100 term. A forecast of 5 on an actual of 0 scores the top term, 200, and lifts the mean by 100. No month is dropped, nothing switches metric, and MAPE is null in both runs because the first actual is 0.")

q(0, "Stated actual 100: a forecast of 150 scores sMAPE 40.000000, and a forecast of 50 scores 66.666667. MAPE is 50.000000 for both. Why does sMAPE differ?",
 "The forecast is in the denominator, so a low forecast shrinks it and the same error costs more",
 ["sMAPE weights an over-forecast as twice as costly, being a measure built to punish high forecasts",
  "It rounds each term to the nearest third, which shifts the 50 low case up to 66.666667",
  "It squares the error before it divides, as RMSE does, and so the larger forecast counts less"],
 "sMAPE is 100 x mean 2|e| / (|actual| + |forecast|). Both forecasts miss by 50, but the forecast of 150 makes the larger denominator, so the low forecast scores 66.666667 against 40.000000. The low forecast costs more, the opposite of punishing high forecasts; nothing is rounded or squared.")

q(3, "On the teaching hold-out ses reads MAPE 22.550260 and sMAPE 19.852301. Why is its sMAPE the lower of the two?",
 "Ses forecast every month high, and a high forecast enlarges the sMAPE denominator",
 ["sMAPE is held to 100 percent, which trims ses's largest monthly terms before the mean",
  "MAPE includes the training months 0 to 35 as well as the scored months, lifting it",
  "It is lower by chance; the two metrics move independently of the forecast's direction"],
 "Every ses error on months 36 to 47 is negative, so its flat forecast 290.700000 sits above each actual. sMAPE divides by |actual| + |forecast|, which a high forecast enlarges, while MAPE divides by the actual alone. sMAPE runs on 0 to 200 with no ceiling at 100, and both metrics score only the 12 hold-out months.")

q(2, "Holt on EKENE-P5's low tail (fitted on months 0 to 35, scored on 36 to 47) has MAE 3.244769 bbl/d and MAPE 24.095758. On EKENE-P1's hold-out its MAE is 6.783515 bbl/d and MAPE 2.781120. How can the smaller MAE carry the larger MAPE?",
 "EKENE-P5's rates run from 24.600000 to 11.100000 bbl/d, so a small miss is a large share",
 ["MAPE on EKENE-P5 is lifted by the well's shut-in months, which score 200 each on the low tail",
  "Holt fits worse in-sample on EKENE-P5, and MAPE carries the in-sample error forward",
  "MAPE is scaled by the training months' naive error, which is small on a steep well"],
 "MAPE divides each error by its actual, and EKENE-P5's actuals on months 36 to 47 are only 24.600000 down to 11.100000 bbl/d, so errors small in bbl/d are large in percent. EKENE-P5 has no shut-in; MAPE uses only the scored months; and the naive scale belongs to MASE, never to MAPE.")

q(1, "What does the course say a percentage error is good for, and where does it mislead?",
 "It puts wells of different size on one scale, and on a low tail it is large for small misses",
 ["No need to state the months scored follows from it, and it misleads only when a forecast is high",
  "Rate size leaves it unaffected, and it misleads only on wells with a plateau",
  "Bias is what it measures, and it misleads when positive and negative errors cancel"],
 "Dividing by the actual puts a large well and a small one on one scale, and the same division makes a percentage large where the rate is low, as on EKENE-P5's tail. A metric still names its months. The size of the rate is exactly what a percentage depends on, and bias is the ME's job, since percentage errors use absolute values.")

q(0, "On EKENE-P5's low tail damped reads MAE 12.689466 bbl/d, MAPE 84.152526 and sMAPE 57.006610; holt reads MAE 3.244769, MAPE 24.095758 and sMAPE 32.408520. Which statement holds?",
 "Holt's sMAPE is above its MAPE while damped's is below, yet holt is lower on all three metrics",
 ["Damped is lower by sMAPE, since that metric treats a low tail more kindly than MAPE does",
  "The two methods are tied by sMAPE, both landing in the same band on this tail",
  "Holt is lower by MAPE and MAE, but damped is lower once the error is made symmetric"],
 "Holt reads 3.244769, 24.095758 and 32.408520 against damped's 12.689466, 84.152526 and 57.006610, lower on every metric. Holt's sMAPE 32.408520 is above its MAPE 24.095758, and damped's 57.006610 is below its 84.152526. No reading makes damped lower or the two tied.")

q(2, "What range does the engine's sMAPE run over, and what is its basis?",
 "0 to 200 percent, as \"100 x mean 2|e| / (|actual| + |forecast|)\"",
 ["0 to 100 percent, halving the two-sided sum so a total miss reads 100",
  "Minus 200 to 200, since the sign of each error is kept in the numerator",
  "Unbounded above, since a forecast far above a small actual has no ceiling"],
 "The engine's basis reads \"100 x mean 2|e| / (|actual| + |forecast|), percent on 0 to 200; a term with actual = forecast = 0 scores 0\". Absolute values keep every term at or above 0, and the largest a term can be is 200, reached when one of actual and forecast is 0. A 0 to 100 version is another convention, which this engine does not use.")

q(3, "A backtest of ses on EKENE-P2 from first origin 20 has the shut-in in its actuals. Which reason does it give for MAPE?",
 "\"MAPE is undefined: the actual at index 22 (origin 20, step 3) is 0 and MAPE divides by each actual\"",
 ["\"MAPE is undefined: actual[2] is 0 and MAPE divides by each actual\", the reason `accuracy` gives",
  "A refusal naming `firstOrigin`, because an origin before a shut-in cannot be scored at all",
  "No reason, since a backtest drops the zero months and returns a MAPE over the rest"],
 "A backtest reason names the origin it comes from, while an `accuracy` reason names the input, which is why the index here is 22 of the series with origin 20 and step 3 beside it. MAPE is returned as null with that reason and the call is not refused; the engine drops no month.")

q(2, "Holt's term of sMAPE on EKENE-P2 month 25, after the shut-in, is 34.293958. What made it large?",
 "The rate came back at 456.100000 while holt forecast 322.579918, an error of 133.520082",
 ["The actual was 0, and a zero actual always scores the top term of 200 on the scale",
  "The error was negative, and sMAPE doubles each term in which the forecast ran high",
  "Its forecast was 0.000000, so the denominator held only the actual 456.100000"],
 "Month 25 is back on production at 456.100000, and holt, fitted on months before the shut-in, forecast 322.579918: an error of 133.520082, forecast low. 200 x 133.520082 / (456.100000 + 322.579918) gives the term 34.293958. The actual is not 0, the error is positive, and the forecast is far from 0.")

q(1, "Holt on the teaching hold-out reads MAPE 2.781120 and sMAPE 2.735957. Which reading of the pair is right?",
 "Both are in percent, and each describes months 36 to 47 of EKENE-P1 for holt",
 ["MAPE is in bbl/d and sMAPE in percent, so they cannot be compared directly at all",
  "Their small gap proves every holt error on the hold-out is the same size and sign",
  "They are close because both divide each error by the naive in-sample scale"],
 "MAPE and sMAPE are both percentages, and a percentage is named with its months: here months 36 to 47 for holt fitted on months 0 to 35. Holt's errors run from -13.910343 to 6.752492, mixing sizes and signs, and neither metric uses the naive scale, which is MASE's.")

q(2, "Why does the engine return MAPE as null at a zero actual and keep the month in the call?",
 "A shut-in month is real, and dropping it would change what the metric measures",
 ["Dropping it would need a refit, and MAPE is never allowed to refit the method used",
  "A null is the engine's way of refusing the whole call when any input is at zero",
  "The zero is always a data error, so the engine flags it and waits for a fill"],
 "Removing a month would change what MAPE measures, and a shut-in is part of the well's record, so the engine keeps it and gives no figure. No refit is involved in scoring, the call itself is answered with its other metrics, and the zero is read as production data that needs no fill.")

emit(Q, '/root/dai-wip-forecastml/banks/d4i_m02.json', expect_n=15)
finish()
