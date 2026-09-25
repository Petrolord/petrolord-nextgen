import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Professional m04, rolling-origin backtests and leakage.
# Figures are the course's teaching backtest (holt on EKENE-P1, first origin
# 24, horizon 6, step 6, refitted unless stated), the one-step leakage runs
# from origin 36 and the refusals the course quotes. No capstone field, well,
# stated input or graded answer appears.

q(2, "The teaching backtest runs holt on EKENE-P1's 48 months from first origin 24 with horizon 6 and step 6. Which origins does it score?",
 "24, 30, 36 and 42",
 ["24, 30 and 36, stopping where the next origin would reach the last month of the series",
  "24, 30, 36, 42 and 48, one every 6 months up to the end of the series",
  "Every month from 24 to 42, since the step sets only how far each forecast looks ahead"],
 "The origins run 24, 24 + 6 and on while o + 6 <= 48, so the last is 42, whose 6 actuals are months 42 to 47. Origin 42 is accepted because 42 + 6 = 48. Origin 48 has no actuals at all, and the step is the distance between origins, while the horizon sets how far each forecast looks.")

q(2, "In the teaching backtest, which months is the method fitted on at origin 30?",
 "Months 0 to 29, and it forecasts months 30 to 35",
 ["Months 24 to 29, a fixed window sliding on",
  "All 48 months, with 30 to 35 scored later",
  "Months 6 to 29, the last window moved on"],
 "The window expands from month 0: at origin o the method is fitted on months 0 to o - 1 only, so origin 30 trains on months 0 to 29 and forecasts months 30 to 35. The engine's basis reads \"expanding window: origin o trains on y[0..o-1] and forecasts y[o..o+5]\". A sliding window would drop early months, and fitting on all 48 would let the scored months reach the fit.")

q(3, "With refit true, holt's alpha is 0.684236 at origin 24 and 0.655079 at origin 42. Why does it move?",
 "Each window is a different series, and the free parameters are re-estimated on each one",
 ["The engine lowers alpha by a fixed amount at every origin to damp the later forecasts",
  "Alpha is carried from the first window and drifts through rounding over the four origins",
  "Refit re-estimates beta only, and alpha follows it through the trend update each time"],
 "With refit true the basis reads \"free parameters re-estimated at every origin\", and each expanding window adds months, so the least-SSE alpha and beta move: 0.684236 and 0.379743 at origin 24, 0.655079 and 0.393438 at origin 42. No fixed step is applied, nothing is carried from the first window when refitting, and both parameters are re-estimated.")

q(2, "The teaching backtest is rerun with refit false. What parameters does origin 36 use?",
 "Alpha 0.684236 and beta 0.379743, estimated once on the first window",
 ["Alpha 0.663079 and beta 0.398667, fitted at that origin",
  "The full-series parameters, held at every origin",
  "Whatever alpha and beta the learner last passed, with nothing estimated"],
 "With refit false the basis reads \"free parameters estimated on the first window and held at every later origin\", so every origin carries the origin 24 values, alpha 0.684236 and beta 0.379743. 0.663079 and 0.398667 are the refitted origin 36 values. The full series never reaches the parameters, and free parameters are still estimated, once.")

q(0, "Refitted, the teaching backtest's MASE is 0.374515; with parameters held from the first window it is 0.368974. Which is the honest test?",
 "Both, since at every origin only months before the origin were used",
 ["Only the refitted run, as held parameters let later months in",
  "The held run alone, having the lower MASE",
  "Neither, until the two figures agree"],
 "Held parameters are cheaper and test one parameter set on later data; refitting tests the whole procedure as it would be run each month. Either is honest, because at every origin only months before the origin were used. The held parameters come from the first window, so no later month enters, and a lower figure is no proof of honesty. Say which was run.")

q(2, "With refit false, how do origin 24's errors compare with the refitted run's?",
 "They are the same, since both runs fit the first window the same way",
 ["They differ at every step, since holding the parameters changes the first forecast too",
  "Every error is larger, nothing having been estimated",
  "They match at step 1 only, and the later steps of origin 24 then drift apart"],
 "The held run estimates its parameters on the first window, which is exactly what the refitted run does at origin 24, so the first origin's errors are the same (11.627690 at step 1 on to 31.937659 at step 6); later origins differ. The held parameters are estimated from data, once, and nothing differs inside origin 24.")

q(0, "Holt on EKENE-P1 with horizon 6 is started at origin 2. What does the engine say?",
 "It refuses: \"firstOrigin must be a whole number from 3 to 42 ('holt' needs 3 training values; an origin above 42 leaves fewer than 6 actuals)\"",
 ["The origin moves up to 3, the first one holt can fit, and the backtest runs from there to origin 42 with a note in the result saying the first origin was raised",
  "Origin 2 runs, and month 2 scores a residual of 0, as the fit forecasts that month exactly from its start of l_1 = y_1 and b_1 = y_2 - y_1, before the others",
  "A refusal naming `horizon`: \"horizon must be a whole number, 1 or more\", since 6 steps from origin 2 run past the training window the call has"],
 "Holt spends its second month on the start, so it needs 3 training values and the lowest origin is 3; the highest is 42, leaving 6 actuals. The engine refuses and names `firstOrigin` in those words. Nothing is moved or run, and the horizon is not the field at fault.")

q(0, "Ses from origin 45 with horizon 6 on EKENE-P1's 48 months is refused with \"firstOrigin must be a whole number from 2 to 42 ('ses' needs 2 training values; an origin above 42 leaves fewer than 6 actuals)\". Why is the lower limit 2 for ses and 3 for holt?",
 "Ses needs 2 training values, while holt and damped spend their second month on the start",
 ["Ses may start a month earlier, its flat forecasts being cheap to score",
  "The lower limit is the horizon divided by 3, and ses runs shorter",
  "Holt requires a month of warm-up that ses skips, as ses has no parameters to estimate at all"],
 "The limit follows the method's fitting length: ses needs 2 values, the first to set the level and the second to be the first scored forecast; holt and damped start their trend from the first two months, so they need 3. The upper limit, 42, follows the horizon and the series length. Ses still fits an alpha, and the horizon plays no part in the lower limit.")

q(1, "EKENE-P6, the new well, has 3 months. What does a backtest of holt with horizon 1 return?",
 "A refusal: \"y has 3 values: a backtest with horizon 1 needs at least 4 ('holt' needs 3 training values, then 1 actual)\"",
 ["One origin, 2, scored on month 2, since holt can be fitted on its three months and a horizon of 1 needs only one actual after it",
  "A backtest of ses in place of holt, the engine choosing the method its length allows and naming the swap in the result",
  "Pooled metrics that are all null, each with a reason in `notes` naming the short series and the months it would need"],
 "Holt can be fitted on 3 months, but a backtest needs 3 training values and then at least one actual, 4 in all, so it is refused by that length rule in the engine's words. No origin below 3 exists for holt, the engine never swaps the method, and a refusal carries no metrics.")

q(3, "A backtest is asked for with a horizon of 0. What does the engine return?",
 "A refusal naming `horizon`: \"horizon must be a whole number, 1 or more\"",
 ["Every origin's fitted parameters with no forecasts, as a horizon of 0 asks for none",
  "The in-sample residuals of each window, as zero-step errors",
  "Metrics returned as null, each with the reason that no actual was scored at all"],
 "A horizon of 0 is refused in the engine's own words, and the same holds for a step of 0 with \"step must be a whole number, 1 or more\". A refusal returns no result, so no parameters, residuals or null metrics come back.")

q(1, "On EKENE-P1, holt is fitted on all 48 months, the parameters are held, and a backtest from origin 36 with horizon 1 and step 1 is run. It gives MAE 8.045544 on months 36 to 47, while the honest backtest refitted at each origin gives 8.096036. What leaked?",
 "Months 36 to 47 chose the parameters, fitted on all 48 months",
 ["Nothing, as the backtest trains only on months before each origin",
  "The state and the parameters both, exactly as in the honest run from origin 36",
  "Only the scale Q, taken from all 48 months"],
 "The parameters were fitted on all 48 months, so months 36 to 47 chose them, and that is a route by which the scored months reach the fit. The state at each origin is still run from months before the origin. The honest run lets nothing leak, and the scale plays no part in an MAE.")

q(0, "The two leaky routes on EKENE-P1 (the full fit scored on its own one-step residuals for months 36 to 47, and full-fit parameters held in a backtest from origin 36) both print MAE 8.045544. Are they the same numbers?",
 "Yes: the course checks they are the same error for error, exactly",
 ["Not necessarily; two figures that print alike at six decimals may differ in later digits",
  "No: the residual route leaks the state and the parameters, so its MAE must be lower",
  "Yes, but only by chance on this well, as the two routes compute different quantities"],
 "Holding parameters fitted on the whole series and stepping forward one month at a time replays the full fit's own one-step forecasts, error for error, and the course checked the two are the same exactly before calling them the same. Printing alike alone would not prove it, which is why the check was made; the equality follows from the procedure.")

q(3, "A learner picks test months at random and fits on the others. Why does the course call that leakage?",
 "The months around each test month, before and after it, are in the fit",
 ["Random months have unequal sizes in bbl/d, which biases the MAE downward",
  "A random split scores too few months to give a MASE with its own scale",
  "The engine's random split reuses one seed, so the same months are always drawn"],
 "Choosing test months at random and fitting on the rest leaks the future into the past, because later months sit in the fit. The engine offers no random split: a smoothing method needs an unbroken series, and its only honest test is an origin with everything after it held back.")

q(1, "Why is the last origin of the teaching backtest 42 and never 43?",
 "Origin 43 with horizon 6 would need month 48, which the series does not have",
 ["The step of 6 lands on 42, and origins may only fall on multiples of the step",
  "Holt refuses any origin within 6 months of the end, whatever the horizon is",
  "Origin 43 leaves the training window too long for the compass search to fit it"],
 "Every origin must have all its actuals, so the last is the largest o with o + 6 <= 48: 42 is accepted since 42 + 6 = 48, and 43 would need month 48, one past month 47. The rule turns on the horizon and the series length, multiples of the step play no part, and a long training window is never refused.")

q(3, "At origin 36 of the teaching backtest, holt's step 1 error is -12.431964. Where else does the course print that same figure?",
 "As holt's month 36 error on the teaching hold-out, fitted on months 0 to 35",
 ["Only in the backtest, as a hold-out fits on all 48 months before it is scored",
  "As the in-sample residual of month 36 from the fit on all 48 months of EKENE-P1",
  "In the held run alone, since the refitted run changes the step 1 error at origin 36"],
 "Origin 36 trains on months 0 to 35 and forecasts from there, which is the teaching hold-out, so its step 1 error equals the hold-out's month 36 error, -12.431964, and the six errors run on to -5.029938 at month 41. The hold-out fits months 0 to 35 only; a full-series residual lets month 36 into the fit; and the held run uses origin 24's parameters, so its origin 36 errors differ.")

emit(Q, '/root/dai-wip-forecastml/banks/d4i_m04.json', expect_n=15)
finish()
