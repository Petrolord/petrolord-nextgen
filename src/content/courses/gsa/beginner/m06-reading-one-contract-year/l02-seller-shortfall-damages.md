# Seller shortfall damages

{{panel:gsa-quantity-calculator}}

Take-or-pay protects the seller against a buyer who does not take. The mirror clause protects the buyer against a seller who does not deliver. When the seller fails to make available gas the buyer properly nominated, the contract can make the seller pay damages for each unit, at a stated rate. This lesson reads that clause in one contract year.

## Two consequences of one seller shortfall

A seller shortfall does two things in the year's reconciliation. First, it reduces the Adjusted ACQ, so the buyer's take-or-pay quantity falls with it; the buyer is never made to pay for gas the seller did not offer. Second, if the contract states a rate, the seller pays the buyer damages on it, and the net to the seller falls by that amount.

The golden case with force majeure and a seller shortfall shows both in one line of the engine's reasons, verbatim:

> 2027: seller shortfall 50 reduces the Adjusted ACQ and is paid to the buyer at 1.5: 75

| year | seller shortfall | shortfall damages (engine) | net to seller (engine) |
| --- | --- | --- | --- |
| 2027 | 50.000000 | 75.000000 | 1845.000000 |

## The rate is a stated term

The rate for seller shortfall damages is a contract term with no default. If a year states a seller shortfall and no rate, the engine refuses it, and says why:

> years[0].shortfallPrice must be stated when sellerShortfall is above 0 (5); the engine holds no default rate; got nothing

The Ekene power plant states its own rate as a synthetic contract term. The fixture's note, verbatim:

> seller shortfall liquidated damages at a stated 1.25 US$ per MMBtu not made available (synthetic contract term)

In the power plant's 2027, the seller shortfall of 6300.000000 found on 2027-01-20 is the quantity that rate applies to.

## Liquidated damages

A rate agreed in advance for a breach is called liquidated damages. The parties fix it when they sign, so neither has to prove its actual loss after the event. The rate is the parties' agreed estimate of what a missing unit of gas costs the buyer.

## Where the Professional tier takes this further

Over a multi-year term, seller shortfall damages sit in the ledger beside make-up and carry-forward, and the Professional tier works them there. At this tier, one year is enough to see the mirror: a buyer shortfall that reaches a deficiency is paid by the buyer, and a seller shortfall is paid for by the seller.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "One take-or-pay year". Run the starting case and read the Adjusted ACQ, the shortfall damages and the net to the seller for 2027, and find the reason that names the seller shortfall. Delete `shortfallPrice` from 2027 and read the refusal. Restore it, set `sellerShortfall` to 0, and run it again; compare the Adjusted ACQ, the take-or-pay quantity and the net to the seller with the first run.
