# The NIST worked examples

{{panel:dq-outliers-explorer}}

The engine's outlier rules are checked against published worked examples from the NIST/SEMATECH e-Handbook, which the golden records as anchors.

| NIST example | printed | engine |
| --- | --- | --- |
| 1.3.5.17.1 uranium, Grubbs G, one-sided max | 2.4687 | 2.468765 |
| 1.3.5.17.1 uranium, critical at alpha 0.05 | 2.032 | 2.031652 |
| 1.3.5.17.1 uranium, reject | yes | true |
| 7.2.6.2 silicon wafers, 0.9 quantile by R6 | 95.1981 | 95.198070 |
| 7.2.6.2 silicon wafers, 0.9 quantile by R7 | 95.1957 | 95.195680 |
| 7.2.6.2 silicon wafers, 0.9 quantile by R8 | 95.1972 | 95.197243 |

## The uranium example

NIST's uranium isotope example has 8 values and tests the largest one with Grubbs' test, one-sided, at alpha 0.05. The engine's G is 2.468765, the same figure as the largest absolute z-score of the eight values, and its critical value is 2.031652. G is above it, so the test rejects, as NIST's does.

## A printed figure that was truncated

NIST prints G as 2.4687. The engine reads 2.468765, and rounded to four decimals that is 2.4688. The printed figure was truncated rather than rounded. The engine reproduces it within the stated allowance, and the difference is a note about a published page. The critical value is printed as 2.032, which is 2.031652 rounded to three decimals.

This matters when a reader checks the engine against the book. A match to the last printed digit is not always possible, and a disagreement in the fourth decimal can be the page's rounding rather than an error in the calculation.

## The quantile anchors

The silicon wafer resistivities are twelve values, and NIST prints their 0.9 quantile by each of the three rules. The engine matches the golden exactly for all three, and each engine figure rounds to the one NIST printed.

## A figure in a reason string

A second kind of printed figure lives inside the engine's own output. Every flag carries its figures twice, as numeric fields and inside a reason sentence, and the reason prints each figure as the shortest decimal that reads back to its field. For a computed statistic that means every digit. The population standard deviation case from module one, nine zeros and a one at threshold 2.9, returns a flag whose reason reads, in the engine's words:

> value 1 has z = 2.9999999999999996, beyond the threshold 2.9

Its `statistic` field, printed at six decimals, is 3.000000. The two agree. The reason shows the value the computer holds, and the field at six decimals is what this course quotes. A lesson or a report quotes the field, and quotes a reason only as the engine's own words.

## What to take away

Printed figures, from a handbook or from a reason sentence, carry a rounding rule of their own. When you check a result, compare at the precision the source actually printed, and say which figure you quoted.

## Exercise

Using the table, round the engine's G of 2.468765 to four decimals, then cut it to four decimals without rounding, and say which of the two NIST's printed 2.4687 matches. Then open the explorer's z view, type nine zeros and a one with the population standard deviation and threshold 2.9, and read the flag's `statistic` field and its reason side by side. Write one sentence saying which of the two you would quote in a report.
