# Probabilities and log odds

{{panel:ml-validate-explorer}}

Least squares could predict PAY directly as a number, but its predictions would run below 0 and above 1, and a straight line is a poor shape for a quantity that must stay between them. Logistic regression keeps the straight line and changes what it predicts.

## Two scales for one quantity

The model builds a linear score, exactly as least squares does:

eta = b0 + b1 x1 + b2 x2 + ...

and turns it into a probability of PAY = 1 with the logistic function:

p = 1 / (1 + exp(-eta))

At eta = 0 the probability is one half. As eta rises the probability climbs toward 1 and never reaches it; as eta falls it sinks toward 0. So eta can be any number, and p always lies strictly between 0 and 1.

Run the function backwards and eta is ln(p / (1 - p)), the natural log of the odds. That is why eta is called the log odds, and why every logistic coefficient is read as a change in log odds per unit of its feature. The model is linear on the log odds scale and curved on the probability scale.

## How the fit is judged

A least squares fit makes the sum of squared residuals as small as it can. A logistic fit makes the log likelihood as large as it can: the sum over the training rows of ln p for each pay row and ln(1 - p) for each non-pay row. The engine finds the coefficients by an iterative method whose details belong to the Expert tier; on the Ekene pay fit it converged.

The Ekene fit on the 210 training rows of the pay split, with RHOB, NPHI and RT:

| quantity | value |
| --- | --- |
| log likelihood | -24.507027 |
| deviance, -2 x log likelihood | 49.014054 |
| deviance of the intercept-only model | 267.335951 |

The deviance is -2 times the log likelihood; lower is better. An intercept-only model predicts the same probability for every row, and its deviance is 267.335951. With the three features the deviance falls to 49.014054. That fall is how much the logs explain of the label on the training rows.

## Predictions on the test wells

The first five rows of EKENE-3, a test well, rows 60 to 64 of the 300 rows, counted from 0:

| row | depth (ft) | RHOB | NPHI | RT | probability | class | PAY |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 60 | 7923 | 2.165000 | 0.283000 | 1.250000 | 0.068312 | 0 | 0 |
| 61 | 7924 | 2.428000 | 0.227000 | 27.700000 | 0.817561 | 1 | 0 |
| 62 | 7925 | 2.271000 | 0.280000 | 1.750000 | 0.026632 | 0 | 0 |
| 63 | 7926 | 2.155000 | 0.302000 | 1.240000 | 0.063221 | 0 | 0 |
| 64 | 7927 | 2.510000 | 0.222000 | 2.800000 | 0.004802 | 0 | 0 |

Four rows with low resistivity get low probabilities and are labelled 0, correctly. Row 61 reads 27.700000 ohm.m, far above the RT cutoff, and the model gives it 0.817561. Its PAY is 0: the rule's porosity half failed there, and the model, which sees porosity only through density and neutron, did not catch it.

## What a probability here means

Each probability is the model's probability of PAY = 1 for that row, under the stated rule, fitted on seven training wells. It is a score the next two modules will cut at a threshold, count in a confusion matrix, rank in a ROC curve and judge with log loss.

## Exercise

Open the logistic view with the default pay table and features, penalty 0, fraction 0.3, seed 5. Read the deviance and confirm 49.014054. Then remove RT from the features and fit again, and read the new deviance. Write down both, and one sentence on what the change says about which log carries the resistivity half of the rule.
