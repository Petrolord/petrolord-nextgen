import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Professional m01, ridge and the bias-variance trade.
# Every figure is the course's ridge path on the teaching split (180 training
# rows, seven features, test wells EKENE-4, EKENE-5, EKENE-8). No capstone
# field, well, stated input or graded answer appears.

q(2, "Ridge minimises sum (y - b0 - z'b)^2 + lambda x sum b_j^2. Which terms does the penalty charge?",
 "Only the feature coefficients b_j; the intercept b0 is left out of the penalty.",
 ["Every coefficient the fit prints, the intercept b0 included, at one price per unit of size.",
  "The squared residuals of the training rows, each times lambda.",
  "Just the coefficients of the four well-level attributes."],
 "The engine's basis states the objective with \"the intercept b0 not penalised\", so lambda multiplies the sum of the squared feature coefficients alone. The residuals sit in the first term with no lambda, and the penalty makes no exception by feature: the attributes shrink hardest because of what they fit, while every feature pays the same price.")

q(0, "On the 180 training rows with the seven features, what is the ridge intercept in standardised space at lambda 100?",
 "105.883333 us/ft, the training mean of DT",
 ["1.187122 us/ft, the intercept rebuilt in original units",
  "105.214444 us/ft, the test-well mean",
  "-5453.266676 us/ft, the least squares intercept in original units"],
 "With every feature centred on its training mean and the intercept outside the penalty, the standardised intercept is the training mean of DT, 105.883333, at every lambda. 1.187122 is the original-unit intercept at lambda 100, -5453.266676 the original-unit intercept at lambda 0, and 105.214444 is the test-well mean of DT, which the fit never sees.")

q(3, "What are the effective degrees of freedom of the seven-feature ridge fit at lambda 1000?",
 "0.965695",
 ["7.000000",
  "3.458214",
  "0.265317"],
 "The ridge path prints 0.965695 at lambda 1000. 7.000000 is the count at lambda 0, where every feature is spent in full; 3.458214 belongs to lambda 100; and 0.265317 is the training R-squared about the training mean at lambda 1000, a different column.")

q(1, "Of the six lambdas tried on the teaching split with the seven features, which gives the lowest test RMSE on EKENE-4, EKENE-5 and EKENE-8?",
 "Lambda 100, reading 5.759287 us/ft.",
 ["Lambda 1000, at 8.607538 us/ft.",
  "Least squares, lambda 0, at 16.999672 us/ft on those three wells.",
  "Lambda 10, at 9.418023 us/ft."],
 "The test RMSE falls from 16.999672 at lambda 0 through 9.418023 at lambda 10 to 5.759287 at lambda 100, then rises to 8.607538 at lambda 1000. Lambda 100 is the lowest of the six on these three wells, and lambda 0 is the highest.")

q(1, "As lambda rises from 0 to 1000 on the teaching split, what does the training R-squared about the training mean do?",
 "It falls at every step, from 0.861914 to 0.265317.",
 ["Climbs with the penalty, from 0.265317 at lambda 0 up to 0.861914.",
  "First falls and then rises again, tracing the same shape as the test RMSE.",
  "Holds at 0.861914 at every lambda."],
 "Each step in lambda pulls the fit further from the training rows, so the training R-squared about the training mean reads 0.861914, 0.861901, 0.860878, 0.833394, 0.688743 and 0.265317: a fall at every step. The falling-then-rising shape belongs to the test RMSE, and the unpenalised intercept does not stop the feature coefficients shrinking.")

q(2, "The engine puts lambda on the sum of squares and does not divide it by the number of rows. What follows when the same lambda is applied to fewer training rows?",
 "It acts as a stronger penalty: the residual sum grows with rows and the penalty term does not.",
 ["The penalty is unchanged, because the engine rescales lambda by the row count before it fits.",
  "A weaker penalty results, since fewer rows leave the fit fewer coefficients to charge for size.",
  "Nothing moves at all, because every feature is standardised on the rows passed to the fit."],
 "Lambda equals scikit-learn Ridge's alpha on the same standardised features and is not divided by n. The residual term gains a square with every row while the penalty term stays the same size, so on fewer rows the same lambda weighs more. The number of coefficients does not depend on the rows, and standardising sets the spread of the features without touching the balance between the two terms.")

q(0, "At lambda 10 the standardised GR coefficient is 6.235322 us/ft per training population standard deviation. What does the engine report for GR in original units?",
 "0.278671 us/ft per gAPI",
 ["6.235322 us/ft per gAPI, the same figure again",
  "0.317732 us/ft per gAPI, as the ridge path prints it",
  "0.177531 us/ft per gAPI in the original-unit table"],
 "The original-unit coefficient is the standardised one over the feature's training scale: at lambda 10 GR reads 0.278671 us/ft per gAPI. Standardising changes the unit, so 6.235322 is per training population standard deviation of GR and never per gAPI. 0.317732 is GR in original units at lambda 0 and 0.177531 at lambda 100.")

q(3, "To convert a standardised ridge coefficient for GR back to us/ft per gAPI, which figure does the engine divide by?",
 "22.375203 gAPI, the population SD of GR on the 180 training rows",
 ["22.437616 gAPI, the sample SD (n - 1) of GR on those same training rows",
  "21.363430 gAPI, the population SD of GR over every one of the 270 sonic rows",
  "59.844500 gAPI, the training centre of GR"],
 "The basis gives the conversion as b_j / sd_j, and ridge standardises with the population standard deviation (dividing by n) of the rows passed, here the 180 training rows: 22.375203 gAPI. The sample SD, 22.437616, divides by n - 1; 21.363430 was fitted on all 270 rows, test wells included; and 59.844500 is the centre, which is subtracted and never divided by.")

q(2, "How closely do ridge at lambda 0 and `ols` agree when both are fitted on the same training rows?",
 "To a largest relative difference of 3.44e-16 in original units, which is rounding.",
 ["They differ widely, because ridge standardises its features first and least squares does not.",
  "Only in standardised units; in original units the intercepts differ.",
  "No comparison is possible: the engine refuses lambda 0."],
 "With lambda 0 the penalty term vanishes and ridge is least squares. The engine's ridge coefficients in original units agree with `ols` to a largest relative difference of 3.44e-16, the intercept included. Standardising moves the coefficients into other units and leaves the fitted plane where it was, and lambda must be zero or more, so 0 is accepted.")

q(1, "Which standardised coefficient of the seven-feature fit changes sign between lambda 0 and lambda 100?",
 "Northing, from 4.173548 to -0.274348.",
 ["Kb, which moves from -5.095543 to -1.782262 over the same lambdas.",
  "Easting, which falls from 8.680036 all the way down to 0.098385.",
  "RHOB, which reads 2.794047 at lambda 0 and 2.453848 at lambda 100."],
 "Northing is positive at lambda 0 and negative at lambda 100. Kb shrinks toward zero and stays negative, easting shrinks to 0.098385 and stays positive, and RHOB stays positive at both lambdas. GR, NPHI and mudWeight keep their signs too.")

q(3, "How does the engine compute the effective degrees of freedom of a ridge fit?",
 "As sum d_i^2 / (d_i^2 + lambda) over the singular values of the standardised features.",
 ["By counting every coefficient printed, the intercept among them, less one for each unit of lambda.",
  "As the number of standardised coefficients whose absolute size is still larger than lambda.",
  "From n - p on the training rows, the residual count that least squares uses for s."],
 "The engine sums d_i^2 / (d_i^2 + lambda) over the singular values d_i of the standardised features, so each term lies between 0 and 1 and the total is 7.000000 at lambda 0 with seven features. The intercept is not counted because it is not penalised, the count is never a comparison of coefficients with lambda, and n - p is the residual degrees of freedom of least squares.")

q(0, "A caller passes a negative lambda to `ridge`. What does the engine return?",
 "A refusal naming `lambda`: \"lambda must be a finite number, zero or more\".",
 ["A fit with the penalty's sign reversed, rewarding large coefficients.",
  "The least squares fit, reading a negative lambda as 0.",
  "A fit at the absolute value of lambda, with a warning."],
 "The engine refuses by name, and the message is the engine's own words: \"lambda must be a finite number, zero or more\". It fits nothing in place of the call, swaps in no default and attaches no warning to a result, because a refusal returns no result.")

q(2, "Why does lambda 0 score the highest test RMSE on the teaching split, 16.999672 us/ft?",
 "Its attribute coefficients chase the six training wells' offsets and then extrapolate to three new wells.",
 ["Least squares cannot use the four attributes, so it is left to predict from the three logs alone.",
  "Its intercept is penalised toward zero, which drags every prediction toward a DT of zero us/ft.",
  "The test wells hold more rows than the training wells, and a larger test set inflates the error."],
 "At lambda 0 the seven coefficients are free to fit the six training wells' sonic offsets through the four well-level attributes, which is variance; on three wells never seen those coefficients extrapolate. Least squares uses all seven features, the intercept is not penalised at any lambda, and the test wells hold 90 rows against 180 in training.")

q(1, "With the strongest penalty tried, the ridge fit spends less than one effective coefficient. What does it still print?",
 "All seven feature coefficients, each shrunk toward zero.",
 ["One coefficient; the rest drop out below a count of one.",
  "Only the intercept, at the training mean of DT.",
  "The three log coefficients alone, the four attributes having been removed first."],
 "Ridge shrinks coefficients and removes no feature: seven are printed at every lambda, and the effective count says how much of the seven the fit is really using. The intercept is printed beside them, and the attributes stay in the fit.")

q(0, "The teaching split points to lambda 100 for the seven features. Why is that a weak basis for choosing lambda?",
 "It is a fact about three test wells drawn by one seed; another seed may favour another lambda.",
 ["Lambda 100 is refused on other splits, because the penalty's limits depend on the seed.",
  "The 5.759287 us/ft read at lambda 100 was scored on the training rows of the six wells.",
  "A lambda can only be chosen from the training R-squared about the training mean."],
 "One split is one draw of wells: EKENE-4, EKENE-5 and EKENE-8 at seed 5. Choosing lambda from their scores tunes the model to those three wells, which is why the next module scores every well once. The seed does not limit lambda, 5.759287 is a test RMSE on the three held-out wells, and the training R-squared falls at every step whatever lambda would serve a new well.")

emit(Q, '/root/wt-dai-d2-nextgen/tools/course-banks/mlcore/intermediate/d2i_m01.json', expect_n=15)
finish()
