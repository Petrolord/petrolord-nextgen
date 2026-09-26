# Linear price scoring

{{panel:pr-envelope-calculator}}

{{panel:pr-award-calculator}}

The combined score of the Associate tier scored price by the lowest-price ratio: Sc = 100 x Cmin / C, so the bid with the lowest evaluated cost scores 100 and every other bid scores in proportion. It is the World Bank's formula and one choice among several, and the price method can move an award as surely as the technical weight can.

## Two price methods

The engine offers two, and has no default: a call must name one.

* **lowest-ratio**: Sc = 100 x Cmin / C. A bid at twice the lowest evaluated cost scores 50.
* **linear**: Sc = 100 x (Cmax - C) / (Cmax - Cmin). The lowest evaluated cost scores 100 and the highest scores 0, with a straight line between.

The linear family is the one Kiiver and Kodym describe in "Price-quality ratios in value-for-money awards", Journal of Public Procurement 15(3), Fall 2015, read on 2026-09-26. On their Table 1, three prices of 50, 75 and 100, price only:

| bid | price | lowest-ratio Sc | linear Sc |
| --- | --- | --- | --- |
| A | 50 | 100.000000 | 100.000000 |
| B | 75 | 66.666667 | 50.000000 |
| C | 100 | 50.000000 | 0.000000 |

The source prints the lowest-ratio scores to whole points, 100, 67 and 50; the engine's figures are exact. Under the lowest ratio, bid C at double the price still earns half the points. Under the linear method, C earns nothing.

## The well services tender under both

Everything as the fixture states: technical weight 0.7, technical method relative, the four responsive bids and their evaluated costs. Cmin is 862141 and Cmax is 957990.

| bid | Sc lowest-ratio | Sc linear | B lowest-ratio | B linear |
| --- | --- | --- | --- | --- |
| WS5 | 100.000000 | 100.000000 | 87.647059 | 87.647059 |
| WS2 | 97.353920 | 75.552171 | 90.970882 | 84.430357 |
| WS1 | 92.883107 | 31.080136 | 95.806109 | 77.265217 |
| WS3 | 89.994781 | 0.000000 | 96.998434 | 70.000000 |

The lowest ratio compresses the spread of evaluated costs: the four commercial scores sit between 89.994781 and 100.000000. The linear method stretches it across the whole scale from 0.000000 to 100.000000, so the same price differences carry more weight in the combined score.

On this tender that changes the award. Under the lowest ratio the most advantageous bid is WS3 at 96.998434. Under the linear method it is WS5 at 87.647059.

## What this means for a tender document

A price method is part of the rule the bidders were told. Changing it after opening could change the winner, so a tender document fixes it before bids are received, alongside the technical weight and its cell in the matrix. When the course quotes a combined score, it quotes the technical weight and both methods beside it; a combined score without its methods cannot be checked.

The engine refuses any price method it does not hold, by name:

> priceMethod must be 'lowest-ratio' or 'linear'; there is no default

## Exercise

Open the envelope calculator on the view "The combined score". It starts on the four responsive well services bids at technical weight 0.7, lowest-ratio and relative. Read the most advantageous tile, then switch the price method to linear and read it again. Keeping the linear method, raise the technical weight from 0.7 to 1 in steps of 0.05 and record the most advantageous bid at each step, and any row whose tie broken by column is filled, with the rule it names. Then open the award calculator on the view "The Rated Criteria weighting band" with high risk and US$900000 and check which of your steps sit inside cell b. Say in two sentences what the price method alone could do to this award.
