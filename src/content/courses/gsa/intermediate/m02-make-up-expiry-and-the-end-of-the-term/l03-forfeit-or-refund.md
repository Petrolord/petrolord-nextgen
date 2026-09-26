# Forfeit or refund at the end of the term

{{panel:gsa-ledger-calculator}}

A make-up period can run past the last contract year. When the delivery period ends, the agreement must say what becomes of open entries, and the engine takes that as `makeUp.endOfTerm`, a required input.

## Two alternatives the model prints

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) prints alternatives. Under Alternative 1 the buyer forfeits what is left. Under Alternative 2 the seller pays it back:

> "Seller shall pay to Buyer an amount equal to the value of the Make-Up Aggregate multiplied by the Take or Pay Price in the Contract Year in which the Delivery Period expires." (Commonwealth model GSA (2025), Article 12.7, end of the Delivery Period, Alternative 2)

The engine computes `forfeit` and `refund`. Any other value is refused:

> makeUp.endOfTerm must be one of "forfeit", "refund"; got "extend"

## The same ledger, both ways

Two cases share every input except the end-of-term rule: make-up for 5 contract years, a 2027 deficiency of 200.000000 paid at 2.5, 50.000000 recovered in 2028, and a last year, 2029, with a deficiency of 100.000000 paid at 4.

| end of term | 2029 deficiency paid | make-up left at the end | refund |
| --- | --- | --- | --- |
| forfeit | 100.000000 | 150.000000 | 0.000000 |
| refund | 100.000000 | 150.000000 | 600.000000 |

Under the refund rule the engine's reason reads:

> 2029: the delivery period ends with make-up of 150 unrecovered; the seller refunds 150 x 4 = 600

The refund is priced at the last year's take-or-pay price, 4, as Alternative 2 states, although the 2027 entry was paid at 2.5.

## The last year's own deficiency

In both cases the 2029 deficiency is paid and opens no entry, so the refund covers 150.000000 from 2027 and none of 2029's 100.000000. That is one of the readings the engine states in its own basis:

> "a last-contract-year deficiency creates no make-up right (forfeit/refund applies to earlier years' make-up only)"

It is one of four readings the engine states, which the Expert tier sets beside the texts. The 2029 reason says the same: "2029: 700 counted against the take-or-pay quantity 800 leaves a deficiency of 100; the deficiency payment is 100 x 4 = 400; the delivery period ends with this year, so no make-up right arises"

## On the Ekene agreements

The power plant agreement (synthetic) forfeits. Its 2033 entry of 357000.000000 has 105000.000000 taken in 2034, and the engine closes the term with "2034: the delivery period ends with make-up of 252000 unrecovered; the buyer forfeits it"

The export feed agreement (synthetic) refunds. Its 2035 entry has 457950.000000 left at the end of 2036, priced at the 2036 take-or-pay price of 8.081300:

> 2036: the delivery period ends with make-up of 457950 unrecovered; the seller refunds 457950 x 8.0813 = 3700831.3350000004

The reason prints the double the engine holds. The course quotes the refund field at six decimals: 3700831.335000.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger", which starts with the power plant agreement.

1. Read the 2034 row and its last reason. Write the quantity forfeited.
2. Change `endOfTerm` to "refund". Write the 2034 refund and the change in the total net to the seller, and say which price the refund used.
3. Change `endOfTerm` to "extend" and read the refusal.
