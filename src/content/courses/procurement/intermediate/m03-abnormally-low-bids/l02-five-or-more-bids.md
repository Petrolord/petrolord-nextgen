# Five or more bids: the relative test

{{panel:pr-award-calculator}}

With five or more substantially responsive bids, the World Bank's Guidance on Abnormally Low Bids and Proposals (Second Edition, July 2016, read on 2026-09-26) compares each bid with the other bids at Stage 1.

## The relative rule

The engine's rule, in its basis:

> 5 or more substantially responsive bids: flag when C < mean - SD, the population standard deviation (more than one standard deviation below the average)

C is a bid's evaluated cost. The mean and the standard deviation are taken over all the substantially responsive bids, the flagged bid included. The inequality is strict: a bid exactly at the limit is not flagged, and a bid below it is. The standard deviation is the population figure, which divides by the number of bids; the next lesson explains that choice.

No estimate is needed. If one is given it must still be a valid figure, and the engine refuses a negative estimate even when the relative approach will not use it:

> estimate must be a finite number above 0 when given

## Annex I, Example 1

The Guidance works an example with 16 bids. The engine takes the relative approach and returns:

| figure | engine | the Guidance prints |
| --- | --- | --- |
| mean | 1664426.375000 | 1664426 |
| standard deviation (population) | 315974.537496 | 315975 |
| limit, mean less one standard deviation | 1348451.837504 | 1348452 |

The engine flags Bid 1, Bid 2 and Bid 3. The Guidance prints each figure rounded to the unit. The engine's reason for Bid 1, verbatim:

> Bid 1: evaluated cost 1145142 is below the average 1664426.375 less one standard deviation 315974.5374956808, that is below 1348451.8375043191: a potential abnormally low bid: clarify the price with the bidder before any decision; it is never rejected automatically

## What the relative test sees and misses

The relative test needs no estimate, which is its strength: a buyer's estimate can be stale or wrong, and the field of bids is current. It has two blind spots. If every bidder misreads the scope the same way, the whole field is low and nobody stands out. And a flagged bid is part of the statistics it is tested against: a very low bid lowers the mean and widens the standard deviation, so it moves its own limit.

The switch between the two approaches is a count. At 4 responsive bids the engine takes the absolute approach and needs an estimate; at 5 it takes the relative approach. The engine counts the bids it is handed, so the evaluator hands it the substantially responsive bids only: a bid that failed the technical envelope, or was rejected with a stated reason at the commercial stage, is left out.

## Exercise

Open the award calculator on the view "Abnormally low bids". It starts on the four responsive materials bids. Add a fifth bid of your own, with an id of your choosing and an evaluated cost well below the other four, and leave the estimate blank. Read the approach tile, the mean, the standard deviation, the limit and the list to clarify. Then raise your fifth bid's evaluated cost step by step until it is no longer flagged, and record the last flagged value and the limit beside it. Finally type a negative estimate and read the refusal.
