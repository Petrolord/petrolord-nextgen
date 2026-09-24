# Min-max scaling

{{panel:ef-cluster-explorer}}

Min-max scaling is the other common way to put logs on one footing. It maps each log's minimum to 0 and its maximum to 1 on the fitted rows: (x - min) / (max - min). Every log then runs across the same interval, whatever its unit. The engine offers it as `scale: 'minmax'`, through the machine learning engine's own min-max scaler, fitted on the rows clustered.

| log | min | max | range (the min-max scale) |
| --- | --- | --- | --- |
| GR | 10.100000 | 141.200000 | 131.100000 |
| RHOB | 2.229000 | 2.705000 | 0.476000 |
| NPHI | 0.019000 | 0.412000 | 0.393000 |
| PEF | 1.360000 | 5.330000 | 3.970000 |

## The engine's words

Its basis reads:

> (x - min) / (max - min) per feature (ml.js fitMinMaxScaler), fitted on the rows clustered

The table holds the minimum, maximum and range of each log on the 180 cored rows. Row 0, the first sandstone, reads GR 0.295957, RHOB 0.115546, NPHI 0.524173 and PEF 0.075567 after min-max scaling, computed with the fitted minimum and range.

## Two rows decide the scale

Standard scaling uses every row to set its centre and spread. Min-max scaling uses two rows per log, the lowest and the highest. Move one extreme reading and the whole log is rescaled. That makes min-max sensitive to a single unusual sample. A bad spike should be conditioned out before either scaler is fitted, which is the data quality course's work.

## Nothing is clipped

A row outside the fitted range maps outside [0, 1]. The engine does not clip it back. Scale the 30 rows of EKENE-7, the uncored well, with the min-max scaler fitted on the cored rows:

| log | lowest scaled EKENE-7 value | highest scaled EKENE-7 value |
| --- | --- | --- |
| GR | 0.058734 | 0.656751 |
| RHOB | 0.044118 | 0.970588 |
| NPHI | 0.040712 | 0.844784 |
| PEF | 0.068010 | 1.035264 |

EKENE-7's highest PEF scales to 1.035264, above 1, so at least one of its rows reads a photoelectric factor above anything in the cored wells. Every other figure in the table lies between 0 and 1, so on GR, RHOB and NPHI the well stays inside the range of the cored rows. Clipping would have hidden the one log where it does not. A value above 1 or below 0 is a message: this row lies outside the rows the scaler was fitted on, and the clusters built on those rows have never seen anything like it.

## The same k-means, min-max scaled

k-means with k 4, seed 3 and ten starts, min-max scaled, gives clusters of 29, 54, 54 and 43 rows and an inertia of 4.258929. Standard scaling gives 29, 59, 54 and 38 rows and 58.289042. Two of the clusters come back with the same centres in log units under both scalings; the other two shift. The two inertias are in different units and cannot be compared with each other.

## Choosing between them

Neither scaler is right in general. Standard scaling is the engine's default, and every row helps set its centre and spread. Min-max scaling keeps every fitted value in a fixed interval and makes an out-of-range row obvious. Pick one, state it with the result, and compare inertias only within it.

## Exercise

Open the cluster explorer on the view "Standard and min-max scaling" and read the minimum, maximum and range of each log for the cored rows. Then find the row with the highest GR in the table, change its GR to double its value, and read the table again. Write down which of the two scalers moved and by how much. Finally, on the view "k-means, start by start", set the scaling to min-max and compare the cluster sizes with the standard run.
