# The summary and its sort

The summary is sorted on exactly one column, and every other column in it is in whatever order that sort happened to produce.

{{panel:ec-comparison-explorer}}

## One key, descending

The rows come back ordered by contractor NPV, largest first, at the comparison's discount rate. So `summary[0]` is the best regime for the contractor and nothing else can be read off a row's position. All six templates on the default project, at a discount rate of 10 percent:

| rank | regime | npv | irr | paybackPeriod | govTake | effectiveTaxRate |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Generic Royalty/Tax | 397.0445 | 44.6574 | 3 | 758.7514 | 33.7901 |
| 2 | USA - Gulf of Mexico | 382.0660 | 40.2125 | 3 | 764.5528 | 34.0485 |
| 3 | Brazil - Concession | 357.8728 | 43.0919 | 3 | 833.3812 | 37.1137 |
| 4 | Angola - Deepwater PSC | 223.7100 | 32.5073 | 4 | 1200.2886 | 53.4534 |
| 5 | Ghana - Deepwater | 172.7531 | 33.2329 | 3 | 1316.6067 | 58.6335 |
| 6 | Nigeria - PIA (2021) | 154.8286 | 28.2129 | 4 | 1339.2784 | 59.6432 |

Read the IRR column down the ranks and it is already out of order: rank 2 returns 40.2125 percent and rank 3 returns 43.0919 percent. The higher NPV and the higher IRR belong to different regimes, and the sort picks one of them to rank by without saying so.

## Where the mirror breaks

On this project the government cash flow column happens to run the other way in step, from 758.7514 million USD at rank 1 to 1339.2784 at rank 6, which invites the conclusion that the sort ranks both sides at once. It does not. On the teaching field ODIDI the same six templates return two adjacent ranks that break it:

| rank | regime | npv | govTake | effectiveTaxRate | paybackPeriod |
| --- | --- | --- | --- | --- | --- |
| 3 | Ghana - Deepwater | -27.4074 | 308.8447 | 36.5071 | 6 |
| 4 | USA - Gulf of Mexico | -37.3123 | 277.6679 | 32.8219 | 7 |

The regime ranked lower for the contractor collects less for the government, 277.6679 million USD against 308.8447, and carries the lower government share of net revenue too, 32.8219 against 36.5071. It also keeps more money: lifetime contractor net cash flow on ODIDI is 148.3166 million USD for USA - Gulf of Mexico against 117.1399 for Ghana - Deepwater. It ranks lower anyway, because the sort key is discounted at 12 percent and the take column is an undiscounted lifetime total, and the larger sum arrives later, in a regime that pays back in year 7 rather than year 6. Payback breaks the mirror in the same way: rank 1 pays back in year 6, rank 2 in year 7 and rank 3 in year 6 again.

## The mistake

The most expensive misreading of this table is to quote the second row as the government's preference. That is not a hypothetical error, it is the one the Insights tab used to make in exactly those words, calling the second-ranked regime the one that maximises government revenue, and it was wrong for the same reason: nothing had sorted by take. The correct answer for ODIDI comes from the take column itself, where Angola - Deepwater PSC collects the most at 316.7898 million USD while sitting at rank 6 with an NPV of -58.1813.

## What it refuses

The sort has no secondary key, so regimes with equal NPV keep the order they were passed in, and the comparison exposes no option to sort on anything else. A rank is also not a recommendation: on ODIDI every one of the six NPVs is negative, from -5.8662 million USD down to -58.1813, so rank 1 is the least bad rather than the good one.

## Exercise

Give the rank order of the six templates on the default project, then give the order the government cash flow column would produce on ODIDI and name the regime that changes position. Say in one sentence what `summary[0]` guarantees.
