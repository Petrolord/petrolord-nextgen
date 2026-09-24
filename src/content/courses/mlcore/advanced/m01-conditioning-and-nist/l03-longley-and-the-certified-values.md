# Longley and the certified values

{{panel:ml-diagnose-explorer}}

An engine that fits least squares needs a check that does not come from the engine. The NIST/ITL Statistical Reference Datasets supply one. For each linear least squares problem NIST publishes certified coefficients, certified standard deviations, a certified residual standard deviation and a certified R-squared, all computed in multiple precision. The engine is run on the same inputs and compared with those certified values, digit by digit. This lesson reads the comparison, and Longley is the case to start with.

| dataset | rows | coefficients | scaled condition number | smallest coefficient LRE | R-squared LRE |
| --- | --- | --- | --- | --- | --- |
| Norris | 36 | 2 | 2.800505 | 14.06 | 15.48 |
| Pontius | 40 | 3 | 18.446824 | 13.51 | 15.95 |
| NoInt1 | 11 | 1 | 1.000000 | 14.72 | 15.65 |
| NoInt2 | 3 | 1 | 1.000000 | 15.34 | 15.95 |
| Longley | 16 | 7 | 43275.043587 | 14.62 | 15.48 |
| Wampler1 | 21 | 6 | 2220.208496 | 16.00 | 16.00 |

## Longley, the classic test

Longley's problem dates from 1967 (Longley, Journal of the American Statistical Association 62, 819 to 841). It fits one economic series on six others over 16 rows, 7 coefficients with the intercept, and it is a hard design: its scaled condition number is 43275.043587. That is far above the 193.359232 of the three Ekene logs on the teaching split, and far below the refusal limit of 1.00e+8, so the engine fits it at the default.

On Longley the engine's smallest coefficient LRE is 14.62, and it reproduces the certified R-squared to 15.48 digits. The last lesson of this module defines an LRE exactly. For now read it as the number of leading significant digits on which the engine and the certified value agree: 14.62 means at least fourteen of them, for every one of the seven coefficients.

## What the check is and is not

The certified values were computed by NIST in multiple precision from the published data, and the comparison runs the engine on those same published inputs. Every dataset in the table above agrees with its certified coefficients to at least 13 significant digits, and the same holds for every NIST problem the engine was run on except one, Filip, which has its own lesson.

A check like this says the arithmetic is right on hard problems whose answers are known independently. It says nothing about whether a linear model is the right model for a well, whether the rows were split by wells, or whether a feature leaks. Those are the questions the rest of this course asks. The reference problems answer a narrower question: when the engine prints a coefficient, are its digits the digits least squares actually gives?

## The easy problems are checks too

Norris is a straight line, 36 rows and 2 coefficients, with a scaled condition number of 2.800505. NoInt1 and NoInt2 fit a single coefficient with no intercept, so they exercise the path of a fit without the column of ones, and their one-column designs read a scaled condition number of 1.000000. Pontius, 40 rows and 3 coefficients, reads 18.446824. Wampler1 has 21 rows and 6 coefficients, and its smallest coefficient LRE reads 16.00, and 16 is the cap the measure puts on agreement, reached when the two are identical in float.

## Exercise

Open the panel on the condition view. Paste a table of your own with two columns in which the second is the first plus a small noise, fit it, and read the scaled condition number. Then make the noise smaller and fit again. Write down both numbers and the maxCondition at which your second design would be refused, and compare them with Longley's 43275.043587.
