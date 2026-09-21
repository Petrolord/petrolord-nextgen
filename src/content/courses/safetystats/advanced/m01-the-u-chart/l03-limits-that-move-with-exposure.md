# Limits that move with exposure

{{panel:ss-uchart-explorer}}

On EGBEMA the upper control limit for month 3 is 10.211920. For month 1 it is 6.491006, and for month 8 it is 6.410039. The centre line under all three is the same 2.893273. What differs is the exposure: 0.486150 units in month 3, 2.011750 in month 1 and 2.105450 in month 8.

| month | hours | units n | UCL |
| --- | --- | --- | --- |
| 3 | 97230 | 0.486150 | 10.211920 |
| 4 | 296410 | 1.482050 | 7.084918 |
| 5 | 371880 | 1.859400 | 6.635494 |
| 1 | 402350 | 2.011750 | 6.491006 |
| 8 | 421090 | 2.105450 | 6.410039 |

## The formula, read slowly

The engine draws each month's limits at the centre plus and minus 3 times the square root of the centre over that month's units. In symbols, ubar +/- 3 sqrt(ubar / n_i). The centre is fixed for the chart. The units change month by month. So the distance from the centre to the limit is large where n is small and small where n is large.

Read the table from top to bottom and the pattern is plain. As the hours rise from 97230 to 421090, the upper limit falls from 10.211920 to 6.410039. Month 8 has the most hours on the chart and therefore the tightest limit.

## Why the width follows the square root

The count in a month is modelled by the Poisson count model, and for that model the spread of a count grows with the square root of its mean. The spread of the rate, which is the count divided by the units, therefore shrinks with the square root of the units. Four times the hours halves the distance from the centre to the limit. A month with a quarter of the exposure needs a reading twice as far from the centre before the chart will call it unusual.

This is the Professional tier's lesson about intervals, restated for a chart. The IMO ladder held the observed rate at 2.000000 per 200,000 hours and showed the upper limit at 220.068159 times the lower at 1 event and 1.494848 times at 100 events. Exposure buys precision on a chart exactly as it does in an interval.

## Reading a chart with moving limits

A u-chart with varying exposure does not have one straight upper line. It has a stepped one, high where the month was thin and low where it was full. Two consequences follow for anyone reading it.

First, the highest u on the chart is not automatically the month that signals. Month 3's u of 8.227913 is the highest on EGBEMA and sits under its limit of 10.211920. Month 8's 7.599326 is lower and sits above its limit of 6.410039.

Second, a chart drawn with one flat limit, computed from the average month, would put month 3 over the line and hide the fact that it is thin. The engine takes the exposure of each month because that is what makes each limit honest about its own evidence.

## Exercise

Use the centre 2.893273 and month 1's 2.011750 units. Divide the centre by the units, take the square root, multiply by 3 and add the centre, and check your result against the engine's 6.491006. Then repeat for month 3 with 0.486150 units against 10.211920. Finally, write down how many hours month 3 would have needed for its limit to match month 1's, and explain the shortcut you used.
