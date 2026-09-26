# Risk, value and the weighting matrix

{{panel:pr-award-calculator}}

At Associate the well services tender was awarded on a combined score with a technical weight of 0.7, and the weight was simply stated. A buyer who can choose any weight can choose the award. The World Bank closes that door with a matrix: the weight given to the rated criteria must sit inside a band that depends on the procurement risk and the contract's value.

## The matrix

The source is the World Bank Procurement Regulations for IPF Borrowers, Seventh Edition, September 2025, para 5.50 and Annex X para 3.3, read on 2026-09-26. The engine's weightingBand function takes the risk and the estimated cost and returns the cell. On two stated estimated costs:

| risk | estimated cost (US$) | cell | high value | weighting range |
| --- | --- | --- | --- | --- |
| high | 12000000 | a | true | 0.500000 to 0.800000 |
| high | 900000 | b | false | 0.600000 to 1.000000 |
| low | 12000000 | c | true | 0.100000 to 0.400000 |
| low | 900000 | d | false | 0.200000 to 0.300000 |

The engine returns the rule of each cell in the Regulations' own terms. For cell b, verbatim:

> para 5.50 (b): High/Substantial Procurement Risk and Low Value, Rated Criteria weighting between 60% and 100%; high value means an estimated cost at or above US$10 million

High risk pushes the band up: when the job is hard to do well, quality must count for more. High value pulls it down: when a lot of money is at stake, price must keep a real share of the score. Low risk and low value, cell d, gives the narrowest band of all.

The risk is stated in two words, high or low. The engine maps the Regulations' four risk ratings onto them: High or Substantial is high, Moderate or Low is low. Any other word is refused:

> risk must be 'high' (High/Substantial) or 'low' (Moderate/Low)

## A stated weight against its band

Hand the engine a technical weight as well and it says whether the weight is inside the band. Both ends of a range are inside. The engine's reasons, verbatim:

| risk | estimated cost | technical weight | within band |
| --- | --- | --- | --- |
| high | 900000 | 0.7 | true |
| low | 900000 | 0.35 | false |

> technical weight 0.7 is inside the range 0.6 to 1

> technical weight 0.35 is outside the range 0.2 to 0.3; misapplication of the matrix may lead to misprocurement (Annex X para 3.4)

The well services tender is high risk with an estimated cost of US$900000, so its technical weight of 0.7 sits inside cell b.

The band says nothing about which weight inside it is right. A weight of 0.6 and a weight of 1 are both inside cell b and can award different bids. The band limits the buyer's freedom; the choice inside it is still stated, and the report names it.

A weight outside zero to one is refused before any cell is read:

> technicalWeight must be a number from 0 to 1

## Exercise

Open the award calculator and choose the view "The Rated Criteria weighting band". It starts on the well services settings: high risk, US$900000 and a technical weight of 0.7. Confirm the cell, the range and the reason. Change the risk to Moderate or Low and read what happens to the same weight. Then set the technical weight to 1.2 and read the refusal. Finally clear the technical weight and step the estimated cost to 12000000 under each risk, and write down the four cells in your own table.
