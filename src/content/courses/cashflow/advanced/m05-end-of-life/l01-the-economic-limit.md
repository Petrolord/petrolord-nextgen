# The economic limit

A field stops when a year's revenue after royalty no longer covers its opex. The engine can find that year and cut the ledger there, and by default it does not.

{{panel:ec-fiscal-explorer}}

## The test

The economic limit compares revenue less royalty against opex, year by year, and the limit year is the last year that passes. Tax, depreciation and capex play no part. On elt_royalty_tail the 2031 row would sell 120000.00 bbl at 100.000000 USD against opex of 10000000.00, and after the 20 percent royalty the revenue falls short. The ledger ends at 2030: economic_limit_year 2030, years trimmed 1.

## Off by default

The published elt_off_tail_kept case keeps a 2032 row of 10000.00 bbl:

| year | gross_revenue | royalty | opex | taxable_income | loss_carryforward | net_cash_flow | discounted_cash_flow |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2032 | 1000000.00 | 200000.00 | 10000000.00 | -14200000.00 | 14200000.00 | -9200000.00 | -7603305.79 |

The year's net cash flow is -9200000.00, it banks a 14200000.00 loss nothing will use, and NPV is 13987603.31 with IRR 173.0447 percent. With apply_economic_limit true the row goes: NPV 21590909.09, IRR 200.0000 percent, economic_limit_year 2031, rows 2. The distance between the two NPVs is one row no operator would run.

The kept tail is also a terminal negative flow, and the IRR of a vector with a terminal negative can have two roots or none. The default hands the IRR that shape without saying so.

## AKATA with a long tail

Extend AKATA by six years to 2041, opex escalating as before, and read the test:

| year | revenue less royalty | opex |
| --- | --- | --- |
| 2037 | 44633520.52 | 30402481.95 |
| 2038 | 37795328.32 | 31314556.41 |
| 2039 | 31541919.46 | 32253993.10 |
| 2040 | 26810631.54 | 33221612.90 |
| 2041 | 22789036.81 | 34218261.28 |

2038 passes and 2039 fails. Limit off: 13 rows, total net cash flow 139349966.67, NPV 87727489.23, IRR 31.1927 percent. Limit on: 10 rows ending in 2038, economic_limit_year 2038, years trimmed 3, total net cash flow 152527473.77, NPV 93890737.45, IRR 31.4916 percent. Trimming three losing years raised every headline.

The limit year moves with price: at an oil price of 60 it is 2037, four years trimmed, NPV -15270664.32; at 50, 2036, five trimmed, -65210641.50; at 40, 2035, six trimmed, -115833227.55. The trim cannot rescue a field whose price is wrong; it only stops the ledger making it worse.

## The mistake

The careful mistake is reading the limit year as the first year that fails. It is the last year that passes: 2031 on elt_tail_trimmed, where 2032 fails, and 2038 on AKATA, where 2039 fails. A reader who reports 2039 has kept a losing year.

The second is to test on net cash flow or taxable income. Neither is the test on the elt_off_tail_kept row; the test is 1000000.00 less 200000.00 against 10000000.00.

## What the engine refuses

It refuses to apply the limit unless asked. It refuses to look at anything but revenue, royalty and opex, so a year with heavy capex and a healthy operating margin passes, and a year a tax loss would have saved fails. And it refuses to report the limit when it is off: the KPI line reads economic_limit_year not reported, and the tail sits in the ledger as if it were wanted.

## Exercise

From the AKATA tail table, state the limit year and the number of years trimmed, then say what would change if opex in 2039 were lower than that year's revenue less royalty. Finally, name the KPI that tells a reader the limit was never applied.
