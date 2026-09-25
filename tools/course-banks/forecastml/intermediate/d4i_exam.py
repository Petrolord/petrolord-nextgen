import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Professional exam, 42 questions across forecast errors, percentage errors,
# the scaled error, rolling-origin backtests, pooling and methods compared.
# Every figure is a course figure on the Ekene wells: the teaching hold-out
# (EKENE-P1, fit months 0 to 35, score 36 to 47), the teaching backtest (holt,
# first origin 24, horizon 6, step 6), the EKENE-P2, EKENE-P3 and EKENE-P5 runs
# and the comparisons. No capstone field, well, stated input or graded answer
# appears.

# --- forecast errors ---
q(2, "Damped, fitted on EKENE-P1 months 0 to 35, forecasts month 36 at 283.622932. The well made 270.100000. What sign does the error carry?",
 "Negative: damped's figure exceeded what the well produced",
 ["Positive, the forecast exceeding the actual",
  "No sign at all, since the engine reports each error as a distance between two rates",
  "Positive for damped and negative for holt, because a damped method reverses the rule"],
 "The engine's rule is e = actual - forecast, the same for every method, so 270.100000 less 283.622932 is negative and says the forecast was high. The excess of forecast over rate is minus the error, and the sign is always printed.")

q(0, "Holt's error at month 47 of the teaching hold-out is 6.752492, with a forecast of 204.647508 against an actual of 211.400000. What happened at that step?",
 "Holt forecast low: the well held up at 211.400000 while holt's line kept falling",
 ["Holt forecast high by 6.752492 bbl/d, its line sitting above the actual at month 47",
  "An exact forecast, any error below 10 bbl/d counting as zero",
  "A residual of the fit, since month 47 was among the months the parameters were chosen on"],
 "A positive error is an actual above the forecast: the well made 211.400000 and holt's straight line forecast 204.647508. The engine rounds nothing to zero, and month 47 is a hold-out month, so the figure is an out-of-sample error and no residual.")

q(0, "Which month of the teaching hold-out did holt forecast most closely?",
 "Month 46, with an error of -0.027913",
 ["The first step, month 36, being nearest the end of the fit and the easiest to forecast",
  "At month 43, where the error was 0.730872, the only one below a single bbl/d in size",
  "Month 38, at 3.128846, where holt forecast low by the smallest margin of any month"],
 "Holt's errors on months 36 to 47 include 0.730872 at month 43 and -0.027913 at month 46, the smallest in size. Month 36's error is -12.431964; the errors do not shrink toward the first step; and 3.128846 is larger than both.")

q(2, "On the teaching hold-out ses forecasts 290.700000 for every one of months 36 to 47. Why is it the same figure each month?",
 "Ses has no trend, so every h-step forecast is the final level of the fit",
 ["The engine holds a forecast fixed across a hold-out so that each month is scored on equal terms",
  "Ses was fitted with alpha 0, which freezes the level at the first month of the series",
  "The hold-out months are all at one rate, so every method forecasts a flat line on them"],
 "Simple smoothing has no trend state, so its h-step forecast is the final level at every step. Holt and damped change from step to step on the same hold-out, so the engine fixes nothing; the actuals fall from 270.100000 to 211.400000; and nothing here states an alpha of 0.")

q(2, "On the teaching hold-out, how do the three methods order by RMSE, lowest first?",
 "Holt 8.360530, damped 16.204238, ses 55.720702",
 ["Damped 16.204238, holt 8.360530, ses 55.720702",
  "Holt 6.783515, damped 14.978829, ses 51.683333",
  "Ses 55.720702, damped 16.204238, holt 8.360530"],
 "The hold-out prints RMSE 8.360530 for holt, 16.204238 for damped and 55.720702 for ses. The figures 6.783515, 14.978829 and 51.683333 are the MAEs, and the other orders put a larger RMSE ahead of a smaller one.")

q(0, "Holt's hold-out MAE on EKENE-P1, 6.783515, is well below its in-sample one-step MAE on months 0 to 35, 19.755951. What does the course take from this?",
 "The two answer different questions, and the method is judged on the hold-out",
 ["A poor fit, since an honest out-of-sample error should always sit above the in-sample one",
  "Leakage, as a lower MAE out of sample needs months reaching the fit",
  "Dividing the in-sample figure by 12 before it can be compared with the hold-out one"],
 "Nothing requires an out-of-sample figure to exceed an in-sample one: they measure different horizons on different months, and on EKENE-P1 holt's straight line happened to follow months 36 to 47 closely. Leakage is judged by how a figure was made, never by its size, and dividing by 12 turns neither figure into the other.")

q(1, "Which of these is a residual in the course's sense?",
 "Holt's one-step error at month 20 of a fit on months 0 to 35",
 ["Holt's error at month 40 of the teaching hold-out, -13.910343",
  "Ses's pooled ME over the teaching backtest's twenty-four errors",
  "The difference between two methods' forecasts for the same month"],
 "A residual is an in-sample one-step error, on a month inside the fitted series. Month 40 is a hold-out month, so its figure is an out-of-sample error; a pooled ME is a metric; and a difference between forecasts involves no actual, so it is no error at all.")

q(1, "Which sentence meets the course's rule for stating how good a forecast was?",
 "Holt's MAE on EKENE-P1 months 36 to 47, fitted on months 0 to 35, was 6.783515 bbl/d",
 ["The most accurate method for EKENE-P1 is holt, and it is the one that should be used in every case",
  "EKENE-P1 was forecast well by holt, with a small error over the months checked",
  "Holt reached 2.781120, the best figure of the three methods on the well"],
 "The course legislates that a statement of how good a forecast is names its metric and its months: here MAE on months 36 to 47, with the training months named. The other sentences leave out the metric, the months or both; 2.781120 is holt's MAPE, but the sentence names neither the metric nor the months.")

# --- percentage errors ---
q(3, "Which figures are holt's, damped's and ses's MAPE when each is scored on months 36 to 47 of EKENE-P1?",
 "Holt 2.781120, damped 6.462737, ses 22.550260, all in percent",
 ["Holt 2.735957, damped 6.221199, ses 19.852301",
  "Damped 6.462737 ahead of holt 2.781120, since damped's forecast flattens",
  "All three tie near 2.781120, as MAPE is scaled to each well's own size"],
 "MAPE on the teaching hold-out is 2.781120 for holt, 6.462737 for damped and 22.550260 for ses. 2.735957, 6.221199 and 19.852301 are the sMAPE figures. A lower MAPE is the better one, and the three methods differ widely.")

q(3, "On the EKENE-P2 shut-in hold-out, holt's sMAPE term is 8.157702 at month 20 and 6.583278 at month 21. Which reading is right?",
 "Month 20 was forecast low by 34.471530 and month 21 high by 24.778760, the larger miss giving the larger term",
 ["Both months were forecast low, and month 21's term is smaller because its actual was larger",
  "Month 21's term is smaller because sMAPE halves the term of any month where the forecast ran high",
  "Both terms count 200 at the top, being in the months before the three months of shut-in"],
 "The errors are 34.471530 at month 20 (actual 439.800000, forecast 405.328470, forecast low) and -24.778760 at month 21 (actual 364.000000, forecast 388.778760, forecast high). The larger miss gives the larger term. sMAPE halves nothing, and only a zero actual with a non-zero forecast scores 200.")

q(1, "On the EKENE-P2 shut-in hold-out RMSE is 258.102385 against MAE 209.968065. Why is the gap so wide?",
 "The three shut-in months carry by far the largest errors, and squaring weights them heavily",
 ["RMSE counts each shut-in month twice, once for the zero rate and once again for the restart after it",
  "The zero actuals are replaced by the training mean before RMSE is computed",
  "RMSE is in percent here, since MAPE is null and the engine switches units"],
 "The errors at months 22, 23 and 24 are -372.229050, -355.679339 and -339.129629, far larger than the others, and RMSE squares before it averages, so they lift it well above the MAE. No month is counted twice or replaced, and RMSE stays in bbl/d whatever MAPE returns.")

q(0, "Holt's scaled error on EKENE-P2's shut-in hold-out prints 5.427746. How does that compare holt with the naive yardstick of months 0 to 19?",
 "Holt's MAE on months 20 to 25 was over five times the naive error of its training months",
 ["The MASE was returned as null and printed as a large number in its place",
  "Holt beat the naive forecast five times over on the months that were scored",
  "The shut-in months were dropped from the scoring, and so only five of the six months remain in the mean"],
 "MASE is the MAE over the lag-1 naive MAE of the training months 0 to 19, so 5.427746 says the MAE of 209.968065 bbl/d was more than five times that scale, driven by the shut-in misses. A MASE above 1 is worse than the naive yardstick, and no month is dropped.")

q(0, "Which methods on the teaching hold-out have a MAE below the lag-1 naive in-sample error of months 0 to 35?",
 "Holt and damped, at MASE 0.241874 and 0.534086",
 ["All three, since each method forecasts better than a naive forecast of the hold-out",
  "Ses alone, as its flat forecast is the naive forecast carried over to the months ahead",
  "Holt only, since damped's MASE above 0.5 places it level with the naive forecast"],
 "MASE below 1 means the MAE is smaller than the in-sample naive MAE: holt 0.241874 and damped 0.534086 are below 1, and ses at 1.842825 is above it. The yardstick is the in-sample naive error, and 1 is the line, so 0.534086 is below it.")

q(3, "On EKENE-P5's low tail, damped and holt are both fitted on months 0 to 35 and scored on months 36 to 47. Damped's MASE is 0.563761 against holt's 0.144157, and their MAEs are 12.689466 and 3.244769. Why do the MASEs stand in the same ratio as the MAEs?",
 "Both are divided by one scale, the naive error of the same training months",
 ["MASE is the MAE in percent, and a percentage keeps the ratio of any two MAEs",
  "The engine rescales the MASEs after scoring to match",
  "Damped and holt share their fitted parameters on this well, and so their errors"],
 "MASE is MAE / Q, and Q depends only on the training series, months 0 to 35 of EKENE-P5 for both methods, so the ratio of the MASEs is the ratio of the MAEs. MASE is no percentage, nothing is rescaled after scoring, and the two methods fit their own parameters.")

q(3, "A note quotes holt's MASE on the teaching hold-out as 0.024087 and leaves out the lag. What goes wrong?",
 "A reader assumes m 1, where the same forecast scores 0.241874",
 ["Nothing, as monthly data has one lag",
  "The figure is wrong for EKENE-P1",
  "The figure becomes a MAPE, as a scaled error without its lag is a percentage"],
 "0.024087 is holt's MASE at m 12, while m defaults to 1, where the same forecast reads 0.241874. The course's rule is to quote MASE with its m, because the lag is part of the figure. The engine prints whatever the arithmetic gives, and a MASE stays a ratio.")

q(0, "What does the MASE scale measure, in the words the course uses for it?",
 "The MAE the lag-m naive forecast makes on the training series, in-sample",
 ["Mean rate of the scored months, so that each error becomes a share of production",
  "Standard deviation of the forecast's own errors over the months being scored",
  "One-step residuals of the fitted method, their MAE over the months it was trained on"],
 "Q is the MAE of the naive forecast, each month forecast by the month m before, on the training series. The scored months never set it; it is no standard deviation; and it is built from the naive forecast with no part for the fitted method's residuals, so every method on one training series shares it.")

q(1, "At origin 30 of the teaching backtest, which alpha, beta and scale Q does the engine print?",
 "Alpha 0.667926, beta 0.392686, Q 32.003448",
 ["Alpha 0.684236, beta 0.379743, Q 36.956522",
  "Alpha 0.663079, beta 0.398667, Q 28.045714",
  "Alpha 0.655079, beta 0.393438, Q 25.682927"],
 "Refitted on months 0 to 29, origin 30 carries alpha 0.667926 and beta 0.392686, and its training window's scale is 32.003448. The other rows are origins 24, 36 and 42.")

q(3, "Across the whole teaching backtest, where does the largest error fall?",
 "At origin 24, step 6, where it is 31.937659",
 ["Origin 36, step 5, at -13.910343, the largest in size",
  "The last origin, 42, where the step 6 error is 13.266479",
  "At origin 30, step 6, at 23.158147, six months from the origin"],
 "Origin 24's errors run up to 31.937659 at step 6, above origin 30's 23.158147, origin 42's 13.266479 and origin 36's -13.910343. All of them are course figures, and 31.937659 is the largest in size.")

q(0, "The course's honest one-step run on EKENE-P1 moves holt forward one month at a time from origin 36, horizon 1, refitting each time. How many forecasts does it score?",
 "12, origins 36 to 47, each forecasting one month",
 ["4, origins 36, 38, 40 and 42",
  "1, origin 36, which forecasts months 36 to 47 in one run",
  "48, one per month"],
 "With horizon 1 and step 1 the origins run 36, 37 and on while o + 1 <= 48, so the last is 47, 12 origins, each scoring its own month; the MAE over those months is 8.096036. A single origin forecasting 12 steps is the hold-out, and origins before 36 are not in this run.")

q(1, "A backtest of holt on EKENE-P1 uses first origin 24, horizon 6 and step 3. How do its forecast windows sit against one another?",
 "They overlap: each origin forecasts 6 months, and the next origin starts only 3 months later",
 ["They tile the series exactly, each month forecast once, as in the teaching backtest",
  "Gaps open between them, three months left unforecast after every origin in turn",
  "They are refused, since a step shorter than the horizon is not accepted by the engine"],
 "Origin o forecasts months o to o + 5, and with step 3 the next origin is o + 3, so months o + 3 to o + 5 are forecast twice, once from each origin. The teaching backtest tiles because its step equals its horizon, 6. A gap would need a step longer than the horizon, and the comparisons of this tier run horizon 6 with step 3.")

q(2, "A backtest is passed `refit` as a word where true or false belongs. What comes back?",
 "A refusal naming `refit`: \"refit must be true or false\"",
 ["The refitted run, any word but false read as true",
  "The held run, as the engine defaults to held when refit cannot be read",
  "Both runs side by side, so the learner can choose between them afterwards"],
 "The engine refuses by name in its own words. It does not interpret the word as true or false or return both runs; refit true is the default only when refit is left out.")

q(1, "Ses has no trend state. What happens when a learner hands its backtest a beta anyway?",
 "A refusal naming `beta`: \"beta applies to 'holt' and 'damped' only: 'ses' has no trend\"",
 ["A backtest of holt, since a beta implies a trend and the engine switches method",
  "The ses backtest with the beta ignored and a note saying it was not used",
  "A ses backtest in which beta damps the level in place of alpha at every origin"],
 "Ses has no trend state, so a beta has nothing to weight and the call is refused by name. The engine switches no method and ignores no input silently; beta weights only a trend.")

q(3, "Scoring a forecast with `accuracy`, a learner leaves the actuals empty. How does the call end?",
 "A refusal naming `actual`: \"actual has 0 values: at least 1 actual is needed\"",
 ["Every metric returned as 0, since no month means no error to average",
  "Null for each metric, with the reason that nothing was scored, in `notes`",
  "Scores against the insample months, used in place of the missing actuals"],
 "The engine refuses and names the field in its own words; at least 1 actual is needed. A refusal returns no metrics, so none comes back as 0 or as null, and the training series is never scored in place of the actuals.")

q(1, "A `compareWithArps` call on EKENE-P1 has month 5 set to null. What does the engine do?",
 "It refuses by name: \"y[5] must be a finite number: fill or drop missing values first\"",
 ["Month 5 is dropped, and every method runs on the other 47 months of the series",
  "A fill of month 5 from months 4 and 6, noted in the result",
  "Arps runs, as it drops missing months, and only the smoothing methods are refused by name"],
 "A missing month is refused by name at the first index it meets, counting from 0; nothing is filled or dropped, and the caller decides how to condition the series. The refusal covers the whole call.")

q(1, "Why does the course say the answer to testing rows that are not a time series lies in another course?",
 "The machine learning course's split by whole wells is the answer for such rows",
 ["The engine offers a random split for rows, taught in the data quality course",
  "Rows that are not a time series are scored by MAPE only, in the decline curve course",
  "A random split of months is honest for smoothing, and other courses only extend it"],
 "The engine has no random split, because smoothing runs along an unbroken series and is tested honestly only from an origin with all later months withheld. Rows that are no time series are the machine learning course's subject, which splits them by whole wells. Picking months at random would put later months into the fit.")

# --- pooling ---
q(3, "In the teaching backtest's by-horizon rows, step 1 prints MAE 10.992423 and RMSE 11.060437. Why are the two so close?",
 "The four step 1 errors are of similar size, so squaring adds little weight to any one",
 ["Step 1 carries a single error, and for one error RMSE and MAE are equal",
  "Both are scaled by the same Q, which pulls the two figures together at step 1 and at no other step",
  "RMSE at step 1 is taken as the MAE plus a fixed allowance for rounding"],
 "The step 1 errors are 11.627690, 9.126974, -12.431964 and 10.783063, all near 11 in size, so RMSE is barely above MAE. Each step carries 4 errors, neither metric is scaled by Q, and nothing is added for rounding.")

q(2, "Which step of the teaching backtest's by-horizon rows has the lowest MASE, and which the highest?",
 "Step 4 lowest at 0.231002, step 6 highest at 0.570926",
 ["Step 1 lowest at 0.365737 and step 6 highest, the MASE rising in order",
  "Step 2 lowest at 0.295972, step 5 highest at 0.515369",
  "Step 3 lowest, where the ME equals the MAE at 9.044099"],
 "The by-horizon MASE reads 0.365737, 0.295972, 0.268086, 0.231002, 0.515369 and 0.570926 for steps 1 to 6: lowest at step 4, highest at step 6, and not in order. With 4 errors per step each figure is a small sample.")

q(2, "Five steps out, the four origins' errors average 9.511758 with their signs kept and 16.466929 without them. What does the difference between those two means reveal?",
 "Step 5 has errors of both signs, so the signed mean partly cancels",
 ["Every step 5 error is positive, and the gap comes from rounding",
  "Step 5 carries more errors than the other steps, which spreads them",
  "The MAE includes the scale Q, and the ME does not, at every step"],
 "The ME equals the MAE only when no error is negative; at step 5 origin 36's error is -13.910343 while the other three are positive, so the mean partly cancels. Every step carries 4 errors, and neither metric includes Q.")

q(1, "With parameters held from the first window, the teaching backtest pools ME 6.596911, MAE 11.639525 and RMSE 13.997928, against 6.558931, 11.785709 and 14.083697 refitted. What does the course do with the two sets?",
 "Report the one that was run and say whether it was refitted or held",
 ["Average them, since two honest runs of one method should be pooled into one figure",
  "Prefer the held set, whose lower MAE shows that refitting overfits each window",
  "Discard both, as two honest procedures that disagree cannot be quoted at all"],
 "Held parameters test one parameter set on later data; refitting tests the whole procedure. Both are honest, and a note names which was run. A lower MAE on one well proves no general rule, and the two sets are not averaged.")

q(2, "Of the seven origins in EKENE-P3's damped run from 6, one prints `maseScale` 18.163636. Which is it, and why is its scale small?",
 "Origin 12, whose window adds three declining months to the plateau",
 ["Origin 6, the first, whose window is the plateau and whose scale is small",
  "Origin 42, the last, whose window is longest and so steadiest",
  "Origin 18, as the scale doubles at each origin after the plateau"],
 "Origin 6's scale is 0 (`maseScale` null), and the other origins read 18.163636, 37.629412, 38.791304, 36.041379, 35.505714 and 33.797561 for origins 12 to 42. Origin 12 trains on months 0 to 11, the nine plateau months and three declining ones, so its mean difference is small. Origin 42's scale is 33.797561, and origin 18's is 37.629412, which is no doubling.")

q(3, "Started past EKENE-P3's plateau, at first origin 12, damped pools a scaled error of 2.004154. Against the naive yardstick, how did it do?",
 "Damped's MAE over those origins was about twice the in-sample naive error of the windows",
 ["Damped beat the naive yardstick twice over on EKENE-P3 after the plateau months",
  "The figure counts the null origin 6 as a zero and doubles the rest to compensate",
  "Two origins returned null scales, and the engine divided the pooled MASE by 2"],
 "MASE above 1 means the MAE is larger than the naive yardstick; 2.004154 is roughly double. Origin 6 is not in a run that starts at 12, so no null scale enters, and the engine applies no correction.")

# --- methods compared ---
q(0, "Scored in percent on EKENE-P2 before the shut-in, over months 0 to 21, which method misses least by MAPE?",
 "Arps, at 3.702719 percent",
 ["Holt, at 4.616605 percent",
  "Damped, at 4.747889 percent",
  "Ses, at 9.211623 percent"],
 "The before-shut-in rows print MAPE 9.796323 for ses, 4.616605 for holt, 4.897800 for damped and 3.702719 for arps, the lowest. 4.747889 is damped's sMAPE and 9.211623 ses's sMAPE.")

q(2, "After the workover on EKENE-P2 (origins 28, 31, 34, 37, 40, horizon 6), holt has the lowest MASE while damped has the lowest sMAPE, 9.770766. What follows for a write-up?",
 "Name the metric a ranking is by, since two metrics can put different methods first",
 ["Quote damped as best, as sMAPE is the symmetric metric and so the fairer one",
  "Average the two metrics, since one of them alone cannot decide the order",
  "Report holt as best on every metric, MASE being the one the engine prints"],
 "The rows print sMAPE 9.770766 for damped against holt's 10.338085, while holt's MASE 0.571171 is below damped's 0.599131. The course's rule is that a ranking is reported with its metric; the comparison orders by MASE unless told otherwise. No metric is averaged with another, and holt does not lead on every metric.")

q(2, "After the workover, ses ranks last on EKENE-P2 by MASE, at 0.789324. Which reading is right?",
 "Its MAE was below the naive in-sample error even so; last is relative to the other three",
 ["A last place means its MASE must be above 1, so the figure is misprinted",
  "Ses fails the naive yardstick, being the only method ranked below Arps",
  "Ses was scored on fewer origins than the others, which placed it last"],
 "A MASE below 1 means the MAE is smaller than the in-sample naive MAE, whatever the rank; ses is last because the other three are lower still. Every method is scored on the same origins, and a place in a ranking says nothing on its own about the naive yardstick.")

q(3, "From first origin 26 after the restart, the EKENE-P2 comparison orders holt, arps, ses, damped. What are holt's and arps's MASE there?",
 "Holt 0.573284, arps 0.702535",
 ["Holt 0.571171, arps 0.605968",
  "Holt 0.510297, arps 0.742389",
  "Holt 0.461235, arps 0.646876"],
 "From first origin 26 (origins 26, 29, 32, 35, 38, 41) the best MASE is holt's 0.573284 and arps's is 0.702535. 0.571171 and 0.605968 belong to first origin 28, 0.510297 and 0.742389 to 32, and 0.646876 is arps from 30, where damped leads at 0.461235.")

q(1, "From first origin 32 after the restart (horizon 6, step 3), where does the Arps baseline stand on EKENE-P2?",
 "Fourth of four, with MASE 0.742389",
 ["First, at 0.389192, as it was before the shut-in months",
  "Second, behind holt, as it was from first origin 26 on",
  "Third, behind holt and damped, as from origin 28"],
 "From first origin 32 the order by MASE is holt, damped, ses, arps, with arps at 0.742389. 0.389192 is arps before the shut-in, and second and third are its places from first origins 26 and 28.")

q(3, "Holt's MASE is 0.346480 in the EKENE-P1 comparison from first origin 30 and 0.374515 in the teaching backtest. Why do the two differ?",
 "The origins differ: 30, 33, 36, 39, 42 with step 3 against 24, 30, 36, 42 with step 6",
 ["Held parameters from the first window in the comparison, while the backtest refits them",
  "Lag 12 in the comparison's MASE against lag 1 in the backtest throughout",
  "Scoring against Arps, the comparison divides holt's MASE by the Arps error"],
 "Both are refitted at m 1, the defaults, so the difference comes from the origins and step: the comparison scores origins 30 to 42 with step 3, and the teaching backtest origins 24 to 42 with step 6. MASE is divided by each origin's naive error, never by another method's.")

q(0, "In the EKENE-P1 comparison from first origin 30, the Arps baseline has ME -0.407739 and MAE 5.668226. What does the pair say?",
 "Its errors were nearly balanced in sign, with a small mean miss of 5.668226 bbl/d",
 ["It forecast high at every origin and at every step, since its mean error is negative",
  "Unbiased and exact, both of its figures sitting below a single bbl/d at every origin",
  "Its MAE is the size of its ME, so every error had one sign"],
 "An ME near 0 with a larger MAE says positive and negative errors largely cancelled, while the mean size of a miss was 5.668226 bbl/d. A negative ME only says high on average, the MAE of 5.668226 bbl/d is far from below a single bbl/d, and the ME is far smaller than the MAE in size.")

q(2, "In the course's testing workflow on EKENE-P1, what is done before any method is fitted?",
 "The series is read and checked: a missing month is refused by name, and a shut-in or plateau is noted",
 ["The Arps baseline is fitted first, so the smoothing methods can be compared against its curve",
  "The origins are chosen to favour the method expected to win, and then the series is read",
  "Every method is fitted on all 48 months to find the parameters the backtest will hold"],
 "The first step reads the series: 48 months, no missing month. A missing month is refused by name, and a shut-in or a plateau changes what the metrics can say. The comparison with Arps comes last, the origins are stated and never chosen to favour a method, and fitting on all 48 months would leak.")

q(1, "The EKENE-P1 comparison from first origin 30 orders arps, damped, holt, ses. What does the course say the result means for a smoothing method on that well?",
 "It has not earned its place there against the decline curve baseline",
 ["Arps should be replaced, a smoothing method needing no decline model",
  "Wrong on every well, the baseline having ranked first here",
  "Level with Arps, the four MASE figures being too close to separate"],
 "EKENE-P1 was drawn from an Arps curve, and arps ranks first at 0.199862 against damped 0.287529 and holt 0.346480. The course reads this as a smoothing method not having earned its place on this well. One well supports no claim about every well, and the figures are well apart.")

q(0, "Why does it matter how a backtest's errors are scaled when its MASE is pooled?",
 "One scale for every error gives a different figure: 0.458893 in place of 0.374515 on the teaching backtest",
 ["The engine pools with one scale by default, so the note must flag the rare runs that do not",
  "Each origin's own scale is the wrong method, and a note that uses it must say it is wrong",
  "MASE pooled either way gives the same figure, and the note records the choice for form"],
 "The engine scales each error by its own origin's naive MAE; dividing every error by the last origin's scale instead gives 0.458893 against the engine's 0.374515. The two differ, and the engine's per-origin scale is its stated rule.")

q(0, "Writing up damped on EKENE-P3 from origin 6, where the scaled error came back null, which line is correct?",
 "MAE 62.892091 bbl/d and sMAPE 11.808809 percent, with MASE returned as null and the reason quoted",
 ["0.000000 for MASE, since origin 6 scored no scaled error and the others are averaged",
  "MASE 2.004154, taken from the run started at origin 12 and quoted for this one",
  "Nothing on MASE, left out without comment since a null has nothing to report"],
 "Each metric the engine could not give is reported with its reason from `notes`, and the other metrics are numbers: MAE 62.892091 and sMAPE 11.808809. 2.004154 belongs to a different backtest, from origin 12, and would be labelled as such; a null is never printed as 0.")

emit(Q, '/root/dai-wip-forecastml/banks/d4i_exam.json', expect_n=42)
finish()
