# The government share curve

One series on one chart carries three different meanings, and nothing on the screen tells you which one a given point is.

{{panel:ec-comparison-explorer}}

## The division and its guard

At each swept price the sweep divides total government take by total government take plus total contractor net cash flow, and it guards that division with a test that the sum is greater than zero. When the guard fails it returns exactly 0. Three regimes of behaviour therefore live on one line. The sum is comfortably positive and the number is a share between 0 and 100. The sum is small and positive because the contractor is losing money while the government still collects, and the ratio goes above 100 percent. Or the sum is zero or negative, the guard fires, and the answer is 0.0000.

## A flat zero over a fortune

The published comparison built with capex of 20000, which is 10000.0000 drilling plus 10000.0000 facilities plus 0.0000 subsea, run against all six templates:

| regime | total government take | total contractor NCF | the two added | share plotted at all nine prices |
| --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | 1431.0440 | -16279.9099 | -14848.8659 | 0.0000 |
| Ghana - Deepwater | 712.5465 | -15561.4124 | -14848.8659 | 0.0000 |
| Brazil - Concession | 700.1194 | -15548.9853 | -14848.8659 | 0.0000 |
| USA - Gulf of Mexico | 1312.7238 | -16161.5898 | -14848.8659 | 0.0000 |
| Angola - Deepwater PSC | 1662.7835 | -16511.6494 | -14848.8659 | 0.0000 |
| Generic Royalty/Tax | 875.1492 | -15724.0151 | -14848.8659 | 0.0000 |

Six regimes, six flat lines along zero at every one of the nine prices, and every one of them collected for the government: between 700.1194 and 1662.7835 million USD. A zero that means the calculation could not be done is drawn on the same axis, in the same colour, as a zero that would mean the government took nothing.

## The ratio through the roof

The second case appears when the same field is made progressively more expensive. The Angola template on the default project, with every capex line multiplied and nothing else touched:

| capex multiple | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 110 | 120 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| x1 | 63.4520 | 59.5510 | 65.7226 | 68.7654 | 70.9486 | 72.5065 | 73.7920 | 74.1974 | 75.5825 |
| x3 | 0.0000 | 2223.0766 | 144.0692 | 85.6015 | 67.2176 | 59.3155 | 53.8218 | 56.8449 | 59.9462 |

Read the x3 row along its length: a guard firing at 40 USD per bbl, a number in the thousands at 50, one in the hundreds at 60, 85.6015 at 70, and only from 80 onward an ordinary share. Four consecutive points, three meanings, one line, no flag.

## The mistake

The dangerous misreading is the comforting one. A flat line at zero looks like the most contractor-friendly regime on the chart, and it is the one whose numbers could not be computed. The second is treating 2223.0766 as a fiscal term. A government share of several hundred percent is arithmetic, not a fiscal fact. It says the denominator collapsed toward zero, and a ratio whose denominator is collapsing is unstable: the very next point along that row falls to 144.0692 and the one after it to 85.6015, without any change in the terms.

## The rule, and what the chart refuses

Before believing a point, look at the two totals underneath it. If lifetime contractor net cash flow is negative, the share is not a share. If it is negative enough to outweigh the take, the curve reads zero and means nothing at all. The chart itself will not tell you: it carries no flag, no null and no gap in the line.

## Exercise

State the three meanings a point on this curve can carry and the test that separates them. Then say what the government collected under Angola - Deepwater PSC on the comparison that plots a flat zero, and what you would check before quoting 2223.0766.
