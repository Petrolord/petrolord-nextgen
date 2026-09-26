# The royalty reading

{{panel:gsa-contract-calculator}}

The gas royalty is a share of the value of the gas. A take-or-pay year raises the question of which value: the gas the buyer actually took, or the money the seller received, which includes a deficiency payment for gas not yet taken. The engine's fourth stated reading answers it.

## The engine's reading

The reading sits in the royalty basis of `gsaCashFlows`. On the Ekene power plant (synthetic) it reads, verbatim:

> gas royalty rate 0.025 from engines/economics/cashflow.ts deriveGasRoyaltyRate (onshore, 100% utilised in-country: 5%, 2.5% in-country, PIA Seventh Schedule para 10(6)) on the value of gas delivered (taken x contract price): royalty is charged on delivered gas value and not on deficiency payments

The rate is the canonical function's, read from the Petroleum Industry Act 2021 Seventh Schedule para 10(6); the Petroleum Industry Act course teaches the system it sits in. The base is where the engine takes its reading: the value of gas delivered, the gas taken at the contract price.

## Where it acts

In 2028 the power plant's buyer takes less than the take-or-pay quantity and pays a deficiency payment:

| power plant, 2028 | value |
| --- | --- |
| deficiency payment | 1501584.000000 |
| delivered value | 11902800.000000 |
| royalty rate | 0.025000 |
| royalty | 297570.000000 |

The royalty is 0.025000 times the delivered value; the deficiency payment adds nothing to it. The gas pays its royalty when it is made up. In 2029 the buyer takes 210000.000000 of make-up, and that year's delivered value of 17167500.000000 counts it at the contract price, so its royalty of 429187.500000 includes the make-up gas.

These power plant figures rest on the fixture's held price of 2.18 US$ per MMBtu, the reported 2026 domestic base price held flat as a stated planning assumption.

## What changes under the alternative

Charged on the seller revenue, the 2028 royalty would include the deficiency payment, and the make-up gas would then need a rule of its own to avoid paying twice. The engine's reading charges each unit of gas once, in the year it is delivered. Gas paid for and never taken, forfeited at the end of the term, pays no royalty under it. A report that quotes a royalty figure on a take-or-pay contract says which base it used.

## Graded nowhere

No capstone field depends on the royalty base the engine reads; each is proved the same under the reading and under the alternative it names.

## Exercise

Open the contract calculator on "The four stated readings" and read the fourth reading with its table of deficiency payment, delivered value and royalty for each power plant year. For 2028 and 2033, work out by hand what the royalty would be on the seller revenue at the same rate, and state the difference. Then open "The whole contract in money" on the Ekene export feed and do the same for 2029.
