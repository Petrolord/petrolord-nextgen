# The make-up right reading

{{panel:gsa-contract-calculator}}

A deficiency payment buys the right to take the gas later. With a carry-forward right, part of the deficiency can be met by crediting surplus takes from earlier years, and only the rest is paid. How much make-up does that year then open: the whole deficiency, or only the part paid? The engine answers with its second stated reading.

## The engine's reading

The engine states the reading in the basis of `takeOrPay`, verbatim:

> make-up right equals the deficiency actually paid after any carry-forward credit; a last-contract-year deficiency creates no make-up right (forfeit/refund applies to earlier years' make-up only); the Make-Up Aggregate sums prior contract years only

The first clause is this lesson's reading. The second is the next lesson's.

## The text it reads

The Commonwealth model agreement (2025, CC BY 4.0) defines the Make-Up Aggregate by the deficiency quantities:

> "a quantity of Gas equal to the sum of Buyer’s Annual Deficiency Quantities in prior Contract Years less the sum of the Make-Up Quantities taken in prior Contract Years and expired Make-Up Aggregate"

Its Article 12.6, Alternative 2, pays for the deficiency less the carry-forward credit, (BADQ - CFCQ) x TOPP. So the model's aggregate counts the whole deficiency while its payment counts only the part left after the credit. The engine opens make-up equal to what was paid.

## Where it acts

| golden case and year | deficiency | carry-forward credit | deficiency paid | make-up it opens |
| --- | --- | --- | --- | --- |
| capped carry-forward, 2029 | 100.000000 | 50.000000 | 50.000000 | 50.000000 |
| Ekene export feed (synthetic), 2029 | 6438500.000000 | 3219250.000000 | 3219250.000000 | 3219250.000000 |

On the capped golden case the make-up available in 2030 is 50.000000, the deficiency paid. On the export feed the engine's reason reads:

> 2029: 14257000 counted against the take-or-pay quantity 20695500 leaves a deficiency of 6438500; a carry-forward credit of 3219250 (at most 50% of the deficiency, first in first out: 2299500 from 2027, 919750 from 2028) leaves 3219250; the deficiency payment is 3219250 x 9.80845 = 31575852.6625; the buyer may make up 3219250 in the 5 contract years after 2029, to the end of 2034

Under the model's aggregate read to the letter, the buyer would hold a right to 6438500.000000, half of it gas it never paid for: the credit already settled that half with surplus gas taken in 2027 and 2028.

## Why it is graded nowhere

Every capstone field is proved identical under the engine's reading and under the alternative it names. What the course asks is that a report on a contract with carry-forward says which reading its make-up figures rest on.

## A reading is no recovery order

The recovery order of make-up is a different kind of term. It is a required contract input with no default, and the engine names the model agreement's order as the reference text's. A reading is the engine's choice where the text is open. An order is the parties' choice, and the contract states it.

## Exercise

Open the contract calculator on "The four stated readings" and find the second reading with its table of deficiency, credit, deficiency paid and make-up available. Then open "The whole contract in money", which starts on the Ekene export feed. Set the carry-forward capPct to 0 and read the 2029 deficiency, credit applied, deficiency payment and make-up outstanding. Explain what the cap of 50 percent changed in each, and which figure the engine's reading ties to the deficiency paid.
