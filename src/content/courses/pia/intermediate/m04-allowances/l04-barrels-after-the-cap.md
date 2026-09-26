# Barrels after the cap

{{panel:pia-hct-calculator}}

Past the cap a new lease keeps an allowance, at a lower rate. This lesson reads that second tier on the Ekene new onshore lease, a field that crosses its cap inside the ledger, and shows which lines of the tax the crossing moves.

## The second tier

The Sixth Schedule para 1(2)(a) ends: "and the lower of US $4.00 per barrel and 20% of the fiscal oil price thereafter". Paragraph (b) gives shallow water the same second tier after its larger cap. Every barrel after the cap earns the lower of 4.00 USD and 20 percent of the price.

| terrain | oil price (stated) | produced before (bbl) | allowance on 1000000 bbl | after the cap bbl |
| --- | --- | --- | --- | --- |
| onshore | 75.000000 | 60000000 | 4000000.000000 | 1000000 |
| onshore | 15.000000 | 60000000 | 3000000.000000 | 1000000 |

At 15 USD/bbl, 20 percent of the price is 3 USD, lower than 4.00, so the price leg applies after the cap too.

## A lease that crosses inside the ledger

The Ekene new onshore lease (synthetic) had produced 49000000 bbl before 2026, one million short of the onshore cap. Its rows:

| year | oil bbl | capex USD | opex USD |
| --- | --- | --- | --- |
| 2026 | 3000000 | 40000000 | 30000000 |
| 2027 | 2500000 | 0 | 30000000 |

The engine splits 2026 at the cap:

| year | barrels below the cap | barrels after the cap | production allowance |
| --- | --- | --- | --- |
| 2026 | 1000000 | 2000000 | 16000000.000000 |
| 2027 | 0 | 2500000 | 10000000.000000 |

In 2026 the first million barrels earn 8.00 USD each and the other two million earn 4.00. In 2027 every barrel is past the cap.

## The input that carries the history

The cap counts from the start of production, and a ledger usually starts part way through a field's life. The engine learns where the field stands from one stated input, `pia_prior_cumulative_oil_bbl`, and adds each ledger year's crude oil and condensate to it. Leave it at 0 on a field that has produced for years and the engine treats the lease as fresh: every barrel earns the first tier until the ledger itself reaches the cap. The input is a fact about the field's history. Take it from the production record, and state it every time you run a new lease.

## What the crossing moves

The allowance is deducted from assessable profit to reach chargeable profit. So the cap moves the chargeable profit and, through it, the hydrocarbon tax. It does not move the cost price ratio lines, which sit above it, and it does not move companies income tax, which has no production allowance.

This lease is also a new-acreage lease onshore, so its hydrocarbon tax rate is a stated reading. The case states 15. The chargeable profit does not depend on that reading: 151411548.913043 in 2026 and 123946029.235482 in 2027 under either stated rate.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "The production allowance". Set new, onshore, 1000000 bbl, 75 USD/bbl and 60000000 bbl produced before. Read 4000000.000000. Change the price to 15 and read 3000000.000000.
2. Open "The tax base and the cost price ratio on a ledger" and start from ekene_onshore_new_cap_crossing. Confirm the 2026 production allowance of 16000000.000000 and the chargeable profit above.
3. Set `pia_prior_cumulative_oil_bbl` to 0. Read the new 2026 and 2027 allowances and explain each from the two tiers.
4. Which columns of the ledger stayed where they were? Say why for each, and then open "Companies income tax on a ledger" on the same edited case and confirm companies income tax did not move either.
