# What cost oil refuses

The production sharing rows answer every question except the one that decides whether the contractor was paid back.

{{panel:ec-fiscal-explorer}}

## The columns that are there

A PSC row reports gross_revenue, royalty, opex, capex, taxable_income (the contractor's profit oil), tax, net_cash_flow, psc_contractor_share_pct, the discounted and cumulative flows and oil_bbl. There is no depreciation column, because capex under a PSC is recovered as cost oil rather than written off, and there is no cost recovered column and no carried forward column. The KPI block ends with unrecovered cost at cessation not reported.

## The number that is not there

AKATA under production sharing at a 30 percent cap ends 2035 with 207346412.26 of cost still in the pool, read by marching applyPSC over the engine's own rows. Its NPV is -104151944.05 and its take 120.4874 percent, and neither number says why. At a 45 percent cap the pool ends at 91570072.23 and the take at 99.0577 percent. The only column that moves with the pool is tax (10393930.24 in 2035 at 30 percent against 8400589.37 at 60), and a reader who has not marched the pool cannot tell a low tax from a low profit.

## Working interest halves everything

psc_wi_50 sets psc_working_interest_pct 50 on the hand-derived case. Every monetary line halves: gross revenue 50000000.00, royalty 5000000.00, capex 40000000.00, taxable income 13500000.00, tax 6750000.00, net -20250000.00 then 19750000.00. The oil_bbl column halves too, to 500000.00, and total oil reads 1000000.00 bbl. NPV halves to -2295454.55; IRR -2.4691 percent, take 101.0000 percent and DPI -0.057386 do not move. Under a PSC the working interest is applied at the door, so the rows are the share and the volumes are entitlement volumes. That is a different ledger from the joint venture one, where the rows keep field revenue and field volumes.

## Abandonment rides the pool

psc_sinking_fund adds abandonment_cost_usd 10000000 funded from 2031: the 2031 row shows decom_fund_contribution 10000000.00 and net cash flow 29500000.00 against 39500000.00 without it, and the contribution enters the recoverable cost lane rather than being paid outside the contract. psc_abandonment_wi_50 charges a 10000000.00 lump sum against the 50 percent flows unscaled: net 9750000.00 where psc_wi_50 had 19750000.00.

## The mistake

Reading psc_contractor_share_pct as the contractor's share of revenue. It is the share of profit oil after cost oil, and in a year where the cap binds most of the contractor's cash is cost oil, not profit.

## Exercise

Open the 30 percent AKATA case and look for any output column that reports the carried pool. Then write the cost recovered and the pool at the end of 2035 from the march and say what the take of 120.4874 percent hides.
