# Fewer than five bids: the absolute test

{{panel:pr-award-calculator}}

An award to the lowest evaluated cost can reward a price too low to deliver the job. The World Bank's guidance on abnormally low bids gives the evaluator a first screen for such prices.

## The source and its two approaches

The source is the World Bank Procurement Guidance, Abnormally Low Bids and Proposals, Second Edition, July 2016, Stage 1 and Annex I, read on 2026-09-26. Stage 1 identifies bids to examine. It offers two approaches, and the engine chooses between them by the number of substantially responsive bids:

* fewer than 5 bids: the absolute approach, against the buyer's cost estimate;
* 5 or more bids: the relative approach, against the other bids, which the next lesson takes.

Both constants are stated in the engine and cited to Stage 1: ALB_ABSOLUTE_PCT is 20 and ALB_RELATIVE_MIN_BIDS is 5.

## The absolute rule

The engine's rule, in its basis:

> fewer than 5 substantially responsive bids: flag when 100 x (estimate - C) >= 20 x estimate (20% or more below)

C is a bid's evaluated cost, and the estimate is the buyer's own cost estimate. In words: a bid 20 percent or more below the estimate is flagged.

With fewer than five bids the estimate is required, and the engine refuses a call without one. On the four responsive materials bids:

> estimate is required: with 4 substantially responsive bids (fewer than 5) the absolute approach compares each bid with the Borrower's cost estimate

## Annex I, Example 2

The Guidance works an example with four bids and a Borrower's cost estimate of 150003863. The engine's figures:

| bid | evaluated cost | percent below the estimate | flag |
| --- | --- | --- | --- |
| Bid 1 | 85862863 | 42.759565 | true |
| Bid 2 | 115494160 | 23.005876 | true |
| Bid 3 | 158012899 | -5.339220 | false |
| Bid 4 | 165385533 | -10.254183 | false |

A negative percentage is a bid above the estimate. The engine flags Bid 1 and Bid 2. The Guidance discusses Bid 1, the lowest; Bid 2 sits 23.005876 percent below the estimate, which is 20 percent or more by the same rule, and the engine flags every bid the rule reaches. The engine's reason for Bid 2, verbatim:

> Bid 2: evaluated cost 115494160 is 23.005876188668555% below the cost estimate 150003863, 20% or more below: a potential abnormally low bid: clarify the price with the bidder before any decision; it is never rejected automatically

The course quotes the numeric field at six decimals, 23.005876, and the reason only whole.

## The estimate carries the test

Under the absolute approach every flag depends on one figure the buyer supplies. An estimate set too high flags honest bids, and one set too low lets a dangerous price through, so a report that quotes a flag names the estimate and its source. How to build an independent estimate belongs to the Expert tier.

## Exercise

Open the award calculator and choose the view "Abnormally low bids". It starts on the four responsive materials bids with no estimate: read the refusal. Replace the bids with the four bids of Example 2, ids Bid 1 to Bid 4, and enter the estimate 150003863. Check the table against the one above and read each reason. Then return to the materials bids and try estimates of your own choosing until MS4 is flagged; record the highest estimate you tried at which MS4 is not flagged and explain which figure in the rule decides it.
