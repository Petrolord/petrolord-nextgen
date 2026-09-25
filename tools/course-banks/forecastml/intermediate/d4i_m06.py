import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Professional m06, methods compared end to end.
# Figures are the course's comparisons: EKENE-P2 before the shut-in (months 0
# to 21, origins 10, 13, 16, 19, horizon 3) and after the workover (origins 28
# to 40, horizon 6, step 3), the four first origins after the restart, and
# EKENE-P1 from first origin 30, horizon 6, step 3. Every ranking here is by
# MASE at m 1, as the comparison defaults. No capstone field, well, stated
# input or graded answer appears.

q(2, "What does `compareWithArps` hold the same for every method it scores?",
 "The origins, the horizon and the metrics, with Arps backtested beside ses, holt and damped",
 ["Only the metrics: each method is free to pick the origins that suit its own fitting length best",
  "The fitted parameters, which are estimated once on the first window and shared by all",
  "The forecasts themselves, averaged over the methods before any error is taken from them"],
 "The Professional question is the testing workflow: the same origins, the same horizon, the same metric, for every method, and the comparison backtests ses, holt, damped and the Arps baseline that way. Each method fits its own parameters, and nothing is averaged across methods before scoring.")

q(0, "On EKENE-P2's months 0 to 21, before the shut-in (origins 10, 13, 16, 19, horizon 3), how do the methods order by MASE?",
 "Arps 0.389192, holt 0.483573, damped 0.504549, ses 1.006754",
 ["Holt 0.483573 first, arps 0.389192 second, ses last",
  "Holt, damped, arps, ses, as after the workover",
  "Ses first at 1.006754, the highest MASE"],
 "Ordered by MASE, arps 0.389192 is the lowest, then holt 0.483573, damped 0.504549, ses 1.006754, with arps first before the shut-in. Arps's 0.389192 is below holt's, so holt cannot lead; the order after the workover is a different comparison; and a higher MASE is the worse one.")

q(2, "Over all 48 months of EKENE-P2 (origins 28, 31, 34, 37, 40, horizon 6), after the workover, which method has the lowest MASE, and where does arps stand?",
 "Holt, at 0.571171, with arps third at 0.605968",
 ["Arps, at 0.389192, as it was before the shut-in",
  "Damped, at 0.599131, with arps second behind it",
  "Arps and holt level, since the two print close to one another"],
 "After the workover the order by MASE is holt 0.571171, damped 0.599131, arps 0.605968, ses 0.789324. 0.389192 is arps before the shut-in, a different window; damped is second; and arps's 0.605968 is above holt's 0.571171.")

q(3, "Why does the Arps baseline fall behind on EKENE-P2 after the workover?",
 "Its fit is a regression on every positive month of each window, the months before the uplift included",
 ["The shut-in months are fitted as zeros, which drags the Arps curve down to the floor",
  "Arps is fitted once on the first window and held, while the smoothing methods are refitted at each origin",
  "The comparison scores Arps on MAPE alone, and MAPE is null through the shut-in months"],
 "The Arps fit is a regression on every positive month of each training window, including the months before the uplift, so it forecasts too low after the restart: its mean error is -23.147528 bbl/d against holt's 20.751043. Zero months are dropped before the fit, Arps is refitted on every window, and every method is scored on the same metrics.")

q(1, "After the workover the Arps baseline's mean error is -23.147528 bbl/d and holt's is 20.751043. What does each sign say?",
 "Arps forecast high on average and holt forecast low",
 ["Arps low and holt high",
  "Both forecast high, the signs only marking which method was fitted first",
  "Arps was the more accurate, being the one with a negative mean"],
 "An error is actual minus forecast, so a negative mean says the forecast sat above the well and a positive mean says it sat below: Arps high, holt low. The sign is the direction of the bias, and it does not say which method is better; that is read from a named metric such as MASE.")

q(2, "The same EKENE-P2 comparison is started from first origins 26, 28, 30 and 32 after the restart (horizon 6, step 3). What stays the same across the four?",
 "A smoothing method ranks first by MASE every time",
 ["Holt ranks first by MASE from each of the four first origins",
  "Arps stays in third place, behind holt and damped, at every origin",
  "The best MASE, held close to holt's 0.571171 whichever origin opens the run"],
 "The first-ranked method is holt from 26, 28 and 32 and damped from 30, so a smoothing method leads each time while which one changes. Arps is second from 26, third from 28 and 30, and last from 32. The best MASE runs 0.573284, 0.571171, 0.461235 and 0.510297.")

q(1, "From first origin 30 after the restart, the EKENE-P2 comparison orders damped, ses, arps, holt. What does the course conclude from this beside the run from origin 28?",
 "The winner depends on the origins, so a ranking is reported with its origins, horizon, step and metric",
 ["Damped is the right method for EKENE-P2, having the lowest MASE of any run at 0.461235",
  "The origin 28 run was wrong, as holt should not rank last from a later first origin",
  "Holt is unstable on this well and is dropped from the comparison before a note is written"],
 "From origin 28 holt ranks first and from origin 30 last, with damped first at 0.461235: the same methods on the same well order differently as the origins move. The course's rule is to report a ranking with its origins, horizon, step and metric. One favourable run does not name a method right for the well, and neither run is wrong.")

q(2, "On EKENE-P1 from first origin 30, horizon 6, step 3, the comparison ranks arps first at MASE 0.199862. Why does the course expect that?",
 "EKENE-P1 was drawn from an Arps curve when the synthetic field was built",
 ["Arps always ranks first on a 48-month well, whatever the well's shape",
  "The Arps baseline is scored in-sample while the smoothing methods are backtested",
  "Arps is scored on fewer origins than the others, which flatters its MASE"],
 "The Ekene field is synthetic, and EKENE-P1 was drawn from an Arps curve, so the Arps baseline fitting it best is expected. On EKENE-P2 after the workover arps ranks third, so it does not always lead. Arps is backtested on the same origins as the others, and the order comes from the MASE figures.")

q(0, "In that EKENE-P1 comparison, how many errors does each method's row pool?",
 "30: origins 30, 33, 36, 39 and 42 each score 6 steps",
 ["24, as in the teaching backtest",
  "6, one per step ahead of the first origin",
  "48, one per month"],
 "First origin 30 with step 3 gives origins 30, 33, 36, 39 and 42, each scoring horizon 6, so each row pools 30 errors. The teaching backtest, with step 6 from origin 24, pools 24; months before origin 30 are never scored.")

q(3, "What `refit` does `compareWithArps` use when none is given, and what happens to the Arps baseline?",
 "Refit true, as in `backtest`, and Arps is refitted on every training window whatever refit says",
 ["Refit false, holding every method's parameters from the first window, Arps included",
  "Refit true for the smoothing methods only, with Arps fitted once on all 48 months",
  "No refit at all: the comparison fits each method on the whole series and scores its residuals afterwards"],
 "The signature reads `refit = true` and `m = 1`, and the EKENE-P1 result returns refit true. The Arps baseline is refitted on every training window whatever refit says. Fitting on all 48 months would let the scored months reach the fit, which the comparison never does.")

q(1, "In the EKENE-P1 comparison, ses has ME -30.493333 and MASE 1.067547. What does that pair say about ses on this well?",
 "Its flat forecast ran high on the decline, and its MAE exceeded the in-sample naive error",
 ["Low forecasts, and it beat the in-sample naive forecast by a small margin on average over the run",
  "No bias, and a MASE just above 1 marks a method that equals the naive forecast in its size",
  "High forecasts, yet a MASE above 1 places it first among the four methods"],
 "A negative ME says the forecasts sat above the well on average, as a flat forecast does on a decline, and a MASE above 1 says its MAE was larger than the in-sample naive error. Ses ranks last on this comparison, behind arps 0.199862, damped 0.287529 and holt 0.346480.")

q(0, "Which set of items belongs in a note written up for a backtest?",
 "The origins with horizon and step, refit or held, each metric with its reason when null, MASE with its m and the ranking's metric",
 ["The best method's name and its MASE, since the remaining settings can be read back from the engine",
  "The in-sample MSE of each method, which stands in for the backtest when the series is short",
  "Only the pooled MAE in bbl/d, because a single metric keeps the note easy to check and compare"],
 "A backtest note names the well and months, the methods, the first origin, horizon and step and so the origins, refit or held, each metric with its reason when null, MASE with its lag m, and the ranking with the metric it is by. Every figure changes when a setting changes, so a note that leaves one out cannot be checked; an in-sample MSE answers another question.")

q(0, "A draft note reads \"holt is accurate on EKENE-P2\". What does the course require in its place?",
 "The metric and the months, for example holt's MASE 0.571171 at m 1 from origins 28 to 40",
 ["Nothing more: holt ranks first after the workover, and the claim can stand in the note as written",
  "Holt's in-sample MSE on all 48 months, the fit that the backtest was designed to confirm",
  "The word \"accurate\" replaced with \"best\", since the ranking settles the matter by itself"],
 "Any statement of how good a forecast is names its metric and its months: holt's MASE 0.571171 at m 1 over origins 28, 31, 34, 37 and 40, horizon 6. Holt ranks first only from some origins, an in-sample MSE is not a test of forecasting, and \"best\" still needs its metric and origins.")

q(3, "A learner compares holt's MASE 0.241874 on EKENE-P1's teaching hold-out with its 0.374515 from the teaching backtest and concludes that holt got worse. What is wrong with that reasoning?",
 "They are different tests: one origin against four origins pooled",
 ["Nothing; both are MASE at m 1 on EKENE-P1, so the rise shows holt worsening",
  "The hold-out MASE uses lag 12, which makes it much smaller than the backtest's",
  "The backtest MASE is in percent, so it cannot be set against the hold-out"],
 "A hold-out MASE and a backtest MASE of the same method are different tests: the hold-out scores one origin, 36, and the backtest pools 24 errors from origins 24, 30, 36 and 42, each on its own scale. Both are at m 1, and MASE has no unit.")

q(3, "Ranking EKENE-P2's methods through its shut-in, why is MASE a workable default where MAPE is not?",
 "MASE stays a number through the shut-in, while MAPE comes back null",
 ["In bbl/d, MASE keeps the shut-in months on their true scale",
  "Months after the workover are ignored, so the uplift cannot sway it",
  "Arps can be scored on MASE alone, the others needing a fit"],
 "MASE scales by the training months' naive error, so a zero actual in the scored months does not void it; MAPE divides by each actual and returns null through the shut-in. MASE has no unit, it scores every origin's months after the workover, and Arps is scored on every metric.")

emit(Q, '/root/dai-wip-forecastml/banks/d4i_m06.json', expect_n=15)
finish()
