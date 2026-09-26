# Contract years in sequence

{{panel:gsa-quantity-calculator}}

{{panel:gsa-ledger-calculator}}

At Associate you reconciled one contract year. A gas sales agreement runs for many years, and its years talk to each other: a deficiency paid in one year can be taken later as make-up, and takes above a stated base can be credited against a later deficiency. This tier works that conversation, which the course calls the take-or-pay ledger.

## One call, consecutive years

The engine's `takeOrPay` takes every contract year in one call, in order, with the take-or-pay percentage, the make-up terms and any carry-forward terms. It reconciles the first year, carries whatever is still open into the next, and walks on to the end of the term. A list that skips a year is refused in the engine's own words:

> years[1].year must be 2028, the year after 2027 (contract years are consecutive); got 2029

Every year starts the way it did at Associate. The Commonwealth Secretariat's Gas Sales Agreement, Contract 2 in the Commonwealth Model Contract Series (2025, licensed under Creative Commons Attribution 4.0, read 2026-09-26), states the obligation that every row of the ledger tests:

> "In each Contract Year Buyer shall be obligated to take and pay for, or to pay for if not taken, a quantity of Gas at least equal to the Take or Pay Quantity." (Commonwealth model GSA (2025), Article 12.6)

## The power plant, year by year

The Ekene power plant agreement is synthetic. It runs 2027 to 2034 at a DCQ of 21000.000000 MMBtu per day, with take-or-pay at 80 percent of the Adjusted ACQ. Its first three years, as the engine returns them:

| year | ACQ | force majeure | seller shortfall | Adjusted ACQ | take-or-pay quantity | taken | deficiency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2027 | 7665000.000000 | 42000.000000 | 6300.000000 | 7616700.000000 | 6093360.000000 | 7245000.000000 | 0.000000 |
| 2028 | 7686000.000000 | 0.000000 | 0.000000 | 7686000.000000 | 6148800.000000 | 5460000.000000 | 688800.000000 |
| 2029 | 7665000.000000 | 0.000000 | 0.000000 | 7665000.000000 | 6132000.000000 | 7875000.000000 | 0.000000 |

Three things change from row to row. The ACQ follows the day count: 2028 is a leap year, so its 366 days give 7686000.000000. The reductions are the year's own: force majeure and a seller shortfall bring 2027's Adjusted ACQ down to 7616700.000000. And the takes move: in 2028 the plant took 5460000.000000 against 6148800.000000, a deficiency of 688800.000000.

## What the ledger adds

In the ledger each row also carries what came in from earlier years and what goes out to later ones: make-up available, taken, expired and outstanding, and with carry-forward terms stated, the credit applied and the carry-forward outstanding.

That is why 2029 counts 7665000.000000 against its take-or-pay quantity although the plant took 7875000.000000. The quantity counted is the quantity taken less the make-up taken, and in 2029 the buyer took 210000.000000 of its 2028 entry as make-up. The next lesson explains that entry.

## Exercise

Work in the course's own calculator panels, which call the same engine these lessons quote.

1. Open the ledger calculator on the view "The take-or-pay ledger". It starts with the power plant agreement. Check the 2027, 2028 and 2029 rows against the table above.
2. In the quantity calculator's view "One take-or-pay year", start from "The power plant, 2027 alone". Confirm that the Adjusted ACQ and the take-or-pay quantity are the same when the year stands alone.
3. Back in the ledger view, delete the 2029 entry from `years`. Read the refusal: write down which entry it names and which year it expects. Restore the entry.
4. For 2029, write the quantity taken, the quantity counted and the make-up taken, and show that the first less the third is the second.
