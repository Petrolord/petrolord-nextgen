import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Expert m06, reading the engine honestly. Figures from the course's
# conventions table, what is not built, the engine's exports, the refusal
# table and the forecast note on EKENE-P1.

K = [1, 0, 3, 2, 0, 2, 3, 1, 3, 0, 2, 1, 1, 0, 3]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The engine writes its recursions in component form, with beta the trend weight on the level change. What reason does it state for that choice?",
 "beta is statsmodels' smoothing_trend, so a parameter compares directly",
 ["Most texts multiply beta by alpha, and the engine follows the majority of them",
  "Component form runs faster, and speed is what the engine chose its form by",
  "The error-correction form has no way to express a damped method at all"],
 "The conventions table gives the reason: \"beta is statsmodels' smoothing_trend, so a parameter compares directly\". Beta multiplied by alpha is the alternative some texts use, and the engine did not take it. Speed is not the stated reason. The error-correction form is the other alternative named, and the course makes no claim that it cannot damp.")

# 2
x("The engine starts at l_1 = y_1 and b_1 = y_2 - y_1, leaving y_2 unscored, where statsmodels estimates its initial states. What reason does the engine give?",
 "A learner can start the recursion by hand",
 ["Estimated initial states need at least 12 months of data, and new wells have fewer",
  "Starting at the first observation gives the lowest SSE that any start can reach",
  "NIST's double smoothing example starts exactly this way, and the engine follows it"],
 "The stated reason is that a learner can start the recursion by hand. No month count is attached to estimated starts. Nothing makes this start the lowest SSE: on EKENE-P1 at alpha 0.3 an initialLevel of 1150.000000 lowers the SSE from 312538.074209 to 297403.122315. The conventions table lists a mean of early differences as NIST double smoothing's start, and the course's NIST check gives b_1 = 0.8 as an initialTrend.")

# 3
x("What reason does the engine state for fitting by least one-step SSE, with a grid and then a compass search in a stated box?",
 "Determinism: the same series gives the same parameters",
 ["A sure route to the global minimum, which a gradient optimiser cannot promise",
  "Speed: it runs faster than maximum likelihood on a series of 48 monthly rates",
  "It reproduces the parameters statsmodels returns, to six decimals, on every well"],
 "The conventions table: \"deterministic: the same series gives the same parameters\", with stated tie rules, against maximum likelihood with a gradient optimiser as the alternative. The course claims no global minimum: two fits stopping at SSEs that print alike are the same minimum only as far as the search could tell. Speed is not the stated reason. statsmodels estimates its initial states, so its parameters can differ.")

# 4
x("Why does the engine search a fitted phi only from 0.8 to 0.98?",
 "FPP3 restricts an estimated phi to that range, and a phi outside it can still be given",
 ["Below 0.8 a damped forecast turns negative on any declining well in the field it is fitted to",
  "Above 0.98 the engine refuses phi, since the method would then be holt",
  "The Ekene wells were generated with a phi inside that range, and the box matches it"],
 "The stated reason is FPP3 8.2's restriction on an estimated phi; a given phi may be any value above 0 and at most 1, and phi 0.5 given on EKENE-P1 is accepted. A damped forecast levels off toward a limit, and nothing makes it negative below 0.8. phi 1 given is accepted, and it is holt. The wells were drawn from Arps curves, which carry no phi.")

# 5
x("Another tool drops a shut-in month before it computes MAPE. What does this engine do with the same month, and why?",
 "Returns MAPE as null with the reason, since a shut-in month is real and dropping it changes the metric",
 ["It drops the month too, and adds a note stating how many months of actuals were dropped",
  "Divides by a tiny number in place of the zero, so that MAPE stays finite and can be ranked",
  "Refuses the call, naming `actual`, until the shut-in month is filled or removed by the caller"],
 "MAPE is null when any actual is 0, with the reason in `notes`, and the stated reason is that a shut-in month is real and dropping it changes the metric. Dropping the month and dividing by a tiny number are the two alternatives the conventions table names. A null metric is a result, and the other metrics are still numbers.")

# 6
x("Why does the engine take the MASE scale from the training months?",
 "The scale is then fixed before the forecast is scored, so the months being forecast cannot move it",
 ["Training months never contain a flat stretch, so a scale taken from them can never come out as 0",
  "A seasonal lag of 12 is the default, and only the training months are sure to hold a full year of rates",
  "A scale from the forecast months would turn MASE into a percentage error"],
 "The stated reason: \"the scale is fixed before the forecast is scored\". EKENE-P3's plateau shows a training scale can be 0, and then MASE is null with its reason. The default lag m is 1, the month before. A scale from the forecast months is the out-of-sample naive error, the alternative named; it still gives a ratio with no unit, only a different one.")

# 7
x("Why does the backtest window expand from month 0, where a sliding window would keep a fixed length?",
 "Every month before the origin is information a forecaster would have",
 ["A sliding window cannot be refitted at each origin, while an expanding one can",
  "Only the early months carry EKENE-P3's plateau, which every fit must see",
  "An expanding window gives every origin the same number of training months"],
 "The conventions table: \"every month before the origin is information a forecaster would have\". A sliding window can be refitted as easily; it forgets the early months on purpose. The plateau is one well's structure and no reason for a rule on all of them. An expanding window grows by the step at each origin, so the training length differs: origin 24 trains on 24 months, origin 42 on 42.")

# 8
x("Which of these is the engine's own convention for an interval?",
 "A residual bootstrap, residuals drawn as fitted, parameters held",
 ["Analytic intervals built from the variance of the one-step errors",
  "A centred bootstrap that subtracts the residual mean before each draw",
  "A bootstrap that refits the parameters on each simulated path"],
 "The conventions table: residual bootstrap, residuals as fitted without centring, parameters held; the reason is that no distribution is assumed and the method's own errors are replayed. Analytic intervals, a centred bootstrap and a bootstrap that also resamples parameters are the three alternatives it names, and the engine builds none of them.")

# 9
x("A manager wants a twelve-month forecast of EKENE-P4 that responds to a planned choke change. What does the course say about this engine?",
 "It runs no regression of rate on other variables such as choke; that work belongs to the machine learning course",
 ["Pass the choke setting to `fitSmoothing` as a second series beside the rates of the well",
  "Use damped with phi fitted, since the damping adjusts the forecast to changes in choke",
  "The Arps baseline answers it, because the decline curve engine folds the choke into Di"],
 "What is not built: no regression of rate on other variables such as choke, pressure or water cut; the machine learning course regresses. A forecasting method here reads only the series itself, so no second series can be passed. phi flattens the smoothed trend and knows nothing of a choke. The Arps fit reads the rates alone, and its Di is a decline per month.")

# 10
x("Which of these can this engine return?",
 "A rate at each future step, from a smoothing method or the Arps baseline",
 ["An EUR for the well, from the Arps baseline fitted to all of its months",
  "A seasonal forecast by Holt-Winters for a well with a yearly cycle",
  "An analytic prediction interval around a damped point forecast"],
 "The engine forecasts a rate at each future step and that is all a forecast from it claims. It computes no EUR, reserves or cumulative (the decline curve analysis course), builds no seasonal smoothing, and gives no analytic prediction interval: intervals come from the residual bootstrap alone.")

# 11
x("EKENE-P1 is passed with month 5 set to null. What does the engine do?",
 "It refuses by name at the first null index: \"y[5] must be a finite number: fill or drop missing values first\"",
 ["Fills month 5 by interpolating between months 4 and 6, and notes the filled month in the result",
  "Refuses the series as a whole: \"y must be an array of numbers\", since one null spoils every value",
  "Treats month 5 as a shut-in at rate 0, which the smoothing methods fit through like any value"],
 "A missing month is refused by name at the first index it meets, counting from 0, and nothing is filled; filling or dropping it is the caller's decision, and the data quality course conditions rates. Interpolating and dropping are both caller decisions the engine will not make. The array message is for something passed in place of a series, and here the series was an array with one null in it. A shut-in is a real value of 0; a null is a missing one, and the engine does not guess which a null was.")

# 12
x("The engine's exports are listed in full. How many names are there, and which one draws the bootstrap?",
 "Seven, and `forecastIntervals` is the bootstrap",
 ["Six functions and no defaults, the bootstrap being `bootstrap`",
  "Seven, with `backtest` returning the intervals as well",
  "Eight, one of them a Holt-Winters function named `seasonal`"],
 "The exported names, in full: DEFAULTS, accuracy, arpsForecast, backtest, compareWithArps, fitSmoothing, forecastIntervals. That is six functions and the DEFAULTS, seven names, and the intervals come from `forecastIntervals`. No function is called `bootstrap`. `backtest` returns origins, forecasts, errors and metrics, and no intervals. No seasonal smoothing is built.")

# 13
x("A forecast note quotes an interval from the bootstrap. Which conditions travel with the figure?",
 "The method, nSims, the seed and nonNegative, with the P90 read as the low case",
 ["The seed alone, as a seed fixes every draw whatever the number of paths",
  "nSims and the tolerance band of 1.00e-12 that the engine keeps on a percentile",
  "The R2 of the fit and the number of residuals trimmed from the pool before drawing"],
 "The note names the intervals with method, nSims, seed and nonNegative, and reads the P90 as the low case. The seed alone is not enough: the same seed at 100 and 1000 paths gives different percentiles. There is no band on a percentile; 1.00e-12 is the tie band of the grid and the ranking. R2 belongs to the Arps fit, and no residual is ever trimmed.")

# 14
x("The course's note on EKENE-P1 ranks, by MASE from first origin 30, arps 0.199862, damped 0.287529, holt 0.346480 and ses 1.067547. What finding does the note end on?",
 "The Arps baseline ranks first, and the damped method has not earned its place on EKENE-P1",
 ["damped is the forecast to use on EKENE-P1, as it is the best of the three smoothing methods",
  "Every method but ses ties, since each MASE except ses's lies below 1",
  "ses should be dropped from the note, leaving holt and damped reported side by side"],
 "A smoothing method that cannot beat the Arps baseline on a well has not earned its place on that well, and the note says so; damped ranks second. Being the best smoothing method is not beating the baseline. MASE below 1 compares each method with the in-sample naive error; it creates no tie, and the tie band is 1.00e-12 relative. The note keeps every row, the baseline's and ses's included.")

# 15
x("A figure from this engine disagrees with one from another tool on the same series. What does the course say to do before comparing the numbers?",
 "List the conventions each tool used, since both figures may be right under their own",
 ["Take this engine's figure, since its fits are deterministic and the other tool's may not be",
  "Average the two figures, which cancels out the differences between the two tools",
  "Rerun with more paths or a finer grid until the two figures come to agree"],
 "Every convention is a stated choice with a real alternative in common use, and two figures that disagree may both be right under their own conventions; a comparison that does not name them compares the conventions without saying so. Determinism makes a figure reproducible, and it says nothing about which convention the other tool took. Averaging or rerunning hides the difference without explaining it.")

assert next(_i, None) is None
emit(Q, '/root/dai-wip-forecastml/banks/d4a_m06.json', expect_n=15)
finish()
