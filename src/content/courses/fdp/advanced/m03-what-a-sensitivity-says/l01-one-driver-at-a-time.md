# One driver at a time

The sweep takes one input, moves it by 30 percent in each direction, holds everything else at the base case and re-runs the whole economics. Four drivers give eight runs and one base.

{{panel:ec-value-explorer}}

## The sweep on the EGINA plan

| driver | minus 30 percent | plus 30 percent | base | swing |
| --- | --- | --- | --- | --- |
| Oil Price | 501.5628 | 3593.5679 | 2047.5653 | 3092.0051 |
| CAPEX | 2691.1526 | 1403.9781 | 2047.5653 | 1287.1745 |
| OPEX | 2209.5067 | 1885.6239 | 2047.5653 | 323.8828 |
| Production | 627.7671 | 3467.3636 | 2047.5653 | 2839.5965 |

Every row runs the full case: royalty, tax, the discount, the production shape, all of it. The minus 30 percent oil price run of 501.5628 is not the base NPV scaled down. It is a complete re-calculation with one input changed, which is why the results are not symmetric about the base and why the two ends of a row are rarely the same distance from 2047.5653.

## What "one at a time" excludes

The sweep never moves two drivers together, so nothing in it describes a price fall arriving with an overrun. The worst single number in the table is 501.5628 on a 30 percent price fall, and that is the worst the sweep can produce, not the worst the project can suffer. A case with both a price fall and a capex overrun would sit below every figure printed here, and the sweep does not contain it.

It also holds the shape fixed. The production driver scales the profile the concept implies without changing when the plateau ends or how steeply the decline runs.

## Ranking by swing

Ranked by swing, the order is Oil Price, Production, CAPEX, OPEX. That ordering says which input the value of this case is most exposed to, given a move of the same relative size in each. It does not say which input is most likely to move by that much, and a 30 percent move in a drilling capex and a 30 percent move in a long run oil price are not comparable events.

## The case underneath it

The sweep inherits every limit of the case it runs on. The base of 2047.5653 million USD is a screening result: one price deck, one production shape, post royalty at 12.5000 percent and tax at 30.0000 percent, discounted at 10.0000 percent. A sweep around it is a sweep around those terms. Change the terms and the ranking itself can change, which is why a published case with no royalty and no tax on a base of 2738.0331 gives a different set of ends entirely.

## The mistake

The mistake is reading the widest row as a risk assessment. The sweep reports arithmetic sensitivity and nothing about exposure, likelihood or correlation. The other mistake is comparing swings across different cases: 3092.0051 on this plan and a swing from some other project are not on the same scale, because each is a share of its own base.

## Exercise

Write the four drivers with their two ends and their swings, and rank them by swing. Then say which two things the ranking does not tell you, and name one combination of moves the sweep can never show.
