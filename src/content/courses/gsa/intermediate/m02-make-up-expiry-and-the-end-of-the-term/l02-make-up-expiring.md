# Make-up expiring at the end of its last year

{{panel:gsa-ledger-calculator}}

Make-up is a right with a deadline. When the period closes, whatever is left of the entry expires: the buyer keeps no claim to the gas and the seller keeps the payment. This lesson reads one expiry on the power plant ledger and the threshold that decided it.

## What the texts say

The HMRC Oil Taxation Manual (OT05435, updated 19 December 2019, read 2026-09-26) describes the right in general terms:

> "The arrangements will usually give the buyer the opportunity to make up the quantity paid for but not taken. The make-up may be taken either:" (HMRC Oil Taxation Manual OT05435 (updated 19 December 2019))

The same page notes that the arrangements carry a time limit. The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) states what happens when it passes:

> "the right to make up such equivalent quantity shall terminate, and Buyer shall forfeit any and all rights with respect to such Buyer’s Annual Deficiency Quantity." (Commonwealth model GSA (2025), Article 12.7)

## The 2028 entry, from 2029 to 2031

The power plant agreement (synthetic) opens an entry of 688800.000000 in 2028, recoverable to the end of 2031, taken only after the Adjusted ACQ of the year. Three years decide its fate.

| year | Adjusted ACQ | taken | make-up available | make-up taken | make-up expired |
| --- | --- | --- | --- | --- | --- |
| 2029 | 7665000.000000 | 7875000.000000 | 688800.000000 | 210000.000000 | 0.000000 |
| 2030 | 7665000.000000 | 7665000.000000 | 478800.000000 | 0.000000 | 0.000000 |
| 2031 | 7665000.000000 | 7933800.000000 | 478800.000000 | 268800.000000 | 210000.000000 |

In 2030 the plant takes exactly its Adjusted ACQ, and the engine takes no make-up at all. Under this order make-up is only what the buyer takes strictly above the Adjusted ACQ. The reason, verbatim:

> 2030: make-up aggregate 478800 available and none taken, because taken 7665000 does not exceed the Adjusted ACQ 7665000

In 2031, the last year of the entry's period, the plant takes 268800.000000 above its Adjusted ACQ. That draw counts, and the rest goes at the year end:

> 2031: make-up of 268800 taken from the make-up aggregate 478800 (make-up only after the Adjusted ACQ of the year is taken), first in first out: 268800 from 2028

> 2031: make-up of 210000 from 2028 expired unrecovered at the end of 2031, the last year of its make-up period

## What expiry means in money

The 210000.000000 that expires was paid for in 2028, inside the deficiency payment of 1501584.000000 that rests on the fixture's stated planning price. Expiry sends no money back and changes no earlier row. It closes the entry, so the 2031 row carries make-up outstanding of 0.000000 and the buyer's paid gas is gone. The buyer's lever is timing: gas taken above the Adjusted ACQ in 2030 would have been make-up, and less of the entry would have been left to expire in 2031.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger", which starts with the power plant agreement.

1. Find the 2029, 2030 and 2031 rows and check the table above. Read the three reasons quoted here in the reasons list.
2. Change the 2030 `taken` to 7875000 and write the make-up taken in 2030 and 2031 and the make-up expired in 2031.
3. Restore 2030 and change `periodYears` to 4. Write the year the 2028 entry now runs to, and whether anything from it expires before the end of the term.
4. In one sentence, say why a take equal to the Adjusted ACQ recovers no make-up under this agreement's order.
