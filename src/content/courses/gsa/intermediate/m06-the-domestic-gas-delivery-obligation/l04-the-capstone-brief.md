# The capstone brief

{{panel:gsa-ledger-calculator}}

The Professional capstone asks this tier's question: the ledger, the price and the Nigerian rules. It gives you a synthetic gas sales agreement of its own, with its own buyer, index series and terms, and asks for six values the engine returns. This lesson says what the capstone asks, where each value comes from in the ledger calculator, and how to rehearse on the Ekene agreements first.

## What the capstone gives you

The capstone card carries one case file with a block for each call: `price`, the monthly index series and the formula with its averaging, lag, reset, band and rounding; `pricing`, the basis of the contract price and the take-or-pay price (the annual average or the last month's price) and the stated make-up price; `contract`, the years with their reductions and takes, the take-or-pay percentage and the make-up terms; and `dgdo`, the lessee's obligation for one year with its contracts, excuses and any agreement rate.

## The six values

| value | module | where to find it |
| --- | --- | --- |
| the annual average price of a stated year | price formulas | the annual table of "Contract prices month by month" |
| the deficiency payment of a stated year | the take-or-pay ledger | the deficiency payment column of "The take-or-pay ledger" |
| the make-up taken in a stated year | the recovery order and first in first out | the make-up taken column of the same view |
| the make-up expired in a stated year | make-up expiry | the make-up expired column of the same view |
| the net to the seller over the term | the whole ledger | the total net to the seller tile of the same view |
| the lessee's penalty under the Domestic Gas Delivery Obligation | the obligation | the penalty tile of "The Domestic Gas Delivery Obligation" |

All six are reported to six decimals, as the panel prints them. Each is the same number under every reading the engine states, and none uses the domestic base price.

## How to load the case

Paste the whole case file into "The take-or-pay ledger". That view prices the months with the `price` block, copies each year's prices from the annual rows by the basis in `pricing`, and runs the ledger; the priced prices appear in a table above the ledger. Paste the same whole file into "Contract prices month by month" and into "The Domestic Gas Delivery Obligation": each view reads the block it needs, `price` or `dgdo`, and leaves the rest of the file alone.

## Things to check before you copy a figure

Read the recovery order and the make-up period in the basis notes under the ledger, and check them against the card. Read each year's reasons: a draw names the entry it comes from, and an expiry names its year. Check the take-or-pay price basis in the priced table, since a deficiency payment follows the take-or-pay price. For the obligation, read which excuses were applied, in what order, and which rate basis the note names.

## How your answers are checked

Every graded value is a return value of the engine on the card's terms, so there is exactly one right answer. If a view refuses the case, a term has been changed or mistyped: read the field the refusal names and restore the card's term.

## Exercise

Rehearse in the course's own ledger calculator on figures this tier prints.

1. In "Contract prices month by month", on its starting export feed price, read the 2029 annual average price, 9.808450.
2. In "The take-or-pay ledger", on its starting power plant agreement, read the 2028 deficiency payment, 1501584.000000, the 2029 make-up taken, 210000.000000, the 2031 make-up expired, 210000.000000, and the total net to the seller, 122801553.000000. The money figures rest on the fixture's stated planning price.
3. In "The Domestic Gas Delivery Obligation", on its starting case, read the 2028 penalty, 2366700.000000.
4. For each of the six values, write the input on the card you will check first.
