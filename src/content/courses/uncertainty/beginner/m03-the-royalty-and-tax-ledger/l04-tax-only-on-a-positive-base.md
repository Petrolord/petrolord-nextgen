# Tax only on a positive base

Tax in the screening ledger is the tax rate times taxable income when taxable income is greater than zero, and zero otherwise. A negative base produces no refund, no credit and no memory.

{{panel:ec-screening-explorer}}

## One rule, two outcomes

The engine's rule is a single line: if taxable income is positive, tax is taxable income times taxRate divided by 100, and if not, tax is 0. On ISIALA, taxed at 35 percent, 18 of 20 years have positive tax, and the two zero years are 2027 and 2028, the capex years. Tax is 19.3660 in 2029 and 1.4288 in 2046, and totalTax is 136.0307 million USD.

## A capex year that still pays tax

OKPOMA, taxed at 40 percent, shows the rule turning on and off from year to year.

| year | grossRevenue | royalty | capex | opex | tax | ncf | cumulativeNCF |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2027 | 193.5960 | 19.3596 | 130.0000 | 28.8200 | 6.1666 | 9.2498 | 9.2498 |
| 2028 | 158.7487 | 15.8749 | 130.0000 | 24.3524 | 0.0000 | -11.4786 | -2.2287 |
| 2029 | 130.1740 | 13.0174 | 0.0000 | 20.6890 | 38.5870 | 57.8806 | 55.6518 |

In 2027 OKPOMA's revenue after royalty and opex exceeds the 130.0000 expensed, so the base is positive and tax of 6.1666 is due in a capex year. In 2028 the base is negative, and tax is 0.0000. The 2029 tax of 38.5870 is 40 percent of 130.1740 minus 13.0174 minus 20.6890, that year's base on its own, with no deduction for 2028.

## A negative cash year that still pays tax

Tax follows the tax base, and the tax base is not cash. The published hand case with `capexDepreciationYears` 2 deducts only 25 of year 1's capex of 50. Its year 1 base is positive, tax is 22.5000, and net cash flow is -2.5000. Tax is due in a year that loses money, because half of the capex was not deducted that year.

## A year with nothing in it

The published `tr_missing_profiles` case runs out of production in 2032. Gross revenue is 0.0000, opex is 5.0000, the base is negative, and tax is 0.0000. Net cash flow is -5.0000. The engine does not return a negative tax, so that loss is carried entirely by the contractor.

## The mistake

The careful mistake is to expect a loss year to earn a tax credit. A model that refunded 35 percent of ISIALA's negative 2027 base would show a 2027 net cash flow smaller in magnitude than -17.8210. The engine shows -17.8210. The rule is one-sided, and a one-sided rule is why the NPV bends as price moves: each year's tax switches on at its own price.

The second mistake is to read tax as the tax rate times net cash flow, or to assume that a negative net cash flow always means zero tax. On ISIALA the two coincide in 2027 and 2028 because depreciation equals capex. On the spread hand case they do not, and tax of 22.5000 sits beside a net cash flow of -2.5000.

## What the tax rule refuses

It refuses a refund, a loss carry forward, a minimum tax and a second profits tax on top. One rate applies to a positive base in every year, and every other year pays nothing and remembers nothing.

## Exercise

For OKPOMA, state tax in 2027, 2028 and 2029 and say for each year whether the base was positive. Then explain why the hand case with `capexDepreciationYears` 2 pays tax of 22.5000 in a year whose net cash flow is -2.5000.
