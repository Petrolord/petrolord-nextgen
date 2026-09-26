# Deficiency and the deficiency payment

{{panel:gsa-quantity-calculator}}

When a buyer takes less than the take-or-pay quantity in a contract year, the gap is a deficiency. The buyer pays for it. This is the "pay" of take-or-pay: revenue the seller receives whatever the buyer's plant does.

## The deficiency

The model agreement names the buyer's annual deficiency quantity for exactly this year:

> "means for any Contract Year in which Buyer does not take at least the Take or Pay Quantity," (Commonwealth model GSA (2025), definition of BADQ)

The engine's rule: deficiency = TOPQ - (taken - make-up taken), when positive. In a single contract year there is no make-up to take, so the quantity counted against the take-or-pay quantity is simply the gas taken.

## The deficiency payment

The engine's rule: deficiency payment = (deficiency - carry-forward credit) x topPrice. In one year with no carry-forward, it is the deficiency times the take-or-pay price. The take-or-pay price is a stated input with no default; a year without one is refused:

> years[0].topPrice must be a finite number at or above 0; got nothing

| case | take-or-pay quantity | taken | deficiency (engine) | deficiency payment (engine) |
| --- | --- | --- | --- | --- |
| single year | 900.000000 | 500.000000 | 400.000000 | 1200.000000 |
| a zero-take year | 800.000000 | 0.000000 | 800.000000 | 2400.000000 |
| force majeure and seller shortfall | 640.000000 | 600.000000 | 40.000000 | 120.000000 |

The engine prints its working in the reason. For the single year, verbatim:

> 2027: 500 counted against the take-or-pay quantity 900 leaves a deficiency of 400; the deficiency payment is 400 x 3 = 1200; the delivery period ends with this year, so no make-up right arises

## A payment for gas paid for

A deficiency payment is a payment for gas the buyer committed to and did not take. The Commonwealth model agreement lets the buyer take that gas later, as make-up, within a make-up period of a stated number of following contract years. The single-year reason above shows the other case, in the engine's words: that year is also the last of the delivery period, so no make-up right arises. Make-up across contract years is the Professional tier's subject; at this tier, a deficiency is reconciled within its own year.

## Quoting a deficiency payment

A deficiency payment depends on the take-or-pay percentage and the take-or-pay price, so quote it with both. The single-year payment of 1200.000000 rests on a take-or-pay percentage of 90 and on the take-or-pay price stated in that case. Change either term and the payment changes.

## The make-up terms are required even for one year

A take-or-pay year cannot be computed without the make-up terms, because the engine must know what happens to a deficiency. They carry no default:

> makeUp must be an object { periodYears, order, endOfTerm } (no default); got nothing

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "One take-or-pay year". The starting case is one year: `year` 2027, `acq` 1000, `taken` 500, `topPct` 90, and a `makeUp` object with `periodYears` 2, `order` "after-adjusted-acq" and `endOfTerm` "forfeit". Run it and read the deficiency, the contract price and take-or-pay price columns, the deficiency payment and the reason. Change `topPrice` and run it again. Then delete `topPrice` and read the refusal.
