# The four instruments

A fiscal regime in this sandbox is exactly four fields on one object. Everything a government collects and everything a contractor keeps comes out of those four, applied to a single ledger of 25 rows.

## The four fields

`royalty` is either `flat` with a `rate`, or `sliding_price` with tiers keyed on the oil price. `costRecoveryLimit` is a percent of revenue after royalty, and it caps how much cost the contractor may take back in one year. `profitSplit` is either `flat` with a contractor `split`, or `tiered_r_factor` with tiers keyed on the R factor. `tax` holds `cit`, `rrt`, `minTax` and an optional `rrtUpliftPct` that defaults to 20.

Nothing else exists. There is no signature bonus, no domestic supply obligation, no state participation and no flare penalty. A regime that needs one of those cannot be expressed here at all.

## Two templates, filled in

| field | USA - Gulf of Mexico | Angola - Deepwater PSC |
| --- | --- | --- |
| royalty | flat 18.75 percent | flat 0 percent |
| cost recovery limit | 100 percent | 50 percent |
| profit split | flat 100 percent to the contractor | tiered, R 1 to 70 percent, R 1.5 to 50 percent, R 2 to 30 percent |
| CIT | 21 percent | 25 percent |
| RRT | 0 percent | 50 percent |
| minimum tax | 0 percent | 0 percent |

Run both on the Designer's default project and total revenue is 2686.9277 million USD either way, because a regime never touches production or price. Contractor net cash flow is 980.9313 million USD under the Gulf of Mexico terms and 545.1955 million USD under the Angola terms, and government cash flow is 764.5528 and 1200.2886 million USD.

## The mistake

The careful reader ranks regimes by their tax rate, because tax is the instrument with a familiar name. "Nigeria - PIA (2021)" and "Generic Royalty/Tax" both carry CIT 30 percent, RRT 0 percent and minimum tax 0 percent. On the default project the PIA contractor keeps 406.2057 million USD and the Generic contractor keeps 986.7327 million USD.

Worse for the intuition, the PIA case pays the smaller tax bill of the two: total tax 174.0882 million USD against 422.8854 million USD. Less tax, and less than half the cash. The gap was opened by the other three fields, a cost recovery limit of 80 percent instead of 100, and an R factor split that hands the contractor 60, then 40, then 30 percent of profit oil instead of all of it. A tax rate quoted on its own predicts nothing.

## What the four fields refuse

They refuse to be a country's fiscal code. The engine's own header says this model exists to compare the shape of regimes against each other, and that the single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine. A template named for a jurisdiction is a caricature in six numbers, useful for asking which instrument moved which result, and unfit for filing anything.

## Exercise

Write out the four fields for "Ghana - Deepwater" and for "Brazil - Concession". Then say which single field you would change to move the Brazil contractor result of 912.1029 million USD closest to the Ghana result of 428.8774 million USD, and why the CIT rates of 34 and 35 percent are not the field you picked.
