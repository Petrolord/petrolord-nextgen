# Quantity times unit rate

{{panel:pr-envelope-calculator}}

Once a bid passes the technical envelope, its price envelope is opened and the first thing read is its bill. Before any comparison, the bill is checked for arithmetic. This lesson reads a bill line, the one test the engine applies to it, and the refusals that protect the check.

## A bill line

Every priced line carries three figures: the quantity the company asks for, the bidder's unit rate, and the amount the bidder wrote beside them. The amount should equal quantity times unit rate. When it does not, the line is in discrepancy, and a rule decides which figure stands.

The well services bill has six lines. Most carry a quantity set by the company: 18 operating days of the coiled tubing spread, 6 pumping days, 60 m3 of acid, 120 thousand scf of nitrogen. Mobilisation and demobilisation are lump sums, a quantity of one at the rate quoted.

## The test

The engine states it in its basis, at its default tolerance:

> a line is in discrepancy when |quantity x unit rate - quoted amount| > 0.005; the unit rate prevails unless the decimal point in it is obviously misplaced, when the quoted amount governs; the corrected total is the sum of the corrected lines

This module works through the rule in pieces: the unit rate prevailing next, the misplaced decimal point after it, and the tolerance and the quoted total last.

## Two lines that fail the test on the well services tender

| bid | line | quantity | unit rate | quoted amount | corrected unit rate | corrected amount | rule |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WS2 | ct-spread | 18.000000 | 27000.000000 | 468000.000000 | 27000.000000 | 486000.000000 | unit-rate-prevails |
| WS5 | acid | 60.000000 | 13.800000 | 82800.000000 | 1380.000000 | 82800.000000 | total-governs |

Every other line of every bid passes the test and is left as quoted. Across the six bids, two lines are corrected, and the rule applied differs between them.

## Refusals on the shape of a bill

The engine checks that the bill is a bill before it does any arithmetic. An empty list of lines is refused:

> lines must be an array of at least 1 entry

So is a line with no id, since every correction must name its line:

> lines[0].id must be a non-empty string

So is a repeated id, since two lines with one name cannot be told apart in a report:

> lines[1].id repeats the id 'mob'

And a negative unit rate is refused:

> lines[0].unitRate must be a finite number at or above 0

## Exercise

In the envelope calculator choose "Arithmetic correction of a bill". The lines box starts with WS2's six priced lines. Before reading the panel's table, multiply quantity by unit rate for each line on paper and compare it with the quoted amount. Mark the line in discrepancy and predict its corrected amount. Then read the table and the reason beneath it to check your work. Finally, rename the second line's id to mob and read the refusal the panel shows.
