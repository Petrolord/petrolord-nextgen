# Two ends of a published range

{{panel:fc-sizing-explorer}}

Five steam rows are published for this route, and they were chosen to sit at different places on the correction curve. Re-running each one through the engine at the golden inputs puts the published answer and the live answer on the same line.

## The five rows

| golden flow lb/hr | golden p1 psia | golden KSH | published KN | engine KN | published area in2 | engine area in2 | relative difference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 60000.0000 | 314.700000 | 1.000000 | 1.000000 | 1.000000 | 3.796612 | 3.797018 | 1.071e-4 |
| 60000.0000 | 314.700000 | 0.830000 | 1.000000 | 1.000000 | 4.574231 | 4.574721 | 1.071e-4 |
| 150000.0000 | 2014.700000 | 1.000000 | 1.028016 | 1.027982 | 1.442191 | 1.442393 | 1.402e-4 |
| 150000.0000 | 3100.000000 | 1.000000 | 1.167438 | 1.167370 | 0.825349 | 0.825485 | 1.645e-4 |
| 120000.0000 | 1550.000000 | 1.000000 | 0.998366 | 0.998342 | 1.544193 | 1.544395 | 1.306e-4 |

Every row agrees to better than two parts in ten thousand on the relative difference the table above prints. That column is a comparison the course works out, so it is one a lesson may quote.

## What the set covers

Three of the five rows have the correction active, at relieving pressures of 2014.700000, 3100.000000 and 1550.000000 psia. Two sit below the threshold with the correction at exactly 1.000000.

One row is more valuable than the others. The row at 1550.000000 psia sits inside the band where the correction falls below one, and its correction is 0.998366 published against 0.998342 returned. That is the row proving the published case and the engine agree about a behaviour most people find surprising, which is a valve growing because a pressure rose. A published set with no row in that band would leave the most contestable part of the route untested.

At the other end, the row at 3100.000000 psia sits near the top of the published range. Above 3200.000000000003 psia the route stops answering and refuses, because the correction is published only that far. That refusal is a stated limit rather than a numerical failure: nothing breaks at that pressure, the engine simply declines to extrapolate a published fit past where it was published.

## What a published case is for

A published case is not a demonstration that an answer is correct. It is a demonstration that this implementation and the published one agree at one set of inputs, which is a narrower claim and a more useful one. Read that way, a set of five rows is a set of five places the two agree, and the interesting question about any published set is always which behaviours it leaves unvisited.

For this route the answer is encouraging. The set straddles the threshold, puts a row inside the awkward band, reaches close to the top of the range, and includes one superheated case. What it never tests is the refusal past the top of the range and the step at the threshold itself, both of which the course covers by bisecting the engine rather than by quoting a published row.

## Reading the correction columns

The published correction and the returned correction are printed side by side on purpose. They differ in the last few digits on the three active rows, which is the fit evaluated twice rather than a disagreement about the method.

What the published set cannot check is the superheat factor. Only one row carries a factor away from 1.000000, and that row was compared against a published answer computed with the same typed factor, so the pair confirms the arithmetic and says nothing at all about the table the factor came from.

## Exercise

Say which three rows have the correction active and which single row sits in the band where the correction is below one. Then say what happens above 3200.000000000003 psia, and why that behaviour is a stated limit.
