# Net cash flow

Net cash flow is what is left of gross revenue after royalty, opex, capex and tax. Depreciation is absent, and that absence is the whole point of the column.

{{panel:ec-ledger-explorer}}

## The subtraction

Five numbers make the row. AKATA 2029: gross revenue 186032000.00 USD, less royalty 27904800.00, less opex 24000000.00, less capex 210000000.00, less tax 45250880.00, gives a net_cash_flow of -121123680.00. In 2031, with capex at 0.00, the same subtraction gives 64468245.07. Read the columns from left to right and the row builds itself; there is no step that needs a rate other than the two the configuration carries.

| year | gross_revenue | royalty | opex | capex | tax | net_cash_flow |
| --- | --- | --- | --- | --- | --- | --- |
| 2029 | 186032000.00 | 27904800.00 | 24000000.00 | 210000000.00 | 45250880.00 | -121123680.00 |
| 2030 | 159564720.00 | 23934708.00 | 24720000.00 | 45000000.00 | 34164004.80 | 31746007.20 |
| 2031 | 136363147.20 | 20454472.08 | 25461600.00 | 0.00 | 25978830.05 | 64468245.07 |
| 2032 | 116656473.02 | 17498470.95 | 26225448.00 | 0.00 | 18973021.63 | 53959532.44 |
| 2033 | 99768205.16 | 14965230.77 | 27012211.44 | 0.00 | 12916305.18 | 44874457.77 |
| 2034 | 85892186.90 | 12883828.04 | 27822577.78 | 0.00 | 7874312.43 | 37311468.65 |
| 2035 | 73325786.51 | 10998867.98 | 28657255.12 | 0.00 | 3267865.37 | 30401798.05 |

The hand-derived case is the same subtraction with round numbers: 100000000.00 less 20000000.00, less 10000000.00, less 50000000.00, less 32500000.00 is -12500000.00 in 2030, and with no capex the 2031 row is 37500000.00.

## The shape

One deep negative year, one shallow positive year while the second tranche of capex lands, then a peak in the first clean year at 64468245.07 and a decline that tracks the volumes. The 2031 peak is the year with no capex and the highest remaining revenue. After it every line moves against the contractor: revenue falls from 136363147.20 to 73325786.51, opex escalates from 25461600.00 to 28657255.12, and only the tax falls with them. The hand-derived case has the same shape compressed into two rows: -12500000.00, then 37500000.00, with nothing left to decline.

## Two flavours of the same column

The row also carries real_net_cash_flow. On the 2029 row the two agree at -121123680.00; by 2033 the nominal 44874457.77 has become 39870374.51 in real terms, because AKATA runs with inflation_rate_pct 3 and the real column restates each year in 2029 money. On the hand-derived case inflation is 0 and the columns are identical. Both are the same cash; which one you total is a convention, and the convention matters: the nominal total is 141637829.18 and the real total 117362408.71. This tier reads net_cash_flow as printed and names the other; what real money is for belongs to the Professional tier.

## The mistake

Three ways to get the column wrong, each with a signature. Subtracting depreciation gives a 2029 net that is 21000000.00 lower than -121123680.00. Leaving out tax because the year is a loss gives a 2029 net 45250880.00 higher than it. Subtracting depreciation instead of capex gives a positive 2029 and a field that never seems to need the 210000000.00 it spent. The check is the 2031 row: gross revenue 136363147.20, royalty 20454472.08, opex 25461600.00, tax 25978830.05, capex 0.00, and the result must be 64468245.07 to the cent.

## What it refuses

The column is after royalty and after tax and nothing else. There is no interest, no debt service, no working capital, no overhead beyond what the opex file carries, and no abandonment unless it is configured, which is an Expert edge. It does not discount and it does not compound. It is one year's cash, in that year's money, at the working interest the configuration carries.

## Exercise

Rebuild the 2030 net cash flow from its five inputs and confirm 31746007.20. Then say which single line explains why 2030 is so much smaller than 2031, and what the depreciation column contributed to that answer.
