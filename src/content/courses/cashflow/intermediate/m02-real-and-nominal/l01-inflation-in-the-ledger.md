# Inflation in the ledger

AKATA's rows are written in money of the day. Inflation is the rate at which that money loses its meaning, and the engine keeps it out of the rows entirely.

{{panel:ec-time-explorer}}

## Two different kinds of rate

AKATA is configured with an inflation rate of 3 percent, an oil price escalator of 2 percent, a gas price escalator of 2 percent, an opex escalator of 3 percent and a capex escalator of 0. Those are five numbers, and only four of them touch the ledger.

The escalators write the rows. Oil starts at 82.000000 USD/bbl in 2029, becomes 83.640000 in 2030 and reaches 92.345318 in 2035. Gas goes from 3.200000 USD/Mscf to 3.603720. Opex is entered as a flat 24000000 each year and escalates to 24720000.00 in 2030, 25461600.00 in 2031 and 28657255.12 in 2035. Capex stays 210000000.00 and 45000000.00 as entered. Every one of those rows is nominal, the number on that year's invoice.

The inflation rate does not touch any of them. Its work is done in one column, real_net_cash_flow, and in one rate, the applied real discount rate.

## The real column

| year | net_cash_flow | real_net_cash_flow |
| --- | --- | --- |
| 2029 | -121123680.00 | -121123680.00 |
| 2030 | 31746007.20 | 30821366.21 |
| 2031 | 64468245.07 | 60767504.07 |
| 2033 | 44874457.77 | 39870374.51 |
| 2035 | 30401798.05 | 25461027.24 |

The 2029 row is the base year and is not deflated. The 2030 row is divided by one year of 3 percent. The 2033 row is divided by four years of it, taking 44874457.77 to 39870374.51. The totals differ accordingly: 141637829.18 nominal against 117362408.71 real. The real column is the same cash restated in 2029 purchasing power, and that is all inflation does to a row.

## The proof that it does nothing else

The digest sweeps AKATA's inflation from 0 to 8 percent with the escalators left as configured. The nominal total net cash flow is 141637829.18 at 0, 1, 2, 3, 5 and 8 percent inflation. Not one row moved. The real total falls from 141637829.18 to 133142489.88, 125059129.50, 117362408.71, 103036613.45 and 83912631.29, because only the deflator grew.

Set inflation and every escalator to zero together and the ledger does change, because the escalators went: NPV becomes 65055328.97. Set only inflation to zero and NPV stays 72534830.66.

## The mistake

A careful reader who knows that prices inflate expects a higher inflation rate to raise the revenue rows, and looks for the effect in gross_revenue. It is not there, because every AKATA escalator is set explicitly. The link the reader is remembering is a default: when an escalator is left unset the engine falls back to the inflation rate for oil and for opex, and to zero for capex. The published escalator_defaults_to_inflation case shows an oil price of 100.000000 becoming 105.000000 at 5 percent inflation with no oil escalator given, and opex of 10000000.00 becoming 10500000.00. Set the escalator and the link is cut. Inflation then only deflates.

## What inflation refuses

It refuses to be more than one rate: there is one deflator for every row, whatever cost or price the row holds. And it refuses to restate the totals: on the real basis run the totals of revenue 857602518.80, capex 255000000.00, opex 183899092.34 and tax 148425219.46 are still printed in money of the day, and only the net cash flow total, 117362408.71, is real.

## Exercise

Read the nominal and the real net cash flow for 2033 and say how many years of deflation separate them. Then set inflation to 8 percent and report which of the two totals moved.
