# A year is a row

A field's economics is a table with one row per calendar year, and every headline number is a reading of that table under a stated convention.

## The ledger

The engine keeps one row for every calendar year the field is modelled in, and each row carries the same columns: volumes sold, price applied, gross revenue, royalty, opex, capex, depreciation, taxable income, tax, and the net cash flow left over. Nothing lives between rows: a month, a quarter, a campaign that straddles December is added into the year it falls in before a price is applied.

The hand-derived joint venture case is the smallest ledger the course uses: two rows, 2030 and 2031, one well producing 1000000.00 bbl a year at 100.000000 USD per bbl.

| year | gross_revenue | royalty | opex | capex | depreciation | taxable_income | tax | net_cash_flow | cumulative_cash_flow |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2030 | 100000000.00 | 20000000.00 | 10000000.00 | 50000000.00 | 5000000.00 | 65000000.00 | 32500000.00 | -12500000.00 | -12500000.00 |
| 2031 | 100000000.00 | 20000000.00 | 10000000.00 | 0.00 | 5000000.00 | 65000000.00 | 32500000.00 | 37500000.00 | 25000000.00 |

Read the 2030 row left to right and you have read the whole method. Revenue 100000000.00; royalty at 20 percent takes 20000000.00; opex 10000000.00 and depreciation 5000000.00 come off for tax, leaving taxable income 65000000.00; tax at 50 percent is 32500000.00. Then the cash view: revenue less royalty, opex, capex 50000000.00 and tax is -12500000.00. The second row is identical except that capex is 0.00, so its net cash flow is 37500000.00.

## Every number is a reading

Add the net cash flow column and you get 25000000.00, the total net cash flow. Add revenue and you get 200000000.00; add tax, 65000000.00; add capex, 50000000.00; add opex, 20000000.00. Take, 80.7692 percent, is a ratio of columns. Payback, 1.33 years, is where the cumulative column crosses zero. None of these is a new fact. Each is the ledger read a particular way, and the convention it was read under travels with it or it means nothing.

## The mistake

The careful mistake is to treat a column as cash because it is in the ledger. Depreciation is the case. In 2030 the capex column says 50000000.00 left the account; the depreciation column says 5000000.00, and that 5000000.00 appears nowhere in the net cash flow. It reduces taxable income, and through the 50 percent rate it reduces tax by half of itself. A reader who subtracts depreciation from revenue when working out net cash flow gets a row 5000000.00 too low and a payback later than the engine's, and the error is invisible on a single row because the arithmetic looks tidy.

## What a row refuses

A row has no months. The engine reads dates and month indexes on upload, but the ledger it returns has one row per year, and there is no cash flow of March. Nor has it an order of events: January capex and December revenue sit together as if they happened at once, which is what an end-year convention assumes.

## Exercise

Write out, one line each, how the 2031 row turns 100000000.00 into 37500000.00. Then say which number you wrote is not cash, and why 2031 differs from 2030 by exactly the capex, 50000000.00.
