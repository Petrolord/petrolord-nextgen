import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Expert final exam, 42 questions across the six Expert modules, with the
# lower tiers' refusals and conventions recalled where an Expert reading needs
# them. Questions marked CROSS need two modules at once. Every figure is
# printed in the digest (sections 1 to 26); none is derived here beyond the
# arithmetic the digest itself prints.

# --- conditioning and the NIST problems (m01) ---
q(2, "The logs and the four well-level attributes, with an intercept, on all 270 sonic rows read a raw condition number of 473051.317118 and a scaled one of 3694.131550. What does least squares do at the default limit?",
 "It fits the design, since the scaled figure is far below 1.00e+8 and the raw figure plays no part in the rule",
 ["It refuses the design, since the raw figure is above the limit once the column of ones is counted in the design",
  "It fits the design with a warning, since the raw figure is large enough to cost digits in the fitted coefficients",
  "Refusal comes first and the engine then retries after centring, which brings the design below the refusal limit"],
 "The refusal compares `scaledConditionNumber`, the design with unit-length columns, with maxCondition, 1.00e+8 by default. The raw figure mixes units and decides nothing. This design is fitted at the default limit, and the engine never centres a design on the caller's behalf; the refusal message names centring as the caller's remedy.")

q(0, "Longley's scaled condition number is 43275.043587. What does least squares return at maxCondition 43000, and at 44000?",
 "A refusal at 43000 and a fit at 44000, since only a figure strictly above the limit is refused",
 ["A fit at both, since each limit is far below the default of 1.00e+8 and the default is what the rule reads",
  "A refusal at both, as Longley is a higher difficulty problem and the engine refuses it below the default",
  "A fit at 43000 with a warning, and a clean fit at 44000, the warning marking the design's closeness to the limit"],
 "The goldens bracket the limit: `ols-longley-below-limit` at 43000 is refused and `ols-longley-limit-44000` at 44000 is fitted. The rule reads the maxCondition passed, and the default applies only when none is given. At 44000 Longley is fitted, with a coefficient LRE of 14.62.")

q(3, "At Filip's scaled condition number, kappa^2 x machine epsilon is 6.02e+3. What does that figure say?",
 "The worst-case error bound is far above the size of the coefficient, so some coefficients could carry no reliable digit",
 ["Filip's fit carries 6.02e+3 correct digits, far more than float64 can print for any of its 11 coefficients",
  "It sits below the limit of 1.00e+8, so Filip is fitted at the default and its coefficients can be trusted",
  "It is Filip's LRE, the count of significant digits by which the engine's value and the certified value agree"],
 "Filip's 5.21e+9 squared, times 2.22e-16, gives 6.02e+3: a worst-case relative error thousands of times the coefficient. The refusal rule compares kappa with 1.00e+8, and Filip is refused at the default. The figure is a bound on relative error, so it counts no digits; raised knowingly to 1.00e+10, Filip is fitted with a smallest coefficient LRE of 7.66.")

q(1, "A caller passes maxCondition 0.5 to least squares. What comes back?",
 "A refusal naming `maxCondition`, in the engine's words: maxCondition must be a finite number, 1 or more",
 ["A refusal naming `X`, the message for a design whose scaled condition number is above maxCondition",
  "A fit, since every design has a scaled condition number of at least 1 and so the limit is simply never met",
  "A fit at the default limit of 1.00e+8, the value the engine puts in place of any limit it cannot use"],
 "The limit itself is refused by name: \"maxCondition must be a finite number, 1 or more\", and the field named is `maxCondition`. A refusal never substitutes a default for a bad input. A limit below 1 would refuse every design, since a condition number is at least 1, and NoInt1 reads exactly 1.000000.")

# CROSS m01 + m06
q(2, "Another tool fits the design with a column exactly twice NPHI and prints its coefficients with a warning. Why does this engine refuse the same design at the default?",
 "Above 1.00e+8 some coefficients could carry no reliable digits, and the engine declines to print numbers it cannot vouch for",
 ["The copied column makes the design singular, and a singular design is the only case a least squares fit refuses",
  "The engine warns as the other tool does, and the course calls the warning a refusal since no coefficient is used",
  "Two columns that share one name are refused by name before the engine computes any condition number at all"],
 "The convention table sets the engine's OLS refusal, a scaled condition number above 1.00e+8, against the alternative \"fit anything and warn\", and gives the reason: at 1.00e+8 the worst-case bound reaches the coefficient itself. The doubled column reads 6.22e+16. The refusal is about conditioning: the doubled column is an exact copy, and the engine's rule refuses where the alternative warns.")

q(0, "To how many significant digits does the engine reach Longley's certified coefficients?",
 "At least 14 on every coefficient: the smallest coefficient LRE is 14.62",
 ["Exactly 7, one digit for each of the 7 coefficients that Longley's design carries",
  "At most 5, since its scaled condition number is 43275.043587 and the digits lost follow from it",
  "All 16 on every coefficient, since the engine and the certified values agree in float"],
 "LRE is minus log10 of the relative error, so an LRE of 14.62 on the worst coefficient means at least the first fourteen significant digits agree. A condition number bounds the loss in the worst case and does not set the digits reached. An LRE capped at 16 marks an identical float, and Longley's certified R-squared is reached to 15.48.")

# CROSS m01 + m02
q(3, "The ill-conditioning refusal and the separation refusal each name a field. Which?",
 "The conditioning refusal names `X`, the design; the separation refusal names `y`, the labels",
 ["Both name `y`, since in each case the target is what the engine cannot fit with the given design",
  "Both name `X`, since in each case a column of the design is the cause that the remedy removes",
  "The conditioning refusal names `maxCondition` and the separation refusal names `l2`, the inputs to raise"],
 "Every refusal names the input it refused and its message starts with that name: \"X is too ill-conditioned for a float64 least squares fit\" and \"y is completely separated by a linear combination of the features\". `maxCondition` is named only when the limit itself is invalid, and l2 appears in the separation message as a remedy.")

# --- separation (m02) ---
# CROSS m02 + m03
q(1, "Two logistic fits go wrong: one on labels a threshold splits exactly, at l2 0, and one on the pay model stopped at maxIter 3. What does each return?",
 "The first is refused before any Newton step; the second returns its result with converged false and a warning",
 ["Both return results with warnings, since logistic regression refuses only an input it cannot read at all",
  "Both are refused by name, since neither fit reaches a converged maximum of the log likelihood it maximises",
  "The first returns huge coefficients with a warning; the second is refused because it did not converge"],
 "Separation is decided before iterating, and at l2 0 it is refused: there is no iterate and no warning. A fit that stops before it converges is a result, converged false with a warning such as \"did not converge in 3 updates\", and never a refusal. Watching coefficients grow is the alternative the engine declined.")

q(2, "Logistic regression is passed only the 94 pay samples, every label 1. What does the engine return?",
 "A refusal naming `y`: y must contain both classes, 0 and 1",
 ["The complete separation refusal, since every row lies on the pay side of any hyperplane",
  "A fit whose intercept grows without limit, stopped at maxIter 100 with a warning",
  "A fit with every probability at 1.000000 and a log loss of 0 on the rows passed"],
 "A label with one class is refused by name: \"y must contain both classes, 0 and 1\". Separation needs both classes on their own sides of a hyperplane. No fit is returned, so there is no probability or log loss to read. 94 of the 300 Ekene samples are pay under the stated rule.")

# CROSS m02 + m06
q(0, "Another tool runs Newton steps on PHIC for the high-RT rows and reports a very large coefficient with a warning. What does this engine do with the same rows at l2 0, and why?",
 "It decides separation exactly with two linear programmes before iterating and refuses, since no finite answer exists to print",
 ["It iterates as the other tool does and stops when the coefficient passes a size cutoff stated in its basis",
  "It fits a finite coefficient, since the Newton step halving keeps the coefficient from growing past its limit",
  "Refusal comes only after maxIter updates, once the growth in the coefficient shows the labels are separated"],
 "The convention table sets the engine's choice, decided exactly by two linear programmes before iterating and refused at l2 = 0, against the alternative \"iterate and watch the coefficients grow\". The reason given: a separated maximum likelihood fit has no finite answer to print. The engine's check involves no size cutoff, and halving only guards against a step that lowers the log likelihood.")

q(3, "With l2 = 1 on the 106 high-RT rows the fit reports an intercept of 1.881712 and a PHIC coefficient of 0.817700. Which of the two does the penalty act on?",
 "PHIC's coefficient only: the penalty sums b_j^2 over the coefficients other than the intercept",
 ["Both of them, each by the same (l2 / 2) x b^2 term, so the intercept shrinks toward zero as well",
  "The intercept only, since shrinking it toward the mean label is what makes the separated fit finite",
  "Neither of them, since at l2 = 1 the penalty is too weak to move a coefficient on separated rows"],
 "The penalty is (l2 / 2) x sum b_j^2 on the non-intercept coefficients, and it makes the objective bounded, so the fit is finite: 6 iterations, converged true. The coefficient is then set by the penalty rather than by the data. At l2 = 0.1 the PHIC coefficient is 6.814258, so the penalty moves it a long way.")

q(1, "Which call finds the Ekene field's planted pay rule as a structure, and how?",
 "Logistic regression on PHIC alone over the rows with RT at or above 10 ohm.m, refused as completely separated",
 ["Logistic regression on RHOB, NPHI and RT over the 210 training rows, which reports its separation as none",
  "Permutation importance on the pay model by AUC, which ranks RT first at a mean drop of 0.398232",
  "A group split of the ten wells at seed 5, which puts EKENE-3, EKENE-5 and EKENE-7 on the test side"],
 "The planted structure table names the method that finds each item, and for the pay label it is logistic on PHIC alone, rows with RT at or above the cutoff: completely separated. The pay model on RHOB, NPHI and RT reports none, with the Stiemke certificate. An importance ranks features for one fitted model, and a split only chooses rows.")

# --- convergence (m03) ---
q(0, "The pay model on all 300 rows, stopped at maxIter 3, returns an NPHI coefficient of -5.491841. The same call at tol 1.00e-3 returns it unchanged. Why?",
 "The fit stops by maxIter at the third Newton iterate, so the tol never comes into it",
 ["A tol of 1.00e-3 is looser than the default, so the fit converged at the third step either way",
  "The engine reads tol only when maxIter is at its default of 100 updates",
  "Both calls converged at iteration 3, the point where the full Newton step fell below 1.00e-3"],
 "The value is the third Newton iterate, converged false: it stops by maxIter, and the same call at tol 1.00e-3 returns it unchanged. A converged fit would report converged true, and this one reports false. tol is read whatever maxIter is: the maxIter 3 warning on the Ekene pay fit compares its last step with tol 1e-10.")

q(3, "With l2 = 1 on the 106 high-RT rows, the PHIC fit converges in 6 iterations. Which rule decided that it had converged?",
 "The one every logistic fit uses: the largest component of the full Newton step at most tol, 1.00e-10 by default",
 ["A rule kept for penalised fits alone, which stops once the penalty term changes by less than l2 between steps",
  "A fixed count of 6 iterations that the engine sets from l2, since a penalised fit has no step to measure",
  "The separation check, which turns feasible once the penalty is large enough and so ends the Newton iteration"],
 "A penalised fit runs the same Newton-Raphson iteration from beta = 0 and meets the same stated rule: stop when the largest absolute component of the full step is at most tol, in coefficient units, or after maxIter updates. The separation test runs once, before any iteration, and at l2 = 1 the result still reports `separation.type` complete. The penalty makes the objective bounded; it sets no iteration count.")
q(2, "Which defaults govern a logistic fit when none is passed?",
 "tol 1.00e-10 on the full step, at most 100 updates and at most 30 halvings of a step",
 ["tol 1.00e-15 on the full step, the same constant as the log loss clip, and 100 updates",
  "tol 1.00e-9 on the relative change in log likelihood, 100 updates and 30 halvings",
  "tol 1.00e-10 on the log likelihood, at most 30 updates and 100 halvings of a step"],
 "The exported DEFAULTS read LOGISTIC_TOL 1.00e-10, the largest full Newton step in coefficient units, LOGISTIC_MAX_ITER 100 and STEP_HALVINGS 30. 1.00e-15 is LOG_LOSS_EPS, and 1.00e-9 is WHOLE_TOL, the test size rule. The stopping rule reads coefficient units, and the log likelihood decides only whether a step is halved.")

q(1, "The pay fit's last four steps read 0.097613, 0.000448, 9.80e-9 and 1.14e-13. What does the course say produces that pattern?",
 "Near the solution Newton's method roughly squares the error each step, so the steps collapse",
 ["Step halving, which cuts each step in half repeatedly as the fit approaches its answer",
  "The penalty, which grows with each iteration and damps the coefficients toward zero",
  "A shrinking tol, which the engine tightens by a factor at each iteration it takes"],
 "The course reads the collapse over the last few iterations as Newton's method roughly squaring the error near the solution. The pay fit halved 0 times, its l2 is 0, and tol stays at 1.00e-10 throughout. Convergence is judged on the full step before any halving, so a halving cannot shape the steps the trace prints.")

q(3, "The converged pay fit reports a log likelihood of -24.507027. Which deviances does it report beside it?",
 "49.014054, which is -2 x the log likelihood, against 267.335951 for the intercept-only model",
 ["24.507027, the log likelihood with its sign changed, against 49.014054 for the intercept-only model",
  "267.335951 for the three features, and 49.014054 for the model that carries the intercept alone",
  "46.305377, from the first Newton step, since the deviance is read before the fit begins to iterate"],
 "Deviance is -2 x log likelihood: 49.014054 for the fit with RHOB, NPHI and RT, and `nullDeviance` 267.335951 for the intercept-only model. The deviance fell from 267.335951 to 49.014054 with the three features, so the fit with features has the smaller figure. -46.305377 is the log likelihood after the first step, part of the trace.")

q(0, "A caller passes tol 0 to logistic regression, hoping to force an exact solution. What comes back?",
 "A refusal naming `tol`: tol must be a finite number above zero",
 ["A fit that runs all 100 updates and warns, since no step can ever reach zero",
  "A fit at the default tol of 1.00e-10, which the engine uses in place of zero",
  "An exact fit, since Newton's method reaches a step of zero at the solution"],
 "A tolerance of zero is refused by name: \"tol must be a finite number above zero\". The engine never swaps in a default for an invalid input. The rule is inclusive, at most tol, so a zero tol would ask for a full step of exactly zero.")

# --- importance and learning curves (m04) ---
q(2, "The learning curve's lowest test RMSE, 4.205658, comes at five training wells, and the sixth well raises it. What does the course read from that?",
 "The curve follows one stated order of wells, the shuffle's, and a well with a large offset moves it wherever it joins",
 ["Five wells is the right training size for this model, as the test error is lowest there and any more wells only add noise",
  "The sixth well carries bad data, since adding a correct well to a fit can only lower the test error on the other wells",
  "Test RMSE and training RMSE have swapped places at the sixth well, which marks the point where the model overfits"],
 "The test RMSE does not fall at every added well: the order of the wells is the shuffle's, and a well with a large offset added early or late moves the curve. The curve is one order on one set of test wells, so its lowest point picks out no general best size. At six wells the training RMSE is 5.758010 and the test 4.282693, and the test was already below the training at five.")

q(1, "What does a learning curve that is flat over its last points say?",
 "More wells are unlikely to help: the features, the model or the well-to-well offsets now set the error",
 ["The model has converged, as the Newton steps have fallen below tol on the last wells added to the fit",
  "Every added well is a copy of the ones before it, so the curve should be recut in rows",
  "The seed was unlucky, so the curve should be redrawn at the next seed until it falls again"],
 "The course reads a curve still falling at the last point as saying more wells would help, and a flat one as saying the features, the model, or the well-to-well offsets now set the error. The curve here is least squares, which has no Newton steps. Sizes are counted in wells because rows of one well are not independent, and choosing a seed by its result is no reading of the curve.")

q(3, "Permutation importance is asked for AUC on the least squares sonic model. What does the engine return?",
 "A refusal naming `metric`: metric auc is a classification metric and the model is ols",
 ["The AUC drops of each feature, since any model's predictions can be ranked by the order of their scores",
  "The RMSE drops instead, since the engine picks the metric that suits the model it is given",
  "A drop of 0 for every feature, since AUC cannot move when the model is a regression"],
 "The metric must suit the model, and the engine refuses the mismatch by name: \"metric auc is a classification metric and the model is ols\". METRICS lists auc as a classification metric. A refusal never substitutes another metric, and no drops are computed at all.")

q(0, "`learningCurve` is passed training well counts [3, 2, 4]. What comes back?",
 "A refusal naming `trainGroupCounts[1]`: it must be larger than the count before it",
 ["A curve at 2, 3 and 4 wells, since the engine sorts the counts before fitting each size",
  "A curve at 3, 2 and 4 wells, drawn in the order the caller passed the counts in",
  "A refusal naming `trainGroupCounts`, since a curve must start at one training well"],
 "The counts must rise, and the second one does not: \"trainGroupCounts[1] must be larger than the count before it\". The field names the first entry that breaks the rule. The engine does not reorder a caller's input, and nothing in the rule requires a curve to start at one well.")

q(2, "On the pay model scored by AUC, how do RHOB and NPHI rank, and how firmly?",
 "RHOB second at a mean drop of 0.019823, SD 0.009850, and NPHI last at 0.001263, SD 0.001056",
 ["NPHI second, since its logistic coefficient, -9.876360, is the largest in size after the intercept",
  "RHOB and NPHI tie, as both drops print below the SD of RT, 0.015727, and so cannot be ranked",
  "NPHI first, since a drop of AUC is permuted less baseline and so the smallest drop matters most"],
 "The ranking is RT, RHOB, NPHI by mean drop, with RT at 0.398232. RHOB's 0.019823 sits above its SD over the repeats, 0.009850, and NPHI's 0.001263 is close to its own SD, 0.001056. A coefficient's size depends on the feature's unit, the drop for AUC is baseline less permuted, and a ranking is read from the means themselves.")

# CROSS m04 + m05
q(3, "Two pieces of evidence speak against CALI: its mean permutation drop of -0.031931 us/ft, and the k-fold mean rising from 5.826789 to 5.851480 when it is added. How do they differ?",
 "The drop shuffles CALI in one fitted OLS model on the teaching split's test wells; the k-fold refits with and without it on unseen wells",
 ["They are the same measurement, since both score the three logs with CALI on the same three test wells at seed 5",
  "The drop is measured on the training rows, and the k-fold on the test wells, so only the k-fold is out of sample",
  "The k-fold figure is the importance of CALI in ridge, and the drop is its importance in least squares, one metric"],
 "Permutation importance shuffles a feature in a fitted model without refitting, here OLS on GR, RHOB, NPHI and CALI scored on the 90 test rows at seed 5 with 5 repeats. The k-fold comparison fits ridge with and without CALI on every fold, k 3 and seed 5, and scores the wells each fold held out. Both are out of sample; they answer different questions.")

# --- missing-log prediction (m05) ---
q(1, "EKENE-6's first row, at 8092 ft with GR 92.370000, RHOB 2.420000 and NPHI 0.270000, is predicted at 117.793533 us/ft. Which fit produced it?",
 "The step 2 fit: ridge at lambda 10 on every well that carries a DT, all 270 sonic rows",
 ["Least squares on the teaching split's 180 training rows, coefficients -0.552686, 0.288005, 22.499915 and 138.783590",
  "Ridge at lambda 10 on the six training wells of the teaching split",
  "Least squares on the eight wells left after EKENE-8 is held out, coefficients 8.829369, 0.320501, 17.445328 and 139.804854"],
 "Once the folds have chosen the features and lambda, the course refits on all nine wells that carry a DT, and that refit predicts every EKENE-6 row, this one included. The two least squares sets belong to the Associate tier, one on the teaching split and one with EKENE-8 held out. A split's six training wells would leave three sonic wells unused by the fit that is written back.")

# CROSS m05 + m06
q(0, "A report says EKENE-6's sonic was predicted by machine learning. How does the course say it should be written?",
 "By its method: ridge regression at lambda 10 on GR, RHOB and NPHI, fitted on 270 rows of 9 wells",
 ["A trained model: a term general enough to cover whichever method was used on the logs",
  "Machine learning is precise enough once the expected error is written beside it",
  "As a sonic log, since a prediction checked against a range test can stand in for a measurement of the well"],
 "In this course machine learning names a fitted statistical model by its method, least squares, ridge or logistic, so a reader can check it. The write-back's method line reads ridge, lambda 10, features GR, RHOB, NPHI, fitted on 270 rows of 9 wells. The predicted values go into DT_PRED and are never written as a measurement.")

# CROSS m05 + m06
q(3, "Why must the caller keep EKENE-6's rows out of the sonic fit?",
 "The engine neither fills nor drops a missing value: it refuses a null target by name and leaves the decision to the caller",
 ["The engine drops null rows only when told to, so without a flag they are fitted with a DT of zero",
  "Leaving them in fills EKENE-6's DT with the training mean, which pulls every coefficient toward that mean",
  "EKENE-6's hot shale makes its rows outliers, and the engine refuses any fit that includes an outlying row"],
 "The engine does not fill a missing value: a null in X or y is refused by name, and filling or dropping it is the caller's decision. There is no imputation among its functions, and outlier statistics belong to the data quality course. EKENE-6 is the well to be predicted, so its rows never enter a fit.")

# CROSS m05 + m06
q(2, "The write-back lists the wells trained on as EKENE-1, EKENE-10, EKENE-2 and on to EKENE-9. Why is EKENE-10 second?",
 "The engine sorts names by UTF-16 code unit, character by character, and the character 1 comes before 2",
 ["EKENE-10 was the second well drilled, and the write-back lists the wells in the order they were drilled",
  "The shuffle at seed 5 put EKENE-10 second, and the write-back keeps the order the shuffle returned",
  "The engine reads the number inside each name and sorts the wells by it, placing 10 after 1"],
 "Names that are strings sort by UTF-16 code unit before any shuffle, so EKENE-10 comes before EKENE-2; the engine does not read the number inside a name. Natural order, EKENE-2 before EKENE-10, is the alternative it declined for a stated order that needs no parsing. The shuffled order at seed 5 begins EKENE-8, EKENE-4, EKENE-5.")

q(1, "EKENE-6's planted sonic offset, less the nine-well mean, is -5.138713 us/ft. Why can no prediction from its logs know it?",
 "It is a well-level shift, and a model on the logs alone has no feature that names the well",
 ["The ridge penalty at lambda 10 shrinks the offset toward zero before it can reach the prediction",
  "It is inside the training range of GR, so the range check passes it and the model ignores it",
  "The offset is negative, and a least squares plane can carry only a positive shift in its intercept"],
 "Each well adds its own drawn offset to every DT sample, and the intercept absorbs only the mean over the wells fitted. On the logs alone no feature names a well, so the model cannot learn a well's offset. With the hot shale's 8.779741 the two stated causes give 13.918453, within 1.209912 of the mean error of 12.708542.")

# CROSS m05 + m06
q(0, "Who chose ridge at lambda 10 on the three logs as EKENE-6's model?",
 "The course, by comparing each candidate's mean test RMSE on the k 3, seed 5 folds and printing the scores",
 ["The engine's ridge function, which searches lambda over its folds and returns the lowest scoring model",
  "The engine's k-fold function, which picks the features whose folds give the smallest spread of scores",
  "Permutation importance, which kept every feature with a positive mean drop and set lambda from the drops it read"],
 "The engine does not choose lambda, the features or the model; a course or an app does that with the folds groupKFold returns and prints the scores it compared. There is no search over lambda or features among its functions. The candidates were compared on the same folds and the lowest mean, 5.826789, chose the model.")

# CROSS m04 + m05
q(3, "The learning curve reads a test RMSE of 4.282693 at six wells; the k-fold at lambda 10 reads 5.826789. Which does the write-back carry as the expected error, and why?",
 "The k-fold mean, which tests every well once across its folds and describes a new well like the nine",
 ["The learning curve's figure, since it uses every training well of the split and so is the most recent fit",
  "The lower of the two, since an expected error is best quoted at the best score any honest method gave",
  "The mean of the two, since each measures the same model on a different set of test wells"],
 "The write-back carries the k-fold mean test RMSE, 5.826789 us/ft, k 3 and seed 5: every well is tested once and the figure is the expected error for a new well like the nine. The learning curve's test score is on one fixed set of three test wells, and one split is one draw of wells. Choosing the lower figure or averaging two schemes estimates nothing stated.")

# --- conventions and boundaries (m06) ---
# CROSS m03 + m06
q(2, "Each Newton step solves its system with `solveSPD`. When does `solveSPD` call a matrix singular?",
 "When a diagonal entry is at or below zero, or a scaled pivot is at or below p x machine epsilon, inclusive",
 ["When its determinant prints as zero at six decimals, the precision the course quotes every figure at",
  "When the scaled condition number is above 1.00e+8, the same limit least squares refuses a design at",
  "When a pivot is strictly below machine epsilon, so a pivot exactly at the bound is still accepted"],
 "The boundary table gives the rule: a diagonal entry at or below zero, or a scaled pivot at or below p x machine epsilon, inclusive, and the rank one matrix of the refusal table shows it. The 1.00e+8 limit belongs to ols and ridge. A pivot exactly at the bound is singular, since the rule is inclusive, and the six decimal print is a quoting rule, never a test.")

q(1, "The engine's own case gives a logistic probability of 0.500000. Which class does `predict` assign?",
 "Class 0: class 1 needs a probability above 0.5",
 ["Class 1, since 0.5 is at the threshold and the threshold counts as pay",
  "Neither, since the engine refuses a row whose probability is exactly one half",
  "Whichever class is the majority in training, 0 on the Ekene pay model"],
 "The basis reads \"class 1 when the probability is above 0.5, class 0 at exactly 0.5\", and golden `predict-logistic-half` gives the probability 0.500000 and the class 0. The rule is strict, and a probability of one half is a result like any other, never a refusal. The engine never looks at the training labels when it assigns a class.")

q(3, "In the golden `roc-ties` two rows, one positive and one negative, share the score 0.4. What does the curve do at threshold 0.400000?",
 "Both rows are called positive together, a diagonal step from FPR 0 and TPR 0.666667 to FPR 0.333333 and TPR 1",
 ["The positive row is taken first, a vertical step to TPR 1, then the negative, a step across to FPR 0.333333 after it",
  "The negative row is taken first, a step across to FPR 0.333333, then the positive, a step up to TPR 1",
  "Both rows are skipped until the next distinct score, 0.2, since a tie at a threshold is left undecided"],
 "A row is called positive at a score at or above the threshold, and equal scores move together: the basis says \"equal scores are one threshold: their rows move together, a diagonal step when the classes are mixed\". The printed points go from (0.000000, 0.666667) to (0.333333, 1.000000). Taking either row first would favour one class, which is exactly what the rule declines.")

q(0, "`classificationReport` is given yTrue [0, 1, 1] and yPred [0, 1, 0]. How many ratios does it score with `zeroDivision`?",
 "None, since zeroDivision is scored only when a denominator is 0, and here none is",
 ["Two, one for each label, since the engine applies zeroDivision to every ratio on so few rows",
  "One, the recall of label 1, since one of its two rows is predicted as label 0",
  "One, the precision of label 0, since one of the rows predicted 0 is truly 1"],
 "The boundary table gives this case: 0 ratios scored zeroDivision, because the rule applies only when a denominator is 0. Both labels are predicted and both appear, so every precision and recall has a nonzero denominator. A wrong prediction lowers a ratio without making it undefined; the never-predicted golden is where zeroDivision is used.")

# CROSS m06 + Associate recall
q(2, "`groupSplit` is given 25 groups at fraction 0.28. In float 0.28 x 25 is 7 plus 8.88e-16. How many groups are held out?",
 "7, since a product within 1.00e-9 of a whole number is taken as that number before the ceiling",
 ["8, the ceiling of the float product, since any excess over 7 rounds the count of test groups up",
  "7, since the engine rounds every product to the nearest whole number before it takes a ceiling",
  "A refusal, since a fraction that leaves the product off a whole number cannot size a test set"],
 "The test size is ceil(testFraction x count), with a product within 1.00e-9 of a whole number taken as that number. 8.88e-16 is within 1.00e-9 of 7, so 7 are held out; a plain ceiling would hold out 8. Rounding every product to the nearest whole number is a different rule, and a product far from a whole number is rounded up.")

# CROSS m06 + Associate recall
q(1, "A standard scaler on GR and mudWeight is fitted on the 30 rows of EKENE-1 alone, then on the nine sonic wells. What happens each time?",
 "Refused on EKENE-1, where every mud weight is 9.4, and fitted on the nine wells, where it varies",
 ["Fitted both times, since a well-level attribute is a real measurement with a real value on every row",
  "Refused both times, since a well-level attribute is constant by its nature and has no spread to scale",
  "Fitted on EKENE-1 with a scale of 0, and fitted on the nine wells with their population SD"],
 "A feature is refused as constant only when every training value is identical: \"X.mudWeight has zero variance on the 30 training rows (every value is 9.4)\". Across the nine wells the same attribute varies and is fitted. A scale of 0 would divide by zero, which is why the engine refuses instead of fitting.")

# CROSS m02 + m06
q(3, "A facies label with three classes, sand, shale and lime, is passed to logistic regression as 0, 1 and 2. What does the engine do?",
 "It refuses at the first label other than 0 and 1: the engine's logistic regression is binary",
 ["It fits one model per class against the rest, the multiclass form the engine builds on its binary fit",
  "It fits the three classes as ordered levels, reading 2 as more of whatever 1 stands for",
  "It treats every label above 0 as class 1 and fits sand against shale and lime together"],
 "The engine fits binary logistic regression only, and there is no multiclass logistic. A label other than 0 or 1 is refused by name, as in \"y[2] must be 0 or 1\". Facies classification belongs to the electrofacies course. The engine never recodes a label on the caller's behalf.")

q(0, "`groupSplit` is passed well names mixing strings and numbers. What comes back?",
 "A refusal naming the first mismatched entry, as in `groups[1]`: all strings or all numbers",
 ["A split after the numbers are converted to strings, so the names sort by character",
  "A split with the numbers sorted before the strings, then one shuffle over all of them",
  "A split in the order the caller passed the names, since a mixed list cannot be sorted"],
 "Strings sort by UTF-16 code unit and numbers sort ascending, and a mix of the two is refused: \"groups[1] must be the same type as groups[0]: all strings or all numbers\". The engine never converts a caller's names. A shuffle always starts from the sorted list, so an unsorted order is never used.")

q(2, "A caller passes seed -1 to `groupSplit`. What does the engine return?",
 "A refusal naming `seed`: seed must be a whole number from 0 to 4294967295",
 ["A split at seed 1, since the engine takes the absolute value of a negative seed",
  "A split with no shuffle, the sorted order, since a negative seed turns shuffling off",
  "A split at a seed drawn from the clock, since a negative seed asks for a fresh one"],
 "A negative seed is refused by name: \"seed must be a whole number from 0 to 4294967295\". Every draw is mulberry32 with a stated seed, and nothing in the engine draws from the clock. A refusal changes no input on the caller's behalf, so no split comes back at all.")

# CROSS m01 + m04 + m05 + m06
q(1, "Which of these figures from the course can be quoted without a seed?",
 "Longley's scaled condition number, 43275.043587",
 ["GR's mean permutation drop, 4.747694 us/ft",
  "The learning curve's test RMSE at three wells, 4.385966",
  "The k-fold mean test RMSE of the chosen model, 5.826789"],
 "The Longley figure comes from a published design with no random draw. GR's drop is measured at seed 5 with 5 repeats and moves to 4.954327 at seed 6. The learning curve holds out its test wells with a split at fraction 0.3 and seed 5, and the k-fold deals shuffled wells at k 3 and seed 5. Every seeded number is quoted with its seed.")

q(3, "A value above one is passed as the first probability to `logLoss`. Does the clip to [eps, 1 - eps] bring it into range?",
 "No: it is refused first, since probabilities[0] must be a number from 0 to 1",
 ["Yes: it is clipped to 1 - eps and charged like any other confident probability",
  "Yes: it is clipped to 1 and counted among the rows clipped",
  "No: it is dropped from the mean and the loss is taken over the other rows"],
 "The clip applies to a probability inside [0, 1] that sits closer to 0 or 1 than eps; a value outside [0, 1] is no probability, and the engine refuses it by name: \"probabilities[0] must be a number from 0 to 1\". A refusal returns no loss at all, so no row is dropped and nothing is counted as clipped.")

emit(Q, '/root/dai-wip-mlcore/banks/d2a_exam.json', expect_n=42)
finish()
