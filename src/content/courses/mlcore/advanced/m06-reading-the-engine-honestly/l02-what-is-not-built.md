# What is not built

{{panel:ml-diagnose-explorer}}

Reading an engine honestly means knowing what it does not do as well as what it does. This engine fits linear models only: least squares, ridge and binary logistic regression. This lesson lists what is not built, and then reads the boundary of each rule the engine does build, because each rule draws its own boundary and nothing about them is global.

| rule | boundary |
| --- | --- |
| refuse a constant feature | only when every training value is identical |
| min-max applied to a new row | no clipping: a row outside the training range maps outside [0, 1] |
| test size ceil(f x count) | a product within 1.00e-9 of a whole number is that number |
| 2 <= k <= number of groups | k equal to the number of groups is allowed |
| more rows than coefficients | n = p is refused |
| refuse the scaled condition number above maxCondition | exactly at the limit is fitted |
| logistic converged at a full step at most tol | inclusive |
| halve a step that lowers the penalised log likelihood | strict |
| logistic class 1 | a probability above 0.5; exactly 0.5 is class 0 |
| log loss clip to [eps, 1 - eps] | a probability equal to eps is kept |

## What is not built

There is no tree, forest, boosting, neural network, neighbour rule or clustering. Clustering and facies belong to the electrofacies course. There is no multiclass logistic regression and no nonlinear feature expansion: a curved relationship enters only if you build the feature yourself, and the conditioning module showed what powers of one variable do to a design.

There is no prediction interval and no sampling of inputs. The only random draws are the seeded shuffles of the splits and of permutation importance; uncertainty propagation is its own course's.

There is no imputation. A missing value is refused by name, and filling or dropping it is the caller's decision. The data quality course is where that decision is made well.

There is no stratified split and no time-ordered split. Forecasting a rate series, where the order of the rows is the point, is its own course's.

And there is no search over lambda or features. The engine does not choose the model. A course or an app runs the folds and prints the scores it compared, as the missing-log module did.

## Why the list matters

A claim about what a model can do has to be checked against this list. A result from this engine is a linear model with a stated method; it is never a tree, never a forecast and never an interval. When a report says the sonic was predicted "by machine learning", this course names the method: ridge regression at lambda 10 on three logs.

## Boundaries, rule by rule

Every boundary in the table is a real call or the engine's basis, and they go both ways. The condition limit fits a value exactly at the limit and refuses only one strictly above it. The logistic stop is inclusive: a step exactly at tol stops the fit. The step halving rule is strict: a fall of exactly the allowance is not halved. A logistic probability of exactly 0.5 is class 0. A constant feature is refused only when every training value is identical: [2, 2, 2.0000000001] is fitted, with a scale of 4.71e-11, and [2, 2, 2] is refused. The log loss keeps a probability equal to eps, so p = 1.00e-15 clips 0 rows and p = 1.00e-16 clips 1.

One boundary stated for the whole engine would be wrong for some of these, so read them one rule at a time.

## Exercise

Open the panel on the condition view and build a table of your own with one feature that tests the rule of more rows than coefficients at its boundary: first with as many rows as coefficients, the intercept included, then with one more. Copy the field the refusal names, and confirm that the second call is fitted. Then pick one other row of the boundary table and design a call in the panel that lands exactly on its boundary.
