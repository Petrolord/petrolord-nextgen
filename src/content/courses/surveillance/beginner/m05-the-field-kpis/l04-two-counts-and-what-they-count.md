# Two counts and what they count

`computeKpis` returns two counts of wells and neither of them counts wells that produced. One counts everything handed in and the other counts everything handed in except injectors.

{{panel:pd-ledger-explorer}}

## The two definitions

`wellCount` is `(wellSeries || []).length`, the number of series the caller passed, whatever type they carry and whatever they hold. `producerCount` excludes one type, injector, and keeps the rest.

Exclusion of one type is not selection of another. An observation well is not an injector, so it survives the filter and is counted as a producer by that name. On the published surveillance case, 7 series go in, of which 1 is typed injector, 1 is typed observation and 5 are typed producer, and the committed return is `wellCount` 7 with `producerCount` 6. The field has five producers and the object says six.

The teaching field OGUTA, invented for this course and neither real nor published, does the same thing at a different size: 8 wells, of which 6 are typed producer, 1 is typed observation and 1 is typed injector, returning `wellCount` 8 and `producerCount` 7.

## Neither count moves with the window

| windowDays on OGUTA | wellCount | producerCount |
| --- | --- | --- |
| 7 | 8 | 7 |
| 14 | 8 | 7 |
| 30 | 8 | 7 |
| 70 | 8 | 7 |

The counts are taken off the series list before any windowing happens, so a well that stopped reporting weeks before the window opens is still in both. A well that filed one row in September and nothing since counts exactly as much as a well that filed every day.

## A third count that is not either of these

`buildFieldSeries` puts a `wellsOn` on every field day, and it is a count of rows that met a volume test on that date. On the published field, 2025-06-30 carries a `wellsOn` of 3 and 2025-06-28 carries 2, against a `wellCount` of 7 and a `producerCount` of 6 on the same ledger.

Three numbers, three definitions, none of them interchangeable, and there is a fourth in the same area: the uptime on OGUTA reads 7 series, of which only 5 carry an `hours_on` on any row.

## The mistake

Dividing a field oil figure by `producerCount` to get a rate per well. The divisor includes wells typed observation, includes wells that reported nothing inside the window, and excludes nothing except injectors. The result is arithmetic and it is not a per-well rate of anything.

## What it refuses

To name the wells or their types. The counts are integers with no list behind them, and the only place a well type is known is the record the caller handed in.

## Exercise

Write down `wellCount` and `producerCount` for the published field and say how many of its series are typed producer.

Then say why `producerCount` is one higher than that figure, and which count changes when the window widens.
