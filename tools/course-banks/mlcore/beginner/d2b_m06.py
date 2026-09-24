import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Associate m06, One Well Held Out.
# Sources: digest sections 2 (the Ekene wells, their seed and the planted
# structure), 5 (the shuffled order at seed 5) and 10 (the one-well workflow,
# the five held-out wells seed by seed, scaling inside the workflow). Every
# figure is printed there. The EKENE-3 against EKENE-8 comparison is arithmetic
# on the RMSE and R-squared that section 10 prints, and nothing more.

q(1, "The one-well workflow makes five calls: split, fit, predict, score the held-out well, score the training rows. Why must the split come first?",
 "It decides which rows may shape anything fitted later, so no fitted number has seen the held-out well.",
 ["The engine demands it, since `ols` refuses any rows that did not arrive through a split call first.",
  "Splitting after the fit would change the coefficients, since least squares refits on the rows it scores.",
  "A later split draws a fresh seed each time, so the same well could never be held out twice in a row."],
 "The split decides which rows are allowed to influence anything. Every later step either fits on the training rows or is applied to the held-out well, so a scaler, a feature choice or any other fitted number computed before the split has let the held-out well shape the model. `ols` takes whatever rows it is given, scoring never refits a model, and the seed is whatever the caller states."),

q(3, "`groupSplit` is called on the nine sonic wells with nTestGroups 1 and seed 5. What does it hand back?",
 "One test well, EKENE-8, with its 30 rows, and 8 training wells with 240 rows.",
 ["Three test wells, EKENE-4, EKENE-5 and EKENE-8, since seed 5 always holds out the teaching split's wells.",
  "A refusal, since nTestGroups 1 leaves too few test rows for least squares to be scored on a well.",
  "One test well, EKENE-1, the first name of the sorted list, with 240 rows left to train the model."],
 "nTestGroups 1 asks for exactly one well, the first of the shuffled order, and at seed 5 that order begins with EKENE-8. All 30 of its rows go with it and the other eight wells train on 240 rows. The teaching split holds out three wells because its size comes from the fraction 0.3. EKENE-1 heads the sorted list only before the shuffle, and one well of 30 rows is scored without complaint."),

q(0, "The one-well workflow prints two R-squared values, 0.709438 and 0.832560. How is each one named?",
 "0.709438 is the training fit about the training mean; 0.832560 is EKENE-8 about its own mean.",
 ["0.709438 is EKENE-8 about the training mean; 0.832560 is the same well about the mean of its own DT.",
  "Both belong to EKENE-8, the first before the scaler is applied and the second after the scaler is fitted.",
  "Either may be quoted for this model, as both describe the one plane fitted to eight wells."],
 "0.709438 is the R-squared of the fit on its 240 training rows about the training mean, the figure step 2 and step 5 both print. 0.832560 is taken on EKENE-8's 30 rows about EKENE-8's own mean, the engine's default for a test score. Scaling leaves a least squares plane unchanged, and the two figures describe different rows against different references, so each is quoted with both named."),

q(2, "With EKENE-8 held out, the training rows score an RMSE of 5.462405 us/ft and EKENE-8 scores 3.765285. What may a report conclude?",
 "That EKENE-8 happens to sit close to this plane; the figure describes that one well on this draw.",
 ["That the model will do better on new wells than on its training wells, as the lower RMSE shows.",
  "That the split leaked, since a held-out well cannot score better than the rows that fitted the plane.",
  "That the training RMSE is inflated by rounding, and the two figures agree once both are rounded to two places."],
 "The held-out well scores better than the training rows on this draw, as the teaching split's three test wells did. That is a fact about EKENE-8 and seed 5. A single well is one reading, and other wells score worse: EKENE-2 reads 7.260092 us/ft. A whole-well split shares no well, and the gap between 3.765285 and 5.462405 is far larger than rounding."),

q(0, "Held out one at a time, five wells score RMSEs from 3.564857 us/ft (EKENE-3) to 7.260092 (EKENE-2). How should one of them be quoted?",
 "With its well and its seed: each is how the model did on that one well.",
 ["As the model's RMSE, since any one held-out well gives a fair and complete test of the fitted model.",
  "By the lowest, 3.564857, since the seed can be chosen and a report should show the model at its best.",
  "By their plain average only, since a single well is too small for its RMSE to be meaningful at all."],
 "The same model form, fitted on eight wells each time, misses a new well by an amount that depends on the well. A figure quoted alone, without its seed and its well, claims more than it knows. Choosing the seed with the best score hides the other wells, and a single well's RMSE is a real reading of that well; it simply is not the whole story."),

q(3, "EKENE-3 reads RMSE 3.564857 us/ft and R-squared 0.736197 about its own mean; EKENE-8 reads RMSE 3.765285 and R-squared 0.832560. How can the well with the smaller misses read the lower R-squared?",
 "EKENE-3's own DT varies less about its mean, so misses of a similar size are a larger share of its spread.",
 ["The two R-squared values use different references, EKENE-3 the training mean and EKENE-8 its own mean.",
  "It cannot, so one of the two held-out fits must have been scored on the training rows by mistake.",
  "R-squared rises with the RMSE, so the well with the larger misses must also read the higher R-squared."],
 "About a well's own mean, R-squared compares the well's squared misses with the spread of its measured DT about its own average. EKENE-3's misses are slightly smaller, yet they take a larger share of a smaller spread, so its R-squared is lower. Both figures are about each well's own mean. R-squared falls as the misses grow against a fixed spread, and RMSE needs no reference at all."),

q(1, "With EKENE-8 held out, the GR coefficient is 0.320501 us/ft per gAPI; the teaching fit, three wells held out, gives 0.288005. Why do they differ?",
 "Each is fitted on a different set of training wells, eight in one and six in the other.",
 ["One of the two was fitted on standardised logs, and standardising changes the coefficient's unit.",
  "The seed enters the least squares sums, so a new seed gives a new coefficient.",
  "The teaching fit is wrong, since only the fit with the most training wells gives GR's true coefficient."],
 "The two fits use different rows: eight training wells, 240 rows, against six, 180 rows. A coefficient describes the plane fitted to its rows, so it moves when the wells change, and fitting on different wells shows that movement directly. Both are raw fits in us/ft per gAPI. The seed only chooses the wells, and neither figure is the true one."),

q(2, "The table of held-out wells lists seeds 1, 2, 3, 4 and 6. Why does seed 5 not appear?",
 "It holds out EKENE-8, which seed 1 already holds out, and the table lists the first seed for each well.",
 ["A refusal: seed 5 cannot be paired with nTestGroups 1, since the seed and the size are fixed together for this split.",
  "The course never ran it, keeping seed 5 for the teaching split with three wells held out.",
  "EKENE-6 is what it holds out, the well with no sonic, so there is no measured DT to score against."],
 "The table lists the first seed that holds out each of five different wells. Seed 5 holds out EKENE-8, the same well as seed 1, so it would add no new row; it is in fact the seed of the workflow's own first step. No seed is refused for a size, and EKENE-6 is never among the nine sonic wells a sonic split draws from."),

q(2, "A write-up of the teaching fit gives the split as `groupSplit`, test fraction 0.3, seed 5. Why does the course also ask for the names of the wells on each side?",
 "The seed alone tells a reader nothing about which wells were held out until the call is run again.",
 ["Because the engine's seeds can change between runs, so the seed may not reproduce the same wells.",
  "So the reader can check the scoring without having to trust that the seed was ever run at all.",
  "Because a named well list lets the reader skip the split, since the fit can then be copied directly."],
 "The seed fixes the draw, and anyone with the same wells and the same call gets the same wells back. But a reader cannot see from the number 5 that EKENE-4, EKENE-5 and EKENE-8 were the test wells without rerunning the call, and row counts beside well counts show how much evidence the fit rests on. A seeded draw repeats exactly, and the well list replaces neither the split nor the fit."),

q(0, "Which sentence belongs in a write-up of a least squares fit to the Ekene wells?",
 "The field is synthetic, so any check against a planted value is one no real field allows.",
 ["The test RMSE of 4.282693 us/ft is the error on any new well of the field.",
  "The standard errors are exact, as 180 rows far outnumber 4 coefficients.",
  "The coefficients rank the logs by importance, with NPHI's 138.783590 by far the most important log."],
 "The course asks for three sentences on what the numbers do not claim: the test score is one draw of wells, the standard errors assume independent residuals that rows of one well do not give, and the field is synthetic. A test RMSE describes the wells it was measured on, the row count does not make residuals independent, and a coefficient's size depends on its feature's unit."),

q(3, "On the way to a fit, the scaler refused a feature that was constant on the training rows, and you dropped it. What does the course ask the write-up to do?",
 "Record the refusal and the decision taken, so a reader who reruns the work knows why the feature went.",
 ["Keep the feature listed with a coefficient of zero, which is how least squares treats a constant.",
  "Refit on all rows so that the feature varies, and report that fit so the refusal does not recur.",
  "Leave it out entirely, since a refused call produced no result and so has nothing to report."],
 "A reader who reruns the work will meet the same refusal, and a note of what was decided tells them. Leaving it out hides a choice that changed the model. A dropped feature has no coefficient at all, and fitting on every row to dodge the refusal would let the held-out wells shape the scaler."),

q(1, "In the Ekene field, which method finds the well-level sonic offset each well adds to its DT samples?",
 "The mean least squares residual of each well, with the logs alone as features.",
 ["Min-max scaling fitted on the nine sonic wells, which maps the offset rows above 1.",
  "The refusal `ols` gives at the first null target, which names the well by its row.",
  "The pay rule, since a well with a larger offset carries more pay rows than the others."],
 "Grouping the residuals of a fit on the logs alone by well shows each well sitting above or below the plane as a block, which is the planted offset. Min-max above 1 is how EKENE-6's hot shale is found, the null-target refusal is how the no-sonic well is found, and the pay rule reads PHIC and RT, which the offset does not touch."),

q(3, "The Ekene wells are drawn with the canonical mulberry32 on the stated seed 20260913. What does that give a learner?",
 "The same file anywhere: the same inputs give the same rows, so every printed figure can be reproduced.",
 ["A different field on every run, so each learner practises on fresh rows while the course numbers change.",
  "Rows sampled at random from a real well database, the seed recording which wells.",
  "A field whose rows match the real Ekene logs, which the seed was chosen to reproduce as closely as possible."],
 "One stated seed and the one canonical mulberry32 give the same rows on any machine, which is why every figure in the course can be checked by rerunning the call. The Ekene field is synthetic: its offsets and its withheld sonic exist only because they were drawn, and no real well database is sampled."),

q(0, "If the one-well workflow standardises the features, where does the scaler belong?",
 "In step two, fitted on the 240 training rows and applied unchanged to EKENE-8.",
 ["Before step one, fitted on all 270 sonic rows so that EKENE-8 shares the scale.",
  "In step four, fitted on EKENE-8's 30 rows just before the held-out well is scored.",
  "At the end, after scoring, since scaling changes nothing a least squares fit returns."],
 "The scaler is fitted in the fitting step, on the same training rows as the model, and applied unchanged to the held-out well. Fitted before the split it has seen EKENE-8, and fitted on EKENE-8 it lets the well shape its own transform. For least squares the predictions are the same either way up to rounding, but the coefficients change units, so the scaler is part of the model and is fitted with it."),

q(1, "EKENE-6 has GR, RHOB and NPHI on every row but no sonic. What can the one-well workflow do with it in a real field?",
 "Predict its DT from its logs, though with no measured DT there is nothing to score the prediction against.",
 ["Hold it out with nTestGroups 1 and score it like any other well, since its logs are all present.",
  "Nothing at all, since `predict` refuses any row whose DT is null, even when the model has been fitted.",
  "Fit on it with the other eight wells, since the null DT values are filled from the training mean."],
 "`predict` needs only the fitted model and the rows' features, so EKENE-6's DT can be predicted. Scoring needs a measured target, and EKENE-6 has none: every DT sample is null, and `ols` refuses a null target by name, so the well can neither train nor be scored. The engine fills no missing value."),

emit(Q, '/root/dai-wip-mlcore/banks/d2b_m06.json', expect_n=15)
finish()
