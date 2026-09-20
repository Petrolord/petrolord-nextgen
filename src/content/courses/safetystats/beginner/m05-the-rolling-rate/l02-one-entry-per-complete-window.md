# One entry per complete window

{{panel:ss-rates-explorer}}

AKASO has 15 months of data and a twelve month window. The engine returns 4 rolling rates: 1.208038, 1.209454, 1.207931 and 1.306019. It returns one entry per complete window, and none for the first eleven months, which have no complete window yet.

| window | months | rolling rate | months without hours |
| --- | --- | --- | --- |
| 1 | 1 to 12 | 1.208038 | 1 |
| 2 | 2 to 13 | 1.209454 | 1 |
| 3 | 3 to 14 | 1.207931 | 1 |
| 4 | 4 to 15 | 1.306019 | 1 |

## Why no partial windows

A rolling twelve month rate at month 6 would have to be built from six months. It would be printed beside rates built from twelve, with the same label, and it would carry half the exposure. A reader could not tell it apart from a full window. So the engine returns nothing until the first window is complete, and then one entry each time the window moves forward. From 15 months with a window of 12 that makes 4 entries.

This is the engine's rule, and it is simple to check. The number of entries is the number of periods, less the window, plus one. Count the entries in any rolling series the engine returns, and if the count is wrong, the window or the data are not what you thought.

## A window longer than the data

If the window is longer than the whole series, no complete window exists, and the engine refuses:

> windowPeriods is longer than the series: no complete window exists

A twelve month window over eight months of data would produce nothing, and the engine says so with the field named. It does not shorten the window to fit, because a rate labelled as a twelve month rate should be one.

## The shutdown month

Every AKASO window reports one month without hours. Month 5 was a shutdown: 0 hours and 0 recordables. It sits inside window 1, window 2, window 3 and window 4, because each of those windows runs from before month 5 to after it. In the rolling rate it adds nothing to the count and nothing to the hours, so it changes nothing. In the mean of the monthly rates it is left out, because a month with no hours has no rate. The column counting months without hours tells the reader it was there.

That count is worth reading. A window that reports several months without hours is a window with less exposure than its label suggests, and its rate rests on fewer hours than a full year of work.

## Exercise

Take AKASO's 15 months and a window of 12. Work out how many complete windows exist and check your answer against the 4 entries in the table. Then open the rates explorer's rolling view, type AKASO's months with a window of 12, and confirm the fourth entry reads 1.306019. Finally, set the window longer than the series and copy the refusal it prints.
