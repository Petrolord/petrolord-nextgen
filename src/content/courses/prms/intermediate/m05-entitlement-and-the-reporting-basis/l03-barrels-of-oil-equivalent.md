# Barrels of oil equivalent

{{panel:prms-reserves-calculator}}

EKN-1 produces oil and gas together. A category table can report each in its own unit, and it can also add them into one figure, barrels of oil equivalent, or BOE. The engine does both. It adds the gas to the oil at a stated number of Mscf per BOE, calls the result supplementary, and checks the category order in BOE as well as in oil.

## The conversion

A BOE counts a barrel of oil as one and converts the gas at the stated factor. On EKN-1 the factor is 6.000000 Mscf per BOE, a stated input with no default. The 2P on the net-entitlement basis is 9908615.920000 barrels of oil and 7926892.855000 Mscf of gas; converted and added, it is 11229764.729167 BOE.

| category | oil | gas | BOE |
| --- | --- | --- | --- |
| 1P | 5289968.880000 | 4231974.985000 | 5995298.044167 |
| 2P | 9908615.920000 | 7926892.855000 | 11229764.729167 |
| 3P | 14868768.565000 | 11895015.090000 | 16851271.080000 |

The gas in the Ekene forecasts runs at 0.800000 Mscf a barrel, so it adds a modest share to each figure. A gas field would show the reverse.

## Supplementary, and why

The engine calls BOE supplementary and cites PRMS 3.2.9.3, verbatim in its reasons:

> on the net-entitlement basis: 1P 5995298.044167, 2P 11229764.729167, 3P 16851271.08 BOE at 6 Mscf per BOE (supplementary, PRMS 3.2.9.3); P2 5234466.685, P3 5621506.350833

The factor is a convention about heating value. It says nothing about price, and a barrel of oil and six Mscf of gas rarely sell for the same money. A reserves report states the oil and the gas in their own units and gives the BOE beside them, with its factor.

## A factor moves the figure

Because the factor is stated, two reports can quote different BOE totals from the same oil and gas. A figure in BOE is therefore quoted with its factor, as the reason above quotes it. The BOE is also where the engine checks that the three cases stay in order, since a case could lead in oil and trail in gas.

## A factor must be above 0

A factor of 0 would divide by nothing, and a factor left out has no default. Both are refused, verbatim:

> mscfPerBoe must be a finite number above 0; got 0

> mscfPerBoe must be a finite number above 0; got nothing

## The other courses

The factor is a stated input here and in every economics course of the academy. How gas is priced against oil belongs to the gas sales agreements course and the cash flow course; this course only adds volumes.

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". Read the oil, gas and BOE of each category.
2. Check the 2P BOE by adding the 2P oil to the 2P gas over 6.
3. Set "Mscf per BOE (stated)" to a figure of your own. Read which columns move and which stay, and whether the reserves oil changes.
4. Set "Mscf per BOE (stated)" to 0 and read the refusal.
