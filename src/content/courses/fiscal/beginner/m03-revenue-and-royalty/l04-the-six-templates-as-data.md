# The six templates as data

`fiscalTemplates` is a list of six objects. Each one is a name, a description and the four regime fields, and reading them side by side is the fastest way to see what the four instruments can and cannot express.

{{panel:ec-regime-explorer}}

## The list

| template | royalty | cost recovery limit | profit split | CIT | RRT | minimum tax |
| --- | --- | --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | sliding on price, 0 USD/bbl to 7.5 percent, 50 USD/bbl to 10 percent | 80 percent | tiered, R 1 to 60 percent, R 1.6 to 40 percent, R 2.5 to 30 percent | 30 percent | 0 percent | 0 percent |
| Ghana - Deepwater | flat 5 percent | 90 percent | tiered, R 1 to 70 percent, R 1.25 to 50 percent, R 2 to 35 percent | 35 percent | 0 percent | 0 percent |
| Brazil - Concession | flat 10 percent | 100 percent | flat 100 percent to the contractor | 34 percent | 40 percent | 0 percent |
| USA - Gulf of Mexico | flat 18.75 percent | 100 percent | flat 100 percent to the contractor | 21 percent | 0 percent | 0 percent |
| Angola - Deepwater PSC | flat 0 percent | 50 percent | tiered, R 1 to 70 percent, R 1.5 to 50 percent, R 2 to 30 percent | 25 percent | 50 percent | 0 percent |
| Generic Royalty/Tax | flat 12.5 percent | 100 percent | flat 100 percent to the contractor | 30 percent | 0 percent | 0 percent |

Each template also carries a description. Ghana - Deepwater is typical terms for a deepwater block, featuring royalty and additional oil entitlement. Brazil - Concession is a standard concession agreement with a special participation tax, described as a windfall tax.

Read those two descriptions against the fields and something is immediately visible: neither extra instrument exists. Ghana's additional oil entitlement is expressed as an R factor split and nothing else, and Brazil's windfall tax is expressed as RRT at 40 percent. The description is prose. Only the six fields are executed.

Templates carry no `id` of their own. The Suite assigns one when a template is loaded into a comparison, and the goldens use the slug of the name, so "Angola - Deepwater PSC" becomes `angola___deepwater_psc`.

## Two families

Three of the six take a flat 100 percent of profit oil to the contractor and recover cost at 100 percent: Brazil, the Gulf of Mexico and the Generic template. That is what a concession looks like inside a model built around a production sharing ledger. The contractor keeps everything the taxes do not take, and the cost recovery machinery, while still running, stops binding after the early years.

The other three split profit oil on the R factor and cap cost recovery at 80, 90 and 50 percent. Those are the templates where the middle columns of the ledger do real work, because an unrecovered balance has somewhere to accumulate and the contractor's share of profit oil changes as the field matures rather than staying at one number for 25 years.

## What the split buys the government

On the Designer's default project, total contractor net cash flow is 406.2057 million USD under the PIA template, 428.8774 under Ghana, 912.1029 under Brazil, 980.9313 under the Gulf of Mexico, 545.1955 under Angola and 986.7327 under the Generic template. Total revenue behind every one of those is 2686.9277 million USD.

The two families separate cleanly. The three concession shaped templates occupy the top of that range and the three sharing templates the bottom, and no tax rate in the list predicts the ordering.

## The mistake

The careful reader ranks by the headline royalty, since it is the number a press release quotes. Angola charges 0 percent and leaves the contractor 545.1955 million USD. The Generic template charges 12.5 percent and leaves 986.7327 million USD. Brazil charges 10 percent, carries the heaviest tax stack in the list at CIT 34 percent with RRT 40 percent, and still leaves 912.1029 million USD.

## What a template refuses

It refuses to be a jurisdiction. Six fields cannot hold a country's fiscal code, and the engine says as much: the single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine, and this model exists to compare shapes.

## Exercise

Group the six templates by profit split family and, within each family, order them by cost recovery limit. Then name the template you would expect to punish a capital heavy project hardest, and say which two fields drove your answer.
