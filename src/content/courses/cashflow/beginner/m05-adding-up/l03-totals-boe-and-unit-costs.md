# Totals, barrels of oil equivalent and unit costs

The totals block adds each column over the life of the field, converts the gas into barrels at 6 Mscf per boe, and divides cost by volume to give two numbers a reader can carry between fields.

{{panel:ec-ledger-explorer}}

## The totals

AKATA over 2029 to 2035:

| total | value |
| --- | --- |
| revenue | 857602518.80 |
| capex | 255000000.00 |
| opex | 183899092.34 |
| tax | 148425219.46 |
| net cash flow, nominal | 141637829.18 |
| net cash flow, real | 117362408.71 |
| oil, bbl | 9680000.00 |
| gas, Mscf | 7744000.00 |
| boe | 10970666.67 |

Each money total is the sum of its column in money of the day. The opex total is 183899092.34, not seven times the typed 24000000, because the escalator carried the column from 24000000.00 in 2029 to 28657255.12 in 2035; the capex total is exactly 255000000.00 because its escalator is 0. The two net cash flow totals are money of the day and 2029 money, and the real one is the last entry of the cumulative_cash_flow column.

## Barrels of oil equivalent

Gas is converted at 6 Mscf per barrel. AKATA's 7744000.00 Mscf join its 9680000.00 bbl to give 10970666.67 boe. The hand-derived case has no gas, so its 2000000.00 bbl are 2000000.00 boe. The conversion is on energy, not on price: at 82 USD/bbl and 3.2 USD/Mscf, six Mscf of gas sell for a small fraction of what a barrel does, and the boe count does not care. That is its limit and its use: it lets an oil field and a gas field be compared per unit, and it flatters the gas.

## Unit technical cost and opex per boe

Unit technical cost is capex plus opex over boe. AKATA: 255000000.00 plus 183899092.34 over 10970666.67 boe gives 40.006602 USD/boe. Opex per boe is 183899092.34 over the same denominator, 16.762800 USD/boe. The hand-derived case gives 35.000000 and 10.000000: 50000000.00 plus 20000000.00 over 2000000.00 boe, then 20000000.00 over the same.

Neither contains royalty or tax. They are technical costs, what it takes to build and run the field per barrel, and they are the same at every working interest: 40.006602 at 100 percent and at 25 percent.

| case | unit technical cost | opex per boe |
| --- | --- | --- |
| AKATA | 40.006602 | 16.762800 |
| jv_analytic_decision_kpis | 35.000000 | 10.000000 |
| multiyear_jv_real | 38.952763 | 18.334475 |
| single_year_positive | 10.000000 | 10.000000 |
| zero_rates_capex_only | null | null |

zero_rates_capex_only has no volumes, so the engine prints null rather than divide by nothing; single_year_positive has no capex, so both its unit costs read 10.000000.

## The mistake

Dividing by oil alone. Dividing the same costs by 9680000.00 bbl instead of 10970666.67 boe gives a unit technical cost higher than 40.006602 and a field that looks dearer than it is beside a gas field whose cost was, correctly, spread over boe. The second is to convert gas at its price ratio instead of at 6, which makes boe a function of the price deck and turns a technical number into a fiscal one. The third is to replace the escalated opex total with the typed 24000000 times the year count.

## What it refuses

The totals are undiscounted, so 30401798.05 earned in 2035 counts exactly as 2029 money. The unit costs are lifetime averages and say nothing about any single year. They exclude royalty, tax and abandonment. And boe is a fixed 6, with no option to weight by energy content or price. The engine also prints a PV of capex, 250909090.91 on AKATA, which is a discounted number and the Professional tier's.

## Exercise

Confirm the boe from the oil and gas totals, then the unit technical cost from capex, opex and boe. Then say what happens to the unit technical cost when the working interest drops to 40 percent, and why.
