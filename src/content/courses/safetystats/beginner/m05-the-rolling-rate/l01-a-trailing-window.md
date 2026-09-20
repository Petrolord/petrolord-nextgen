# A trailing twelve month window

{{panel:ss-rates-explorer}}

The AKASO stream runs for 15 months. Its first twelve months hold 13 recordables in 2152250 hours, and the engine's rolling rate for that window is 1.208038 per 200,000 hours. The formula line reads sum(counts in window) x base / sum(exposureHours in window). A rolling rate is a pooled rate taken over a window of periods, and the window moves forward one period at a time.

| window | months | count | hours | rolling rate |
| --- | --- | --- | --- | --- |
| 1 | 1 to 12 | 13 | 2152250 | 1.208038 |
| 2 | 2 to 13 | 13 | 2149730 | 1.209454 |
| 3 | 3 to 14 | 13 | 2152440 | 1.207931 |
| 4 | 4 to 15 | 14 | 2143920 | 1.306019 |

## Why a rolling rate

A single month's rate on a small site jumps about. AKASO's month 2 had one recordable and reads 1.006289; month 4 had three and reads 2.914319; month 3 had none and reads 0.000000. A reader who watched those monthly figures would see a record lurching up and down with nothing on site changing.

A trailing twelve month window steadies that. Each entry pools the last twelve months: their recordables added up, their hours added up, one division. When the window moves on a month, one month drops out of the back and one comes in at the front, and the rate changes only by what those two months differ by. AKASO's first three windows read 1.208038, 1.209454 and 1.207931. The fourth rises to 1.306019, because month 15 brings in 1 recordable where month 3, which drops out, had none.

## Sum then divide, inside every window

The engine uses the same rule for every window that it uses for pooling sites: add the counts, add the hours, divide once. It does not average the twelve monthly rates. Every hour in the window carries the same weight, whichever month it was worked in, and a short month counts for exactly the hours it holds. The third lesson in this module shows what happens when that rule is broken.

## Naming the window

The caller chooses the window length with `windowPeriods`, a whole number of periods. For monthly data, 12 gives the usual rolling twelve month rate. The engine has no default here either. A call with no window, or with a window that is not a whole number of periods, is refused:

> windowPeriods must be a whole number of periods, 1 or more (12 for a rolling 12-month rate)

The message names the field, says what is allowed, and gives the common value as an example. The base is still required, as it is for every rate except FAR, and the result carries `windowPeriods` in its basis block beside the base and the formula, so a reader can see how long the window was.

## Exercise

Take window 1 from the table: 13 recordables in 2152250 hours. Multiply 13 by 200,000, divide by 2152250, and check you reach 1.208038. Then do the same for window 4, 14 recordables in 2143920 hours, against 1.306019. Finally, write one sentence explaining why window 4 rose when windows 2 and 3 barely moved, naming the month that left the window and the month that entered it.
