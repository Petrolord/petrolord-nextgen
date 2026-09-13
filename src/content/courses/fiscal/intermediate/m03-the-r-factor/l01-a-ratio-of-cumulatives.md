# A ratio of cumulatives

The R factor is cumulative gross revenue divided by cumulative cost: two running totals and one division, producing a number that behaves nothing like the year ratio a reader expects.

{{panel:ec-instrument-explorer}}

## The definition, exactly

Cumulative revenue is the running sum of gross revenue through and including the current year. Cumulative cost is the running sum of capex plus opex through and including the current year. The R factor is the first divided by the second, and it is computed before the profit split is chosen, from totals that already contain the year being priced.

Neither total is net of anything. Royalty is not subtracted from the revenue side, and tax is not added to the cost side, so the R factor is not a measure of the contractor's own position. It is a measure of the project.

## The number on a ledger

The Designer's default project. These are the engine's own columns, and they are identical under "USA - Gulf of Mexico" and under "Nigeria - PIA (2021)", because neither cumulative depends on the regime:

| year | grossRevenue | opex | capex | rFactor |
| --- | --- | --- | --- | --- |
| 1 | 271.9889 | 31.0027 | 500.0000 | 0.512217 |
| 2 | 244.4628 | 28.8480 | 0.0000 | 0.922481 |
| 3 | 219.7286 | 26.9153 | 0.0000 | 1.254640 |
| 4 | 197.5024 | 25.1816 | 0.0000 | 1.525756 |
| 5 | 191.1513 | 23.6264 | 0.0000 | 1.769792 |
| 10 | 120.0964 | 17.9440 | 0.0000 | 2.494773 |
| 21 | 37.2145 | 12.4340 | 0.0000 | 2.877154 |
| 25 | 24.3216 | 11.5851 | 0.0000 | 2.854051 |

That the column does not move when the regime moves is the first thing worth knowing. Change the royalty, the cost recovery limit, the split or the tax, and it is the same. It responds only to production, price and cost.

The second thing is the shape. It climbs steeply, from 0.512217 to 1.769792 in four years, then flattens, reaching 2.494773 by year 10 and 2.877154 by year 21. Then it turns: 2.854051 by year 25. The turn matters enough to have a lesson of its own.

## The mistake

The intuition to unlearn is that the R factor is this year's revenue over this year's cost. Year 2 has gross revenue of 244.4628 million USD against opex of 28.8480 and no capex at all. A year ratio would be enormous. The R factor reads 0.922481, still below 1, because the 500.0000 of year 1 capex is permanently in the denominator.

The practical version of the error is a reader who expects the R factor to cross 1.0 in the first year the project makes money. It crosses when cumulative revenue overtakes cumulative cost, which on this project is year 3 at 1.254640. Payback, the first year cumulative contractor net cash flow is above zero, is also year 3 under "USA - Gulf of Mexico", and the two agreeing on one project encourages the habit of treating them as one measure. They are not. Payback is net of royalty, tax and the split; the R factor is net of nothing.

## What it refuses

The R factor is blind to time value. Revenue in year 1 and revenue in year 25 enter the numerator at face value, so a slow project and a fast one with the same totals share an R factor. It ignores royalty and tax entirely, so it is not payback on the contractor's cash. And it cannot be configured: no input changes what goes into either total.

## Exercise

Name the R factor in years 1, 3 and 21 and the year the column turns down. Then say why year 2 reads 0.922481 when that year spent only 28.8480 and sold 244.4628.
