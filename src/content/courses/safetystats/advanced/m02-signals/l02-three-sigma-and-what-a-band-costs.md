# Three sigma, and what a band costs

{{panel:ss-uchart-explorer}}

At the engine's 3 sigma limits EGBEMA flags 1 month, month 8. Draw the limits at 2 sigma instead and 2 months sit above the upper limit: month 8 again, and month 3, whose u of 8.227913 clears a derived 2 sigma limit of 7.772371 while sitting well inside its 3 sigma limit of 10.211920.

| month | u | UCL at 3 sigma, engine | UCL at 2 sigma, derived | above at 2 sigma |
| --- | --- | --- | --- | --- |
| 1 | 2.982478 | 6.491006 | 5.291761 | false |
| 3 | 8.227913 | 10.211920 | 7.772371 | true |
| 4 | 3.373705 | 7.084918 | 5.687703 | false |
| 8 | 7.599326 | 6.410039 | 5.237783 | true |
| 11 | 1.018563 | 6.534895 | 5.321021 | false |

## What sigma means here

The engine's limits sit at the centre plus and minus 3 times the square root of the centre over the units. The square root term is the spread the Poisson count model expects for that month's exposure, one sigma. Three of them on each side is the Shewhart convention the engine follows, and it is fixed in the method line: "limits ubar +/- 3 sqrt(ubar / n_i)". The 2 sigma column above is derived for teaching. The engine has no sigma input, and a chart drawn from it is always a 3 sigma chart.

## What a narrower band buys

A 2 sigma band sees more. Month 3 was the highest reading on the chart and its exposure was thin, 97230 hours. At 3 sigma the chart judged it ordinary for its exposure. At 2 sigma it becomes a flag. If month 3 did hide a real change, the narrower band found it.

## What a narrower band costs

Every flag is an investigation. Someone has to pull the month's records, interview the supervisors, check the classification of each case and write up what was found. A band drawn tighter raises the number of months that trigger that work, and on a stable process most of the extra flags are months that were only unlucky. The cost is paid in investigation hours and, more slowly, in credibility. A team that chases a flag every few months and finds nothing learns to stop reading the chart.

Three sigma is a trade. It accepts that a modest real change may take a while to show, in exchange for flags that are usually worth the investigation. The engine takes the conventional trade and states it in its method line, so a reader always knows which band was drawn.

## Changing the band is a decision

Nothing stops an analyst from drawing a narrower band by hand, as the table does. The decision belongs in the note, with the reason: a high-hazard operation, a known recent change, a regulator's request. What the note may not do is narrow the band after looking at the chart, because then the band was chosen to produce the flag.

On EGBEMA, the honest statement is that month 8 signals at 3 sigma and month 3 would signal only at 2 sigma. Month 3's reading rests on 0.486150 units, less than a quarter of month 1's.

## Exercise

For month 3, subtract the 2 sigma limit of 7.772371 from its u of 8.227913, and do the same for month 8 against its 3 sigma limit of 6.410039. Compare the two margins. Then take the centre of 2.893273 and month 3's units of 0.486150 and compute its 2 sigma upper limit yourself to confirm the derived 7.772371.
