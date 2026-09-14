# The units that travel

Every column in the ledger carries a unit, and three of them are easy to lose. Money is in millions, gas is not in barrels, and one of the printed columns is a fraction while the field it comes from is a percent.

{{panel:ec-regime-explorer}}

## Money is millions

Money is millions of United States dollars, written here as million USD even where the engine's own column labels abbreviate it. Gross revenue in year 1 of the Designer's default project reads 271.9889, meaning 271.9889 million USD. Opex in the same row reads 31.0027 and capex reads 500.0000, in the same units, printed to four decimals and quoted exactly as printed.

## Volumes and the boe conversion

Volumes are bbl and Mscf. The annual volume tables are scaled by one million, so the oil and NGL columns are million bbl and the gas column is million Mscf. Year 1 of the default project is oil 3.650000 million bbl, gas 0.018250 million Mscf and NGL 0.547500 million bbl.

Barrels of oil equivalent convert gas at 6000 scf per barrel, which the engine writes as a multiply by 1000 and a divide by 6000. That conversion exists for one purpose only, the variable half of opex, which is charged in USD per boe.

## Rates are percent, ratios are not

Rates are percent, and a value of 10 means ten percent. The "USA - Gulf of Mexico" template carries a flat royalty rate of 18.75, meaning 18.75 percent.

The derived implied royalty rate, royalty divided by gross revenue, is a ratio and is printed to six decimals:

| year | grossRevenue | royalty | implied royalty rate |
| --- | --- | --- | --- |
| 1 | 271.9889 | 50.9979 | 0.187500 |
| 5 | 191.1513 | 35.8409 | 0.187500 |
| 25 | 24.3216 | 4.5603 | 0.187500 |

## The mistake

The careful reader writes 0.187500 percent. The field said 18.75 and the column says 0.187500, and the two express the same instrument in different conventions, one as a percent and one as a ratio. The tell is that a rate of 0.187500 percent charged on gross revenue of 271.9889 million USD could never produce the royalty column's 50.9979 million USD.

The second version of the same slip is treating the gas column as a small oil number. Year 1 gas of 0.018250 million Mscf sits beside oil of 3.650000 million bbl and looks negligible, but the two columns are not in the same unit at all.

## What the units refuse

They refuse to carry a currency year. There is no inflation, no real basis, no deflator anywhere in the sandbox. Every million USD in year 25 is the same million USD as in year 1, and the only thing that distinguishes them is the discount exponent applied afterwards.

## Exercise

Convert the year 1 default project streams to the units the variable opex rate needs, saying which conversion factor applies to which stream. Then state, in words, what 0.187500 and 18.75 each mean and where each is printed.
