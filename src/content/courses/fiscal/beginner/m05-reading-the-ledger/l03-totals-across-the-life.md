# Totals across the life

The bottom row of the ledger is nine numbers, and the only one a regime cannot touch is the one everybody quotes first.

{{panel:ec-regime-explorer}}

## The nine totals

"USA - Gulf of Mexico" on the Designer's default project closes its 25 rows at gross revenue 2686.9277, royalty 503.7989, cost recovered 941.4436, profit oil 1241.6852, tax 260.7539, opex 441.4436, capex 500.0000, contractor net cash flow 980.9313 and government cash flow 764.5528, all in millions of USD.

## What the regime cannot move

Run all six templates on the same project and the revenue column does not move at all.

| regime | total contractor NCF | total government cash flow | total revenue | total tax |
| --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | 406.2057 | 1339.2784 | 2686.9277 | 174.0882 |
| Ghana - Deepwater | 428.8774 | 1316.6067 | 2686.9277 | 230.9340 |
| Brazil - Concession | 623.9658 | 1121.5184 | 2686.9277 | 852.8256 |
| USA - Gulf of Mexico | 980.9313 | 764.5528 | 2686.9277 | 260.7539 |
| Angola - Deepwater PSC | 481.7318 | 1263.7523 | 2686.9277 | 245.1955 |
| Generic Royalty/Tax | 986.7327 | 758.7514 | 2686.9277 | 422.8854 |

A fiscal regime prices barrels, it does not produce them. Revenue is 2686.9277 in every row because production and price are the project's, and cost recovered is 941.4436 in every row too, because each pool clears inside the life here. The division moves: contractor cash from 406.2057 to 986.7327, and the state from 758.7514 to 1339.2784.

## When the totals stop agreeing

Cost recovered matches the life costs only when the pool empties. On the default project it does, closing at 0.0000 under all six templates, so 941.4436 recovered stands against opex of 441.4436 and capex of 500.0000. On the Suite test project none of them empties: the closing unrecovered pool reads 79.3932 under Generic, 130.3246 under PIA, 84.7413 under Ghana, 72.7082 under Brazil, 97.2331 under the Gulf of Mexico terms and 251.6537 under Angola. Cost the ledger never assigned to cost oil is cost the contractor still paid, and the totals row is where that shows.

## Tax is not take

The tax column and the take column rank differently, and confusing them is the fastest way to misread a comparison. Brazil pays the most tax of the six, 852.8256, and leaves the contractor 623.9658, the third highest figure in the table. PIA pays the least tax, 174.0882, and leaves the contractor 406.2057, the lowest. Tax is one of three instruments the state collects through, and a regime that takes its share as royalty and profit oil needs very little of it.

## The mistake

Adding the contractor's total to the state's and expecting the revenue total. Under the Gulf of Mexico terms that pair is 980.9313 and 764.5528 against a revenue of 2686.9277, and the gap is not missing money: opex of 441.4436 and capex of 500.0000 are the contractor's alone, and the engine prints that same relation on the rows it publishes for both a full recovery limit and a capped one. The other error is comparing totals across projects. The Suite test project turns over 7001.1938 of revenue and returns 2221.9251 to the contractor under the same Gulf of Mexico terms. That is a bigger field, not a better regime.

## What it refuses

Every total is a plain sum of 25 undiscounted rows. There is no abandonment, no salvage and no terminal value, the horizon is fixed at 25 years rather than closed by an economic limit, and a year that loses money is added in at face value like any other.

## Exercise

Write the nine totals for the Gulf of Mexico terms on the default project. Then name the two columns that are identical for all six templates and say why, and say which template pays the most tax and which leaves the contractor least.
