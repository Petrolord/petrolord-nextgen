# Forecasting from the series alone

{{panel:pf-smoothing-explorer}}

A data-driven forecast extends a rate series from its own history. It reads the months a well has produced and carries the pattern forward. This lesson sets out what that means in this course, which methods the engine offers, and what it leaves to other tools and other courses.

## Three methods, all exponential smoothing

The engine fits three methods, and each is exponential smoothing: a running estimate of the series updated one month at a time, with the newest month weighted most.

| method | name in the engine | what it keeps track of |
| --- | --- | --- |
| simple exponential smoothing | `ses` | a level |
| Holt's linear trend | `holt` | a level and a trend |
| the damped trend | `damped` | a level and a trend that flattens |

All three are additive: the trend is added to the level, and an error is added to a forecast. When this course says "machine learning" it names the method by what it is. Here that is exponential smoothing, with parameters fitted by least squares.

## What fitting means

Each method has one to three parameters: alpha for the level, beta for the trend, and phi for the damping. A parameter you give is held fixed. A parameter you leave out is fitted, which means the engine searches for the value that makes its one-step forecasts closest to the months already seen, measured by the sum of squared errors. On EKENE-P1, with every parameter left free, the three methods reach these sums:

| method | fitted parameters | SSE |
| --- | --- | --- |
| ses | alpha 1.000000 | 49562.030000 |
| holt | alpha 0.661937, beta 0.381513 | 23041.767516 |
| damped | alpha 0.657029, beta 0.353869, phi 0.960949 | 22288.217610 |

These figures are in-sample. They say how closely each method followed months it had already seen. Whether a method forecasts months it has not seen is a separate question, answered with tests the Professional tier teaches. An Associate forecast is always reported as in-sample until such a test has been run.

## What the engine does not do

The engine is deliberately narrow, and knowing its edges keeps a forecast honest.

- It fills no missing month. A null is refused by name.
- It builds no seasonal smoothing (Holt-Winters), no multiplicative form, no ARIMA and no neural network.
- It runs no regression of rate on other variables such as choke or pressure. The machine learning course teaches regression.
- It fits no decline curve of its own. The decline curve analysis course teaches Arps decline, and a later tier of this course imports that engine as a baseline.
- It computes no reserves, no EUR and no cumulative production. It forecasts a rate at each future step.

## Why use the series alone

A decline curve assumes a shape. A reservoir model needs pressures, rock and fluid data. Exponential smoothing assumes only that recent months say more about next month than old ones do, and it lets the data set how much more. That makes it quick to run on every well in a field, and easy to check by hand, since each month's update is one line of arithmetic. It also means the method cannot see a workover coming, or a facility limit, or a shut-in. The history holds all it knows.

## Exercise

In the smoothing explorer choose "Three methods on one series" and start from EKENE-P1. Read each method's parameters and its SSE. Then choose "Fit a method", pick holt, leave alpha and beta blank, and confirm the fitted values match. Finally give alpha and beta the fitted values yourself and check the SSE does not change.
