# Scaling to twenty-four hours

The producing-day rate is one multiplication: the volume booked on the row times twenty-four over the hours the row was open. Everything surprising about it comes from how fast that multiplier grows.

{{panel:pd-ledger-explorer}}

## The sweep

A derived sweep on one constructed row of 600 stb of oil, with nothing changed but `hours_on`. The uplift column is the producing-day rate divided by the calendar volume of the same row.

| hours_on, h | oilPd, stb/d | gasPd, Mscf/d | uplift |
| --- | --- | --- | --- |
| 24.0 | 600.000000000 | 300.000000000 | 1.000000000 |
| 23.5 | 612.765957447 | 306.382978723 | 1.021276596 |
| 20.0 | 720.000000000 | 360.000000000 | 1.200000000 |
| 18.0 | 800.000000000 | 400.000000000 | 1.333333333 |
| 16.0 | 900.000000000 | 450.000000000 | 1.500000000 |
| 12.0 | 1200.000000000 | 600.000000000 | 2.000000000 |
| 8.0 | 1800.000000000 | 900.000000000 | 3.000000000 |
| 6.0 | 2400.000000000 | 1200.000000000 | 4.000000000 |
| 4.0 | 3600.000000000 | 1800.000000000 | 6.000000000 |
| 2.0 | 7200.000000000 | 3600.000000000 | 12.000000000 |
| 1.0 | 14400.000000000 | 7200.000000000 | 24.000000000 |
| 0.5 | 28800.000000000 | 14400.000000000 | 48.000000000 |

It is a constructed demonstration row, not a published case and not a real well.

## Where the column stops being useful

Half an hour of production reports 28800.000000000 stb/d. That is a correct answer to a real question, what the well would make in a day at that rate, and it is not a number anybody should quote as the well's performance. The half hour could be the surge that follows a restart, and the arithmetic has no way to know.

Notice how flat the top of the table is and how steep the bottom is. Between 24.0 and 20.0 hours the uplift moves from 1.000000000 to 1.200000000. Between 2.0 and 1.0 hours it moves from 12.000000000 to 24.000000000. The same one-hour error in the hours column is worth almost nothing at the top and doubles the answer at the bottom.

## Every phase scales by the same factor

The gas column tracks the oil column exactly, because `gasPd` uses the identical multiplier, and `waterPd` and `liquidPd` do too. That is why the gas-oil ratio and the watercut off a row are unchanged by the hours: `derivePoint` forms both from the unscaled volumes, and scaling both terms by one multiplier would not have moved them either.

## The mistake

Averaging producing-day rates over a window as though the days weighed the same. Each of these rates is an extrapolation from its own row, and a row open for half an hour speaks in that mean as loudly as a row open all day. The window means in this module are unweighted arithmetic means over the finite values in the window.

## Exercise

Set `hours_on` to 12.0 and then to 6.0 on the constructed row in the panel and record `oilPd` at each.

Then say by what factor the reported rate moved, and by what factor the oil the well actually booked moved.
