# Cost oil, profit oil and the order

{{panel:joa-recovery-calculator}}

Under a production sharing contract the contractor carries the cost and takes it back from production. The Petroleum Industry Act 2021 (Act No. 6, Official Gazette No. 142, Vol. 108, 27 August 2021, read on 2026-09-26) lists this as one of its contract types:

> "(a) a production sharing contract for the exploration, development and production of petroleum on terms under which the financial risk-bearing party shall recover costs from a share of production as established in the contract from the applicable area ;" (PIA s.85(2)(a))

This module reads PSC cost recovery as contract arithmetic. How a state designs such a regime belongs to the fiscal regime course, and the Nigerian fiscal system to the Petroleum Industry Act course.

## The canonical calculation

The engine computes no cost pool of its own. Its basis, verbatim:

> applyPSC imported from engines/economics/cashflow.ts, called once a year with the unrecovered pool threaded; nothing here re-computes the cost pool

and it states the order applyPSC follows:

> royalty = royaltyPct % of gross; cost oil limit = costOilLimitPct % of revenue after royalty (or of gross, as stated); cost recovered = min(pool + capex + opex, limit); profit oil = revenue after royalty - cost recovered; contractor profit oil = its share; tax = taxRatePct % of the contractor's profit oil

## One year of the Ekene PSC variant

The Ekene PSC variant is a synthetic case with stated terms: royalty 12.500000 percent, a cost oil limit of 60.000000 percent of gross, a contractor profit share of 60.000000 percent, tax 30.000000 percent and an opening cost pool of 142000000.000000. Its 2030 row, line by line:

| line | 2030 |
| --- | --- |
| gross revenue | 219000000.000000 |
| royalty | 27375000.000000 |
| revenue after royalty | 191625000.000000 |
| cost oil limit | 131400000.000000 |
| cost recovered | 131400000.000000 |
| profit oil | 60225000.000000 |
| contractor profit oil | 36135000.000000 |
| government profit oil | 24090000.000000 |
| tax | 10840500.000000 |
| contractor entitlement | 156694500.000000 |
| government take | 62305500.000000 |

The costs waiting to be recovered exceed the limit, so the limit binds and cost recovered equals it. The contractor entitlement is cost recovered plus contractor profit oil less tax. The government take is royalty, government profit oil and tax. The two add up to the gross revenue.

## The tax line

The engine states the tax reading it takes, verbatim from its basis:

> income tax is charged on the contractor's profit oil share, as FARI TNM/16/01 and World Bank Note 8 assume (applyPSC in engines/economics/cashflow.ts)

It is the engine's stated choice, printed beside the two texts it follows, and the last module of this tier runs both texts' examples. The Expert tier sets it beside the engine's other readings.

A royalty must leave something to share. A royalty of 100 percent is refused:

> royaltyPct must be a number from 0 up to, but excluding, 100; got 100

## Exercise

Work in the course's own recovery calculator, view "PSC cost recovery", starting from "The Ekene PSC variant".

1. Find the 2030 row and check each line the panel prints against the table above. The panel leaves out revenue after royalty: work it out from gross revenue and royalty.
2. Check that the contractor entitlement and the government take add up to the gross revenue.
3. Find the basis note on the tax.
4. With the control "Royalty, percent (stated)", set 100 and read the refusal. Then set 10: the 2030 royalty moves and the cost oil limit does not. Say why, from the base the limit is stated on.
