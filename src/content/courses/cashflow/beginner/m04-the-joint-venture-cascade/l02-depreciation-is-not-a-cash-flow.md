# Depreciation is not a cash flow

Capex leaves the account in the year it is spent. Depreciation is the schedule on which the tax authority lets you deduct it, and it touches nothing but the tax column.

{{panel:ec-ledger-explorer}}

## Two columns, one spend

AKATA spends 210000000.00 USD of capex in 2029 and 45000000.00 in 2030, a total of 255000000.00. The capex column prints those two numbers and then 0.00 for five years. The depreciation column tells a different story: 21000000.00 in 2029, then 25500000.00 in every year from 2030 to 2035. The default schedule is a ten-year straight line starting in the year of each spend, so the 2029 tranche contributes a tenth of itself from 2029 and the 2030 tranche adds its own tenth from 2030, which is why the line steps up once and then holds.

| year | capex | depreciation | taxable_income | tax | net_cash_flow |
| --- | --- | --- | --- | --- | --- |
| 2029 | 210000000.00 | 21000000.00 | 113127200.00 | 45250880.00 | -121123680.00 |
| 2030 | 45000000.00 | 25500000.00 | 85410012.00 | 34164004.80 | 31746007.20 |
| 2031 | 0.00 | 25500000.00 | 64947075.12 | 25978830.05 | 64468245.07 |
| 2035 | 0.00 | 25500000.00 | 8169663.42 | 3267865.37 | 30401798.05 |

The 2031 net cash flow is 64468245.07: gross revenue 136363147.20 less royalty 20454472.08, less opex 25461600.00, less tax 25978830.05, less capex 0.00. Depreciation is not in that list. It was used once, to get taxable income down to 64947075.12 and therefore tax down to 25978830.05, and then it left.

## The schedule outlives the field

Over seven years the default schedule claims 174000000.00 of the 255000000.00 spent. The field stops in 2035 and the remaining deductions are never taken; the engine does not write them off at cessation. That is the first reason the schedule matters: a slow schedule leaves value on the table when the field is short.

| schedule | 2029 depreciation | sum over life | total tax |
| --- | --- | --- | --- |
| default, ten years | 21000000.00 | 174000000.00 | 148425219.46 |
| jv_psc_depr_years 7 | 30000000.00 | 248571428.57 | 119700211.23 |
| jv_psc_depr_years 5 | 42000000.00 | 255000000.00 | 116025219.46 |
| jv_psc_depr_years 1 | 210000000.00 | 255000000.00 | 116025219.46 |
| depreciation_method nigeria_ppt | 42000000.00 | 252450000.00 | 117045219.46 |

Five years and one year both claim the whole 255000000.00 and both land on a total tax of 116025219.46. In a ledger without a clock those two schedules are the same project. What differs is timing: the one-year schedule pays 0.00 of tax in 2029 and 2030 and 32193714.85 in 2031, while the five-year schedule pays 36850880.00 in 2029 and 15778830.05 in 2031. The Associate reading stops at the totals and says they agree. What a clock does to that agreement is the Professional tier's subject.

## The mistake

The most common error is to deduct depreciation from cash. A person who builds net cash flow as revenue less royalty less opex less capex less depreciation less tax gets a 2031 net that is 25500000.00 lower than 64468245.07, and a 2029 net 21000000.00 lower than -121123680.00. The ledger still sums, the payback still lands somewhere, and the whole field is quietly 174000000.00 poorer than the engine says. The opposite error, deducting capex from taxable income instead of depreciation, turns 2029 into a loss year with no tax, where the engine charges 45250880.00.

## What it refuses

The schedule is a straight line from the spend year, or the Nigerian PPT profile; there is no unit-of-production method and no declining balance. Nothing is depreciated except capex, so opex is never spread. There is no terminal write-off of the gap between the 174000000.00 claimed and the 255000000.00 spent. And when a schedule runs ahead of the revenue, as the one-year schedule does in 2029, the unused deduction is carried as a loss, which is a fiscal edge this tier does not open.

## Exercise

Write the capex and the depreciation for 2029, 2030 and 2031 and say which of the two is a cash flow. Then explain, using the five-year and one-year rows, why two schedules with the same total tax are not the same project once anybody asks when the tax was paid.
