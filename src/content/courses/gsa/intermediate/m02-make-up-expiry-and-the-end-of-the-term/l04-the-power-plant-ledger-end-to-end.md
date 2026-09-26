# The power plant ledger end to end

{{panel:gsa-ledger-calculator}}

This lesson reads the whole power plant ledger, eight contract years, as one account, and gives you a check to run on every ledger you build from now on. Every piece has appeared already: the Adjusted ACQ, the take-or-pay quantity, the deficiency and its payment, make-up in the model agreement's order, expiry and forfeiture at the end. Here they add up.

## The terms

The Ekene power plant agreement is synthetic: 2027 to 2034, DCQ 21000.000000 MMBtu per day, take-or-pay 80 percent of the Adjusted ACQ, make-up for 3 contract years taken only after the Adjusted ACQ, forfeited at the end, no carry-forward. Its contract and take-or-pay prices are the reported 2026 domestic base price, held flat by the fixture as a stated planning assumption, so every money figure below rests on that assumption. The quantities do not.

## The eight years

| year | take-or-pay quantity | taken | make-up taken | counted | deficiency | deficiency payment | make-up expired | make-up outstanding |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2027 | 6093360.000000 | 7245000.000000 | 0.000000 | 7245000.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| 2028 | 6148800.000000 | 5460000.000000 | 0.000000 | 5460000.000000 | 688800.000000 | 1501584.000000 | 0.000000 | 688800.000000 |
| 2029 | 6132000.000000 | 7875000.000000 | 210000.000000 | 7665000.000000 | 0.000000 | 0.000000 | 0.000000 | 478800.000000 |
| 2030 | 6132000.000000 | 7665000.000000 | 0.000000 | 7665000.000000 | 0.000000 | 0.000000 | 0.000000 | 478800.000000 |
| 2031 | 6132000.000000 | 7933800.000000 | 268800.000000 | 7665000.000000 | 0.000000 | 0.000000 | 210000.000000 | 0.000000 |
| 2032 | 6148800.000000 | 6148800.000000 | 0.000000 | 6148800.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| 2033 | 6132000.000000 | 5775000.000000 | 0.000000 | 5775000.000000 | 357000.000000 | 778260.000000 | 0.000000 | 357000.000000 |
| 2034 | 6132000.000000 | 7770000.000000 | 105000.000000 | 7665000.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |

Two years are boundaries. In 2030 the plant takes exactly its Adjusted ACQ and takes no make-up. In 2032, a leap year, it takes exactly its take-or-pay quantity of 6148800.000000, and the deficiency is 0.000000: exactly met is no deficiency, and one MMBtu less would open one.

The 2034 row shows 0.000000 outstanding because the term ends: the engine's last reason forfeits 252000.000000 of the 2033 entry, which the totals report as the end-of-term quantity.

## The totals

| total (engine) | value |
| --- | --- |
| taken | 55872600.000000 |
| deficiency paid | 1045800.000000 |
| make-up taken | 583800.000000 |
| make-up expired | 210000.000000 |
| end-of-term quantity | 252000.000000 |
| deficiency payment | 2279844.000000 |
| shortfall payment | 7875.000000 |
| net to the seller | 122801553.000000 |

## The make-up account closes

Every MMBtu paid for and not taken ends in one of three places. It is taken later as make-up, it expires inside the term, or it is left at the end of the term. On this ledger 583800.000000 taken, 210000.000000 expired and 252000.000000 forfeited add to 1045800.000000, the deficiency paid over the term. A ledger whose three do not add to its deficiency paid has lost gas somewhere, and this check is the first one to run on any ledger you build.

The money follows the quantities. The two deficiency payments, 1501584.000000 in 2028 and 778260.000000 in 2033, add to 2279844.000000. The seller shortfall damages go the other way, to the buyer, and the engine's reason gives them at the stated contract rate: "2027: seller shortfall 6300 reduces the Adjusted ACQ and is paid to the buyer at 1.25: 7875". The net to the seller, 122801553.000000, is the regular revenue of 120529584.000000 plus the deficiency payments less those damages, all on the stated planning price.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger", which starts with the power plant agreement.

1. Read the four total tiles and the table. Check the make-up account: make-up taken plus make-up expired plus the end-of-term quantity against the deficiency paid.
2. Reduce the 2032 `taken` by one MMBtu. Write the new 2032 deficiency and deficiency payment, and say which later rows change.
3. Restore 2032 and change `order` to "after-top-quantity". Run the make-up account check again and write which year's make-up taken moved first.
4. Write the terms you would quote beside the total deficiency payment, following the course's rule for a figure that depends on a term.
