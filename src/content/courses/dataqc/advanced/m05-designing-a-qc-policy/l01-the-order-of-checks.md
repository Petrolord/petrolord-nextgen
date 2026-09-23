# The order of checks

{{panel:dq-checks-explorer}}
{{panel:dq-monitor-explorer}}

A QC policy runs its checks in an order, and the engine's own refusals set most of it. The control charts refuse a series with a gap, so completeness comes first. Coverage refuses an index that steps back, so the index check comes before coverage. A sentinel is present to completeness and invalid to the range check, so the range check runs before any statistic. A frozen run reads as a perfectly quiet stretch, so it is found before any outlier test.

| step | check | why it comes here | the evidence on the Ekene data |
| --- | --- | --- | --- |
| 1 | completeness | a chart refuses a gap | the chart refusal names `values[30]` |
| 2 | the index | coverage refuses an index that steps back | the splice index is refused at `index[5]` |
| 3 | range | a sentinel is present until it is found | GR reads 1.000000 complete with 4 range failures |
| 4 | frozen runs | a stuck meter looks quiet | the stuck sonic run makes the MAD zero |
| 5 | outlier tests | they need clean, live values | Professional tier |
| 6 | control charts | they need a complete series | this tier |

## Completeness before a chart

Every chart in this tier reads a sequence, and the engine refuses one with a gap. Its own words, on a series missing an entry:

> values[30] is missing: a control chart needs a complete series, so fill or drop the gap first

The refusal names the entry and leaves the decision to the caller. A policy says in advance what it does with a gap: drop the day, fill it by a stated rule, or stop and ask. Whatever it says, completeness has to have run first, or the chart is the thing that finds the gap.

## The index before coverage

Coverage measures how much of an interval the present samples span, and it needs an index that only increases. On EKENE-7's splice index it refuses:

> index[5] must be strictly increasing: sort and de-duplicate the index first (indexCheck finds the offenders)

The refusal names the check that should have run before it. The index check finds the duplicate, the reversal and the irregular steps; the policy decides how to repair them; coverage runs on the repaired index.

## Range before any statistic

EKENE-7's gamma ray carries -999.25 at entries 236 to 239, the LAS null value left in place. Completeness counts those values as present and reads 1.000000. The range check reads them as 4 values below the gamma ray minimum. Any mean, median or chart computed before the range check would take -999.25 as a reading. Converted to null, the channel reads 0.983333 complete with 0 range failures, and only then is it fit for a statistic.

## Frozen runs before an outlier test

EKENE-7's sonic holds one value, 83.200000, for 9 entries from 175 to 183. On entries 174 to 189, which contain that run, the modified z-score refuses:

> values have MAD = 0: more than half the present values equal the median, so the modified z-score is undefined

A stuck meter is an agreement of the meter with itself. Found first, it is named as a frozen run; found by an outlier test, it produces a refusal or reads as the quietest stretch of the log.

## Exercise

In the checks panel, type a short gamma ray series of your own whose last two readings are -999.25. Run completeness and then the range check with the gamma ray channel in gAPI, and record both results. Replace the two sentinels with null and run both again. Then write the six steps of the table as a numbered list for a policy of your own, adding one sentence to each that says what the policy does when that step flags something.
