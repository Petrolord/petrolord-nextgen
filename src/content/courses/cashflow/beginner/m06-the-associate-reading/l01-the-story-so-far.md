# The story so far

One field, seven rows, and every column of the ledger this tier owns, read once from left to right on the year with nothing unusual in it.

## The year 2031

AKATA's 2031 row is the cleanest in the field: no capex, no loss, one year past the last spend.

| line | value |
| --- | --- |
| oil, bbl | 1550000.00 |
| applied_oil_price, USD/bbl | 85.312800 |
| gas, Mscf | 1240000.00 |
| applied_gas_price, USD/Mscf | 3.329280 |
| gross_revenue | 136363147.20 |
| royalty | 20454472.08 |
| opex | 25461600.00 |
| depreciation | 25500000.00 |
| taxable_income | 64947075.12 |
| tax | 25978830.05 |
| capex | 0.00 |
| net_cash_flow | 64468245.07 |
| cumulative_cash_flow | -29534809.71 |

Volumes came from a production file with one row per year, recognised because its columns ended in _oil_bbl and _gas_mscf. The prices are not the 82 and 3.2 that were typed: an escalator of 2 percent a year has carried them for two years to 85.312800 and 3.329280. Gross revenue is volume times price on each stream, added. Royalty at 15 percent comes off that gross before any cost. Opex is the typed 24000000 escalated at 3 percent for two years to 25461600.00. Depreciation is a tenth of each capex tranche, 25500000.00 once both are running, and appears only to shrink the tax base. Taxable income is revenue less royalty, opex and depreciation; tax is 40 percent of it. Net cash flow is revenue less royalty, opex, capex and tax, with depreciation absent. The cumulative is the running sum, still negative because 2029 cost 121123680.00 more than it earned.

## The whole field

| reading | AKATA |
| --- | --- |
| total revenue | 857602518.80 |
| total capex | 255000000.00 |
| total opex | 183899092.34 |
| total tax | 148425219.46 |
| total net cash flow, real | 117362408.71 |
| boe | 10970666.67 |
| unit technical cost, USD/boe | 40.006602 |
| payback | 3.46 years |
| take, percent | 66.1723 |

Payback lands in 2032 because the cumulative moves from -29534809.71 to 19845806.34 across that year, and the fraction the engine prints, 3.461632, comes from the nominal running sum. Take is royalty plus tax over revenue less capex less opex. Unit technical cost is capex plus opex over boe, with gas at 6 Mscf per barrel.

## The five conventions

Everything in this tier is a stated convention, and each has a number that proves it. A year is a row, and per-well columns sum into it. A price is applied per year by escalator or deck, so 82 became 85.312800. Royalty is a share of gross, so a year that nets -121123680.00 still pays 27904800.00. Depreciation is for tax only, so the 2029 net is -121123680.00 and not 21000000.00 lower. Working interest scales results, so at 60 percent the 2029 net is -72674208.00 while the gross revenue printed is still 186032000.00.

## What the tier has not done

Nothing here has a clock. Every total treats 2035 money as 2029 money, and every reading, payback, take and unit cost alike, is undiscounted. The loss columns read 0.00 on every row because no AKATA year lost money for tax, and the regime is a flat royalty and a flat tax, with none of the edges a real licence carries. Those belong to the Professional and Expert tiers.

## Exercise

Without the table, write the 2031 row from gross revenue down to net cash flow, then check each line. Then say which of the five conventions would change the 2031 row if it were set differently, and which would leave the row alone and change only a total.
