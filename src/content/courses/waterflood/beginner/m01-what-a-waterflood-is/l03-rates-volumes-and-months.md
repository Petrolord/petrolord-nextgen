# Rates, volumes, and months

The Ekene flood arrives in two shapes. One file holds daily rates, one row per well per month. Another holds monthly volumes, one row per well per month. They describe the same 36 months of the same flood, and the conversion between them is a single multiplication. That multiplication is also where a surprising number of production reports go wrong, so it is worth doing slowly once.

## Two schemas, one flood

The surveillance schema carries rates. A row says: on this date, this well was producing oil at this many stock tank barrels per day, water at this many barrels per day, gas at this many thousand standard cubic feet per day, and injecting at this many barrels per day. It also carries an optional injection pressure, which only injector rows have.

The ledger schema carries volumes. A row says: in this month, this well produced this many stock tank barrels of oil, this many barrels of water, this much gas, and took this much injection.

The two are related by the number of days in the month:

$$\text{volume} = \text{rate} \times \text{days in month}$$

That is the whole conversion. There is no other difference between the files.

## Why the distinction bites

Because months are not the same length. January has 31 days, February has 28 or 29, April has 30. If you take a set of monthly rows and treat them as though each row represented one unit of time, you have implicitly given February the same weight as January, and your totals are wrong by the amount that the ratios you care about happen to correlate with month length.

The Ekene record makes the size of that error visible. Read as monthly volumes, the field's cumulative voidage replacement ratio over 36 months is

$$\text{VRR}_{\text{cum}} = 1.034899536109$$

Read as 36 rows each treated as a single equal-weight sample, it is

$$1.034709324454895$$

The difference is 0.018379721651073933 percent. That is small, and it is small because Ekene's injection was computed from its production month by month, so the ratio barely varies. On a field whose injection is set by a facility constraint rather than by a target, the same mistake can be worth several percent. Neither number is wrong. They answer different questions, and a report that does not say which one it used is not a report.

## Worked conversion

Ekene-1 in January 2023 produced oil at 32.210476049246076 stock tank barrels per day. January has 31 days, so

$$32.210476049246076 \times 31 = 998.5247575266284 \text{ stb in the month}$$

Do that for every well and every month and the per-well rows sum, month by month, into the field periods the voidage engine consumes. The engine that does this in the Petrolord code is `buildFieldPeriods`, and running it over all 216 per-well rows reproduces the committed field period table to a maximum relative difference of $3.9 \times 10^{-16}$, which is floating-point noise and nothing else. The two files really are the same flood.

## Dates are strings, not calendars

There is a second trap hiding here, and the engine is deliberately built to avoid it. When you need to know which month a row belongs to, the tempting move is to parse the date into a date object and ask it for its month. That works until a timezone gets involved, at which point a row dated the first of the month in one timezone becomes the last day of the previous month in another, and a volume silently moves between periods.

The Petrolord ledger never parses dates. It takes the first seven characters of the string:

- `monthKeyOf('2023-05-17')` returns `'2023-05'`
- `monthKeyOf('2023-05')` also returns `'2023-05'`
- `monthKeyOf('May 2023')` returns `null`

String arithmetic cannot be shifted by a locale. The third case matters as much as the first two: an unparseable date returns null and the row is ignored, rather than being quietly assigned to some default month. A dropped row you can find in a count. A misfiled row you cannot.

## A related convention worth knowing

For attaching pressure surveys to periods, the engine needs a finer position than a month key, so it uses a fractional month coordinate: whole months since year zero, plus a within-month fraction of $(\text{day} - 1)/31$.

- `monthCoordOf('2023-01-01')` is 24276
- `monthCoordOf('2023-01-16')` is 24276.483870967742
- one calendar month is exactly 1.0

Note that the fraction divides by 31 regardless of the actual month length. That is a convention, not a calendar: it is deterministic, monotonic and timezone-proof, which is what interpolation needs. It is not a measure of elapsed time, and you should not use it as one.

## The misconception to avoid

"Daily rates and monthly volumes are basically the same thing scaled." They are the same thing scaled by a factor that changes twelve times a year, and the changes are not random with respect to anything. If your operations shut in for maintenance every February, month length and downtime are correlated, and averaging rates instead of summing volumes will bias your annual numbers in a consistent direction. Sum volumes when you want a total. Average rates only when you want a rate.

## Exercise

First, Ekene-1 produced at 32.210476049246076 stb/d in January 2023. Suppose the same rate had held through February 2023 and March 2023. Compute the three monthly volumes, then compute both the average of the three rates and the total volume divided by the total days. Explain why one of those two comparisons is trivially equal and the other is the one that matters.

Second, a colleague hands you a spreadsheet of 36 monthly rows and reports a cumulative VRR computed by averaging the 36 monthly ratios. Without doing any arithmetic, state whether that is the same as the ratio of the cumulative volumes, and describe a single-month scenario that would make the two differ dramatically.
