# Carry-forward of excess takes

{{panel:gsa-ledger-calculator}}

Make-up runs one way: the buyer pays first and takes the gas later. Carry-forward runs the other way. A buyer that takes more than a stated base in one year earns a credit, and the credit reduces a deficiency in a later year. An agreement may carry both, and the export feed agreement does.

## What the texts say

ESMAP Report 152/93 (January 1993, World Bank and UNDP, read 2026-09-26) describes the right:

> "gas taken in excess of the minimum pay could be credited against the minimum-pay quantities in later years, reducing the minimum-pay obligation in those years." (ESMAP Report 152/93 (1993) para 6.61)

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) draws the credit from the oldest surplus first:

> "A Carry Forward Credit Quantity applied under Article 12.8.1 shall be attributed on a FIFO basis to the specific Buyer’s Annual Surplus Quantities comprising the Carry Forward Aggregate at the time." (Commonwealth model GSA (2025), Article 12.8)

## Off unless stated

Carry-forward is an option. A contract that states no carry-forward right gets none, and the engine's basis says so: "off (no carry-forward right stated)". When it is stated, `carryForward` carries three terms: `periodYears`, `base` and `capPct`. A misspelt term is refused by name, so no term is dropped in silence:

> carryForward.cap is not an accepted key; the accepted keys of carryForward are periodYears, base, capPct

## The same takes, with and without

Two cases share every input: an Adjusted ACQ of 1000.000000, take-or-pay at 80 percent and the same five takes. One states carry-forward of surplus above the Adjusted ACQ for 2 contract years with a cap of 100 percent; the other states none.

| year | counted | surplus | deficiency | credit applied | deficiency paid (with) | deficiency paid (without) |
| --- | --- | --- | --- | --- | --- | --- |
| 2027 | 1100.000000 | 100.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| 2028 | 1050.000000 | 50.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| 2029 | 700.000000 | 0.000000 | 100.000000 | 100.000000 | 0.000000 | 100.000000 |
| 2030 | 600.000000 | 0.000000 | 200.000000 | 50.000000 | 150.000000 | 200.000000 |
| 2031 | 1000.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |

The deficiency is the same in both cases; carry-forward changes what is paid. The 2029 reason shows the credit clearing the payment:

> 2029: 700 counted against the take-or-pay quantity 800 leaves a deficiency of 100; a carry-forward credit of 100 (at most 100% of the deficiency, first in first out: 100 from 2027) leaves 0; the deficiency payment is 0 x 3 = 0

In 2030 only the 2028 surplus of 50.000000 is left, so the credit is 50.000000 and 150.000000 is paid.

## Why a buyer wants it

Under take-or-pay alone, a buyer pays for a low year whatever it took in the high ones. Carry-forward lets a high year count toward a low one, inside a stated period and cap. The seller gives up deficiency payments in exchange, which is why the base, the cap and the period are negotiated terms, and why each is quoted beside any credit.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger".

1. Replace the inputs with five years of your own: `acq` 1000 in each year, taken 1100, 1050, 700, 600 and 1000, `topPct` 80, `contractPrice` and `topPrice` 3, `makeUpPrice` 0, and `makeUp` with `periodYears` 2, `order` "after-adjusted-acq" and `endOfTerm` "forfeit". Check the "without" column.
2. Add `carryForward` with `periodYears` 2, `base` "adjusted-acq" and `capPct` 100. Check the "with" column and read the reasons.
3. Compare the make-up outstanding in 2030 across the two runs and write what the credit did to the make-up entry.
4. Rename `capPct` to `cap` and read the refusal.
