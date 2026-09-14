# A flat royalty

A flat royalty is one rate applied to gross revenue, in every year, whatever the year did. It is the first deduction in the ledger and the only one that never looks at cost.

{{panel:ec-regime-explorer}}

## The rate on the top line

Royalty is a rate applied to gross revenue, before any cost is deducted. The "USA - Gulf of Mexico" template carries a flat royalty of 18.75 percent.

| year | default grossRevenue | default royalty | implied rate |
| --- | --- | --- | --- |
| 1 | 271.9889 | 50.9979 | 0.187500 |
| 2 | 244.4628 | 45.8368 | 0.187500 |
| 8 | 138.8057 | 26.0261 | 0.187500 |
| 25 | 24.3216 | 4.5603 | 0.187500 |

The same template on ODIDI charges 26.1856 million USD on year 1 revenue of 139.6563 million USD, and 1.2953 million USD on year 25 revenue of 6.9081 million USD. The implied rate column reads 0.187500 in every year of both fields, which is what flat means, and the derived column is the way to prove it rather than assume it.

Over the whole life of the default project the royalty totals 503.7989 million USD against total revenue of 2686.9277 million USD.

## It does not care what the year did

Year 1 of the default project carries capex of 500.0000 million USD, opex of 31.0027 million USD and a contractor net cash flow of -310.0117 million USD. The royalty in that year is 50.9979 million USD, charged in full. Government take for the year is 50.9979 million USD, because there is no profit oil and no tax, and the contractor is 310.0117 million USD down.

That is what off the top means in this model. A loss making year pays royalty at the same rate as the best year in the field.

## The mistake

The careful reader charges royalty against something net, because production sharing contracts train the eye to look for a base after cost. Charging 18.75 percent against revenue less opex in year 1 of the default project gives a royalty smaller than 50.9979 million USD, and every downstream column moves with it: revenue after royalty rises, cost recovery changes, profit oil changes, tax changes. The ledger stays internally consistent and is wrong from the second row down.

The second slip is assuming a low rate is a soft regime. "Angola - Deepwater PSC" carries a flat royalty of 0 percent and collects total royalty of 0.0000 million USD on the default project, while "USA - Gulf of Mexico" collects 503.7989 million USD. The Angola contractor keeps 545.1955 million USD and the Gulf of Mexico contractor keeps 980.9313 million USD. The regime with no royalty at all is the harsher of the two, because its cost recovery limit is 50 percent, its profit split is tiered, and it carries RRT at 50 percent.

## What a flat royalty refuses

It refuses tiers by price, by rate, by cumulative production, by terrain and by water depth. It refuses an allowance and it refuses a holiday. One rate, one base, twenty five years.

## Exercise

Confirm the implied rate for years 1 and 25 of the default project from the two printed columns. Then explain why total royalty of 0.0000 million USD does not make "Angola - Deepwater PSC" the best regime for a contractor.
