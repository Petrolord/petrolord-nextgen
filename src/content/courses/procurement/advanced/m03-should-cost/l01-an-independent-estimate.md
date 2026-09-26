# An independent estimate from the programme

{{panel:pr-contract-calculator}}

A tender committee that has only the bids to look at can rank them, but it cannot say whether any of them is a fair price. For that it needs its own figure, built before the envelopes open and without reference to them. In this course that figure is the should-cost: the company's independent estimate of the job, built from the programme. It is never a bid, and no bidder's number goes into it.

## Built from the same programme

The engine does not estimate from scratch. It imports the drilling courses' `engines/drilling/wellCost.js`, runs the same eleven-activity programme the contract comparison used, and prices it with the company's own cost items. The engine's estimate basis, verbatim:

> engines/drilling/wellCost.js evaluateProgram then afeCosts: per-day items x total days, per-meter items x drilled metres, lump items as valued, contingency as a fraction of the base

The company's cost items for the Ekene job, stated in the fixture:

| cost item | basis | rate or value | category |
| --- | --- | --- | --- |
| Coiled tubing spread | per-day | 26500.000000 | intangible |
| Company supervision | per-day | 3500.000000 | intangible |
| Pumping services | lump | 118000.000000 | intangible |
| Acid system | lump | 84000.000000 | tangible |
| Nitrogen | lump | 36000.000000 | tangible |
| Mobilisation and demobilisation | lump | 160000.000000 | intangible |

## The days come from the plan

The should-cost runs the programme at a single stated NPT fraction, 0.15, the most likely value of the contract comparison's triangle. So its total days equal the planned days of the contract comparison exactly:

| figure | value |
| --- | --- |
| total days at the stated NPT | 13.865486 |
| drilled metres | 0.000000 |
| base | 813964.583333 |

No metres are drilled in a coiled tubing cleanout, so no per-metre item applies, and the base is the per-day items times the total days plus the lump items as valued. The estimate is deterministic: one NPT fraction, no sampling, no seed. The contract comparison asks what the job might cost under uncertainty; the should-cost asks what the company believes a fair price is on its plan.

## Why the engine imports its estimate

Time and cost estimating belong to the drilling courses, and the platform keeps one engine for it. The tender engine imports wellCost and the AFE rollup and adds only the comparison with the bids. A change to how the platform estimates well time reaches the should-cost with no second copy to fall out of step.

## An imported refusal keeps its name

When wellCost refuses the programme, the tender engine passes its message through under the field `program`. An empty programme returns:

> program or its cost items are refused by engines/drilling/wellCost.js: The program has no activities.

Cost items that give an estimate of 0 are the tender engine's own refusal, because every bid is later divided by the estimate:

> items give an estimate of 0; the bid-to-estimate ratio is undefined

## Exercise

Open the contract calculator on the view "Should-cost and the screening band". It loads the Ekene estimate and the four passing bids. Read the tiles "Total days" and "Base" and check them against the table above. Change `nptFrac` to 0 and read the total days again, then compare it with the productive days the contract module gave. Put 0.15 back, replace `program` with an empty list, and read the refusal with the engine it names.
