# Mid-year beside year-end

The screening engine discounts each year's cash flow at the middle of the year. A tool that discounts at year end gives a different NPV on the same rows, and the ratio between the two depends on nothing but the rate.

{{panel:ec-risk-explorer}}

## The two conventions on ISIALA

This engine discounts year index i by (1 + rate/100)^(i + 0.5). At 12 percent the first six mid-year factors are:

| year | ncf | factor |
| --- | --- | --- |
| 2027 | -17.8210 | 1.058301 |
| 2028 | -26.7825 | 1.185297 |
| 2029 | 35.9654 | 1.327532 |
| 2030 | 31.4546 | 1.486836 |
| 2031 | 27.4850 | 1.665256 |
| 2032 | 23.9918 | 1.865087 |

ISIALA's mid-year NPV is 81.0464 million USD. Discounted at year end, the same twenty rows give 76.5817. The ratio of the two is 1.058301, which is (1.12)^0.5, the same value as the first mid-year factor.

## Why the ratio is fixed

Moving from year end to mid-year shortens every exponent by exactly one half, so every discounted term is multiplied by the same factor, the square root of one plus the rate. A sum whose terms all carry one factor is the sum times that factor. The ratio does not depend on the decline, the price, the tax or the timing of capex, only on the rate, and it scales a negative NPV in the same proportion: a losing project looks worse under mid-year by exactly as much as a winning one looks better.

## What the convention does not move

Undiscounted numbers never see it. ISIALA's payback of 3.2746 years and its peak exposure of -44.6035 are the same under both. The IRR survives as well, because multiplying every term by one factor leaves the rate that makes the sum zero where it was: `irr_known_21pct` solves to 21.0000 percent, and `irr_two_roots` reports no single IRR while listing both of its roots, 10.0000 and 20.0000 percent, which are the year-end roots. At a zero rate the factor is one and the conventions agree: the published 10 year base case discounted at 0 percent has an NPV of 908.4827, exactly its final cumulative of 908.4827.

## What the engine refuses

The screening engine has no switch. It will not discount at year end, it takes no valuation date, and it treats the cash of 2027 as arriving at the middle of 2027. Petroleum Economics Studio, the EC1 course's engine, discounts at year end on its own ledger, so an NPV from each engine carries its convention with it whether or not the screen prints it.

## The mistake

The careful mistake is treating the gap as a disagreement between tools. A reader who sets 81.0464 beside a year-end 76.5817 and calls the difference upside has found the convention and nothing else. The opposite mistake is converting between two tools with the ratio. It holds only for identical rows at an identical rate, and two tools almost never build identical rows. Before comparing two NPVs, write down each engine's convention, its rate, and whether the rows underneath are the same rows.

## Exercise

State ISIALA's mid-year NPV, its year-end NPV, their ratio and the expression the ratio equals. Then name two ISIALA metrics that the convention does not change, and explain in one sentence why the IRR does not change either.
