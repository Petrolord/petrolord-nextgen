# Overall content across mixed units

{{panel:pr-award-calculator}}

Section 14 of the Act compares bids on one Nigerian content figure each. A bid with several items needs a rule for combining them. With one unit the rule is plain; with mixed units the Act gives none, and the engine makes the evaluator state one.

## One unit: pool the quantities

The engine's rule, in its basis, when every item shares a unit: overall = 100 x sum of Nigerian quantities / sum of total quantities. The well services tender measures all three items in man-hours, so each bid's overall content is its Nigerian man-hours over all its man-hours:

| bid | overall content (man-hours, pooled) | items met |
| --- | --- | --- |
| WS1 | 82.647059 | 3 of 3 |
| WS2 | 77.647059 | 1 of 3 |
| WS3 | 86.529412 | 3 of 3 |
| WS4 | 67.058824 | 0 of 3 |
| WS5 | 78.750000 | 2 of 3 |
| WS6 | 84.705882 | 3 of 3 |

Pooling weights each item by its size in man-hours.

## Mixed units: a weighted mean with stated weights

The materials tender measures three items in tonnage and valves by number. A tonne and a valve cannot be added. The engine's rule when the units differ: overall = weighted mean of the item contents with each bid's stated weights. In the fixture, each materials bid weights its items by its own quoted amount for that item, the spend.

| bid | overall content (weighted by quoted amount) | items met |
| --- | --- | --- |
| MS1 | 56.246451 | 1 of 4 |
| MS2 | 61.584657 | 2 of 4 |
| MS3 | 86.240876 | 4 of 4 |
| MS4 | 57.043637 | 2 of 4 |
| MS5 | 49.874791 | 0 of 4 |

MS2's figure can be checked by hand. Its item contents are 60.000000 (casing), 58.333333 (valves), 82.000000 (cement) and 60.000000 (baryte), and its weights are its quoted amounts: casing 288000, valves 103200, cement 45000, baryte 80000. Multiply each content by its weight, add, and divide by the sum of the weights, and the result is 61.584657.

## Why the weights are stated

The Act gives no rule for adding man-hours to tonnes, so any weighting is a choice. Weighting by the quoted amount says each item counts in proportion to the money spent on it. Equal weights would say each item counts the same, however small. Neither is in the Act. The engine therefore has no default: a bid with items in different units and no weights is refused, and the refusal names an example of a weight to state:

> bids[0].weights are required: the items are measured in different units, so the overall content is the weighted mean of the item contents with stated weights (for example the priced amount of each item)

A negative weight is refused, and so is a set of weights that are all zero:

> bids[0].weights must not all be 0

This is a declared convention of the engine: overall content across units is a weighted mean with stated weights. Different weights give a different overall content, which under s.14 can change which bid leads, so a report states the weights beside every overall figure.

## What the overall figure is for

The overall content is the figure module 5 carries into s.14 of the Act. MS2's 61.584657 and MS4's 57.043637 are the two figures that decide the materials award there.

## Exercise

Open the award calculator on the view "Nigerian content by item". It starts on the materials tender with the spend weights. Delete the weights object from the first bid and read the refusal. Restore it, then set all four of MS2's weights to 1 and read its new overall content; check it by hand as the plain mean of its four item contents. Back on the first bid, set one weight to a negative number and read that refusal, then set all four of its weights to 0. Finally restore the spend weights and confirm 61.584657.
