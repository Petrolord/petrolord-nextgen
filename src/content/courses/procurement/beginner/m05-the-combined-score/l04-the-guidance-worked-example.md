# The Guidance worked example, figure by figure

{{panel:pr-envelope-calculator}}

An engine that scores bids should agree with the published worked examples of the texts it cites. The World Bank Procurement Guidance: Evaluating Bids and Proposals (including use of Rated Criteria), February 2025 edition, read on 2026-09-26, prints two combined evaluations. This lesson recomputes both through the engine and reads each printed figure against the engine's.

## Figures X to XII

The Guidance states a technical weight of 0.8, with the cost taking the rest, and five companies. Company E is excluded, with the reason stated for it in the Guidance: an abnormally low bid, rejected after examination. How a bid is examined for an abnormally low price is taught at the Professional tier; here E simply takes no part. The Guidance's technical points are entered as percentages, and only T / Thigh matters. The Guidance prints to two decimals, and the engine's figures are exact:

| rank | company | 0.8 x St (engine) | the Guidance prints | Sc (engine) | the Guidance prints | B (engine) | the Guidance prints |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | D | 80.000000 | 80 | 91.666667 | 91.7 | 98.333333 | 98.34 |
| 2 | C | 68.333333 | 68.33 | 100.000000 | 100 | 88.333333 | 88.34 |
| 3 | B | 66.666667 | 66.66 | 88.000018 | 88 | 84.266670 | 84.26 |
| 4 | A | 63.333333 | 63.33 | 84.615385 | 84.6 | 80.256410 | 80.25 |

The ranking agrees: D, C, B, A. Every printed combined figure is within 0.01 of the engine's. The small gaps come from printing to two decimals, and the Expert tier reads which printed figures were cut short and which rounded. The lesson here is simpler: a ranking that agrees and figures within the printing precision is what a correct engine looks like against a printed example.

Notice what D's win rests on. C has the lowest cost and scores Sc 100, yet D's technical lead carries it at a weight of 0.8, just as WS3 wins the well services tender at 0.7.

## Annex 3

The Guidance's Annex 3 states a technical weight of 0.4, with the financial score taking the rest. The engine's weighted points are 240.000000 for A and 190.000000 for B.

| company | St (engine) | Sc (engine) | B (engine) | the Guidance prints |
| --- | --- | --- | --- | --- |
| A | 100.000000 | 90.625000 | 94.375000 | 94.37 |
| B | 79.166667 | 100.000000 | 91.666667 | 91.66 |

A wins on both. The engine's A is 94.375000, and the Guidance prints 94.37: two decimals of that figure with the third dropped.

## Why the course checks against print

A worked example in a public text is the nearest thing to a known answer a procurement rule has. When the engine's ranking and figures agree with it, to the precision the text prints, the rule is implemented as the text describes. When they disagree by more than the printing, one of the two is wrong, and the course would say which. Module 2 met one such case already: in the Guidance's Annex 2, Company B's printed criterion scores total 77.000000, below the threshold of 80, and the Expert tier reads what the Guidance prints for B instead. A careful evaluator recomputes a printed example before trusting it, and recomputes the engine's figures in the same spirit.

## Exercise

In the envelope calculator choose "The combined score" and rebuild Annex 3. The Guidance's prices are not reproduced in this course, and only ratios matter, so enter stated figures in the same ratios. Replace the bids with two: A with technicalPercent 60 and evaluatedCost 100000, and B with technicalPercent 47.5 and evaluatedCost 90625, each with a receivedAt such as 2027-05-01T09:00:00Z. Set the technical weight to 0.4, the price method to lowest-ratio and the technical method to relative. Check St, Sc and B against the table. Then explain why 60 and 47.5 reproduce the Guidance's technical ratio.
