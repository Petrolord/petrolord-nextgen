import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Associate m05, Fit Metrics and Residuals.
# Sources: digest sections 3 (the regressionMetrics refusal), 8 (RMSE, MAE and
# R-squared on the teaching split, the two references, the per-well scores,
# the engine's worse-than-mean case) and 9 (residuals of the 270-row fit well
# by well, the planted offsets, the span, the residual sum). Every figure is
# printed there.

q(2, "Which statement about RMSE and MAE on the test wells is right?",
 "Both read in us/ft; RMSE squares each miss before averaging and rooting, and MAE averages the size of each miss.",
 ["RMSE reads in us/ft, and MAE is a unitless fraction of the variation about the mean of the test targets.",
  "Both are fractions of the variation about a reference mean, so each has to name its reference when quoted.",
  "MAE squares each miss while RMSE takes it at face value, so it is MAE that weighs a large miss more."],
 "RMSE = sqrt(sum (y - yhat)^2 / n) and MAE = sum |y - yhat| / n, both in the target's unit, us/ft. They need no reference to be read. R-squared is the score that is a fraction of variation about a reference mean. It is RMSE that squares the misses."),

q(0, "A few rows of a well are badly predicted while the rest are close. Which score rises more?",
 "RMSE, because it squares each miss before averaging, so a large miss counts for more.",
 ["MAE, since it takes every miss at face value and so cannot hide a large one inside an average.",
  "Neither moves more than the other, since both average the same misses over the same rows.",
  "R-squared, which alone of the scores is built from squared misses and so follows the large ones."],
 "RMSE squares each miss before averaging, so one large miss counts for more in it than several small ones of the same total size; MAE takes every miss at face value. When a few rows are badly predicted, RMSE rises more than MAE. The two average the same misses in different ways, and RMSE is built from squared misses as surely as R-squared is."),

q(3, "On the teaching split the test RMSE is 4.282693 us/ft and the training RMSE is 5.758010. How can a model score better on wells it never saw?",
 "The three held-out wells happen to sit close to the plane; a training score is no ceiling on a test score.",
 ["The test RMSE divides by its 90 rows and the training RMSE by 180, which keeps the test figure smaller than the training one.",
  "Through the scaler the model saw the test wells, which pulled them onto the fitted plane.",
  "It cannot: a test RMSE below the training RMSE shows the split leaked, so the fit must be redone."],
 "Least squares makes the training misses as small as a plane can, but the training wells may simply be harder to fit than the test wells, and which wells land on which side is the draw. The held-out wells score 4.620664, 4.627312 and 3.501687 on their own. RMSE is a root mean, so its row count does not shrink it. This fit uses no scaler, and a whole-well split shares no well."),

q(1, "On the three test wells, R-squared is 0.815322 about the test mean and 0.816151 about the training mean, while the RMSE is 4.282693 both times. What changed between the two R-squared values?",
 "Only the reference in the denominator; the misses in the numerator are identical.",
 ["Refitted predictions, since the model is fitted again about each reference mean before the score is taken.",
  "The rows, since the second value adds the 180 training rows to the 90 test rows it scores.",
  "Each miss, since the training mean is subtracted from every prediction before it is scored."],
 "R-squared = 1 - SSE / sum (y - reference)^2. The SSE is the same, which is why RMSE and MAE are unchanged at 4.282693 and 3.526103; only the reference mean in the denominator moved, from 105.214444 to 105.883333 us/ft. Nothing is refitted, both are scored on the same 90 test rows, and the predictions are untouched."),

q(0, "When `regressionMetrics` scores the test wells with no `referenceMean`, which mean is R-squared taken about?",
 "The mean of the test targets themselves, 105.214444 us/ft, as scikit-learn's r2_score does.",
 ["The training mean, 105.883333 us/ft, since a new well is judged against the training average.",
  "Zero, since R-squared without a reference compares the misses with the raw sizes of the targets.",
  "The mean of the predictions, so that R-squared measures how the plane varies about itself."],
 "The default reference is the mean of the test targets, and the basis says, in the engine's words, \"1 - SSE / sum (y - mean of these y)^2 (scikit-learn r2_score); negative when worse than that mean\". The training mean, 105.883333, is used only when it is passed as `referenceMean`, the out-of-sample convention. Neither zero nor the mean of the predictions is a reference the engine uses."),

q(2, "The engine's own case sets true values 1, 2, 3 against predictions 3, 2, 1 and returns R-squared -3.000000. What does a negative value mean?",
 "The predictions do worse than the reference mean would; R-squared has no lower bound.",
 ["The engine has made an error, since R-squared is a share of variation and must lie between 0 and 1.",
  "The predictions run the wrong way, and its size, 3.000000, is the figure a report should quote.",
  "The RMSE with a sign attached, the misses being two, zero and two."],
 "R-squared is not bounded below. A negative value is a real result: the predictions do worse than simply predicting the reference mean. The engine prints it as it is, and a report quotes it as it is, sign and all. The RMSE of that case is 1.632993 and its MAE 1.333333, separate scores."),

q(3, "A test set whose DT reads the same on every row is scored with `regressionMetrics`. What happens?",
 "A refusal on `yTrue`: with zero variance, R-squared about its mean is undefined.",
 ["R-squared comes back as 0, since the predictions can explain none of a variation of zero.",
  "It returns an R-squared of 1, since every prediction then misses the mean by the same amount.",
  "RMSE and MAE are returned with R-squared left out, and a note is added to the basis block."],
 "The engine's own words are: \"yTrue has zero variance (every value is equal), so R-squared about its mean is undefined\". The denominator of R-squared about the test mean would be zero, so the engine returns no score at all. It does not substitute 0 or 1, and it does not return part of a result."),

q(1, "Scored well by well, the teaching split's test wells read RMSE 4.620664 (EKENE-4), 4.627312 (EKENE-5) and 3.501687 (EKENE-8). What is the pooled test RMSE of 4.282693?",
 "A figure over all 90 rows together, in which a well with larger misses pulls the pool up.",
 ["The plain mean of the three well RMSEs, which weighs each well equally whatever its misses.",
  "The RMSE of the middle well, which the engine reports as the typical well of the three.",
  "EKENE-8's RMSE rounded up by the pooling of all the rows into one figure."],
 "The combined test RMSE pools the squared misses of all 90 rows before the root, so each row counts once and a well with larger misses pulls it up. It is no average of the three well RMSEs and no single well's score. Each well's own RMSE is a statement about that well."),

q(3, "Least squares fitted on all 270 sonic rows leaves EKENE-9's residuals averaging 6.733268 us/ft and EKENE-2's averaging -5.829469. What does that show?",
 "Each well sits above or below the plane as a block, which a pooled score such as RMSE hides.",
 ["Those two wells hold outliers the fit could not reach, which should be removed before any refit.",
  "The fit is biased high, since the residuals stop summing to zero once an intercept is included.",
  "The two wells were logged in different units of slowness, which one plane cannot reconcile."],
 "Grouping the residuals by well shows what the score hides: each well sits above or below the plane as a block. In the Ekene field the cause is the sonic offset each well adds to every DT sample. The residuals of the fitted rows still sum to zero overall, -1.99e-12 us/ft, which is rounding. Every well's DT is in us/ft, and nothing here marks a row as an outlier."),

q(0, "Across the nine sonic wells, the well mean residuals of the 270-row fit run from EKENE-2's -5.829469 up to EKENE-9's 6.733268. What is their span, and what drives it?",
 "12.562737 us/ft, driven by the sonic offset each well adds to every DT sample.",
 ["0.637253 us/ft, the largest gap between a well's mean residual and its planted offset.",
  "5.333216 us/ft, the residual standard error, which sets how far apart the wells can sit.",
  "0.728027, the fit's R-squared, which is the measure of how far apart the wells sit."],
 "The well means span 12.562737 us/ft from the lowest to the highest, and each well's mean tracks its planted offset. 0.637253 is the largest gap between a mean residual and its planted offset, the check that the method recovers the structure. 5.333216 is the residual standard error of the fit and 0.728027 its R-squared; neither measures the spread of the wells."),

q(1, "The course prints each well's planted offset, less the nine-well mean, beside its mean residual, and the largest gap is 0.637253 us/ft, for EKENE-7. What does the check show, and why can it be made at all?",
 "The mean residual per well recovers the planted structure closely; only a synthetic field comes with offsets to compare.",
 ["The fit is wrong for EKENE-7, whose offset should be taken out of its data before the model is refitted.",
  "Every real field carries a stated offset per well, and the check compares the fit with that record.",
  "The engine reads the planted offsets and corrects the fit with them, so the gaps show what it missed."],
 "The largest gap between a well's mean residual and its planted offset is 0.637253 us/ft, so grouping residuals by well recovers the planted blocks closely. The offsets are printed less the nine-well mean because the intercept absorbs that mean. No real field comes with such a column, and the engine never sees it: the check is possible only because the Ekene field was drawn with the structure on purpose."),

q(2, "With an intercept, the residuals of the 270-row fit sum to -1.99e-12 us/ft. What does that figure mean?",
 "Zero up to rounding: the plane balances its fitted rows as a whole, though whole wells still sit above or below it.",
 ["Each well's residuals also sum to zero, so no well sits above or below the plane on average, however its rows were drawn.",
  "The fit carries a small bias of -1.99e-12 us/ft per row, which should be added to each prediction.",
  "The intercept was dropped, since only a fit through the origin leaves residuals that small."],
 "With an intercept the residuals of the fitted rows sum to zero up to rounding, and -1.99e-12 us/ft over 270 rows is rounding in the arithmetic. It says the plane misses high as much as it misses low, in total. It says nothing of each well: the well means run from -5.829469 to 6.733268. The intercept is what makes the total zero."),

q(0, "The 270-row fit reports R-squared 0.728027 about its own mean and a residual standard error of 5.333216 us/ft. What do those two figures say about the well blocks?",
 "Nothing: only grouping the residuals by well shows that the misses are organised by well.",
 ["That no blocks exist, since an R-squared that high is impossible with wells sitting off the plane.",
  "That the blocks span 5.333216 us/ft, since s is the typical distance of a well from the plane.",
  "Every well is fitted to within 0.728027 us/ft, the R-squared read as a typical miss."],
 "The fit looks ordinary, and nothing in its R-squared or its residual standard error says the misses are organised by well. Grouping the residuals shows it: the well means span 12.562737 us/ft. s is the typical size of a row's miss, and R-squared is a fraction, never a distance in us/ft."),

q(3, "Three R-squared values belong to the teaching fit: 0.683457, 0.815322 and 0.816151. How must each be quoted?",
 "With its rows and its reference mean: training rows about the training mean, test wells about the test mean, test wells about the training mean.",
 ["As one figure, their average, since all three belong to the one fitted plane and describe the same model.",
  "By the largest alone, 0.816151, since a report should show the model at its best and leave the rest out.",
  "By the training value alone, since a test R-squared depends on a reference mean and so cannot be trusted."],
 "The course's rule for the word: an R-squared names its rows and its reference mean. 0.683457 is the training fit about the training mean; 0.815322 the test wells about the test mean; 0.816151 the test wells about the training mean. Averaging them mixes different rows and yardsticks, and choosing one silently hides what it measured. A test R-squared is trustworthy once its reference is named."),

q(1, "About each well's own mean, EKENE-8 reads R-squared 0.855184 and EKENE-4 reads 0.735001, with RMSEs of 3.501687 and 4.620664. What does a per-well R-squared compare?",
 "That well's misses with the spread of its own DT about its own average, so it depends on how much the well varies.",
 ["Its misses against the training misses, so a value above the training R-squared marks a better well.",
  "The well's RMSE against the pooled test RMSE of 4.282693, taken as the ratio of the two figures on the 90 test rows.",
  "Its mean residual against its planted offset, which is why each well is given its own value."],
 "About a well's own mean, R-squared compares the well's squared misses with the spread of its measured DT about its own average, so the same misses read as a higher R-squared in a well whose sonic varies more. RMSE needs no reference. Neither the training misses, the pooled RMSE nor a planted offset enters the per-well figure."),

emit(Q, '/root/dai-wip-mlcore/banks/d2b_m05.json', expect_n=15)
finish()
