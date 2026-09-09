# The PSC cost pool

Under production sharing the contractor spends the money, recovers it from a capped slice of revenue, and shares what is left. The cap is the whole story.

{{panel:ec-fiscal-explorer}}

## The four slices

A production sharing row is cut four times. Royalty comes off gross revenue first. Cost oil comes next, capped at a share of the revenue after royalty, and repays the contractor's pool of unrecovered costs. What is left is profit oil, split at the contractor share, and the contractor's profit oil is the taxable income on which tax is charged.

The hand-derived psc_carryforward case is one well, 1000000.00 bbl a year at 100.000000 USD/bbl in 2030 and 2031, with psc_royalty_pct 10, psc_cost_oil_cap_pct 40, psc_contractor_profit_share_pct 50 and psc_tax_rate_pct 50. Capex is 80000000.00 in 2030 and opex 10000000.00 in each year.

| year | gross_revenue | royalty | taxable_income | tax | net_cash_flow | cumulative_cash_flow |
| --- | --- | --- | --- | --- | --- | --- |
| 2030 | 100000000.00 | 10000000.00 | 27000000.00 | 13500000.00 | -40500000.00 | -40500000.00 |
| 2031 | 100000000.00 | 10000000.00 | 27000000.00 | 13500000.00 | 39500000.00 | -1000000.00 |

## Reading 2030

Royalty at 10 percent of 100000000.00 is 10000000.00. The cap is 40 percent of the revenue after royalty, and the engine's applyPSC line for a 0.400000 cap on this revenue reads cost recovered 36000000.00. Profit oil is what remains after royalty and cost oil, and the contractor's half of it is 27000000.00, the taxable_income on the row. Tax at 50 percent is 13500000.00. The contractor's cash is cost oil plus its profit oil, less tax, less the 80000000.00 and 10000000.00 actually spent: -40500000.00.

The pool took in 80000000.00 of capex and 10000000.00 of opex and only 36000000.00 came out, so most of it is carried into 2031. That is why 2031 repeats 2030 on every fiscal line: the cap binds again, another 36000000.00 is taken against the carried pool, and net cash flow rises to 39500000.00 only because nothing was spent on capex.

## What the KPIs say

NPV -4590909.09 USD at 10 percent, IRR -2.4691 percent, payback Beyond project life, take 101.0000 percent. A take above 100 is not an error: the state collected royalty and tax in both years while the contractor ended 1000000.00 down, and nothing bounds the ratio at 100.

## The mistake

The joint venture reflex is to read taxable income as revenue less costs, which on 2030 would be a loss and no tax. Under a PSC the base is the contractor's profit oil, 27000000.00, the same in a year with 80000000.00 of capex as in a year with none: capex is not a deduction but a debt the cost oil repays. The second reflex is to take the cap off gross revenue rather than revenue after royalty, which gives a cost oil larger than 36000000.00 and a pool that clears too early.

## What it refuses

The row carries no cost recovered column, no carried forward column and no depreciation, and the KPI block prints unrecovered cost at cessation as not reported. The pool exists inside the engine and nowhere in its output.

## Exercise

Read the 2030 and 2031 rows in the costRecovery mode and write the four slices for each year. Then say why net cash flow changed by exactly the 80000000.00 of capex while every fiscal line stayed the same.
