# Gross revenue in millions

Gross revenue is the top of every ledger in this sandbox and the base every royalty is charged on. It is three products of volume and price, added, and scaled into millions.

{{panel:ec-regime-explorer}}

## The calculation

Gross revenue is oil volume times the applied oil price, plus gas volume times the gas price, plus NGL volume times the NGL price, all divided by one million. The divide by one million is what puts the ledger in millions of USD.

On the Designer's default project, gross revenue is 271.9889 million USD in year 1 and 24.3216 million USD in year 25, and the totals over the life reach 2686.9277 million USD. On the teaching field ODIDI it is 139.6563 million USD in year 1 and 6.9081 million USD in year 25.

| year | default project grossRevenue | ODIDI grossRevenue |
| --- | --- | --- |
| 1 | 271.9889 | 139.6563 |
| 2 | 244.4628 | 120.0245 |
| 3 | 219.7286 | 103.1532 |
| 5 | 191.1513 | 76.1939 |
| 6 | 171.8074 | 93.9859 |
| 25 | 24.3216 | 6.9081 |

## Two shapes in one column

The default project column falls in every printed year. The ODIDI column falls to 76.1939 million USD in year 5 and then rises to 93.9859 million USD in year 6. Both fields are declining throughout. The difference is entirely the price deck, whose ODIDI step at year 6 is large enough to outrun a 14 percent oil decline while the default project's step at year 5 is not.

Reading revenue without knowing where the deck steps is therefore reading half the number.

## Revenue does not know the regime

Run all six templates on the default project and total revenue reads 2686.9277 million USD on all six lines. Run them on the published test project and it reads 7001.1938 million USD on all six lines. The regime never touches production and never touches price, so this column is a constant across a comparison.

That is the property that makes a regime comparison legible. Contractor net cash flow on the default project ranges from 406.2057 million USD to 986.7327 million USD across the six templates, and since the sales figure behind every one of those is the same 2686.9277 million USD, the whole of the spread is instrument.

## The mistake

The careful reader treats gross revenue as a net back or a realisation, and deducts something from it before charging royalty. Nothing has been deducted from 271.9889 million USD. No transport, no processing, no quality bank, no marketing fee. It is volumes at deck prices and nothing else, and the royalty base is exactly this number.

The other slip is scale. A reader who carries 271.9889 as USD rather than millions of USD will find a 500.0000 capex that looks like a rounding error, and will believe the project pays back instantly.

## What gross revenue refuses

It refuses a differential, a marketing discount, an entitlement adjustment for working interest, and a currency. There is one price per stream per year, taken from the deck, and every barrel produced is sold at it.

## Exercise

Write gross revenue for years 1, 5 and 6 of ODIDI and say in one sentence why the year 6 figure is higher than the year 5 figure. Then explain what it would mean if two regimes in one comparison reported different total revenue.
