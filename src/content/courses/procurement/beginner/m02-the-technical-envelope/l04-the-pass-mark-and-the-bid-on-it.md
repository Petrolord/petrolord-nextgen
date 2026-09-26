# The pass mark and the bid that sits on it

{{panel:pr-envelope-calculator}}

The pass mark is the minimum technical percentage a bid must reach for its price to be opened. It is set in the tender before any bid arrives. This lesson reads how the engine compares a bid with it, what happens to a bid exactly on it, and why the engine holds no default pass mark.

## The rule, at the boundary

The engine's basis for the well services tender reads:

> a bid passes when technicalPercent >= 70; only passing bids have their commercial envelope opened

The sign is "greater than or equal". A bid AT the pass mark passes. A detail like this is easy to get wrong by hand, and it can decide a contract.

| bid | technicalPercent | pass mark | status |
| --- | --- | --- | --- |
| WS3 | 85.000000 | 70 | pass |
| WS1 | 82.500000 | 70 | pass |
| WS2 | 75.000000 | 70 | pass |
| WS5 | 70.000000 | 70 | pass |
| WS4 | 65.000000 | 70 | fail-pass-mark |

WS5 scores 70.000000, exactly the pass mark, and passes. WS4 is scored, falls short and is returned with this reason:

> WS4: technical score 65 is below the pass mark 70; the commercial envelope is not opened

WS5 goes on to hold the lowest evaluated cost of the tender. A strict "above" test would have removed it at this stage.

## The materials tender at 60

| bid | technicalPercent | pass mark | status |
| --- | --- | --- | --- |
| MS3 | 90.000000 | 60 | pass |
| MS1 | 75.000000 | 60 | pass |
| MS2 | 71.250000 | 60 | pass |
| MS4 | 68.750000 | 60 | pass |
| MS5 | 50.000000 | 60 | fail-pass-mark |

> MS5: technical score 50 is below the pass mark 60; the commercial envelope is not opened

## A minimum quality threshold in the Guidance

The World Bank Procurement Guidance: Evaluating Bids and Proposals (February 2025) prints, in its Annex 2, three companies scored in points out of 15, 15 and 70, with a threshold of 80. With weights equal to the maximum points, the technical percentage equals the points total:

| company | scores (source) | technicalPercent (engine) | status (engine) |
| --- | --- | --- | --- |
| A | 7 + 4 + 48 | 59.000000 | fail-pass-mark |
| B | 12 + 11 + 54 | 77.000000 | fail-pass-mark |
| C | 13 + 11 + 67 | 91.000000 | pass |

On its printed criterion scores Company B totals 77.000000 and falls below the threshold with Company A. The Guidance itself prints B's total differently, and the Expert tier reads that disagreement.

## No default

A pass mark left out is refused, and so is one of 101:

> passMark must be a number from 0 to 100 (a percentage of the maximum technical score); there is no default

The three examples in this lesson use three different pass marks: 70 on the well services tender, 60 on the materials tender and 80 in the Guidance's Annex 2. No single figure is standard. The pass mark changes who reaches the price stage, so it must be a stated decision of each tender. An engine that filled in a common figure would make that decision for the committee without saying so.

## Exercise

In the envelope calculator choose "The technical envelope". Raise the pass mark from 70 to 71 and read the new status and reason for WS5. Set it back to 70, then lower it to 65 and look at WS4. Write one sentence on each change saying which price envelopes it would open. Then enter the Annex 2 example as three criteria of weight 15, 15 and 70 with those maximum scores, three bids with the scores above, and a pass mark of 80. Confirm the three statuses.
