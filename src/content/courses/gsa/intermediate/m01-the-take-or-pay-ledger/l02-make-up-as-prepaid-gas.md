# Make-up as prepaid gas

{{panel:gsa-ledger-calculator}}

A deficiency payment buys gas the buyer did not take. Make-up is the buyer's right to take that gas later, within a stated period, without paying for it twice. This lesson follows one deficiency on the power plant ledger from the year it is paid to the years it is taken.

## What the texts say

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) keeps a running total of the gas paid for and not yet taken:

> "a quantity of Gas equal to the sum of Buyer’s Annual Deficiency Quantities in prior Contract Years less the sum of the Make-Up Quantities taken in prior Contract Years and expired Make-Up Aggregate" (Commonwealth model GSA (2025), definition of Make-Up Aggregate)

The model leaves how long the right lasts, the order it is drawn in and the end of the term for the parties to state, and the engine takes each as a required input with no default. A call with no make-up terms is refused:

> makeUp must be an object { periodYears, order, endOfTerm } (no default); got nothing

## The power plant's 2028 entry

The power plant agreement (synthetic) states make-up for 3 contract years, taken only after the Adjusted ACQ of the year, forfeited at the end. Its 2028 deficiency opens one entry, and the engine's reason, on the fixture's stated planning price, reads: "2028: 5460000 counted against the take-or-pay quantity 6148800 leaves a deficiency of 688800; the deficiency payment is 688800 x 2.18 = 1501584; the buyer may make up 688800 in the 3 contract years after 2028, to the end of 2031"

| year | make-up available | make-up taken | make-up expired | make-up outstanding |
| --- | --- | --- | --- | --- |
| 2028 | 0.000000 | 0.000000 | 0.000000 | 688800.000000 |
| 2029 | 688800.000000 | 210000.000000 | 0.000000 | 478800.000000 |
| 2030 | 478800.000000 | 0.000000 | 0.000000 | 478800.000000 |
| 2031 | 478800.000000 | 268800.000000 | 210000.000000 | 0.000000 |

The deficiency payment of 1501584.000000 rests on the reported 2026 domestic base price, which the fixture holds flat in every year as a stated planning assumption. The quantities do not rest on it: 688800.000000 is paid for whatever the price, and 688800.000000 enters the make-up aggregate.

## Why make-up is prepaid

The buyer already paid for the entry, so gas taken as make-up is invoiced at the make-up price the agreement states. The power plant fixture states a make-up price of 0.000000 in every year, so its ledger shows make-up revenue of 0.000000 over the term. Another agreement may state a make-up price above zero: the export feed agreement states 10 percent of the contract price, as a later module shows.

Make-up taken also changes what the year counts. In 2029 the plant took 7875000.000000; the first 7665000.000000 is the year's own gas and the remaining 210000.000000 is make-up, so the year counts 7665000.000000 against its own take-or-pay quantity. Gas cannot pay for two years at once.

## Exercise

Work in the course's own ledger calculator, on the view "The take-or-pay ledger", which starts with the power plant agreement.

1. Read the 2028 row: the deficiency, the deficiency payment and the make-up outstanding. Say which of the three rests on the stated planning price.
2. Follow the entry through 2029, 2030 and 2031 in the make-up columns and check the table above.
3. Delete the `makeUp` key and read the refusal. Restore it.
4. Set `periodYears` in `makeUp` to 0 and read the 2028 reason again. Write down what it now says about a make-up right, and what happens to the 2029 make-up taken.
