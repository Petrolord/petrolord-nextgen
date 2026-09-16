# Government share of net revenue in the table

The summary's percentage column is government share of net revenue, two lifetime totals with the capex programme added back into one, and that changes what it may say.

{{panel:ec-comparison-explorer}}

## What the column divides

Government share of net revenue is government cash flow divided by revenue less opex over the project life. On the ledger the denominator is government cash flow plus contractor net cash flow plus TOTAL CAPEX, the capex added back. The engine returns it undiscounted, as `governmentShareOfNetRevenuePct` and under the legacy key `effectiveTaxRate`. The headline metric sits beside it: government take divides the same government cash flow by revenue less opex less capex, with nothing added back.

Total capex on the default project is 500.0000 million USD, spent in year 1. Generic Royalty/Tax returns lifetime government cash flow of 758.7514 million USD and lifetime contractor net cash flow of 986.7327 million USD, and its government share of net revenue reads 33.7901 percent. Nigeria - PIA (2021) on the same field returns 1339.2784 against 406.2057 and reads 59.6432 percent. Revenue less opex, 2245.4841 million USD, is the same under every regime, so the column follows government cash flow.

## It is not a tax rate

Government cash flow is royalty plus the government's share of profit oil plus tax, so the numerator holds a great deal that no tax authority calls tax. Angola - Deepwater PSC pays 245.1955 million USD of tax on the default project inside government cash flow of 1263.7523, while its column reads 56.2797 percent. The Angola template's corporate income tax is 25 percent and its resource rent tax 50 percent, and no combination of those is what 56.2797 measures. USA - Gulf of Mexico is clearer still: its only tax is corporate income tax at 21 percent, its column reads 34.0485 percent, and a flat royalty of 18.75 percent contributes 503.7989 million USD of the 764.5528 collected. An earlier build labelled this column "effective tax rate", which invited exactly that misreading.

## The mistake

The reading to guard against is treating a low number here as a mild fiscal outcome. On the published comparison built with capex of 20000:

| rank | regime | npv | govTake | government share of net revenue, percent |
| --- | --- | --- | --- | --- |
| 1 | Brazil - Concession | -15354.6816 | 700.1194 | 13.5916 |
| 4 | USA - Gulf of Mexico | -15701.7744 | 1312.7238 | 25.4842 |
| 6 | Angola - Deepwater PSC | -15900.1132 | 1662.7835 | 32.2800 |

Brazil - Concession shows the gentlest government share of net revenue in the whole course, 13.5916 percent, on a project that destroys 15354.6816 million USD of value. It is low because 20000 of capex sits inside the denominator. On that same comparison government take has no value at all, because revenue less opex less capex is negative. A ratio that falls as the project gets worse is not measuring the harshness of the terms. It still orders regimes; it cannot be read as a level.

## What it refuses

The column carries no time value: both totals are undiscounted lifetime sums, while the NPV beside them is discounted. It cannot be compared with a statutory rate, and it cannot be compared with government take, which divides the same government cash flow without the add-back and returns 43.4694 percent where this column returns 33.7901.

## Exercise

State what government share of net revenue divides and which quantity the capex add-back changes. Then explain why Brazil - Concession reads 13.5916 percent where its NPV is -15354.6816 million USD, and say what government take returns on that comparison.
