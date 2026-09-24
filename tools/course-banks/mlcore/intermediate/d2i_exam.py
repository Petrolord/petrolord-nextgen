import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Professional final exam, 42 questions across m01 to m06.
# Every key rests on a line of the course digest; where the digest is silent
# the key was checked by calling the vendored engine (groupKFold at k 1, the
# label refusal). TWO-MODULE questions are marked. PRINTED ALIKE TRAP: no key
# treats two figures that agree at six decimals as equal. No capstone field,
# well, stated input or graded answer appears, and nothing reaches the Expert
# tier's methods.

# ---------------------------------------------------------------- m01 ridge

# 1 m01
q(1, "Between lambda 0 and lambda 100 on the teaching split, which features does the ridge penalty pull toward zero hardest, in standardised units?",
 "The four well-level attributes: easting drops from 8.680036 to 0.098385 while GR goes from 7.109316 to 3.972291.",
 ["The three logs, whose standardised coefficients are the largest of the seven at lambda 0 and so pay the most.",
  "Every feature by one common fraction, because lambda charges the same price per unit of each coefficient.",
  "Only the intercept, which falls toward zero from the training mean of DT as lambda grows past 10."],
 "The standardised path shows the attributes shrinking hardest: easting 8.680036 to 0.098385, northing 4.173548 to -0.274348, mudWeight 8.884278 to 1.045997, while GR keeps 3.972291. The penalty is one price per unit, and what each coefficient loses depends on what it fitted; the intercept stays at 105.883333 at every lambda.")

# 2 m01
q(3, "The standardised intercept stays at 105.883333 us/ft at every lambda, yet the original-unit intercept moves from -5453.266676 at lambda 0 to 1.187122 at lambda 100. Why?",
 "It is recovered as mean y less the sum of b_j mean_j / sd_j, and the b_j shrink as lambda grows.",
 ["It is penalised in original units, while in standardised units the intercept is held outside the penalty.",
  "Ridge refits the intercept on the three test wells at every lambda and reports that one in original units.",
  "The original-unit intercept is the standardised one scaled by the training population SD of DT at each lambda."],
 "The basis states the conversion: \"b_j / sd_j, intercept mean y - sum b_j mean_j / sd_j\". The intercept is never penalised in either unit, and the test wells play no part in any fit; as the feature coefficients shrink, the sum they subtract from the training mean changes, and the intercept in original units moves with it.")

# 3 m01
q(2, "Which lambda on the teaching split spends about three and a half effective coefficients, and what test RMSE does it score on EKENE-4, EKENE-5 and EKENE-8?",
 "Lambda 100: 3.458214 effective degrees of freedom, test RMSE 5.759287 us/ft.",
 ["Lambda 10: 5.568235 effective degrees of freedom, test RMSE 9.418023 us/ft.",
  "Lambda 1000, at 0.965695 effective degrees of freedom and a test RMSE of 8.607538 us/ft.",
  "At lambda 1 the count is 6.724037 and the test RMSE 15.485689 us/ft."],
 "The ridge path prints 3.458214 effective degrees of freedom at lambda 100, where the test RMSE is 5.759287. Lambda 10 spends 5.568235 and scores 9.418023, lambda 1 spends 6.724037 and scores 15.485689, and lambda 1000 spends 0.965695 and scores 8.607538.")

# 4 m01
q(0, "At lambda 0 the ridge output lists eight terms, the intercept among them, while the count of coefficients the fit spends reads 7.000000. What explains that count?",
 "The sum runs over the seven standardised features only; the unpenalised intercept is not counted.",
 ["An eighth term reserved for lambda itself, which the engine subtracts once from the total.",
  "The number of training wells plus one, since the six training wells each hold one term of the fit.",
  "One feature dropped as redundant at lambda 0, leaving seven that the fit actually spends."],
 "The effective degrees of freedom are sum d_i^2 / (d_i^2 + lambda) over the singular values of the standardised features, and the intercept is not counted. At lambda 0 each of the seven terms is 1. Ridge drops no feature, and lambda adds no term of its own.")

# 5 m01
q(3, "At lambda 10 the engine prints mudWeight as 4.243369 in one table and 14.874015 in another. Which unit does each carry?",
 "4.243369 is us/ft per training population standard deviation of mud weight; 14.874015 is us/ft per ppg.",
 ["Both are us/ft per ppg, one from the standardised fit and one from a refit on original features.",
  "4.243369 is log odds per ppg and 14.874015 is us/ft per ppg, from the pay and sonic models.",
  "4.243369 is us/ft per ppg of mud weight; 14.874015 is us/ft per training standard deviation."],
 "The standardised table reads each coefficient per training population standard deviation of its feature, and the original-unit table divides by that scale to give us/ft per ppg: 4.243369 and 14.874015 at lambda 10. Both come from one fit, and mud weight is a sonic-model feature with no place in the pay model.")

# 6 m01
q(2, "As lambda goes from 100 to 1000 on the teaching split, the test RMSE rises from 5.759287 to 8.607538 us/ft. What does the rise show?",
 "Bias: the penalty now pulls the fit so far from the training rows that the training R-squared falls to 0.265317.",
 ["Variance returning, because a very strong penalty frees the attribute coefficients to chase the offsets again.",
  "A refusal at lambda 1000, with the engine returning the least squares fit in place of the ridge one.",
  "Leakage between the training and test wells, which grows with lambda on the teaching split."],
 "Past lambda 100 the penalty costs more fit than it saves in variance: the training R-squared about the training mean falls to 0.265317 at lambda 1000 and the effective degrees of freedom to 0.965695. Variance is the lambda 0 end, lambda 1000 is fitted like any other, and a group split holds whole wells out at every lambda.")

# 7 TWO-MODULE m01 + m03
q(2, "At seed 5 with the attributes, least squares on the group split reads a test RMSE of 16.999672 us/ft; ridge at lambda 100 on the same split reads 5.759287. What did the penalty change?",
 "It pulled easting, northing, kb and mud weight hardest toward zero, curbing how far those coefficients carry onto the held-out wells.",
 ["It closed a leak between rows of one well, since ridge re-standardises on the training rows alone before fitting.",
  "It moved the test wells, since ridge draws a fresh split of its own from the seed it is given by the caller.",
  "It removed the four attributes, whose standardised coefficients all reach zero exactly by lambda 100."],
 "Under a group split no well sits on both sides; the attribute coefficients fitted to six training wells extrapolate to wells never seen, and the penalty shrinks those coefficients hardest. Ridge uses the split it is given, and at lambda 100 easting still reads 0.098385 and northing -0.274348, shrunk but present.")

# ------------------------------------------------------------ m02 k-fold

# 8 m02
q(0, "Dealing the seed 5 shuffle of the nine sonic wells into three groups by position mod 3, which positions land in the group numbered 2?",
 "Positions 2, 5 and 8: EKENE-5, EKENE-3 and EKENE-7.",
 ["Positions 0, 3 and 6: EKENE-8, EKENE-2 and EKENE-10, every third from the start.",
  "Positions 6, 7 and 8, the last three wells of the shuffled order.",
  "Positions 1, 4 and 7."],
 "The engine deals shuffled position q to fold q mod k, so fold 2 takes positions 2, 5 and 8: EKENE-5, EKENE-3 and EKENE-7. Positions 0, 3 and 6 make fold 0 and positions 1, 4 and 7 fold 1, and the deal is round robin, so no fold is a block of the last three.")

# 9 m02
q(0, "In three-fold cross-validation by wells on the nine sonic wells, how often does each well take part?",
 "It is tested in exactly one fold and trains the model in the other two.",
 ["Three times as a test well, once per fold, so that every fold is scored on all nine wells.",
  "Once in training and once in test, the two uses split evenly across the three folds of the deal.",
  "Once as a training well and twice as a test well, since every fold scores two wells for each it fits."],
 "Each fold tests on its own wells and trains on every other well, so every well is tested exactly once and trains in the remaining two folds. A fold tests 90 rows and trains on 180.")

# 10 m02
q(1, "On the leave one well out fold that tests EKENE-1, which reads lower on the logs, least squares or ridge at lambda 10?",
 "Ridge at lambda 10, 3.414773 against 3.514700 for least squares.",
 ["Least squares, 3.514700 against the 3.564857 ridge reads on that same well.",
  "Least squares by a hair, 3.514700 us/ft against 3.567014 for ridge at lambda 10.",
  "Neither of the two: at lambda 10 ridge and least squares print the same fold score."],
 "The EKENE-1 fold reads 3.514700 by least squares and 3.414773 by ridge at lambda 10, so ridge is lower on this well. 3.564857 and 3.567014 are the EKENE-3 fold's scores, and the two models differ on every fold at lambda 10.")

# 11 m02
q(1, "A field's wells hold very different numbers of rows. What does the engine's round robin deal keep balanced across the folds?",
 "The count of wells per fold, to within one well; row counts follow from whichever wells land together.",
 ["The count of rows per fold, splitting a long well where it must so that every fold holds the same rows.",
  "The count of pay rows per fold, as a stratified deal does, so that every fold sees both classes alike.",
  "Nothing at all: the folds follow the sorted names in blocks, whatever size each well happens to be."],
 "Round robin over the shuffled wells balances the number of wells, and fold sizes differ by at most one well; with k 4 on nine wells the folds hold 3, 2, 2 and 2. The engine splits no well and has no stratified split, and it deals the shuffled order round robin, never in blocks of sorted names.")

# 12 m02
q(2, "A caller asks `groupKFold` for k = 1 on the nine sonic wells. What does the engine return?",
 "A refusal naming `k`: \"k must be a whole number from 2 to 9 (the number of distinct groups)\".",
 ["A leave one well out deal, reading k 1 as one well per fold.",
  "One fold holding all nine wells, so the model is trained and then tested on the same 270 sonic rows.",
  "Two folds, since the engine raises k to the smallest count its rule allows and then deals the nine wells."],
 "k must lie from 2 to the number of distinct wells, and k 1 is refused by name in the engine's own words, the same message it gives for more folds than wells. A fold that trained and tested on the same rows would test nothing unseen, and the engine never raises a k it was given.")

# 13 TWO-MODULE m01 + m02
q(0, "The attribute set at lambda 100 reads 5.759287 us/ft on the teaching split's three test wells and 6.773053 as the three-fold mean by wells. Which figure do you quote as the error for a new well?",
 "6.773053, the mean over folds in which every well is tested once, quoted with k 3 and seed 5.",
 ["Whichever of the two is lower, since a lower RMSE shows what the model is able to do on new wells.",
  "5.759287, since the single split was drawn first and the folds were only run to confirm it.",
  "5.759287, because the teaching split already holds out whole wells and so it cannot flatter the model."],
 "One split is one draw of three wells; the three-fold mean tests all nine wells once and is the estimate for a new well like them, carried with its k and seed. The single split does hold whole wells out, which makes it honest for those three wells and says nothing about the other six.")

# 14 m02
q(1, "Why must a k-fold score by wells be quoted with its seed?",
 "Another seed shuffles the wells differently, grouping other wells into folds and giving other scores.",
 ["The seed sets how many folds the engine deals out, so without the seed a reader cannot tell what k was.",
  "Only the seed tells a reader which rows of each well were held out of the fit.",
  "The engine refuses a fold score that is quoted without the seed it was dealt with."],
 "The engine sorts the names, shuffles them once with the seed and deals them round robin, so the seed decides which wells share a fold and the fold scores follow. k is passed on its own, folds are whole wells, and a refusal concerns inputs, never how a score is quoted.")

# ------------------------------------------------------------ m03 leakage

# 15 m03
q(0, "Once easting, northing, kb and mud weight join the logs, by how much does the row-by-row RMSE undercut the whole-well RMSE at seed 12?",
 "7.066351 us/ft",
 ["1.256217 us/ft, as read at seed 12",
  "11.365950 us/ft on the group split",
  "4.299599 us/ft from the random-row split"],
 "At seed 12 the attributes give a random-row test RMSE of 4.299599 and a group test RMSE of 11.365950, an optimism of 7.066351. 1.256217 is the optimism on the logs alone at the same seed.")

# 16 m03
q(2, "Under `randomRowSplit` of the 270 sonic rows at fraction 0.3 and seed 5, how many wells have rows on both sides?",
 "All nine: its `sharedGroups` lists every sonic well.",
 ["None, because a seeded split keeps each well's rows together on one side.",
  "Three, the wells a group split at the same seed would hold out.",
  "Six, the wells the group split would train on at seed 5."],
 "The 81 random test rows come from all 9 wells and each of them also trains the model, so `sharedGroups` lists EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-4, EKENE-5, EKENE-7, EKENE-8 and EKENE-9. The seed fixes the draw of rows and keeps no well together.")

# 17 m03
q(3, "How does the engine's basis describe what `randomRowSplit` is for?",
 "In its own words: \"leakage demonstration only: rows of one well can fall on both sides (sharedGroups); use groupSplit or groupKFold to score a model\".",
 ["Its basis calls it the honest estimate for a new well, provided the seed is stated beside the score it gives.",
  "A quick split for exploring a field before any whole well has been held out, in the words of its own basis.",
  "The default split for scoring any model whose features are logs sampled row by row down every well of a field."],
 "The basis names the function's purpose in exactly those words. The honest estimate for a new well is the engine's description of `groupSplit`, and a model is scored with `groupSplit` or `groupKFold`.")

# 18 m03
q(2, "A scaler fitted on all rows leaves a least squares prediction unchanged. Why does it move the l2 = 1 logistic pay model?",
 "A penalty on standardised features depends on their scale, and the all-well scaler sets another scale.",
 ["The logistic fit refuses standardised features, so the two scalers feed it different raw inputs.",
  "The all-well scaler also sees the pay labels, which it passes to the fit as an extra feature.",
  "Logistic regression has no intercept, so a shifted centre moves every one of its predictions."],
 "With an intercept, least squares gives the same fitted plane under any rescaling, but a penalty charges coefficients measured per scaled unit: RT's scale is 16.599700 from the training wells and 16.255862 from all ten, and the RT coefficient moves from 3.129011 to 3.083215. A scaler sees features only, and the pay model carries an intercept.")

# 19 TWO-MODULE m02 + m03
q(1, "Which of these steps leaks inside three-fold cross-validation by wells?",
 "Taking the scaler's centre and scale from all 270 sonic rows, then running `groupKFold` on the scaled rows.",
 ["Refitting the scaler on each fold's training wells and applying it unchanged to that fold's test wells.",
  "Choosing k and the seed before any fold is scored, then quoting the mean with both of them stated.",
  "Printing every fold's test RMSE beside the mean, so a reader can see how widely the folds disagree."],
 "A scaler fitted before the folds are dealt has seen every fold's test wells, so the test rows shaped the transform the model was trained through. Refitting inside each fold on its training wells is the rule, and stating k, the seed and every fold score leaks nothing.")

# 20 m03
q(0, "Seed 9 gives the three logs a gap of 1.220206 us/ft between whole-well and row-by-row scoring, in the row-by-row split's favour. How should it be read?",
 "Only the draw: on the logs the sign falls either way, positive on 5 seeds and negative on 7.",
 ["That the logs carry the wells' sonic offsets whenever the seed is odd.",
  "A defect in the engine's subtraction, which should give a negative figure on the logs.",
  "A leak through the logs, which name the well a row came from once rows are shared."],
 "No log names a well, so the model has no path to a well's offset, and the random-row score is neither systematically better nor worse: over seeds 1 to 12 the optimism is negative on 7 and positive on the rest, as the draw of test wells falls. Seed 9 is one of the positive draws.")

# 21 m03
q(1, "At seed 5 adding the attributes moves the random-row test RMSE from 6.030242 to 5.311723 and the group test RMSE from 4.282693 to 16.999672. What does the pair of moves say?",
 "The attributes help on rows of wells already seen and hurt on wells the model has not seen.",
 ["The random-row split is the more reliable, since it scored both feature sets on 81 rows.",
  "The attributes improve the model on every split, and the group figure is a fitting failure of that seed.",
  "The attributes are noise, which leaves both splits worse off by about the same amount."],
 "With the attributes the random-row score improves because each well's offset is learnt from its training rows and met again in test, while the group score worsens because the test wells' offsets are absent from training. The same pattern holds on all 12 seeds.")

# 22 TWO-MODULE m03 + m06
q(3, "Three test log losses sit side by side for the pay wells: 0.126480 (l2 = 1, scaler from the training wells), 0.126152 (l2 = 1, scaler from every well) and 0.115676 (no penalty). Which pair isolates the leak?",
 "0.126480 against 0.126152: one model and one penalty, the scaler fitted on different wells.",
 ["0.115676 against 0.126480, the unpenalised model against the penalised one on the same test wells.",
  "0.115676 against 0.126152, since the leaked model should read closest to the clean one.",
  "None, since log loss cannot register leakage and only an RMSE comparison can do so."],
 "Leakage is judged by changing one thing, the rows the scaler saw, and holding the model and penalty fixed: 0.126480 on the training-well scaler against 0.126152 on the all-well one, a difference of -3.28e-4. 0.115676 comes from a different model with no penalty, and log loss scores the leaked and clean fits like any other.")

# ------------------------------------------------------------ m04 logistic

# 23 m04
q(2, "Which wells train the logistic pay model at fraction 0.3 and seed 5?",
 "EKENE-1, EKENE-10, EKENE-2, EKENE-4, EKENE-6, EKENE-8 and EKENE-9.",
 ["EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-7 and EKENE-9, the six that train the sonic model.",
  "EKENE-3, EKENE-5 and EKENE-7, the three wells the pay split holds out.",
  "The nine sonic wells, since EKENE-6 has no sonic and carries no pay label."],
 "The pay split draws over all ten wells, and its training wells are EKENE-1, EKENE-10, EKENE-2, EKENE-4, EKENE-6, EKENE-8 and EKENE-9, 210 rows. EKENE-3, EKENE-5 and EKENE-7 are its test wells, and EKENE-6 carries a PAY label though it has no sonic.")

# 24 m04
q(3, "Of the first five test rows of EKENE-3, which does the pay model call pay at the one half threshold?",
 "Row 61, at 0.817561, a row whose PAY is 0.",
 ["None of them, since every one of the five probabilities sits below one half.",
  "Row 60, at 0.068312, the first row of the well.",
  "Row 63, at 0.063221."],
 "Row 61 is the only one of the five above one half, at 0.817561, and its PAY is 0: a false positive. Rows 60, 62, 63 and 64 read 0.068312, 0.026632, 0.063221 and 0.004802 and are called class 0.")

# 25 m04
q(0, "The pay model's intercept is 23.081681 log odds. What does it describe?",
 "The log odds of pay where RHOB, NPHI and RT are all zero, a point far outside the rows.",
 ["The share of the 210 training rows that are pay, 70 of them, written as log odds per ohm.m of resistivity.",
  "The fitted probability of pay for a row sitting at the training mean of every one of the features.",
  "The log odds of pay averaged over the 210 training rows."],
 "eta = b0 + b1 x1 + ..., so the intercept is eta where every feature is zero. No rock reads a bulk density of zero, so it sits far outside the data. It is a log odds with no per-unit reading, and it is no average or share of the training rows.")

# 26 m04
q(1, "A label column passed to `logistic` reads 0, 1, 2 in its first three rows. What does the engine return?",
 "No fit: the engine stops at the third label and names the field in its own words, \"y[2] must be 0 or 1\".",
 ["Reading 2 as pay, a fit that takes any label above 0 as class 1 and returns its coefficients as usual.",
  "A fit on rows 0 and 1 only, with the row that carries the stray label left out.",
  "Coefficients with a warning attached, saying one label was clipped into the range 0 to 1 before the fit ran."],
 "Logistic regression takes binary labels, and the engine refuses the first label other than 0 and 1 by name: \"y[2] must be 0 or 1\". A refusal returns no fit; the engine reinterprets nothing, drops no row and clips no label.")

# 27 m04
q(0, "How does the engine compute the standard errors of the logistic pay coefficients?",
 "As sqrt(diag((X'WX)^-1)) at the solution, with W = p(1 - p).",
 ["As s x sqrt(diag((X'X)^-1)), s^2 = RSS / (n - p), the least squares rule.",
  "By the spread of each coefficient across the three folds by wells.",
  "From the coefficient over its z value, computed at the fitted solution."],
 "The basis reads, in the engine's own words, \"sqrt(diag((X'WX)^-1)) at the solution, W = p(1 - p)\": the inverse information at the solution. s x sqrt(diag((X'X)^-1)) belongs to least squares, no fold enters the fit, and coefficient over standard error is derived from the standard error and cannot define it.")

# 28 TWO-MODULE m04 + m05
q(0, "Row 61 of EKENE-3, with PAY 0, is scored 0.817561 by the pay model. Where does it sit in the confusion matrix of the test wells?",
 "Among the 4 in row true 0, column predicted 1: one of pay's false positives.",
 ["On the diagonal, among the 62 rows counted as correct at one half.",
  "Outside the matrix, as a row whose probability is too uncertain to be classed.",
  "In the true 1, predicted 0 cell, the cell of pay rows that the model missed."],
 "Its probability is above one half, so the engine assigns class 1, and its true label is 0. Rows are true labels and columns predicted ones, so it is one of the 4 in the true 0, predicted 1 cell. The true 1, predicted 0 cell holds 0 rows, and every row is classed.")

# 29 TWO-MODULE m04 + m06
q(1, "A row is scored a probability of exactly 0.5. What class does `predict` give it, and is it called positive by `rocCurve` at a threshold of 0.5?",
 "Class 0 from `predict`, yet positive in `rocCurve`, which calls a row at or above its threshold.",
 ["Class 0 from `predict`, and negative in `rocCurve`, since both rules need a score above one half.",
  "Class 1 from `predict`, and positive in `rocCurve`, since both rules call at or above one half.",
  "Neither function will take it: a probability exactly on the threshold is refused by both of them."],
 "Each rule draws its own boundary. `predict` gives class 1 only above 0.5, so exactly 0.5 is class 0; `rocCurve` calls a row positive at a score at or above the threshold. Neither refuses a score on its boundary.")

# ------------------------------------------------------------ m05 matrix

# 30 m05
q(3, "Averaging the two labels' recalls with one vote each gives which figure on EKENE-3, EKENE-5 and EKENE-7?",
 "0.969697, the unweighted mean of 0.939394 and 1.000000.",
 ["0.955556, the recall of each label weighted by its support.",
  "0.928571, the mean of the two labels' precisions.",
  "0.945913, the mean of 0.968750 and 0.923077 over both labels."],
 "Macro averages give each label one vote: recall 0.939394 for non-pay and 1.000000 for pay give 0.969697. 0.955556 is the weighted recall, 0.928571 the macro precision and 0.945913 the macro F1.")

# 31 m05
q(1, "In the four-row case with true labels sand, shale, sand and lime, all predicted sand, what does `undefinedRatios` list?",
 "The precision of lime and the precision of shale.",
 ["The recall of lime and of shale, two labels never found.",
  "The precision of sand, the only label ever predicted.",
  "Nothing at all, since every label occurs in yTrue."],
 "Shale and lime are never predicted, so their precisions are 0 / 0; the engine scores each zeroDivision and lists both in `undefinedRatios`. Their recalls have supports of 1 and are 0 by the counts, and sand's precision is 2 over 4, a defined 0.5.")

# 32 m05
q(2, "Scored by 2TP / (2TP + FP + FN), which label comes out ahead on EKENE-3, EKENE-5 and EKENE-7?",
 "Non-pay, at 0.968750 against 0.923077 for pay.",
 ["Both labels equally, since each F1 in a binary report equals the accuracy 0.955556.",
  "Pay, at the 0.945913 macro F1.",
  "Pay, whose recall of 1.000000 lifts its F1 above that of the other label."],
 "F1 = 2TP / (2TP + FP + FN): non-pay reads 0.968750 from TP 62, FP 0 and FN 4, and pay 0.923077 from TP 24, FP 4 and FN 0. 0.945913 is the macro F1 of both labels, and neither label's F1 is the accuracy.")

# 33 m05
q(0, "In the binary pay report, what does label 1's false positive count become when read from label 0's side?",
 "Label 0's false negatives, which is why non-pay's recall reads 62 / 66.",
 ["Label 0's true positives, since the four rows were called correctly for label 0.",
  "Label 0's true negatives, the 62 rows called non-pay correctly.",
  "A count of its own, since the engine tallies every label from rows of its own."],
 "In a binary report the two labels' rows are the same four counts read from each side. The 4 non-pay rows called pay are false positives for pay and false negatives for non-pay, which is why non-pay's recall is 62 / 66.")

# 34 m05
q(3, "Which weighted average equals the accuracy as an identity, for any labels?",
 "The weighted recall: weighting TP / support by support and dividing by n leaves the sum of TP over n.",
 ["The weighted F1, which reads 0.956571 on the pay test wells beside an accuracy of 0.955556.",
  "The weighted precision, 0.961905, because each label's precision already counts its correct calls.",
  "Every weighted average, since weighting by support always cancels whatever the labels hold."],
 "Weighting each label's recall TP / support by its support and dividing by n gives the sum of TP over n, which is the accuracy; the engine asserts a difference of 0. The weighted F1, 0.956571, and the weighted precision, 0.961905, divide by other denominators and carry no such identity.")

# 35 m05
q(3, "In the engine's layout, what do the row sums of the pay confusion matrix give?",
 "The supports: 66 non-pay rows and 24 pay rows.",
 ["62 and 28, the counts of rows the model predicted as 0 and as 1.",
  "True positives of each label, 62 for non-pay and 24 for pay.",
  "The 4 wrong calls, split by label."],
 "matrix[i][j] counts rows whose true label is labels[i] and predicted label labels[j], so a row sums every prediction for one true label: the supports, 66 and 24. The column sums, 62 and 28, are the rows predicted 0 and 1, and the diagonal holds 62 and 24.")

# 36 TWO-MODULE m05 + m06
q(0, "Which ratio from the pay report is the ROC curve's true positive rate at a threshold?",
 "The recall of pay at that threshold: TP / (TP + FN).",
 ["The accuracy of all the calls made at that threshold, taken over the 90 test rows.",
  "The F1 of pay at the threshold, which balances the two ratios read from the matrix.",
  "The precision of pay, the share of rows called pay at the threshold that are pay."],
 "The ROC curve plots the true positive rate, which is the recall of pay, against the false positive rate as the threshold is lowered. Precision divides by the rows called pay, accuracy counts both classes, and F1 mixes precision and recall.")

# 37 TWO-MODULE m05 + m06
q(2, "At the one half threshold the recall of pay is 1.000000, yet the AUC is 0.997475. How can both hold?",
 "Every pay row clears one half, but some non-pay rows outscore some pay rows: 4 of 1584 pairs are lost.",
 ["A recall of 1.000000 is always paired with an AUC below 1 by the trapezoid rule.",
  "The AUC is taken on the training wells and the recall on the test wells, so the two differ.",
  "The AUC counts clipped rows as errors, and the recall has no clip to count."],
 "Recall reads one threshold: all 24 pay rows score above one half. AUC reads the whole ranking: over the 1584 (pay, non-pay) pairs the pay row scores higher in 1580, 0.997475. Only a non-pay row scored above one half can outrank a pay row, so the lost pairs come from the 4 non-pay rows called pay. Both are on the test wells, and no row was clipped.")

# ------------------------------------------------------------ m06 ROC and log loss

# 38 m06
q(2, "How many (pay, non-pay) pairs does the pair reading of the AUC compare on the pay test wells?",
 "1584, every pairing of 24 pay rows with 66 non-pay rows.",
 ["1580, the pairs in which the pay row scores higher.",
  "91, one pair for each point of the curve and its start.",
  "90, one pair for each test row, matched to its nearest neighbour."],
 "Every pay row is paired with every non-pay row: 1584 pairs. The pay row scores higher in 1580 of them, which gives 0.997475, and 91 is the count of curve points.")

# 39 m06
q(1, "How many rows does the engine clip when it scores the log loss of the pay test wells?",
 "0: no probability on the test wells reaches the clip.",
 ["4, one for each false positive of pay at one half.",
  "3, the rows at exactly 0 or 1 in the engine's case.",
  "All 90, since every probability is clipped to [eps, 1 - eps]."],
 "The engine reports 0 rows clipped for the test log loss of 0.115676. A row is clipped only when its probability lies outside [eps, 1 - eps]; the 3 clipped rows belong to the four-row case with probabilities of exactly 0 and 1, and a false positive at 0.817561 is charged without a clip.")

# 40 m06
q(3, "The six-row tie case has scores 0.1, 0.4, 0.4, 0.8, 0.8 and 0.2. How many points does the engine's ROC curve carry?",
 "5: four distinct scores give four points, after the null-threshold origin.",
 ["7, one point per row plus the start at (0, 0).",
  "4, one for each distinct score and no extra start.",
  "6, one point for each row of the case."],
 "The engine places one point per distinct score, starting at (0, 0) with threshold null. Four distinct scores, 0.8, 0.4, 0.2 and 0.1, plus the start give 5 points, and tied rows move together as one point.")

# 41 m06
q(3, "In the four-row log loss case with yTrue 1, 0, 1, 0, what is the fourth row, y 0 with probability 0.3, charged?",
 "0.356675, which is -ln(1 - 0.3), as its label is 0.",
 ["34.538776, the charge the clip sets for a confident miss.",
  "Nothing: only clipped rows are charged, and 0.3 needs no clip.",
  "9.99e-16, the charge on an unclipped row of the case."],
 "A row with y = 0 is charged -ln(1 - p), here 0.356675. 34.538776 is the third row's charge, a pay row given exactly 0 and clipped to 1.00e-15, and 9.99e-16 is the charge on each of the two confident right rows, which are clipped too.")

# 42 m06
q(2, "Two test rows share one probability exactly, one pay and one non-pay. What does the engine's ROC curve do at that score?",
 "It takes one diagonal step: equal scores are one threshold and their rows move together.",
 ["It splits the tie by row order, stepping up for the pay row first and then across for the non-pay row.",
  "It refuses the curve, since a threshold holding both classes has no defined point.",
  "It drops the two tied rows before the curve is drawn and scores the rest."],
 "In the engine's own words, \"equal scores are one threshold: their rows move together, a diagonal step when the classes are mixed\". A tied pair counts one half toward the AUC; the engine neither orders the rows nor refuses or drops them.")

emit(Q, '/root/dai-wip-mlcore/banks/d2i_exam.json', expect_n=42)
finish()
