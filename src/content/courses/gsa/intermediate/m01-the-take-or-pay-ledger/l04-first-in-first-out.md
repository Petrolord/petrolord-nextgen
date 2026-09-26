# Make-up drawn first in first out

{{panel:gsa-ledger-calculator}}

A buyer with deficiencies in two years holds two make-up entries, each with its own period. The recovery order decides how much make-up a year recovers; the drawing rule decides which entry it comes out of, and so which entry is left to expire.

## What the model agreement says

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) draws the oldest entry first:

> "A Make-Up Quantity nominated and taken shall be attributed on a FIFO basis to the specific Buyer’s Annual Deficiency Quantities comprising the Make-Up Aggregate at the time." (Commonwealth model GSA (2025), Article 12.7)

The engine draws first in first out under every recovery order it computes. First in first out is a drawing rule and no recovery order, which is why the engine refuses "fifo" as a value of `makeUp.order`.

## Two deficiencies, drawn in order

The case below has take-or-pay at 80 percent of an Adjusted ACQ of 1000.000000, make-up for 3 contract years after the Adjusted ACQ, forfeited at the end.

| year | deficiency paid | make-up taken | drawn from | expired | outstanding |
| --- | --- | --- | --- | --- | --- |
| 2027 | 100.000000 | 0.000000 | none | none | 100.000000 |
| 2028 | 50.000000 | 0.000000 | none | none | 150.000000 |
| 2029 | 0.000000 | 80.000000 | 80.000000 from 2027 | none | 70.000000 |
| 2030 | 0.000000 | 30.000000 | 20.000000 from 2027, 10.000000 from 2028 | none | 40.000000 |
| 2031 | 0.000000 | 0.000000 | none | 40.000000 from 2028 | 0.000000 |

The engine's reasons for the two draws, verbatim:

> 2029: make-up of 80 taken from the make-up aggregate 150 (make-up only after the Adjusted ACQ of the year is taken), first in first out: 80 from 2027

> 2030: make-up of 30 taken from the make-up aggregate 70 (make-up only after the Adjusted ACQ of the year is taken), first in first out: 20 from 2027, 10 from 2028

In 2030 the draw of 30.000000 empties the 2027 entry with 20.000000 and takes the other 10.000000 from 2028. The 2027 entry was usable to the end of 2030, so drawing it first spent the gas closest to expiry. The 2028 entry runs to the end of 2031, and in 2031 the buyer takes nothing above its Adjusted ACQ, so 40.000000 from 2028 expires unrecovered.

## Why the rule matters

Drawing oldest first spends each entry while its period is still open, so gas the buyer has paid for is not left to lapse while a younger entry is drawn down. The engine holds no other drawing rule: it applies the model agreement's under every recovery order a contract states. Each draw is printed in a reason, naming the entries and the quantity from each, so a ledger can be checked entry by entry. A make-up figure is quoted with its order and its period for the same reason.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger".

1. Build the case above as five years of your own: `acq` 1000 in each year, `topPct` 80, `contractPrice` and `topPrice` 3, `makeUpPrice` 0, and `makeUp` with `periodYears` 3, `order` "after-adjusted-acq" and `endOfTerm` "forfeit".
2. Set the 2027 and 2028 takes so that the deficiencies paid are 100 and 50. Work out each take from the take-or-pay quantity before you type it.
3. Set the 2029 and 2030 takes so that the buyer takes 80 and 30 above the Adjusted ACQ, and 2031 exactly at it. Read the reasons and check the "drawn from" column of the table above.
4. Change `periodYears` to 2 and write which entry now expires, in which year, and how much of it.
