# The make-up period and its last year

{{panel:gsa-ledger-calculator}}

A make-up right lasts a stated number of contract years. This lesson fixes when it starts and ends, and what a period of one year or of zero years does to the gas a deficiency payment can bring back.

## What the model agreement says

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) counts the period in whole contract years after the deficiency year:

> "Contract Years immediately following the Contract Year corresponding to such Buyer’s Annual Deficiency Quantity, within which Buyer has a right to make up" (Commonwealth model GSA (2025), definition of Make-Up Period)

The number of years is left for the parties to insert, and the engine takes it as `makeUp.periodYears`, a whole number of years with no default. A fraction is refused:

> makeUp.periodYears must be an integer at or above 0; got 1.5

## The rule the engine applies

A make-up period of N contract years after a deficiency year y runs to the end of year y + N, inclusive: usable in that last year, expiring at its end, gone in year y + N + 1. The reason that opens each entry prints the window: "2027: 600 counted against the take-or-pay quantity 800 leaves a deficiency of 200; the deficiency payment is 200 x 3 = 600; the buyer may make up 200 in the 2 contract years after 2027, to the end of 2029"

## Four periods on the same deficiency

Each case below has an ACQ of 1000.000000, take-or-pay at 80 percent and a 2027 deficiency of 200.000000, paid and opened as make-up under the model agreement's order.

| period (years) | year of the draw | make-up taken | expired, and when |
| --- | --- | --- | --- |
| 2 | 2029 | 100.000000 | 100.000000 at the end of 2029 |
| 2 | none | 0.000000 | 200.000000 at the end of 2029 |
| 1 | 2028 | 50.000000 | 150.000000 at the end of 2028 |
| 0 | none | 0.000000 | no entry opens |

The first row draws in 2029, the last year of a two-year period, and the draw counts: 100.000000 comes back and the other 100.000000 expires at that year end. The end of the delivery period can cut a window short, as a later lesson shows. In the second row the buyer takes exactly its Adjusted ACQ in 2028 and in 2029, so nothing is recovered and the whole entry expires at the end of 2029. With a one-year period the window closes a year sooner. With a period of zero years the engine's reason reads:

> 2027: 600 counted against the take-or-pay quantity 800 leaves a deficiency of 200; the deficiency payment is 200 x 3 = 600; the make-up period is 0 years, so no make-up right arises

The deficiency is still paid in full, and the payment buys no gas later.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger".

1. Replace the inputs with four years of your own: `acq` 1000 in each year, taken 600, 1000, 1100 and 1000, `topPct` 80, `contractPrice` and `topPrice` 3, `makeUpPrice` 0, and `makeUp` with `periodYears` 2, `order` "after-adjusted-acq" and `endOfTerm` "forfeit". Check the first row of the table above.
2. Move the take of 1100 from 2029 to 2030 and write what is recovered and what expires, and in which year.
3. Put it back, set `periodYears` to 1, and set the 2028 take so that the buyer takes 50 above its Adjusted ACQ. Compare with the third row.
4. Set `periodYears` to 0 and read the 2027 reason. Then set it to 1.5 and read the refusal.
