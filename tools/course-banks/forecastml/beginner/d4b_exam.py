import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Associate exam, 42 questions across the six modules.
# Sources: the course digest's engine overview and defaults, the Ekene wells,
# the refusals the Associate tier teaches, the one-step tables of simple
# smoothing and Holt on EKENE-P1, the alpha table, the damped step table and
# its limit, phi fitted on every long well, the EKENE-P1 fit table and stop
# rule, the Associate workflow on EKENE-P4, the NIST/SEMATECH check and the
# vocabulary table. Every figure is printed there. The exam asks each module's
# material from an angle its module bank does not use.

# ---- m01, what a data-driven forecast is
q(1, "Over months 20 to 27 EKENE-P2 reads 439.800000, 364.000000, 0.000000, 0.000000, 0.000000, 456.100000, 469.700000, 442.300000. Which is the first month back on production after the shut-in?",
 "Month 25, at 456.100000 bbl/d.",
 ["The last of the zero months, month 24.",
  "Month 26, since a restart month is never counted as producing.",
  "Only month 22, where the rate first reads 0."],
 "EKENE-P2's shut-in is months 22 to 24, counted from 0, at rate 0, and month 25 is 456.100000, the first month after it. Month 24 is still a zero month, month 26 reads 469.700000, and month 22 is where the shut-in begins."),

q(3, "A caller passes the text 'EKENE-P1' where the series of rates belongs. What does the engine reply?",
 "\"y must be an array of numbers\", naming `y`.",
 ["It looks the well up by name and fits its 48 months.",
  "A refusal naming `method`, since no method can read a well name.",
  "\"y[0] must be a finite number: fill or drop missing values first\"."],
 "The engine takes plain arrays and refuses a well name on the whole field `y`, in its own words \"y must be an array of numbers\". It holds no well data of its own to look up. The fault lies in `y`, so `method` is not named, and the index form of the message is for one bad value inside an array."),

q(0, "A series of 100001 values is passed to `fitSmoothing`. What comes back?",
 "A refusal in the engine's words: \"y has 100001 values, above the 100000 this engine accepts\".",
 ["The fit on the first 100000 values, with the value past the limit dropped from the end of the series.",
  "A fit on every value, since the limit of 100000 applies only to how many forecast steps h may ask for.",
  "A refusal naming `h`, in the words \"h must be a whole number from 0 to 10000\", because the series is long."],
 "`MAX_POINTS` is 100000, the most values a series may carry, and a longer series is refused by name. The engine trims nothing. The limit on h is a separate one, 10000, and the h message belongs to an h out of range."),

q(2, "EKENE-P1 is passed with months 5 and 12 both set to null. Which field does the refusal name?",
 "`y[5]`, the first index the engine meets.",
 ["`y[12]`, the last gap, which the engine reports first.",
  "Both, as `y[5]` and `y[12]`, in one message.",
  "`y`, with a count of the two missing months."],
 "A missing month is refused by name at the first index the engine meets, counting from 0, so the reply names `y[5]` alone. Filling or dropping month 5 is the caller's decision, and the next call would then meet month 12. The engine does not count gaps or list them together."),

q(1, "Month 10 of EKENE-P1 reads 734.800000, above month 9's 705.100000, on a well in steady decline. What does the rise show?",
 "A monthly average carries noise, so the decline is not perfectly smooth.",
 ["A workover planted at month 10 that lifts the rate of every later month in the series.",
  "A data error the engine flags in `notes` before any fit.",
  "The start of a facility plateau held at that rate from then on."],
 "EKENE-P1 was drawn from a hyperbolic decline with noise of 3 percent, so a single month can rise above the one before; a method has to decide how much of each month to believe. The workover is planted on EKENE-P2 and the plateau on EKENE-P3. The engine flags no data error in a fit; it refuses only a value that is not a finite number."),

q(0, "A well's history shows a clear yearly cycle in its rates. Which method in this engine models that cycle?",
 "None: the engine builds no seasonal smoothing, so no method here models a yearly cycle.",
 ["The damped trend, whose phi carries a seasonal swing forward from one year into the next.",
  "Holt's linear trend, once beta is fitted on at least 24 months of history.",
  "Simple smoothing, provided alpha is given as 12 so the level follows each season."],
 "The engine's methods are simple exponential smoothing, Holt's linear trend and the damped trend, all additive, and it builds no seasonal smoothing (Holt-Winters). phi damps a trend and carries no cycle, beta weights the trend whatever the length of the series, and alpha must lie from 0 to 1."),

q(3, "Every result the engine returns carries a `basis` block. What is it for?",
 "It names the convention used, so the working can be printed.",
 ["The random seed used to draw the fitted values.",
  "A list of the months the engine filled before fitting.",
  "It holds the answer to any refusal the call produced."],
 "Every result carries a `basis` block naming its convention, such as the recursion, the start and the MSE divisor, so a reader can print and check the working. A fit draws no random numbers, the engine fills no month, and a refusal returns `error` and `field` with no result."),

q(2, "The course legislates the word error. What does it mean here?",
 "Actual minus forecast, so a positive error means the forecast was low.",
 ["Forecast minus actual, so a positive error means the forecast was high.",
  "Any gap between two numbers, whichever way round it is taken.",
  "The squared difference, so every error in the course is positive."],
 "The course legislates error as actual minus forecast, and a residual is an in-sample one-step error: on EKENE-P1 at alpha 0.3 month 1's residual is 1153.400000 less 1176.100000, -22.700000, a forecast that was high. Reversing the order flips every sign, and the squares belong to the SSE."),

q(1, "What do simple smoothing, Holt's linear trend and the damped trend have in common in this engine?",
 "All three are additive: a trend adds to the level and an error to the forecast.",
 ["All three are multiplicative, scaling the level by a factor each month of the series.",
  "Every one of them carries a trend, and the trend is damped by phi in all three of them.",
  "They share one set of parameters, so a single alpha fits all three."],
 "The engine's three methods are all additive exponential smoothing, with no multiplicative form. Simple smoothing carries no trend at all, and only the damped method takes phi. Each method is fitted on its own, with its own free parameters."),

# ---- m02, simple exponential smoothing
q(3, "At alpha 0.3 on EKENE-P1, month 3 ends on level 1101.018100. What is month 4's fitted value?",
 "1101.018100, since the fitted value is the level from the month before.",
 ["954.800000, month 4's own rate, since the level has caught up with the series.",
  "1057.152670, the level month 4 ends on once its own rate has arrived.",
  "1142.083000, the level two months back, carried forward by alpha."],
 "Simple smoothing forecasts f_t = l_{t-1}, so month 4's fitted value is month 3's level, 1101.018100, and its residual is 954.800000 less that, -146.218100. 1057.152670 is month 4's level after its rate is taken in. 1142.083000 is month 2's level, month 3's fitted value."),

q(0, "At alpha 0.9 given, EKENE-P1's flat forecast is 211.447679, while the last month is 211.400000. Why so close?",
 "Nearly all the weight is on the newest month, so the final level sits almost on the last rate.",
 ["At alpha 0.9 the engine rounds the forecast to the last month's rate within 0.1 bbl/d each step.",
  "The fit moved alpha to its bound, so the final level became exactly the naive forecast at 211.400000.",
  "A forecast at alpha 0.9 is the mean of the last few months, which happens to fall near month 47."],
 "At alpha 0.9 each level is 0.9 of the new rate plus 0.1 of the old forecast, so the final level ends barely above the last rate, 211.447679 against 211.400000. Nothing is rounded, alpha 0.9 is given and held, so the forecast is not the naive 211.400000, and no plain mean is taken."),

q(2, "At alpha 0.1 on EKENE-P1 the SSE is 1954345.253138. Which MSE does the engine report beside it?",
 "41581.813897, the SSE over 47 scored errors.",
 ["1954345.253138, since at a given alpha the MSE equals the SSE.",
  "The SSE over all 48 months, month 0 counted as a zero error.",
  "282.956937, the flat forecast that alpha 0.1 leaves at every step."],
 "Simple smoothing scores 47 errors on 48 months, and the MSE is the SSE over the scored errors: 1954345.253138 over 47 is 41581.813897. A given alpha does not merge the two fields. Month 0 has no residual and is not counted. 282.956937 is the forecast, a rate, never an error measure."),

q(1, "On EKENE-P1, alpha 1 gives an MSE of 1054.511277 and alpha 0.5 an MSE of 2772.800063. What does the lower MSE at alpha 1 say about the step 12 forecast?",
 "Nothing directly: the MSE scores one-step errors on months the fit had already seen.",
 ["That the step 12 forecast at alpha 1 will miss the well's rate by less than 1054.511277 bbl/d.",
  "Alpha 1's step 12 forecast, 211.400000, becomes the rate the well will produce.",
  "Alpha 0.5 is wrong for the well, and its forecast must be thrown away."],
 "The MSE averages squared one-step residuals over the scored months of the fit, so it rewards following the history one month ahead. It knows nothing about step 12, which is forecast past the last month, and an MSE is in squared bbl/d, so it is no bound on a rate miss. Whether any forecast fares well on months to come is a later tier's test."),

q(3, "Among the five long Ekene wells under ses with a fitted alpha, where is the MSE largest?",
 "EKENE-P2, at 8466.172766, with a shut-in and a workover in its series.",
 ["EKENE-P4, at 4585.145790, since noise always raises the MSE most.",
  "EKENE-P3, at 1958.100426, since a plateau cannot be smoothed.",
  "EKENE-P5, at 1115.991064, since a steep decline lags the most."],
 "The fitted ses MSEs are 1054.511277 on EKENE-P1, 8466.172766 on EKENE-P2, 1958.100426 on EKENE-P3, 4585.145790 on EKENE-P4 and 1115.991064 on EKENE-P5. EKENE-P2 is the highest: its drops to 0 and jump back after the workover are large one-step errors. The other three figures are real but lower."),

q(0, "When does simple smoothing's flat forecast earn its place on a well?",
 "On a series with no persistent direction, such as a plateau or heavy noise around a steady rate.",
 ["On any steady decline, where the naive forecast follows the fall best of all the methods offered.",
  "On a short series only, where the engine refuses holt and damped for lack of months to fit.",
  "Whenever its fitted alpha lands on the bound 1, since that proves the level is the right model."],
 "A flat forecast says the method sees no direction, which is right on a plateau or on noise about a steady rate and wrong on a clear decline, where every step inherits the error. Holt fits on as few as 3 months. alpha on its bound 1 says the fit wants more weight on the newest month than the box allows, which on a decline is a sign the series asks for a trend."),

# ---- m03, Holt's linear trend
q(2, "At alpha 0.5 and beta 0.2, EKENE-P1's month 3 level moves from 1104.650000 to 1040.970000 on an old trend of -27.910000. Which trend does month 3 end on?",
 "-35.064000, 0.2 of the change in level plus 0.8 of the old trend.",
 ["The full change in level, since the trend takes each newest change whole.",
  "-27.910000, since the trend is held until the level settles again.",
  "-40.772440, the trend EKENE-P1 reaches by month 5 of the same fit."],
 "The trend update is b_t = beta (l_t - l_{t-1}) + (1 - beta) b_{t-1}: 0.2 times the change from 1104.650000 to 1040.970000 plus 0.8 times -27.910000 gives -35.064000, as the table prints. Taking the full change is beta 1, holding the trend is beta 0, and -40.772440 is the trend two months later."),

q(1, "In Holt's teaching fit on EKENE-P1, month 2's residual is -52.100000 and month 5's is -5.978400. What changed in between?",
 "The trend steepened to follow the decline, so the fitted value closed on the rate.",
 ["The engine refitted alpha and beta at month 5, once enough months of the series were in.",
  "Months 3 and 4 were left out of scoring, which shrinks every residual that comes after.",
  "The level was reset to the newest rate at month 5, as the naive forecast does."],
 "The trend moves from -22.700000 at the start to -40.772440 by month 5, as each month surprises the method on the low side, so month 5's fitted value, 940.178400, sits within a few bbl/d of the rate 934.200000. alpha and beta are given and held, every month from index 2 is scored, and alpha 0.5 keeps half of the old forecast in each level."),

q(3, "Fitted on EKENE-P1, holt reaches SSE 23041.767516 and damped SSE 22288.217610. May the two SSEs be compared directly?",
 "Yes: both score 46 errors from index 2, so the SSE order is the MSE order.",
 ["No: an SSE can never be compared across methods, whatever their counts.",
  "Only after both are divided by 48, the months in the series.",
  "No, since damped has one parameter more and its SSE must be penalised."],
 "The rule to compare by MSE exists because ses scores 47 errors and holt and damped 46. Holt and damped both start at l_1 = y_1, b_1 = y_2 - y_1 and score from index 2, so on the same 48 months both divide by 46, and ranking their SSEs ranks their MSEs. The divisor is the scored errors, never the months, and the MSE adds no penalty."),

q(0, "Why does Holt score the highest in-sample MSE of the three methods on EKENE-P4?",
 "A trend that swings with each noisy month adds error, so the level-only fit does better.",
 ["Holt is the only method the engine refuses to fit to its minimum on a noisy series.",
  "Holt's MSE divides by 47 errors, one more than simple smoothing scores on the well.",
  "Holt starts at a trend of 0, which a noisy well cannot correct within 48 months."],
 "On EKENE-P4 Holt fits alpha 0.501603 and beta 0.354191 and scores MSE 6048.241985, above ses's 4585.145790 and damped's 4502.618003: its full straight trend chases the noise. Every fit converged, Holt divides by 46, and its start is b_1 = y_2 - y_1."),

q(2, "What unit goes with Holt's final state b on EKENE-P5, -0.702187?",
 "bbl/d per month, the smoothed monthly change in level.",
 ["bbl/d, the same unit as the rate each month.",
  "Percent per month, a decline expressed as a share of the rate.",
  "Per month only, like the decline rate Di each well was drawn with."],
 "The trend is the smoothed state b of holt or damped, in bbl/d per month: each step of Holt's h-step forecast adds b_n to the rate. It is a change in rate per month, so it carries more than the unit of a rate; it is no percentage; and the Di a well was drawn with is a fraction of the rate per month, a different quantity."),

q(1, "How many months does the damped trend need when an `initialTrend` is given?",
 "2: the first sets the level, the second is the first scored forecast.",
 ["3, exactly as Holt needs with the start taken from the series.",
  "1, since the given trend leaves nothing for the series to supply.",
  "4, one extra month to set phi alongside the level and trend."],
 "With an `initialTrend` given, y_2 is not spent on the start, so the damped method needs 2 months; with 1 the engine refuses in its own words, \"y has 1 value: 'damped' with an initialTrend needs at least 2 (the first sets the level, the second is the first scored forecast)\". Three is the rule without a given trend, and phi takes no month of its own."),

# ---- m04, the damped trend
q(3, "A forecast at phi 0.9 is handed over with step changes of -2.521718 at step 4 and -2.269547 at step 5. How can a reader check it is damped at that phi?",
 "Divide one change by the change before: the ratio should read 0.900000.",
 ["Subtract the changes: the gap should equal the final trend b_n.",
  "Add up the changes: together they must total the final level l_n of the fit.",
  "Check that every change equals b_n, as a damped forecast requires."],
 "Each damped change is phi times the one before, so -2.269547 over -2.521718 reads 0.900000, and the course's table shows that ratio at every step. A difference between changes, a sum of changes, or a constant change describe no rule of the damped forecast; a constant change is Holt's straight line."),

q(0, "At alpha 0.5 and beta 0.2 on EKENE-P1, Holt gives 137.618258 at step 12 and the damped trend at phi 0.9 gives 184.933594. What does the gap between them show?",
 "How much of a twelve-month forecast rests on phi alone, alpha and beta held the same.",
 ["That the damped forecast is right and Holt's line is wrong for EKENE-P1 in the months ahead.",
  "That the damped fit ran on different alpha and beta values from the ones Holt's fit used.",
  "How far each forecast sits from the rate EKENE-P1 will produce at step 12."],
 "Both fits share alpha 0.5 and beta 0.2, and only phi differs, so the gap shows how much of a year's forecast rests on that one choice. Both are in-sample fits projected forward, so neither number is a test of which is right, and the months that would settle it have not happened."),

q(2, "A fitted phi ends on 0.98 and `atBounds` lists it. What does that bound describe?",
 "The weakest damping the fit may choose, close to Holt for many steps.",
 ["The strongest damping the fit may choose, close to simple smoothing.",
  "A phi given by the caller, since 0.98 is the default the engine uses.",
  "A search that ran out of evaluations before phi could reach 1."],
 "phi 0.98 is the top of the fitted range, so it damps least and the forecast stays near Holt's line for many steps; the SSE was still falling at that edge. 0.8 is the strongest damping. A given parameter goes in `fixed`, and a fitted phi never reaches 1 because its box stops at 0.98."),

q(1, "Damped fitted on EKENE-P3 ends at alpha 0.594062, beta 0.798138 and phi 0.913180. What does `atBounds` read?",
 "none: every fitted parameter ended inside its box.",
 ["phi = 0.8, since the plateau pulls phi to its strongest damping.",
  "alpha = 1, since every long well fits alpha on its upper bound.",
  "beta = 1, since 0.798138 is rounded up to the bound."],
 "EKENE-P3's damped fit lists `atBounds` none: alpha, beta and phi all ended inside their boxes. EKENE-P4 is the well with phi on 0.8. alpha 1 is simple smoothing's fit on four long wells, and the damped EKENE-P2 fit; the engine rounds no parameter to a bound."),

q(3, "On EKENE-P1 the damped trend at phi 0.9 ends on final level 209.755413 and final trend -3.843497. How far below the final level does its limit lie?",
 "b_n phi / (1 - phi) below it, so the forecast settles at 175.163940.",
 ["b_n below it, at one step's fall, so the limit is step 1's 206.296266.",
  "No distance: a damped forecast settles on its final level once the trend fades.",
  "Twelve trends below it, since h 12 is where the damped fit stops falling."],
 "The limit is l_n + b_n phi / (1 - phi); with a negative trend it sits a finite amount below the final level, 175.163940 here, matched by step 400. 206.296266 is step 1. The forecast keeps falling after step 1 and after step 12, 184.933594, so it neither holds the final level nor stops at step 12."),

q(0, "Why does the course say a phi below 0.8 can only be given?",
 "The fit searches phi from 0.8 to 0.98, while a given phi may be any value above 0 and at most 1.",
 ["The engine refuses every phi below 0.8, given or fitted, with the message on phi's range.",
  "A phi below 0.8 turns the damped method into simple smoothing, which takes no phi.",
  "Only the grid can reach below 0.8, and a caller who gives phi bypasses the grid."],
 "No fit returns a phi under 0.8, because the search box for phi runs from 0.8 to 0.98. A caller may still hand the engine any phi above 0 and at most 1, and on EKENE-P1 a phi of 0.5 is accepted and held. At any phi the method stays the damped trend, and the coarse grid's phi values all sit inside 0.8 to 0.98."),

q(2, "Which list holds the coarse grid's values of phi?",
 "0.8, 0.85, 0.9, 0.95 and 0.98.",
 ["0 to 1 by 0.1, eleven values.",
  "0.8 to 0.98 in steps of 0.05, the first compass step.",
  "0.5, 0.9 and 1, the values the lessons give."],
 "The stated default `GRID_PHI` is 0.8, 0.85, 0.9, 0.95, 0.98. 0 to 1 by 0.1 is the grid of alpha and beta. The compass search works between grid points, and 0.5, 0.9 and 1 are phi values a lesson gave."),

# ---- m05, fitting the parameters
q(1, "Fitted on EKENE-P1, Holt's grid starts at alpha 0.7 and beta 0.3. Where does the compass search take it?",
 "To alpha 0.661937 and beta 0.381513 in 25 moves, the SSE falling from 23147.088556 to 23041.767516.",
 ["Nowhere: the grid point is the minimum, so the search makes 0 moves and returns alpha 0.7, beta 0.3.",
  "To alpha 1 and beta 0, a corner of the box, which `atBounds` lists as the fit's two bounds on this well.",
  "To alpha 0.657029 and beta 0.353869 in 50 moves, the SSE falling to 22288.217610."],
 "The EKENE-P1 table shows Holt's grid start alpha 0.7, beta 0.3 at SSE 23147.088556, and 25 moves to alpha 0.661937, beta 0.381513 at SSE 23041.767516. 0 moves is the ses row. alpha 1 and beta 0 are the damped EKENE-P2 bounds. 0.657029, 0.353869 and 50 moves are the damped fit's, with phi also free."),

q(0, "The damped fit on EKENE-P1 takes 1067 SSE evaluations. How many of them are the coarse grid?",
 "605, the product 11 x 11 x 5 of the alpha, beta and phi grid values.",
 ["121, since phi is left to the compass search and never placed on the grid.",
  "1067, since every evaluation of this fit is a grid point.",
  "38, the same count of grid points as the ses fit takes on EKENE-P1 in all."],
 "Scoring every combination on the damped grid costs 605 evaluations; the rest of the 1067 are compass search trials between grid points. Dropping phi from that grid would leave Holt's 121, and the ses fit on EKENE-P1 spends only 38 evaluations in total."),

q(3, "Holt on EKENE-P1 ends with a `finalStep` of 7.45e-10. How does that figure relate to the stop rule?",
 "It is at most 2^-30 of the range, 9.31e-10, so a sweep at that step improving nothing met the rule.",
 ["Below 1.00e-12, the relative tie band, which is the figure a converged search has to reach.",
  "The SSE left at the end of the search, 7.45e-10 of the SSE the grid started from.",
  "It is how far alpha moved on the last sweep, a figure showing that the search had nearly finished."],
 "`finalStep` is the fraction of each range the step had reached; the search stops, `converged` true, when a sweep at a step of at most 2^-30, 9.31e-10, improves nothing, and 7.45e-10 is within it after 26 halvings from 0.05. 1.00e-12 is the grid's tie band, and `finalStep` is a step size, never an SSE or a move."),

q(2, "Each of the three fits on EKENE-P1 makes 26 halvings, though their moves run from 0 to 50. Why do the halvings agree?",
 "Halvings count the step down from 0.05 to below 2^-30; moves happen at whatever step improves.",
 ["The engine fixes the number of halvings at 26 for every fit, whatever the series is.",
  "Each move resets the step, and every fit happens to make 26 of those resets.",
  "26 halvings are what 200000 evaluations allow before the search is capped."],
 "The step starts at 0.05 of each range and halves after each sweep that improves nothing, and it takes 26 halvings to fall from 0.05 to below 2^-30; a move keeps the step. The count is not a fixed setting, and no fit here comes near the cap of 200000 evaluations, the damped fit taking 1067."),

q(1, "Holt's fitted alpha and beta are given back to the engine as fixed values, at full precision. What returns?",
 "The same SSE and forecasts, bit for bit, with `optimiser` null.",
 ["A fresh search from those values, reaching a slightly lower SSE.",
  "A refusal, since fitted values cannot be passed back as given.",
  "The grid's best point, since a given pair is checked against the grid."],
 "Giving the fitted parameters back as fixed values returns the same SSE and forecasts bit for bit, and with nothing left to fit the optimiser record is null. No search runs, nothing is refused, and no grid is scored. It is a way to freeze a fit and show the numbers come from stated parameters."),

q(0, "Does any fit in this course carry a warning from the search?",
 "No: every optimiser record the course reads reports `converged` true.",
 ["The damped fit on EKENE-P4 does, since its phi stopped on its bound 0.8.",
  "Every ses fit whose alpha lands on its upper bound of 1 carries one.",
  "Yes, the flat SSE surface of the exact line, whose parameters are not identified."],
 "A warning is added only when the search stops at 200000 evaluations before its step rule is met, and no fit in the course reaches that cap. A parameter on its bound is a fitted value like any other, reported in `atBounds` with no warning, and the exact line's fit converged after 0 moves."),

q(3, "A fitted alpha lands on 0, its lower bound. What does simple smoothing become there?",
 "A level that never moves from its start.",
 ["The naive forecast, the last month carried forward.",
  "A refusal, since alpha must lie above 0.",
  "Holt's linear trend with the trend switched on."],
 "At alpha 0 the new level is all old forecast and none of the new rate, so the level never moves from its start; on EKENE-P1 that is 1176.100000 for ever. The naive forecast is alpha 1. 0 is inside the accepted range, and alpha adds no trend."),

q(2, "In NIST's double smoothing example, `atBounds` lists beta = 1. What does a trend weight on that bound mean?",
 "The trend is always the newest change in level.",
 ["A trend frozen for good at its start of 0.8.",
  "Damping at the strongest rate the box will allow.",
  "The level follows every rate, as the naive forecast does."],
 "beta 1 puts all the trend's weight on the newest change in level, l_t - l_{t-1}, and none on the old trend. A trend that never changes is beta 0. Damping is phi's role, and following every rate is alpha on 1."),

# ---- m06, one well forecast end to end
q(1, "The handbook prints a fitted alpha of 0.977 for case nist-6434-ses-fit; the engine returns 0.977276. How should the two be read?",
 "As a match to 3 decimals, the precision of the printed figure.",
 ["A gap in the fourth decimal that points to a different start.",
  "A failure, since the engine should print exactly 0.977.",
  "As agreement only once alpha is given as 0.977 and held."],
 "A published check compares to the printed precision and never beyond it: 0.977276 rounds to 0.977 at the three decimals the handbook prints. Printing more decimals is no disagreement, so nothing points to a different start. Giving alpha would test a different case from the fitted one."),

q(0, "Which method from module two does the case nist-6434-ses-alpha-1 test?",
 "The naive forecast: simple smoothing at alpha 1.",
 ["Damped with phi 1, which equals Holt.",
  "Simple smoothing with alpha fitted by the search.",
  "Holt's linear trend with its trend weight at 1."],
 "Case nist-6434-ses-alpha-1 is simple smoothing at alpha 1, the naive forecast, on the handbook's second series; its MSE prints as 8.8867 in the handbook and 8.886667 from the engine. A fitted alpha is the case nist-6434-ses-fit, and the trend weight of 1 belongs to the double smoothing example."),

q(3, "How many of the handbook's published figures does the engine match, and at what precision?",
 "All 64, across 6 golden cases, each at the handbook's printed decimals.",
 ["The 9 figures in the course's table, each to six decimals.",
  "All 64, each to six decimals, the engine's own precision.",
  "6, one for each golden case, at two decimals throughout."],
 "6 golden cases carry 64 published figures, and the engine rounds to every one of them at the handbook's printed decimals, which vary from case to case. The course's table is a selection, and six decimals is the engine's printing precision, which no published figure claims."),

q(2, "A forecast write-up lists `scoredFrom` beside the MSE. What does that item let a reader check?",
 "The MSE's divisor, the number of scored errors, without refitting.",
 ["The month the forecast starts from, one step past the series.",
  "Whether the fit converged before its evaluation cap was reached.",
  "Which parameters were given, since each given one shifts where the recursion starts."],
 "`scoredFrom` is the index of the first scored residual; it says how many months the start used and so how many errors the MSE divides by. The forecast starts one step past the last month whatever `scoredFrom` is, convergence is read from `converged`, and given parameters are listed in `fixed`."),

q(1, "Why does the engine start its recursions at the first observation?",
 "A learner can start the recursion by hand and reproduce every fitted value.",
 ["It is the maximum likelihood start, the one that statistics packages estimate.",
  "Starting later would leave the first months of the series without any rate at all.",
  "The handbook requires it, and the engine must copy the handbook."],
 "The course gives the reason: with l_1 = y_1, and b_1 = y_2 - y_1 for the trend methods, anyone can run the recursion by hand from the series and reproduce the engine's figures. Other tools estimate the starting states. The months are there whatever the start, and the handbook is a check that shares the start; it sets no rule for the engine."),

q(3, "EKENE-P4's three fitted methods score MSEs of 4585.145790, 6048.241985 and 4502.618003. Which one does a write-up quote, and how?",
 "damped's 4502.618003, with scoredFrom 2, fitted months 0 to 47, marked in-sample.",
 ["holt's 6048.241985, since the highest MSE is the most cautious figure to report.",
  "ses's 4585.145790 alone, since the flat forecast has no bound to explain.",
  "The mean of all three MSEs, which spreads the choice of method fairly."],
 "The workflow compares by MSE and reports the method it chose with its parameters, `scoredFrom` and the MSE, the months fitted, h, and that the numbers are in-sample. The damped fit has the lowest MSE, 4502.618003, scored from index 2. No rule picks the highest MSE, and averaging MSEs across methods describes no fitted method."),

emit(Q, '/root/dai-wip-forecastml/banks/d4b_exam.json', expect_n=42)
finish()
