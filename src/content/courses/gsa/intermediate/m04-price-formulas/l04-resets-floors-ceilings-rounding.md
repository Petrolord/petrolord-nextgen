# Resets, floors, ceilings and rounding

{{panel:gsa-ledger-calculator}}

Three more terms finish a price formula. A reset holds a computed price for a block of months. A floor and a ceiling hold it inside a band. A rounding rule fixes how many decimals the invoice carries. Each is stated, and each can move a figure the ledger then settles at.

## Resets

The engine prices every month of a reset block at the price computed for the block's first month, with blocks counted from `from`. The export feed agreement (synthetic) resets every 3 months from 2027-01, so January, February and March 2027 all price 9.731000 on the window that closes in December 2026, and April to June price 9.075400. On the golden case that resets every 12 months, all twelve months from 2025-07 carry 7.500000, the price of one window, 2025-01 to 2025-06. A longer reset makes the price steadier and slower to follow the index.

## Floors and ceilings

An oil-indexed or hub-indexed formula may state a floor and a ceiling. The engine computes the line, then holds the price inside the band and labels each held month. The golden case below is the Energy Charter Secretariat's line, 0.8 + 0.1485 x JCC, with a floor of 3.5 and a ceiling of 4.5:

| JCC | on the line | price | clamped |
| --- | --- | --- | --- |
| 10.000000 | 2.285000 | 3.500000 | floor |
| 22.500000 | 4.141250 | 4.141250 | none |
| 30.000000 | 5.255000 | 4.500000 | ceiling |

A ceiling below the floor cannot hold any price, and the engine refuses it:

> formula.ceiling must be at or above formula.floor 9; got 8

## Rounding

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) fixes the decimals:

> "Calculations to determine the Contract Price for any period shall be made to at least five (5) decimal places, without rounding, and the final expression of Contract Price for any period shall be rounded to the fourth decimal place." (Commonwealth model GSA (2025), Article 15.4)

> "if the number in the fifth decimal place is five (5) or more then the number in the fourth decimal place shall be rounded up to the next number." (Commonwealth model GSA (2025), Article 15.4)

The engine applies it as `rounding` "model-gsa-4dp", and its basis states how: "each price rounded to 4 decimals, half up on the fifth decimal (CW GSA Article 15.4), after normalising the double to 12 significant digits." The other value is "none"; anything else is refused:

> rounding must be one of "none", "model-gsa-4dp"; got "4dp"

| index | price, model-gsa-4dp |
| --- | --- |
| 11.234590 | 11.234600 |
| 11.234490 | 11.234500 |
| 100.000050 | 100.000100 |
| 11.234346 | 11.234300 |

A fifth decimal of five rounds up, and the price is computed in full before the rule reads its fifth decimal, so 11.234346 rounds down on its fifth decimal of 4.

## Exercise

Work in the course's own ledger calculator, on the view "Contract prices month by month", which starts with the export feed price.

1. Read the first six priced months and mark where each reset block begins.
2. Change `resetMonths` to 1 and write the 2027 annual average. Say why it moved.
3. Restore it, then add a `floor` of 9 to the formula. Write which 2027 months are held at the floor and the new 2027 annual average.
4. Add a `ceiling` of 8 and read the refusal.
5. Set `rounding` to "none" and compare the 2029 annual average with 9.808450.
