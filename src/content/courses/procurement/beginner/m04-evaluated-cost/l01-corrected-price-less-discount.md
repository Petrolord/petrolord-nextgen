# Corrected price less the discount

{{panel:pr-envelope-calculator}}

The corrected price is where the commercial comparison starts. A bid may offer a discount, carry priced deviations, leave an item out or promise to finish late. The evaluated cost adds all of these to the corrected price, term by term, so that every responsive bid is compared on the same footing. This module builds it one term at a time, starting with the discount.

## The rule

The engine states the evaluated cost in its basis:

> corrected price - discount + priced deviations + omissions + schedule adjustment + life-cycle cost

It cites the World Bank Procurement Regulations for IPF Borrowers (Seventh Edition, September 2025) Annex X para 3.6 and the Nigeria Public Procurement Act 2007 (Act No. 14, Official Gazette No. 65, Vol. 94, 19 June 2007) at s.24(3), which calls for the lowest evaluated responsive bid. The life-cycle term is zero on the well services tender, which carries no life cycle. Pricing a cost over the life of an asset is the Professional tier's question.

## The four passing well services bids

With omissions priced at the average and the fixture's completion schedule, the engine returns, evaluated cost ascending:

| rank | bid | quoted total | corrected price | discount | deviations | omissions | schedule adjustment | evaluated cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | WS5 | 849400.000000 | 849400.000000 | 0.000000 | 0.000000 | 0.000000 | 12741.000000 | 862141.000000 |
| 2 | WS2 | 849400.000000 | 867400.000000 | 0.000000 | 9500.000000 | 0.000000 | 8674.000000 | 885574.000000 |
| 3 | WS1 | 943200.000000 | 943200.000000 | 15000.000000 | 0.000000 | 0.000000 | 0.000000 | 928200.000000 |
| 4 | WS3 | 918000.000000 | 918000.000000 | 0.000000 | 0.000000 | 35400.000000 | 4590.000000 | 957990.000000 |

Each row is the sum of its terms. The corrected price column carries module 3's work: WS2 rises by its correction, and WS5 stays put because its acid line carries the decimalMisplaced flag the evaluator recorded.

## WS1's discount

WS1 offers an unconditional discount of 15000.000000. The engine deducts it from the corrected price, and since WS1 finishes within the minimum weeks, nothing else is added: its evaluated cost is 928200.000000. An unconditional discount applies whatever happens, so it is certain and can be deducted. A discount that depends on a condition, such as the award of a second contract, is a different thing, and this engine takes only a single stated amount.

A negative discount is refused:

> bids[0].discount must be a finite number at or above 0 when given

## The lowest evaluated cost

WS5 holds the lowest evaluated cost, 862141.000000, with omissions at the average and the fixture's schedule. Its quoted total was level with WS2's, and WS1, the dearest of the four as quoted, is third once its discount is taken. The lowest evaluated cost is the figure the table builds, and it can land on a different bid from the one the quoted totals suggest.

An evaluated cost is a comparison figure under stated rules. It is no forecast of what the job will cost.

## Exercise

In the envelope calculator choose "Evaluated cost of the passing bids". Find WS1's discount in the bids box and change it to 0. Read WS1's new evaluated cost and rank, and check the change equals the discount you removed. Restore it, then try a discount of -5000 and read the refusal. Finally, give WS5 a discount of 30000 and predict, before reading, whether its schedule adjustment will rise, fall or stay the same.
