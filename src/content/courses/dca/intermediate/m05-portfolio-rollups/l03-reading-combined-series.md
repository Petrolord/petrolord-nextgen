# Reading combined series

The roll-up returns more than a total. It returns `combinedRates`, a list of one object per calendar month, sorted by month, each shaped like this:

```
{ month: '2020-10', rate: 10949.2274024767, wells: 124 }
```

That object is the most misread structure in the whole course. Both of its numeric fields have names that suggest something they are not, and the field names are the only documentation most users will ever read. This lesson takes them apart. Both traps below are engine-verified on the Ekene roll-up of the four base oil scenarios.

## Trap 1: `rate` is a sum of daily rates

The binning code is three lines long. For each point in each scenario's forecast, it computes the point's calendar month and does `cur.rate += pt.rate`. Nothing else. No division, no averaging, no multiplication by day count.

So the value in the `rate` field for a month is the arithmetic sum of every daily rate value that landed in that month, across every contributing well. It therefore grows with three unrelated things: the rates themselves, the number of days in the month, and the number of wells on production. Two of those three have nothing to do with field performance.

Look at what that does to the Ekene series:

| Month | `rate` | Wells actually producing |
|---|---|---|
| 2020-01 | 3533.84949361315 | 1 |
| 2020-02 | 3297.22990514683 | 1 |
| 2020-03 | 7764.64869592898 | 2 |
| 2020-09 | 10931.7927694900 | 4 |
| 2020-10 | 10949.2274024767 | 4 |
| 2020-11 | 10194.8888809911 | 4 |

Plot that column on an axis labelled stb/d and you have drawn a field that produces eleven thousand barrels a day. The four wells came on at 120, 150, 100 and 90 stb/d. The field never produced more than a few hundred barrels a day in its life.

The honest conversions are both one step away, but they are different steps and you must choose deliberately:

- **Average field rate for the month**: divide by the number of days the bin covers. October 2020 has 31 days, so 10949.2274024767 / 31 = 353.200883950861 stb/d. That is a rate, and it is the number that belongs on a rate axis.
- **Month volume**: multiply the sum by the one-day spacing of the points that produced it. The forecast steps one day at a time, so each rate value stands for one day of production.

And the second conversion carries a caveat that is easy to miss. The bin holds one point per day per well **only for the days the forecast covers**. Ekene-1 came on 2020-01-01 and its first forecast point is dated 2020-01-02, because the loop starts at day 1 and adds it to the start date. So the January bin holds 30 of January's 31 days. Its 3533.84949361315 is not January's volume: the closed-form volume for the whole of January is 3651.65806057785 stb, and the bin is short by 117.808566964693 stb, which is about one day of production near the initial rate of 120 stb/d. The same truncation happens at the other end, in the month where each well hits its economic limit and stops.

The named misconception is **"a monthly bin is a monthly volume"**. It is a sum of whatever points happened to fall inside the month. Read the point count before you treat it as a month.

## Trap 2: `wells` counts points, not wells

Which brings us to the field that is literally named `wells`. Its code is `cur.wells += 1`, executed once per forecast point. It is a point counter. On a daily forecast it counts roughly 30 per well per month.

The Ekene series makes that unmissable, if you look:

| Month | `wells` | What it is |
|---|---|---|
| 2020-01 | 30 | one well, 30 daily points (2020-01-02 to 2020-01-31) |
| 2020-02 | 29 | one well, leap February |
| 2020-03 | 61 | Ekene-1's 31 plus Ekene-3's 30 |
| 2020-09 | 119 | three wells at 30 days plus Ekene-6's 29 |
| 2020-10 | 124 | four wells at 31 days |
| 2036-11 | 4 | Ekene-5 alone, four days before it hits the limit |

A four-well field reporting 124 wells in October 2020 is not a subtle bug. It is only invisible because nobody reads a field called `wells` sceptically. Notice too that the counter runs the other way at the end of life: the final month of the series shows 4, which would read as four wells producing when in fact one well produced for four days.

Stop and check it yourself, on September 2020. Ekene-6 came on 2020-09-01, so its first forecast point is 2020-09-02 and it contributes 29 points. Ekene-1, Ekene-3 and Ekene-5 were all on production and contribute 30 each, for 90. Add them: 119, exactly what the engine reports. If you can do that arithmetic you understand the field completely, and you will never plot it again.

## Worked example: a wrong slide and its repair

An analyst pastes the combined series into a slide with two charts. The first is titled "Ekene field oil rate, stb/d" and plots `rate`, peaking at 10949 in October 2020. The second is titled "Producing well count" and plots `wells`, peaking at 124.

Repair it line by line. The peak month is a real feature: October 2020 is the first full month with all four wells on production, so it is genuinely the field's high point. But the peak field rate is 353.200883950861 stb/d, from 10949.2274024767 divided by 31 days, and the well count that month is 4. The shape of the `rate` curve is also distorted, not just its scale, because February bins hold 28 or 29 points while January bins hold 31. Dividing by the day count fixes the scale and the sawtooth at once.

## Exercise

1. Predict the `wells` value for November 2020 before reading it: four wells, all on production for the whole month, 30 days. Then confirm the engine reports 120, and convert that month's 10194.8888809911 to an average field rate. You should get 339.829629366370 stb/d.

2. The series runs 203 monthly bins, from 2020-01 to 2036-11. Explain why the last bin can show a `wells` value of 4 in a field where four wells once produced, and write the one sentence you would put in a chart caption to stop a reader misreading it.

3. Write a general rule for yourself, in one line, about aggregated series from any tool: what you check before you plot a field whose name looks self-explanatory. This is not a decline-curve lesson any more. It is the habit that keeps the next aggregation you inherit from lying to you.
