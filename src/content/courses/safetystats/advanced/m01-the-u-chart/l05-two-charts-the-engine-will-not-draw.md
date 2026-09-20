# Two charts the engine will not draw

{{panel:ss-uchart-explorer}}

Of the 22 refusals the engine tables across 9 functions, 2 belong to `uChart`. One names `exposureHours[1]`, a point with no hours. The other names `counts`, a chart with no events in any period. Neither returns a chart.

| what was passed | field named |
| --- | --- |
| a point with no hours | `exposureHours[1]` |
| no events in any period | `counts` |

## A point with no hours

This is the engine's own message when the second period of a chart has zero hours:

> exposureHours[1] is zero: a u-chart point needs exposure; drop periods with no hours before charting

The reason is in the formula. A point's units are its hours over the base, so zero hours give zero units, and both the point's u and its limits divide by the units. There is no reading and no limit to draw. The message also tells you what to do: drop the period first.

Compare this with how the Associate tier's pooled rate treats the same input. A mothballed site with 0 hours and 0 events is accepted by `pooledRate`: its own period rate is null, `periodsWithoutHours` is 1, and the pooled rate is unchanged at 0.968312. The pooled rate can pass over an empty period because it only sums. A chart has to place every point it is given, and a point with no exposure has nowhere to go, so the u-chart asks you to remove it yourself.

## A chart with no events

This is the engine's message when every count is zero:

> counts are all zero: the centre line is zero and every limit has zero width

The centre line is the sum of counts over the sum of units, so no events give a centre of zero. The limits are the centre plus and minus 3 times the square root of the centre over the units, and the square root of zero is zero. Every limit collapses onto the centre and the chart has no band at all.

A year with no recordables is good news for the workforce. It is also no basis for a control chart, and the Professional tier already showed what to do with it: a zero count bounds the rate from above. The ABO crew's 0 recordables in 41300 hours still leave a 95 percent upper limit of 17.863823 per 200,000 hours.

## Why refuse

Both refusals name the field and carry no number, like every refusal in this engine. Drawing a chart anyway would put a point where no one was at work, or draw limits that flag every future event. The engine stops and says which input to fix.

## Exercise

AKASO's month 5 is a shutdown with no hours. Write down the list of months you would pass to `uChart` to chart AKASO's 15 months, and say how many points the chart would then carry. Then name, by field, the refusal the engine would return if you passed all 15 months as they stand, and check your answer in the panel.
