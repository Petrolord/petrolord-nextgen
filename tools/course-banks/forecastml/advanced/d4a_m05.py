import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Expert m05, boundaries, bounds and caps. Figures from the course's
# boundary table, the length rules, the caps, the parameter box, the three
# tie rules and the stop rule, and the refusal table.

K = [2, 3, 0, 1, 3, 0, 2, 1, 0, 3, 1, 2, 0, 3, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A caller gives alpha by hand to `fitSmoothing`. Where does the accepted range begin and end?",
 "Any number from 0 to 1 with both ends included, while -0.1 and 1.2 are refused",
 ["Numbers strictly between 0 and 1, since alpha 0 would leave the level stuck at y_1",
  "0 to 1 when given and 0.8 to 0.98 when fitted, the box the search keeps it in",
  "Any number at all, clipped into the box from 0 to 1 before the fit starts"],
 "The boundary table: alpha and beta given, 0 and 1 accepted (inclusive), -0.1 and 1.2 refused with \"alpha must be a number from 0 to 1 (inclusive)\". alpha 0 is legal: the level then never moves from y_1, and the forecast is month 0's rate for ever. 0.8 to 0.98 is the fitted box for phi, and a fitted alpha stays in 0 to 1. A given value outside the range is refused outright.")

# 2
x("A phi given to `fitSmoothing` is checked against which rule?",
 "Above 0 and at most 1: 0.01 and 1 are accepted, 0 and 1.05 refused",
 ["From 0.8 to 0.98, the same box the fit searches when phi is left free",
  "From 0 to 1 with both ends included, the same rule as alpha and beta",
  "Above 0 and below 1, since a phi of 1 would turn the damped method into holt"],
 "A given phi may be any value above 0 and at most 1, exclusive at 0 and inclusive at 1; the refusal says so, adding that a fitted phi is searched from 0.8 to 0.98. The fitted box is narrower than the given rule; phi 0.5 can be given and held. A phi of 0 is refused. phi 1 is accepted, and damped with phi 1 returns the same SSE and forecasts as holt, bit for bit.")

# 3
x("h 0 is accepted by some functions and refused by another. Which way round is it?",
 "`fitSmoothing` and `arpsForecast` accept it, and `forecastIntervals` refuses it",
 ["`forecastIntervals` accepts it, and `fitSmoothing` refuses it as an empty horizon",
  "All three accept it, since 0 is the default h in every function that takes one",
  "`arpsForecast` refuses it, because an Arps curve needs at least one step to draw"],
 "For a fit and an Arps forecast h runs from 0 to 10000, and h 0 returns an empty forecast; the bootstrap forecasts at least one step, so its h runs from 1, and h 0 is refused with \"h must be a whole number from 1 to 10000\". h is 0 when left out of a fit, while the bootstrap has its own rule. `arpsForecast` shares the fit's rule.")

# 4
x("A backtest on 48 months with horizon 6: which is the largest first origin it accepts?",
 "42, since o + horizon = n is accepted, and 43 is refused",
 ["41, since the last origin must leave one month spare after its horizon",
  "43, because a horizon may run past the series and score what actuals remain",
  "48, the series length itself, where the origin forecasts months beyond the data"],
 "The last origin must leave all its actuals inside the series: o + horizon = n is accepted and o + horizon > n refused, so 42 is accepted (42 + 6 = 48). No spare month is needed. An origin whose horizon runs past the end would be scored on fewer than 6 actuals, and the refusal says so: \"an origin above 42 leaves fewer than 6 actuals\".")

# 5
x("`compareWithArps` is passed ses alone, with first origin 2. What comes back?",
 "A refusal: a comparison needs 3 training values whatever methods are listed",
 ["An accepted comparison, since ses needs only 2 training values and is the only method listed",
  "A comparison with the arps row unranked at origin 2 and ses ranked alone",
  "A refusal, because ses cannot be compared without holt or damped beside it"],
 "The engine's words: \"firstOrigin must be a whole number from 3 to 42 (the comparison needs 3 training values; an origin above 42 leaves fewer than 6 actuals)\". The boundary table says 2 is refused even for ses alone; the comparison's rule is its own and stricter than a backtest of ses, which accepts 2. The call is refused, so no row is scored. A list of one method is accepted.")

# 6
x("With `nonNegative` true, a percentile at some step comes out exactly 0 as simulated. How is it reported?",
 "As 0, reported as simulated and left out of the `clippedToZero` count",
 ["As 0, and counted in `clippedToZero` along with every negative percentile",
  "As null, since a rate of exactly zero is read as a shut-in month",
  "Raised to the smallest positive simulated value at that step"],
 "The boundary is per rule: a percentile at or above 0 is reported as simulated, and only one below 0 is reported as 0 and counted. So a percentile of exactly 0 is left alone and not counted. The engine never turns a percentile into null, and no rule raises one to another simulated value.")

# 7
x("During the compass search, a trial of +step would carry a fitted alpha to 1.05. What does the engine do with that trial?",
 "Clips it to 1, the edge of the box, and skips the trial if the clip leaves alpha where it was",
 ["Refuses the fit, naming `alpha`, since an alpha above 1 is refused when it is given",
  "Evaluates alpha 1.05 as it stands, since the box binds only the points of the grid",
  "Reflects the trial back inside the box to 0.95 and evaluates the SSE there"],
 "A compass trial past an edge is clipped to it, and a trial the clip leaves where it was is skipped; a fitted alpha stays in [0, 1]. A refusal is for a value the caller gives; a search trial is only clipped. The box binds the search as well as the grid. No trial is reflected.")

# 8
x("EKENE-P4's damped fit lists `atBounds` phi = 0.8. How does the course read that?",
 "phi is a fitted value on the lower edge of its box, the strongest damping the fit may choose",
 ["The fit failed, and the engine would have refused it had the search not converged",
  "phi was given as 0.8 and held fixed, and `atBounds` is where a given value is recorded",
  "The search ran out of evaluations at the edge and returned a warning with the fit"],
 "A parameter on its bound is a fitted value like any other; it says the SSE was still falling at the edge of the box, and for phi at 0.8 that is the strongest damping allowed. The fit converged, and nothing is refused. A given parameter is listed in `fixed` and never in `atBounds`, as phi 0.5 given on EKENE-P1 shows. No fit in the course reaches the evaluation cap.")

# 9
x("Two trials in one compass sweep lower the SSE by exactly the same amount. Which one does the search move to?",
 "The earlier: +step before -step, alpha before beta before phi",
 ["The later one, since each new trial replaces the best whenever it is no worse",
  "Whichever lies within 1.00e-12 of the best grid point's SSE",
  "Neither, since a tie counts as no improvement and the step is halved"],
 "The tie rules table: in the compass search a trial must be strictly below the current SSE to replace it, so the earlier trial is kept, in the stated order. Replacing on no worse would let the later trial win. 1.00e-12 is the band of the grid and of the ranking, and it plays no part here. Both trials improve on the current SSE, so the sweep has improved and the step is not halved.")

# 10
x("In the golden `holt-linear-exact`, the line 10, 12, 14, ..., 24, every alpha and beta give SSE 0. What does the fit return?",
 "alpha 0 and beta 0, the grid's first point, kept by the tie rule, with 0 moves in the search",
 ["alpha 1 and beta 1, the naive forecast of a line, which the grid reaches at its very last point",
  "A refusal, since parameters that cannot be identified cannot be fitted at all",
  "alpha 0.5 and beta 0.5, the middle of the box, which the engine takes when every point ties"],
 "On the coarse grid a later point replaces the best only when its SSE is below best x (1 - 1.00e-12), so with every point at 0 the first, alpha 0 and beta 0, is kept, and the compass search makes 0 moves. The parameters are not identified, and the tie rule is what makes the answer the same every time; nothing is refused. The last grid point never displaces a tie, and no middle point is chosen.")

# 11
x("Holt on EKENE-P1 ends its compass search at a final step of 7.45e-10 after 26 halvings. What stopped it?",
 "A sweep at a step of at most 2^-30 of the range, 9.31e-10, improved nothing",
 ["It reached the cap of 200000 SSE evaluations before the step could fall any further",
  "The SSE fell below the grid's tie band of 1.00e-12, so no further move could count",
  "Its parameters stopped changing at six decimals, the precision the course prints them at"],
 "The stop rule is a rule on the step: the step starts at 0.05 of each range, halves after a sweep with no improvement, and the search stops when a sweep at a step of at most 2^-30 of the range improves nothing; `converged` is true. Holt on EKENE-P1 takes 329 evaluations, far from the cap. 1.00e-12 is a relative tie band on the grid and puts no floor under the SSE. Printed decimals play no part in the search.")

# 12
x("What does `fitSmoothing` return if its search reaches 200000 SSE evaluations before the step falls to 2^-30 of the range?",
 "A fit with `converged` false and a warning, its parameters being where the search stopped",
 ["A refusal naming `y`, since a series that long cannot be fitted within the cap",
  "It restarts from the next best grid point with a fresh budget of evaluations",
  "The grid's best point, with every compass move discarded as unconverged"],
 "The evaluation cap warns and never refuses: the fit returns with `converged` false and a message in `warnings`, and its parameters are read as the point where the search stopped, which may not be the minimum. No restart and no discarding happen. No fit in this course reaches the cap; the three EKENE-P1 fits take 38, 329 and 1067 evaluations.")

# 13
x("EKENE-P6, with 3 months, is backtested with holt at horizon 1. What does the engine reply?",
 "\"y has 3 values: a backtest with horizon 1 needs at least 4 ('holt' needs 3 training values, then 1 actual)\"",
 ["A backtest from origin 3 with no actuals to score, returning every one of its metrics as null",
  "An accepted backtest from first origin 2, since horizon 1 needs only a single actual after it",
  "A refusal naming `horizon`, since 1 is below the least horizon a backtest will take"],
 "A backtest needs the method's fitting length, 3 for holt, plus a full horizon of actuals, so 3 values are one short and the refusal names `y` in the words quoted. An origin with no actuals is never run. holt from origin 2 is refused, because holt needs 3 training values. Horizon 1 is legal; the refusal is for a horizon of 0.")

# 14
x("EKENE-P1 repeated to 5005 values is backtested with step 1, and the engine refuses, naming `step`. What remedy does its message name?",
 "Raise step or firstOrigin, since 5003 origins are above the 5000 a backtest accepts",
 ["Shorten the series to fewer than 5000 values, since that is where the series cap sits",
  "Lower the horizon to 1, since each origin is charged for every step of its horizon",
  "Call `compareWithArps` instead, whose own cap on origins is ten times higher"],
 "The engine's words: \"step gives 5003 origins, above the 5000 a backtest accepts: raise step or firstOrigin\". The series cap is 100000 values, far above 5005. The origin count depends on the first origin and the step; the horizon only moves the last origin. A comparison shares the cap of 5000 origins.")

# 15
x("A series of 100001 values reaches the engine. Which functions refuse it?",
 "All six, while 100000 values are fitted by `fitSmoothing`",
 ["Only `backtest` and `compareWithArps`, which fit once per origin",
  "None: the only length cap is on h, which stops at 10000",
  "`forecastIntervals` alone, as 1000 paths on that series are too many"],
 "The boundary table: 100000 values fitted by `fitSmoothing`, 100001 refused by all six, with \"y has 100001 values, above the 100000 this engine accepts\". The origin cap is a separate rule. h has its own cap of 10000, and the series has its own of 100000. The path cap is on nSims, 100000, and it has no link to the series length.")

assert next(_i, None) is None
emit(Q, '/root/dai-wip-forecastml/banks/d4a_m05.json', expect_n=15)
finish()
