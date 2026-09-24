# Standardising with the population standard deviation

{{panel:ml-fit-explorer}}

A standard deviation has two common divisors. The population standard deviation divides the sum of squared deviations by n, the number of rows. The sample standard deviation divides by n - 1. This engine's scaler uses the population standard deviation unless you ask otherwise, and in this course the words "standard deviation" always come with their divisor.

| feature | scale, training rows (population SD, n) | scale, training rows (sample SD, n - 1) |
| --- | --- | --- |
| GR | 22.375203 | 22.437616 |
| RHOB | 0.142322 | 0.142719 |
| NPHI | 0.033503 | 0.033597 |

## How far apart the two are

On the 180 training rows of the teaching split the sample scale is larger than the population scale by the factor sqrt(180 / 179), which is 1.002789. The same factor holds for every feature, because it depends only on n. With fewer rows the gap grows; with many rows it shrinks towards nothing. The table shows it feature by feature.

A scaled value divides by the scale, so a z computed with the sample standard deviation is smaller than one computed with the population standard deviation, by that same factor.

## The engine's choice, in its words

The basis of every standard scaler names its divisor:

> population standard deviation (n), as scikit-learn StandardScaler

So a scale from this engine matches the one scikit-learn's StandardScaler computes on the same rows. The option `sd: 'sample'` divides by n - 1 instead. Any other value is refused, and the message names both choices:

> sd must be 'population' or 'sample'

## Why this needs saying at all

The data quality course computes its z-score with the sample standard deviation, n - 1. This course's scaler uses the population standard deviation, n. Both are correct statements of what each tool does, and a number from one will not match a number from the other unless the divisor is named. Quote a scale as "the population standard deviation of the 180 training rows", and a reader can reproduce it exactly.

## A feature that does not vary

A scale of zero would make every z a division by zero. The engine refuses a feature as constant when every one of its training values is identical, and names it. A well-level attribute is constant down a well, so fitted on the rows of one well it is refused:

> X.mudWeight has zero variance on the 30 training rows (every value is 9.4): standardising would divide by zero, so drop the feature or fit on rows where it varies

The field is `X.mudWeight`, and the 9.4 in the message is the one mud weight of the well it was fitted on, repeated on each of its 30 rows. The same feature varies across the nine sonic wells and is fitted there. Whether a feature is constant depends on the rows the scaler is fitted on, which is the subject of the next lesson.

## Exercise

Open the fit explorer on the scaling view with its defaults. Read the scale of each feature with the standard deviation set to population, then switch it to sample and read them again. For GR, divide the sample scale by the population scale and compare the ratio with 1.002789. Then paste a small table of your own with rows from at least two wells, a well column, a GR column and a mudWeight column that holds one value on every row, set the features to GR and mudWeight, and copy the refusal and its field.
