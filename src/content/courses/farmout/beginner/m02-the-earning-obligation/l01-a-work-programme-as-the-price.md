# A work programme as the price

{{panel:farmout-earning-calculator}}

On acreage that has seen little drilling, the farminee's price for a participating interest is mostly work: it undertakes to pay for a well, or part of one. That undertaking is the earning obligation. This module computes it for one event, and this lesson sets out what the obligation is and when it turns into a payment.

## Work as consideration

HMRC's Oil Taxation Manual treats a work programme as consideration for the participating interest. On page OT30048 (updated 1 May 2019) it describes the undertaking this way:

> "The phrase “obligation to undertake” is intended to cover all cases where the farmer in commits himself to bear his and the farmer out’s share of the costs of exploration or appraisal work" (HMRC Oil Taxation Manual OT30048)

The farminee bears its own share and part of the farmor's share. The part of the farmor's share it pays is the carry, and the gap between what it pays and what it earns is the promote. Both come from the same two stated terms: the share of the gross cost the farminee pays and the participating interest it earns.

## Assigned before the work, or after it

The manual separates two orders of events on page OT30021:

> "The assignment is normally made, subject to government consent, before the work is undertaken and is called a Farm in." (HMRC Oil Taxation Manual OT30021)

> "In contrast, an agreement under which the work obligation is to be completed before the assignment is generally referred to as an earn-in." (HMRC Oil Taxation Manual OT30021)

The engine turns each order into a stated vesting rule, and the Professional tier works both across several events. At this tier the deal has one event, and the rule is "per-event": the completed event vests its stated participating interest.

## An obligation and a payment

The engine reports every event's split as the obligation, whether or not the event is completed, and counts completed events only in its totals. The worked case `earn-none-completed` shows the difference. It states a well of 40000000.000000, with FIN paying 40.000000 percent to earn 30.000000 percent and no cap, and states that no event is completed yet.

| what the engine returns | figure |
| --- | --- |
| the event's split: what FIN would pay | 16000000.000000 |
| the event's promote ratio | 1.333333 |
| total paid by FIN | 0.000000 |
| participating interest vested | 0.000000 |

The reason line says so in the engine's words:

> vesting "per-event": 0 of 1 event completed; 0% vests

So the obligation is on the page from the moment the terms are stated, and the money and the participating interest move when the event is completed.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "An event not yet completed". Read the event row and the tiles, and check the four figures in the table above. Then set the "Events completed (stated)" control to 1 and run it again. Write down which tiles changed, which stayed the same, and what the reason line now says about vesting.
