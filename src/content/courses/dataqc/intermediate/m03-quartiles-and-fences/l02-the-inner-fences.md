# The inner fences

{{panel:dq-outliers-explorer}}

John Tukey's fences put a boundary a fixed number of interquartile ranges outside the middle half of the data. The lower fence is Q1 - k IQR and the upper fence is Q3 + k IQR. With k = 1.5 they are the inner fences, and a value strictly outside either one is flagged. The engine's `iqrFences` uses k = 1.5 and R7 quartiles by default, and names both in its basis block.

EKENE-7's water sand gamma ray, entries 130 to 199:

| setting, stated | Q1 | Q3 | IQR | lower fence | upper fence | entries flagged |
| --- | --- | --- | --- | --- | --- | --- |
| R7, k 1.5 (the defaults) | 31.947500 | 38.642500 | 6.695000 | 21.905000 | 48.685000 | 170 |
| R6, k 1.5 | 31.817500 | 38.737500 | 6.920000 | 21.437500 | 49.117500 | 170 |

The flagged entries are EKENE-7 entries, counted from the start of the log. Entry 170 is a planted spike: sixty gAPI added inside the sand.

## Reading the fences

At the defaults the fences sit at 21.905000 and 48.685000 gAPI. Every sample of the water sand but one lies between them, and entry 170 lies above the upper fence. Under R6 the IQR is wider, 6.920000 against 6.695000, so both fences move outwards to 21.437500 and 49.117500, and the same single entry is flagged.

The fences answer a question about the middle half of the data: is this value far outside the range where most of the sand sits? Because the quartiles are order statistics, like the median, one spike cannot drag them far. The fences see entry 170 on the sand, where the z-score on the whole log reads it at 0.900269 and flags nothing.

## The same rule on the whole log

Run the defaults on the whole gamma ray log, shale and sand together, and the fences are -57.070000 and 186.810000 gAPI. They flag 0 entries. The spike at entry 170 reads 90.590000, and that is inside a spread that includes the shale.

Nothing is wrong with the rule in either run. On the whole log it asks whether a value is extreme for a mixture of shale and sand, and 90.590000 gAPI reads like shale. On the water sand alone it asks whether a value is extreme for that sand, and there it is. The interval you choose is part of the question, and the engine runs the rule on whatever series it is given.

A lower fence of -57.070000 gAPI is a hint that the series mixes two populations. The Associate tier's definitional limits already flag a negative gamma ray reading; the fence is only about how far a value sits from the rest.

## The fences on the teaching series

At their defaults the fences flag entry 7 on the EKENE-3 gauge and entry 8 on the EKENE-7 core plugs, the same entries the modified z-score flags. Module six sets every method side by side on those series.

## Stating the fence

A report that quotes a Tukey flag should state four things: the quartile rule, k, the interval or series the quartiles came from, and the two fences.

## Exercise

Open the explorer's fences view with the water sand gamma ray at R7 and k 1.5. Confirm the fences 21.905000 and 48.685000 and the single flag at entry 170. Switch to R6 and confirm 21.437500 and 49.117500. Then compute by hand Q3 + 1.5 IQR from the R7 quartiles in the table and check it against the upper fence. Write the one line you would put in a report for this flag.
