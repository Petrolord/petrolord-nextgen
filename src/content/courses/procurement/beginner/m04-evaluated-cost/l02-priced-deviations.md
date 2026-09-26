# Priced deviations

{{panel:pr-envelope-calculator}}

A bid seldom accepts every condition of the tender exactly as written. Some departures are small enough to keep the bid in the evaluation, provided their cost to the company is added to the price. Others are serious enough to reject the bid. This lesson reads how the engine handles each kind.

## Minor and major deviations

The Nigeria Public Procurement Act 2007 (Act No. 14, Official Gazette No. 65, Vol. 94, 19 June 2007) separates the two. A minor deviation is quantified in money and taken into account in the comparison, s.31(14). A major deviation makes the bid nonresponsive, s.31(7). The engine does not judge which kind a departure is. The evaluation decides that; the engine adds a priced deviation as an amount, and takes a major deviation as a stated rejection reason.

## WS2's payment terms

WS2 asks to be paid sooner than the conditions allow. The engine returns:

> WS2: deviation payment-terms: asks for payment in 30 days where the conditions give 60; priced at the interest on the earlier payment (9500)

| bid | corrected price | deviations | schedule adjustment | evaluated cost |
| --- | --- | --- | --- | --- |
| WS2 | 867400.000000 | 9500.000000 | 8674.000000 | 885574.000000 |

Paying 30 days early costs the company the interest on that money for the difference, and the tender's evaluation priced that at 9500.000000. The engine adds the figure as stated. The engine keeps the reason beside the figure so the report shows both.

## The shape of a deviation

Each deviation is an entry with an id, an amount and a reason. Given as text, the list is refused:

> bids[1].deviations must be an array of { id, amount, reason } when given

An entry with no amount is refused too, so no deviation can be listed without its price:

> bids[1].deviations[0] must be { id: a string, amount: a finite number, reason: a string }

## Rejection is a stated reason

A bid rejected at the commercial stage, for a major deviation or any other stated cause, is given a rejection reason. The engine then excludes it at the commercial stage, and the reason printed is the one you stated. An empty reason is refused, since a bid cannot be rejected without saying why:

> bids[0].rejected must be a non-empty reason string when given

A rejected bid is no longer responsive: it is not ranked, and its prices take no further part.

## Why price a deviation at all

Rejecting every departure would punish a sensible offer over a trivial point; ignoring departures would reward the bidder who shifts cost onto the company. Pricing the minor ones compares the bids as they would be signed.

## Exercise

In the envelope calculator choose "Evaluated cost of the passing bids". Find WS2's payment-terms deviation and change its amount from 9500 to 40000. Read WS2's new evaluated cost and rank. Restore it. Now add a line "rejected": "major deviation: refuses the liability clause" to WS1 and read the excluded count and the note that names WS1's reason. Check that WS1 no longer appears in the ranking. Finally, set the rejected reason to an empty string and read the refusal.
