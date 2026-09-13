# The second effective tax rate

One result object holds two different effective tax rates for the same regime, and a single screen shows both of them without saying they are different.

{{panel:ec-comparison-explorer}}

## Two definitions, one label

The summary table divides government take by government take plus contractor take, with total capex added back into the contractor's side. The price sensitivity divides the same two quantities, on the same cash flows, without the add-back. Both come out of one call, both are called an effective tax rate, and they never agree. At the deck's own first-year price of 70 USD per bbl, on the Designer's two default regimes:

| regime | summary table, capex added back | price sweep at the same price, no add-back | difference, percentage points |
| --- | --- | --- | --- |
| Concessionary (Royalty/Tax) | 46.3452 | 59.6210 | 13.2758 |
| Nigerian PIA (PSC) | 55.5380 | 71.4471 | 15.9091 |

And on all six templates, same project, same price:

| regime | summary table, capex added back | price sweep at the same price, no add-back | difference, percentage points |
| --- | --- | --- | --- |
| Generic Royalty/Tax | 33.7901 | 43.4694 | 9.6793 |
| USA - Gulf of Mexico | 34.0485 | 43.8018 | 9.7533 |
| Brazil - Concession | 37.1137 | 47.7450 | 10.6313 |
| Angola - Deepwater PSC | 53.4534 | 68.7654 | 15.3119 |
| Ghana - Deepwater | 58.6335 | 75.4293 | 16.7958 |
| Nigeria - PIA (2021) | 59.6432 | 76.7282 | 17.0850 |

## Neither one is wrong

Take over profit and take over cash are both quantities a fiscal analyst uses, and they answer different questions. Adding capex back asks what share of the profit the state took. Leaving it out asks what share of the cash that came out of the project went to the state. What is wrong is that one screen labels both of them effective tax rate and puts them a finger's width apart.

## The mistake

The tempting repair is a mental correction: learn that the chart runs about ten points higher than the summary table and translate between the two. The difference column refuses that. On one comparison, on one project, at one price, it runs from 9.6793 percentage points to 17.0850. A reader who carries a ten point offset across to the Nigeria - PIA (2021) row, where the gap is 17.0850, understates the chart badly, and a reader who carries Ghana - Deepwater's gap of 16.7958 back to Generic Royalty/Tax, where it is 9.6793, overstates it just as badly in the other direction. The gap grows with the government's share, because a fixed add-back of capex weighs more heavily on a denominator the state has already thinned.

## What each refuses

The summary's version refuses to be a cash measure, and its capex add-back is undiscounted and undated. The sweep's version refuses nothing at all, which is the more dangerous property: its denominator is take plus contractor net cash flow with no add-back to hold it up, so on a project that loses money the denominator can shrink to nothing, cross zero and take the ratio with it. That is why the two rates diverge most exactly where a project is worst, and why a number quoted off the chart needs the two totals underneath it before it means anything.

## Exercise

Write the two definitions side by side and say which of them the summary table shows. Then give both values for Nigeria - PIA (2021) at 70 USD per bbl and say why a fixed offset between the two columns does not exist.
