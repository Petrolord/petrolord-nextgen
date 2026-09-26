# The four instruments

A fiscal regime in this sandbox is exactly four fields on one object. Everything a government collects and everything a contractor keeps comes out of those four, applied to a single ledger of 25 rows.

## The four fields

`royalty` is `flat` with a `rate`, `sliding_price` with tiers keyed on the oil price, or `pia_2021`, the Petroleum Industry Act 2021 royalty that the "Nigeria - PIA (2021)" template carries. `costRecoveryLimit` caps how much cost the contractor may take back in one year: a percent of revenue after royalty, or, with `costRecoveryBase` set to `liquids_gross`, a percent of the gross value of crude oil and NGL. `profitSplit` is `flat` with a contractor `split`, `tiered_r_factor` with tiers keyed on the R factor, or `pia_cumulative_production`, the government's minimum share of profit oil by cumulative crude production. `tax` holds `cit`, `rrt`, `minTax` and an optional `rrtUpliftPct` that defaults to 20.

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

Run both on the Designer's default project and total revenue is 2686.9277 million USD either way, because a regime never touches production or price. Contractor net cash flow is 980.9313 million USD under the Gulf of Mexico terms and 481.7318 million USD under the Angola terms, and government cash flow is 764.5528 and 1263.7523 million USD.

## The mistake

The careful reader ranks regimes by their tax rate, because tax has the familiar name. "Nigeria - PIA (2021)" and "Generic Royalty/Tax" both carry CIT 30 percent, RRT 0 percent and minimum tax 0 percent. On the default project the PIA contractor keeps 1058.0159 million USD and the Generic contractor keeps 986.7327 million USD.

The PIA case also pays the larger tax bill: total tax 453.4354 million USD against 422.8854 million USD. More tax, and more cash. The other three fields opened the gap. The PIA royalty collects 154.4828 million USD where the Generic flat 12.5 percent collects 335.8660, and the government's minimum share of profit oil is only 5 percent while cumulative production stays below 50 million bbl, so the contractor keeps 95 percent of a larger profit oil and pays its 30 percent on that. A tax rate quoted on its own predicts nothing.

## What the four fields refuse

They refuse to be a country's fiscal code. The engine's own header says this model exists to compare the shape of regimes against each other, and that the single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine. A template named for a jurisdiction is a sketch of its terms in the four fields. "Nigeria - PIA (2021)" carries the Act's minimum base terms for a deep offshore production sharing contract on new acreage, which a licensing round can bid up. Each is useful for asking which instrument moved which result, and unfit for filing anything.

## Exercise

Write out the four fields for "Ghana - Deepwater" and for "Brazil - Concession". Then say which single field you would change to move the Brazil contractor result of 623.9658 million USD closest to the Ghana result of 428.8774 million USD, and why the CIT rates of 34 and 35 percent are not the field you picked.
