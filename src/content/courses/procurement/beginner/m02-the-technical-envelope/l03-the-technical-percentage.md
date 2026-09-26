# The technical percentage and weighted points

{{panel:pr-envelope-calculator}}

Once the requirements are checked and every score is inside its scale, the engine reduces each proposal to one figure. It returns two, in fact, which always agree on the order of the bids. This lesson works both by hand for the well services tender.

## The rule

The engine states the rule in its basis:

> technicalPercent = sum of weight x score / maxScore over the criteria (weights sum to 100); weightedPoints = sum of weight x score

Each criterion contributes its weight times the fraction of its scale the bid reached. A bid that scores the maximum everywhere reaches 100. The weighted points skip the division by maxScore, which is how the World Bank Procurement Guidance: Evaluating Bids and Proposals (February 2025) prints its totals in Figure IX.

## The well services tender, term by term

Each term below is weight x score / maxScore, derived from the fixture scores. The engine returns only the sum; the terms are shown so you can check it.

| bid | methodology (w 30) | personnel (w 25) | equipment (w 20) | hse (w 15) | schedule (w 10) | technicalPercent | weightedPoints |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WS1 | 30.000000 | 18.750000 | 15.000000 | 11.250000 | 7.500000 | 82.500000 | 330.000000 |
| WS2 | 22.500000 | 18.750000 | 15.000000 | 11.250000 | 7.500000 | 75.000000 | 300.000000 |
| WS3 | 22.500000 | 25.000000 | 15.000000 | 15.000000 | 7.500000 | 85.000000 | 340.000000 |
| WS4 | 15.000000 | 18.750000 | 15.000000 | 11.250000 | 5.000000 | 65.000000 | 260.000000 |
| WS5 | 22.500000 | 18.750000 | 10.000000 | 11.250000 | 7.500000 | 70.000000 | 280.000000 |

Take WS1. It scored 4 of 4 on methodology, so it earns the full weight, 30.000000. It scored 3 of 4 on personnel, three quarters of 25, which is 18.750000. Its five terms add to 82.500000. WS6 is absent from the table because it was never scored.

## Two figures, one order

On the well services scale the most weighted points a bid can earn is 400, since every weight is multiplied by a top score of 4. Each weighted points figure is therefore four times the technical percentage, and the two rank the bids alike. When criteria use different scales the ratio between the two figures is no longer fixed, and the technical percentage is the one the pass mark and the combined score use.

## The Guidance's Figure IX

The Guidance sets out an example with four criteria weighted 50, 25, 15 and 10, scored 0 to 4. Its Company A scores 2, 2, 2 and 1. Run through the engine:

| company | weightedPoints (engine) | technicalPercent (engine) | the Guidance prints |
| --- | --- | --- | --- |
| A | 190.000000 | 47.500000 | 190 |

The engine's weighted points match the printed total exactly. That is the check the course asks of every rule: a published worked example, recomputed and compared.

## Why a percentage

A percentage of the maximum lets a tender state its pass mark as a share of the available technical score, whatever scales its criteria use. That is why the engine's pass mark message describes the pass mark as a percentage of the maximum technical score, and refuses one outside 0 to 100.

## Exercise

In the envelope calculator choose "The technical envelope". Before touching anything, compute WS3's five terms on paper from its scores of 3, 4, 3, 4 and 3, and check your sum against the panel. Then replace the criteria and bids with the Guidance's Figure IX example: four criteria weighted 50, 25, 15 and 10 with maxScore 4, and one bid scored 2, 2, 2 and 1. Confirm the weighted points and the technical percentage in the table above.
