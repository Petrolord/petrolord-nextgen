# A rate series, month by month

{{panel:pf-smoothing-explorer}}

Every forecast in this course starts from one list of numbers: a well's monthly average oil rate in bbl/d, oldest month first. That list is a rate series, written y, and each entry is y_t, the rate in month t. Nothing else goes in. Before any method is fitted, it pays to read the series itself, month by month, and to know exactly how its months are counted.

## Counting months from 0

The engine counts months from 0. Month 0 is the first month on production, month 1 the second, and a well with 48 months of history ends at month 47. Every index in this course follows that rule, so when a lesson names a month it says so plainly: month 22, counted from 0, is the twenty-third month the well produced. Every array the engine returns is indexed the same way, and reading the wrong entry by one is the easiest mistake to make. A forecasting method in this course sees only y: no choke setting, no pressure, no water cut.

Here are the first six months of EKENE-P1, the course's teaching well:

| month t | rate y_t (bbl/d) |
| --- | --- |
| 0 | 1176.100000 |
| 1 | 1153.400000 |
| 2 | 1078.600000 |
| 3 | 1005.200000 |
| 4 | 954.800000 |
| 5 | 934.200000 |

The well falls from 1176.100000 bbl/d in month 0 to 934.200000 bbl/d in month 5, and by month 47, its last month, it produces 211.400000 bbl/d. The decline is not perfectly smooth: month 10 reads 734.800000, above month 9's 705.100000. A monthly average carries noise, and a forecasting method has to decide how much of each new month to believe.

## What one entry means

Each y_t is an average rate over a calendar month, in bbl/d. The engine forecasts a rate at each future step; it computes no cumulative production and no reserves. A rate of 0 is a real value, a month the well was shut in, and the course meets one on EKENE-P2.

## Plain arrays in, results out

The engine takes plain arrays and returns a result with a `basis` block naming the convention it used. When an input is wrong it returns `error` and `field` instead, and a later lesson in this module reads those refusals.

One rule shapes everything that follows. A missing month is never filled for you. If the series carries a null or a value that is not a finite number, the engine refuses the whole call and names the first index it met. Whether to fill that month, or to drop it, is your decision, and the data quality course teaches how to condition rates before they reach a forecast.

## Exercise

Open the smoothing explorer, choose the view "Fit a method" and pick EKENE-P1 under "Start from an Ekene well". Read the series box. Count the values and confirm the last one sits at month 47, counted from 0. Find months 9 and 10 and note which is higher. Then replace one value with a dash, run the fit, and read the field the engine names in its refusal.
