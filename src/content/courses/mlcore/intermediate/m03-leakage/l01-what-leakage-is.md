# What leakage is

{{panel:ml-validate-explorer}}

A test score is meant to answer one question: how well does the model do on data it was not fitted on? Leakage is anything that lets information about the test rows reach the model, or its preparation, before it is scored. The score then answers an easier question than the one asked, and it can read better than the model deserves.

## The question a well log model faces

A sonic model is built to predict DT in a well that has no sonic. Such a well is new: none of its rows was in training. The test that matches that use holds out whole wells. In this course "test" means exactly that, a whole well held out, unless the text names a random-row split.

On the 270 sonic rows, test fraction 0.3 and seed 5:

| split | test rows | training rows | wells with test rows | wells on both sides |
| --- | --- | --- | --- | --- |
| `randomRowSplit` | 81 | 189 | 9 | 9 |
| `groupSplit` | 90 | 180 | 3 | 0 |

Under the random-row split every one of the nine wells has rows on both sides. The engine lists them in `sharedGroups` and states the purpose of the function in its own words: "leakage demonstration only: rows of one well can fall on both sides (sharedGroups); use groupSplit or groupKFold to score a model".

## Why rows of one well are not independent

The Associate tier fitted least squares on all nine sonic wells and grouped the residuals by well. Each well sat above or below the fitted plane as a block: the well means of the residuals span 12.562737 us/ft from the lowest to the highest. Every Ekene well carries its own sonic offset. A model that has seen some rows of a well has seen part of the answer for the rest.

## Leakage needs a path

Rows of one well on both sides of a split are an opportunity for leakage. It becomes leakage only when the model has a way to use it: some feature, or some preparation step, that lets what it learned about a well's training rows reach that well's test rows. This module shows three cases on the Ekene wells.

* Features that name a well, the four well-level attributes, give the model a path. The random split then flatters it on every seed tried.
* The logs alone give no such path. The random split then flatters nothing: on these wells it reads worse than the well split on 7 of 12 seeds.
* A scaler fitted on every row lets the test wells shape the transform itself. The effect is small here, and the procedure is still wrong.

The rule: score a model on whole wells it has never seen, through a preparation fitted on the training wells only.

## Exercise

Open the validate explorer's view of a random-row split against a well split, with the default features, test fraction 0.3 and seed 5. Read the training and test rows of each split and the count of wells on both sides, and confirm the table above. Write one sentence naming the path by which a model could use the shared wells, and one naming what the well split removes.
