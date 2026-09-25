import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Associate m03, Holt's linear trend.
# Sources: the course digest's Holt section (the basis, the table at alpha 0.5
# and beta 0.2 on EKENE-P1, the start and the spent second month, initialTrend,
# SSE over MSE, the straight-line forecast, EKENE-P5 below zero), the EKENE-P4
# three-method table, the refusals on beta and short series, and the vocabulary
# table. Every figure is printed there.

q(0, "Holt's recursion forecasts month t from the state left at month t - 1. Which expression gives that fitted value?",
 "l_{t-1} + b_{t-1}: last month's level plus last month's trend.",
 ["l_{t-1} + phi b_{t-1}, the damped fitted value.",
  "The level l_{t-1} alone.",
  "beta times the level plus 1 - beta times the trend, both from month t - 1."],
 "Holt's basis reads f_t = l_{t-1} + b_{t-1}. Multiplying the trend by phi is the damped trend's fitted value. Holt adds the trend inside the series as well as past it, and beta weights the change in level against the old trend inside the trend update, never the fitted value."),

q(2, "What does beta weight in Holt's trend update?",
 "The newest change in level, l_t - l_{t-1}, against the old trend.",
 ["The newest rate against the old forecast, which is alpha's role in simple smoothing.",
  "How strongly the trend is damped at each step once the series has ended.",
  "Which share of the level the trend adds to each month's fitted value."],
 "The trend update is b_t = beta (l_t - l_{t-1}) + (1 - beta) b_{t-1}: beta weights the newest change in level and 1 - beta the old trend. Weighting the newest rate is alpha's job in the level update. Damping is phi's, in the damped method, and the whole trend is added to the level in the fitted value, whatever beta is."),

q(3, "Holt's state after month 1 of EKENE-P1 (alpha 0.5, beta 0.2 given) is a level of 1153.400000 and a trend of -22.700000. Which fitted value does month 2 receive?",
 "1130.700000, the level plus the trend.",
 ["1153.400000, since the level is carried without its trend until month 3.",
  "1104.650000, the level once month 2's own rate has been taken in.",
  "1078.600000, month 2's rate, forecast exactly by the way the start is built."],
 "The fitted value is l_{t-1} + b_{t-1}: 1153.400000 plus -22.700000 is 1130.700000. The level 1104.650000 comes after month 2's rate of 1078.600000 arrives, so it is no forecast of month 2. The month forecast exactly by construction is month 1, and the trend is added from the first forecast on."),

q(1, "How does the engine start Holt's linear trend?",
 "l_1 = y_1 and b_1 = y_2 - y_1, so EKENE-P1 starts on a trend of -22.700000.",
 ["The trend starts at 0 and builds from the first changes.",
  "Its starting trend is fitted by the search as a parameter alongside alpha and beta.",
  "From a least-squares line through the first twelve months."],
 "The engine anchors the level at the first rate and takes the trend from the first two: on EKENE-P1 `initial.trend` is 1153.400000 less 1176.100000, -22.700000. It starts no trend at 0, fits no starting state, and draws no line through early months; a given `initialTrend` is the only other start."),

q(0, "Why is month 1's residual null in a Holt fit started by the engine?",
 "f_2 = l_1 + b_1 lands on month 1's rate by construction, so its residual of 0 says nothing.",
 ["Month 1 counts as a missing month, which the engine fills and then leaves out of scoring.",
  "Scoring waits until the trend has settled, and the engine judges it settled from month 2.",
  "Month 1 is scored inside the SSE and only left out of the list the result returns."],
 "The trend b_1 was built from month 1's rate, so the level plus that trend lands exactly on it: a residual of 0 by construction, the answer used to set the question. The engine does not score it, `residuals` is null at index 1 and `scoredFrom` is 2. No month is missing, no settling test is run, and the SSE leaves month 1 out."),

q(3, "On 48 months, how many errors do ses and holt each score?",
 "47 for ses, from index 1; 46 for holt, from index 2.",
 ["48 each, one per month.",
  "46 for ses and 47 for holt, since a trend adds one scored month.",
  "47 each, since both spend only month 0 on their start."],
 "Simple smoothing spends only month 0, `scoredFrom` 1, 47 errors. Holt spends month 0 on the level and month 1 on the trend, `scoredFrom` 2, 46 errors. No method scores month 0, which has no fitted value, and the trend costs a scored month."),

q(2, "Holt at alpha 0.5 and beta 0.2 on EKENE-P1 has SSE 29230.297102. What MSE does the engine report?",
 "635.441241, the SSE divided by the 46 scored errors.",
 ["The SSE over all 48 months, month 0 and month 1 included in the count.",
  "29230.297102 itself, since the engine reports one figure for both.",
  "The SSE over 47 errors, the divisor ses uses on the same months."],
 "The basis reads \"SSE / number of scored errors\": 29230.297102 over 46 is 635.441241. Counting the unscored months would add nothing to the sum and inflate the divisor, flattering the MSE with months the method was handed. The SSE and MSE are separate fields, and ses's 47 is a different count."),

q(1, "Why does the course compare methods by MSE whenever methods are set side by side?",
 "ses scores 47 errors and holt and damped 46, so their SSEs sum different numbers of terms.",
 ["The MSE penalises every extra parameter, so a method with more of them must always score worse.",
  "The SSE takes in month 0, which no method in the engine is able to forecast.",
  "An MSE is in bbl/d, while an SSE carries no unit and so cannot be read at all."],
 "An SSE over 47 errors and one over 46 add up different numbers of terms, and the MSE divides each by its own count, putting them on one footing. The MSE adds no penalty for parameters. Month 0 is never scored by any method. An MSE is in squared bbl/d, and an SSE carries a unit too."),

q(0, "Suppose the Holt start is supplied as `initialTrend` -25.000000 on EKENE-P1. How does scoring shift?",
 "Month 1 is scored: `scoredFrom` becomes 1, 47 errors, and month 1 is forecast at 1151.100000.",
 ["Nothing changes: the engine still spends month 1 on the start and scores from index 2.",
  "The level starts at -25.000000 in place of month 0's rate of 1176.100000.",
  "Month 0 is scored as well, since the start no longer needs any rate at all."],
 "With `initialTrend` given, the rule reads \"l_1 = y_1, b_1 = initialTrend\", so month 1's rate is not spent: `scoredFrom` 1, 47 scored errors, and month 1 forecast at 1151.100000 with a residual of 2.300000. The level still starts at y_1, and month 0 still has no fitted value."),

q(3, "Holt at alpha 0.5 and beta 0.2 ends EKENE-P1 at level 207.198880 and trend -5.798385. What does its h-step forecast look like?",
 "l_n + h b_n, a straight line: 201.400495 at step 1, 137.618258 at step 12.",
 ["The final level at every step, 207.198880, just as simple smoothing gives.",
  "A curve that flattens by a factor each step, reaching 184.933594 at step 12.",
  "l_n + b_n at every step, so 201.400495 repeated all the way to step 12."],
 "Holt's basis ends \"forecast l_n + h b_n\": every step falls by b_n, a straight line from 201.400495 at step 1 to 137.618258 at step 12. A flat forecast at the final level is simple smoothing's. A forecast that flattens, 184.933594 at step 12, is the damped trend at phi 0.9. Holt multiplies the trend by h, so the steps differ."),

q(2, "Holt fitted on EKENE-P5 ends on a trend of -0.702187 bbl/d per month. What does its h-step forecast do?",
 "It crosses zero: 0.078646 at step 16, -0.623541 at step 17, returned as computed.",
 ["It stops at 0 from step 17 on, because the engine clips any negative rate.",
  "The call is refused at step 17 by naming `h`, since a rate cannot be negative.",
  "It levels off near 11.100000, the last month's rate, as the trend fades out."],
 "Holt's straight line falls by b_n every step and runs through zero between steps 16 and 17. The engine returns the line as computed; it does not clip or bend a forecast, and nothing in a forecast is refused. A trend that fades is the damped method, and Holt's trend never fades past the last month."),

q(1, "What is an honest way to report Holt's EKENE-P5 forecast beyond step 16?",
 "Report the step where the line reaches zero as a limit of the method, or shorten h.",
 ["Replace the negative steps with 0 and present what is left as Holt's forecast for the well.",
  "Quote step 17, -0.623541, as the rate the well will produce that month.",
  "Refit with a larger beta, again and again, until the line stays above zero."],
 "The number is right for the method and wrong for the well, and the course names three honest responses: shorten h, report the zero crossing as a limit of the method, or use a method whose trend fades. Replacing steps with 0 presents an edit as the method's output, a negative rate is no rate, and a given beta tuned to hide the crossing is a judgement dressed as a fit."),

q(0, "In this course, what does the word trend name?",
 "The smoothed trend state b of holt or damped, in bbl/d per month.",
 ["The slope of a least-squares line drawn through all 48 monthly rates.",
  "Any direction in which the rates move over the last few months.",
  "The change in rate from the second-last month to the last, in percent."],
 "The course legislates trend as the smoothed state b of holt or damped, in bbl/d per month; Holt on EKENE-P5 ends on a trend of -0.702187 bbl/d per month. A regression slope through the rates is a different number, and any direction in conversation is the loose meaning the rule excludes. A percentage change between two months is not the state b."),

q(3, "An `initialTrend` given as a word reaches a holt fit. What does the engine reply?",
 "It refuses it by name: \"initialTrend must be a finite number when given\".",
 ["It treats the word as a blank and falls back on b_1 = y_2 - y_1.",
  "Refused by naming `beta`, the parameter that weights the trend.",
  "\"initialTrend applies to 'holt' and 'damped' only: 'ses' has no trend\", naming `initialTrend`."],
 "A given `initialTrend` must be a finite number, and the engine refuses anything else by naming the field, in its own words quoted in the key. A word is not read as a blank, so the start b_1 = y_2 - y_1 is not used in its place. The field named is the one at fault, and the other message about `initialTrend` is the refusal for an initial trend passed to ses."),

q(2, "Why does holt need at least 3 months before the engine will fit it?",
 "The first two set the initial level and trend, and the third is the first scored forecast.",
 ["Its grid needs three points before it can place a trend between them.",
  "A slope is fitted by least squares, and a line needs at least three rates.",
  "Three months give one level and two trends, one each for alpha and beta."],
 "The engine's refusal on two months says so in its own words: \"y has 2 values: 'holt' needs at least 3 (the first two set the initial level and trend, the third is the first scored forecast)\". The grid runs over parameter values and never over months; no least-squares line is fitted; and Holt carries a single trend state."),

emit(Q, '/root/dai-wip-forecastml/banks/d4b_m03.json', expect_n=15)
finish()
