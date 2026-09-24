import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Professional m04, logistic regression on the stated pay rule.
# Every figure is the course's pay model on the pay split (ten wells, fraction
# 0.3, seed 5: test wells EKENE-3, EKENE-5, EKENE-7), its coefficients,
# deviances and first five test rows, and the engine's own half case. No
# capstone field, well, stated input or graded answer appears.

q(0, "The Ekene pay rule labels a sample PAY = 1 when which condition holds?",
 "PHIC is at least 0.16 and RT is at least 10 ohm.m.",
 ["PHIC is above 0.16 or RT is above 10 ohm.m.",
  "The logistic probability of pay for the row is above 0.5.",
  "RHOB, NPHI and RT all sit on the pay side of their own cutoffs."],
 "The rule is stated: PAY = 1 when PHIC is at least 0.16 and RT is at least 10 ohm.m, otherwise 0, and 94 of the 300 samples are pay. Both halves must hold, both inequalities include the cutoff, the label comes from the rule before any model is fitted, and RHOB and NPHI have no cutoffs in it.")

q(2, "A sample reads PHIC exactly 0.16 and RT exactly 10 ohm.m. What is its PAY label?",
 "1, because both halves of the rule say at least.",
 ["0, as both values must sit strictly above.",
  "0, since a boundary goes to class 0 as the threshold at one half does.",
  "Undefined; the engine refuses such a row."],
 "At least includes the cutoff, so a PHIC of exactly 0.16 and an RT of exactly 10 ohm.m both qualify and the label is 1. A rule written with above would label different rows. The class-0 rule at exactly 0.5 belongs to `predict` and says nothing about how the label was made, and a label on a cutoff is an ordinary label.")

q(1, "Which inputs does the logistic pay model see, and which input of the rule does it never see?",
 "RHOB, NPHI and RT; the rule's PHIC is withheld from it.",
 ["PHIC and RT, the rule's own two inputs.",
  "GR, RHOB and NPHI, the same three logs the sonic model is fitted on.",
  "Every channel, PHIC included."],
 "The rule reads PHIC, a core calibrated porosity, and PHIC is not a feature: the model sees RHOB, NPHI and RT and must learn the label from them. RT enters both the rule and the features, so the resistivity half is visible to the model, while the porosity half has to be read through density and neutron. GR is a sonic-model feature and plays no part here.")

q(3, "At the same fraction 0.3 and seed 5, the pay split holds out EKENE-3, EKENE-5 and EKENE-7 while the sonic split held out EKENE-4, EKENE-5 and EKENE-8. Why?",
 "The pay split draws from all ten wells, EKENE-6 included, so the shuffle differs.",
 ["The pay split is run at seed 6, the seed after the one the sonic split used.",
  "It balances pay rows across the test wells, and that moves the draw of wells.",
  "EKENE-6 has no sonic, so it is held out of the pay training rows every time."],
 "Every one of the ten wells carries a PAY label, EKENE-6 among them, so the pay split shuffles ten names where the sonic split shuffled nine, and the same fraction and seed give a different draw. The seed is 5 for both, the engine has no stratified split, and EKENE-6 is one of the seven training wells.")

q(2, "How many of the pay split's 210 training rows are pay?",
 "70",
 ["94",
  "24",
  "66"],
 "Of the 210 training rows, 70 are pay. 94 is the pay count over all 300 samples, 24 is the pay count on the 90 test rows, and 66 is the count of non-pay test rows.")

q(0, "The RT coefficient is 0.241141 log odds per ohm.m. What does one more ohm.m do to the odds of pay, holding RHOB and NPHI fixed?",
 "It multiplies them by exp(0.241141), which is 1.272700.",
 ["It adds 0.241141 to the probability of pay.",
  "It multiplies the probability of pay by 1.272700 on every row.",
  "It adds 1.272700 to the log odds of pay for each extra ohm.m."],
 "A logistic coefficient adds to the log odds, so it multiplies the odds by its exponential: exp(0.241141) = 1.272700. Odds multiply and probabilities do not, since the same step moves a row near one half a lot and a row near 0 or 1 hardly at all. The step added to the log odds is 0.241141 itself.")

q(1, "The RHOB coefficient is -10.716404 log odds per g/cm3. What is it per 0.01 g/cm3?",
 "-0.107164 log odds",
 ["-10.716404, since a log odds figure carries no unit to rescale",
  "-1.979331, which is the coefficient over its standard error",
  "-0.640305, the NPHI coefficient taken over its standard error"],
 "A coefficient carries the log odds per unit of its feature, and a whole g/cm3 is larger than the spread of density on these wells, so per 0.01 g/cm3 it is a hundredth: -0.107164. -1.979331 is RHOB's coefficient over its standard error and -0.640305 NPHI's, and the per-unit figure changes with the unit it is read in.")

q(3, "Which coefficient of the fitted pay model sits the most standard errors from zero?",
 "RT, at 6.212972.",
 ["RHOB, at -1.979331 standard errors.",
  "The intercept, at 1.580826 of its standard errors.",
  "NPHI, whose ratio of -0.640305 is the smallest in size."],
 "Coefficient over standard error reads 1.580826 for the intercept, -1.979331 for RHOB, -0.640305 for NPHI and 6.212972 for RT, so RT is the clearest of the four by a wide margin and NPHI the least clear.")

q(0, "NPHI's coefficient is -9.876360 log odds per v/v with a standard error of 15.424455. What do the training rows say about it?",
 "They do not pin down even its sign once RHOB and RT are in the model.",
 ["Neutron porosity lowers the odds of pay, a firm finding at -0.640305 standard errors.",
  "The model leans on NPHI most, as its standard error is largest.",
  "Its coefficient is really zero once its error is counted."],
 "At -0.640305 standard errors from zero, the NPHI coefficient's sign is not settled by these rows. A large standard error marks a coefficient the rows pin down poorly, which is the opposite of leaning on it, and the engine prints the fitted value as it is. The standard errors also assume independent rows, and rows of one well are not.")

q(1, "The pay model's deviance falls from 267.335951 to 49.014054 when the three features are added. What are these two figures?",
 "The intercept-only deviance and the fitted model's, each -2 x log likelihood.",
 ["Training and test deviance, the second scored on the three test wells.",
  "The log likelihood before and after the fit, both in natural log units.",
  "Sums of squared residuals of the 0 and 1 labels, before and after the features."],
 "The deviance is -2 times the log likelihood: 49.014054 for the fit with RHOB, NPHI and RT, whose log likelihood is -24.507027, and 267.335951 for the intercept-only model (`nullDeviance`). Both are on the 210 training rows, and a logistic fit maximises the log likelihood, so it reports no sum of squared residuals.")

q(2, "Row 61 of EKENE-3 reads RT 27.700000 ohm.m and gets a probability of pay of 0.817561, and its PAY is 0. What happened?",
 "The rule's porosity half failed there, and the model sees porosity only through density and neutron.",
 ["The engine mislabelled the row, because an RT above 10 ohm.m makes every sample pay by the rule.",
  "It is a training row, since the model was fitted on EKENE-3, so its probability says nothing.",
  "The row was clipped to class 0 because its resistivity lies outside the range the model saw."],
 "The label needs PHIC at least 0.16 as well as RT at least 10 ohm.m, and PHIC is not a feature, so a row with high resistivity and low core porosity can fool the model. At 0.817561 the row is called pay and is a false positive. EKENE-3 is a test well, and `predict` clips nothing.")

q(3, "`predict` returns a probability of exactly 0.500000 for a logistic row. Which class does it assign?",
 "Class 0, since class 1 needs a probability above 0.5.",
 ["Class 1, because the threshold is at or above 0.5.",
  "It refuses a row that sits exactly on the threshold.",
  "Either class at random, drawn with the call's seed."],
 "The basis reads, in the engine's own words, \"class 1 when the probability is above 0.5, class 0 at exactly 0.5\", and the engine's own half case returns 0.500000 and class 0. At or above belongs to `rocCurve`, `predict` refuses nothing here, and it draws nothing at random.")

q(0, "A training set passed to `logistic` holds one class only. What does the engine return?",
 "A refusal naming `y`: \"y must contain both classes, 0 and 1\".",
 ["A fit whose intercept runs off toward infinity, returned with a warning.",
  "Coefficients of zero, with a probability of 1 on every row of that class.",
  "A fit on the single class, each probability its share."],
 "Logistic regression needs both classes in the training labels, and the engine refuses by name, in its own words: \"y must contain both classes, 0 and 1\". A refusal returns no fit, no warning and no probabilities.")

q(2, "Row 60 of EKENE-3 gets a probability of pay of 0.068312. What is the sign of its log odds eta, and why?",
 "Negative, because p = 1 / (1 + exp(-eta)) sits below one half only when eta is below zero.",
 ["Positive, because every probability the engine returns is a positive number.",
  "Zero, since the row's PAY label is 0 and eta records the label it was given.",
  "No sign can be read, since `predict` discards eta once it has the class."],
 "At eta = 0 the probability is exactly one half; below zero it sinks toward 0 and above zero it climbs toward 1. A probability of 0.068312 therefore has a negative eta, which is ln(p / (1 - p)). A probability is positive whatever the sign of eta, eta is computed from the features and never from the label, and the sign follows from the probability.")

q(1, "RHOB and NPHI correlate at -0.563498 over the 210 training rows. What does that say about each coefficient that holds the other fixed?",
 "It describes a direction these rows rarely take, so its standard error grows.",
 ["The pair take opposite signs, one cancelling the other, since the logs move together.",
  "Each is exact, because correlation touches least squares and never logistic fits.",
  "The engine drops one of the pair once their correlation passes one half."],
 "Holding RHOB fixed while NPHI moves asks about a direction the rows seldom take, since the two move together (-0.563498 over the training rows, -0.405407 over the 70 pay rows among them), and the standard errors show the cost. Both coefficients here are negative, so neither cancels the other; correlation affects any fit that holds a feature fixed, logistic included; and the engine drops no feature.")

emit(Q, '/root/wt-dai-d2-nextgen/tools/course-banks/mlcore/intermediate/d2i_m04.json', expect_n=15)
finish()
