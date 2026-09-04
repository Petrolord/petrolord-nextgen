# Cadence and the moving average

Nothing in a ledger row says how often the well reports. `seriesCadenceDays` works it out after the fact, from the gaps between the dates, and returns the median of them.

{{panel:pd-ledger-explorer}}

## A median, not a mean, and it can land between two real gaps

Derived cases, one series each:

| The gaps, in days | seriesCadenceDays |
| --- | --- |
| 1, 1, 1, 1 | 1.000000 |
| 1, 1, 30, 30 | 15.500000 |
| 30, 31, 30, 31, 30 | 30.000000 |
| 30, 31, 31, 30, 31, 20 | 30.500000 |
| 7, 7, 7 | 7.000000 |
| 1 | 1.000000 |
| a single point | null |

The second row is the one to keep. A median over an even count averages the two middle gaps, so the cadence comes back as 15.500000 days on a series where no gap was ever fifteen and a half days. The last row is the refusal: one point has no gaps, and the function returns null rather than guessing.

On the published surveillance case, `surveillance_cases.json` commits a cadence of 1.000000 days for I-1, O-1, P-1, P-2, P-4 and P-5, and 30.000000 days for P-3.

## The moving average is over a date window

`movingAverage` takes a window in days, not a count of points, which is what lets a daily ledger and a monthly one both average real time. Published values on the golden well, oil over 7 days: 900.000000000 at index 0 on 2025-05-15, 862.857142857 at index 40 on 2025-06-24, and 555.714285714 at index 46 on 2025-06-30.

## A window shorter than the cadence averages one point

The teaching field OGUTA is invented for this course, neither real nor published, and its well OGUTA-14 files six period rows. The same six rows, averaged over five window widths, in stb over a row:

| windowDays | The averaged series, stb |
| --- | --- |
| 7 | 26400, 25600, 24800, 24000, 23200, 11600 |
| 30 | 26400, 25600, 24800, 24000, 23200, 17400 |
| 45 | 26400, 26000, 25200, 24400, 23600, 19600 |
| 90 | 26400, 26000, 25600, 24800, 24000, 20900 |
| 200 | 26400, 26000, 25600, 25200, 24800, 22600 |

At 7 days the output is the input. Every window holds exactly one point, so the average of it is the point itself, and nothing on the chart says the smoothing did nothing. Those figures are volumes over a row, not rates.

## The mistake

Quoting a smoothed number without the window that made it. The final point of that series reads 11600 stb, 17400 stb, 19600 stb, 20900 stb or 22600 stb depending only on the window width, and every one of the five is the same function on the same rows.

## Exercise

Read the cadence of P-3 and of P-4 in the panel and write both down with the point count beside each.

Then say what `seriesCadenceDays` returns for a series of one point, and why the 15.500000 case cannot correspond to any gap in its own series.
