# Standardising with the population standard deviation

{{panel:ef-cluster-explorer}}

Standard scaling puts every log in the same units by subtracting its centre and dividing by its spread: z = (x - centre) / scale. After it, each log has mean 0 and a population standard deviation of 1 on the rows it was fitted on, whatever its original unit. k-means takes this scaling by default. The engine's scaler is the machine learning engine's own, fitted on the rows clustered, and its scale is the population standard deviation, divisor n.

| log | centre (mean) | scale, population SD (n) | sample SD (n - 1), for comparison |
| --- | --- | --- | --- |
| GR | 56.871111 | 32.041141 | 32.130517 |
| RHOB | 2.466911 | 0.136949 | 0.137331 |
| NPHI | 0.193239 | 0.096603 | 0.096872 |
| PEF | 3.114444 | 1.275647 | 1.279206 |

## The engine's words

The basis of every standard scaling reads:

> z = (x - mean) / population SD per feature (ml.js fitStandardScaler), fitted on the rows clustered

Two choices sit in that sentence. The divisor is n, the number of rows, which gives the population standard deviation. And the scaler is fitted on the rows clustered, here the 180 cored rows, so the centre and scale belong to those rows and to no other set.

## Population against sample

The sample standard deviation divides by n - 1 and is larger. On the 180 cored rows it is larger by the factor 1.002789 on every log, which is the square root of 180 over 179. For GR that turns 32.041141 into 32.130517. The difference is small at this many rows, and it is still a different number. Quote a scale with its divisor, every time, so that a reader checking your work in another tool knows which figure to expect.

The course uses the other divisor in one place. The correlation form of principal components standardises each log with the SAMPLE standard deviation, so that its eigenvalues add to the number of logs. Clustering uses the population one. Say which.

## One row, scaled

Row 0 of the cored rows, a sandstone, reads GR 48.900000 gAPI. Its standard score on GR is (48.900000 - 56.871111) / 32.041141, which comes to -0.248777 with the scaler the engine fitted: about a quarter of a standard deviation below the centre. Across its four logs row 0 reads -0.248777, -1.335619, 0.328781 and -1.140162 in standard units, so its density and photoelectric factor now sit farther from their centres than its gamma ray does. On the raw logs they were almost invisible.

## What scaling does not do

It does not decide which logs matter for the rock. It makes each log's spread equal, so a log with a wide spread and no rock signal counts as much as one that separates the facies cleanly. That is one more reason the caliper is left out before scaling. Scaling is a choice with a default, and the default is written down with the result.

## Exercise

Open the cluster explorer on the view "Standard and min-max scaling". Keep the cored rows and the four logs. Read the centre and scale of each log with the standard deviation set to population, then switch it to sample and read them again. For each log, divide the sample scale by the population scale and write down what you find. Then delete every row of EKENE-6 from the table and note which of the centres and scales move.
