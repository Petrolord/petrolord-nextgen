# Taxable income and tax

Taxable income is what is left of gross revenue after royalty, opex and depreciation, and tax is one rate applied to it. Capex is not on that list, which is why a losing year still pays.

{{panel:ec-ledger-explorer}}

## The base

The JV tax base is gross revenue less royalty, less opex, less depreciation. On AKATA 2029: 186032000.00 less 27904800.00, less 24000000.00, less 21000000.00 gives a taxable income of 113127200.00 USD. At jv_tax_rate_pct 40 the tax is 45250880.00. The hand-derived case does the same at 50 percent: 100000000.00 less 20000000.00, less 10000000.00, less 5000000.00 is 65000000.00, and the tax is 32500000.00 in each of its two years.

| year | gross_revenue | royalty | opex | depreciation | taxable_income | tax |
| --- | --- | --- | --- | --- | --- | --- |
| 2029 | 186032000.00 | 27904800.00 | 24000000.00 | 21000000.00 | 113127200.00 | 45250880.00 |
| 2032 | 116656473.02 | 17498470.95 | 26225448.00 | 25500000.00 | 47432554.07 | 18973021.63 |
| 2035 | 73325786.51 | 10998867.98 | 28657255.12 | 25500000.00 | 8169663.42 | 3267865.37 |

The base shrinks every year because revenue falls with the decline while opex escalates and depreciation holds at 25500000.00. By 2035 taxable income is 8169663.42 and tax 3267865.37. The total over seven years is 148425219.46.

## A losing year pays tax

The 2029 row nets -121123680.00 and pays 45250880.00 of tax on the same line. That is not an error. Capex is not deductible when spent; it is deductible on the depreciation schedule, 21000000.00 of it in 2029. From the tax authority's point of view the field earned 113127200.00 that year and paid on it. The cash view and the tax view disagree, and both are printed.

The loss columns confirm it. loss_offset_used and loss_carryforward read 0.00 on every AKATA row, because no year's taxable income goes negative. When a base does go negative the engine carries the loss forward, and that mechanism, with its kill switch, is the Expert tier's.

## Moving the rate

The hand-derived case with only the tax rate moved:

| jv_tax_rate_pct | year 1 tax | year 1 net | year 2 net | take percent |
| --- | --- | --- | --- | --- |
| 0 | 0.00 | 20000000.00 | 70000000.00 | 30.7692 |
| 30 | 19500000.00 | 500000.00 | 50500000.00 | 60.7692 |
| 50 | 32500000.00 | -12500000.00 | 37500000.00 | 80.7692 |
| 85 | 55250000.00 | -35250000.00 | 14750000.00 | 115.7692 |

At zero tax the take is 30.7692 percent and all of it is royalty. At 85 percent the take passes 100 percent: the government collects 115.7692 percent of the value the field created, and the contractor's two years net to a loss. A rate is not a share; the base decides what the rate is worth.

## The mistake

The careful error is to deduct capex from the base. It turns 2029 into a loss with no tax, and the ledger then needs a loss carryforward it was never asked to carry. The engine says 45250880.00 in 2029, and a 2029 tax of 0.00 under the default schedule is wrong. The careless error is to forget the royalty deduction: taxing 186032000.00 less 24000000.00 less 21000000.00 gives a base larger than 113127200.00 and a tax larger than 45250880.00.

## What it refuses

One rate, every year, on one base. There is no investment allowance, no tax credit, no minimum tax, no separate treatment of gas and no second tax stacked on the first; the five-tax PIA cascade is a different regime and a different tier. The tax is field-level on the row and is scaled by working interest afterward. And the engine does not let tax go negative: a loss is carried, never refunded.

## Exercise

Build the 2029 base from the four numbers on its row and confirm 113127200.00, then apply the rate and confirm 45250880.00. Then say why that year pays tax at all, in one sentence that uses the word depreciation.
