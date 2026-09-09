# Tranches and the credit

Two refinements move the contractor's share without touching the cap: a profit split that steps down with cumulative production, and an investment credit that offsets tax and nothing else.

{{panel:ec-fiscal-explorer}}

## The split reads cumulative liquids at the start of the year

psc_tranches keeps every input of the hand-derived case and sets psc_profit_split_mode to tranches with two rows: contractor 60 percent from a cumulative of 0, 40 percent from 1 (from_cum_mmbbl is in millions of barrels). The engine reads the table at the cumulative liquids at the start of each year:

| cumulative bbl at start | contractor share |
| --- | --- |
| 0 | 0.600000 |
| 999999 | 0.600000 |
| 1000000 | 0.400000 |
| 2500000 | 0.400000 |
| 6000000 | 0.400000 |

In 2030 the cumulative is 0, the share is 60.000000 and taxable_income is 32400000.00 against 27000000.00 at a flat 50. In 2031 the field opens at 1000000 bbl, the share drops to 40.000000, taxable_income is 21600000.00, tax 10800000.00, net 36800000.00. NPV moves from -4590909.09 to -4345454.55: the richer early year counts for more at 10 percent than the poorer later one costs.

A brownfield gets no fresh start. psc_tranches_prior_cumulative adds psc_prior_cumulative_liquids_bbl 1500000 and a third tranche at 30 percent from 2, so 2030 opens already in the 40 percent tranche (taxable 21600000.00, net -43200000.00) and 2031 opens at 2500000 bbl in the 30 percent one (taxable 16200000.00, net 34100000.00). NPV -12200000.00, IRR -21.0648 percent, take 109.1000 percent.

## The mistake

Reading the boundary at the end of the year. A reader who counts 2030's own 1000000.00 bbl puts 2030 into the 40 percent tranche and reports 21600000.00 for a year the engine prices at 32400000.00. The table says 999999 bbl gives 0.600000 and 1000000 gives 0.400000, and the field crosses that line on the last barrel of 2030, which is too late to change 2030.

## The credit

psc_itc sets psc_itc_pct 50 on the 80000000.00 of capex, a credit of 40000000 against tax. Both years show tax 0.00 with taxable_income 27000000.00 unchanged: the credit is applied after the tax is computed and never touches the base. The credit absorbs the 13500000.00 of tax in each year and the remainder carries, unused, past the end of the field. Net cash flow is -27000000.00 then 53000000.00, NPV 21181818.18, IRR 96.2963 percent, take 74.0000 percent. The applyPSC sample shows the rule in one call: an ITC of 40000000 against a tax before credit of 4500000.00 uses 4500000.00 and carries 35500000.00.

## What it refuses

The credit is not cash. A credit larger than the tax it meets waits for the next year's tax, and a field that ends with credit unused ends with nothing; there is no refund line and no KPI for the balance. The tranche table has no interpolation: 999999 bbl is wholly in the first tranche, and the share printed on a row is the share for the whole year, however many barrels the year itself adds. A field that crosses two boundaries inside one year is still priced at the share it opened with.

## Exercise

Run the tranche case and write the contractor share, taxable income and tax for both years. Then rerun it with the prior cumulative and say which tranche each year opens in and why 2030 changed although the first row of the tranche table did not.
