import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D4 Associate m06, one well forecast end to end.
# Sources: the course digest's Associate workflow on EKENE-P4 and the list a
# write-up names, the NIST/SEMATECH e-Handbook check, the fitted parameters of
# EKENE-P1 used as worked twins in the capstone brief lesson, and the vocabulary
# table. Every figure is printed there; no capstone figure is used.

q(3, "In what order does the Associate workflow run on one well?",
 "Read the series, fit every method, compare by MSE, then report the forecast.",
 ["Pick the method with the flattest forecast, fit it, then read the series for gaps.",
  "Fit only the damped trend, since it always scores best, and report its SSE.",
  "Compare the methods by SSE first, then fit whichever one scored the lowest."],
 "The workflow reads the series first, so a missing month is caught before any fit, then fits each method with every parameter free, compares by MSE because the methods score different numbers of errors, and reports with the method, parameters, months and h. No method always scores best, and there is no SSE to compare until the methods have been fitted."),

q(0, "All three methods are fitted on EKENE-P4 with every parameter free. Which has the lowest in-sample MSE?",
 "damped, at 4502.618003.",
 ["ses, at 4585.145790, the lowest of the three once the SSE is divided.",
  "holt, at 6048.241985, since a straight trend follows any decline best.",
  "ses, since its SSE of 215501.852140 is spread over one more error."],
 "By MSE the damped trend is lowest at 4502.618003, ses next at 4585.145790 and holt highest at 6048.241985. On this noisy well a full straight trend chases noise. Dividing ses's SSE by its 47 errors gives 4585.145790, still above the damped MSE."),

q(2, "What does the lowest in-sample MSE on EKENE-P4 tell the forecaster?",
 "Which method best followed months the fit had already seen, and nothing yet about months to come.",
 ["Which method will forecast the next twelve months of EKENE-P4 with the smallest error.",
  "That the damped forecast at step 12, 239.235397, is the rate EKENE-P4 will produce.",
  "That the other two methods are wrong for this well and can be dropped from any report."],
 "An in-sample MSE scores one-step forecasts over months the fit had already seen, with parameters chosen on those months. Whether a method forecasts months it has not seen is a separate question, answered by scoring forecasts on months held back, which is the Professional tier's work. Until then the ranking is a statement about the history."),

q(1, "On EKENE-P4 the three fitted methods give step 12 forecasts of 241.813456, 172.008815 and 239.235397. Which is Holt's?",
 "172.008815, the one that falls by its final trend at every step.",
 ["241.813456, which is also Holt's step 1 forecast on the same fit.",
  "239.235397, which stays close to its step 1 figure of 244.373345.",
  "None of them, since Holt is fitted here without a trend."],
 "Holt's straight line falls from 236.028094 at step 1 to 172.008815 at step 12. 241.813456 at both steps is the flat ses forecast. 239.235397, beside 244.373345 at step 1, is the damped trend with phi on 0.8, fading fast. Holt always carries a trend, here fitted with beta 0.354191."),

q(3, "A write-up of an Associate forecast ends with a line about its numbers. What does that line say?",
 "That they are in-sample until the forecast is tested on months the fit never saw.",
 ["That they are accurate, since every fit converged with `converged` true.",
  "That the method with the lowest MSE has been proved the right one for the well.",
  "Nothing about testing, because a converged fit needs no further test."],
 "The write-up names the well and months, the method, each parameter fitted or given with any bound, `scoredFrom` and the MSE, h, and that the numbers are in-sample until tested. `converged` is a statement about the search, never about forecasting, and a lowest in-sample MSE proves nothing about months to come."),

q(2, "How should a write-up report the phi of the damped trend fitted on EKENE-P4?",
 "As phi 0.800000, fitted, on its lower bound.",
 ["Phi 0.8, given by the forecaster to damp the trend.",
  "Only as 0.800000, since a bound is a detail only of the optimiser.",
  "As phi 0.98, the far edge the search was heading toward."],
 "The phi was fitted and ended on the lower bound 0.8, which `atBounds` lists, and the write-up says so beside the value so a reader knows the fit ran out of room. Nothing was given, so calling it a choice misleads. The fit ran toward the lower edge, 0.8, where the damping is strongest."),

q(1, "Why does the engine reproduce the NIST handbook's figures on its 12-point series at alpha 0.1?",
 "The handbook uses the same start, l_1 = y_1, and the same MSE divisor, the scored errors.",
 ["Any recursion rounds to the handbook's printed figures, whatever start it happens to use.",
  "The handbook fits alpha by the same grid and compass search that this engine runs.",
  "Both divide the MSE by 12, the number of points in the handbook's short series."],
 "The first NIST case starts the level at the first observation and divides the MSE by the scored errors, as this engine does; same start, same divisor, same recursion, so the figures agree. A different start moves the early fitted values and the MSE. Alpha 0.1 is given in that case, so no search runs, and the divisor is the scored errors, which excludes the first point."),

q(0, "The handbook prints an MSE of 19.0 where the engine gives 18.983492. How do the two compare?",
 "They agree at the one decimal the handbook prints, which is all it claims.",
 ["No: the engine's lower figure shows its start differs from the handbook's own start.",
  "Only once alpha is refitted do they agree.",
  "They disagree, because the handbook divides by 11 while the engine divides by 12."],
 "A published check compares to the printed precision and never beyond it: 18.983492 rounds to 19.0 at one decimal. The start is the same, l_1 = y_1, alpha 0.1 is given in that case, and the engine's divisor is the scored errors, the same as the handbook's."),

q(3, "In the handbook's double smoothing example the engine fits alpha 0.362309 and a trend weight of 1.000000. What does the golden give the engine so that it matches?",
 "The handbook's own start for the trend, b_1 = 0.8, given as `initialTrend`.",
 ["phi 0.8 given, which damps the handbook's trend until the two sets of figures agree.",
  "Nothing extra: the start b_1 = y_2 - y_1 is the handbook's own start for the trend as well.",
  "beta given as 1, since a fitted beta never reaches its upper bound."],
 "The handbook uses its own start for the trend, b_1 = 0.8, and the golden gives it to the engine as `initialTrend`; to reproduce another tool, match its start first. The fitted beta ends on its upper bound and `atBounds` lists beta = 1, so it was fitted. No phi is involved in Holt's method."),

q(2, "What does the engine's agreement with the NIST handbook establish?",
 "That the recursion, the start and the MSE divisor mean what the published literature means.",
 ["Future months will bear out the engine's forecasts of the Ekene wells, it shows.",
  "The course's own oracle is no longer needed to check the engine's arithmetic.",
  "That the grid and compass search find the least SSE on every series in every box."],
 "A handbook written by other people for other purposes is unlikely to share a misunderstanding with the engine, so agreement checks the arithmetic, the start and the divisor, and on the two fitted cases the search's answer on a short series. It says nothing about forecasting skill, it adds to the oracle's check without replacing it, and it covers only the handbook's cases."),

q(1, "A task asks for the MSE of a Holt fit on a 48-month series with alpha and beta given. What does the SSE get divided by?",
 "46, the scored errors, since Holt spends month 1 on the start.",
 ["48, the months in the series, month 0 included.",
  "47, the scored errors of simple smoothing on the same 48 months of rates.",
  "12, the number of steps a forecast usually covers."],
 "The MSE divides the SSE by the scored errors only, and Holt's `scoredFrom` is 2, so 48 months give 46 errors; on EKENE-P1 at alpha 0.5 and beta 0.2 that is 29230.297102 over 46, 635.441241. Dividing by the months gives a different, wrong figure, 47 is simple smoothing's count, and the forecast steps are never scored in-sample."),

q(0, "A task asks for Holt's fitted beta on EKENE-P1. Which figure answers it?",
 "0.381513, fitted with alpha left free as well.",
 ["0.2, the beta given beside alpha 0.5 in the teaching fit.",
  "0.353869, the beta the damped trend fits on the same well.",
  "1.000000, the beta fitted when phi 0.5 is given to damped."],
 "Holt fitted on EKENE-P1 with both parameters free ends at alpha 0.661937 and beta 0.381513. 0.2 is a given value, which answers a different question. 0.353869 is the damped fit's beta, and 1.000000 is the beta fitted around a given phi 0.5 on the damped method."),

q(3, "A forecast note says the damped forecast of EKENE-P4 is accurate. What does the course's vocabulary require of that word?",
 "A named metric on named months; at this tier, the in-sample MSE over the scored months.",
 ["Nothing more, since the word is plain English and every reader takes it the same way.",
  "A figure within 10 percent of the last month's rate, the test the course applies.",
  "The fitted phi, since accuracy in this course is the amount of damping chosen."],
 "Accuracy in this course names its metric and its months; at the Associate tier the only metric is the in-sample MSE over the scored months of the fit. The course sets no percentage test, and phi is a parameter of the method, never a measure of how well it fits."),

q(2, "Which phrase uses the word forecast as the course legislates it?",
 "\"damped, step 12, 239.235397\", a point forecast named with its method.",
 ["\"Holt's forecast for month 2, 1130.700000\", a value from inside the series.",
  "\"the forecast of the field\", with no method attached.",
  "\"a forecast of about 240\", rounded."],
 "A forecast is the point forecast of one fitted method, named with its method; a one-step forecast inside the series is a fitted value, so Holt's 1130.700000 for month 2 is a fitted value. A forecast with no method cannot be checked, and a rounded figure with no method, well or step is not one the engine returned."),

q(1, "In a damped fit on EKENE-P3, the forecaster gave phi 0.9. What does the write-up do about it?",
 "Says phi was given and why, as the engine's `fixed` list records it.",
 ["Reports phi as fitted, since the other two parameters of the method were fitted.",
  "Leaves phi out, since a given value is not a result of the fit and needs no line.",
  "Reports it in `atBounds`, since 0.9 lies inside the fitted range."],
 "A given parameter is a judgement, and the write-up says it was given and why; the engine lists every given parameter in `fixed`. Calling it fitted misreports the work, leaving it out makes the forecast impossible to reproduce, and `atBounds` lists only fitted parameters on an edge of the box."),

emit(Q, '/root/dai-wip-forecastml/banks/d4b_m06.json', expect_n=15)
finish()
