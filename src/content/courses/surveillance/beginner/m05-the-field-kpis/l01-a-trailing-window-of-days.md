# A trailing window of days

`computeKpis` is the only function in `surveillance.js` with no baseline in it. It takes the field series, keeps the last so many days of it, and averages. There is nothing to compare against and no verdict anywhere in the return.

{{panel:pd-ledger-explorer}}

## The window is a date window over the field series

The anchor is `asOf`, the field's latest ledger date, and the window reaches back `windowDays` from there. It selects field days by date, so a ledger with holes in it averages fewer days than the number asked for, and `windowDays` comes back in the return unchanged.

Two published returns on the same field, from `surveillance_cases.json`, both anchored at 2025-06-30:

| windowDays | Oil | Water | Gas | Winj |
| --- | --- | --- | --- | --- |
| 7 | 1941.428571429 stb/d | 990.000000000 stb/d | 1456.000000000 Mscf/d | 1900.000000000 stb/d |
| 30 | 1846.333333333 stb/d | 769.333333333 stb/d | 1246.733333333 Mscf/d | 2743.333333333 stb/d |

Each of those four is the mean, over the field days in the window, of that day's total calendar volume. The return labels them stb/d and Mscf/d. They are not producing-day rates: no hours column is consulted anywhere in the averaging, and a day on which every well ran four hours enters the mean at its calendar volume like any other.

## Asking for more days than the ledger holds

Derived sweep on the same published field, `windowDays` moved and nothing else:

| windowDays | Field days actually averaged | Oil |
| --- | --- | --- |
| 1 | 1 | 9740.000000000 stb/d |
| 7 | 7 | 1941.428571429 stb/d |
| 14 | 14 | 1770.714285714 stb/d |
| 30 | 30 | 1846.333333333 stb/d |
| 60 | 47 | 2257.234042553 stb/d |
| 90 | 48 | 2522.708333333 stb/d |
| 180 | 51 | 3256.666666667 stb/d |
| 365 | 51 | 3256.666666667 stb/d |

Past 51 the ledger runs out. Asking for 180 days and asking for 365 return the identical oil figure of 3256.666666667 stb/d, because both averaged the same 51 field days, and the object reports `windowDays` of 180 in one case and 365 in the other.

## The mistake

Reading `windowDays` as the number of days averaged. The 60-day row averaged 47 of them, the 90-day row 48, and nothing in the return distinguishes a field that reported every day from one with a fortnight missing.

## What it refuses

An empty field series returns null outright rather than an object of zeroes. A field day of all zeroes returns a liquid of 0.000000, a watercut of null, a gas-oil ratio of null and an uptime of null.

## Exercise

Run the published field at `windowDays` of 7 and of 30 and write down the oil figure and the water figure for each.

Then say how many field days the 90-day window actually averaged, and what quantity the oil figure is a mean of.
