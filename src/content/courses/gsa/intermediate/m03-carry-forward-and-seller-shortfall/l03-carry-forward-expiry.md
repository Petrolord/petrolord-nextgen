# Carry-forward expiry

{{panel:gsa-ledger-calculator}}

A carry-forward credit lasts a stated number of contract years, like make-up. What expires is different. Expired make-up is gas the buyer paid for and never took; an expired surplus is a credit the buyer earned and never used. The gas was taken and invoiced at the contract price in its own year, so expiry costs the buyer only the protection the credit would have given.

## The period

The engine takes `carryForward.periodYears` as a whole number of years, at least 1:

> carryForward.periodYears must be an integer at or above 1; got 0

A surplus earned in year y is carried to the end of year y + N, and the engine's reason prints the window when it opens, for example "2027: 1100 counted exceeds the Adjusted ACQ 1000 by 100, carried forward to the end of 2029". Credits are drawn first in first out, so the oldest surplus is spent first and the youngest is the last to lapse.

## A credit that finds no deficiency

The case below states carry-forward above the Adjusted ACQ for 2 contract years with a cap of 100 percent, on an Adjusted ACQ of 1000.000000 with take-or-pay at 80 percent.

| year | counted | surplus | deficiency | credit applied | deficiency paid | expired | outstanding |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2027 | 1100.000000 | 100.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 100.000000 |
| 2028 | 1000.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 100.000000 |
| 2029 | 1000.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 100.000000 | 0.000000 |
| 2030 | 700.000000 | 0.000000 | 100.000000 | 0.000000 | 100.000000 | 0.000000 | 0.000000 |

The 2027 surplus waits through two years with no deficiency and lapses at the end of 2029: "2029: carry-forward of 100 from 2027 expired unused at the end of 2029". The deficiency comes one year too late, and 2030 pays for all 100.000000. It is also the last contract year, so its reason ends "the delivery period ends with this year, so no make-up right arises".

## On the export feed ledger

The export feed agreement (synthetic) carries surplus above the take-or-pay quantity for 3 contract years, capped at 50 percent of a year's deficiency. Three credits lapse unused over its term:

> 2031: carry-forward of 694050 from 2028 expired unused at the end of 2031

> 2034: carry-forward of 1247150 from 2031 expired unused at the end of 2034

> 2036: carry-forward of 1033150 from 2033 expired unused at the end of 2036

The 2028 surplus of 1613800.000000 gave 919750 to the 2029 credit, as that year's reason prints it, and let the rest go. The cap kept the rest from being used: 2029's deficiency of 6438500.000000 could draw only half of itself, 3219250.000000, and no other deficiency fell inside the window of the 2028 surplus.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger".

1. Build the four years above: `acq` 1000, taken 1100, 1000, 1000 and 700, `topPct` 80, `contractPrice` and `topPrice` 3, `makeUpPrice` 0, `makeUp` with `periodYears` 2, `order` "after-adjusted-acq" and `endOfTerm` "forfeit", and `carryForward` with `periodYears` 2, `base` "adjusted-acq" and `capPct` 100. Check the table.
2. Set the carry-forward `periodYears` to 3 and write the 2030 credit and deficiency payment.
3. Set it to 0 and read the refusal.
