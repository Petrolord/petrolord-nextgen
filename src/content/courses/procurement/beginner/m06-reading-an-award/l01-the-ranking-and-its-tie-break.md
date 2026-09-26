# The ranking and its tie-break

{{panel:pr-envelope-calculator}}

A ranking orders the responsive bids by the figure the award basis names: the combined score, highest first, or the evaluated cost, lowest first. Most of the time no two bids share a figure. When they do, the order between them must still be decided by a rule stated in advance, or the award becomes a matter of taste. This lesson reads the engine's tie rule and the one convention it rests on.

## The rule, stated once

The engine's ranking basis for a combined award reads:

> combined score descending; ties at 12 significant digits go to the lower evaluated cost, then the earlier receipt, then the bidder id

For a ranking by evaluated cost the first key is the evaluated cost itself, and ties go to the earlier receipt, then the bidder id. On the well services tender no two evaluated costs tie, and no two combined scores tie either.

## What counts as a tie

Two figures tie when they agree to 12 significant digits. That is an engine convention, named in its table of choices. Computers hold numbers in binary, and two routes to the same score can land a hair apart in the last digits. Comparing at twelve digits treats such hairs as equal while keeping every difference a person could print and read.

## Three bids that tie

Stated as a test: three bids with the same technical percentage, 80, and the same evaluated cost, 500000, so the same combined score.

| rank (engine) | bid | received (stated) | combined score | tieBrokenBy (engine) |
| --- | --- | --- | --- | --- |
| 1 | T1 | 2027-05-01T09:00:00Z | 100.000000 | null |
| 2 | T2 | 2027-05-01T09:00:00Z | 100.000000 | bidder id |
| 3 | T3 | 2027-05-01T10:00:00Z | 100.000000 | earlier receipt |

T1 and T2 were received in the same second, so the bidder id decides between them. T3 came in an hour later. The column tieBrokenBy names the rule that ordered each row against the row above it, and it is null on the first row.

When the combined scores tie and the evaluated costs differ, the lower evaluated cost ranks first. Stated as a test, U2 with T 100 and C 1000 and U1 with T 50 and C 500, at technical weight 0.5, both score 75.000000, and the engine ranks U1 first, broken by "lower evaluated cost".

## Why this order, and the alternative

No text read states a tie-break, so the order is the engine's stated convention. A lower evaluated cost comes first because, with equal overall merit, the company pays less. Earlier receipt comes next because it is a fact recorded at the tender box. The bidder id comes last because it always separates two bids. A committee could choose another order, such as asking the tied bidders for a fresh price, and a report that quotes a tied ranking names the rule it used.

## Receipt times are exact

The receipt time must carry its zone, since a tie can turn on it:

> bids[0].receivedAt must be a UTC time 'YYYY-MM-DDTHH:MM:SSZ'

## Exercise

In the envelope calculator choose "The combined score". Replace the bids with T1, T2 and T3 from the table, each with technicalPercent 80 and evaluatedCost 500000, and set the technical weight to 0.7. Read the rank and the tie broken by column. Now move T3's receipt to 08:00 on the same day and predict the new order before reading it. Finally, remove the Z from T1's receipt time and read the refusal.
