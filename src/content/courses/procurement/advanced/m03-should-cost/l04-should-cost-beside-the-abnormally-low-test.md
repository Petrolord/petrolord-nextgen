# Should-cost beside the abnormally low test

{{panel:pr-award-calculator}}

{{panel:pr-contract-calculator}}

The Professional tier taught the World Bank's test for an abnormally low bid; the screening band is the company's own screen. On the well services tender the two meet, because the Bank's test needs a cost estimate there and the should-cost is the one the company has.

## The Bank's test needs an estimate below five bids

The World Bank Procurement Guidance, Abnormally Low Bids and Proposals (Second Edition, July 2016, read on 2026-09-26) sets two approaches at its Stage 1. With five or more substantially responsive bids it compares each bid with the others; with fewer than five it compares each with the Borrower's cost estimate and flags a bid 20 percent or more below it. The well services tender has four responsive bids, so the absolute approach applies, and the engine refuses to run it without an estimate:

> estimate is required: with 4 substantially responsive bids (fewer than 5) the absolute approach compares each bid with the Borrower's cost estimate

## The should-cost as that estimate

With the should-cost of 895361.041667 as the estimate, each evaluated cost (omission rule average; schedule minWeeks 6, maxWeeks 10, ratePerWeek 0.005) sits this far below it:

| bid | evaluated cost | percent below the estimate | ALB flag | band ratio | band flag |
| --- | --- | --- | --- | --- | --- |
| WS5 | 862141.000000 | 3.710240 | false | 0.962898 | null |
| WS2 | 885574.000000 | 1.093083 | false | 0.989069 | null |
| WS1 | 928200.000000 | -3.667678 | false | 1.036677 | null |
| WS3 | 957990.000000 | -6.994827 | false | 1.069948 | null |

A negative percentage is a bid above the estimate. No bid comes near 20 percent below, and none leaves the band, so neither screen flags anything on this tender.

## Two screens, one direction of travel

The two screens are built differently. The Bank's absolute test looks only downward and has a threshold the Guidance publishes. The band looks both ways and has limits the company states, because no text publishes one. They agree on what a flag means. The band's reason for a bid below its lower limit ends with an instruction to examine it as a possibly abnormally low bid, and every flag the Bank's test raises carries the same clause, from the engine:

> a potential abnormally low bid: clarify the price with the bidder before any decision; it is never rejected automatically

Neither screen rejects a bid. Stage 1 identifies a bid to examine, and the Guidance requires the price to be clarified with the bidder before any decision. A should-cost that looks wrong after clarification is itself a finding.

## Why the estimate must be independent

The absolute test is only as honest as the estimate. The should-cost is built from the programme and the company's own rates before the envelopes open, so a bid that sits far below it is far below something the bids did not shape.

## Exercise

Open the award calculator on the view "Abnormally low bids". Replace the bids in the box with the four well services bids and their evaluated costs from the table above, leave the cost estimate blank, and read the refusal. Type 895361.041667 as the cost estimate and confirm the approach, the four percentages and that no bid is flagged. Then open the contract calculator on the view "Should-cost and the screening band" and check that the four ratios there agree with the band columns above. With the band at its stated 0.8, say which screen flags first as a bid's evaluated cost falls toward 80 percent of the estimate, and at exactly which point the two screens differ.
