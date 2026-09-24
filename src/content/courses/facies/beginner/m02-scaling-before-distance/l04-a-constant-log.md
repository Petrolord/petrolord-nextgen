# A constant log

{{panel:ef-cluster-explorer}}

Standard scaling divides by a log's standard deviation, and min-max scaling divides by its range. A log that reads the same value on every row has a standard deviation of 0 and a range of 0, and dividing by zero gives nothing a distance can use. The engine does not guess a way round it. The scaler refuses the log by name, and the call returns no clusters and no components.

| call | scaling | field named |
| --- | --- | --- |
| `kmeans` on GR and a caliper reading 8.5 on all 30 rows of EKENE-1 | standard | `X.CALI` |
| `kmeans` on the same rows | min-max | `X.CALI` |
| `pca` on the same rows | the correlation form | `X.CALI` |

## The refusal, in the engine's words

Pass GR and a caliper that reads 8.5 in on all 30 rows of EKENE-1 to `kmeans` with standard scaling, and the engine says:

> X.CALI has zero variance on the 30 rows passed (every value is 8.5): standardising would divide by zero, so drop the feature or fit on rows where it varies

With min-max scaling the same rows give:

> X.CALI has zero range on the 30 rows passed (every value is 8.5): min-max scaling would divide by zero, so drop the feature or fit on rows where it varies

The standard scaler says "zero variance" and the min-max scaler says "zero range". Each names the log and the value it read.

## Whose words these are

k-means and principal components scale the logs through the machine learning engine's own scalers, so a constant log is refused in that engine's words. The words count the rows the scaler was fitted on. In `pca` and `kmeans` those are every row passed, and the message says "on the N rows passed": here, the 30 rows passed. `pca` refuses the same rows with the same message.

## Why the caliper

A caliper in a gauge hole can read close to one value over a long interval. The Ekene caliper varies from row to row; the refused call replaces it with a constant 8.5 in, which shows that a log's variation depends on the rows you pass.

## The two ways out

The message names both. Drop the feature: if a log does not vary on these rows it cannot help to separate them, and the caliper carries no rock signal anyway. Or fit on rows where it varies: pass a wider set of rows, so that the scaler sees a spread. Which one is right depends on why the log is flat, and either way the choice is written down with the result.

## When every column is flat

Principal components on the covariance matrix skip the scaling and use each log's own spread. Pass one cored row twice, so that every column is constant, and `pca` refuses the whole table:

> X has zero total variance (every column is constant), so there are no principal components

The field there is `X`, since no single log is at fault.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Replace the table with the 30 rows of EKENE-1 carrying only the columns well and GR, add a column CALI that reads 8.5 on every row, and set the logs to GR and CALI. Read the refusal with the scaling at standard and again at min-max. Then change one CALI value to any other reading and run it again. Write down what the engine now returns and whether the caliper should stay in the logs.
