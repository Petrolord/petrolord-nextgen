# Moving the approach across the suction

The intercooler approach is the input that changes what a stage count means. Walk it from below the suction temperature to well above it, asking the count and the train the same question at every step.

{{panel:fc-compressor-explorer}}

## One walk, both halves of the comparison

The SOKU suction is 104.0000 degF and the stated discharge limit is 300.0000 degF:

| cooled to degF | inlet the count was tested at degF | stages | governed by | stage discharges degF | hottest degF | the stated limit less the hottest degF | stages over the limit | stages warned |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 90.0000 | 104.0000 | 3 | discharge temperature | 251.2956, 233.6372, 233.6372 | 251.2956 | 48.7044 | 0 | 0 |
| 100.0000 | 104.0000 | 3 | discharge temperature | 251.2956, 246.2503, 246.2503 | 251.2956 | 48.7044 | 0 | 0 |
| 104.0000 | 104.0000 | 3 | discharge temperature | 251.2956, 251.2956, 251.2956 | 251.2956 | 48.7044 | 0 | 0 |
| 110.0000 | 110.0000 | 3 | discharge temperature | 251.2956, 258.8635, 258.8635 | 258.8635 | 41.1365 | 0 | 0 |
| 130.0000 | 130.0000 | 3 | discharge temperature | 251.2956, 284.0898, 284.0898 | 284.0898 | 15.9102 | 0 | 0 |
| 150.0000 | 150.0000 | 4 | discharge temperature | 211.2066, 265.9556, 265.9556, 265.9556 | 265.9556 | 34.0444 | 0 | 0 |
| 180.0000 | 180.0000 | 5 | discharge temperature | 188.2466, 275.6056, 275.6056, 275.6056, 275.6056 | 275.6056 | 24.3944 | 0 | 0 |

## The second column is the whole point

The inlet the count was tested at is 104.0000 degF on the first three rows, where the approach sits at or below the suction, and it follows the approach from the fourth row on. That is the rule applied: the suction for one stage, and the hotter of the suction and the cooled temperature for more.

On every row it is the inlet the stages after the first actually run from, so the count and the train were asked about the same machine. The second column is the only thing on the table that says which machine the count was bought for.

## Reading the seventh column

The seventh column is the stated limit less the hottest stage, done on each row, so a negative entry would be a train running over the limit it was staged against. Across the whole table 0 stages do that and 0 stages carry a warning.

## Where the hottest stage lives

On the three rows where the approach is at or below the suction, the hottest stage is the first one at 251.2956 degF and it does not move, because stage one runs from the suction whatever the cooler does. What moves is every stage after it, from 233.6372 to 246.2503 to 251.2956 degF as the approach climbs to meet the suction.

From the fourth row on the later stages are the hottest, and the room left falls from 41.1365 to 15.9102 degF while the count still holds at 3.

## When the two halves could disagree at all

While the approach sits at or below the suction, the count and the train are looking at the same inlet whichever rule is used, so the distinction cannot show up. The condition under which they could come apart is an approach ABOVE the suction, which is exactly what the last four rows are, and the SOKU duty at an approach of 110.0000 degF against a suction of 104.0000 degF is already on that side.

That is why the walk is done over a range rather than at one point. A comparison only ever run where it cannot fail proves nothing, and the rows above 104.0000 degF are the ones where the answer was in doubt.

## The mistake

The mistake is choosing a cooler approach from a datasheet and never bringing it back into the staging calculation. The approach is an input to the count rather than a detail settled afterwards, and a count worked out at the suction while the coolers reach something warmer is a count for a machine nobody is building.

## Exercise

State the inlet rule and say where on the walk the tested inlet stops following the suction. Explain what the seventh column measures and what a negative entry there would mean, and say why the hottest stage is the first one on the three coldest rows.
