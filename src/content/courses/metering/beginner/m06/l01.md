# Six terms, six sensitivities, one root sum of squares

{{panel:fc-meterrun-explorer}}

The point of a metering app is the uncertainty. A flow with no budget behind it
is a number you can print and cannot defend. This lesson is the budget for the
ABOH run at its design reading, term by term.

| term | sensitivity | uncertainty, pct | contribution, pct | share of variance, pct |
| --- | --- | --- | --- | --- |
| discharge coefficient | 1.000000 | 0.500000 | 0.500000 | 74.045614 |
| expansibility | 1.000000 | 0.200000 | 0.200000 | 11.847298 |
| density | 0.500000 | 0.300000 | 0.150000 | 6.664105 |
| differential pressure | 0.500000 | 0.235110 | 0.117555 | 4.092988 |
| orifice bore | 2.114632 | 0.050000 | 0.105732 | 3.311074 |
| pipe bore | 0.114632 | 0.100000 | 0.011463 | 0.038920 |

   total uncertainty, percent of flow                        0.581059
   dominant term                                            discharge coefficient
   runner up                                                        expansibility
   the dominance is clear                                                    true

## How to read a row

Each row has an input, how uncertain that input is, and how much the flow cares
about it. The sensitivity is read off the orifice equation itself. It says how
much the flow moves for a given proportional move in that input, so a
sensitivity above one is an input whose error is amplified on the way into the
answer and a sensitivity below one is an input whose error is damped.

Multiply the uncertainty of an input by its sensitivity and you have that term's
contribution to the uncertainty of the flow. That is the fourth column.

## Why the last column is not the fourth column

The six contributions are combined as a root sum of squares. Each contribution
is squared, the squares are added, and the total is the square root of the sum,
which comes back here as 0.581059 percent of flow. The last column is each
term's share of that sum of squares, which is its share of the variance.

Squaring is the whole story of a budget like this. Squaring cannot reorder six
positive numbers, so the two columns rank the terms in the same order. What
squaring changes is how much of the whole each term holds: the shares add up to
one hundred percent of the variance, and that is the column that tells you where
money spent on better instrumentation would go.
Quote the share column when you are deciding what to improve, and quote the
total when you are stating what the meter is worth.

   discharge coefficient, share of variance in percent            74.045614
   expansibility, share of variance in percent               11.847298
   difference (first less second)                     62.198316
   ratio (first over second)                           6.250000

That is the comparison the digest computed between the two largest shares on
this run at this reading, and it is the one to quote.

## The total is a percent of flow

Read the total as what it says. It is 0.581059 percent of flow, so it is a band
around the flow figure rather than around any one input, and it is the number
that belongs on the front of a measurement report. A flow of 24602.3337 lb/hr
quoted with that band beside it is a defensible statement. The same flow quoted
alone invites the reader to assume a precision nobody claimed.

## Where the numbers came from

Five of the six uncertainties are the engine's own defaults. The differential
pressure term is the exception, and it came from the transmitter you met in
module five: 0.235110 percent of reading at a reading of 63.800000 in H2O on a
span of 200.000000 in H2O. The next lesson is about that route and why the
result says which one it took.

## Exercise

Look at the sensitivity column and name the input whose sensitivity is above
one. Say in one sentence what that means for how carefully that input has to be
known.
