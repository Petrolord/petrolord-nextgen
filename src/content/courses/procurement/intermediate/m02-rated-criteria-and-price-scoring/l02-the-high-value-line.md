# The high-value line and its boundary

{{panel:pr-award-calculator}}

The weighting matrix has one line running through it: the estimated cost at which a contract becomes high value. On one side of the line the band is one pair of figures; on the other side it is a different pair. A rule with a line in it is only as good as its statement of which side the line itself belongs to.

## The line, as the Regulations state it

Every cell rule the engine returns ends with the same clause, taken from para 5.50 of the World Bank Procurement Regulations for IPF Borrowers, Seventh Edition, September 2025, read on 2026-09-26:

> high value means an estimated cost at or above US$10 million

"At or above" settles the boundary. The engine holds the line as a stated constant, HIGH_VALUE_USD, at 10000000, cited to para 5.50. At exactly US$10000000 a contract is high value; at US$9999999 it is not. Under low risk that one dollar moves the contract between two cells:

| risk | estimated cost (US$) | cell | high value | weighting range |
| --- | --- | --- | --- | --- |
| low | 10000000 | c | true | 0.100000 to 0.400000 |
| low | 9999999 | d | false | 0.200000 to 0.300000 |

## Why the boundary matters

The boundary is a place where two evaluators can quietly disagree. One reads "high value" as above US$10 million and the other as at or above, and a contract estimated at exactly the line lands in different cells. The engine's rule prints the reading in every reason, so the disagreement cannot hide.

The same care applies at the ends of each range. The engine treats both ends as inside. A technical weight of 0.5 in cell a is inside, and the engine says so, verbatim:

> technical weight 0.5 is inside the range 0.5 to 0.8

## The estimated cost is an input

The engine does not estimate the cost of the contract. It takes estimatedCostUsd as the buyer states it and refuses a negative one:

> estimatedCostUsd must be a finite number at or above 0

The well services tender states an estimated cost of US$900000 in its fixture, well below the line. The materials tender is awarded on the lowest evaluated cost and uses no rated criteria in its award, so the matrix does not apply to it.

## Reading a cell in a report

A report that states a technical weight names the cell it sits in, the risk rating that put it there, the estimated cost and its source, and the range. A committee member reading "0.7, inside cell b" can check every link: that the risk was rated high or substantial, that the estimate is below the line, and that 0.7 is between 0.6 and 1.

## Exercise

Open the award calculator on the view "The Rated Criteria weighting band". Clear the technical weight. Set the risk to Moderate or Low and the estimated cost to 10000000, and read the cell and the range; then set it to 9999999 and read them again. Repeat both under High or Substantial. Then set the estimated cost to 12000000 with high risk, and try technical weights of 0.5, 0.8 and one just outside each end; record which the engine calls inside.
