# Clarify before any decision

{{panel:pr-award-calculator}}

A flag is a question. The engine's test for abnormally low bids identifies bids whose price needs explaining; it never removes a bid from the evaluation.

## The same clause on every flag

Every flag reason the engine returns, under either approach, ends with the same clause:

> a potential abnormally low bid: clarify the price with the bidder before any decision; it is never rejected automatically

The wording follows the source, the World Bank Procurement Guidance, Abnormally Low Bids and Proposals, Second Edition, July 2016, read on 2026-09-26. Its Stage 1, which is what the engine computes, identifies a bid to examine. The Guidance then requires the price to be clarified with the bidder before any decision.

A low price can have honest causes or a misread scope behind it, and the arithmetic of Stage 1 cannot tell them apart. Only the bidder's answer, examined by the committee, can.

## Where a rejection enters

If the committee examines a flagged bid and rejects it, the rejection is a decision with a reason, and the engine takes it as one. At the commercial stage a bid can carry a stated rejection reason, and the engine excludes it with that reason in its own words. An empty reason is refused:

> bids[0].rejected must be a non-empty reason string when given

The World Bank's Guidance on Evaluating Bids and Proposals (February 2025) shows the pattern in its Figures X to XII: company E is excluded with the stated reason "abnormally low bid, rejected after examination", and the remaining four are ranked.

## A rejection moves the relative test

Under the absolute approach each bid is compared with the buyer's estimate alone, so removing one bid changes nothing for the others. Under the relative approach the mean and the standard deviation are computed over the field, so removing a bid means the engine computes the limit again over the bids that remain. With fewer than five bids left, the engine switches to the absolute approach and asks for an estimate.

Both runs belong in the report: the field before the rejection, the rejection with its reason, and the field after it.

## What the course grades

The course grades the figures the engine returns and the list to clarify. It grades no decision to reject a flagged bid, because that rests on the bidder's explanation, which no engine sees.

## Exercise

Open the award calculator on the view "Abnormally low bids". Enter the four bids of Annex I Example 2, Bid 1 to Bid 4, with the estimate 150003863, and note the list to clarify. Delete Bid 1, as if the committee had rejected it after examination, and read the list again: say why Bid 2's flag did not move. Then build a field of six bids of your own with one clearly low, read the relative limit, delete the low bid and read the limit again. Finally delete one more bid and read what the engine asks for.
