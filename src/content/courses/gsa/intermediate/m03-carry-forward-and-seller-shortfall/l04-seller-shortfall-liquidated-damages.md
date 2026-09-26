# Seller shortfall liquidated damages

{{panel:gsa-quantity-calculator}}

{{panel:gsa-ledger-calculator}}

Take-or-pay protects the seller against a buyer that does not take. The mirror term protects the buyer against a seller that does not deliver. When the seller fails to make available gas the buyer properly nominated, the quantity is a seller shortfall, and the agreement prices it as liquidated damages the seller pays. This lesson follows one seller shortfall from the day it happens to the ledger year it reduces.

## The day

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) opens its definition with the seller's failure:

> "means for any Day in the Delivery Period, during which Seller did not make available the Properly Nominated Quantity," (Commonwealth model GSA (2025), definition of Shortfall Quantity)

At Associate you met the power plant's January 2027 in the daily balance. On 20 January the buyer properly nominated 22050.000000 and the seller made 15750.000000 available. The engine's reason:

> 2027-01-20: the seller made 15750 available against a properly nominated 22050: seller shortfall 6300

The month's seller shortfall totals 6300.000000, and so does the power plant's 2027 contract year in the ledger.

## The year

A seller shortfall does two things in the ledger. It reduces the Adjusted ACQ, so the buyer is not asked to take, or to pay for, gas the seller did not offer. And it is paid to the buyer at the shortfall price the agreement states. The power plant fixture states that price in its own words: "seller shortfall liquidated damages at a stated 1.25 US$ per MMBtu not made available (synthetic contract term)". The engine's reason for 2027:

> 2027: seller shortfall 6300 reduces the Adjusted ACQ and is paid to the buyer at 1.25: 7875

| case | ACQ | Adjusted ACQ | seller shortfall | shortfall price | shortfall damages |
| --- | --- | --- | --- | --- | --- |
| power plant 2027 | 7665000.000000 | 7616700.000000 | 6300.000000 | 1.250000 | 7875.000000 |
| single year | 1000.000000 | 800.000000 | 50.000000 | 1.500000 | 75.000000 |

In the single-year case the damages come off the net to the seller, which is 1845.000000 after a deficiency payment of 120.000000 on the other side.

## No default rate

The damages rate is a contract term, and the engine holds none. A seller shortfall stated with no price is refused:

> years[0].shortfallPrice must be stated when sellerShortfall is above 0 (5); the engine holds no default rate; got nothing

The refusal is the point: a ledger that silently priced a seller's failure at zero, or at the contract price, would state a term nobody agreed. The course quotes shortfall damages with their rate.

## Exercise

Work in the course's own calculator panels.

1. In the quantity calculator, open "The daily balance". It starts with the power plant's January 2027. Find 20 January and read its seller shortfall and reason, then the month's total.
2. In the ledger calculator, open "The take-or-pay ledger". Read the 2027 Adjusted ACQ, the shortfall damages and the net to the seller.
3. Delete `shortfallPrice` from the 2027 entry and read the refusal. Restore it.
4. Change the 2027 `sellerShortfall` to 0 and write the new Adjusted ACQ and take-or-pay quantity. Say why the buyer is better off with the seller shortfall recorded, even before the damages.
