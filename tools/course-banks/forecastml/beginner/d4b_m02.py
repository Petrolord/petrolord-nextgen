import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Associate m02, simple exponential smoothing.
# Sources: the course digest's simple smoothing section (the basis, the start at
# the first month, initialLevel, the flat forecast, the alpha table on EKENE-P1
# and the fitted alpha on every 48-month well), the one-step table at alpha 0.3,
# and the refusals on alpha, beta, initialTrend, phi and h. Every figure is
# printed there.

q(1, "In the engine's simple exponential smoothing, what is the fitted value for month t?",
 "The level from the month before, l_{t-1}.",
 ["The average alpha y_t + (1 - alpha) l_{t-1}, taken after month t arrives.",
  "An equally weighted mean of every rate up to and including month t.",
  "Month t - 1's rate, whatever value alpha has been set to."],
 "The basis reads f_t = l_{t-1}: the fitted value is the level left by the month before. The weighted average alpha y_t + (1 - alpha) f_t is the new level, made once month t's rate is in, so it cannot forecast month t. The weights on past months shrink by 1 - alpha each month back, so they are unequal, and the fitted value equals the month before's rate only at alpha 1."),

q(3, "At alpha 0.3 on EKENE-P1, month 1 has rate 1153.400000 and fitted value 1176.100000. What level does month 1 end on?",
 "1169.290000, which is 0.3 of the rate plus 0.7 of the fitted value.",
 ["1142.083000, the level the method reaches as soon as month 1's rate arrives.",
  "It jumps to 1153.400000, since the level always takes the newest rate.",
  "1176.100000, held unchanged until month 2."],
 "The level update is alpha y_t + (1 - alpha) f_t: 0.3 x 1153.400000 + 0.7 x 1176.100000 is 1169.290000. The level 1142.083000 is month 2's, one month later. The level takes the newest rate only at alpha 1, and it moves from month 1 on, since month 1's rate is the first update."),

q(0, "What does alpha weight in simple exponential smoothing?",
 "The newest month's rate, with 1 - alpha going to the old forecast.",
 ["The oldest month, so a large alpha anchors the level at month 0 for good.",
  "Each newest change in the level, set against the trend carried from before.",
  "The share of months the SSE scores."],
 "alpha is the weight the newest month gets, and 1 - alpha goes to the forecast it replaces. A large alpha follows the newest rates; the level is anchored at month 0 only at alpha 0. Weighting the newest change in level against the old trend is beta's job in the methods with a trend, and alpha has no say in which months are scored."),

q(2, "Where does the engine start simple smoothing's level before month 1 is forecast?",
 "At the first observation, l_1 = y_1, so month 1's fitted value is month 0's rate.",
 ["From the mean of the first twelve months, worked out before the recursion begins.",
  "A starting level fitted by the search as one more free parameter beside alpha.",
  "Zero, so that the level climbs toward the rates across the first few months."],
 "The engine anchors the level at the first observation, l_1 = y_1, and on EKENE-P1 month 1's fitted value 1176.100000 is month 0's rate. It averages no early months and fits no starting level; an `initialLevel` can be given, and then it is held fixed. A start at 0 is not the engine's rule."),

q(1, "Simple smoothing is fitted on EKENE-P1's 48 months. How many residuals does its SSE sum?",
 "47, from index 1 on, since month 0 has no fitted value.",
 ["All 48, one per month, with month 0's residual set to 0.",
  "46, since the first two months are spent on the start.",
  "12, the months the h-step forecast is going to cover."],
 "`scoredFrom` is 1 for simple smoothing and the basis reads \"errors scored from index 1 (0-based), 47 of them\". Month 0 has no fitted value, so its residual is null and never scored. Spending two months on the start is the rule for holt and damped, which score 46, and the h-step forecasts are never part of the SSE."),

q(3, "At alpha 0.3 on EKENE-P1, an `initialLevel` of 1150.000000 is given. What changes?",
 "Month 1's fitted value becomes 1150.000000 and the SSE moves from 312538.074209 to 297403.122315.",
 ["Nothing in the numbers: the start is noted in the basis while the recursion still begins at y_1.",
  "The engine refuses it, since the level must start at month 0's rate of 1176.100000.",
  "The last months move most, because the weight on the start grows as the recursion runs on."],
 "With an `initialLevel` given, the rule reads \"l_1 = initialLevel\", so the first fitted value is 1150.000000 and the SSE falls from 312538.074209 to 297403.122315. A number is accepted; only a value that is not a number is refused. At alpha 0.3 the start's weight shrinks by 0.7 each month, so it matters most for the first months."),

q(2, "At alpha 0.3 on EKENE-P1, every one of the 12 h-step forecasts is 221.171043, while the last month is 211.400000. Why?",
 "Simple smoothing has no trend, so each step is the final level, which trails a falling well from above.",
 ["The forecast is the mean of the last twelve months, all of which lie above month 47.",
  "The engine holds a forecast at its final level so that it cannot fall below the series.",
  "Alpha 0.3 is too small to fit, so the engine freezes the forecast at the level it has."],
 "The basis ends \"forecast l_n at every step\": with no trend, every h-step forecast is the final level. On a declining well the level trails the rates from above, so l_n, 221.171043, sits above the last rate. No mean of recent months is taken, the engine holds no forecast up by rule, and alpha 0.3 is a given value that runs as stated."),

q(0, "With alpha given and held fixed on EKENE-P1, how does the SSE move as alpha rises from 0 to 1?",
 "It falls all the way, from 25246877.490000 at alpha 0 to 49562.030000 at alpha 1.",
 ["It is lowest at alpha 0.5, 130321.602967, and rises again as alpha moves on toward 1.",
  "Upward throughout, since a larger alpha lets more noise into every level.",
  "It is the same at every alpha, since alpha changes only the h-step forecast."],
 "The alpha table on EKENE-P1 shows the SSE falling at every row, from 25246877.490000 at alpha 0 through 130321.602967 at 0.5 to 49562.030000 at 1. On a steady decline, the more weight the newest month gets, the less the fitted values lag. alpha moves every level, so the fitted values and the SSE move with it."),

q(3, "What does simple smoothing do with alpha 0 given?",
 "The level never moves from y_1, so EKENE-P1 is forecast at 1176.100000 for ever.",
 ["The naive forecast, with each fitted value being the month before.",
  "A refusal, since the engine accepts an alpha only above 0.",
  "It forecasts 211.400000, EKENE-P1's last rate, at every step of the forecast list."],
 "At alpha 0 each new level is all old forecast and none of the new rate, so the level stays at y_1: month 0's 1176.100000 is every fitted value and every h-step forecast, with the largest SSE in the table, 25246877.490000. The naive forecast is alpha 1. Both ends of 0 to 1 are accepted, and 211.400000 is the forecast at alpha 1."),

q(1, "At alpha 1 simple smoothing forecasts 211.400000 on EKENE-P1 at every step. What is that forecast called?",
 "The naive forecast: the last month's rate, carried to every step.",
 ["A damped trend's limit, the rate a fading trend levels off at.",
  "Its starting level, carried unchanged from month 0 to the end.",
  "The mean level, averaged over all 48 months of EKENE-P1."],
 "At alpha 1 the level is always the newest rate, so each fitted value is the month before and the h-step forecast is the last month's 211.400000: the naive forecast. A damped limit comes from a trend, and simple smoothing has none. The starting level 1176.100000 is what alpha 0 carries, and no mean of the months is taken."),

q(0, "With alpha left free, which 48-month Ekene well fits simple smoothing's alpha inside the box?",
 "EKENE-P4, the noisy allocation, at 0.528376.",
 ["EKENE-P1, whose clean decline stops short of the bound at 0.528376.",
  "EKENE-P3, where the plateau holds the fitted alpha at 0.5.",
  "EKENE-P5, whose steep fall pulls the fitted alpha down to 0.1."],
 "Fitted, alpha stops on its upper bound 1 on EKENE-P1, EKENE-P2, EKENE-P3 and EKENE-P5, and `atBounds` lists \"alpha = 1\" on each. Only the noisy allocation, EKENE-P4, fits alpha inside the box, at 0.528376, with `atBounds` none. The values 0.5 and 0.1 are rows of the alpha table where alpha was given."),

q(2, "Why does a steady decline push simple smoothing's fitted alpha onto its bound 1?",
 "Every older rate sits above the next one, so any weight on it adds lag.",
 ["The grid ends at 1, and the fit prefers the last grid point on a tie.",
  "Alpha 1 is what the engine returns when the search cannot find a minimum.",
  "On a decline the fit weights the oldest month most, and 1 is that weight."],
 "The fitted value is a weighted average of past rates. On a well that falls every month, each past rate is above the next, so weight on older months pulls the fitted value up and away; the least lag comes from all the weight on the newest month. A grid tie keeps the earlier point, the search always stops at a minimum it can find, and alpha 1 weights the newest month."),

q(3, "An alpha of 1.2 is passed. What does the engine reply?",
 "A refusal naming `alpha`: \"alpha must be a number from 0 to 1 (inclusive)\".",
 ["A fit at alpha 1, the nearest value inside the box, with a warning attached.",
  "Refused by naming `y`, since the series cannot be smoothed at that weight.",
  "It fits at 1.2, since only a fitted alpha is kept inside 0 to 1."],
 "A given alpha outside 0 to 1 is refused by name, in the engine's own words \"alpha must be a number from 0 to 1 (inclusive)\"; -0.1 gets the same reply. A refusal returns no fit, so nothing is moved to the bound, and the field named is the one at fault, `alpha`. A weight outside 0 to 1 would not be an average, which is why a given alpha is held to the same box."),

q(1, "A `beta` is passed with the method 'ses'. What happens?",
 "Refused: \"beta applies to 'holt' and 'damped' only: 'ses' has no trend\".",
 ["It is ignored, since ses has no trend, and the fit comes back as usual.",
  "Used as a second weight on the rate of the month before the last one.",
  "Accepted, and the fit is switched to holt with that beta, noted in the basis."],
 "Simple smoothing has no trend, so the engine refuses anything that would set one, naming `beta` with the message quoted. It does not silently ignore a parameter, give beta another role, or change the method the caller asked for."),

q(0, "Which values of `h` does the engine accept when fitting?",
 "A whole number from 0 to 10000; -1, 1.5 and 10001 are each refused.",
 ["Any whole number from 1 to 10000, since h 0 would return no forecast.",
  "Any number above 0, with a fraction such as 1.5 rounded up to 2 steps.",
  "Up to 100000, the most values a series may carry."],
 "The refusal reads \"h must be a whole number from 0 to 10000\", and -1, 1.5 and 10001 each draw it. h 0 is accepted and returns an empty `forecast`. Nothing is rounded, and 100000 is the most values a series may carry, a different limit."),

emit(Q, '/root/dai-wip-forecastml/banks/d4b_m02.json', expect_n=15)
finish()
