# The contract year in money

{{panel:gsa-quantity-calculator}}

The quantities of a contract year turn into money in one sum. The engine builds it from terms you have already met, and prints each term as its own column, so you can see exactly where the seller's revenue for the year comes from.

## The sum the engine builds

As the engine builds it, money in a contract year is this sum, and each term is a return value in the panel's table:

counted x contract price + make-up taken x make-up price + deficiency payment - seller shortfall x shortfall price - refund = net to the seller.

In a single contract year at this tier, two of those terms are zero. No make-up is taken, because make-up belongs to a later year, and no refund arises, because a refund belongs to the end of a multi-year term. That leaves three terms: the gas counted at the contract price, the deficiency payment, and any seller shortfall damages the seller pays back to the buyer.

| case | counted | deficiency payment (engine) | shortfall damages (engine) | net to seller (engine) |
| --- | --- | --- | --- | --- |
| exactly met | 800.000000 | 0.000000 | 0.000000 | 2400.000000 |
| a zero-take year | 0.000000 | 2400.000000 | 0.000000 | 2400.000000 |
| single year | 500.000000 | 1200.000000 | 0.000000 | 2700.000000 |
| force majeure and seller shortfall | 600.000000 | 120.000000 | 75.000000 | 1845.000000 |

## What take-or-pay does to the seller's year

Compare the first two rows. In one the buyer took the whole take-or-pay quantity; in the other it took nothing. The seller's net for the year is 2400.000000 in both. That is take-or-pay working as designed: up to the take-or-pay quantity, the seller is paid whether or not the gas flows. Above it, the seller is paid only for what the buyer takes.

The single-year row shows the same thing from the middle: some gas taken and paid for at the contract price, and the rest of the take-or-pay quantity paid for as a deficiency.

## Every figure depends on its terms

A deficiency payment is quoted with its take-or-pay percentage and price. A net to the seller is quoted with every term in the sum. None of these figures is a forecast of what a buyer will pay; each is what the stated clauses produce on stated takes. Change the take-or-pay price, the contract price or the percentage and the figures change with it.

## The power plant's price is a planning assumption

The Ekene power plant's contract price and take-or-pay price are 2.180000 in every year, which the fixture holds as a stated planning assumption: the domestic base price reported for 2026, held flat. Any money figure you compute on the power plant rests on that planning assumption and says so.

## What the panel shows

The one-year view prints each year's ACQ, Adjusted ACQ, take-or-pay quantity, taken, counted, deficiency, deficiency payment, regular revenue, shortfall damages and net to the seller, and totals for the deficiency payment and the net. Regular revenue is the counted gas at the contract price.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "One take-or-pay year". Run the starting case, which holds two contract years, and read the regular revenue, the deficiency payment, the shortfall damages and the net to the seller for 2027. Check that the first two, less the third, give the fourth. Then change the 2027 `taken` to 0, run it, and read the four columns again. Finally set `taken` to 800 and compare the net to the seller in the three runs.
