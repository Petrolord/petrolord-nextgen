# The largest possible z

{{panel:dq-outliers-explorer}}

A z-score cannot grow without limit. However far out one value sits, it also pulls the mean towards itself and widens the standard deviation it is divided by. With the sample standard deviation, the largest absolute z any value in a series of n can reach is (n - 1) / sqrt(n). The engine reports that ceiling on every call as `maxPossibleAbsZ`, beside a `thresholdReachable` flag that says whether the stated threshold can be passed at all.

| n | largest possible absolute z, sample SD | reachable at 3 |
| --- | --- | --- |
| 5 | 1.788854 | false |
| 8 | 2.474874 | false |
| 10 | 2.846050 | false |
| 11 | 3.015113 | true |
| 12 | 3.175426 | true |
| 20 | 4.248529 | true |
| 50 | 6.929646 | true |

Each row is one value of 1 among zeros, which is how a value sits as far out as a sample of that size allows.

## Reading the table

At n = 10 the ceiling is 2.846050. No value in a series of ten can pass an absolute z of 3 with the sample standard deviation. The threshold first becomes reachable at 11 values, where the ceiling is 3.015113, and the ceiling keeps rising from there: 4.248529 at 20 values and 6.929646 at 50.

This is a property of the arithmetic, independent of units, well and measurement. Eight core plugs and eight daily rates share the ceiling of 2.474874.

## The gauge sits on its ceiling

EKENE-3's gauge has ten readings, so its ceiling is 2.846050. Entry 7 reads a z of 2.845783. The glitch is about as far out as ten values allow any value to be, and the rule still cannot flag it, because the threshold of 3 lies above the ceiling. The engine returns `thresholdReachable` false for this call.

That field is the reason the engine reports the ceiling at all. A z-score run that returns zero flags looks like a clean result. With `thresholdReachable` false it is a different statement: the test could not have flagged anything at this sample size, so zero flags says nothing about whether the series holds an outlier. A report that quotes the zero without the ceiling hides that.

## What the choice of standard deviation does

The ceiling follows the standard deviation the caller chooses. The previous lesson showed the population standard deviation on nine zeros and a one reaching a ceiling of 3.000000, where the sample standard deviation reaches 2.846050 on the same ten values. The engine names the ceiling it applied in its basis block.

## What to do on a short series

Three responses are open to an analyst holding ten values and a threshold that cannot be reached. Lowering the threshold below the ceiling is one, and it has to be stated as a choice. A second is a rule whose spread is not dragged by the outlier, which is where the next module goes: on the same ten readings the modified z-score of entry 7 is 186.162000. The third is to say plainly that the z test was unable to decide, and quote the ceiling beside the zero flags.

The engine reports the z-scores, the ceiling and whether the threshold is reachable, and leaves the decision to the analyst.

## Exercise

In the explorer's z view, type one 1 among nine zeros and read the ceiling, 2.846050. Add a tenth zero so the series holds eleven values, and confirm that the ceiling becomes 3.015113 and `thresholdReachable` turns true. Then write the one line you would add to a report that quotes zero z flags on the EKENE-3 gauge.
