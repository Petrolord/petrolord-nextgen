# The carry-forward cap and its base

{{panel:gsa-ledger-calculator}}

Two terms decide how much a carry-forward right is worth. The base decides how much of a high year is surplus. The cap decides how much of a later deficiency the surplus may cover. This lesson moves each on the same five takes as the previous lesson.

## The base

The engine takes `base` as "adjusted-acq" or "top-quantity". Above the Adjusted ACQ, only takes past the year's full adjusted quantity earn credit. Above the take-or-pay quantity, the threshold is lower and more of each high year counts. Both cases below state a period of 2 contract years and a cap of 100 percent, on an Adjusted ACQ of 1000.000000 with take-or-pay at 80 percent:

| year | counted | surplus above the Adjusted ACQ | surplus above the take-or-pay quantity | credit (Adjusted ACQ base) | credit (take-or-pay base) |
| --- | --- | --- | --- | --- | --- |
| 2027 | 1100.000000 | 100.000000 | 300.000000 | 0.000000 | 0.000000 |
| 2028 | 1050.000000 | 50.000000 | 250.000000 | 0.000000 | 0.000000 |
| 2029 | 700.000000 | 0.000000 | 0.000000 | 100.000000 | 100.000000 |
| 2030 | 600.000000 | 0.000000 | 0.000000 | 50.000000 | 200.000000 |

On the lower base the 2030 deficiency of 200.000000 is covered in full, and some surplus still goes unused. The engine's reasons say where:

> 2029: carry-forward of 200 from 2027 expired unused at the end of 2029

> 2030: carry-forward of 50 from 2028 expired unused at the end of 2030

## The cap

ESMAP Report 152/93 (January 1993, read 2026-09-26) describes a seller limiting the right:

> "the seller may include a provision whereby the use of a carry-forward right in any year should not exceed a certain percentage of the annual quantity." (ESMAP Report 152/93 (1993) para 6.62)

The engine states its cap as a percentage of the year's deficiency, and its basis names it, as on the export feed agreement: "surplus above the take-or-pay quantity is credited against later deficiencies, at most 50% of a year's deficiency, first in first out, for 3 contract years". A cap outside 0 to 100 is refused:

> carryForward.capPct must be a number from 0 to 100; got 120

With the Adjusted ACQ base and a cap of 50 percent, 2029's deficiency of 100.000000 takes a credit of 50.000000 and pays for 50.000000, and the other 50.000000 of the 2027 surplus expires unused at the end of 2029.

## What the credit does to make-up

The 50.000000 paid in 2029 opens a make-up entry of 50.000000, the quantity actually paid after the credit, and 2030 shows make-up available of 50.000000. That is one of the four readings the engine states in its own basis, verbatim: "make-up right equals the deficiency actually paid after any carry-forward credit". It is the engine's stated choice, and the Expert tier sets it beside the model agreement's definition. Quote a make-up figure on a ledger with carry-forward beside that reading.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger", with the five-year case of the previous lesson and its `carryForward` term.

1. Set `base` to "top-quantity". Check the surplus and credit columns above and find the two expiry reasons.
2. Set `base` back to "adjusted-acq" and `capPct` to 50. Write the 2029 credit, the deficiency paid and the make-up entry the reason opens.
3. Set `capPct` to 0 and write what the carry-forward right is worth.
4. Set `capPct` to 120 and read the refusal.
