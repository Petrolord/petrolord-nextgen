# Why test data must be unseen

{{panel:ml-fit-explorer}}

Least squares chooses its coefficients to make the misses on the training rows as small as possible. No other set of coefficients could miss those rows by less, because they chose the coefficients. Scoring a model on them tells you how well it was fitted. It does not tell you how well it will predict the next well, which is the only reason anyone builds it.

| scored on | rows | RMSE (us/ft) | R-squared | reference mean (us/ft) |
| --- | --- | --- | --- | --- |
| training rows (fitted values) | 180 | 5.758010 | 0.683457 | 105.883333 |
| test wells, about the test mean | 90 | 4.282693 | 0.815322 | 105.214444 |

## What "test" means in this course

The word is legislated. A test row is a row the model was not fitted on, and in this course a test set is a whole well held out, unless the text names a random-row split. The table above shows why. The same fit gives two different RMSEs on two sets of rows, and each answers a different question.

The training row score answers: how closely does the plane sit on the rows that chose it? The test well score answers: how far off is the plane on wells it has never met? Only the second is about a new well.

## Why the unit of "unseen" is a well

Rows are not independent of each other inside a well. Each Ekene well carries its own sonic offset, added to every DT sample, so a well sits above or below the others as a block. Module five measures those blocks in the residuals of a fit on all 270 sonic rows: the mean residual of a well ranges over 12.562737 us/ft from the lowest well to the highest.

So a row one foot away from a training row in the same well is barely new. It shares the well's offset, and it sits a foot from a row the model already saw. A score on such rows mixes two things: how the rule does on the rock, and how much it has already met this well. A new well brings its own offset, and nothing in the training rows can have seen it. That is why this course holds out whole wells.

## A test score is still one draw

The teaching split holds out EKENE-4, EKENE-5 and EKENE-8. On those three wells the test RMSE, 4.282693 us/ft, is lower than the training RMSE of 5.758010. The held-out wells happen to sit close to the fitted plane. A different seed holds out different wells and gives a different score. Module five comes back to this; for now, the lesson is that "unseen" makes a score honest about its question, and one split still gives one reading.

## The engine's side of the bargain

The engine cannot know which rows you later score on. It makes the split explicit and repeatable and prints its rule; the record of what you fitted and scored is yours. Every result in this tier is quoted with its split.

## Exercise

Open the fit explorer on the least squares view with its defaults: features GR, RHOB and NPHI, target DT, test fraction 0.3, seed 5. Read the Test RMSE and Training RMSE tiles and check them against the table. Then change the seed to 1, 2 and 3 in turn. For each seed, write down the test wells named on the tile and both RMSEs, and mark which of the two RMSEs is lower.
