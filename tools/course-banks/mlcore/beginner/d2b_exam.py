import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))
# qd: the four options are written in the order they are served, key at k.
def qd(k,p,c,ds,e):
    o=[c]+ds; Q.append((k,p,o[k],o[:k]+o[k+1:],e))

# D2 Associate final exam, 42 questions, seven drawn from each module's
# lessons and asked from a different angle than the module banks.
# Sources: digest sections 1 to 10 and 26. Every figure is printed there.
# Arithmetic stated in an explanation uses only printed figures.

# m01, what a model is
q(2, "When the engine refuses a call, how does the message it returns begin?",
 "With the name of the input it refused, the same name the result carries in its `field`.",
 ["With a code number that indexes the engine's list of refusals, followed by the refused value.",
  "With the word error and the name of the function that was called.",
  "The row count of the call comes first, so the caller can see how much data reached the engine."],
 "Every refusal is an object with `error` and `field`, where `field` names the input it refused and the message starts with that name: \"y[20] must be a finite number\" begins with the field `y[20]`. No code number is involved, and the message carries only the figures its own sentence needs."),

q(0, "A manager asks for a band around each predicted DT showing how far off it might be. What does the engine supply?",
 "No such band: it gives no prediction intervals, and its only random draws are seeded shuffles.",
 ["A band of two residual standard errors either side of each prediction, returned by `predict`.",
  "Repeated random draws of the inputs, seeded so that the band repeats on every run.",
  "The band that the standard errors of the coefficients give, printed beside each predicted row."],
 "The engine does not sample input distributions or give prediction intervals. The only random draws it makes are seeded shuffles. `predict` returns predicted values alone, and the standard errors describe the coefficients."),

q(3, "A colleague expects the engine to try GR, RHOB, NPHI and CALI in every combination and return the best sonic model. What will it do?",
 "Fit exactly the features it is handed; choosing among them is the caller's work, with the scores printed.",
 ["Search every subset and return the one with the lowest test RMSE, with the others listed in its basis.",
  "Fit all four logs at once and drop, without comment, any whose coefficient comes out close to zero.",
  "Refuse the call, since the engine accepts at most three features in a least squares fit."],
 "The engine does not choose the features or the model. A course or an app does that and prints the scores it compared. It fits whatever design it is given, drops nothing silently, and sets no limit of three features."),

q(1, "`ols` is handed a target column in which every DT value is equal. What does it return?",
 "No fit: it refuses on `y`, since a target sum of squares of zero leaves R-squared undefined.",
 ["A fit with every coefficient at zero and the intercept equal to that one value of DT, with R-squared 1.",
  "Coefficients as usual, with R-squared reported as 0 since there is no variation to explain.",
  "It drops the target and fits the features against each other, reporting that change in its basis."],
 "With every target equal, the total sum of squares about the mean is zero, so R-squared has no denominator. The engine refuses on the field `y` and returns no coefficients at all, since it will not print a fit whose score it cannot define. It never swaps the target for another column."),

q(0, "A scaler has already been fitted on the training rows. Which function turns the test rows into scaled values with it?",
 "`applyScaler`, which transforms any rows with the fitted parameters, unchanged.",
 ["`fitStandardScaler` called again on the test rows, so that they are centred on themselves.",
  "`predict`, which scales each row before applying the rule.",
  "`regressionMetrics`, which standardises what it scores."],
 "The function table gives `applyScaler` the scaler and X, and it returns rows transformed with the fitted parameters, unchanged. Fitting again on the test rows would let them shape their own transform. `predict` applies a fitted model to the rows it is handed, and `regressionMetrics` compares targets with predictions."),

qd(2, "A report says the gamma ray \"was standardised by its standard deviation\". Under this course's rule for that phrase, what is missing?",
 "The feature's unit, since a standard deviation must always be quoted in the unit of the log it describes.",
 ["The number of rows, since a standard deviation is only defined for more than thirty rows of a well.",
  "Its divisor: the population standard deviation divides by n, and the sample one by n - 1.",
  "Nothing, since every tool computes a standard deviation in the same way on the same rows."],
 "The course's rule: a standard deviation names its divisor. This engine's scaler uses the population standard deviation, n, and the data quality course's z-score uses the sample standard deviation, n - 1. On 180 rows the two differ by the factor 1.002789, which is why a report that omits the divisor cannot be checked."),

q(1, "How are the 300 rows of the Ekene field organised?",
 "10 wells of 30 samples each, at a one foot step, each well at its own depth.",
 ["30 wells of 10 samples each, at one shared set of depths.",
  "One long well of 300 samples at a one foot step, which the course cuts into ten pieces of 30.",
  "20 wells of 15 samples each, at a half foot step through one interval."],
 "The Ekene field has 10 wells, EKENE-1 to EKENE-10, each with 30 samples at a one foot step through the same reservoir interval, each well at its own depth: 300 rows. EKENE-6 is one of the ten, sampled like the others, and has no sonic, which is why 270 rows in 9 wells carry a DT."),

# m02, data the model has not seen
qd(3, "`randomRowSplit` on the 270 sonic rows at test fraction 0.3 and seed 5 holds out 81 rows. How many rows train the model?",
 "180, the same training set as the split by whole wells at this seed and fraction.",
 ["270, since a random-row split trains on every row and scores the held-out rows a second time.",
  "90, since a random-row test set is always the rows of three wells at this test fraction.",
  "189, the rows left once the 81 test rows are taken from the 270."],
 "The random-row split holds out ceil(0.3 x 270) = 81 rows and trains on the other 189. 180 is the training count of the whole-well split, which holds out 90 rows of three wells. No split trains on its own test rows."),

q(1, "Fisher-Yates from the end opens at i = 8, and for seed 5 its first draw is 0.689775. Which j results, and which two names trade places?",
 "6, since j = floor(u x 9), and EKENE-9 swaps with EKENE-7.",
 ["5, since j = floor(u x 8) takes the draw over the eight positions below i.",
  "7, since u is rounded to the nearest position before the swap is made in the list of names.",
  "0, since the first draw of any shuffle always swaps the last name with the first."],
 "Fisher-Yates from the end takes j = floor(u x (i + 1)), and at i = 8 that is floor(0.689775 x 9) = 6, so EKENE-9 swaps with EKENE-7, as the course's table of draws records. The multiplier is i + 1, the draw is floored, and no rule fixes the first swap."),

q(0, "Two analysts split the nine sonic wells by whole wells at the same fraction, 0.3, one with seed 3 and the other with seed 4. Which wells end up in both test sets?",
 "EKENE-4 and EKENE-5, which appear in both draws.",
 ["EKENE-2, EKENE-3, EKENE-4 and EKENE-5, the union of the wells that the two draws hold out.",
  "None of them, since two different seeds always hold out two disjoint sets of test wells.",
  "The same three wells, since seeds that differ by one give the same draw at a fraction of 0.3."],
 "Seed 3 holds out EKENE-2, EKENE-4 and EKENE-5, and seed 4 holds out EKENE-3, EKENE-4 and EKENE-5, so EKENE-4 and EKENE-5 are common to both. A seed fixes a draw and nothing else, so two seeds can share some wells and differ in others; neighbouring seeds carry no special relation."),

qd(2, "A `groupSplit` call passes well names as a list that begins with the text \"EKENE-1\" and then has the number 2. What happens?",
 "The number is turned into text, so the two names sort together as strings before the shuffle.",
 ["The engine sorts the numbers first and the text names after them, then shuffles the whole list.",
  "A refusal on `groups[1]`: every group id must be of the same type, all strings or all numbers.",
  "Dropping the number as an unreadable name, and splitting the remaining text names as usual."],
 "The engine's own words are: \"groups[1] must be the same type as groups[0]: all strings or all numbers\". It converts nothing, sorts no mixed list and drops no entry: it refuses and names the first entry whose type differs."),

qd(3, "`groupSplit` is handed rows that all come from EKENE-1. What does it return?",
 "One test well and no training well, as 0.3 of one well rounds up to one.",
 ["A random-row split of EKENE-1's 30 rows, with a note in the basis that one well cannot be held out.",
  "All 30 rows as training rows and an empty test set, since one well cannot be split any further.",
  "A refusal on `groups`: at least 2 distinct groups are needed to hold one out, and it found 1."],
 "The engine's own words are: \"groups must hold at least 2 distinct groups to hold one out (found 1)\". A split by whole wells needs one well to train and one to test. The engine never switches to another kind of split, and it returns no empty side."),

q(0, "If the wells are named by numbers alone, 1 to 10, in which order does the engine sort them before the shuffle?",
 "Ascending, so 2 comes before 10; names that are all numbers sort as numbers.",
 ["Character by character, so 10 comes before 2, exactly as it does for text names.",
  "In the order the rows arrive, since numbers need no sorting before a shuffle.",
  "Descending, so the shuffle starts from the highest number and works down."],
 "Names that are all numbers sort ascending; only names that are strings sort by UTF-16 code unit, which is why the text EKENE-10 comes before EKENE-2. A list of numbers is sorted like any other list before the shuffle, and the order is stated in the basis."),

q(1, "At seed 5 the shuffled order of the nine sonic wells begins EKENE-8, EKENE-4, EKENE-5, EKENE-2. Which call holds out EKENE-8 and EKENE-4 and nothing else?",
 "`groupSplit` with nTestGroups 2 and seed 5.",
 ["`groupSplit` with testFraction 0.3 and seed 5, which holds out the first two names of that order.",
  "`groupSplit` with nTestGroups 1 and seed 5, called twice so that each call adds one more well.",
  "`groupSplit` with nTestGroups 2 on the sorted list before the shuffle, which the seed then fixes."],
 "The first nTest groups of the shuffled order are the test set, so nTestGroups 2 at seed 5 holds out EKENE-8 and EKENE-4. The fraction 0.3 holds out ceil(0.3 x 9) = 3 wells, adding EKENE-5. Repeating a call with the same seed gives the same one well, and the first two sorted names are EKENE-1 and EKENE-10."),

# m03, scaling on the training rows
qd(3, "Fitted on the 180 training rows with the default divisor, which scale does the standard scaler give NPHI?",
 "0.033238, the scale over all 270 sonic rows, since NPHI reads alike in every well of the field.",
 ["0.033597, the sample standard deviation, since the scaler divides by n - 1 unless told otherwise.",
  "0.255072, the centre of the training rows, since a scale is taken about the mean of the log.",
  "0.033503, the population standard deviation of those 180 rows."],
 "The scaler's default divisor is n, the population standard deviation, fitted on the training rows: 0.033503 for NPHI. 0.033597 is the sample standard deviation of the same rows, 0.033238 the scale over all 270 rows including the test wells, and 0.255072 is the training centre."),

qd(2, "For the first test row of the teaching split, RHOB reads 2.348000 and the training scaler gives z = -0.303186. Which arithmetic produces that z?",
 "(2.348000 - 2.397719) / 0.136737, the centre and scale taken over all 270 sonic rows together.",
 ["(2.348000 - 2.391150) / 0.142719, the training centre over the training sample standard deviation.",
  "(2.348000 - 2.391150) / 0.142322, the training centre and the training population scale.",
  "(2.348000 - 2.107000) / (2.734000 - 2.107000), min-max on the training range."],
 "The standard scaler maps x to (x - centre) / scale with both fitted on the training rows and the population divisor: RHOB's training centre is 2.391150 and its training scale 0.142322. The all-rows figures, 2.397719 and 0.136737, include the test wells, 0.142719 divides by n - 1, and the minimum over the range is min-max scaling."),

q(0, "Min-max scaling fitted on the nine sonic wells is applied to EKENE-6. Which of its three logs lands outside 0 to 1?",
 "GR alone, on 4 of the 30 rows; RHOB and NPHI stay inside the range.",
 ["All three, since EKENE-6 was not among the wells the scaler was fitted on.",
  "RHOB alone, whose EKENE-6 maximum of 0.925040 is its largest scaled value on the chart.",
  "None of them, since min-max clips every new row into the training range of 0 to 1."],
 "EKENE-6's scaled GR runs up to 1.219324 and sits above 1 on 4 rows, the hot shale. Its RHOB runs from 0.181818 to 0.925040 and its NPHI from 0.057143 to 0.600000, both inside. Being a new well does not by itself put a row outside the range, and min-max clips nothing."),

q(1, "What does `fitMinMaxScaler` return for each feature?",
 "The training minimum and the training range, from which each row maps to (x - minimum) / range.",
 ["The training mean and the population standard deviation, the pair the standard scaler also uses.",
  "The minimum and maximum over every row it is later applied to, refitted each time it is used.",
  "A clipped copy of the rows, each value forced into 0 to 1 before the model sees it."],
 "The function table gives `fitMinMaxScaler` the training minimum and range per feature: the minimum maps to 0 and the maximum to 1. Those two numbers are fitted once, on the training rows, and applied unchanged. The mean and the population standard deviation belong to the standard scaler, and min-max clips no row."),

qd(3, "The sample standard deviation divides by n - 1 and the population one by n. Why does this engine's scaler use n by default?",
 "Because n - 1 is refused whenever a feature is constant down any one of the training wells.",
 ["The sample divisor gives a smaller scale, which would push the z values towards zero.",
  "Because the data quality course uses n, and the two courses share one scaler across the academy.",
  "A stated choice: it reproduces the figure scikit-learn's StandardScaler gives, which divides by n."],
 "The basis says the scaler uses the \"population standard deviation (n), as scikit-learn StandardScaler\", and the course names this as a choice: another tool dividing by n - 1 returns a different scale from the same rows. The data quality course uses the sample standard deviation for its z-score. Dividing by n - 1 gives the larger scale, and no divisor is refused because a well is constant."),

qd(2, "A feature reads the same on every training row except one. Is it refused as constant?",
 "Yes, since a feature that varies on a single row carries too little spread to be scaled.",
 ["Yes, unless the engine first drops the one row that differs.",
  "No: a feature is refused as constant only when every training value is identical.",
  "No, but its scale is set to 1 by the engine so that the other rows keep their raw values."],
 "The engine refuses a feature as constant only when every training value is identical, and names it, as with EKENE-1's mud weight. One differing row gives a non-zero scale, and the scaler fits it. The engine drops no row and sets no scale by hand."),

q(1, "`fitStandardScaler` is given all 270 sonic rows together with `trainIndices` listing the 180 training rows of the teaching split. What centre does it fit for GR?",
 "59.844500, the mean of the 180 rows `trainIndices` lists.",
 ["60.250741, the mean of all 270 rows passed, since the scaler reads every row it is given.",
  "22.375203, since with `trainIndices` given the scaler returns the scale in place of the centre.",
  "A refusal, since the scaler must be passed the training rows alone and cannot take a list of them."],
 "The scaler fits on the rows passed or on the rows `trainIndices` lists, so with the list it fits on the 180 training rows: GR's centre is 59.844500 gAPI. 60.250741 is the all-rows centre, which includes the three test wells, and 22.375203 is the training scale."),

# m04, ordinary least squares
q(0, "The teaching fit reports a TSS of 18853.190000. What is it?",
 "The sum of squared differences of the 180 training DT values from their own mean.",
 ["The sum of squared residuals the plane leaves on the training rows, which least squares minimised.",
  "The sum of squared misses on the 90 test rows about the mean of the test targets.",
  "The total of all the training DT values, from which the training mean is divided out."],
 "TSS is taken about the training mean: the total variation of DT on the 180 rows before any feature is used. The residual sum, RSS, is 5967.842781, and R-squared is 1 - RSS / TSS, 0.683457. Test rows play no part in the training fit."),

qd(3, "Which arithmetic gives the teaching fit's residual standard error, 5.823075 us/ft?",
 "sqrt(5967.842781 / 180), the root of the RSS over every training row.",
 ["sqrt(5967.842781 / 179), the root of the RSS over n - 1 like a sample standard deviation.",
  "sqrt(18853.190000 / 176), the root of the TSS over the residual degrees of freedom.",
  "sqrt(5967.842781 / 176), the root of the RSS over n - p, with p counting the intercept."],
 "s^2 = RSS / (n - p), with n 180 and p 4 counting the intercept, so s is sqrt(5967.842781 / 176) = 5.823075 us/ft. Dividing the RSS by 180 gives the training RMSE, 5.758010. n - 1 ignores the three features, and the TSS measures the spread before the fit."),

qd(2, "Fitted on NPHI alone, the training R-squared is 0.001327; in the three-log fit NPHI's t value is 6.319645. Do the two contradict each other?",
 "Yes, and the three-log fit should be discarded, since a log with no signal alone cannot gain one.",
 ["Yes, since a t value above 2 needs the feature to explain most of the variation on its own.",
  "No: what a coefficient says depends on which other features are in the fit beside it.",
  "No, since the t value comes from the test wells."],
 "A coefficient depends on which other features are in the model. Alone, NPHI's coefficient is 11.127468 and explains almost none of the variation; beside GR and RHOB, holding them fixed, its coefficient is 138.783590 with a t value of 6.319645. Both figures are training figures, and neither fit is wrong."),

q(0, "`ols` is given GR and DT as features on the forty rows from 130 to 169, with RHOB as the target. Which field does the refusal name?",
 "`X[20][1]`: DT, the second column, is null at index 20 of the rows handed over, dataset row 150.",
 ["`y[20]`, since the refusal always names the target whenever a row of the call is incomplete.",
  "`X[150][1]`, since the engine counts rows by their place in the full 300-row dataset.",
  "`X.DT`, since the engine names the column with the missing values and leaves out the row."],
 "The engine's own words are: \"X[20][1] must be a finite number: fill or drop missing values first\". Indices start at 0 within the call, so index 20 is dataset row 150, where EKENE-6 begins and its DT, the feature in column 1, is null. RHOB is the target in this call and is present throughout."),

qd(3, "A least squares fit with an intercept and three features is attempted on very few rows. What is the fewest rows the engine will accept?",
 "4, one row for each coefficient, the intercept included.",
 ["3, one row for each feature, since the intercept is not counted among the coefficients.",
  "30, one full well, since the engine fits no coefficient on fewer rows than a well carries.",
  "5, so that n - p is at least 1 with p = 4 counting the intercept."],
 "The engine refuses n <= p and needs the residual degrees of freedom n - p to be at least 1. With the intercept p is 4, so 5 rows is the fewest it accepts. With 4 rows the plane passes through every row and leaves nothing to estimate s from. No one-well minimum exists."),

q(1, "The teaching fit gives RHOB a coefficient of 22.499915. In what unit?",
 "us/ft per g/cm3, the target's unit over the feature's unit.",
 ["g/cm3 per us/ft, since the coefficient converts a sonic reading back into a density.",
  "us/ft alone, the unit of DT, since a coefficient takes the target's unit and nothing else.",
  "None at all: a coefficient is a pure number fitted to the rows of the training wells."],
 "A coefficient carries the target's unit over the feature's unit: one more g/cm3 of bulk density moves the fitted DT by 22.499915 us/ft, holding GR and NPHI fixed. The fit predicts DT from RHOB and never the other way, and a coefficient without its unit is a number without a meaning."),

qd(2, "What would dropping the intercept from the teaching fit force on the fitted plane?",
 "Nothing: the coefficients would absorb it.",
 ["A smaller residual standard error, since one fewer coefficient frees a residual degree of freedom.",
  "It would have to pass through the origin, where every log reads zero.",
  "An R-squared about zero, which the engine refuses."],
 "The intercept is there so the plane need not pass through the origin, the fitted DT where every feature is zero, a point far outside the data. Without it the plane is pinned there and the coefficients bend to reach the rows. The fit would change, and a coefficient fewer does not by itself make the misses smaller."),

# m05, fit metrics and residuals
q(3, "On the same rows, which relation between RMSE and MAE always holds?",
 "RMSE is at least as large as MAE, and equal only when every miss has the same size.",
 ["MAE is at least as large as RMSE, since it keeps every miss at its full size.",
  "The two are equal whenever the model is fitted by least squares on those rows.",
  "RMSE is MAE squared, since both are built from the same misses on the same rows."],
 "Squaring before averaging gives large misses more weight, so the root of the mean square is never below the mean of the sizes. Every table in the course shows it: the test wells read RMSE 4.282693 and MAE 3.526103 us/ft. Least squares minimises squared misses, which makes the two no more alike, and both read in us/ft."),

qd(3, "On the three test wells the same predictions give R-squared 0.815322 about the test mean and 0.816151 about the training mean. Why is the second one higher?",
 "The training mean is the better reference for a new well, and a better reference always scores higher.",
 ["Rounding: the two agree to three decimals, and the gap is only the order in which the sums are taken.",
  "The training mean includes more rows, so it predicts the test targets more closely than their own mean.",
  "The squared spread of the test targets is smallest about their own mean, so any other reference enlarges it."],
 "R-squared = 1 - SSE / sum (y - reference)^2, with the same SSE both times. The sum of squared differences of the test targets is as small as it can be about their own mean, 105.214444, so about 105.883333 the denominator is larger and R-squared comes out higher. Neither reference is better in general; each answers its own question and must be named."),

q(1, "Scored on its own 180 fitted values, `regressionMetrics` returns R-squared 0.683457. Which reference mean is that about?",
 "105.883333 us/ft, the training mean, because the rows scored are the training rows.",
 ["105.214444 us/ft, the mean of the test targets, which is the default for every R-squared the engine returns.",
  "Zero, since fitted values are scored against the origin of the fitted plane.",
  "The mean of the fitted values, which differs from the mean of the measured DT."],
 "With no `referenceMean`, R-squared is taken about the mean of the rows scored. Scored on the training rows, that is the training mean, 105.883333 us/ft, and the result matches the fit's own R-squared, 0.683457. 105.214444 is the mean of the test targets, a different set of rows."),

qd(2, "In the 270-row fit, EKENE-9's residuals average 6.733268 us/ft. Is the plane predicting that well's DT too high or too low?",
 "Too high, since a positive residual means the prediction overshoots the measured DT.",
 ["Neither, since the residuals of a fit with an intercept average zero in every well.",
  "Too low: a residual is y - yhat, so a positive mean says the measured DT sits above the plane.",
  "It depends on the scale, since a residual has no sign until the features are standardised."],
 "A residual is y - yhat for one row, measured less predicted. A positive mean residual says EKENE-9's measured DT sits above the plane on average. With an intercept the residuals sum to zero over all fitted rows together, never well by well, and a residual keeps its sign in us/ft whatever the features' scale."),

q(0, "The teaching fit's training R-squared is 0.683457; least squares on all 270 sonic rows reads 0.728027. Why do they differ?",
 "They are fits to different rows: 180 training rows of six wells, and all 270 rows of nine wells.",
 ["The 270-row value is a test R-squared, taken about the training mean of the teaching split.",
  "The 270-row fit uses standardised features, which raises R-squared on the same rows.",
  "One is adjusted for the coefficients spent and the other is not, on the same set of rows."],
 "Each R-squared belongs to its fit and its rows: 0.683457 is the teaching fit on its 180 training rows, and 0.728027 the fit on all 270 sonic rows, each about its own training mean. Neither is a test figure, standardising leaves a least squares fit unchanged, and the teaching fit's adjusted value is 0.678062."),

qd(3, "EKENE-8 scores RMSE 3.501687 us/ft as a test well of the teaching split and 3.765285 when it is the one well held out. Why do the two differ?",
 "The second figure also counts EKENE-8's training rows.",
 ["The first is taken about EKENE-8's own mean and the second about the training mean of the fit.",
  "Rounding in the pooling of the 90 test rows shifts the first figure away from the second.",
  "They come from different planes: one fitted on six training wells, the other on eight."],
 "The teaching split trains on six wells, 180 rows, and the one-well workflow on eight, 240 rows, so the planes differ and so do their misses on EKENE-8's 30 rows. Both figures are test scores on EKENE-8 alone, and RMSE needs no reference mean."),

q(2, "How many residuals does the least squares fit on all 270 sonic rows return, and what is each one?",
 "270, one per fitted row, each the measured DT less the fitted DT of that row.",
 ["9, one per well, each the mean miss of that well's 30 rows.",
  "Fewer than 270, since the 4 coefficients use up four rows that carry no residual.",
  "30, one per depth step, averaged across the nine wells at that depth."],
 "A residual is y - yhat for one row, so a fit on 270 rows returns 270 of them. The well means, such as EKENE-9's 6.733268 us/ft, are derived by averaging each well's 30 residuals. The coefficients take degrees of freedom from the fit without taking any row's residual away."),

# m06, one well held out
qd(2, "Of the five wells held out one at a time, which does the plane miss by the most?",
 "EKENE-3 at seed 4, whose RMSE of 3.564857 us/ft is the largest of the five.",
 ["EKENE-7 at seed 6, with an RMSE of 6.502833 us/ft and the lowest R-squared of the five.",
  "EKENE-2 at seed 3, with an RMSE of 7.260092 us/ft and an R-squared of 0.482707.",
  "EKENE-8 at seed 1, since the first well held out is scored against the fewest training rows."],
 "Held out one at a time, EKENE-2 reads RMSE 7.260092 us/ft, the largest of the five, with R-squared 0.482707 about its own mean. EKENE-3's 3.564857 is the smallest of the five. EKENE-7 reads 6.502833 with R-squared 0.502611, above EKENE-2's 0.482707, and every one-well fit trains on the same count of eight wells."),

q(0, "Step five of the one-well workflow scores the training rows for comparison. What does it return?",
 "RMSE 5.462405 us/ft and R-squared 0.709438 on the fitted values of the 240 training rows.",
 ["RMSE 3.765285 us/ft on EKENE-8, which is scored a second time against the training mean.",
  "RMSE 5.758010 us/ft on the 180 training rows of the teaching split, the course's reference fit.",
  "The coefficients again, since a training score is the fit itself read back in us/ft."],
 "Step five runs `regressionMetrics` on the fitted values of the 240 training rows: RMSE 5.462405 us/ft and R-squared 0.709438. 3.765285 is EKENE-8's test RMSE from step four, and 5.758010 belongs to the teaching fit on 180 rows, a different split."),

qd(3, "With EKENE-8 held out, GR's coefficient reads 0.320501 on the raw logs and 6.898926 on standardised logs. How can both describe one fitted plane?",
 "They cannot, so the standardised fit must be a different plane that predicts EKENE-8 differently.",
 ["The standardised fit drops the intercept, so its coefficients must grow to make up the difference.",
  "The larger figure is per 0.01 gAPI, the rate the course uses for a gamma ray reading.",
  "Each reads in its own unit: one per gAPI, the other per population SD of GR across the eight training wells."],
 "Standardising changes the unit of a coefficient to us/ft per population standard deviation of its feature over the training rows. The predictions for EKENE-8 differ from the raw fit's by at most 1.42e-14 us/ft, which is rounding: least squares with an intercept gives the same plane under any rescaling of a feature. Both fits keep an intercept."),

q(1, "Which of the planted items in the Ekene field does min-max scaling fitted on the nine sonic wells find?",
 "The hot shale in EKENE-6, whose raised gamma ray maps above 1 on 4 rows.",
 ["The well-level sonic offset, which min-max maps above 1 in every well that carries one.",
  "EKENE-6's missing sonic, refused at its first null row.",
  "The pay label, recovered by mapping PHIC above 0.16 to 1."],
 "EKENE-6's gamma ray is raised by 30 gAPI on every sample, and min-max fitted on the nine sonic wells maps its highest GR above 1 on 4 rows. The sonic offset is found by the mean least squares residual per well, and the missing sonic by the refusal of the first null target. PAY is a label from a stated rule, which scaling does not find."),

qd(2, "In a write-up of the teaching fit, how does the course name the method?",
 "As machine learning, since the course is about machine learning on well data and that names the family.",
 ["By its test score on the held-out wells.",
  "As ordinary least squares with an intercept, the method named by what it is.",
  "As a sonic predictor, named for its target."],
 "The course's rule: machine learning here means a fitted statistical model named by its method, so a write-up names it as ordinary least squares with an intercept. A score describes how the model did on some rows, and the target is a separate line of the write-up."),

q(0, "A colleague reruns the one-well workflow with the same wells, the same seed and the same features. What will they get?",
 "The same five results, since each step is an engine call with stated inputs.",
 ["Slightly different results, as the split draws afresh.",
  "The same test well but different coefficients, since least squares starts from random values.",
  "Matching results only on the same machine."],
 "Each row of the workflow table is an engine call with stated inputs: the split's only draws come from one mulberry32 stream seeded by the stated seed, and least squares has no random start. Anyone with the same wells, seed and features gets the same five results, which is what lets a score be checked and argued with."),

qd(3, "Why can a plane fitted on the other eight wells not know EKENE-8's own sonic offset?",
 "Because the offset is removed from EKENE-8's rows before the fit, as the split's basis states.",
 ["Because the offset is carried by GR alone, which the fit reads only through its training centre.",
  "It can, since the intercept is fitted to the mean offset of all nine wells, EKENE-8 included.",
  "The offset belongs to EKENE-8 alone, and none of EKENE-8's rows is in the fit."],
 "Each Ekene well carries its own planted sonic offset, shared by all its rows. A whole-well split keeps every EKENE-8 row out of the fit, so nothing in the fitted rows carries that well's offset and the plane has no way to learn it. Nothing is removed from any row, and the offset is added to DT itself."),

emit(Q, '/root/dai-wip-mlcore/banks/d2b_exam.json', expect_n=42)
finish()
