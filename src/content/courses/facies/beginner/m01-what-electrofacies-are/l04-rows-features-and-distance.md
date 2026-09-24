# Rows, features and distance

{{panel:ef-cluster-explorer}}

A row is one depth sample, and its features are its logs. Every method in this course compares two rows by one number, the Euclidean distance between them: take the difference on each log, square it, add the squares over the logs and take the square root. Rows a short distance apart read alike, and rows a long way apart read differently. Grouping rows into clusters is nothing more than deciding which rows are near.

| from row 0 (sandstone) to row | core facies | raw distance | share of the squared raw distance from GR | scaled distance |
| --- | --- | --- | --- | --- |
| 6 | shaly-sand | 10.905782 | 0.998940 | 1.048512 |
| 13 | limestone | 21.355833 | 0.976184 | 4.174924 |
| 28 | shale | 58.419443 | 0.999334 | 3.333330 |

## A distance on the raw logs

Row numbers here count the 180 cored rows from 0; rows 0, 6, 13 and 28 are the first sample of each facies. Measured on the raw logs, row 0 lies 10.905782 from the shaly-sand, 21.355833 from the limestone and 58.419443 from the shale. The shale is far away mainly because its gamma ray is high.

The share column says how much of each squared raw distance comes from GR alone. It is at least 0.976184 on all three pairs. GR is in gAPI and differs by tens of units between facies, while RHOB and NPHI differ by hundredths and PEF by units. So a raw distance is mostly a gamma ray distance. The density, neutron and photoelectric logs barely move it, and the limestone, which differs from sandstone on every one of them, sits nearer to row 0 than the shale does.

## The same rows on scaled logs

Standardise each log first, with the centre and the population standard deviation (divisor n) fitted on the 180 cored rows, and every log is measured in the same standard units. Now row 0 lies 1.048512 from the shaly-sand, 4.174924 from the limestone and 3.333330 from the shale. The limestone has become the farthest row, as its density and photoelectric factor say it should be. GR's share of the squared scaled distance falls to 0.024880 for the limestone pair.

## The nearest other row

For each of the 180 cored rows the engine can find the nearest other cored row and ask whether it has the same core facies.

| distance measured on | nearest other row has the same facies | has another facies |
| --- | --- | --- |
| raw logs | 161 | 19 |
| standardised logs | 173 | 7 |

Scaling moves 12 more rows next to a row of their own facies, out of 180. Nothing about the rock changed between the two lines of the table. Only the units in which the distance was measured changed, and that decided which rows are neighbours. Scaling decides which rows are near, and so which rows cluster together.

## A rule for writing about distance

In this course a distance is on the scaled logs unless the text says raw, and every distance is quoted with its scaling. A raw distance of 10.905782 and a scaled distance of 1.048512 describe the same pair of rows in different units, and neither means anything without its scaling.

## Exercise

Open the cluster explorer on the view "The nearest rows, raw and scaled". Set the row to 0, the nearest rows to list to 5 and the scaling to none. Write down the rows and their raw distances. Switch the scaling to standard and write down the new list. Then remove GR from the logs, keep the scaling at none, and compare the list once more with the standardised one. Write two sentences on which log decided the raw neighbours, and why the standardised list differs from both.
