import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Expert final exam, 42 questions over the whole tier: the residual
# bootstrap, percentiles and labels, the Arps baseline, ranking against Arps,
# boundaries bounds and caps, and reading the engine honestly. Each question
# takes a different angle or figure from the module banks. Four keys rest on
# engine calls recorded in BANKNOTES-advanced.md: arps listed among the
# methods is refused as methods[1]; the constant-series tie listed holt,
# damped, ses ranks holt, damped, ses; the arps row with no fit is unranked
# when ranked by mae as well as by mase; a ses backtest from first origin 2
# on EKENE-P1 is accepted.

K = [2, 0, 3, 1, 1, 2, 0, 3, 0, 1, 2, 3, 3, 0, 1, 2, 1, 0, 3, 2, 0,
     1, 3, 0, 2, 1, 3, 0, 0, 2, 1, 3, 1, 2, 0, 1, 3, 2, 0, 1, 2, 3]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Two analysts on different machines run `forecastIntervals` with damped on EKENE-P1, h 12, 1000 paths and seed 11. How do their percentiles compare?",
 "They are identical bit for bit, since every draw comes from one mulberry32 stream on that seed",
 ["Within about 1.00e-12 of each other, the band the engine keeps on every percentile it reports to a caller",
  "Agreeing to six decimals only, since each machine rounds its floating point arithmetic in its own way",
  "They differ, because the engine mixes the machine clock into the stream along with the seed"],
 "One seeded stream, drawn path by path and step by step, returns the same percentiles bit for bit for the same call; a figure named with its seed and nSims has one right value. There is no band on a percentile, and 1.00e-12 is the grid and ranking tie band. The course claims more than six-decimal agreement for the same call. No clock enters the stream.")

# 2
x("Each draw of the teaching bootstrap picks residual number floor(u x 46) from the pool. What makes every residual equally likely to be picked?",
 "u from mulberry32 lies from 0 up to 1, so floor(u x 46) runs evenly over the 46 positions",
 ["The residuals are sorted first, and u picks a rank, so the middle ones come up most often",
  "Each residual is weighted by its size, so the draw leans toward the largest errors of the fit",
  "The pool is shuffled once per path, and each step takes the next residual without replacement"],
 "The basis: each step adds a residual drawn with replacement, index floor(u x 46), u from the seeded stream; with u from 0 up to 1 every index is equally likely, and the same residual can be picked again. Nothing is sorted or weighted before the draw. Drawing without replacement is a different scheme; this one is with replacement.")

# 3
x("Which single path of the teaching bootstrap would reproduce the damped point forecast at every step?",
 "One that drew a residual of exactly 0 at every step, so its state followed the fitted recursion",
 ["The path whose rate at step 12 is the P50 of the thousand, since the median path is the forecast",
  "The first path of the stream, which the engine runs with no residuals to set the point forecast",
  "No path; the point forecast is the mean of all 1000 paths at each step, which no one path follows"],
 "The point forecast comes from the fitted final state with nothing added, which is what a path adding 0 at every step would compute, since the simulated value then equals each one-step forecast. The P50 is a percentile read step by step, and on this run it differs from the point forecast at every step shown. The first path draws residuals like the rest. The engine returns no mean of the paths.")

# 4
x("ses on EKENE-P1, seed 11, 1000 paths, nonNegative false: at step 1 the paths run from P90 (low) 157.500000 to P10 (high) 213.200000 around a point forecast of 211.400000. What does the point forecast's position show already at step 1?",
 "It sits near the top of the interval, because most residuals of this fit are negative month-to-month changes",
 ["It sits in the middle, as a first-step interval is always centred on the point forecast",
  "Nothing yet; the residuals only start to lean once the state has been updated at step 2",
  "The labels are swapped at step 1, since the high case must lie below the point forecast"],
 "With alpha at 1 each ses residual is the change from the month before, mostly a fall on this decline, so one draw already pulls most paths below the last rate: the P50 at step 1 is 198.900000, under the point forecast of 211.400000. Residuals drawn as fitted are not centred, so no interval is centred by rule. The lean acts at the first draw. P10 (high) above P90 (low) is the right order, and nothing requires the high case below the forecast.")

# 5
x("When does the course say a caller should turn `nonNegative` false?",
 "To see how far below zero the paths went, or to compare with a tool that does not clip",
 ["When the well can produce at a negative rate, so the paths are allowed to follow it",
  "Whenever the point forecast goes below zero, so that the point forecast is clipped instead",
  "Every time, because a figure reported as 0 may never appear in a report of rates"],
 "The switch changes only the reported percentiles, and the course names its use: to see a percentile as simulated, or to match a tool that does not clip; for a report of rates it is left true, with the count reported as 0 stated. No well produces a negative rate. The point forecast is never clipped either way. A reported 0 may go in a report, with `clippedToZero` beside it.")

# 6
x("Holt on EKENE-P5, h 12, seed 11, 1000 paths reports `clippedToZero` 11. What does the 11 count?",
 "Percentiles that were below 0 and are reported as 0, out of the 36 the run returns",
 ["Paths that ended below zero at step 12, out of the 1000 the run simulated for the interval",
  "Steps at which holt's own point forecast fell below zero and was then reported as 0 in the result",
  "Months of EKENE-P5 whose rate lies below the last month's 11.100000 bbl/d"],
 "The count is of percentiles: three per step over 12 steps is 36, and 11 of them were negative and are reported as 0. The rule acts on percentiles, so no path is counted or changed. Holt's point forecast stays above zero over these 12 steps, 2.887394 at step 12, and it is never clipped. The count has nothing to do with the series' own months.")

# 7
x("Which of the three P labels reads the same whether a reader takes it by exceedance or as a plain percentile?",
 "P50, the median of the paths at each step",
 ["P90, since 90 percent is symmetric about the middle of the paths",
  "P10, once nonNegative has reported any negative value as 0",
  "None of the three, as exceedance reverses every label it touches"],
 "The median is the 50th percentile under either reading, so P50 is the same both ways. P90 is the low case, the 10th percentile of the paths, which a plain-percentile reader would take as the high case, and P10 is its mirror. nonNegative changes values and leaves labels alone. Exceedance swaps the two outer labels and leaves the middle one where it was.")

# 8
x("Through the platform's quantile, the sorted values 1 to 10 have a 90th percentile of what, the figure a P10 (high) would take?",
 "9.500000: with idx 9 whole and ten values, an even count, the 9th and 10th smallest are averaged",
 ["9, the 9th smallest, because a whole index reads the value at that position alone",
  "10, the largest of the ten, the only value at or above the 90th percent mark",
  "Whatever linear interpolation gives 90 percent of the way along the sorted values"],
 "idx = 10 x 0.9 = 9, a whole number with n even, so the rule averages the 9th and 10th smallest: 9.500000, the course's table figure. Reading the idx-th alone is no case of this rule. The largest value is not the rule's answer. Linear interpolation is the numpy default, a different rule the platform does not use.")

# 9
x("Which seed values will the bootstrap run on without a refusal?",
 "Whole numbers from 0 to 4294967295, both ends included",
 ["Whole numbers from 1 upward, since seed 0 would leave the stream empty",
  "Any number at all, rounded down to a whole seed before the stream starts",
  "Only seeds the course has used, 11 and 12, so that runs can be checked"],
 "The boundary table: seed 0 and 4294967295 accepted, -1 and 2.5 refused, in the words \"seed must be a whole number from 0 to 4294967295\". Seed 0 returns an interval. A fractional seed is refused outright. Any seed in the range is legal; the course's seeds are simply the ones it prints figures for.")

# 10
x("Raising the teaching run from 1000 to 10000 paths moves the P10 (high) at step 12 from 324.803671 to 314.738791. Has the interval moved toward the point forecast of 169.556510 in any way that matters?",
 "No: more paths steady a percentile, and it stays far above the point forecast at every count",
 ["Yes: with enough paths the P10 (high) closes on the point forecast, so 100000 paths would end the gap",
  "Yes: the fall shows the 1000 run was biased high, so the 10000 figure is the right one to report",
  "No, because the high case is capped at twice the point forecast once there are 10000 paths"],
 "More paths steady the percentiles and leave the method and its residuals as they were; the high case at step 12 is 308.081207 at 100 paths, 324.803671 at 1000 and 314.738791 at 10000, far above 169.556510 each time. No count of paths closes the gap, which is set by the replayed residuals. Each figure is right for its seed and nSims. No cap ties a percentile to the point forecast.")

# 11
x("At step 1 of the teaching run the interval is 51.569125 bbl/d wide. What sets that width?",
 "The spread of the residual pool, since each path holds one draw at step 1",
 ["phi, fitted at 0.960949, which scales the first step's residual before it is added",
  "Path count: 1000 paths always span about 50 bbl/d at the first step of any run",
  "The distance from the last month's rate to the point forecast at step 1"],
 "At step 1 every path is the one-step forecast plus a single draw, so the width reflects the spread of the residuals alone; later steps widen as draws accumulate through the state. phi damps the trend and scales no residual. The path count moves percentiles a little and sets no width. The gap between the last rate and the first forecast is the method's, and it widens nothing.")

# 12
x("A bootstrap call passes `nonNegative` as the word 'yes'. What does the engine reply?",
 "\"nonNegative must be true or false\", naming the field `nonNegative`",
 ["Read as true, with negative percentiles clipped as usual",
  "It ignores the word and falls back to the default, which is true",
  "It refuses naming `seed`: \"seed must be a whole number from 0 to 4294967295\""],
 "The switch is a strict true or false, and a word in its place is refused with the field named, in the words quoted. No word is interpreted as true. A value given is checked as given, and the default applies only when the field is left out. The seed has its own rule and its own message.")

# 13
x("Of the five long Ekene wells, which has the steepest Arps decline per month?",
 "EKENE-P5, with Di 0.110048 per month",
 ["EKENE-P1, with Di 0.060069 per month",
  "EKENE-P2, with Di 0.057021 per month",
  "EKENE-P3, with Di 0.044394 per month"],
 "Every Di here is per month, since a month is passed as a day, so they compare directly: EKENE-P5's 0.110048 is the largest, and the generator stated 0.11 for it. EKENE-P1's 0.060069, EKENE-P2's 0.057021 and EKENE-P3's 0.044394 are all smaller declines per month.")

# 14
x("EKENE-P1's Arps fit returns qi 1202.685523. Which rate is that?",
 "The fitted rate at t = 0, which on EKENE-P1 is index 0, the first positive month",
 ["An average of the 48 monthly rates, which the Arps fit uses as the anchor of its curve",
  "Month 47's rate, from which the Arps forecast then runs forward one step at a time",
  "The first month's rate as recorded, 1176.100000, carried into the fit unchanged"],
 "qi is the rate at t = 0, and t = 0 is the first positive value; on EKENE-P1 that is index 0. It is a fitted value, so it differs from the recorded 1176.100000 of month 0, and the generator stated 1200. The fit anchors on no average, and the forecast comes from the fitted curve itself.")

# 15
x("EKENE-P2, EKENE-P4 and EKENE-P5 return hyperbolic b values of 0.950000, 0.400000 and 0.100000. Why is each a multiple of 0.05?",
 "The hyperbolic fit tries b on a grid from 0.05 by 0.05 to 2, so b is always a grid value",
 ["The engine rounds every fitted b to the nearest 0.05 before it is returned to the caller",
  "The generator stated those exact b values, and the fit recovers each one without error",
  "A b off the 0.05 grid would make Di negative, and the engine refuses such fits"],
 "The basis: \"hyperbolic by a b grid from 0.05 by 0.05 to 2 on q^-b\", so every hyperbolic b is a grid point, as printed; as returned it can differ from the printed decimal in its last bits, as EKENE-P1's does. Nothing is rounded. The generator stated 0.3, 0.7 and 0.1 for these wells, and only EKENE-P5's matches. The refusal for no fit concerns Di <= 0 on the line, unrelated to the grid.")

# 16
x("At step 12 the Arps forecast of EKENE-P1 is 156.514309 and the damped point forecast 169.556510. How should a reader take the two figures?",
 "As point forecasts from two different fits, each carried forward from its own fitted curve or state",
 ["As a percentile of simulated Arps paths set beside a point forecast, the Arps figure being the low case",
  "As fits of different months, since damped read fewer of them and so lags the decline",
  "As one decline lowered at every step by the zero months that the Arps fit dropped"],
 "Both are point forecasts: the Arps figure comes from the fitted decline curve, qi, Di and b, and the damped figure from the fitted final level and trend, each step's change phi times the one before. Neither is a percentile. Both methods read all 48 months. EKENE-P1 has no zero months, and the Arps fit dropped none. Which of the two forecasts is better is a question for a backtest on the same origins, where on EKENE-P1 from first origin 30 arps ranks first.")

# 17
x("A colleague pastes EKENE-P1's Di of 0.060069 into a tool that reads decline per year. What goes wrong?",
 "The tool reads a monthly figure as a yearly one, wrong by the change of unit; the engine's Di is per month",
 ["Nothing, since a decline rate carries no unit and means the same in every tool that reads it, per month or per year",
  "Nothing, because the engine converts Di to a yearly figure before it prints the fit's results",
  "The tool reads a daily figure as a yearly one, since fitArpsModel measures its time in days"],
 "Month k is passed as day k, so Di is per step and a step is a month; carried into a tool that reads per year, the same number means a far gentler decline. A decline rate always carries a time unit. The engine converts nothing. fitArpsModel counts in days, but the days it is handed are months, so the figure is per month.")

# 18
x("After EKENE-P2's workover, holt ranks above arps by MASE from first origin 28. What does the course give as the reason the Arps baseline lags there?",
 "Its least-squares fit on each window includes the months before the uplift, so it forecasts the lifted well high",
 ["The Arps fit is held from the first window when refit is true, so it misses the uplift altogether",
  "The shut-in zeros are fitted as rates in the Arps windows, dragging every fitted curve toward zero",
  "Arps cannot fit any window after a shut-in, so its row is left unranked and holt wins by default"],
 "The Arps fit is a regression on every positive month of each training window, the months before the uplift included, and its mean error after the workover is -23.147528 bbl/d: it forecasts high. Arps is refitted on every window whatever refit says. The zeros are dropped before the fit. The arps row has numbers here, MASE 0.605968, and ranks third.")

# 19
x("A comparison is passed `arpsModel` 'Linear'. What does the engine reply?",
 "\"arpsModel must be 'Auto-Select', 'Exponential', 'Harmonic' or 'Hyperbolic'\"",
 ["The arps row fitted as a straight line through each window's rates",
  "A comparison with the arps row unranked and its error naming the model it could not fit",
  "\"modelType must be 'Auto-Select', 'Exponential', 'Harmonic' or 'Hyperbolic'\", naming `modelType`"],
 "A model the engine does not offer is refused with the field `arpsModel` named, in the words quoted; the same four names are the ones `arpsForecast` takes as `modelType`, and that field and its message belong to `arpsForecast` alone. No straight-line model exists in the decline curve engine's list. An unranked arps row comes from a failed fit on a window; an unknown name stops the call. Nothing is substituted.")

# 20
x("Why does every ranking the engine returns put the lowest metric first?",
 "Every metric it ranks by is an error, and a smaller error is better",
 ["The listed order runs from the simplest method to the most complex one in the list",
  "Lower metrics come from the methods that have fewer parameters to fit on each window",
  "Sorting lowest first keeps arps at the end of every ranking"],
 "mae, rmse, mape, smape and mase are all errors, so lowest first puts the best method first. The listed order only settles ties. A metric's size says nothing about the number of parameters. arps is last only inside a tie band; on EKENE-P1 it ranks first.")

# 21
x("On EKENE-P2 months 0 to 21, before the shut-in, from origins 10, 13, 16 and 19 with horizon 3, which method ranks first by MASE?",
 "arps, at 0.389192",
 ["holt, at 0.483573",
  "damped, at 0.504549",
  "ses, at 1.006754"],
 "Before the shut-in the ranking by MASE is arps, holt, damped, ses, with arps at 0.389192; on these origins the baseline wins. holt's 0.483573 and damped's 0.504549 come next, and ses's 1.006754, above 1, is last.")

# 22
x("EKENE-P2 compared from first origin 28 has a MAPE on every row, while from first origin 12 every MAPE is null. What makes the difference?",
 "From origin 28 no scored actual is a shut-in month, since months 22 to 24 fall inside the training windows",
 ["From origin 28 the engine drops the shut-in months from the actuals before it divides",
  "MAPE is null only when a training window holds a zero, and from 28 none of them does",
  "From origin 28 the engine replaces each zero with the month before it, which it cannot do from 12"],
 "MAPE divides by each actual and is null when any actual is 0. From origin 28 the scored months run from 28 on, after the shut-in, so every actual is positive; from origin 12 the shut-in months 22 to 24 are among some origins' actuals. Nothing is dropped or replaced. Zeros in a training window do not touch MAPE, which is taken on the actuals.")

# 23
x("The stated series 900, 880, 0, 0, 0, 0, 0, 0, 870, 860, 850, 845 is compared from first origin 6, horizon 2, step 2, and ranked by mae instead of mase. Where does arps end up?",
 "Still unranked, since its row carries no metrics at all",
 ["Ranked last, since its mae is taken as the largest possible",
  "Ranked by mae, since only its MASE was null in the first run",
  "First, since the other methods cannot fit through six zeros"],
 "The arps row with no fit carries an error and no metrics, so it is unranked whatever the metric; the smoothing methods rank ses, damped, holt either way. An unranked method is never placed last. The missing Arps fit is at origin 6, so every metric of that row is absent. The smoothing methods take a zero as a value and fit through it.")

# 24
x("A flat series of 50 in every one of 10 months is compared with the methods given in the order holt, damped, ses, ranking by mae. Which order does the engine return?",
 "holt first, then damped, then ses, as the call listed them; arps has no place",
 ["damped, ses, holt, the order the golden itself lists",
  "ses, holt, damped, arps, all four tied at an MAE of 0",
  "arps, holt, damped, ses, since a flat forecast suits Arps"],
 "On a flat series each smoothing method forecasts every month exactly, so all three MAE figures are 0 and fall inside the tie band; a tie is settled by the order of the call, here holt, damped, ses. The course's golden lists damped, ses, holt and so returns that order; this call lists another. No Arps curve fits a series with no decline, so the arps row carries no MAE to rank.")

# 25
x("Two methods' MASE both print 0.571171 in a comparison table. May a reader conclude that they tied?",
 "No: figures printing alike at six decimals can still differ by more than 1.00e-12 relative; read the ranking",
 ["Yes, because the engine's tie band is set at the printed precision, six decimals",
  "Yes, and the method listed later in the call then ranks first between the two",
  "No, because two MASE figures can never be equal once each origin has its own scale"],
 "The tie band is 1.00e-12 relative, far finer than six decimals, so two figures printing alike may still be ordered by the metric; the ranking the engine returns is the answer, and a printed table cannot settle it. The band has nothing to do with printed precision. Inside a tie the listed order keeps the earlier method first. Equal MASE figures are possible, as the constant-series golden shows for MAE.")

# 26
x("A caller passes the methods ses and arps to `compareWithArps`. What happens?",
 "Refused, \"methods[1] must be 'ses', 'holt' or 'damped'\", since arps is added by the engine itself",
 ["Accepted, with arps compared twice, once as listed and once more as the baseline the engine adds at the end",
  "Accepted, with the listed arps moved to the end of the list and treated as the one baseline",
  "Refused, \"methods must be a non-empty array of 'ses', 'holt' and 'damped'\", as arps spoils the list"],
 "The list takes only 'ses', 'holt' and 'damped'; anything else is refused by its position, counted from 0, so arps in second place is `methods[1]`. The engine always adds arps itself, last, so it never needs listing. Nothing listed is moved or doubled. The empty-list message is for a list with nothing in it, and this one had two entries. The repeat message, \"methods[2] repeats ses\", is for a smoothing method listed twice.")

# 27
x("A comparison is run with `refit` and `m` left out. What settings does it run with?",
 "refit true and m 1, and the Arps baseline is refitted on every window either way",
 ["refit false and m 12, the settings a yearly seasonal comparison of the wells would use",
  "Refitting on, with MASE scaled by the month a year before, m 12, since that is the default",
  "Held parameters and m 1, the Arps fit held from the first window too"],
 "`compareWithArps` refits by default, as `backtest` does: its signature reads `refit = true` and `m = 1`. The lag 12 is a seasonal naive that a caller may choose; a declining well has no season. With refit false only the smoothing methods hold their first window's parameters; Arps is refitted at every origin regardless.")

# 28
x("EKENE-P2 compared from first origin 28, horizon 6, step 3 stops at origin 40. Why is there no origin 43?",
 "43 + 6 is above 48, so an origin at 43 would leave fewer than 6 actuals",
 ["The origin cap of 5000 allows only five origins at this step",
  "Origins must be even or a multiple of the first origin, and 43 is neither",
  "The shut-in months shift the origins, and 43 falls into the gap"],
 "An origin is kept while o + horizon <= n, so every origin has all its actuals; 40 + 6 = 46 fits, and 43 + 6 is above 48. The origin cap is 5000, far above five. Origins run from the first origin by the step, with no parity rule. The shut-in months lie before origin 28 and move nothing.")

# 29
x("On the coarse grid of the fit, in what order are the points scored, and when does a later point replace the best?",
 "alpha outermost, then beta, then phi; a later point wins only below best x (1 - 1.00e-12)",
 ["phi outermost, then beta, then alpha; any later point with an equal SSE replaces the best",
  "In random order from a seeded stream; the lowest SSE wins, and a tie goes to the last point",
  "alpha, beta and phi together along a diagonal; a later point wins when within 1.00e-12"],
 "The grid is scored alpha outermost, then beta, then phi, and a later point must be below best x (1 - 1.00e-12) to replace the best, so a tie keeps the earlier point. Nothing in the fit is random; seeds belong to the bootstrap alone. The grid is a full product of 11, 11 and 5 values, and being within the band is a tie, which keeps the earlier point.")

# 30
x("How many points does the coarse grid score for a damped fit with every parameter free?",
 "605, from 11 alpha values, 11 beta values and 5 phi values",
 ["121, from 11 alpha values and 11 beta values",
  "1067, every SSE evaluation the damped fit makes",
  "11, the alpha values alone, as beta and phi are left to the compass search"],
 "The grid has 11 points for ses, 121 for holt and 605 for damped, derived from 11 alpha values, 11 beta values and 5 phi values. 121 is holt's grid, without phi. 1067 is the whole damped fit on EKENE-P1, grid and compass search together. The grid covers every free parameter, and the compass search starts from its best point.")

# 31
x("`atBounds` on EKENE-P2's damped fit reads alpha = 1, beta = 0. What does that list mean?",
 "Both fitted parameters ended exactly on an edge of their box, and each is a fitted value",
 ["Both parameters were given by the caller and held fixed at exactly the values that the list reports",
  "The fit did not converge, and the list names the parameters that stopped the search",
  "Both were clipped from values outside the box, and the fit that follows is refused"],
 "`atBounds` lists every fitted parameter that ended exactly on a bound of its box, alpha and beta at 0 or 1 here, and a parameter on its bound is a fitted value like any other. Given parameters are listed in `fixed`. Every fit in the course converged, EKENE-P2's included. A compass trial past an edge is clipped to it, and nothing about a bound refuses a fit.")

# 32
x("On EKENE-P1, phi 0.5 is given and alpha and beta are left free. Which lists name which parameter?",
 "`fixed` lists phi, and `atBounds` lists the fitted beta = 1; the given 0.5 is not in `atBounds`",
 ["`atBounds` lists phi = 0.5, since it lies below the fitted box of 0.8 to 0.98",
  "The call is refused, because a given phi must lie inside the fitted box",
  "`fixed` lists alpha and beta, which are held while phi is searched"],
 "A phi below the fitted range can only be given; it is accepted and held fixed, and alpha and beta are fitted around it: alpha 0.784159, beta 1.000000, and the fitted beta on its upper bound is listed as beta = 1. `atBounds` names fitted parameters only. A given phi need only be above 0 and at most 1. alpha and beta were left out, so they are fitted.")

# 33
x("Why does the compass search's first step start at 0.05 of each parameter's range?",
 "Half the grid spacing: the grid steps by 0.1, and the first compass step is half of that",
 ["The smallest step that the grid's tie band of 1.00e-12 can still tell apart from a step of zero",
  "Matching the lowest b on the Arps grid, so that both searches move by the same steps throughout",
  "It is 5 percent of the SSE at the best grid point, so the first step scales with the fit"],
 "The stop rule's description: \"The compass step starts at 0.05 of each range (half the grid spacing)\", and the grid runs at 0.1. The tie band is a relative test on SSE, unrelated to step size. The Arps b grid is another engine's search. The step is a fraction of each parameter's range, and the SSE plays no part in its size.")

# 34
x("What is the fewest set of values `accuracy` will score?",
 "One actual and one forecast, since a single error can be scored",
 ["Two actuals, so that MASE always has a naive difference to divide the errors by",
  "Twelve actuals, one full season, so that the lag of 12 can apply to them",
  "As many actuals as the training series has months"],
 "The length rules give 1 actual and 1 forecast; with no actuals the call is refused: \"actual has 0 values: at least 1 actual is needed\". MASE's scale comes from the insample series, and when it cannot be formed MASE is null with its reason while the other metrics are numbers. The lag m is 1 by default and applies to the training series. The actuals need not match the training length.")

# 35
x("Is a ses backtest on EKENE-P1 from first origin 2, horizon 6, step 6 accepted?",
 "Yes, since a ses backtest takes 2 training values as its first origin",
 ["No, because every backtest needs 3 training values, whatever the method",
  "No, because origin 2 leaves fewer than 6 actuals on a series of 48 months",
  "Yes, but only after the engine moves the first origin up to 3 on its own"],
 "A backtest's first origin is the method's fitting length, 2 for ses and 3 for holt and damped, so origin 2 is accepted for ses; the refusal for origin 45 gives the ses range as \"from 2 to 42\". 3 training values is the comparison's rule and holt's. Origin 2 leaves 46 months after it. The engine never moves an origin; it accepts or refuses.")

# 36
x("What is the common alternative to passing month k as day k to fitArpsModel, and why did the engine not take it?",
 "Calendar days; fitArpsModel reads days and a step is a month, so month k as day k keeps one axis of steps",
 ["Passing each month as 30 days; the engine avoids it because Di would then come out per year",
  "Passing month k as year k; the engine avoids it because fitArpsModel refuses yearly time",
  "Weekly steps; the engine avoids them because four weeks do not make a calendar month"],
 "The conventions table names calendar days as the alternative, and the stated reason for the choice is that fitArpsModel reads days and a step is a month; passing month k as day k keeps the Arps fit and the smoothing methods on one axis of steps. Passing months as 30 days would give a Di per day, a different unit. Neither yearly nor weekly steps are named by the course.")

# 37
x("What reason does the engine give for reading its percentiles with lib/stats quantile rather than linear interpolation?",
 "It is the platform's one quantile, so every percentile on the platform is read the same way",
 ["Linear interpolation fails on an even count of paths, and 1000 is even",
  "lib/stats quantile gives higher percentiles, which suit a high case",
  "Linear interpolation needs a seed of its own, which would break reproducibility"],
 "The conventions table: \"the platform's one quantile\", against linear interpolation, the numpy default. Interpolation works on any count; it can simply give a different value on the same sorted values. Neither rule is chosen for its direction. No quantile rule draws random numbers; the seed belongs to the paths.")

# 38
x("Which sMAPE does the engine compute?",
 "Absolute values in the denominator, on 0 to 200, a 0/0 term scoring 0, after Hyndman and Koehler 2006",
 ["Without absolute values in the denominator, on 0 to 100, following the numpy default for percentages",
  "Absolute values in the denominator, on 0 to 100, with a month where actual and forecast are 0 dropped",
  "The same as MAPE, divided by 2, so that a shut-in month is scored as 100 and never left out"],
 "The conventions table: absolute values in the denominator, 0 to 200, and a 0/0 term scoring 0, citing Hyndman and Koehler 2006; the alternatives are without absolute values, or on 0 to 100. A 0/0 term scores 0; nothing is dropped. sMAPE divides by the actual and the forecast together, which is why a shut-in term scores 200.000000 while MAPE is null.")

# 39
x("A note on EKENE-P4 gives damped's backtest MASE and nothing else from the comparison. What does the course's note rule say is missing?",
 "The Arps baseline's MASE on the same origins and the ranking with the metric it is by",
 ["Nothing, since MASE with its lag is the one figure a note has to carry",
  "The damped method's in-sample MSE over the months it was fitted on, which ranks methods better than MASE",
  "The R2 of the damped fit, which shows how much of the decline it explains"],
 "The note names the backtest's MASE with its m beside the Arps baseline's on the same origins, and the ranking with its metric; it never reports a smoothing method's metrics without the Arps row. An in-sample MSE scores months the fit already saw, and the note judges on held-out months. R2 belongs to the Arps fit and scores no forecast.")

# 40
x("What source of uncertainty do the teaching run's intervals leave out?",
 "Uncertainty in alpha, beta and phi, which are fitted once and held on every path",
 ["The spread of the residuals, which the engine replaces with a normal distribution",
  "Draw-to-draw noise, which the seed removes by making the paths identical",
  "Earlier draws' effect on later steps, since each step restarts the state"],
 "The engine builds no parameter uncertainty into the bootstrap: the parameters are fitted once and held, and the spread of the paths is the spread of the replayed residuals and nothing else. No distribution is assumed; the residuals are replayed as fitted. The seed makes a run reproducible while its paths still differ from one another. The simulated value updates the state, so earlier draws carry forward.")

# 41
x("EKENE-P6 has 3 months. Which holt calls can the engine run on it?",
 "The fit alone, with 1 scored error; the bootstrap and a holt backtest are refused",
 ["All three, as 3 months are enough for any holt call",
  "The bootstrap and the fit, while the backtest is refused",
  "None, since a series of 3 months is refused outright"],
 "`fitSmoothing` fits holt on the 3 months with 1 scored error. `forecastIntervals` refuses because 1 scored residual is below the 2 it resamples, and `backtest` refuses because holt needs 3 training values plus the horizon. So only the fit runs, and a note says which tests could not be run and why.")

# 42
x("A figure is quoted as \"the forecast for EKENE-P1\". What does the course's vocabulary ask it to add?",
 "The method it comes from, since a forecast is the point forecast of one fitted method",
 ["Nothing, since a forecast means any estimate of the well's future rate",
  "Its P50, since a forecast in this course is the middle of the paths",
  "Its error against the Arps baseline, which defines a forecast here"],
 "The vocabulary rule: a forecast is the point forecast of one fitted method, named with its method; a percentile is named as a percentile. Any estimate of the future is what the word means elsewhere, and the course narrows it. The P50 is a percentile of the bootstrap paths and differs from the point forecast. An error is actual minus forecast, a separate word.")

assert next(_i, None) is None
emit(Q, '/root/dai-wip-forecastml/banks/d4a_exam.json', expect_n=42)
finish()
