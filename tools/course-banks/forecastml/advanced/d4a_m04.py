import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Expert m04, ranking methods against Arps. Figures from the course's
# comparison section (EKENE-P2 before and after the workover, the four first
# origins, EKENE-P1's clean decline) and its ranking section (the same
# origins, rankBy, unranked methods, the arps row with no fit, ties and the
# listed order), and the refusal table.

K = [0, 2, 1, 3, 3, 1, 2, 0, 2, 1, 3, 0, 1, 2, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A comparison on EKENE-P2's 48 months states its origins as \"28, 28 + 3, ... while o + 6 <= 48\". Which origins does every method share?",
 "28, 31, 34, 37 and 40",
 ["28, 31, 34, 37, 40 and 43, the last with a shorter horizon",
  "28, 34 and 40, one every six months",
  "Every month from 28 to 42, since horizon 6 fits each one"],
 "Origins start at 28 and step by 3 while o + 6 <= 48, which gives 28, 31, 34, 37 and 40; the next, 43, would need months 43 to 48 and there is no month 48. No origin runs with a shorter horizon. A step of 6 would give 28, 34 and 40, and a step of 1 every month to 42; this comparison's step is 3.")

# 2
x("The holt row of the EKENE-P2 comparison from first origin 28, horizon 6, step 3 has MASE 0.571171. What does a plain `backtest` of holt from the same first origin, horizon and step return?",
 "Exactly 0.571171, because the comparison's smoothing rows are backtests run side by side",
 ["A lower MASE, since the comparison holds parameters where the backtest refits them at each origin",
  "A different MASE, since the comparison scales each error by the Arps fit's error at that origin",
  "0.605968, because `backtest` scores holt against the Arps baseline's forecasts"],
 "The course checks it: the holt row's MASE is exactly `backtest`'s on the same origins. Both refit by default. The comparison's MASE scales each error by its own origin's in-sample naive error, as a backtest does; no Arps error enters it. 0.605968 is the arps row's own MASE in the comparison.")

# 3
x("A comparison is run with `refit` false. What happens to the Arps baseline at each origin?",
 "It is refitted on every training window anyway, while the smoothing methods hold their first window's parameters",
 ["Held at the parameters fitted on the first window, exactly as the smoothing methods are held at every later origin",
  "Dropped from the comparison, since a baseline fitted only once cannot be ranked fairly against the other three rows",
  "It is fitted once on the whole series, because the Arps fit has no refit setting of its own at all"],
 "The basis: \"engines/dca/arps.js fitArpsModel refitted on each training window\", and Arps is refitted whatever `refit` says, so a forecast note on such a run says the baseline was refitted regardless. Holding Arps is what the smoothing methods do with refit false, and the baseline does not follow them. It stays in the comparison. Fitting it on the whole series would put the scored months into its fit.")

# 4
x("The EKENE-P2 comparison from first origin 28 ranks holt, damped, arps, ses by MASE. Ranked by sMAPE instead, which method comes first?",
 "damped, whose sMAPE of 9.770766 is the lowest of the four",
 ["holt, as it does by every metric the engine offers on this comparison",
  "arps, whose sMAPE of 10.094073 is the lowest of the four rows",
  "ses, since sMAPE favours a flat forecast on a well that has just been lifted"],
 "By sMAPE the ranking is damped, arps, holt, ses: damped's 9.770766 is the lowest. holt ranks first by MAE, RMSE and MASE and third by sMAPE, which is why a ranking is quoted with its metric. arps's 10.094073 is second lowest. ses is last on every metric here, sMAPE included.")

# 5
x("What reason does the engine state for ranking by MASE when `rankBy` is left out?",
 "MASE compares wells of any size and stays defined through a shut-in",
 ["MASE is the only metric the engine computes for the Arps row",
  "It is in bbl/d, so its ranking reads as a rate",
  "Ranking by MASE puts the Arps baseline last, which makes any smoothing win clear"],
 "The conventions table gives the reason: MASE compares wells of any size and stays defined through a shut-in, where MAPE is null. The Arps row carries MAE, RMSE, MAPE and sMAPE as well. MASE has no unit; MAE and RMSE are the metrics in bbl/d. MASE puts arps first on EKENE-P1, so it favours no method.")

# 6
x("A comparison is asked to rank by `rankBy` 'me', the mean error. What comes back?",
 "A refusal naming `rankBy`: \"rankBy must be 'mae', 'rmse', 'mape', 'smape' or 'mase'\"",
 ["Mean error ranks it, lowest first, which puts the most negative bias at the top",
  "A ranking by MASE, the default, with a warning that the name 'me' was not recognised by the engine",
  "A refusal naming `methods`: \"methods must be a non-empty array of 'ses', 'holt' and 'damped'\""],
 "The ranking takes five names, and anything else is refused with the field named, in the words quoted. The engine never ranks by the mean error, signed or unsigned, and it never falls back to a default with a warning; a name it does not offer is refused before any fit. The methods message is for an empty list, and nothing was wrong with the methods here.")

# 7
x("The golden `cmp-constant-ties` is a constant 50 for 10 months, with the methods listed damped, ses, holt and ranked by mae. What ranking comes back?",
 "The listed order, damped, ses, holt; arps is unranked",
 ["ses, holt, damped, the order in which the engine defines its methods",
  "holt, damped, ses, arps, all four tied at an MAE of 0",
  "arps, damped, ses, holt, as Arps forecasts a constant exactly"],
 "Every smoothing method forecasts a constant exactly, so each MAE is 0 and the three tie; inside the band a tie keeps the listed order, damped, ses, holt. Arps cannot fit a flat series, so its row carries an error and it is unranked. The engine's own order of names plays no part, and arps never ties in here because it has no metric.")

# 8
x("How close must two metrics be for a ranking to treat them as tied?",
 "Within 1.00e-12 of each other, relative, and then the listed order decides with arps last",
 ["Equal at six decimals, the precision at which the course prints every metric in its tables",
  "Within 1.00e-9 of each other, the band to which the damped forecast's limit is checked",
  "Equal to the last bit, since any difference at all, however small, settles the order"],
 "`RANK_TIE_REL` is 1.00e-12, and the ranking basis reads \"values within 1e-12 (relative) keep the listed order (methods as given, arps last)\". Two metrics printing alike at six decimals can still differ by more than the band, and then the smaller ranks first. 1.00e-9 is a check the course applies to the damped limit, a different thing. A last-bit rule would let rounding decide, which the band exists to avoid.")

# 9
x("EKENE-P1 is compared from first origin 30, horizon 6, step 3 with the methods listed damped, holt, ses. What is the ranking by MASE?",
 "arps, damped, holt, ses, the same as with the default listing",
 ["damped, holt, ses, arps, which is the listed order with arps put last",
  "arps, ses, holt, damped, since arps leads and the rest keep the listing reversed",
  "No ranking, as EKENE-P1 ties with an Arps curve"],
 "Without a tie the metric decides and the listing changes nothing: arps 0.199862, damped 0.287529, holt 0.346480, ses 1.067547. The listed order only settles metrics within 1.00e-12 relative. No rule reverses a listing. How the synthetic well was drawn explains why arps wins; it does not stop the ranking.")

# 10
x("The methods passed to `compareWithArps` are ses, holt, ses. What happens?",
 "It is refused, in the engine's words \"methods[2] repeats ses\", the field naming the third method counted from 0",
 ["It ranks ses once and drops the repeat without a message, since both copies would score the same",
  "A refusal naming `methods[1]`: \"methods[1] must be 'ses', 'holt' or 'damped'\"",
  "Both copies of ses are ranked, and they tie within the band and so keep their listed order"],
 "A method listed twice is refused, and the field names its position counted from 0, so `methods[2]` is the third method listed. Nothing is dropped quietly, and holt, in second place, is a method the engine offers, so nothing is refused at `methods[1]`. A repeated method is not ranked twice; it never reaches the ranking.")

# 11
x("EKENE-P2 is compared from first origin 12, horizon 6, step 3, ranked by MAPE. The shut-in months fall in the actuals of some origins. What comes back?",
 "An empty `ranking`, `best` null, and ses, holt, damped and arps all listed in `unranked`",
 ["Refused, naming `rankBy`, since MAPE cannot be computed anywhere on this well",
  "MASE, the default, takes over, and the engine ranks by it whenever MAPE is null",
  "A ranking by MAPE over the origins that avoid the shut-in, with the rest dropped"],
 "Every method's pooled MAPE is null, because MAPE divides by each actual and a shut-in month is 0, so nothing is left to rank: the ranking is empty, best is null and all four are unranked. A null metric is a result the engine returns with its reason. The engine does not switch metric; ranked by MASE the same call ranks all four. Pooled metrics average every origin, and no origin is dropped.")

# 12
x("How does a forecast note report a method that a comparison left unranked?",
 "As unranked, with the reason from `notes` or the row's error, and never placed last by hand",
 ["Last in the ranking, since a method with no figure cannot be said to have beaten any of the others",
  "It is left out of the note, as the engine treats an unranked method as a run that failed",
  "By whichever other metric it does have, so that every method keeps a place in the order"],
 "An unranked method has not lost; it has no figure on that metric, for a reason the engine states, and the note gives the reason. Placing it last invents a comparison that was not made. A note leaves out no metric the engine could not give; it writes it with its reason. Mixing metrics in one order ranks by two yardsticks at once.")

# 13
x("On EKENE-P1 from first origin 30, horizon 6, step 3, the Arps baseline ranks first at MASE 0.199862. What must a note that leans on that win also say?",
 "That the well was drawn from an Arps curve, so the win is partly by construction on a synthetic field",
 ["An Arps baseline beats exponential smoothing on any declining well in the field",
  "damped, at 0.287529, sits within the tie band of arps and so shares first place",
  "The note must add that the smoothing methods held their first window's parameters"],
 "EKENE-P1 was drawn from an Arps curve (stated), and a note that leans on the win says the well was built that way, because a real well need not follow a single Arps curve. After EKENE-P2's workover a smoothing method wins, so no rule says Arps wins on declining wells. 0.287529 is far outside 1.00e-12 relative of 0.199862. That comparison ran with refit true, the default.")

# 14
x("After EKENE-P2's workover, from origins 28 to 40, the arps row has a mean error of -23.147528 bbl/d and holt 20.751043. What do the signs say?",
 "Arps forecasts the well high and holt forecasts it low, since an error is actual minus forecast",
 ["Arps forecasts low and holt high, because a negative error means the forecast fell short of the rate",
  "Both are unbiased overall, since mean errors of opposite sign cancel out across the methods",
  "Arps did better on this well, because its mean error is the one further below zero"],
 "An error is actual minus forecast, so a negative mean error means the forecast was above the actuals: the Arps fit, pulled by the months before the uplift, forecasts high, and holt low. A negative error means the forecast was high. Errors of two different methods never cancel each other. Being further from zero is more bias; by MASE holt ranks first here and arps third.")

# 15
x("EKENE-P2 compared from first origins 26, 28, 30 and 32 (horizon 6, step 3) puts holt, holt, damped and holt first by MASE. What does the course draw from the four?",
 "A ranking is reported with its origins, horizon, step and metric, since the winner moves with them",
 ["holt is the method to use on EKENE-P2, since it ranks first from three of the four first origins tried",
  "The run from origin 30 must be in error, since damped cannot rank above holt after a workover",
  "Arps can be ruled out on EKENE-P2 for good, as it never ranks higher than third from any origin"],
 "A smoothing method ranks first from every one of the four, and which one changes with the origins, so a ranking is one test and travels with its origins, horizon, step and metric. Three wins of four is still a count of tests on one well. From origin 30 damped ranks first at 0.461235, a result like the others. From origin 26 arps ranks second.")

assert next(_i, None) is None
emit(Q, '/root/dai-wip-forecastml/banks/d4a_m04.json', expect_n=15)
finish()
