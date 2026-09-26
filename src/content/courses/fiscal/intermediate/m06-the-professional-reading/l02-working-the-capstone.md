# Working the capstone

A capstone of this tier's kind hands you a field, a set of regimes and a clock, and asks for readings. The method is the same on any field, and here it is worked on the teaching field.

{{panel:ec-instrument-explorer}}

## Step one: write the four instruments before any number

For each regime, write its royalty, its cost recovery limit, its profit split and its tax stack.

| regime | royalty | limit | profit split | tax |
| --- | --- | --- | --- | --- |
| Brazil - Concession | flat 10 percent | 100 | flat 100 percent | CIT 34, RRT 40 |
| Angola - Deepwater PSC | flat 0 percent | 50 | R factor 70, 50, 30 percent | CIT 25, RRT 50 |

## Step two: read the cost columns, which no regime touches

Opex is 25.0037 million USD in year 1, falls to 12.3405 by year 25 and totals 390.2137. Capex is 420.0000 in year 1 and 0.0000 after. Every regime shares those columns, so any difference between regimes is fiscal by construction.

## Step three: take the implied royalty rate, year by year

Under a flat 18.75 percent royalty the implied rate is 0.187500 in every year. Under the tiered teaching regime's sliding royalty the implied rate is 0.075000 in years 1 to 5 and 0.100000 from year 6, because the deck steps from 45 to 65 USD per bbl at year 6. Under "Nigeria - PIA (2021)" it is 0.050000 in years 1 to 5 and 0.052163 in year 6, is back at 0.050000 by year 9, and sits above it again in every year from 12 to 21 against each year's benchmark on the Regulations (2021) base, the engine default.

## Step four: check the limit against the closing pool

Angola recovers 618.0991 million USD and closes with 192.1146 still unrecovered. Brazil recovers 790.8868 and closes at 19.3270. A large closing pool is money the contractor spent that the ledger never paid back.

## Step five: read the tax against the rate

Brazil charges 34 and 40 percent and collects 109.3752 million USD. "USA - Gulf of Mexico" charges 21 percent alone and collects 45.8808. "Angola - Deepwater PSC" charges 25 and 50 and collects 100.4364. The rates do not rank the collections, because each is charged on a different base.

## Step six: net present value and rate of return together

The field's own discount rate is 12 percent.

| regime | NPV at 12 percent | IRR percent | payback year |
| --- | --- | --- | --- |
| Nigeria - PIA (2021) | 1.7389 | null | 7 |
| Brazil - Concession | -5.8662 | null | 6 |
| Generic Royalty/Tax | -13.3840 | null | 7 |
| Ghana - Deepwater | -27.4074 | null | 6 |
| USA - Gulf of Mexico | -37.3123 | null | 7 |
| Angola - Deepwater PSC | -58.1813 | null | 8 |

Five of the six net present values are negative and "Nigeria - PIA (2021)" is barely positive at 1.7389. No regime here has a single rate of return to set beside the 12 percent, because the contractor's cash flow turns negative late in the life.

## Step seven: rank, and say what the ranking is of

The summary sorts by contractor net present value descending, so "Nigeria - PIA (2021)" is first, Brazil second and Angola last. Government cash flow runs the other way, 316.7898 million USD for Angola against 196.0260 for the PIA template. Both orders are correct, and they are orders of different things.

## The mistake

The careful mistake is answering with a number and no label. A total contractor net cash flow of 192.9896 million USD means nothing until you say Brazil, and -5.8662 means nothing until you say 12 percent.

## What it refuses

The method produces labelled readings, never a recommendation.

## Exercise

Work the seven steps under Ghana Deepwater: 117.1399 contractor net cash flow, 308.8447 government cash flow, 74.7196 tax, 788.5887 recovered, 21.6250 left in the pool, payback year 6 and -27.4074 at 12 percent. Write each with the label that makes it an answer, and say why the rate column is empty.
