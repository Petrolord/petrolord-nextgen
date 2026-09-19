# The centre line is pooled

{{panel:ss-uchart-explorer}}

EGBEMA's centre line is 2.893273 per 200,000 hours. It is the sum of the counts, 63, over the sum of the units, 21.774650. The mean of the twelve monthly u values is a different number, 3.202958, and the engine does not draw its line there.

| what | value |
| --- | --- |
| centre line, sum of counts over sum of units | 2.893273 |
| mean of the monthly u, derived | 3.202958 |
| sum of counts | 63 |
| sum of units, derived | 21.774650 |

## The same rule, on a chart

The Associate tier taught sum then divide on KWALE, where the pooled rate was 0.968312 and the mean of the three site rates was 1.754760. The centre line of a u-chart is that rule applied to months. The engine's method line says so in its own words: "u chart, variable sample size (Montgomery): ubar = sum(c) / sum(n), limits ubar +/- 3 sqrt(ubar / n_i), lower floored at 0".

The centre line is the rate of the whole year, as if the twelve months were one period. Every month contributes in proportion to its exposure. A month with twice the hours carries twice the weight, which is exactly what it should carry, because it holds twice the evidence about the rate.

## Where the mean goes wrong

In the mean of the monthly u, every month carries a weight of one twelfth whatever its hours. Month 3 is the month that shows the cost. Its u is 8.227913 on 0.486150 units, so a thin month with a high reading counts as much as month 1's 2.011750 units. In the pooled centre line month 3 carries its 0.486150 units out of 21.774650, a small share, and the high reading moves the line very little.

That is why the mean sits above the centre line on this chart. The two highest readings, month 3 at 8.227913 and month 8 at 7.599326, lift the mean further than their exposure justifies in the case of month 3. The engine reports the pooled figure as the centre because the limits are built around it, and limits built around the wrong centre would put every signal in the wrong place.

## What the centre line is for

The centre line is the chart's statement of what an ordinary month looks like on this workforce, pooled across the year. Every limit on the chart is measured from it. The next lesson shows the limits moving with each month's units while the centre stays fixed at 2.893273. When a later lesson sets a month aside and redraws, the first thing that changes is this line, because it is recomputed from the counts and units that remain.

A chart note that quotes only the centre line is still incomplete. It has to say which months the centre was pooled over and on which base, because both change the figure.

## Exercise

In the panel, divide 63 by 21.774650 and confirm the centre of 2.893273. Then remove month 3 by hand: subtract its 4 events and its 0.486150 units from the totals, recompute the pooled figure, and compare how far it moved with how far the mean of the monthly u moves when month 3 is dropped from the eleven that remain. Write one sentence on why the two moved by such different amounts.
