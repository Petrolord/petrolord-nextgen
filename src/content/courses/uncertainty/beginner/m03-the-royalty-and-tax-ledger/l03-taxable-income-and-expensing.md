# Taxable income and expensing

Taxable income is gross revenue less royalty, less opex, less depreciation. Depreciation stands in for capex on the tax line only, and by default it is the whole of each year's capex, deducted in the year it is spent.

{{panel:ec-screening-explorer}}

## The base, line by line

The engine builds taxable income as grossRevenue minus royalty minus opex minus abandonment minus depreciation, and it deducts depreciation instead of cash capex. `capexDepreciationYears` defaults to 1, which is immediate expensing, and the quick form never sets it. On ISIALA the depreciation column therefore reads 90.0000 in 2027 and 2028, exactly the capex, and 0.0000 after.

The published hand case shows the base with round numbers. Gross revenue is 100, royalty 20, opex 10 and capex 50 in year 1, taxed at 50 percent. Year 1's base is 100 minus 20 minus 10 minus 50, which is 20, and tax is 10. Year 2 has no capex, so the base is 70 and tax is 35. The NPV is 39.8721.

## Spreading the deduction

Set `capexDepreciationYears` to 2 on the same case and cash capex stays at 50 in year 1, while depreciation becomes 25 in each year. Tax becomes 22.5 in both years and net cash flow becomes -2.5 then 47.5. Total tax is still 45.0000, and the NPV falls to 38.7886 because more of it is paid a year sooner.

Spread the deduction past the end of the life and some of it never arrives.

| capexDepreciationYears | npv | totalTax |
| --- | --- | --- |
| 1 | 39.8721 | 45.0000 |
| 2 | 38.7886 | 45.0000 |
| 3 | 31.2042 | 53.3333 |
| 4 | 27.4120 | 57.5000 |
| 5 | 25.1367 | 60.0000 |

On a two year case, deductions scheduled after year 2 are lost, so total tax rises from 45.0000 to 60.0000 as the schedule lengthens. A value of 0 is floored at 1 and gives 39.8721 again.

## ISIALA's first two years

On ISIALA the base in 2027 is 112.4200 minus 16.8630 minus 23.3780 minus 90.0000, which is negative. Because depreciation equals capex and no tax is due, that negative base is the same number as the net cash flow, -17.8210. In 2028 it is -26.7825. Tax is 0.0000 in both.

## The mistake

The careful mistake is to assume those two negative bases are carried forward. They are not. The 2029 tax of 19.3660 is 35 percent of that year's own base, 87.0580 minus 13.0587 minus 18.6679, with nothing taken off for 2027 or 2028. The deduction that pushed those years under zero reduces no tax in any year. A reader who carries the losses forward writes a smaller 2029 tax than the engine charges, and a higher NPV than the engine reports.

The second mistake is to read immediate expensing as generous. It is generous only when the year can absorb the deduction. ISIALA's two capex years could not, and part of the 180 million USD of capex was deducted against nothing.

## What the tax base refuses

It refuses a loss carry forward, depreciation beyond the life, allowances, uplifts and ring fencing. On a PSC the depreciation column is still filled while the tax base ignores it.

## Exercise

Build the hand case's year 1 and year 2 taxable income and tax, then repeat with `capexDepreciationYears` 2 and state what changes and what does not. Finally, show that ISIALA's 2029 tax of 19.3660 includes no deduction for the 2027 and 2028 losses.
