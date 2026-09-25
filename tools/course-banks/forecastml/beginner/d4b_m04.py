import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Associate m04, the damped trend.
# Sources: the course digest's damped section (the basis, the step table at
# alpha 0.5, beta 0.2 and phi 0.9 on EKENE-P1, the limit, phi 1 against Holt,
# phi fitted on every 48-month well, phi 0.5 given), the Holt EKENE-P5 crossing
# beside the damped step 24, the fitted-phi range and its FPP3 reason, and the
# refusals on phi. Every figure is printed there.

q(2, "Where does the damped trend's recursion differ from Holt's?",
 "phi multiplies the old trend, both in the fitted value and in the trend update.",
 ["phi takes alpha's place in the level update, as the weight on each new rate.",
  "phi multiplies the level, so every fitted value shrinks by a fixed factor each month.",
  "Only past the last month; inside the series the damped fit runs exactly as Holt's."],
 "The damped basis reads f_t = l_{t-1} + phi b_{t-1} and b_t = beta (l_t - l_{t-1}) + (1 - beta) phi b_{t-1}: phi appears in exactly the two places the trend is carried. The level update, with alpha as its weight, is Holt's unchanged. phi never touches the level, and because it acts inside the series the damped fit's final state differs from Holt's."),

q(0, "At alpha 0.5, beta 0.2 and phi 0.9 on EKENE-P1, step 1 changes by -3.459147 and step 2 by -3.113233. What rule links them?",
 "Each change is phi times the one before: -3.113233 is 0.9 of -3.459147.",
 ["The final trend b_n, -3.843497, repeated as the change at every step.",
  "Alpha times the change before, so 0.5 of the previous change at every step of the list.",
  "Every step moves the forecast 10 percent of the way to zero."],
 "The damped h-step forecast adds phi^h b_n at step h, so each change is phi times the change before; the ratio column reads 0.900000 at every step, checked to 1.00e-9. A change equal to b_n at every step is Holt's straight line. alpha weights the level update and plays no part past the last month, and nothing in the rule pulls the forecast toward zero."),

q(3, "On the same fit, with final level 209.755413 and final trend -3.843497, what is the first change of the damped forecast?",
 "phi b_n, 0.9 times -3.843497, which is -3.459147.",
 ["b_n itself, -3.843497, with damping starting only from step 2.",
  "phi squared times b_n, since step 1 already counts as one damping.",
  "The last month's residual, multiplied by phi to give the first step."],
 "Step 1 of the damped forecast is l_n + phi b_n, so the first change from the final level is phi b_n: 0.9 times -3.843497 is -3.459147. The damping acts from step 1, the power of phi at step 1 is 1, and no residual enters the h-step forecast."),

q(1, "Where does the damped forecast at phi 0.9 on EKENE-P1 head as h grows?",
 "Toward l_n + b_n phi / (1 - phi), 175.163940, which step 400 matches to 1.00e-9.",
 ["Down by b_n every step without end, just as Holt's straight line does.",
  "Toward zero, since a damped forecast of any declining well ends at 0.",
  "Back to its final level l_n, 209.755413, once the trend has faded away completely."],
 "The bracket phi + phi^2 + ... + phi^h approaches phi / (1 - phi), so the forecast approaches l_n + b_n phi / (1 - phi), 175.163940; the engine's step 400 is 175.163940, the limit to 1.00e-9. Falling by b_n every step is Holt. The limit is a finite drop below l_n, so the forecast neither reaches zero here nor returns to 209.755413."),

q(0, "The damped forecast is 184.933594 at step 12 and 175.163940 at step 400. What do the two figures show?",
 "The forecast levels off at a rate, and at step 12 it is still above its limit.",
 ["They are one limit written at two precisions, reached from step 12 on and held.",
  "The forecast climbs again after step 12, once phi takes over from the final trend.",
  "Step 400 has been clipped at the lowest rate the series ever recorded."],
 "A damped forecast adds ever smaller changes and approaches its limit, 175.163940, which step 400 matches; at step 12 it is 184.933594 and still falling toward it. Both figures print to six decimals and differ, so they are two values. The changes all share the sign of b_n, so the forecast never climbs, and the engine clips nothing."),

q(3, "With phi left out, which values does the fit search for it?",
 "0.8 to 0.98 inclusive, the stated PHI_MIN and PHI_MAX.",
 ["0 to 1, the same box the fit searches for alpha and beta.",
  "Any value above 0 and at most 1, the rule for a given phi.",
  "0.85 to 0.95, the inner points of the coarse phi grid only."],
 "A fitted phi is searched from 0.8 to 0.98 inclusive, the defaults `PHI_MIN` and `PHI_MAX`. The box 0 to 1 is alpha's and beta's. Above 0 and at most 1 is the rule for a phi that is given and held fixed. The grid's points run 0.8, 0.85, 0.9, 0.95, 0.98, and the compass search works across the whole range."),

q(2, "Which values of phi may a caller give and have held fixed?",
 "Any number above 0 and at most 1, phi 0.5 included.",
 ["Only 0.8 to 0.98, the fitted range.",
  "Any number from 0 to 1 inclusive, so phi 0 is allowed as well.",
  "Any positive number, since a phi above 1 only steepens the trend."],
 "A given phi may be any number above 0 and at most 1, so phi 0.5 is accepted on EKENE-P1 and held fixed. The range 0.8 to 0.98 applies only when phi is fitted. phi 0 and phi 1.05 are both refused, in one sentence that states both rules."),

q(1, "Which message comes back when a caller gives the damped method phi 1.05?",
 "\"phi must be a number above 0 and at most 1 when given (when fitted it is searched from 0.8 to 0.98)\"",
 ["\"phi applies to 'damped' only: 'holt' is the damped method with phi = 1\", with `phi` as the field.",
  "A fit with phi moved down to 0.98, the top of the fitted range, and a warning attached to the result.",
  "\"phi must be a number from 0 to 1 (inclusive)\", naming `phi`."],
 "The engine refuses a given phi of 0 or of 1.05 with the message in the key, its own words, which state the rule for a given phi and for a fitted one together. The message about holt is the refusal for a phi passed to holt. A refusal returns no fit, so nothing is moved to 0.98, and the inclusive 0 to 1 wording is the alpha and beta rule."),

q(0, "Fitted on EKENE-P4, the damped trend ends at phi 0.800000 with `atBounds` listing phi = 0.8. What does that tell you?",
 "The SSE was still falling at the lower edge: the strongest damping the fit may choose.",
 ["The search failed to converge and returned its starting grid point unchanged.",
  "EKENE-P4 has no trend, so the engine set phi to its default value of 0.8.",
  "Someone gave phi as 0.8, since `atBounds` lists each parameter a caller gives."],
 "`atBounds` lists a fitted parameter that ended exactly on a bound of its box. phi on 0.8 is a fitted value like any other: the SSE was still falling at the edge, so on this noisy well the fit wanted the trend to fade as fast as the box allows. Every fit in this course converged, phi has no default when fitted, and a given parameter is listed in `fixed`, never in `atBounds`."),

q(3, "On EKENE-P1 phi 0.5 is given, and alpha and beta are left out. What does the fit record show?",
 "`fixed` lists phi; `atBounds` lists beta = 1 and leaves the given phi out.",
 ["`atBounds` lists phi = 0.5, since that value lies below the fitted range.",
  "A refusal, since 0.5 lies outside the range 0.8 to 0.98 a phi must keep.",
  "`fixed` lists phi, alpha and beta, since a given phi fixes all three parameters."],
 "A given phi 0.5 is accepted and held, so `fixed` lists it; alpha and beta are fitted around it, to 0.784159 and 1.000000, and the fitted beta on its upper bound appears in `atBounds` as beta = 1. A given parameter is never listed in `atBounds`, 0.8 to 0.98 applies only to a fitted phi, and alpha and beta stayed free."),

q(2, "The damped trend is run with phi 1 given, alpha 0.5 and beta 0.2, on EKENE-P1. What comes back?",
 "Holt's SSE, 29230.297102, and Holt's 12 forecasts, bit for bit.",
 ["A refusal, because a given phi has to lie strictly below 1.",
  "The figures of simple smoothing, since phi 1 switches the trend off.",
  "Figures close to Holt's that part from them in the last decimals."],
 "With phi 1 every phi in the recursion multiplies by 1 and Holt remains: the engine returns the same SSE, 29230.297102, and the same 12 forecasts as Holt at the same alpha and beta, bit for bit. A given phi may be 1. phi 1 keeps the whole trend, and the figures are identical, a stronger claim than close."),

q(1, "A phi is passed with the method 'holt'. Why does the engine refuse it?",
 "Holt is the damped method with phi = 1, so it takes no phi of its own.",
 ["It has no trend, so there is nothing for any phi to damp.",
  "Only a phi from 0.8 to 0.98 is accepted by holt, and the value passed lay outside.",
  "A given phi would block the search, and holt needs phi fitted."],
 "The engine's own words are \"phi applies to 'damped' only: 'holt' is the damped method with phi = 1\". Having no trend to damp is the reason given when phi reaches simple smoothing. Holt accepts no phi at any value, fitted or given."),

q(0, "On EKENE-P5, Holt's straight line is below zero by step 17. What does the damped trend fitted on the same well forecast at step 24?",
 "6.569332 bbl/d, still above zero.",
 ["-0.623541 bbl/d, crossing zero a step behind the Holt line.",
  "0.078646 bbl/d, its last step above zero before it crosses.",
  "7.425050 bbl/d, the rate it holds without change from step 12 on."],
 "The damped trend fitted on EKENE-P5 forecasts 6.569332 bbl/d at step 24, where Holt's line is already below zero. -0.623541 and 0.078646 are Holt's steps 17 and 16. 7.425050 is the damped forecast at step 12; the damped forecast keeps falling toward its limit, so it holds no rate unchanged."),

q(3, "Fitted on EKENE-P2, the damped trend lists `atBounds` alpha = 1, beta = 0. What do those two bounds describe?",
 "A level that jumps to each new rate, and a trend that learns nothing new and only fades by phi.",
 ["A fit that never ran, so the corner of the grid came back with its starting values left unchanged.",
  "The shut-in months were dropped before fitting, leaving alpha and beta undefined on the well.",
  "The caller gave alpha 1 and beta 0, which the engine records in `atBounds` for every fit."],
 "alpha 1 puts all the weight on the newest rate, and beta 0 means the trend takes nothing from the newest change in level, fading only by phi 0.928195 each month. Both are fitted values on a bound, and the fit converged. The shut-in zeros are rates the fit reads, and a given parameter would appear in `fixed`."),

q(1, "Why is a fitted phi held to 0.8 to 0.98?",
 "The range follows FPP3, keeping a fitted damped trend distinct from simple smoothing and from Holt.",
 ["The compass search cannot step below 0.8 without raising a warning about its step size.",
  "Wells never decline with damping weaker than 0.98, a figure taken from decline curve theory.",
  "A phi below 0.8 gives a negative forecast on every declining well in the Ekene field."],
 "The engine follows Forecasting: Principles and Practice (FPP3), which restricts an estimated phi to 0.8 to 0.98: far below, the trend fades so fast the method is close to simple smoothing, and near 1 it is close to Holt. The range sets the search's box and the search works inside it; no decline theory fixes 0.98; and with a negative trend a lower phi leaves the limit a smaller drop below the final level."),

emit(Q, '/root/dai-wip-forecastml/banks/d4b_m04.json', expect_n=15)
finish()
