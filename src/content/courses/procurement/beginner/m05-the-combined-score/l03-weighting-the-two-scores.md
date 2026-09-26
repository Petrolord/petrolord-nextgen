# Weighting the two scores

{{panel:pr-envelope-calculator}}

With the technical and commercial scores both out of 100, the combined score is their weighted sum. The weight on the technical score is the tender's statement of how much quality counts against cost. This lesson works the combined score for the well services tender and shows how the weight decides which bid is most advantageous.

## The formula

The World Bank Standard Procurement Document, Request for Bids, Works, two-envelope (September 2025) prints the combined evaluation in its Section III, and the engine quotes it as its source:

> World Bank SPD Request for Bids, Works, two-envelope (Sep 2025) Section III, combined evaluation: B = Clow / C x X x 100 + T / Thigh x (1 - X) x 100

In that notation X is the weight on the price. The engine takes the technical weight as its input instead, so the combined score is the technical weight times St plus the rest times Sc. The well services tender states a technical weight of 0.7, leaving 1 - 0.7 to the commercial score.

## The well services tender

With technical weight 0.7, the lowest-ratio commercial score and the relative technical score:

| rank | bid | St | Sc | B combined |
| --- | --- | --- | --- | --- |
| 1 | WS3 | 100.000000 | 89.994781 | 96.998434 |
| 2 | WS1 | 97.058824 | 92.883107 | 95.806109 |
| 3 | WS2 | 88.235294 | 97.353920 | 90.970882 |
| 4 | WS5 | 82.352941 | 100.000000 | 87.647059 |

WS3 is most advantageous at 96.998434. It holds the best technical proposal and the dearest evaluated cost of the four, and at a weight of 0.7 the technical lead carries it. WS5, with the lowest evaluated cost, ranks fourth.

## The weight is a decision

The technical weight must be stated. Left out, it is refused:

> technicalWeight must be a number from 0 to 1 (the technical share of the combined score); there is no default

At the two ends the combined score becomes one of its parts. A weight of 1 ranks on St alone; a weight of 0 ranks on Sc alone, and the most advantageous bid is then the one with the lowest evaluated cost. Between them, the weight trades quality against cost. Recall from the first lesson of this module that the lowest ratio compresses cost differences: a heavy technical weight on top of that gives the technical proposal most of the say.

The World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025) set a range of weights by the risk and value of the contract, at para 5.50. Placing a weight inside that range is the Professional tier's question. At this tier the weight is the one the tender states.

## Every rejected bid

The combined score needs at least one bid to rank. If every bid carries a rejection, the engine refuses:

> bids has no bid left to score: every bid is rejected

## Exercise

In the envelope calculator choose "The combined score". Check WS1's combined score by hand from its St and Sc in the table above. Then lower the technical weight step by step, 0.6, 0.5, 0.4 and so on, and record the most advantageous bid at each step. Find the first weight at which it changes and name the bid that takes over. Then clear the technical weight box and read the refusal. Restore 0.7, and add a "rejected" reason to every bid to meet the last refusal above.
